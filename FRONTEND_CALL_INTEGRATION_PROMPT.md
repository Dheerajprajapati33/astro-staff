# 🚀 React Native Voice Calling Implementation Spec & AI Prompt

> **Instructions for Developer / AI (ChatGPT / Claude):**  
> You are implementing the 1:1 Voice Calling feature in the VAVI React Native application.  
> Use the exact APIs, Socket events, Agora App ID, and architecture specifications defined in this document. Do not invent custom signaling protocols.

---

## 1. Quick Config & Credentials

| Key | Value | Notes |
| :--- | :--- | :--- |
| **Agora App ID** | `cd9277ec7c29449d97c062a0faf09c5b` | ⚠️ **No Certificate needed in frontend!** Backend generates secured tokens. |
| **User Agora UID** | `1` *(Integer number, NOT string)* | Used when calling as client user. |
| **Astrologer Agora UID** | `2` *(Integer number, NOT string)* | Used when attending call as astrologer. |
| **Channel Profile** | `ChannelProfileCommunication` | Voice call mode. |
| **Client Role** | `ClientRoleBroadcaster` | Required so both parties can speak and listen. |
| **Socket Transport** | `['websocket']` | For reliable real-time signaling. |

---

## 2. Dependencies & Native Permissions

### 2.1 Install NPM Packages
```bash
npm install react-native-agora socket.io-client
```
*For iOS:*
```bash
cd ios && pod install && cd ..
```

---

### 2.2 Android Permissions (`android/app/src/main/AndroidManifest.xml`)
Inside `<manifest>` tag:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH" />
```

---

### 2.3 iOS Permissions (`ios/Runner/Info.plist` or `ios/YourApp/Info.plist`)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access to connect your voice call with the astrologer.</string>
```

---

## 3. Data Contracts (APIs & Sockets)

### 3.1 Step 1: User Initiates Call (API)
```http
POST /api/consultation/create
Authorization: Bearer <user_jwt_token>
Content-Type: application/json

{
  "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c",
  "type": "call",
  "problem": "General consultation"
}
```

#### API Response:
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
      "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
      "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c",
      "consultationType": "call",
      "amount": 30.00,
      "maxDuration": 1800,
      "status": "waiting",
      "channelName": "call_bf6069a9-c03c-489c-b73e-286b47bf3e5a"
    },
    "agora": {
      "appId": "cd9277ec7c29449d97c062a0faf09c5b",
      "channelName": "call_bf6069a9-c03c-489c-b73e-286b47bf3e5a",
      "token": "007eJxTY... (User Agora Token for UID 1)",
      "uid": 1,
      "astrologerToken": "007eJxTY... (Astrologer Token for UID 2)",
      "astrologerUid": 2
    }
  }
}
```

---

### 3.2 Step 2: Realtime Signaling (Socket.io)

Connect to Socket Server:
```javascript
import { io } from 'socket.io-client';
const socket = io("http://YOUR_SERVER_IP:5000", { transports: ['websocket'] });
```

#### Events to EMIT (Client -> Server):
```javascript
// 1. Join consultation room (Both User and Astrologer must emit this upon opening Call Screen)
socket.emit("join_consultation", {
  consultationId: "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
  userId: myUserId,
  role: "user" // or "astrologer"
});

// 2. Astrologer accepts ringing call
socket.emit("astrologer_accept_call", {
  consultationId: "bf6069a9-c03c-489c-b73e-286b47bf3e5a"
});

// 3. User or Astrologer hangs up
socket.emit("client_end_call", {
  consultationId: "bf6069a9-c03c-489c-b73e-286b47bf3e5a",
  reason: myRole === 'user' ? 'user_hung_up' : 'astrologer_hung_up'
});
```

#### Events to LISTEN (Server -> Client):
```javascript
// 1. When call starts (Both receive this - start timer & join Agora now!)
socket.on("call_started", (data) => {
  // data: { consultationId, status: "ongoing", startedAt, maxDurationSeconds, channelName }
  startCallTimer();
  joinAgoraVoiceChannel();
});

// 2. When call ends (Triggered by user hangup, astrologer hangup, OR server balance exhaustion)
socket.on("call_ended", (data) => {
  // data: { consultationId, reason, userMessage, consultation: { duration, amount, ... } }
  stopCallTimer();
  leaveAgoraVoiceChannel();
  showCallSummaryModal(data);
});
```

---

## 4. Complete Drop-in Call Screen Component

Create `src/screens/CallScreen.js` (or `.tsx`) and copy-paste this code:

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
const AGORA_APP_ID = 'cd9277ec7c29449d97c062a0faf09c5b';
const BACKEND_URL = 'http://YOUR_SERVER_IP:5000'; // Replace with your backend URL or Tailscale domain

export default function CallScreen({ route, navigation }) {
  const {
    consultationId,
    role = 'user', // 'user' (caller) or 'astrologer' (receiver)
    agoraToken,
    channelName,
    userId,
    userName = 'Astrologer',
    maxDurationSeconds = 1800,
  } = route.params;

  const [callStatus, setCallStatus] = useState('Connecting...');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isCallOngoing, setIsCallOngoing] = useState(false);

  const agoraEngine = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  // 1. Android Runtime Permission Check
  const checkMicPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Microphone permission is required for voice calling.',
          buttonPositive: 'Allow',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    setupCall();

    return () => {
      cleanup();
    };
  }, []);

  const setupCall = async () => {
    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required.');
      navigation.goBack();
      return;
    }

    // A. Setup Socket.io
    socketRef.current = io(BACKEND_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('⚡ Socket connected:', socketRef.current.id);
      socketRef.current.emit('join_consultation', {
        consultationId,
        userId,
        role,
      });
    });

    socketRef.current.on('call_started', (data) => {
      console.log('📞 Call started event:', data);
      setIsCallOngoing(true);
      setCallStatus('Ongoing Call');
      startTimer();
      joinAgora();
    });

    socketRef.current.on('call_ended', (data) => {
      console.log('🔴 Call ended event:', data);
      cleanup();
      const mins = data.consultation?.duration || 1;
      const amount = data.consultation?.amount || 0;
      Alert.alert(
        'Call Ended',
        `${data.userMessage || 'Call disconnected.'}\n\n⏱️ Duration: ${mins} min\n💰 Deducted: ₹${amount}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    });

    // If caller, join Agora right away while ringing
    if (role === 'user') {
      joinAgora();
    }
  };

  // B. Setup Agora RTC Engine
  const joinAgora = async () => {
    try {
      if (!agoraEngine.current) {
        agoraEngine.current = createAgoraRtcEngine();
        agoraEngine.current.initialize({ appId: AGORA_APP_ID });

        agoraEngine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
        agoraEngine.current.enableAudio();
        agoraEngine.current.enableLocalAudio(true);
        agoraEngine.current.muteLocalAudioStream(false);
        agoraEngine.current.setEnableSpeakerphone(true);

        agoraEngine.current.registerEventHandler({
          onJoinChannelSuccess: (connection, elapsed) => {
            console.log('✅ Joined Agora Channel:', connection.channelId);
            if (role === 'user') setCallStatus('Ringing...');
          },
          onUserJoined: (connection, uid) => {
            console.log('👤 Peer connected to voice:', uid);
            setCallStatus('Talking (Voice Active)');
          },
          onUserOffline: (connection, uid) => {
            console.log('Peer disconnected:', uid);
            setCallStatus('Peer Reconnecting...');
          },
          onError: (err, msg) => {
            console.error('❌ Agora Error:', err, msg);
          },
        });
      }

      // CRITICAL: UID must be Integer number: 1 for user, 2 for astrologer!
      const myUid = role === 'user' ? 1 : 2;

      agoraEngine.current.joinChannel(agoraToken, channelName, myUid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (err) {
      console.error('Agora join error:', err);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleAccept = () => {
    if (socketRef.current) {
      socketRef.current.emit('astrologer_accept_call', { consultationId });
    }
  };

  const handleEndCall = () => {
    if (socketRef.current) {
      const reason = role === 'astrologer' ? 'astrologer_hung_up' : 'user_hung_up';
      socketRef.current.emit('client_end_call', {
        consultationId,
        reason,
      });
    }
    cleanup();
    navigation.goBack();
  };

  const toggleMute = () => {
    if (agoraEngine.current) {
      agoraEngine.current.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    if (agoraEngine.current) {
      agoraEngine.current.setEnableSpeakerphone(!isSpeaker);
      setIsSpeaker(!isSpeaker);
    }
  };

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (agoraEngine.current) {
      agoraEngine.current.leaveChannel();
      agoraEngine.current.release();
      agoraEngine.current = null;
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

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.callerName}>{userName}</Text>
        <Text style={styles.statusBadge}>{callStatus}</Text>
      </View>

      {/* Call Timer Display */}
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
        <Text style={styles.remainingText}>
          ⏳ Wallet Time Left: {formatTimer(remainingSeconds)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {/* Astrologer Accept Button (Only shown to astrologer before call starts) */}
        {role === 'astrologer' && !isCallOngoing && (
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>📞 Accept Consultation</Text>
          </TouchableOpacity>
        )}

        <View style={styles.btnRow}>
          {/* Mute Button */}
          <TouchableOpacity style={[styles.btn, isMuted && styles.btnActive]} onPress={toggleMute}>
            <Text style={styles.btnIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
            <Text style={styles.btnText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity style={[styles.btn, isSpeaker && styles.btnActive]} onPress={toggleSpeaker}>
            <Text style={styles.btnIcon}>{isSpeaker ? '🔊' : '📱'}</Text>
            <Text style={styles.btnText}>{isSpeaker ? 'Speaker' : 'Ear'}</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endBtn} onPress={handleEndCall}>
            <Text style={styles.btnIcon}>🔴</Text>
            <Text style={styles.endText}>End</Text>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  statusBadge: {
    fontSize: 13,
    color: '#38bdf8',
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  timerBox: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#4ade80',
    letterSpacing: 2,
  },
  remainingText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  controls: {
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginBottom: 25,
  },
  acceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },
  btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnActive: {
    backgroundColor: '#d97706',
    borderColor: '#f59e0b',
  },
  btnIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  btnText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
  endBtn: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  endText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
```

---

## 5. Critical Gotchas (Do Not Skip!)

1. **Numeric UID Requirement:**
   * User UID must be the integer number **`1`**.
   * Astrologer UID must be the integer number **`2`**.
   * *Never pass user UUID string (e.g. `"2bab9b20-..."`) as Agora UID — token will be rejected!*
2. **Microphone Permission:**
   * Must request runtime permission (`PermissionsAndroid.request`) before `joinChannel()`.
3. **No Certificate Needed in Frontend:**
   * Only `appId` (`cd9277ec7c29449d97c062a0faf09c5b`) is needed. The token already contains encrypted credentials signed by the backend.
4. **Auto Disconnect on Zero Balance:**
   * The backend terminates the call automatically if the wallet balance runs out. The client only needs to handle the `call_ended` socket event.
