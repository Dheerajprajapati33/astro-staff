# 📘 Frontend Socket.IO Integration Guide & Best Practices

> **Target Audience:** Frontend Team (React / Next.js / React Native / Flutter Developers)  
> **Backend Status:** Ready & Optimized (Single active socket enforcement enabled)  

---

> [!CAUTION]
> ## 🛑 STRICT DIRECTIVE: STOP API POLLING IMMEDIATELY
> **DO NOT call the `consultation history` or `waiting status` API repeatedly inside `setInterval`, `useFocusEffect`, or polling loops!**
>
> - ❌ **WHAT TO REMOVE (POLLING):** Currently, the frontend is repeatedly calling `GET /api/v1/consultations/history` every 2–3 seconds to detect if a call was booked, accepted, or cancelled. **Delete this polling logic immediately.** It causes severe server load, drains phone battery, and creates a laggy 2–5 second delay.
> - ✅ **WHAT TO USE (REAL-TIME SOCKETS):** Everything is now **100% event-driven via Socket.IO**:
>   - **Astrologer App:** As soon as a user books, the astrologer receives `socket.on("incoming_consultation_request")` in **10ms** to display the Accept/Decline modal.
>   - **User App:** As soon as the astrologer taps Accept, the user receives `socket.on("call_started")` in **10ms** to open the Agora call screen.
>   - **Decline/Cancel:** Both apps receive `socket.on("call_cancelled")` or `socket.on("chat_cancelled")` instantly.
>
> **There is ZERO need for any recurring API call.**

---

## 🛑 1. The Issues We Identified in Frontend

### Issue A: API Polling Loop (To be removed)
The frontend was continuously polling `consultation history` API in a loop instead of listening to real-time socket events.

### Issue B: Spawning 20–25 Duplicate Socket Connections
In the previous implementation, **20 to 25 socket connections** were being spawned for the **same user** within a few seconds.

#### Why this happens:
1. **Component Re-renders:** Calling `io("...")` directly inside React/Flutter components without a Singleton instance causes a new WebSocket handshake on every render or route change.
2. **Missing Cleanup:** Missing `socket.off()` or keeping dead sockets connected when leaving a screen.
3. **Infinite Reconnect Storm:** When the backend closes an old duplicate socket, frontend's auto-reconnect was immediately creating a new one, causing an endless fight (Connect ➔ Disconnect ➔ Reconnect).


---

## ⚡ 2. Backend Rules Now Active

1. **Strict 1 User = 1 Active Socket:** If User A connects from Tab 2, Tab 1's socket is immediately notified and closed.
2. **Event `force_disconnect`:** When an old duplicate socket is closed, backend emits:
   ```json
   {
     "reason": "Another active session was established. Only 1 connection per user is permitted."
   }
   ```
   **Frontend MUST NOT auto-reconnect when this event is received.**

---

## 🛠️ 3. Implementation Guide for React / React Native / Next.js

### Step 1: Create a Centralized Socket Singleton (`services/socket.js`)

Do **NOT** call `io()` in your components. Create this single file:

```javascript
// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

let socketInstance = null;

/**
 * Initialize or get the single shared Socket.IO instance
 * @param {string} token - User's JWT authentication token
 */
export const getSocket = (token) => {
  // Return existing connected socket if already initialized
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (!token) {
    console.warn("⚠️ [Socket] Cannot initialize socket without JWT auth token.");
    return null;
  }

  // Create single socket instance
  socketInstance = io(SOCKET_SERVER_URL, {
    auth: { token },
    // ⚡ CRITICAL: Use pure websocket transport (avoid polling fallback overhead)
    transports: ["websocket"],
    // Reasonable reconnection settings
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  socketInstance.on("connect", () => {
    console.log("⚡ [Socket] Connected successfully with ID:", socketInstance.id);
  });

  socketInstance.on("connect_error", (error) => {
    console.error("❌ [Socket] Connection error:", error.message);
  });

  // 🛑 CRITICAL: Handle server force-disconnect (prevents infinite reconnect loop)
  socketInstance.on("force_disconnect", (data) => {
    console.warn("⚠️ [Socket] Disconnected by server:", data?.reason);
    // Explicitly disconnect so client doesn't fight the server in an auto-reconnect loop
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔌 [Socket] Disconnected. Reason:", reason);
    if (reason === "io server disconnect") {
      // Server manually closed connection - do not auto reconnect
      socketInstance = null;
    }
  });

  return socketInstance;
};

/**
 * Cleanly close and destroy the socket on user logout
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
    console.log("🔒 [Socket] Cleanly disconnected on user logout.");
  }
};
```

---

### Step 2: How to Use Socket in Components (React Example)

❌ **WRONG (Never do this):**
```javascript
// ❌ DO NOT DO THIS:
useEffect(() => {
  const socket = io("http://localhost:5000"); // Creates duplicate connection every time!
}, []);
```

✅ **CORRECT (Always do this):**
```javascript
// src/components/ConsultationScreen.jsx
import React, { useEffect } from "react";
import { getSocket } from "../services/socket";

export default function ConsultationScreen({ userToken, consultationId }) {
  useEffect(() => {
    const socket = getSocket(userToken);
    if (!socket) return;

    // 1. Join consultation room
    socket.emit("join_consultation", { consultationId });

    // 2. Define event handlers
    const handleCallStarted = (data) => {
      console.log("📞 Call started:", data);
    };

    const handleCallEnded = (data) => {
      console.log("📴 Call ended:", data);
    };

    // 3. Attach listeners
    socket.on("call_started", handleCallStarted);
    socket.on("call_ended", handleCallEnded);

    // 4. ⚠️ CRITICAL CLEANUP: Remove listeners when leaving the screen
    return () => {
      socket.off("call_started", handleCallStarted);
      socket.off("call_ended", handleCallEnded);
      // NOTE: Do NOT call socket.disconnect() here if other components are using it!
      // Only remove this screen's event listeners.
    };
  }, [userToken, consultationId]);

  return <div>Active Consultation Screen</div>;
}
```

---

## 📱 4. Implementation Guide for Flutter (If using Flutter)

If your app is built using Flutter (`socket_io_client` package):

```dart
// lib/services/socket_service.dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? socket;

  void initSocket(String token) {
    if (socket != null && socket!.connected) return;

    socket = IO.io(
      'http://YOUR_SERVER_URL:5000',
      IO.OptionBuilder()
          .setTransports(['websocket']) // Direct websocket
          .enableAutoConnect()
          .setAuth({'token': token})
          .setReconnectionDelay(2000)
          .setReconnectionAttempts(5)
          .build(),
    );

    socket!.onConnect((_) {
      print('⚡ Socket connected: ${socket!.id}');
    });

    // 🛑 Server duplicate disconnect handler
    socket!.on('force_disconnect', (data) {
      print('⚠️ Disconnected by server: $data');
      socket!.disconnect();
    });
  }

  void disconnect() {
    socket?.disconnect();
    socket = null;
  }
}
```

---

## 📋 Checklist for Frontend Developers

- [ ] Replaced all multiple `io(...)` calls across different files with a single `getSocket()` helper.
- [ ] Added `transports: ["websocket"]` to connection options (prevents HTTP long-polling upgrade storms).
- [ ] Added listener for `force_disconnect` that calls `socket.disconnect()`.
- [ ] Every `useEffect` that attaches `socket.on(...)` removes it via `socket.off(...)` in its cleanup return function.
- [ ] Called `disconnectSocket()` on user logout.

---

## 🚀 5. Real-Time Incoming Consultation Flow (Call & Chat) - No Polling!

### Event Flow:

```
[User App]                           [Backend Server]                      [Astrologer App]
    |                                       |                                      |
    |-- POST /consultations/create -------->|                                      |
    |                                       |-- emit: incoming_consultation_request-->| (Instant popup)
    |                                       |                                      |
    |                                       |                                      |-- [ACCEPT BUTTON TAP]
    |                                       |<-- emit: astrologer_accept_call/ ----|
    |                                       |          accept_chat_session         |
    |<-- emit: call_started / chat_started -|------------------------------------->|
    |    (Both navigate to call/chat)       |                                      |
```

### 1. Event: `incoming_consultation_request` (Backend -> Astrologer)
Automatically received on `socket.on("incoming_consultation_request")`:
```json
{
  "consultationId": "uuid-12345",
  "type": "call", // or "chat"
  "status": "waiting",
  "user": {
    "id": "uuid-user-id",
    "name": "Rahul Sharma",
    "avatar": "https://...",
    "gender": "male",
    "dateOfBirth": "1995-08-15"
  },
  "problem": "Career & Marriage guidance",
  "amount": 25.0,
  "maxDuration": 1200,
  "maxDurationMinutes": 20,
  "channelName": "vavi_call_uuid",
  "agoraToken": "...",
  "agoraUid": 2
}
```

### 2. Astrologer Actions:
- **Accept Call:**
  `socket.emit("join_consultation", { consultationId });`
  `socket.emit("astrologer_accept_call", { consultationId });`
- **Decline Call:**
  `socket.emit("astrologer_decline_call", { consultationId, reason: "astrologer_declined" });`
- **Accept Chat:**
  `socket.emit("join_chat_session", { consultationId });`
  `socket.emit("accept_chat_session", { consultationId });`
- **Decline Chat:**
  `socket.emit("astrologer_decline_chat", { consultationId, reason: "astrologer_declined" });`

### 3. User Actions (During Waiting):
- **Cancel Call:**
  `socket.emit("client_cancel_call", { consultationId, reason: "user_cancelled" });`
- **Cancel Chat:**
  `socket.emit("client_cancel_chat", { consultationId, reason: "user_cancelled" });`

### 4. Cancellation Listener (Both User & Astrologer):
- For Call: `socket.on("call_cancelled", ({ consultationId, reason, message }) => { ... })`
- For Chat: `socket.on("chat_cancelled", ({ consultationId, reason, message }) => { ... })`

### 5. Complete Ready-to-Use React Native Component:
```javascript
// src/components/IncomingConsultationModal.jsx
import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from "react-native";
import { getSocket } from "../services/socket";

export default function IncomingConsultationModal({ navigation, userToken }) {
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    const socket = getSocket(userToken);
    if (!socket) return;

    const handleIncoming = (data) => {
      setIncoming(data);
    };

    const handleCancelled = (data) => {
      if (incoming && incoming.consultationId === data.consultationId) {
        setIncoming(null);
      }
    };

    socket.on("incoming_consultation_request", handleIncoming);
    socket.on("call_cancelled", handleCancelled);
    socket.on("chat_cancelled", handleCancelled);

    return () => {
      socket.off("incoming_consultation_request", handleIncoming);
      socket.off("call_cancelled", handleCancelled);
      socket.off("chat_cancelled", handleCancelled);
    };
  }, [userToken, incoming]);

  const handleAccept = () => {
    if (!incoming) return;
    const socket = getSocket();
    const { consultationId, type } = incoming;

    if (type === "call") {
      socket.emit("join_consultation", { consultationId });
      socket.emit("astrologer_accept_call", { consultationId });
      navigation.navigate("CallScreen", {
        consultationId,
        channelName: incoming.channelName,
        token: incoming.agoraToken,
        uid: incoming.agoraUid,
      });
    } else {
      socket.emit("join_chat_session", { consultationId });
      socket.emit("accept_chat_session", { consultationId });
      navigation.navigate("ChatScreen", { consultationId });
    }

    setIncoming(null);
  };

  const handleDecline = () => {
    if (!incoming) return;
    const socket = getSocket();
    const { consultationId, type } = incoming;

    if (type === "call") {
      socket.emit("astrologer_decline_call", {
        consultationId,
        reason: "astrologer_declined",
      });
    } else {
      socket.emit("astrologer_decline_chat", {
        consultationId,
        reason: "astrologer_declined",
      });
    }

    setIncoming(null);
  };

  if (!incoming) return null;

  return (
    <Modal visible={!!incoming} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {incoming.type === "call" ? "📞 Incoming Call Request" : "💬 Incoming Chat Request"}
          </Text>
          <Image
            source={{ uri: incoming.user?.avatar || "https://via.placeholder.com/80" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{incoming.user?.name || "Client"}</Text>
          {incoming.problem ? <Text style={styles.problem}>"{incoming.problem}"</Text> : null}
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.decline]} onPress={handleDecline}>
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.accept]} onPress={handleAccept}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  card: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center" },
  title: { fontSize: 13, fontWeight: "700", color: "#ff6b00", marginBottom: 12, textTransform: "uppercase" },
  avatar: { width: 75, height: 75, borderRadius: 38, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 6 },
  problem: { fontSize: 12, color: "#666", fontStyle: "italic", textAlign: "center", marginBottom: 20 },
  btnRow: { flexDirection: "row", width: "100%", gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  decline: { backgroundColor: "#ef4444" },
  accept: { backgroundColor: "#22c55e" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
```

---

### 6. User App Side: Calling / Connecting Screen Component
Jab user consultation book karta hai, toh woh is screen par rehta hai jab tak Astrologer accept ya decline na kare:

```javascript
// src/screens/CallingWaitScreen.jsx (USER APP)
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { getSocket } from "../services/socket";

export default function CallingWaitScreen({ navigation, route }) {
  const { consultation, agoraData, userToken } = route.params;
  const [dots, setDots] = useState("");

  useEffect(() => {
    const socket = getSocket(userToken);
    if (!socket) return;

    // 1. Join consultation room (if call)
    if (consultation.consultationType === "call") {
      socket.emit("join_consultation", { consultationId: consultation.id });
    } else {
      socket.emit("join_chat_session", { consultationId: consultation.id });
    }

    // 2. Astrologer Accepts -> Navigate to Call / Chat Screen
    const handleStarted = (data) => {
      console.log("🟢 Astrologer accepted:", data);
      if (consultation.consultationType === "call") {
        navigation.replace("CallScreen", {
          consultationId: consultation.id,
          channelName: data.channelName || consultation.channelName,
          token: agoraData?.token,
          uid: 1, // User is UID 1
          maxDuration: data.maxDurationSeconds,
        });
      } else {
        navigation.replace("ChatScreen", {
          consultationId: consultation.id,
          maxDuration: data.maxDurationSeconds,
        });
      }
    };

    // 3. Astrologer Declines or Call Cancelled
    const handleCancelled = (data) => {
      console.log("🛑 Call cancelled / declined:", data);
      Alert.alert(
        "Consultation Cancelled",
        data.message || "Astrologer is currently unavailable. Please try another astrologer.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    };

    socket.on("call_started", handleStarted);
    socket.on("chat_started", handleStarted);
    socket.on("call_cancelled", handleCancelled);
    socket.on("chat_cancelled", handleCancelled);

    // 4. Cleanup on unmount
    return () => {
      socket.off("call_started", handleStarted);
      socket.off("chat_started", handleStarted);
      socket.off("call_cancelled", handleCancelled);
      socket.off("chat_cancelled", handleCancelled);
    };
  }, [consultation.id, userToken]);

  // ❌ User voluntarily cancels while ringing
  const handleCancelCall = () => {
    const socket = getSocket();
    if (socket) {
      if (consultation.consultationType === "call") {
        socket.emit("client_cancel_call", {
          consultationId: consultation.id,
          reason: "user_cancelled",
        });
      } else {
        socket.emit("client_cancel_chat", {
          consultationId: consultation.id,
          reason: "user_cancelled",
        });
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ff6b00" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Connecting to Astrologer{dots}</Text>
      <Text style={styles.subtitle}>Please wait while the astrologer accepts your request...</Text>

      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelCall}>
        <Text style={styles.cancelText}>Cancel Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", color: "#222", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 30 },
  cancelBtn: { paddingVertical: 14, paddingHorizontal: 32, backgroundColor: "#ef4444", borderRadius: 12 },
  cancelText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
```



