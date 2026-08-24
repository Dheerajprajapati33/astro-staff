# 💬 3. 1:1 Standalone Chat Consultation Guide (User App & Astrologer App)

> **Target Platform**: React Native / Flutter / iOS / Android  
> **Backend Base URL**: `http://<your-server-domain>:5000/api`  
> **Socket.io Endpoint**: `ws://<your-server-domain>:5000`  
> **Agora RTC Required?**: ❌ **NO AGORA NEEDED!** Pure WebSocket + Database Messaging.

---

## 📌 Overview
This document contains the step-by-step implementation for **1:1 Standalone Chat Consultation** for both **User App** and **Astrologer App**.

---

# SECTION A: 📱 USER APP IMPLEMENTATION (CLIENT)

### 🔹 Step 1: User Requests Chat Consultation
- **API Endpoint**: `POST /api/consultation/create`
- **Headers**: `Authorization: Bearer <userToken>`
- **Body**: `{ "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c", "type": "chat", "problem": "Love & Career" }`
- Returns `consultationId` & `maxDuration` (e.g. 1500 seconds).

### 🔹 Step 2: User Connects Socket & Joins Chat Room
```javascript
socket.emit("join_chat_session", {
  consultationId: "1000ea75-789b-4301-838e-f87060ac3a45",
  userId: currentUser.id,
  role: "user"
});
```

### 🔹 Step 3: Fetch Chat Message History (On Screen Load)
- Call API: `GET /api/chat/rooms/:roomId/messages?page=1&limit=50`
- Render chronological messages list.

### 🔹 Step 4: Listen for Chat Accept (`chat_started` Event)
```javascript
socket.on("chat_started", (data) => {
  // Start Upper Countdown Timer (data.maxDurationSeconds)
  // Enable text input field
});
```

### 🔹 Step 5: Send & Receive Live Messages
- **Send Message**:
  ```javascript
  socket.emit("send_chat_message", {
    consultationId, senderId: currentUser.id, senderRole: "user", message: "Namaste Guruji!", messageType: "TEXT"
  });
  ```
- **Receive Message**:
  ```javascript
  socket.on("new_chat_message", (data) => {
    // Append message bubble instantly to screen without app refresh!
  });
  ```
- **Typing Indicator**:
  ```javascript
  socket.emit("typing_indicator", { consultationId, role: "user", isTyping: true });
  ```

### 🔹 Step 6: End Chat Session
```javascript
socket.emit("end_chat_session", { consultationId, reason: "completed" });

socket.on("chat_ended", (data) => {
  // Stop Timer, Freeze Input Field, Show Wallet Billing Summary
});
```

---

# SECTION B: 🔮 ASTROLOGER APP IMPLEMENTATION (SERVICE PROVIDER)

### 🔹 Step 1: Astrologer App Connects Socket
Astrologer App connects socket on login and listens for incoming chat requests:
```javascript
socket.emit("join_chat_session", {
  consultationId: incomingConsultationId,
  userId: astrologerUser.id,
  role: "astrologer"
});
```

### 🔹 Step 2: Incoming Chat Notification
Show incoming chat request pop-up with **Accept Chat** button.

### 🔹 Step 3: Astrologer Taps "Accept Chat"
```javascript
socket.emit("accept_chat_session", { consultationId: incomingConsultationId });
```

### 🔹 Step 4: Chat Active & Realtime Messaging
```javascript
socket.on("chat_started", (data) => {
  // Start Upper Countdown Timer
});

// Send Reply
socket.emit("send_chat_message", {
  consultationId: incomingConsultationId,
  senderId: astrologerUser.id,
  senderRole: "astrologer",
  message: "Namaste Rahul! Aapka Budh Grah strong hai...",
  messageType: "TEXT"
});

// Receive User Message
socket.on("new_chat_message", (data) => {
  // Append user bubble to astrologer chat screen instantly!
});
```

### 🔹 Step 5: Astrologer Ends Chat
```javascript
socket.emit("end_chat_session", { consultationId: incomingConsultationId, reason: "completed" });

socket.on("chat_ended", (data) => {
  // Freeze Chat Screen, Display Net Take-Home Earnings Summary
});
```
