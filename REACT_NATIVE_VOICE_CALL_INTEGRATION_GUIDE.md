# 📞 VAVI Voice Call Integration Guide for React Native

> **Document Type:** Production Integration Architecture & Implementation Guide  
> **Target Audience:** React Native Frontend Developers  
> **Technologies:** React Native, `react-native-agora` (v4.x), `socket.io-client` (v4.x), Node.js / Express Backend  

---

## 📑 Table of Contents
1. [System Architecture (Socket vs Agora)](#1-system-architecture)
2. [Complete Call Lifecycle Flow](#2-complete-call-lifecycle-flow)
3. [Backend APIs Reference](#3-backend-apis-reference)
4. [Socket.io Events Reference](#4-socketio-events-reference)
5. [Call Timer & Wallet Auto-Cut Mechanism](#5-call-timer--wallet-auto-cut-mechanism)
6. [React Native Agora RTC Voice Setup](#6-react-native-agora-rtc-voice-setup)
7. [Complete Drop-in React Native Component](#7-complete-drop-in-react-native-component)
8. [Testing & QA Checklist](#8-testing--qa-checklist)

---

## 1. System Architecture

VAVI voice calling works using a **two-layer real-time architecture**:

```
+-------------------------------------------------------------------------------+
|                             REACT NATIVE APP                                  |
|                                                                               |
|   +---------------------------+           +-------------------------------+   |
|   |   Socket.io Signaling     |           |     Agora RTC Audio Engine    |   |
|   |  - Ringing & Calling      |           |  - Encodes mic sound          |   |
|   |  - Accept / Reject Call   |           |  - Streams voice over UDP     |   |
|   |  - Duration & Wallet Cut  |           |  - Plays peer audio stream    |   |
|   +-------------+-------------+           +---------------+---------------+   |
+-----------------|-----------------------------------------|-------------------+
                  |                                         |
                  v                                         v
       +--------------------+                    +---------------------+
       | VAVI Node.js Server|                    |   Agora Global RTC  |
       |  (Signaling Hub)   |                    | (Low-Latency Voice) |
       +--------------------+                    +---------------------+
```

| Technology | Responsibility | What it Does |
| :--- | :--- | :--- |
| **Socket.io** | **Signaling & Business Logic** | Dialing, ringing phone, astrologer accepting, wallet balance tracking, ending call, billing deduction. |
| **Agora RTC** | **Live Voice Streaming** | Real-time audio encoding, decoding, noise cancellation, low-latency audio transmission. |

---

## 2. Complete Call Lifecycle Flow

```
USER (Caller)                           BACKEND                           ASTROLOGER
     |                                     |                                   |
     |-- 1. POST /api/consultation/create->|                                   |
     |   (Checks balance & creates record) |                                   |
     |<- Returns tokens & channelName -----|                                   |
     |                                     |                                   |
     |-- 2. Socket: join_consultation ---->|                                   |
     |                                     |<-- 2. Socket: join_consultation --|
     |                                     |                                   |
     |                                     |---- [Push Notification / Ring] -->|
     |                                     |                                   |
     |                                     |<-- 3. Socket: astrologer_accept --|
     |                                     |    (Starts server timer)          |
     |<- 4. Socket Event: call_started ----|--- 4. Socket Event: call_started ->|
     |                                     |                                   |
     |========== 5. BOTH APPS JOIN AGORA CHANNEL (Live Voice Starts) ==========|
     |                                     |                                   |
     |   [Both apps speak & listen via Agora RTC, Timer counts up/down]        |
     |                                     |                                   |
     |-- 6. Socket: client_end_call ------>| (OR Balance Exhaust Timer Fires)  |
     |                                     | (Deducts wallet balance)          |
     |<- 7. Socket Event: call_ended ------|--- 7. Socket Event: call_ended -->|
     |                                     |                                   |
     |========== 8. BOTH APPS LEAVE AGORA & CLOSE CALL SCREEN =================|
```

---

## 3. Backend APIs Reference

### 3.1 Create Consultation (Initiate Call)
Called by the **User App** when tapping "Call Now":
* **Endpoint:** `POST /api/consultation/create`
* **Headers:** `Authorization: Bearer <user_jwt_token>`
* **Body:**
```json
{
  "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c",
  "type": "call",
  "problem": "Career consultation"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Consultation created successfully.",
  "data": {
    "consultation": {
      "id": "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
      "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
      "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c",
      "consultationType": "call",
      "amount": 30.00,
      "maxDuration": 1800,
      "maxDurationMinutes": 60,
      "status": "waiting",
      "channelName": "call_bf6069a9-c03c-489c-b73e-286b47bf3e5a"
    },
    "agora": {
      "appId": "cd9277ec7c29449d97c062a0faf09c5b",
      "channelName": "call_bf6069a9-c03c-489c-b73e-286b47bf3e5a",
      "token": "007eJxTY... (User Agora Token for UID 1)",
      "uid": 1,
      "astrologerToken": "007eJxTY... (Astrologer Agora Token for UID 2)",
      "astrologerUid": 2,
      "expiresAt": 1788034000
    }
  }
}
```

---

### 3.2 Get Fresh Agora Token (Renewal)
Called if a call runs very long (Agora triggers token renewal warning):
* **Endpoint:** `POST /api/consultation/token/:consultationId`
* **Headers:** `Authorization: Bearer <jwt_token>`
* **Response:**
```json
{
  "success": true,
  "data": {
    "token": "007eJxTY...",
    "channelName": "call_bf6069a9-...",
    "uid": 1,
    "expiresAt": 1788037600
  }
}
```

---

## 4. Socket.io Events Reference

Connect socket to: `http://<SERVER_IP>:5000` with `{ transports: ['websocket'] }`.

### 4.1 Client Emits to Server

| Event Name | Sent By | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_consultation` | User & Astrologer | `{ consultationId, userId, role }` | Joins the dedicated real-time consultation room. |
| `astrologer_accept_call` | Astrologer | `{ consultationId }` | Astrologer accepts ringing call. Starts server timer. |
| `client_end_call` | User or Astrologer | `{ consultationId, reason: "user_hung_up" \| "astrologer_hung_up" }` | Either party hangs up the call. |
| `client_cancel_call` | User | `{ consultationId, reason: "user_cancelled" }` | User cancels while phone is still ringing (0 charge). |

---

### 4.2 Server Emits to Both Apps

#### A. `call_started` (Call accepted - Start Talking!)
```json
{
  "consultationId": "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
  "status": "ongoing",
  "startedAt": "2026-08-30T00:15:00.000Z",
  "maxDurationSeconds": 1800,
  "channelName": "call_bf6069a9-c03c-489c-b73e-286b47bf3e5a"
}
```
> **Action:** Start client timer, join Agora voice channel immediately!

#### B. `call_ended` (Call terminated)
```json
{
  "consultationId": "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
  "reason": "balance_exhausted", 
  "userMessage": "Call ended automatically because your wallet balance was exhausted. Please recharge.",
  "consultation": {
    "id": "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
    "duration": 5,
    "amount": 150.00,
    "status": "completed",
    "endReason": "balance_exhausted",
    "endedAt": "2026-08-30T00:20:00.000Z"
  }
}
```
> **Action:** Leave Agora channel, stop timer, show summary receipt dialog, navigate back.

---

## 5. Call Timer & Wallet Auto-Cut Mechanism

### 5.1 How Max Duration is Calculated
When consultation is created:
$$\text{Max Allowed Minutes} = \left\lfloor \frac{\text{User Wallet Balance}}{\text{Per Minute Call Rate}} \right\rfloor$$
$$\text{Max Duration Seconds} = \text{Max Allowed Minutes} \times 60$$

### 5.2 Server-Side Auto-Disconnect Protection
* The server runs an authoritative timer: `setupConsultationTimer(consultationId, maxDurationSeconds)`.
* Even if the user closes their app or internet drops, the server **guarantees** the user will never be charged more than their wallet balance.
* When `maxDurationSeconds` elapses, the server:
  1. Deducts exact minutes from User wallet.
  2. Credits Astrologer wallet.
  3. Updates database status to `completed`.
  4. Emits `call_ended` with reason `"balance_exhausted"`.

### 5.3 Frontend Timer Best Practices
The frontend should display two timer formats:
1. **Elapsed Time (e.g. `04:15`):** Counts up each second from 00:00.
2. **Remaining Balance Countdown (e.g. `15:45 left`):**
   ```javascript
   const remainingSeconds = Math.max(0, maxDurationSeconds - elapsedSeconds);
   ```
3. **Low Balance Alert:**
   When `remainingSeconds <= 60`, show a yellow alert banner: *"Only 1 minute remaining. Please recharge to avoid disconnection."*

---

## 6. React Native Agora RTC Voice Setup

### 6.1 Install Dependencies
```bash
npm install react-native-agora socket.io-client
```

### 6.2 Android Configuration (`android/app/src/main/AndroidManifest.xml`)
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
</manifest>
```

### 6.3 iOS Configuration (`ios/YourProjectName/Info.plist`)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>VAVI requires microphone access for voice consultations with astrologers.</string>
```

---

## 7. Complete Drop-in React Native Component

Save this file as `src/screens/VoiceCallScreen.js`:

```javascript
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
import { io } from 'socket.io-client';

// CONFIGURATION
const AGORA_APP_ID = 'cd9277ec7c29449d97c062a0faf09c5b'; // Your Agora App ID
const BACKEND_URL = 'http://YOUR_SERVER_IP:5000'; // For live testing: use domain or tailscale URL

export default function VoiceCallScreen({ route, navigation }) {
  const {
    consultationId,
    role = 'user', // 'user' (caller) or 'astrologer' (receiver)
    agoraToken,
    channelName,
    userId,
    astrologerName = 'Astrologer',
    maxDurationSeconds = 1800,
  } = route.params;

  // Component State
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [peerConnected, setPeerConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  // References
  const agoraEngine = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  // Request Android Microphone Permission
  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'VAVI needs microphone access for voice consultation calls.',
          buttonPositive: 'Allow',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    initCall();

    return () => {
      cleanup();
    };
  }, []);

  const initCall = async () => {
    const hasPerm = await checkPermissions();
    if (!hasPerm) {
      Alert.alert('Permission Denied', 'Microphone permission is required.');
      navigation.goBack();
      return;
    }

    // 1. Initialize Socket.io Connection
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('⚡ Socket connected:', socketRef.current.id);
      // Join consultation room
      socketRef.current.emit('join_consultation', {
        consultationId,
        userId,
        role,
      });
    });

    // Listen for Call Started event
    socketRef.current.on('call_started', (data) => {
      console.log('📞 Event: call_started', data);
      setCallStatus('Ongoing Call');
      setIsCallActive(true);
      startTimer();
    });

    // Listen for Call Ended event (from either party or server balance auto-disconnect)
    socketRef.current.on('call_ended', (data) => {
      console.log('🔴 Event: call_ended', data);
      const msg = data.userMessage || 'Call ended successfully.';
      const mins = data.consultation?.duration || 1;
      const amt = data.consultation?.amount || 0;

      Alert.alert(
        'Call Summary',
        `${msg}\n\n⏱️ Duration: ${mins} min(s)\n💰 Total Deducted: ₹${amt}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      cleanup();
    });

    socketRef.current.on('call_error', (data) => {
      Alert.alert('Call Error', data.message);
    });

    // 2. Initialize Agora RTC Audio Engine
    try {
      agoraEngine.current = createAgoraRtcEngine();
      agoraEngine.current.initialize({ appId: AGORA_APP_ID });

      agoraEngine.current.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication
      );
      agoraEngine.current.enableAudio();
      agoraEngine.current.setEnableSpeakerphone(true);

      // Register Agora Event Handlers
      agoraEngine.current.registerEventHandler({
        onUserJoined: (connection, uid) => {
          console.log(`👤 Remote peer joined voice call: UID ${uid}`);
          setPeerConnected(true);
          setCallStatus('Connected (Voice Streaming)');
        },
        onUserOffline: (connection, uid) => {
          console.log(`Peer offline: UID ${uid}`);
          setPeerConnected(false);
          setCallStatus('Peer Reconnecting...');
        },
        onTokenPrivilegeWillExpire: (connection, token) => {
          console.log('⚠️ Agora token expiring soon. Refreshing...');
          // Optional: Fetch fresh token from POST /api/consultation/token/:id
        },
      });

      // Join Channel (User = UID 1, Astrologer = UID 2)
      const myUid = role === 'user' ? 1 : 2;
      agoraEngine.current.joinChannel(agoraToken, channelName, myUid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      setCallStatus(role === 'astrologer' ? 'Waiting for Client...' : 'Ringing...');
    } catch (err) {
      console.error('Agora RTC Init Error:', err);
    }
  };

  // Call Timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Astrologer Accept Call Action
  const handleAcceptCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('astrologer_accept_call', { consultationId });
    }
  };

  // Mute / Unmute Microphone
  const toggleMute = () => {
    if (agoraEngine.current) {
      agoraEngine.current.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Speakerphone Toggle
  const toggleSpeaker = () => {
    if (agoraEngine.current) {
      agoraEngine.current.setEnableSpeakerphone(!isSpeaker);
      setIsSpeaker(!isSpeaker);
    }
  };

  // End Call Action
  const handleEndCall = () => {
    if (socketRef.current) {
      const reason = role === 'astrologer' ? 'astrologer_hung_up' : 'user_hung_up';
      socketRef.current.emit('client_end_call', {
        consultationId,
        reason,
      });
    }
  };

  // Cleanup resources
  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (agoraEngine.current) {
      agoraEngine.current.leaveChannel();
      agoraEngine.current.release();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const remainingSeconds = Math.max(0, maxDurationSeconds - elapsedSeconds);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.callerName}>{astrologerName}</Text>
        <Text style={styles.callType}>VAVI High Definition Voice Consultation</Text>
        <Text style={styles.statusBadge}>{callStatus}</Text>
      </View>

      {/* Timer & Balance Indicator */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
        <Text style={styles.remainingText}>
          ⏳ Max Balance Time Remaining: {formatTimer(remainingSeconds)}
        </Text>
        {remainingSeconds <= 60 && isCallActive && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Less than 1 minute remaining! Call will auto-end when balance is exhausted.
            </Text>
          </View>
        )}
      </View>

      {/* Action Controls */}
      <View style={styles.controlsContainer}>
        {/* If Astrologer and call is not active yet, show Accept button */}
        {role === 'astrologer' && !isCallActive && (
          <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptCall}>
            <Text style={styles.acceptButtonText}>📞 Accept Consultation</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsRow}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[styles.circleButton, isMuted && styles.activeButton]}
            onPress={toggleMute}
          >
            <Text style={styles.buttonIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
            <Text style={styles.buttonLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity
            style={[styles.circleButton, isSpeaker && styles.activeButton]}
            onPress={toggleSpeaker}
          >
            <Text style={styles.buttonIcon}>{isSpeaker ? '🔊' : '📱'}</Text>
            <Text style={styles.buttonLabel}>{isSpeaker ? 'Speaker' : 'Earpiece'}</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Text style={styles.buttonIcon}>🔴</Text>
            <Text style={styles.endCallLabel}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  callerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  callType: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 14,
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38bdf8',
    backgroundColor: '#1e293b',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ade80',
    letterSpacing: 2,
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  warningBanner: {
    backgroundColor: '#7c2d12',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    marginHorizontal: 15,
  },
  warningText: {
    color: '#fdba74',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 25,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeButton: {
    backgroundColor: '#d97706',
    borderColor: '#f59e0b',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  buttonLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  endCallButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f87171',
  },
  endCallLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
```

---

## 8. Testing & QA Checklist

Before shipping to production, verify each of these scenarios:

| # | Test Scenario | Expected Result | Pass/Fail |
| :- | :--- | :--- | :--- |
| 1 | **Permission Handling** | App prompts for microphone on first call. If denied, shows graceful error. | [ ] |
| 2 | **Normal Call Flow** | User dials $\rightarrow$ Astrologer accepts $\rightarrow$ Audio connects $\rightarrow$ Both hear each other clearly. | [ ] |
| 3 | **Caller Hangs Up** | User taps "End Call" $\rightarrow$ Astrologer receives `call_ended` event $\rightarrow$ Call summary popup shows duration and deduction. | [ ] |
| 4 | **Astrologer Hangs Up** | Astrologer taps "End Call" $\rightarrow$ User receives `call_ended` event $\rightarrow$ Call disconnects cleanly. | [ ] |
| 5 | **Balance Auto-Disconnect** | Start call with only 1 minute balance $\rightarrow$ Let timer run for 60s $\rightarrow$ Server auto-disconnects with reason `balance_exhausted`. | [ ] |
| 6 | **Audio Mute/Speaker** | Toggle Mute $\rightarrow$ Peer stops hearing. Toggle Speaker $\rightarrow$ Audio switches from earpiece to loudspeaker. | [ ] |
| 7 | **Network Reconnection** | Put phone on Airplane Mode for 5 seconds $\rightarrow$ Turn off $\rightarrow$ Agora RTC auto-resumes audio streaming. | [ ] |
