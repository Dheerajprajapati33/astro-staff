# 📞 1. Voice & Video Call Consultation Guide (User App & Astrologer App)

> **Target Platform**: React Native / Flutter / iOS / Android  
> **Backend Base URL**: `http://<your-server-domain>:5000/api`  
> **Socket.io Endpoint**: `ws://<your-server-domain>:5000`  

---

## 📌 Overview

This document contains the complete step-by-step implementation for **1:1 Voice and Video Calls** for both **User App** and **Astrologer App**.

---

# SECTION A: 📱 USER APP IMPLEMENTATION (CLIENT)

### 🔹 Step 1: User Requests Call

- **API Endpoint**: `POST /api/consultation/create`
- **Headers**: `Authorization: Bearer <userToken>`
- **Body**:
  ```json
  {
    "astrologerId": "485a2150-d99f-4446-9b3c-eb61cebc2f4c",
    "type": "call",
    "problem": "Horoscope Reading"
  }
  ```
- **Response**: Returns `consultationId` & `maxDuration` (e.g., 1500 seconds).

### 🔹 Step 2: User Connects Socket & Joins Room

```javascript
socket.emit("join_consultation", {
  consultationId: "1000ea75-789b-4301-838e-f87060ac3a45",
  userId: currentUser.id,
  role: "user"
});
```
Render "Calling Astrologer... Ringing..." screen.

### 🔹 Step 3: Listen for Call Accept (`call_started` Event)

```javascript
socket.on("call_started", async (data) => {
  // 1. Fetch Agora Token
  const tokenRes = await axios.post(
    `http://<domain>:5000/api/consultation/token/${data.consultationId}`,
    {},
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  const { token, channelName, uid } = tokenRes.data.data.agora;

  // 2. Join Agora RTC Channel
  await agoraEngine.joinChannel(token, channelName, null, uid);

  // 3. Start Upper Countdown Timer (data.maxDurationSeconds)
});
```

### 🔹 Step 4: User Hangs Up or Time Expires (00:00)

```javascript
socket.emit("client_end_call", {
  consultationId: "1000ea75-789b-4301-838e-f87060ac3a45",
  reason: "completed"
});

socket.on("call_ended", (data) => {
  agoraEngine.leaveChannel();
  socket.disconnect();
  // Show Call Summary & Navigate to Home Screen
});
```

---

# SECTION B: 🔮 ASTROLOGER APP IMPLEMENTATION (SERVICE PROVIDER)

### 🔹 Step 1: Astrologer App Connects Socket

Astrologer App connects socket on login and stays online to receive calls:

```javascript
socket.emit("join_consultation", {
  consultationId: incomingConsultationId,
  userId: astrologerUser.id,
  role: "astrologer"
});
```

### 🔹 Step 2: Incoming Call Alert Popup

Show full-screen incoming call ring screen with **Accept** and **Reject** buttons.

### 🔹 Step 3: Astrologer Accepts Call

```javascript
socket.emit("astrologer_accept_call", {
  consultationId: incomingConsultationId
});
```

### 🔹 Step 4: Astrologer Joins Agora Call Channel

```javascript
socket.on("call_started", async (data) => {
  // Fetch Host Token (uid: 1)
  const tokenRes = await axios.post(
    `http://<domain>:5000/api/consultation/token/${data.consultationId}`,
    {},
    { headers: { Authorization: `Bearer ${astrologerToken}` } }
  );

  const { token, channelName, uid } = tokenRes.data.data.agora;

  // Join Agora RTC Channel as Host (uid: 1)
  await agoraEngine.joinChannel(token, channelName, null, uid);
});
```

### 🔹 Step 5: Astrologer Ends Call

```javascript
socket.emit("client_end_call", {
  consultationId: incomingConsultationId,
  reason: "completed"
});

socket.on("call_ended", (data) => {
  agoraEngine.leaveChannel();
  socket.disconnect();
  // Show Earnings Breakdown (Net Take-home: e.g., ₹147.60)
});
