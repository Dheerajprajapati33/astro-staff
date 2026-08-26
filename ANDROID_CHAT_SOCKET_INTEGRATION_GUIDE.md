# 📱 VAVI 1:1 Chat Consultation - Android Integration Guide

This guide provides complete, step-by-step instructions for Android developers (React Native / Flutter / Native Android Kotlin / Java) to integrate realtime 1:1 chat consultations with the VAVI backend.

---

## 📑 Table of Contents
1. [Overview & Flow](#1-overview--lifecycle-flow)
2. [Socket Connection & Handshake Authentication](#2-socket-connection--handshake-authentication)
3. [Step-by-Step Events Reference](#3-step-by-step-events-reference)
   - [Step 1: Join Chat Session](#step-1-join-chat-session-join_chat_session)
   - [Step 2: Astrologer Accepts Chat](#step-2-astrologer-accepts-chat-accept_chat_session)
   - [Step 3: Realtime Messaging](#step-3-realtime-messaging-send_chat_message)
   - [Step 4: Realtime Typing Indicator](#step-4-realtime-typing-indicator-typing_indicator)
   - [Step 5: End Chat Session & Billing](#step-5-end-chat-session--billing-end_chat_session)
   - [Step 6: Leave Session](#step-6-leave-session-leave_chat_session)
4. [Complete Ready-to-Use React Native Service](#4-complete-ready-to-use-react-native-service)
5. [Complete Native Android (Kotlin) Implementation](#5-native-android-kotlin-implementation)
6. [Summary of All Socket Events](#6-summary-table-of-all-events)

---

## 1. Overview & Lifecycle Flow

```
[User App]                             [Backend Socket Server]                     [Astrologer App]
    |                                             |                                       |
    |---- 1. POST /api/consultation/create ------>|                                       |
    |<--- Returns consultationId & maxDuration ---|                                       |
    |                                             |                                       |
    |==== 2. Connect Socket with JWT Auth =======>|                                       |
    |                                             |<==== 2. Connect Socket with JWT Auth =|
    |                                             |                                       |
    |---- 3. emit("join_chat_session") ---------->|                                       |
    |                                             |<---- 3. emit("join_chat_session") ----|
    |                                             |                                       |
    |                                             |<---- 4. emit("accept_chat_session") --|
    |<=== on("chat_started") (Timer Starts) ======|<==== on("chat_started") ==============|
    |                                             |                                       |
    |<======== Realtime Messages & Typing (emit & listen "new_chat_message") ============>|
    |                                             |                                       |
    |---- 5. emit("end_chat_session") ----------->| (Auto Billing Deducted)               |
    |<=== on("chat_ended") =======================|<==== on("chat_ended") ================|
```

---

## 2. Socket Connection & Handshake Authentication

The backend verifies the user JWT token during Socket.IO handshake.

### Connection Parameters:
- **Base URL:** `http://YOUR_SERVER_IP:5000` (e.g. `http://192.168.1.10:5000` or production URL)
- **Transports:** `["websocket", "polling"]`
- **Auth Payload:** Send JWT token inside `auth` object.

### React Native / JS:
```javascript
import { io } from "socket.io-client";

const socket = io("http://YOUR_SERVER_IP:5000", {
  transports: ["websocket", "polling"],
  auth: {
    token: userToken, // clean token without "Bearer "
    authorization: `Bearer ${userToken}`, // or with Bearer (both supported!)
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ [Socket] Connected successfully with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ [Socket] Handshake / Connection Error:", error.message);
});
```

---

## 3. Step-by-Step Events Reference

### Step 1: Join Chat Session (`join_chat_session`)

Once consultation is created, both User and Astrologer must join the chat room.

#### Client Emits:
- **Event:** `join_chat_session`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
  "role": "user" 
}
```
*(Note: `role` can be `"user"` or `"astrologer"`. If `userId` or `role` is omitted, the backend auto-detects it from the JWT handshake).*

#### Client Listens:
- **Event:** `chat_session_joined`
```json
{
  "status": true,
  "room": "chat_session_d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "message": "Joined chat room chat_session_... successfully."
}
```

---

### Step 2: Astrologer Accepts Chat (`accept_chat_session`)

When the Astrologer taps "Accept Chat" on their screen.

#### Astrologer Client Emits:
- **Event:** `accept_chat_session`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6"
}
```

#### Both User & Astrologer Listen:
- **Event:** `chat_started`
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "status": "ongoing",
  "startedAt": "2026-08-25T08:15:00.000Z",
  "maxDurationSeconds": 6540
}
```
> **UI Action:** When `chat_started` is received, start the consultation countdown timer on the screen using `maxDurationSeconds`.

---

### Step 3: Realtime Messaging (`send_chat_message`)

To send a message in the 1:1 chat.

#### Client Emits:
- **Event:** `send_chat_message`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "senderId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
  "senderRole": "user",
  "message": "Namaste Pandit ji, meri kundali me shani dosh hai kya?",
  "messageType": "TEXT"
}
```

#### Both User & Astrologer Listen:
- **Event:** `new_chat_message`
```json
{
  "id": "chat_1724574920000_123",
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "senderId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
  "senderRole": "user",
  "message": "Namaste Pandit ji, meri kundali me shani dosh hai kya?",
  "messageType": "TEXT",
  "createdAt": "2026-08-25T08:15:20.000Z"
}
```
> **UI Action:** Append `new_chat_message` payload directly into your chat message list / RecyclerView.

---

### Step 4: Realtime Typing Indicator (`typing_indicator`)

Shows "Astrologer is typing..." or "User is typing...".

#### Client Emits:
- **Event:** `typing_indicator`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
  "role": "user",
  "isTyping": true
}
```

#### Opposite Party Listens:
- **Event:** `user_typing`
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac",
  "role": "user",
  "isTyping": true
}
```

---

### Step 5: End Chat Session & Billing (`end_chat_session`)

Triggered when the user taps "End Chat" or when duration expires.

#### Client Emits:
- **Event:** `end_chat_session`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "reason": "completed"
}
```
*(Reasons: `"completed"` | `"cancelled"` | `"balance_exhausted"`)*

#### Both Clients Listen:
- **Event:** `chat_ended`
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "reason": "completed",
  "consultation": {
    "id": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
    "status": "completed",
    "duration": 180,
    "amount": 60
  },
  "userMessage": "Chat consultation ended successfully."
}
```
> **UI Action:** Stop timer, disable message input box, and show summary modal / rating screen.

---

### Step 6: Leave Session (`leave_chat_session`)

#### Client Emits:
- **Event:** `leave_chat_session`
- **Payload:**
```json
{
  "consultationId": "d1927d0e-57af-4ef6-9f41-f474a94ed6d6",
  "userId": "2bab9b20-0215-4ea7-9813-ec41117f34ac"
}
```

---

## 4. Complete Ready-to-Use React Native Service

Save this file as `services/chatSocketService.js` in your React Native project:

```javascript
import { io } from "socket.io-client";

class ChatSocketService {
  constructor() {
    this.socket = null;
  }

  // 1. Connect Socket with JWT Handshake Auth
  connect(serverUrl, token) {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      auth: {
        token: cleanToken,
        authorization: `Bearer ${cleanToken}`,
      },
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("✅ [ChatSocket] Connected:", this.socket.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ [ChatSocket] Connect Error:", err.message);
    });

    return this.socket;
  }

  // 2. Join Consultation Room
  joinChatSession(consultationId, userId, role = "user") {
    if (!this.socket) return;
    this.socket.emit("join_chat_session", {
      consultationId,
      userId,
      role,
    });
  }

  // 3. Astrologer Accept Chat
  acceptChatSession(consultationId) {
    if (!this.socket) return;
    this.socket.emit("accept_chat_session", { consultationId });
  }

  // 4. Send Message
  sendMessage(consultationId, senderId, senderRole, message, messageType = "TEXT") {
    if (!this.socket || !message?.trim()) return;
    this.socket.emit("send_chat_message", {
      consultationId,
      senderId,
      senderRole,
      message: message.trim(),
      messageType,
    });
  }

  // 5. Send Typing Indicator
  sendTypingIndicator(consultationId, userId, role, isTyping) {
    if (!this.socket) return;
    this.socket.emit("typing_indicator", {
      consultationId,
      userId,
      role,
      isTyping: !!isTyping,
    });
  }

  // 6. End Consultation
  endChatSession(consultationId, reason = "completed") {
    if (!this.socket) return;
    this.socket.emit("end_chat_session", { consultationId, reason });
  }

  // Listeners
  onChatSessionJoined(callback) {
    this.socket?.on("chat_session_joined", callback);
  }

  onChatStarted(callback) {
    this.socket?.on("chat_started", callback);
  }

  onNewMessage(callback) {
    this.socket?.on("new_chat_message", callback);
  }

  onUserTyping(callback) {
    this.socket?.on("user_typing", callback);
  }

  onChatEnded(callback) {
    this.socket?.on("chat_ended", callback);
  }

  onChatError(callback) {
    this.socket?.on("chat_error", callback);
  }

  // Disconnect & Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new ChatSocketService();
```

---

## 5. Native Android (Kotlin) Implementation

### Gradle Dependency:
```groovy
implementation ('io.socket:socket.io-client:2.1.0') {
    exclude group: 'org.json', module: 'json'
}
```

### Kotlin Connection & Event Manager:
```kotlin
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject
import java.util.Collections

object ChatSocketManager {
    private var mSocket: Socket? = null

    fun connect(serverUrl: String, token: String) {
        try {
            val cleanToken = if (token.startsWith("Bearer ")) token.substring(7) else token

            val options = IO.Options().apply {
                transports = arrayOf("websocket", "polling")
                auth = Collections.singletonMap("token", cleanToken)
            }

            mSocket = IO.socket(serverUrl, options)

            mSocket?.on(Socket.EVENT_CONNECT) {
                println("✅ Socket Connected: ${mSocket?.id()}")
            }

            mSocket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
                val err = args.getOrNull(0)
                println("❌ Socket Connect Error: $err")
            }

            mSocket?.connect()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    // Join Session
    fun joinChatSession(consultationId: String, userId: String, role: String) {
        val payload = JSONObject().apply {
            put("consultationId", consultationId)
            put("userId", userId)
            put("role", role)
        }
        mSocket?.emit("join_chat_session", payload)
    }

    // Send Message
    fun sendMessage(consultationId: String, senderId: String, senderRole: String, message: String) {
        val payload = JSONObject().apply {
            put("consultationId", consultationId)
            put("senderId", senderId)
            put("senderRole", senderRole)
            put("message", message)
            put("messageType", "TEXT")
        }
        mSocket?.emit("send_chat_message", payload)
    }

    // Listen for incoming messages
    fun onNewMessage(listener: (JSONObject) -> Unit) {
        mSocket?.on("new_chat_message") { args ->
            val data = args[0] as JSONObject
            listener(data)
        }
    }

    fun disconnect() {
        mSocket?.disconnect()
        mSocket?.off()
    }
}
```

---

## 6. Summary Table of All Events

| Event Name | Direction | Emitted By / Received By | Purpose |
|---|---|---|---|
| `join_chat_session` | Client ➔ Server | User & Astrologer | Join consultation room |
| `chat_session_joined` | Server ➔ Client | User & Astrologer | Confirmation of room joined |
| `accept_chat_session` | Client ➔ Server | Astrologer only | Accept waiting chat consultation |
| `chat_started` | Server ➔ Client | User & Astrologer | Chat is ongoing & timer starts |
| `send_chat_message` | Client ➔ Server | User or Astrologer | Send real-time chat text/media |
| `new_chat_message` | Server ➔ Client | User & Astrologer | Broadcast incoming message |
| `typing_indicator` | Client ➔ Server | User or Astrologer | Send typing status (`isTyping: true/false`) |
| `user_typing` | Server ➔ Client | Opposite Party | Display "User/Astrologer is typing..." |
| `end_chat_session` | Client ➔ Server | User or Astrologer | End consultation & process billing |
| `chat_ended` | Server ➔ Client | User & Astrologer | Chat ended summary & wallet billing |
| `leave_chat_session` | Client ➔ Server | User or Astrologer | Leave socket room |
| `chat_error` | Server ➔ Client | Error recipient | Socket validation error message |

---
**Happy Coding! 🚀**
