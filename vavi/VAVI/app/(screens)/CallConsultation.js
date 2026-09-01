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
  useCreateReviewMutation,
  useGetCallTokenMutation,
  useGetConsultationHistoryQuery,
} from "../../redux/consultationApi";
import PostConsultationReviewModal from "../../components/review/PostConsultationReviewModal";
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
  console.log(
    "[CallConsultation] react-native-agora native module not loaded; running in web/mock mode.",
  );
}

const LOG_TAG = "[CallConsultation]";
const ORANGE = "#ff6a00";

export default function CallConsultation() {
  const params = useLocalSearchParams();
  const {
    consultationId,
    astrologerId = params?.astrologerId,
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [amountDeducted, setAmountDeducted] = useState(0);
  const [userMessage, setUserMessage] = useState("");

  // Video Feeds (Web & Native)
  const [remoteVideoFrame, setRemoteVideoFrame] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const [getCallToken] = useGetCallTokenMutation();
  const [createReviewMutation] = useCreateReviewMutation();

  const agoraEngineRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const broadcastChannelRef = useRef(null);
  const localWebStreamRef = useRef(null);
  const localVideoTagRef = useRef(null);
  const endAlertShownRef = useRef(false);
  const callDurationSecondsRef = useRef(0);
  const hasJoinedAgoraRef = useRef(false);

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

          if (
            data?.type === "call_started" ||
            data?.type === "astrologer_accept_call"
          ) {
            if (callStatus === "ringing") {
              handleCallStarted({
                maxDurationSeconds: data?.maxDurationSeconds || maxDuration,
              });
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
    if (
      callStatus === "connected" &&
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.mediaDevices?.getUserMedia
    ) {
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
    if (callStatus !== "connected" || isCameraOff || Platform.OS !== "web")
      return;

    const canvas =
      typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const interval = setInterval(() => {
      if (localVideoTagRef.current && broadcastChannelRef.current && ctx) {
        try {
          if (localVideoTagRef.current.videoWidth > 0) {
            ctx.drawImage(
              localVideoTagRef.current,
              0,
              0,
              canvas.width,
              canvas.height,
            );
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
          broadcastChannelRef.current.postMessage({
            type: "client_video_frame",
            frame: null,
          });
        } catch (e) {}
      }
    };
  }, [callStatus, isCameraOff]);

  // Cleanup Agora Engine
  const cleanupAgora = useCallback(async () => {
    hasJoinedAgoraRef.current = false;
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

  // Setup Agora RTC immediately on screen mount
  const setupAgora = useCallback(async () => {
    if (
      !consultationId ||
      callStatusRef.current === "ended" ||
      hasJoinedAgoraRef.current
    )
      return;
    hasJoinedAgoraRef.current = true;

    try {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }

      let targetToken = Array.isArray(params?.agoraToken)
        ? params.agoraToken[0]
        : params?.agoraToken;
      let targetChannelName = Array.isArray(params?.channelName)
        ? params.channelName[0]
        : params?.channelName;
      let targetUid =
        Number(
          Array.isArray(params?.userUid) ? params.userUid[0] : params?.userUid,
        ) || 1;

      if (!targetToken) {
        console.log(
          LOG_TAG,
          "No initial params token, fetching User Agora token for:",
          consultationId,
        );
        try {
          const tokenRes = await getCallToken({
            consultationId,
            uid: 1,
            role: "user",
          }).unwrap();
          const agoraData =
            tokenRes?.data?.agora ||
            tokenRes?.agora ||
            tokenRes?.data ||
            tokenRes;
          targetToken = agoraData?.userToken || agoraData?.token || "";
          targetChannelName =
            agoraData?.channelName ||
            targetChannelName ||
            `call_${consultationId}`;
          targetUid = Number(agoraData?.userUid || agoraData?.uid) || 1;
        } catch (tokenErr) {
          console.log(
            LOG_TAG,
            "Token fetch notice:",
            tokenErr?.message || tokenErr,
          );
        }
      }

      const targetAppId = AGORA_APP_ID;
      targetChannelName = targetChannelName || `call_${consultationId}`;

      if (createAgoraRtcEngine) {
        console.log(
          LOG_TAG,
          "Joining Agora 2-Way Voice/Video Call as User on mount:",
          targetChannelName,
          "uid:",
          targetUid,
          "tokenPresent:",
          !!targetToken,
        );

        const engine = createAgoraRtcEngine();
        agoraEngineRef.current = engine;

        engine.initialize({
          appId: targetAppId,
          channelProfile: 0,
        });

        if (engine.registerEventHandler) {
          engine.registerEventHandler({
            onJoinChannelSuccess: (connection, elapsed) => {
              console.log(
                LOG_TAG,
                "Agora User onJoinChannelSuccess:",
                connection.channelId,
              );
              if (engine.enableLocalAudio) engine.enableLocalAudio(true);
              if (engine.setDefaultAudioRouteToSpeakerphone)
                engine.setDefaultAudioRouteToSpeakerphone(true);
              if (engine.setEnableSpeakerphone)
                engine.setEnableSpeakerphone(true);
              if (engine.muteLocalAudioStream)
                engine.muteLocalAudioStream(false);
              if (engine.muteAllRemoteAudioStreams)
                engine.muteAllRemoteAudioStreams(false);
            },
            onUserJoined: (connection, remoteUid, elapsed) => {
              console.log(
                LOG_TAG,
                "Agora User onUserJoined remoteUid:",
                remoteUid,
              );
              setCallStatus("connected");
              setPeerConnected(true);
              if (engine.muteRemoteAudioStream)
                engine.muteRemoteAudioStream(remoteUid, false);
            },
            onRemoteAudioStateChanged: (
              connection,
              remoteUid,
              state,
              reason,
              elapsed,
            ) => {
              console.log(
                LOG_TAG,
                "Agora User onRemoteAudioStateChanged:",
                remoteUid,
                state,
                reason,
              );
            },
            onError: (err, msg) => {
              console.log(LOG_TAG, "Agora User RTC Error:", err, msg);
            },
          });
        }

        if (engine.setAudioScenario) engine.setAudioScenario(0);
        if (engine.setClientRole) engine.setClientRole(1);
        engine.enableAudio();
        if (engine.enableLocalAudio) engine.enableLocalAudio(true);
        if (engine.setDefaultAudioRouteToSpeakerphone)
          engine.setDefaultAudioRouteToSpeakerphone(true);
        if (engine.setEnableSpeakerphone) engine.setEnableSpeakerphone(true);
        engine.enableVideo();

        if (engine.adjustRecordingSignalVolume)
          engine.adjustRecordingSignalVolume(100);
        if (engine.adjustPlaybackSignalVolume)
          engine.adjustPlaybackSignalVolume(100);
        if (engine.muteLocalAudioStream) engine.muteLocalAudioStream(false);
        if (engine.muteAllRemoteAudioStreams)
          engine.muteAllRemoteAudioStreams(false);

        engine.startPreview();

        engine.joinChannel(targetToken, targetChannelName, targetUid, {
          clientRoleType: 1,
          publishMicrophoneTrack: true,
          publishCameraTrack: true,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      }
    } catch (err) {
      console.log(LOG_TAG, "Agora User RTC setup notice:", err?.message || err);
    }
  }, [consultationId, getCallToken, maxDuration, params]);

  // Step 3: Handle Call Accept (`call_started` event)
  const handleCallStarted = useCallback(
    async (data) => {
      console.log(LOG_TAG, "call_started event received:", data);
      setCallStatus("connected");

      const duration = data?.maxDurationSeconds || Number(maxDuration) || 1500;
      setSecondsLeft(duration);
      callDurationSecondsRef.current = 0;
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
      if (durationIntervalRef.current)
        clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = setInterval(() => {
        callDurationSecondsRef.current += 1;
        setCallDurationSeconds(callDurationSecondsRef.current);
      }, 1000);
    },
    [maxDuration],
  );

  // Step 4: Handle Call Ended Event
  const handleCallEndedEvent = useCallback(
    (data) => {
      console.log(LOG_TAG, "call_ended event received:", data);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current)
        clearInterval(durationIntervalRef.current);
      cleanupAgora();
      setCallStatus("ended");

      // Calculate amount deducted based on duration & rate
      const mins = Math.max(1, Math.ceil(callDurationSecondsRef.current / 60));
      const rate = Number(ratePerMinute) || 25;
      const totalAmount =
        data?.amount || data?.consultation?.amount || mins * rate;
      setAmountDeducted(totalAmount);

      if (data?.userMessage) {
        setUserMessage(data.userMessage);
      } else if (data?.reason === "balance_exhausted") {
        setUserMessage(
          "Call ended automatically because your wallet balance was exhausted. Please recharge.",
        );
      }

      setShowSummaryModal(true);
    },
    [cleanupAgora, ratePerMinute],
  );

  const handleCallStartedRef = useRef(handleCallStarted);
  handleCallStartedRef.current = handleCallStarted;
  const handleCallEndedEventRef = useRef(handleCallEndedEvent);
  handleCallEndedEventRef.current = handleCallEndedEvent;
  const callStatusRef = useRef(callStatus);
  callStatusRef.current = callStatus;

  // Fallback Polling / History Sync
  const { data: consultationHistoryData } = useGetConsultationHistoryQuery(
    { page: 1, limit: 10 },
    { pollingInterval: 2500, skip: !consultationId || callStatus === "ended" },
  );

  useEffect(() => {
    if (!consultationId || callStatus === "ended") return;

    const consultationsList = Array.isArray(
      consultationHistoryData?.data?.consultations,
    )
      ? consultationHistoryData.data.consultations
      : Array.isArray(consultationHistoryData?.consultations)
        ? consultationHistoryData.consultations
        : Array.isArray(consultationHistoryData?.data)
          ? consultationHistoryData.data
          : [];

    const match = consultationsList.find((c) => c.id === consultationId);
    if (!match) return;

    if (match.status === "ongoing" && callStatus === "ringing") {
      console.log(
        LOG_TAG,
        "Consultation is ongoing — starting 2-way video call!",
      );
      handleCallStartedRef.current?.({ maxDurationSeconds: match.maxDuration });
    } else if (
      ["completed", "missed", "cancelled"].includes(match.status) &&
      callStatus !== "ended"
    ) {
      handleCallEndedEventRef.current?.({
        message: `Call was ${match.status}.`,
      });
    }
  }, [consultationHistoryData, consultationId, callStatus]);

  // Run Agora RTC setup immediately on mount
  useEffect(() => {
    setupAgora();
  }, [setupAgora]);

  // Step 2: Setup Socket
  useEffect(() => {
    if (
      !consultationId ||
      !currentUser?.id ||
      callStatusRef.current === "ended"
    )
      return;

    let isMounted = true;

    const setup = async () => {
      console.log(LOG_TAG, "Setting up Call Socket for:", consultationId);
      const socket = await connectCallSocket();
      if (!isMounted || callStatusRef.current === "ended") return;

      joinCallConsultation({
        consultationId,
        userId: currentUser.id,
        role: "user",
      });

      const onStarted = (data) => handleCallStartedRef.current?.(data);
      const onEnded = (data) => handleCallEndedEventRef.current?.(data);

      socket.on("call_started", onStarted);
      socket.on("consultation_started", onStarted);
      socket.on("call_accepted", onStarted);
      socket.on("call_ended", onEnded);
    };

    setup();

    return () => {
      isMounted = false;
      removeCallListeners();
    };
  }, [consultationId, currentUser?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current)
        clearInterval(durationIntervalRef.current);
      cleanupAgora();
    };
  }, [cleanupAgora]);

  // Media Controls Handlers
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (localWebStreamRef.current) {
      localWebStreamRef.current
        .getAudioTracks()
        .forEach((t) => (t.enabled = !next));
    }
    if (agoraEngineRef.current?.muteLocalAudioStream) {
      agoraEngineRef.current.muteLocalAudioStream(next);
    }
  };

  const handleToggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);
    if (localWebStreamRef.current) {
      localWebStreamRef.current
        .getVideoTracks()
        .forEach((t) => (t.enabled = !next));
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

    endCallConsultation({ consultationId, reason });
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
          if (
            window.confirm("Do you want to end this video call consultation?")
          ) {
            handleEndCall("client_hung_up");
          }
        } else {
          Alert.alert(
            "End Consultation",
            "Are you sure you want to end this video call?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "End Call",
                style: "destructive",
                onPress: () => handleEndCall("client_hung_up"),
              },
            ],
          );
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
            <Text style={styles.waitingSub}>Connecting</Text>
          </View>

          <View style={styles.avatarCenterWrap}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
            />
            <View style={styles.ringingAvatarCircle}>
              <Image
                source={astrologerImgSource}
                style={styles.ringingAvatarImg}
              />
            </View>
            <Text style={styles.astrologerNameRinging}>{astrologerName}</Text>
            <Text style={styles.rateBadgeText}>
              ₹{ratePerMinute}/min • Voice Call
            </Text>
          </View>

          <View style={styles.ringingActions}>
            <TouchableOpacity
              style={styles.cancelCallBtn}
              onPress={() => handleEndCall("cancelled_by_user")}
              activeOpacity={0.85}
            >
              <Ionicons
                name="call"
                size={RF(28)}
                color="#fff"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </TouchableOpacity>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </View>
        </SafeAreaView>
      )}

      {/* =========================================================================
          2. CONNECTED WHATSAPP-STYLE VOICE CALL STATE
          ========================================================================= */}
      {callStatus === "connected" && (
        <View style={styles.connectedContainer}>
          {/* Top Overlay Bar: Timer, Rate & Astrologer Info */}
          <SafeAreaView style={styles.topOverlayBar} edges={["top"]}>
            <View style={styles.hostHeaderBadge}>
              <Image source={astrologerImgSource} style={styles.smallAvatar} />
              <View>
                <Text style={styles.headerHostName} numberOfLines={1}>
                  {astrologerName}
                </Text>
                <Text style={styles.headerRateText}>
                  ₹{ratePerMinute}/min • Voice Call
                </Text>
              </View>
            </View>

            <View style={styles.timerBadge}>
              <View style={styles.redDot} />
              <Text style={styles.timerText}>{formatTimer(secondsLeft)}</Text>
            </View>
          </SafeAreaView>

          {/* Centered WhatsApp-Style Voice Avatar with Pulse Animation */}
          <View style={styles.voiceAvatarCenterWrap}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
            />
            <View style={styles.voiceAvatarCircle}>
              <Image
                source={astrologerImgSource}
                style={styles.voiceAvatarImg}
              />
            </View>
            <Text style={styles.voiceAstrologerName}>{astrologerName}</Text>
            <Text style={styles.voiceSubStatus}>
              Voice Consultation Connected
            </Text>

            {/* Client Icon Badge */}
            <View style={styles.clientBadgeBox}>
              <Ionicons name="person-circle" size={RF(22)} color="#ff6a00" />
              <Text style={styles.clientBadgeText}>
                You ({currentUser?.name || "Client"})
              </Text>
            </View>

            {/* Low Balance Warning Banner */}
            {secondsLeft <= 60 && callStatus === "connected" && (
              <View style={styles.warningBanner}>
                <Ionicons
                  name="warning-outline"
                  size={RF(16)}
                  color="#fdba74"
                />
                <Text style={styles.warningText}>
                  ⚠️ Less than 1 minute remaining! Call will auto-end when
                  balance is exhausted.
                </Text>
              </View>
            )}
          </View>

          {/* Bottom WhatsApp-Style Audio Control Bar */}
          <View style={styles.bottomControlBar}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={handleToggleMute}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isMuted ? "mic-off" : "mic"}
                size={RF(24)}
                color="#fff"
              />
              <Text style={styles.controlBtnLabel}>
                {isMuted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>

            {/* Speaker Toggle */}
            <TouchableOpacity
              style={[styles.controlBtn, !isSpeaker && styles.controlBtnActive]}
              onPress={handleToggleSpeaker}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSpeaker ? "volume-high" : "volume-mute"}
                size={RF(24)}
                color="#fff"
              />
              <Text style={styles.controlBtnLabel}>
                {isSpeaker ? "Speaker" : "Ear-piece"}
              </Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => handleEndCall("client_hung_up")}
              activeOpacity={0.85}
            >
              <Ionicons
                name="call"
                size={RF(26)}
                color="#fff"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
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
            <Text style={styles.summarySub}>
              {userMessage ||
                `Your private session with ${astrologerName} has ended.`}
            </Text>

            <View style={styles.summaryStatsGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>
                  {formatTimer(callDurationSeconds)}
                </Text>
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
              onPress={() => {
                setShowSummaryModal(false);
                setShowReviewModal(true);
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.returnHomeText}>Rate & Complete ⭐</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Post Consultation Rating & Review Modal */}
      <PostConsultationReviewModal
        visible={showReviewModal}
        onClose={() => router.replace("/(tabs)")}
        astrologer={{
          id: astrologerId,
          name: astrologerName,
          profilePic: astrologerImage,
        }}
        consultationId={consultationId}
        onSubmitReview={async (payload) => {
          try {
            await createReviewMutation(payload).unwrap();
          } catch (e) {
            console.log("[CallConsultation] createReview error:", e);
          }
          router.replace("/(tabs)");
        }}
      />
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
  voiceAvatarCenterWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceAvatarCircle: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    borderWidth: 3,
    borderColor: ORANGE,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c1830",
    marginBottom: hp(2),
  },
  voiceAvatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  voiceAstrologerName: {
    fontSize: RF(22),
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  voiceSubStatus: {
    fontSize: RF(12),
    color: "#4CAF50",
    marginTop: hp(0.5),
    fontWeight: "600",
  },
  clientBadgeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(5),
    marginTop: hp(2),
  },
  clientBadgeText: {
    color: "#ddd",
    fontSize: RF(12),
    fontWeight: "600",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c2d12",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(3),
    marginTop: hp(2),
    gap: wp(2),
    maxWidth: wp(85),
  },
  warningText: {
    color: "#fdba74",
    fontSize: RF(10.5),
    fontWeight: "600",
    flexShrink: 1,
  },
});
