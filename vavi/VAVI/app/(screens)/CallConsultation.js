// app/(screens)/CallConsultation.js
// 1:1 Private Zoom-Style Video Consultation Call screen for VAVI User App.
// Follows Section A of Voice & Video Call Consultation Guide (1_voice_video_call_consultation_guide.md).

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../constants/Colors";
import { RF, hp, wp } from "../../utils/responsive";
import { resolveImageUri } from "../../config/api";
import { AGORA_APP_ID } from "../../constants/AgoraConfig";
import {
  useGetCallTokenMutation,
  useGetConsultationHistoryQuery,
} from "../../redux/consultationApi";
import {
  connectCallSocket,
  disconnectCallSocket,
  endCallConsultation,
  joinCallConsultation,
  onCallConnectionStatusChange,
  removeCallListeners,
} from "../../services/callSocketService";

// Safe Agora loader for dev/web resilience
let createAgoraRtcEngine = null;
try {
  const agoraModule = require("react-native-agora");
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
} catch (_e) {
  console.log("[CallConsultation] react-native-agora native module not loaded; running in web/mock mode.");
}

const LOG_TAG = "[CallConsultation]";
const ORANGE = "#ff6a00";

export default function CallConsultation() {
  const params = useLocalSearchParams();
  const {
    consultationId,
    astrologerName = "Astrologer",
    astrologerImage = "",
    maxDuration = "1500",
    ratePerMinute = "25",
  } = params;

  const [currentUser, setCurrentUser] = useState(null);
  const [callStatus, setCallStatus] = useState("ringing"); // "ringing" | "connected" | "ended"
  const [secondsLeft, setSecondsLeft] = useState(Number(maxDuration) || 1500);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [amountDeducted, setAmountDeducted] = useState(0);

  // Video Feeds (Web & Native)
  const [remoteVideoFrame, setRemoteVideoFrame] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const [getCallToken] = useGetCallTokenMutation();

  const agoraEngineRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const broadcastChannelRef = useRef(null);
  const localWebStreamRef = useRef(null);
  const localVideoTagRef = useRef(null);
  const endAlertShownRef = useRef(false);

  // Callback ref for resilient video element attachment
  const localVideoRefCallback = useCallback(
    (node) => {
      localVideoTagRef.current = node;
      if (node && localStream) {
        node.srcObject = localStream;
        node.play().catch(() => {});
      }
    },
    [localStream],
  );

  useEffect(() => {
    if (localVideoTagRef.current && localStream) {
      localVideoTagRef.current.srcObject = localStream;
      localVideoTagRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Format timer MM:SS
  const formatTimer = (secs) => {
    if (secs == null || isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Ringing pulse animation
  useEffect(() => {
    if (callStatus === "ringing") {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [callStatus, pulseAnim]);

  // Load current user
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

  // Multi-tab BroadcastChannel sync for real-time video/events on Web
  useEffect(() => {
    if (!consultationId) return;

    if (typeof window !== "undefined" && window.BroadcastChannel) {
      try {
        const channelName = `call_sync_${consultationId}`;
        const channel = new window.BroadcastChannel(channelName);
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
          const data = event.data;
          console.log(LOG_TAG, "BroadcastChannel message:", data);

          if (data?.type === "call_started" || data?.type === "astrologer_accept_call") {
            if (callStatus === "ringing") {
              handleCallStarted({ maxDurationSeconds: data?.maxDurationSeconds || maxDuration });
            }
          } else if (data?.type === "remote_video_frame") {
            setRemoteVideoFrame(data.frame);
          } else if (data?.type === "call_ended") {
            handleCallEndedEvent({ message: "Astrologer ended the call." });
          }
        };

        return () => {
          channel.close();
        };
      } catch (e) {
        console.log(LOG_TAG, "BroadcastChannel error:", e);
      }
    }
  }, [consultationId, callStatus, maxDuration]);

  // Local Web Camera Hook
  useEffect(() => {
    let active = true;
    if (callStatus === "connected" && Platform.OS === "web" && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
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
          localWebStreamRef.current = stream;
          setLocalStream(stream);
          if (localVideoTagRef.current) {
            localVideoTagRef.current.srcObject = stream;
            localVideoTagRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.log(LOG_TAG, "Web Camera access error:", err.message);
        });

      return () => {
        active = false;
        if (localWebStreamRef.current) {
          localWebStreamRef.current.getTracks().forEach((t) => t.stop());
          localWebStreamRef.current = null;
        }
        setLocalStream(null);
      };
    }
  }, [callStatus, isFrontCamera]);

  // Stream local webcam frames to the astrologer tab (Web)
  useEffect(() => {
    if (callStatus !== "connected" || isCameraOff || Platform.OS !== "web") return;

    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const interval = setInterval(() => {
      if (localVideoTagRef.current && broadcastChannelRef.current && ctx) {
        try {
          if (localVideoTagRef.current.videoWidth > 0) {
            ctx.drawImage(localVideoTagRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
            broadcastChannelRef.current.postMessage({
              type: "client_video_frame",
              frame: dataUrl,
            });
          }
        } catch (e) {}
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({ type: "client_video_frame", frame: null });
        } catch (e) {}
      }
    };
  }, [callStatus, isCameraOff]);

  // Cleanup Agora Engine
  const cleanupAgora = useCallback(async () => {
    if (agoraEngineRef.current) {
      try {
        await agoraEngineRef.current.leaveChannel();
        await agoraEngineRef.current.release();
      } catch (e) {
        console.log(LOG_TAG, "Agora cleanup error:", e);
      }
      agoraEngineRef.current = null;
    }
    if (localWebStreamRef.current) {
      localWebStreamRef.current.getTracks().forEach((t) => t.stop());
      localWebStreamRef.current = null;
    }
  }, []);

  // Step 3: Handle Call Accept (`call_started` event)
  const handleCallStarted = useCallback(
    async (data) => {
      console.log(LOG_TAG, "call_started event received:", data);
      setCallStatus("connected");

      const duration = data?.maxDurationSeconds || Number(maxDuration) || 1500;
      setSecondsLeft(duration);
      setCallDurationSeconds(0);

      // Countdown Timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleEndCall("time_expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Duration Timer
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);

      // Fetch Agora Token & Join Video RTC
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ]);
        }

        console.log(LOG_TAG, "Fetching Agora token for:", consultationId);
        const tokenRes = await getCallToken(consultationId).unwrap();
        const agoraData = tokenRes?.data?.agora || tokenRes?.agora;

        if (agoraData && createAgoraRtcEngine) {
          const { token, channelName, uid, appId } = agoraData;
          console.log(LOG_TAG, "Joining Agora 2-Way Video Call:", channelName, "uid:", uid);

          const engine = createAgoraRtcEngine();
          agoraEngineRef.current = engine;

          engine.initialize({
            appId: appId || agoraData.app_id || AGORA_APP_ID,
            channelProfile: 0, // ChannelProfileCommunication (0: 1:1 call)
          });

          engine.enableAudio();
          engine.enableVideo();
          engine.startPreview();

          engine.joinChannel(token, channelName, Number(uid) || 0, {
            clientRoleType: 1,
            publishMicrophoneTrack: true,
            publishCameraTrack: true,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          });
        }
      } catch (err) {
        console.log(LOG_TAG, "Agora RTC setup notice:", err?.message || err);
      }
    },
    [consultationId, getCallToken, maxDuration],
  );

  // Step 4: Handle Call Ended Event
  const handleCallEndedEvent = useCallback(
    (data) => {
      console.log(LOG_TAG, "call_ended event received:", data);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      cleanupAgora();
      setCallStatus("ended");

      // Calculate amount deducted based on duration & rate
      const mins = Math.max(1, Math.ceil(callDurationSeconds / 60));
      const rate = Number(ratePerMinute) || 25;
      const totalAmount = data?.amount || mins * rate;
      setAmountDeducted(totalAmount);

      setShowSummaryModal(true);
    },
    [cleanupAgora, callDurationSeconds, ratePerMinute],
  );

  // Fallback Polling / History Sync
  const { data: consultationHistoryData } = useGetConsultationHistoryQuery(
    { page: 1, limit: 10 },
    { pollingInterval: 2500, skip: !consultationId },
  );

  useEffect(() => {
    if (!consultationId || callStatus === "ended") return;

    const consultationsList = Array.isArray(consultationHistoryData?.data?.consultations)
      ? consultationHistoryData.data.consultations
      : Array.isArray(consultationHistoryData?.consultations)
      ? consultationHistoryData.consultations
      : Array.isArray(consultationHistoryData?.data)
      ? consultationHistoryData.data
      : [];

    const match = consultationsList.find((c) => c.id === consultationId);
    if (!match) return;

    if (match.status === "ongoing" && callStatus === "ringing") {
      console.log(LOG_TAG, "Consultation is ongoing — starting 2-way video call!");
      handleCallStarted({ maxDurationSeconds: match.maxDuration });
    } else if (["completed", "missed", "cancelled"].includes(match.status) && callStatus !== "ended") {
      handleCallEndedEvent({ message: `Call was ${match.status}.` });
    }
  }, [consultationHistoryData, consultationId, callStatus, handleCallStarted, handleCallEndedEvent]);

  // Step 2: Setup Socket
  useEffect(() => {
    if (!consultationId || !currentUser?.id) return;

    let isMounted = true;

    const setup = async () => {
      console.log(LOG_TAG, "Setting up Call Socket for:", consultationId);
      const socket = await connectCallSocket();
      if (!isMounted) return;

      joinCallConsultation({
        consultationId,
        userId: currentUser.id,
        role: "user",
      });

      socket.on("call_started", handleCallStarted);
      socket.on("consultation_started", handleCallStarted);
      socket.on("call_accepted", handleCallStarted);
      socket.on("call_ended", handleCallEndedEvent);
    };

    setup();

    return () => {
      isMounted = false;
      removeCallListeners();
    };
  }, [consultationId, currentUser, handleCallStarted, handleCallEndedEvent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      cleanupAgora();
    };
  }, [cleanupAgora]);

  // Media Controls Handlers
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (localWebStreamRef.current) {
      localWebStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !next));
    }
    if (agoraEngineRef.current?.muteLocalAudioStream) {
      agoraEngineRef.current.muteLocalAudioStream(next);
    }
  };

  const handleToggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);
    if (localWebStreamRef.current) {
      localWebStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !next));
    }
    if (agoraEngineRef.current?.muteLocalVideoStream) {
      agoraEngineRef.current.muteLocalVideoStream(next);
    }
  };

  const handleSwitchCamera = () => {
    setIsFrontCamera((prev) => !prev);
    if (agoraEngineRef.current?.switchCamera) {
      agoraEngineRef.current.switchCamera();
    }
  };

  const handleToggleSpeaker = () => {
    const next = !isSpeaker;
    setIsSpeaker(next);
    if (agoraEngineRef.current?.setEnableSpeakerphone) {
      agoraEngineRef.current.setEnableSpeakerphone(next);
    }
  };

  // End Call Handler
  const handleEndCall = (reason = "completed") => {
    console.log(LOG_TAG, "Client ending call:", reason);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: "call_ended", reason });
      } catch (e) {}
    }

    endCallConsultation(consultationId, reason);
    cleanupAgora();
    setCallStatus("ended");

    const mins = Math.max(1, Math.ceil(callDurationSeconds / 60));
    const rate = Number(ratePerMinute) || 25;
    setAmountDeducted(mins * rate);
    setShowSummaryModal(true);
  };

  // Android Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (callStatus === "connected") {
        if (Platform.OS === "web") {
          if (window.confirm("Do you want to end this video call consultation?")) {
            handleEndCall("client_hung_up");
          }
        } else {
          Alert.alert("End Consultation", "Are you sure you want to end this video call?", [
            { text: "Cancel", style: "cancel" },
            { text: "End Call", style: "destructive", onPress: () => handleEndCall("client_hung_up") },
          ]);
        }
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [callStatus]);

  const astrologerImgSource = astrologerImage
    ? resolveImageUri(astrologerImage)
    : require("../../assets/images/background.png");

  return (
    <View style={styles.container}>
      {/* =========================================================================
          1. RINGING / CALLING STATE
          ========================================================================= */}
      {callStatus === "ringing" && (
        <SafeAreaView style={styles.ringingSafeArea}>
          <View style={styles.ringingHeader}>
            <Text style={styles.callingLabel}>Calling Astrologer...</Text>
            <Text style={styles.waitingSub}>Connecting 2-Way Video Consultation</Text>
          </View>

          <View style={styles.avatarCenterWrap}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.ringingAvatarCircle}>
              <Image source={astrologerImgSource} style={styles.ringingAvatarImg} />
            </View>
            <Text style={styles.astrologerNameRinging}>{astrologerName}</Text>
            <Text style={styles.rateBadgeText}>₹{ratePerMinute}/min • Private Zoom Video Call</Text>
          </View>

          <View style={styles.ringingActions}>
            <TouchableOpacity
              style={styles.cancelCallBtn}
              onPress={() => handleEndCall("cancelled_by_user")}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={RF(28)} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </View>
        </SafeAreaView>
      )}

      {/* =========================================================================
          2. CONNECTED 2-WAY ZOOM VIDEO CALL STATE
          ========================================================================= */}
      {callStatus === "connected" && (
        <View style={styles.connectedContainer}>
          {/* Main Full-Screen View: Remote Astrologer Video */}
          <View style={styles.remoteVideoSurface}>
            {remoteVideoFrame ? (
              <Image source={{ uri: remoteVideoFrame }} resizeMode="cover" style={StyleSheet.absoluteFillObject} />
            ) : (
              <View style={styles.remotePlaceholder}>
                <Image source={astrologerImgSource} style={styles.remotePlaceholderImg} />
                <Text style={styles.remotePlaceholderName}>{astrologerName}</Text>
                <Text style={styles.remotePlaceholderSub}>Connecting live video stream...</Text>
              </View>
            )}
            <View style={styles.videoOverlayGradient} />
          </View>

          {/* Picture-in-Picture (PiP): Floating Local User Camera Preview */}
          <View style={styles.pipContainer}>
            {Platform.OS === "web" && !isCameraOff ? (
              <video
                ref={localVideoRefCallback}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: isFrontCamera ? "scaleX(-1)" : "none",
                }}
              />
            ) : isCameraOff ? (
              <View style={styles.cameraOffPip}>
                <Ionicons name="videocam-off" size={RF(20)} color="#fff" />
                <Text style={styles.cameraOffText}>Cam Off</Text>
              </View>
            ) : (
              <View style={styles.cameraOffPip}>
                <Ionicons name="person" size={RF(24)} color="#fff" />
              </View>
            )}
            <View style={styles.pipLabelBadge}>
              <Text style={styles.pipLabelText}>You</Text>
            </View>
          </View>

          {/* Top Bar: Timer, Rate & Astrologer Info */}
          <SafeAreaView style={styles.topOverlayBar} edges={["top"]}>
            <View style={styles.hostHeaderBadge}>
              <Image source={astrologerImgSource} style={styles.smallAvatar} />
              <View>
                <Text style={styles.headerHostName} numberOfLines={1}>{astrologerName}</Text>
                <Text style={styles.headerRateText}>₹{ratePerMinute}/min</Text>
              </View>
            </View>

            <View style={styles.timerBadge}>
              <View style={styles.redDot} />
              <Text style={styles.timerText}>{formatTimer(secondsLeft)}</Text>
            </View>
          </SafeAreaView>

          {/* Bottom Zoom-Style Control Bar */}
          <View style={styles.bottomControlBar}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={handleToggleMute}
              activeOpacity={0.8}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={RF(22)} color="#fff" />
              <Text style={styles.controlBtnLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>

            {/* Camera On/Off */}
            <TouchableOpacity
              style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
              onPress={handleToggleCamera}
              activeOpacity={0.8}
            >
              <Ionicons name={isCameraOff ? "videocam-off" : "videocam"} size={RF(22)} color="#fff" />
              <Text style={styles.controlBtnLabel}>{isCameraOff ? "Start Cam" : "Stop Cam"}</Text>
            </TouchableOpacity>

            {/* Flip Camera */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleSwitchCamera}
              activeOpacity={0.8}
            >
              <Ionicons name="camera-reverse" size={RF(22)} color="#fff" />
              <Text style={styles.controlBtnLabel}>Flip</Text>
            </TouchableOpacity>

            {/* Speaker Toggle */}
            <TouchableOpacity
              style={[styles.controlBtn, !isSpeaker && styles.controlBtnActive]}
              onPress={handleToggleSpeaker}
              activeOpacity={0.8}
            >
              <Ionicons name={isSpeaker ? "volume-high" : "volume-mute"} size={RF(22)} color="#fff" />
              <Text style={styles.controlBtnLabel}>{isSpeaker ? "Speaker" : "Ear-piece"}</Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => handleEndCall("client_hung_up")}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={RF(24)} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
              <Text style={styles.endBtnLabel}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =========================================================================
          3. CALL SUMMARY MODAL
          ========================================================================= */}
      {showSummaryModal && (
        <View style={styles.summaryModalOverlay}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconCircle}>
              <Ionicons name="checkmark-circle" size={RF(48)} color="#4CAF50" />
            </View>

            <Text style={styles.summaryTitle}>Consultation Completed</Text>
            <Text style={styles.summarySub}>Your private video session with {astrologerName} has ended.</Text>

            <View style={styles.summaryStatsGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>{formatTimer(callDurationSeconds)}</Text>
                <Text style={styles.summaryLbl}>Duration</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>₹{amountDeducted}</Text>
                <Text style={styles.summaryLbl}>Deducted</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>₹{ratePerMinute}/min</Text>
                <Text style={styles.summaryLbl}>Rate</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.returnHomeBtn}
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.88}
            >
              <Text style={styles.returnHomeText}>Return to Astrologers</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0914",
  },
  // Ringing Screen Styles
  ringingSafeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(4),
  },
  ringingHeader: {
    alignItems: "center",
    marginTop: hp(2),
  },
  callingLabel: {
    fontSize: RF(20),
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  waitingSub: {
    fontSize: RF(12),
    color: "#aaa",
    marginTop: hp(0.6),
  },
  avatarCenterWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: wp(52),
    height: wp(52),
    borderRadius: wp(26),
    backgroundColor: "rgba(255, 106, 0, 0.2)",
  },
  ringingAvatarCircle: {
    width: wp(38),
    height: wp(38),
    borderRadius: wp(19),
    overflow: "hidden",
    borderWidth: 3,
    borderColor: ORANGE,
    backgroundColor: "#222",
  },
  ringingAvatarImg: {
    width: "100%",
    height: "100%",
  },
  astrologerNameRinging: {
    fontSize: RF(18),
    fontWeight: "700",
    color: "#fff",
    marginTop: hp(2.5),
  },
  rateBadgeText: {
    fontSize: RF(12),
    color: "#FFB300",
    fontWeight: "600",
    marginTop: hp(0.6),
  },
  ringingActions: {
    alignItems: "center",
    marginBottom: hp(2),
  },
  cancelCallBtn: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  cancelLabel: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "600",
    marginTop: hp(1),
  },

  // Connected Video Screen Styles
  connectedContainer: {
    flex: 1,
    position: "relative",
  },
  remoteVideoSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#130f24",
  },
  remotePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  remotePlaceholderImg: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    borderWidth: 2,
    borderColor: ORANGE,
    marginBottom: hp(2),
  },
  remotePlaceholderName: {
    color: "#fff",
    fontSize: RF(16),
    fontWeight: "700",
  },
  remotePlaceholderSub: {
    color: "#888",
    fontSize: RF(11),
    marginTop: hp(0.4),
  },
  videoOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  // PiP Window
  pipContainer: {
    position: "absolute",
    top: hp(12),
    right: wp(4),
    width: wp(28),
    height: hp(18),
    borderRadius: wp(3),
    overflow: "hidden",
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 8,
    zIndex: 100,
  },
  cameraOffPip: {
    flex: 1,
    backgroundColor: "#2a2638",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOffText: {
    color: "#aaa",
    fontSize: RF(9),
    marginTop: hp(0.4),
  },
  pipLabelBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.2),
    borderRadius: wp(1),
  },
  pipLabelText: {
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "600",
  },

  // Top Bar
  topOverlayBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    zIndex: 90,
  },
  hostHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(5),
    gap: wp(2),
  },
  smallAvatar: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
  },
  headerHostName: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
    maxWidth: wp(28),
  },
  headerRateText: {
    color: "#FFB300",
    fontSize: RF(9.5),
    fontWeight: "600",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    gap: wp(1.5),
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
  },
  timerText: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Bottom Controls Bar
  bottomControlBar: {
    position: "absolute",
    bottom: hp(4),
    left: wp(4),
    right: wp(4),
    backgroundColor: "rgba(18, 14, 30, 0.92)",
    borderRadius: wp(6),
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    elevation: 10,
    zIndex: 90,
  },
  controlBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(2),
  },
  controlBtnActive: {
    backgroundColor: "rgba(255, 59, 48, 0.35)",
    borderRadius: wp(3),
    paddingVertical: hp(0.4),
  },
  controlBtnLabel: {
    color: "#fff",
    fontSize: RF(9),
    marginTop: hp(0.4),
    fontWeight: "500",
  },
  endCallBtn: {
    backgroundColor: "#FF3B30",
    borderRadius: wp(4),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    alignItems: "center",
    justifyContent: "center",
  },
  endBtnLabel: {
    color: "#fff",
    fontSize: RF(9.5),
    fontWeight: "700",
    marginTop: hp(0.2),
  },

  // Summary Modal
  summaryModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(5),
    zIndex: 200,
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: "center",
  },
  summaryIconCircle: {
    marginBottom: hp(1.5),
  },
  summaryTitle: {
    fontSize: RF(18),
    fontWeight: "800",
    color: "#222",
  },
  summarySub: {
    fontSize: RF(11.5),
    color: "#666",
    textAlign: "center",
    marginTop: hp(0.6),
  },
  summaryStatsGrid: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: hp(2.5),
    backgroundColor: "#F8F5F2",
    borderRadius: wp(3),
    padding: wp(3),
  },
  summaryBox: {
    flex: 1,
    alignItems: "center",
  },
  summaryVal: {
    fontSize: RF(14),
    fontWeight: "800",
    color: ORANGE,
  },
  summaryLbl: {
    fontSize: RF(10),
    color: "#888",
    marginTop: hp(0.2),
  },
  returnHomeBtn: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    alignItems: "center",
  },
  returnHomeText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
