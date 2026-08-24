# 🎥 2. Realtime Live Streaming Guide (User App & Astrologer App)

> **Target Platform**: React Native / Flutter / iOS / Android  
> **Backend Base URL**: `http://<your-server-domain>:5000/api`  
> **Socket.io Endpoint**: `ws://<your-server-domain>:5000`  

---

## 📌 Overview

This document contains the step-by-step implementation for **Live Streaming** for both **User App (Audience Viewers)** and **Astrologer App (Broadcaster Host)**.

---

# SECTION A: 📱 USER APP IMPLEMENTATION (AUDIENCE VIEWER)

### 🔹 Step 1: User Sees Active Live Streams List

- **API Endpoint**: `GET /api/live/get?page=1&limit=10`
- **Headers**: `Authorization: Bearer <userToken>`
- Displays list of active live astrologers with live viewer counts.

### 🔹 Step 2: User Joins Live Stream

- **Call API**: `POST /api/live/:id/join`
- Returns Agora Audience Token & uid (e.g. 47398).

**Join Agora Channel as Audience**:
```javascript
await agoraEngine.joinChannel(audienceToken, channelName, null, 47398);
```

**Connect Socket & Join Room**:
```javascript
socket.emit("join_live_room", {
  liveSessionId: "1000ea75-789b-4301-838e-f87060ac3a45",
  user: { id: currentUser.id, name: currentUser.name },
  role: "audience"
});
```

### 🔹 Step 3: Realtime Live Interactions

- **Update Live Viewer Count**:
  ```javascript
  socket.on("viewer_count_update", (data) => {
    document.getElementById("viewerBadge").innerText = "👀 Viewers: " + data.viewersCount;
  });
  ```
- **Send Live Comment**:
  ```javascript
  socket.emit("send_live_chat_message", {
    liveSessionId, user, message: "Namaste Pandit Ji! 🙏"
  });
  ```
- **Send Live Gift**:
  ```javascript
  socket.emit("send_live_gift", {
    liveSessionId, user, gift: { name: "Rose 🌹", coins: 10 }
  });
  ```

### 🔹 Step 4: User Leaves Live Stream / Host Ends Stream

**User Taps Back Button**:
- Call API `POST /api/live/:id/leave`, emit `leave_live_room`, call `socket.disconnect()`.

**Listen for Stream Ended Event**:
```javascript
socket.on("live_stream_ended", (data) => {
  agoraEngine.leaveChannel();
  socket.disconnect();
  // Show "Live Session Ended" Popup
});
```

---

# SECTION B: 🔮 ASTROLOGER APP IMPLEMENTATION (BROADCASTER HOST)

### 🔹 Step 1: Astrologer Taps "Go Live"

- **API Endpoint**: `POST /api/live/start`
- **Headers**: `Authorization: Bearer <astrologerToken>`
- **Body**: `{ "title": "Daily Kundli Live Session", "thumbnail": "https://..." }`
- **Response**: Returns `liveSessionId`, `channelName`, and Agora Host Token (uid: 1).

### 🔹 Step 2: Astrologer Starts Camera & Video Broadcast

**Enable Video & Preview**:
```javascript
await agoraEngine.enableVideo();
await agoraEngine.startPreview();
```

**Join Agora Channel as Broadcaster (uid: 1)**:
```javascript
await agoraEngine.joinChannel(hostToken, channelName, null, 1);
```

**Connect Socket**:
```javascript
socket.emit("join_live_room", {
  liveSessionId: "1000ea75-789b-4301-838e-f87060ac3a45",
  user: { id: astrologerUser.id, name: astrologerUser.name },
  role: "host"
});
```

### 🔹 Step 3: Astrologer Screen Overlay

- **Viewer Count Badge**: Update screen badge on `viewer_count_update`.
- **Floating Comments**: Render comments on screen overlay on `live_chat_message` so Astrologer can read user questions!
- **Gift Animations**: Play Lottie Heart / Rose animations on `live_gift_received`.

### 🔹 Step 4: Astrologer Ends Live Stream

- Call API: `PATCH /api/live/end` (or emit `socket.emit("end_live_stream", { liveSessionId })`).
- Leave Agora Channel, disconnect socket, show Live Summary (Total Viewers, Total Gifts).
