// app/(screens)/golive.js
// Broadcaster (Host) Live Streaming screen for Astrologer App.
// Follows Section B of Realtime Live Streaming Guide (2_realtime_live_streaming_guide.md).

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Typography from "../../constants/Typography";
import { AGORA_APP_ID } from "../../constants/AgoraConfig";
import { RF, hp, wp } from "../../utils/responsive";
import { getStoredUser } from "../../utils/auth";
import {
  useEndLiveSessionMutation,
  useStartLiveSessionMutation,
} from "../../redux/LiveApi";

// Safe Agora loader for dev/web resilience
let createAgoraRtcEngine = null;
let RtcSurfaceView = null;
let ChannelProfileType = { ChannelProfileLiveBroadcasting: 1 };
let ClientRoleType = { ClientRoleBroadcaster: 1 };
try {
  const agoraModule = require("react-native-agora");
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
  if (agoraModule.RtcSurfaceView) RtcSurfaceView = agoraModule.RtcSurfaceView;
  if (agoraModule.ChannelProfileType) ChannelProfileType = agoraModule.ChannelProfileType;
  if (agoraModule.ClientRoleType) ClientRoleType = agoraModule.ClientRoleType;
} catch (_e) {
  console.log("[GoLive] react-native-agora native module not loaded; running in mock/web mode.");
}

const ORANGE = "#ff6a00";
const LOG_TAG = "[GoLiveHost]";

export default function GoLive() {
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("Live Astrology & Horoscope Guidance");
  const [isLive, setIsLive] = useState(false);
  const [liveSessionId, setLiveSessionId] = useState(null);
  const [viewersCount, setViewersCount] = useState(0);
  const [peakViewers, setPeakViewers] = useState(0);
  const [comments, setComments] = useState([]);
  const [recentGift, setRecentGift] = useState(null);
  const [totalGiftsReceived, setTotalGiftsReceived] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const [startLiveMutation, { isLoading: isStarting }] = useStartLiveSessionMutation();
  const [endLiveMutation] = useEndLiveSessionMutation();

  const agoraEngineRef = useRef(null);
  const timerRef = useRef(null);
  const giftAnim = useRef(new Animated.Value(0)).current;
  const commentsListRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const webStreamRef = useRef(null);
  const videoElementRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  // Callback ref for resilient video element attachment
  const videoRefCallback = useCallback(
    (node) => {
      videoElementRef.current = node;
      if (node && localStream) {
        node.srcObject = localStream;
        node.play().catch(() => {});
      }
    },
    [localStream],
  );

  useEffect(() => {
    if (videoElementRef.current && localStream) {
      videoElementRef.current.srcObject = localStream;
      videoElementRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await getStoredUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, []);

  // Web camera hook when live starts
  useEffect(() => {
    let active = true;
    if (isLive && Platform.OS === "web" && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: isFrontCamera ? "user" : "environment" },
          audio: true,
        })
        .then((stream) => {
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          webStreamRef.current = stream;
          setLocalStream(stream);
          if (videoElementRef.current) {
            videoElementRef.current.srcObject = stream;
            videoElementRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.log(LOG_TAG, "Web camera/mic access notice:", err.message);
        });

      return () => {
        active = false;
        if (webStreamRef.current) {
          webStreamRef.current.getTracks().forEach((t) => t.stop());
          webStreamRef.current = null;
        }
        setLocalStream(null);
      };
    }
  }, [isLive, isFrontCamera]);

  // Web live video frame broadcaster to audience tabs
  useEffect(() => {
    if (!isLive || isCameraOff || Platform.OS !== "web") return;

    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) return;
    canvas.width = 360;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    const frameInterval = setInterval(() => {
      if (videoElementRef.current && ctx) {
        try {
          if (videoElementRef.current.videoWidth > 0) {
            ctx.drawImage(videoElementRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.55);
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: "live_video_frame",
                frame: dataUrl,
              });
            }

            const socket = getSocket();
            if (socket?.connected && liveSessionId) {
              socket.emit("send_live_video_frame", {
                liveSessionId: String(liveSessionId),
                frame: dataUrl,
              });
            }
          }
        } catch (e) {}
      }
    }, 120);

    return () => {
      clearInterval(frameInterval);
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({ type: "live_video_frame", frame: null });
        } catch (e) {}
      }
      const socket = getSocket();
      if (socket?.connected && liveSessionId) {
        try {
          socket.emit("send_live_video_frame", {
            liveSessionId: String(liveSessionId),
            frame: null,
          });
        } catch (e) {}
      }
    };
  }, [isLive, isCameraOff, liveSessionId]);

  // Format timer MM:SS
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Trigger gift toast animation
  const showGiftToast = useCallback(
    (giftData) => {
      setRecentGift(giftData);
      setTotalGiftsReceived((prev) => prev + 1);
      if (giftData?.gift?.coins) {
        setTotalCoinsEarned((prev) => prev + Number(giftData.gift.coins));
      }

      giftAnim.setValue(0);
      Animated.sequence([
        Animated.spring(giftAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.delay(3500),
        Animated.timing(giftAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setRecentGift(null));
    },
    [giftAnim],
  );

  // Trigger floating emoji animation
  const spawnFloatingEmoji = useCallback((emoji) => {
    const id = String(Date.now() + Math.random());
    const animVal = new Animated.Value(0);
    const randomX = Math.random() * 60 - 30;
    setFloatingEmojis((prev) => [...prev.slice(-15), { id, emoji, animVal, randomX }]);

    Animated.timing(animVal, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: true,
    }).start(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    });
  }, []);

  // Realtime multi-tab sync via BroadcastChannel (Web)
  useEffect(() => {
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      try {
        const channel = new window.BroadcastChannel("vavi_live_stream_sync");
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
          const data = event.data;
          console.log(LOG_TAG, "BroadcastChannel message:", data);

          if (data?.type === "audience_joined" || data?.type === "audience_heartbeat") {
            setViewersCount((prev) => {
              const next = Math.max(1, prev + (data?.type === "audience_joined" ? 1 : 0));
              setPeakViewers((p) => Math.max(p, next, 1));
              return next;
            });
          } else if (data?.type === "audience_left") {
            setViewersCount((prev) => Math.max(0, prev - 1));
          } else if (data?.type === "live_chat_message") {
            setComments((prev) => [
              ...prev.slice(-40),
              {
                id: data?.id || String(Date.now() + Math.random()),
                userName: data?.user?.name || data?.userName || "Audience",
                message: data?.message || "",
              },
            ]);
          } else if (data?.type === "live_gift_received") {
            showGiftToast(data);
          } else if (data?.type === "live_emoji_received" || data?.type === "send_live_emoji") {
            if (data?.emoji) spawnFloatingEmoji(data.emoji);
          }
        };

        return () => {
          channel.close();
        };
      } catch (e) {
        console.log(LOG_TAG, "BroadcastChannel setup error:", e);
      }
    }
  }, [showGiftToast, spawnFloatingEmoji]);

  // Start Live Session Handler
  const handleStartLive = async () => {
    if (!title.trim()) {
      Alert.alert("Title Required", "Please enter a title for your live session.");
      return;
    }

    try {
      console.log(LOG_TAG, "Starting live session with title:", title);
      const res = await startLiveMutation({ title: title.trim() }).unwrap();
      console.log(LOG_TAG, "Start live response:", res);

      const session = res?.data?.session || res?.data || res;
      const sessionId = session?.id || session?.liveSessionId || res?.liveSessionId;
      const agoraData = session?.agora || res?.agora || {};
      const agoraToken = agoraData?.token || session?.token || "";
      const channel = agoraData?.channelName || session?.channelName || `live_${sessionId}`;

      setLiveSessionId(sessionId);
      setIsLive(true);
      setDurationSeconds(0);

      // Start duration timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);

      // 1. Setup & Join Agora Video RTC (Safe for Expo Go & Dev Builds)
      try {
        if (Platform.OS === "android") {
          try {
            await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
          } catch (pErr) {
            console.log(LOG_TAG, "Android permissions error:", pErr);
          }
        }

        if (createAgoraRtcEngine && AGORA_APP_ID) {
          const engine = createAgoraRtcEngine();
          if (engine && typeof engine.initialize === "function") {
            agoraEngineRef.current = engine;
            engine.initialize({ appId: AGORA_APP_ID });
            engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
            engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
            engine.enableAudio();
            engine.enableVideo();
            engine.enableLocalAudio(true);
            engine.enableLocalVideo(true);
            engine.startPreview();
            if (agoraToken) {
              await engine.joinChannel(agoraToken, channel, null, 1);
              console.log(LOG_TAG, "Agora broadcaster joined channel:", channel);
            }
          }
        }
      } catch (agoraErr) {
        console.log(LOG_TAG, "Expo Go / Agora native module notice:", agoraErr?.message || agoraErr);
      }

      // 2. Connect Socket & Join Live Room
      await setupLiveSocket(sessionId);
    } catch (err) {
      console.log(LOG_TAG, "Start live API error, proceeding in local live mode:", err);
      const fallbackSessionId = `live_${Date.now()}`;
      setLiveSessionId(fallbackSessionId);
      setIsLive(true);
      setDurationSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);

      await setupLiveSocket(fallbackSessionId);
    }
  };

  const setupLiveSocket = async (sessionId) => {
    const user = currentUser || (await getStoredUser());
    const socket = await connectSocket(user?.token);

    if (socket) {
      const joinPayload = {
        liveSessionId: String(sessionId),
        user: {
          id: user?.id || user?._id || "astrologer",
          name: user?.name || "Astrologer",
        },
        role: "host",
      };

      const emitJoin = () => {
        console.log(LOG_TAG, "Emitting join_live_room (host):", joinPayload);
        socket.emit("join_live_room", joinPayload);
      };

      if (socket.connected) {
        emitJoin();
      } else {
        socket.once("connect", emitJoin);
      }

      // Handler to update count
      const handleCount = (data) => {
        const count = typeof data === "number"
          ? data
          : Number(data?.viewersCount ?? data?.count ?? data?.viewerCount ?? 0);
        if (!isNaN(count)) {
          console.log(LOG_TAG, "Host viewer count update:", count);
          setViewersCount(count);
          setPeakViewers((prev) => Math.max(prev, count));
        }
      };

      socket.on("viewer_count_update", handleCount);
      socket.on("viewers_count_update", handleCount);
      socket.on("live_viewers_count", handleCount);
      socket.on("viewer_count", handleCount);

      // Increment/decrement on join/leave events
      socket.on("user_joined_live", (data) => {
        console.log(LOG_TAG, "User joined live:", data);
        if (data?.viewersCount != null) {
          handleCount(data.viewersCount);
        } else {
          setViewersCount((prev) => {
            const next = prev + 1;
            setPeakViewers((p) => Math.max(p, next));
            return next;
          });
        }
      });

      socket.on("audience_joined", (data) => {
        console.log(LOG_TAG, "Audience joined live:", data);
        if (data?.viewersCount != null) {
          handleCount(data.viewersCount);
        } else {
          setViewersCount((prev) => {
            const next = prev + 1;
            setPeakViewers((p) => Math.max(p, next));
            return next;
          });
        }
      });

      socket.on("user_left_live", (data) => {
        console.log(LOG_TAG, "User left live:", data);
        if (data?.viewersCount != null) {
          handleCount(data.viewersCount);
        } else {
          setViewersCount((prev) => Math.max(0, prev - 1));
        }
      });

      socket.on("audience_left", (data) => {
        console.log(LOG_TAG, "Audience left live:", data);
        if (data?.viewersCount != null) {
          handleCount(data.viewersCount);
        } else {
          setViewersCount((prev) => Math.max(0, prev - 1));
        }
      });

      // Catch-all tap for any viewer count events
      socket.onAny((event, ...args) => {
        if (typeof event === "string" && (event.includes("viewer") || event.includes("count"))) {
          handleCount(args[0]);
        }
      });

      // Listen for live chat messages
      socket.on("live_chat_message", (data) => {
        console.log(LOG_TAG, "Live comment received:", data);
        setComments((prev) => [
          ...prev.slice(-40),
          {
            id: data?.id || String(Date.now() + Math.random()),
            userName: data?.user?.name || data?.userName || "Audience",
            message: data?.message || "",
          },
        ]);
      });

      // Listen for live gifts
      socket.on("live_gift_received", (data) => {
        console.log(LOG_TAG, "Live gift received:", data);
        showGiftToast(data);
      });

      // Listen for live emojis
      socket.on("live_emoji_received", (data) => {
        console.log(LOG_TAG, "Live emoji received:", data);
        if (data?.emoji) spawnFloatingEmoji(data.emoji);
      });

      socket.on("send_live_emoji", (data) => {
        console.log(LOG_TAG, "Live emoji sent from viewer:", data);
        if (data?.emoji) spawnFloatingEmoji(data.emoji);
      });
    }
  };

  // End Live Session Handler
  const handleEndLive = () => {
    const doEnd = async () => {
      if (timerRef.current) clearInterval(timerRef.current);

      // Notify backend & socket
      try {
        await endLiveMutation().unwrap();
      } catch (e) {
        console.log(LOG_TAG, "endLiveMutation error:", e);
      }

      const socket = getSocket();
      if (socket && liveSessionId) {
        socket.emit("end_live_stream", { liveSessionId });
        socket.emit("leave_live_room", { liveSessionId, role: "host" });
      }

      // Cleanup Agora
      if (agoraEngineRef.current) {
        try {
          await agoraEngineRef.current.leaveChannel();
          await agoraEngineRef.current.release();
        } catch (e) {}
        agoraEngineRef.current = null;
      }

      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({ type: "live_stream_ended" });
        } catch (e) {}
      }

      setIsLive(false);
      setShowSummaryModal(true);
    };

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Are you sure you want to end this live broadcast?")) {
        doEnd();
      }
    } else {
      Alert.alert(
        "End Live Stream",
        "Are you sure you want to end this live broadcast?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "End Stream",
            style: "destructive",
            onPress: doEnd,
          },
        ],
      );
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);

    // Mute/unmute microphone on web
    if (webStreamRef.current) {
      webStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !next;
      });
    }

    if (agoraEngineRef.current?.muteLocalAudioStream) {
      agoraEngineRef.current.muteLocalAudioStream(next);
    }
  };

  // Toggle Speaker
  const handleToggleSpeaker = () => {
    const next = !isSpeakerMuted;
    setIsSpeakerMuted(next);
    if (agoraEngineRef.current?.muteAllRemoteAudioStreams) {
      agoraEngineRef.current.muteAllRemoteAudioStreams(next);
    }
  };

  // Switch Camera (Front/Back)
  const handleSwitchCamera = () => {
    setIsFrontCamera((prev) => !prev);
    if (agoraEngineRef.current?.switchCamera) {
      agoraEngineRef.current.switchCamera();
    }
  };

  // Toggle Video (Camera On/Off)
  const handleToggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);

    // Enable/disable webcam on web
    if (webStreamRef.current) {
      webStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !next;
      });
    }

    if (agoraEngineRef.current?.muteLocalVideoStream) {
      agoraEngineRef.current.muteLocalVideoStream(next);
    }
  };

  // Back button confirmation
  useEffect(() => {
    const onBackPress = () => {
      if (isLive) {
        handleEndLive();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [isLive, liveSessionId]);

  return (
    <View style={styles.container}>
      {/* Camera Video View / Background */}
      <View style={styles.cameraBackground}>
        {Platform.OS === "web" && isLive && !isCameraOff ? (
          <video
            ref={videoRefCallback}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isFrontCamera ? "scaleX(-1)" : "none",
            }}
          />
        ) : Platform.OS !== "web" && isLive && !isCameraOff && RtcSurfaceView ? (
          <RtcSurfaceView
            canvas={{ uid: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <Image
            source={require("../../assets/images/bg.png")}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.overlayTint} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {!isLive && !showSummaryModal ? (
          /* =========================================
             SETUP / START LIVE SCREEN
             ========================================= */
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.setupContainer}
          >
            <View style={styles.setupHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={RF(24)} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.setupTitle}>Start Live Broadcast</Text>
              <View style={{ width: RF(24) }} />
            </View>

            <View style={styles.setupCard}>
              <View style={styles.avatarPreview}>
                <Ionicons name="videocam" size={RF(36)} color={ORANGE} />
              </View>

              <Text style={styles.cardLabel}>Session Topic / Title</Text>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter what you will discuss..."
                placeholderTextColor="#999"
                maxLength={80}
              />

              <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={RF(16)} color={ORANGE} />
                <Text style={styles.tipText}>
                  Your followers will receive a notification when you go live!
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.goLiveBtn, isStarting && styles.btnDisabled]}
                onPress={handleStartLive}
                disabled={isStarting}
              >
                <Ionicons name="radio-outline" size={RF(20)} color="#fff" />
                <Text style={styles.goLiveBtnText}>
                  {isStarting ? "Starting Live..." : "Go Live Now"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : isLive ? (
          /* =========================================
             ACTIVE LIVE STREAM SCREEN
             ========================================= */
          <View style={styles.liveStreamContainer}>
            {/* Top Bar Header */}
            <View style={styles.topBar}>
              <View style={styles.hostProfile}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>
                    {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.hostName} numberOfLines={1}>
                    {currentUser?.name || "Astrologer"}
                  </Text>
                  <View style={styles.liveIndicator}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.liveTimerText}>{formatTimer(durationSeconds)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.topRightControls}>
                <View style={styles.viewerBadge}>
                  <Ionicons name="eye" size={RF(14)} color="#fff" />
                  <Text style={styles.viewerText}>{viewersCount}</Text>
                </View>

                <TouchableOpacity
                  style={styles.endLiveBtn}
                  onPress={handleEndLive}
                  activeOpacity={0.85}
                >
                  <Ionicons name="power" size={RF(16)} color="#fff" />
                  <Text style={styles.endLiveText}>End</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Gift Banner Notification */}
            {recentGift && (
              <Animated.View
                style={[
                  styles.giftToast,
                  {
                    opacity: giftAnim,
                    transform: [
                      {
                        translateY: giftAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.giftToastEmoji}>
                  {recentGift?.gift?.emoji || "🎁"}
                </Text>
                <View>
                  <Text style={styles.giftToastSender}>
                    {recentGift?.user?.name || "Viewer"} sent {recentGift?.gift?.name || "a Gift"}!
                  </Text>
                  <Text style={styles.giftToastCoins}>
                    +{recentGift?.gift?.coins || 10} Coins 🪙
                  </Text>
                </View>
              </Animated.View>
            )}

            {/* Floating Instagram-style Reaction Emojis Container */}
            <View style={styles.floatingEmojiLayer} pointerEvents="none">
              {floatingEmojis.map((item) => {
                const translateY = item.animVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -280],
                });
                const opacity = item.animVal.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [1, 0.8, 0],
                });
                const scale = item.animVal.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0.5, 1.2, 1],
                });
                return (
                  <Animated.View
                    key={item.id}
                    style={[
                      styles.floatingEmojiItem,
                      {
                        transform: [
                          { translateY },
                          { translateX: item.randomX },
                          { scale },
                        ],
                        opacity,
                      },
                    ]}
                  >
                    <Text style={styles.floatingEmojiText}>{item.emoji}</Text>
                  </Animated.View>
                );
              })}
            </View>

            {/* Bottom Section: Floating Comments & Host Controls */}
            <View style={styles.bottomSection}>
              {/* Floating Comments List */}
              <View style={styles.commentsContainer}>
                <FlatList
                  ref={commentsListRef}
                  data={comments}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  onContentSizeChange={() =>
                    commentsListRef.current?.scrollToEnd({ animated: true })
                  }
                  renderItem={({ item }) => (
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentAuthor}>{item.userName}: </Text>
                      <Text style={styles.commentText}>{item.message}</Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.noCommentsText}>
                      No comments yet. Audience questions will appear here!
                    </Text>
                  }
                />
              </View>

              {/* Host Control Actions Bar */}
              <View style={styles.hostActionBar}>
                <TouchableOpacity
                  style={[styles.hostActionBtn, isMuted && styles.hostActionBtnActive]}
                  onPress={handleToggleMute}
                >
                  <Ionicons
                    name={isMuted ? "mic-off" : "mic"}
                    size={RF(20)}
                    color="#fff"
                  />
                  <Text style={styles.actionBtnLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.hostActionBtn, isSpeakerMuted && styles.hostActionBtnActive]}
                  onPress={handleToggleSpeaker}
                >
                  <Ionicons
                    name={isSpeakerMuted ? "volume-mute" : "volume-high"}
                    size={RF(20)}
                    color="#fff"
                  />
                  <Text style={styles.actionBtnLabel}>{isSpeakerMuted ? "Spk Off" : "Speaker"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.hostActionBtn}
                  onPress={handleSwitchCamera}
                >
                  <Ionicons name="camera-reverse" size={RF(20)} color="#fff" />
                  <Text style={styles.actionBtnLabel}>Flip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.hostActionBtn, isCameraOff && styles.hostActionBtnActive]}
                  onPress={handleToggleCamera}
                >
                  <Ionicons
                    name={isCameraOff ? "videocam-off" : "videocam"}
                    size={RF(20)}
                    color="#fff"
                  />
                  <Text style={styles.actionBtnLabel}>{isCameraOff ? "Cam On" : "Cam Off"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {/* =========================================
           SESSION ENDED SUMMARY MODAL
           ========================================= */}
        {showSummaryModal && (
          <View style={styles.summaryOverlay}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="checkmark-circle" size={RF(50)} color="#4CAF50" />
              </View>

              <Text style={styles.summaryTitle}>Live Broadcast Ended</Text>
              <Text style={styles.summarySub}>Here is your live session summary:</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{formatTimer(durationSeconds)}</Text>
                  <Text style={styles.statLbl}>Duration</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{Math.max(peakViewers, viewersCount)}</Text>
                  <Text style={styles.statLbl}>Peak Viewers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{totalGiftsReceived}</Text>
                  <Text style={styles.statLbl}>Gifts</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>🪙 {totalCoinsEarned}</Text>
                  <Text style={styles.statLbl}>Earnings</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeSummaryBtn}
                onPress={() => router.replace("/(home)")}
              >
                <Text style={styles.closeSummaryText}>Return Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1c1427",
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  safeArea: {
    flex: 1,
  },
  setupContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingBottom: hp(4),
  },
  setupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
  },
  closeBtn: {
    padding: wp(1.5),
  },
  setupTitle: {
    color: "#fff",
    fontSize: RF(17),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  setupCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarPreview: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#fff0e6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
  },
  cardLabel: {
    alignSelf: "flex-start",
    fontSize: RF(13),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.8),
  },
  titleInput: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
    fontSize: RF(13),
    color: "#222",
    marginBottom: hp(2),
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7e6",
    padding: wp(3),
    borderRadius: wp(2.5),
    marginBottom: hp(3),
    gap: wp(2),
  },
  tipText: {
    flex: 1,
    fontSize: RF(11),
    color: "#7a5200",
  },
  goLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
    width: "100%",
    paddingVertical: hp(1.6),
    borderRadius: wp(3.5),
    gap: wp(2),
  },
  btnDisabled: {
    opacity: 0.6,
  },
  goLiveBtnText: {
    color: "#fff",
    fontSize: RF(15),
    fontWeight: "700",
  },
  liveStreamContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  hostProfile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(6),
    gap: wp(2),
    maxWidth: wp(52),
  },
  avatarCircle: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "700",
  },
  hostName: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff3b30",
  },
  liveTimerText: {
    color: "#ddd",
    fontSize: RF(9.5),
    fontWeight: "500",
  },
  topRightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  viewerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: wp(1),
  },
  viewerText: {
    color: "#fff",
    fontSize: RF(11.5),
    fontWeight: "600",
  },
  endLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d32f2f",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: wp(1),
  },
  endLiveText: {
    color: "#fff",
    fontSize: RF(11.5),
    fontWeight: "700",
  },
  giftToast: {
    position: "absolute",
    top: hp(9),
    left: wp(4),
    right: wp(4),
    backgroundColor: "rgba(255, 106, 0, 0.92)",
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  giftToastEmoji: {
    fontSize: RF(26),
  },
  giftToastSender: {
    color: "#fff",
    fontSize: RF(12.5),
    fontWeight: "700",
  },
  giftToastCoins: {
    color: "#fff7e8",
    fontSize: RF(11),
    fontWeight: "600",
  },
  floatingEmojiLayer: {
    position: "absolute",
    right: wp(4),
    bottom: hp(15),
    width: wp(16),
    height: hp(35),
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 10,
  },
  floatingEmojiItem: {
    position: "absolute",
    bottom: 0,
  },
  floatingEmojiText: {
    fontSize: RF(32),
  },
  bottomSection: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  commentsContainer: {
    height: hp(26),
    marginBottom: hp(1.5),
  },
  commentBubble: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(3),
    marginBottom: hp(0.8),
    alignSelf: "flex-start",
    maxWidth: wp(85),
    flexWrap: "wrap",
  },
  commentAuthor: {
    color: "#ffcc00",
    fontSize: RF(11.5),
    fontWeight: "700",
  },
  commentText: {
    color: "#fff",
    fontSize: RF(11.5),
  },
  noCommentsText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: RF(11),
    fontStyle: "italic",
    paddingTop: hp(2),
  },
  hostActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: wp(5),
    paddingVertical: hp(1),
  },
  hostActionBtn: {
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  hostActionBtnActive: {
    backgroundColor: "rgba(255, 106, 0, 0.4)",
  },
  actionBtnLabel: {
    color: "#fff",
    fontSize: RF(9.5),
    marginTop: hp(0.3),
  },
  summaryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    width: "100%",
    padding: wp(6),
    alignItems: "center",
  },
  summaryIconContainer: {
    marginBottom: hp(1),
  },
  summaryTitle: {
    fontSize: RF(17),
    fontWeight: "700",
    color: "#222",
  },
  summarySub: {
    fontSize: RF(12),
    color: "#666",
    marginTop: hp(0.5),
    marginBottom: hp(2.5),
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: hp(3),
    gap: wp(2),
  },
  statBox: {
    width: wp(38),
    backgroundColor: "#f9f9f9",
    borderRadius: wp(3),
    padding: wp(3),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  statVal: {
    fontSize: RF(15),
    fontWeight: "800",
    color: ORANGE,
  },
  statLbl: {
    fontSize: RF(10.5),
    color: "#777",
    marginTop: hp(0.3),
  },
  closeSummaryBtn: {
    backgroundColor: ORANGE,
    width: "100%",
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    alignItems: "center",
  },
  closeSummaryText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "700",
  },
});
