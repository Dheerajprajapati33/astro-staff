// app/(screens)/LiveStream.js
// Audience (Viewer) Live Streaming screen for Vavi User App.
// Follows Section A of Realtime Live Streaming Guide (2_realtime_live_streaming_guide.md).

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../constants/Colors";
import { AGORA_APP_ID } from "../../constants/AgoraConfig";
import { resolveImageUri } from "../../config/api";
import { hp, RF, wp } from "../../utils/responsive";
import GiftBottomSheet from "../../components/live/GiftBottomSheet";
import {
  connectChatSocket,
  getChatSocket,
} from "../../services/chatSocketService";
import {
  useJoinLiveSessionMutation,
  useLeaveLiveSessionMutation,
} from "../../redux/liveApi";
import { useGetWalletBalanceQuery } from "../../redux/walletApi";

// Safe Agora loader for dev/web resilience
let createAgoraRtcEngine = null;
let RtcSurfaceView = null;
let ChannelProfileType = { ChannelProfileLiveBroadcasting: 1 };
let ClientRoleType = { ClientRoleAudience: 2 };
try {
  const agoraModule = require("react-native-agora");
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
  if (agoraModule.RtcSurfaceView) RtcSurfaceView = agoraModule.RtcSurfaceView;
  if (agoraModule.ChannelProfileType) ChannelProfileType = agoraModule.ChannelProfileType;
  if (agoraModule.ClientRoleType) ClientRoleType = agoraModule.ClientRoleType;
} catch (_e) {
  console.log("[LiveAudience] react-native-agora native module not loaded; running in mock/web mode.");
}

const ORANGE = "#ff6a00";
const LOG_TAG = "[LiveAudience]";

export default function LiveStream() {
  const params = useLocalSearchParams();
  const {
    liveSessionId,
    astrologerName = "Astrologer",
    astrologerImage = "",
    title = "Live Astrology Consultation",
  } = params;

  const [currentUser, setCurrentUser] = useState(null);
  const [viewersCount, setViewersCount] = useState(1);
  const [comments, setComments] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [recentGift, setRecentGift] = useState(null);
  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [liveVideoFrame, setLiveVideoFrame] = useState(null);

  const [joinLiveMutation] = useJoinLiveSessionMutation();
  const [leaveLiveMutation] = useLeaveLiveSessionMutation();
  const { data: walletData } = useGetWalletBalanceQuery();

  const agoraEngineRef = useRef(null);
  const giftAnim = useRef(new Animated.Value(0)).current;
  const commentsListRef = useRef(null);
  const sessionEndedRef = useRef(false);
  const broadcastChannelRef = useRef(null);

  // Load User Data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        if (raw) {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed?.user || parsed);
        }
      } catch (e) {}
    };
    loadUser();
  }, []);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Multi-tab real-time sync via BroadcastChannel (Web)
  useEffect(() => {
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      try {
        const channel = new window.BroadcastChannel("vavi_live_stream_sync");
        broadcastChannelRef.current = channel;

        // Notify host that audience joined
        channel.postMessage({
          type: "audience_joined",
          user: currentUserRef.current || { id: "user", name: "Devotee" },
        });

        // Periodic heartbeat to keep host viewer count in sync
        const heartbeatInterval = setInterval(() => {
          try {
            channel.postMessage({
              type: "audience_heartbeat",
              user: currentUserRef.current || { id: "user", name: "Devotee" },
            });
          } catch (e) {}
        }, 2000);

        channel.onmessage = (event) => {
          const data = event.data;

          if (data?.type === "live_video_frame") {
            setLiveVideoFrame(data.frame);
          } else if (data?.type === "live_stream_ended") {
            if (sessionEndedRef.current) return;
            sessionEndedRef.current = true;
            if (Platform.OS === "web") {
              if (typeof window !== "undefined") {
                window.alert("The astrologer has ended this live broadcast. Thank you for joining!");
              }
              router.back();
            } else {
              Alert.alert(
                "Live Stream Ended",
                "The astrologer has ended this live broadcast. Thank you for joining!",
                [{ text: "OK", onPress: () => router.back() }],
              );
            }
          } else if (data?.type === "live_chat_message") {
            setComments((prev) => [
              ...prev.slice(-40),
              {
                id: data?.id || String(Date.now() + Math.random()),
                userName: data?.user?.name || data?.userName || "Devotee",
                message: data?.message || "",
              },
            ]);
          } else if (data?.type === "live_gift_received") {
            showGiftToast(data);
          }
        };

        return () => {
          clearInterval(heartbeatInterval);
          try {
            channel.postMessage({
              type: "audience_left",
              user: currentUserRef.current || { id: "user", name: "Devotee" },
            });
            channel.close();
          } catch (e) {}
        };
      } catch (e) {
        console.log(LOG_TAG, "BroadcastChannel setup error:", e);
      }
    }
  }, []);

  // Show Gift Notification Toast
  const showGiftToast = useCallback(
    (giftData) => {
      setRecentGift(giftData);
      giftAnim.setValue(0);
      Animated.sequence([
        Animated.spring(giftAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(giftAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => setRecentGift(null));
    },
    [giftAnim],
  );

  // Join Live Stream (API + Agora + Socket)
  useEffect(() => {
    if (!liveSessionId) return;

    let isMounted = true;

    const joinStream = async () => {
      try {
        console.log(LOG_TAG, "Joining live session ID:", liveSessionId);

        // 1. Call Join Live API to get Agora audience credentials
        let agoraToken = "";
        let channelName = `live_${liveSessionId}`;
        let uid = Math.floor(Math.random() * 80000) + 10000;

        try {
          const res = await joinLiveMutation(liveSessionId).unwrap();
          console.log(LOG_TAG, "Join Live API response:", res);
          const data = res?.data || res;
          if (data?.agora) {
            agoraToken = data.agora.token || "";
            channelName = data.agora.channelName || channelName;
            uid = data.agora.uid || uid;
          }
        } catch (apiErr) {
          console.log(LOG_TAG, "Join Live API fallback:", apiErr);
        }

        if (!isMounted) return;

        // 2. Setup Agora Audience Video RTC (Safe for Expo Go & Dev Builds)
        try {
          if (createAgoraRtcEngine && AGORA_APP_ID) {
            const engine = createAgoraRtcEngine();
            if (engine && typeof engine.initialize === "function") {
              agoraEngineRef.current = engine;
              engine.initialize({ appId: AGORA_APP_ID });
              engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
              engine.setClientRole(ClientRoleType.ClientRoleAudience);
              engine.enableAudio();
              engine.enableVideo();
              engine.setDefaultAudioRouteToSpeakerphone(true);
              if (agoraToken) {
                await engine.joinChannel(agoraToken, channelName, null, uid);
                console.log(LOG_TAG, "Agora audience joined channel:", channelName);
              }
            }
          }
        } catch (agoraErr) {
          console.log(LOG_TAG, "Expo Go / Agora native module notice:", agoraErr?.message || agoraErr);
        }

        // 3. Connect Socket & Join Room
        const socket = await connectChatSocket();
        if (socket && isMounted) {
          const userObj = currentUser || {
            id: `user_${Date.now()}`,
            name: "Devotee",
          };

          const joinPayload = {
            liveSessionId: String(liveSessionId),
            user: {
              id: userObj?.id || userObj?._id || "user",
              name: userObj?.name || "Devotee",
            },
            role: "audience",
          };

          const emitJoin = () => {
            console.log(LOG_TAG, "Emitting join_live_room (audience):", joinPayload);
            socket.emit("join_live_room", joinPayload);
          };

          if (socket.connected) {
            emitJoin();
          } else {
            socket.once("connect", emitJoin);
          }

          // Handle viewer count updates
          const handleAudienceCount = (data) => {
            const count = typeof data === "number"
              ? data
              : Number(data?.viewersCount ?? data?.count ?? data?.viewerCount ?? 1);
            if (!isNaN(count) && isMounted) {
              console.log(LOG_TAG, "Audience viewer count update:", count);
              setViewersCount(Math.max(1, count));
            }
          };

          socket.on("viewer_count_update", handleAudienceCount);
          socket.on("viewers_count_update", handleAudienceCount);
          socket.on("live_viewers_count", handleAudienceCount);
          socket.on("viewer_count", handleAudienceCount);

          socket.on("user_joined_live", (data) => {
            if (data?.viewersCount != null) {
              handleAudienceCount(data.viewersCount);
            } else if (isMounted) {
              setViewersCount((prev) => prev + 1);
            }
          });

          socket.on("audience_joined", (data) => {
            if (data?.viewersCount != null) {
              handleAudienceCount(data.viewersCount);
            } else if (isMounted) {
              setViewersCount((prev) => prev + 1);
            }
          });

          socket.on("user_left_live", (data) => {
            if (data?.viewersCount != null) {
              handleAudienceCount(data.viewersCount);
            } else if (isMounted) {
              setViewersCount((prev) => Math.max(1, prev - 1));
            }
          });

          socket.on("audience_left", (data) => {
            if (data?.viewersCount != null) {
              handleAudienceCount(data.viewersCount);
            } else if (isMounted) {
              setViewersCount((prev) => Math.max(1, prev - 1));
            }
          });

          // Catch-all tap for viewer count
          socket.onAny((event, ...args) => {
            if (typeof event === "string" && (event.includes("viewer") || event.includes("count"))) {
              handleAudienceCount(args[0]);
            }
          });

          // Live video frames from host (Socket broadcast)
          socket.on("live_video_frame", (data) => {
            if (isMounted) {
              setLiveVideoFrame(data?.frame || (typeof data === "string" ? data : null));
            }
          });
          socket.on("send_live_video_frame", (data) => {
            if (isMounted) {
              setLiveVideoFrame(data?.frame || (typeof data === "string" ? data : null));
            }
          });

          // Live chat messages
          socket.on("live_chat_message", (data) => {
            if (isMounted) {
              setComments((prev) => [
                ...prev.slice(-40),
                {
                  id: data?.id || String(Date.now() + Math.random()),
                  userName: data?.user?.name || data?.userName || "Devotee",
                  message: data?.message || "",
                },
              ]);
            }
          });

          // Live gift received
          socket.on("live_gift_received", (data) => {
            if (isMounted) showGiftToast(data);
          });

          // Live stream ended by host
          socket.on("live_stream_ended", () => {
            if (sessionEndedRef.current) return;
            sessionEndedRef.current = true;
            if (Platform.OS === "web") {
              if (typeof window !== "undefined") {
                window.alert("The astrologer has ended this live broadcast. Thank you for joining!");
              }
              router.back();
            } else {
              Alert.alert(
                "Live Stream Ended",
                "The astrologer has ended this live broadcast. Thank you for joining!",
                [{ text: "OK", onPress: () => router.back() }],
              );
            }
          });

          setIsJoined(true);
        }
      } catch (err) {
        console.log(LOG_TAG, "Join stream error:", err);
      }
    };

    joinStream();

    return () => {
      isMounted = false;
      cleanupStream();
    };
  }, [liveSessionId, currentUser]);

  // Cleanup Agora & Socket on exit
  const cleanupStream = useCallback(async () => {
    try {
      await leaveLiveMutation(liveSessionId).unwrap();
    } catch (e) {}

    const socket = getChatSocket();
    if (socket && liveSessionId) {
      socket.emit("leave_live_room", { liveSessionId, role: "audience" });
      socket.off("viewer_count_update");
      socket.off("live_chat_message");
      socket.off("live_gift_received");
      socket.off("live_stream_ended");
    }

    if (agoraEngineRef.current) {
      try {
        await agoraEngineRef.current.leaveChannel();
        await agoraEngineRef.current.release();
      } catch (e) {}
      agoraEngineRef.current = null;
    }
  }, [liveSessionId]);

  // Send Live Comment
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const socket = getChatSocket();
    const userObj = currentUser || { id: "user", name: "Devotee" };

    const payload = {
      liveSessionId: String(liveSessionId),
      user: {
        id: userObj?.id || userObj?._id || "user",
        name: userObj?.name || "Devotee",
      },
      message: chatInput.trim(),
    };

    console.log(LOG_TAG, "Emitting send_live_chat_message:", payload);
    if (socket) {
      socket.emit("send_live_chat_message", payload);
    }

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: "live_chat_message",
          user: {
            id: userObj?.id || userObj?._id || "user",
            name: userObj?.name || "Devotee",
          },
          message: chatInput.trim(),
        });
      } catch (e) {}
    }

    // Append locally
    setComments((prev) => [
      ...prev.slice(-40),
      {
        id: String(Date.now()),
        userName: userObj?.name || "You",
        message: chatInput.trim(),
      },
    ]);
    setChatInput("");
  };

  // Send Gift Handler
  const handleSendGift = (gift) => {
    setShowGiftSheet(false);
    const socket = getChatSocket();
    const userObj = currentUser || { id: "user", name: "Devotee" };

    const payload = {
      liveSessionId: String(liveSessionId),
      user: {
        id: userObj?.id || userObj?._id || "user",
        name: userObj?.name || "Devotee",
      },
      gift: {
        id: gift.id,
        name: gift.name,
        emoji: gift.emoji,
        coins: gift.coins,
      },
    };

    console.log(LOG_TAG, "Emitting send_live_gift:", payload);
    if (socket) {
      socket.emit("send_live_gift", payload);
    }

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: "live_gift_received",
          user: {
            id: userObj?.id || userObj?._id || "user",
            name: userObj?.name || "Devotee",
          },
          gift: {
            id: gift.id,
            name: gift.name,
            emoji: gift.emoji,
            coins: gift.coins,
          },
        });
      } catch (e) {}
    }

    showGiftToast(payload);
  };

  // Handle Close / Exit
  const handleClose = () => {
    router.back();
  };

  // Android Back Handler
  useEffect(() => {
    const onBackPress = () => {
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, []);

  const imageSource = astrologerImage
    ? resolveImageUri(astrologerImage)
    : require("../../assets/images/background.png");

  // Toggle Speaker
  const handleToggleSpeaker = () => {
    const next = !isSpeakerMuted;
    setIsSpeakerMuted(next);
    if (agoraEngineRef.current?.muteAllRemoteAudioStreams) {
      agoraEngineRef.current.muteAllRemoteAudioStreams(next);
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Video Broadcast Feed / Background */}
      <View style={styles.videoSurface}>
        <Image
          source={imageSource}
          resizeMode="cover"
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.darkTint} />

        {liveVideoFrame && (
          <Image
            source={{ uri: liveVideoFrame }}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.hostBadge}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarInitial}>
                {astrologerName ? astrologerName[0].toUpperCase() : "A"}
              </Text>
            </View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostName} numberOfLines={1}>
                {astrologerName}
              </Text>
              <Text style={styles.streamTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>

          <View style={styles.topRight}>
            <View style={styles.viewersBadge}>
              <Ionicons name="eye" size={RF(13)} color="#fff" />
              <Text style={styles.viewersCount}>{viewersCount}</Text>
            </View>

            <TouchableOpacity
              style={styles.speakerButton}
              onPress={handleToggleSpeaker}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSpeakerMuted ? "volume-mute" : "volume-high"}
                size={RF(17)}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={RF(20)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gift Animation Toast */}
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
                {recentGift?.gift?.coins || 10} Coins 🪙
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Bottom Interactive Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.bottomArea}
        >
          {/* Floating Comments */}
          <View style={styles.commentsBox}>
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
                <Text style={styles.emptyCommentsText}>
                  Welcome to the live session! Type a message below to ask a question.
                </Text>
              }
            />
          </View>

          {/* Input & Gift Bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask something..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.sendBtn, !chatInput.trim() && styles.sendBtnDisabled]}
                onPress={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Ionicons name="send" size={RF(16)} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.giftButton}
              onPress={() => setShowGiftSheet(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="gift" size={RF(22)} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Gift Selector Modal */}
        <GiftBottomSheet
          visible={showGiftSheet}
          onClose={() => setShowGiftSheet(false)}
          onSendGift={handleSendGift}
          userBalance={walletData?.balance || 500}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0a14",
  },
  videoSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#161022",
  },
  darkTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(0.8),
  },
  hostBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(6),
    gap: wp(2),
    maxWidth: wp(56),
  },
  avatarWrap: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
  },
  streamTitle: {
    color: "#ffc107",
    fontSize: RF(9.5),
    fontWeight: "500",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  viewersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: wp(1),
  },
  viewersCount: {
    color: "#fff",
    fontSize: RF(11),
    fontWeight: "600",
  },
  speakerButton: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
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
  bottomArea: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
  },
  commentsBox: {
    height: hp(26),
    marginBottom: hp(1.2),
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
  emptyCommentsText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: RF(11),
    fontStyle: "italic",
    paddingTop: hp(2),
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: wp(6),
    paddingHorizontal: wp(3.5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: RF(12),
    paddingVertical: hp(1.2),
  },
  sendBtn: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(1),
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  giftButton: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
