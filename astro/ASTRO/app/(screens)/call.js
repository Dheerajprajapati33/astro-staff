// app/(screens)/call.js
// 1:1 Private Zoom-Style Video Consultation Call screen for ASTRO Astrologer App.
// Follows Section B of Voice & Video Call Consultation Guide (1_voice_video_call_consultation_guide.md).

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

import Typography from "../../constants/Typography";
import { AGORA_APP_ID } from "../../constants/AgoraConfig";
import { RF, hp, wp } from "../../utils/responsive";
import { getStoredUser } from "../../utils/auth";
import { emitEvent, getSocket, onEvent } from "../../utils/socket";
import { useGetCallTokenMutation } from "../../redux/ChatApi";

// Safe Agora loader for dev/web resilience
let createAgoraRtcEngine = null;
try {
  const agoraModule = require("react-native-agora");
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
} catch (_e) {
  console.log("[AstroCall] react-native-agora native module not loaded; running in web/mock mode.");
}

const LOG_TAG = "[AstroCall]";
const ORANGE = "#ff6a00";

export default function CallScreen() {
  const params = useLocalSearchParams();
  const {
    consultationId,
    userId,
    userName = "Client",
    userImage = "",
    problem = "Horoscope Reading",
    maxDurationSeconds = "1500",
    ratePerMinute = "25",
  } = params;

  const [currentUser, setCurrentUser] = useState(null);
  const [callStatus, setCallStatus] = useState("connected"); // "connected" | "ended"
  const [secondsLeft, setSecondsLeft] = useState(Number(maxDurationSeconds) || 1500);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // Media Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [endedReason, setEndedReason] = useState("");

  // Video Feeds (Web & Native)
  const [clientVideoFrame, setClientVideoFrame] = useState(null);
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
    if (callStatus === "incoming") {
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

  // Load current user data
  useEffect(() => {
    const loadUser = async () => {
      const user = await getStoredUser();
      if (user) setCurrentUser(user);
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

          if (data?.type === "client_video_frame") {
            setClientVideoFrame(data.frame);
          } else if (data?.type === "call_ended") {
            handleCallEndedEvent({ message: "Client ended the call." });
          }
        };

        return () => {
          channel.close();
        };
      } catch (e) {
        console.log(LOG_TAG, "BroadcastChannel error:", e);
      }
    }
  }, [consultationId]);

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

  // Stream local webcam frames to the client tab (Web)
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
              type: "remote_video_frame",
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
          broadcastChannelRef.current.postMessage({ type: "remote_video_frame", frame: null });
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

  // Step 3: Astrologer Accepts Call Handler
  const handleAcceptCall = async () => {
    console.log(LOG_TAG, "Astrologer accepting call for:", consultationId);
    setCallStatus("connected");

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: "call_started",
          maxDurationSeconds,
        });
      } catch (e) {}
    }

    emitEvent("astrologer_accept_call", { consultationId });
    emitEvent("call_accepted", { consultationId });

    handleCallStarted({ maxDurationSeconds });
  };

  // Step 4: Handle Call Started
  const handleCallStarted = useCallback(
    async (data) => {
      console.log(LOG_TAG, "call_started event received:", data);
      setCallStatus("connected");

      if (hasJoinedAgoraRef.current) return;
      hasJoinedAgoraRef.current = true;

      const duration = data?.maxDurationSeconds || Number(maxDurationSeconds) || 1500;
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
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = setInterval(() => {
        callDurationSecondsRef.current += 1;
        setCallDurationSeconds(callDurationSecondsRef.current);
      }, 1000);

      // Fetch Host Agora Token & Join Video RTC
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ]);
        }

        console.log(LOG_TAG, "Fetching Host Agora token for:", consultationId);
        const tokenRes = await getCallToken({ consultationId, uid: 2, role: "astrologer" }).unwrap();
        const agoraData = tokenRes?.data?.agora || tokenRes?.agora || tokenRes?.data || tokenRes;

        if (agoraData && createAgoraRtcEngine) {
          const targetToken = agoraData.astrologerToken || agoraData.token;
          const targetChannelName = agoraData.channelName || `call_${consultationId}`;
          const rawUid = agoraData.astrologerUid !== undefined ? agoraData.astrologerUid : agoraData.uid;
          const targetUid = rawUid !== undefined && rawUid !== null && Number(rawUid) !== 1 ? Number(rawUid) : 2;
          const targetAppId = agoraData.appId || agoraData.app_id || AGORA_APP_ID;
          console.log(LOG_TAG, "Joining Agora 2-Way Voice/Video Call as Host:", targetChannelName, "uid:", targetUid, "tokenPresent:", !!targetToken);

          const engine = createAgoraRtcEngine();
          agoraEngineRef.current = engine;

          // 1. Initialize Engine
          engine.initialize({
            appId: targetAppId,
            channelProfile: 0, // ChannelProfileCommunication (0: 1:1 VOIP call)
          });

          // 2. Register Event Handlers Immediately After Initialization
          if (engine.registerEventHandler) {
            engine.registerEventHandler({
              onJoinChannelSuccess: (connection, elapsed) => {
                console.log(LOG_TAG, "Agora Host onJoinChannelSuccess:", connection.channelId);
                if (engine.enableLocalAudio) engine.enableLocalAudio(true);
                if (engine.setDefaultAudioRouteToSpeakerphone) engine.setDefaultAudioRouteToSpeakerphone(true);
                if (engine.setEnableSpeakerphone) engine.setEnableSpeakerphone(true);
                if (engine.muteLocalAudioStream) engine.muteLocalAudioStream(false);
                if (engine.muteAllRemoteAudioStreams) engine.muteAllRemoteAudioStreams(false);
              },
              onUserJoined: (connection, remoteUid, elapsed) => {
                console.log(LOG_TAG, "Agora Host onUserJoined remoteUid:", remoteUid);
                if (engine.muteRemoteAudioStream) engine.muteRemoteAudioStream(remoteUid, false);
              },
              onRemoteAudioStateChanged: (connection, remoteUid, state, reason, elapsed) => {
                console.log(LOG_TAG, "Agora Host onRemoteAudioStateChanged:", remoteUid, state, reason);
              },
              onError: (err, msg) => {
                console.log(LOG_TAG, "Agora Host RTC Error:", err, msg);
              },
            });
          }

          // 3. Audio & Video Engine Configurations
          if (engine.setAudioScenario) engine.setAudioScenario(0); // AudioScenarioDefault (0: VOIP)
          if (engine.setClientRole) engine.setClientRole(1); // ClientRoleBroadcaster
          engine.enableAudio();
          if (engine.enableLocalAudio) engine.enableLocalAudio(true);
          if (engine.setDefaultAudioRouteToSpeakerphone) engine.setDefaultAudioRouteToSpeakerphone(true);
          if (engine.setEnableSpeakerphone) engine.setEnableSpeakerphone(true);
          engine.enableVideo();

          if (engine.adjustRecordingSignalVolume) engine.adjustRecordingSignalVolume(100);
          if (engine.adjustPlaybackSignalVolume) engine.adjustPlaybackSignalVolume(100);
          if (engine.muteLocalAudioStream) engine.muteLocalAudioStream(false);
          if (engine.muteAllRemoteAudioStreams) engine.muteAllRemoteAudioStreams(false);

          engine.startPreview();

          // 4. Join Channel
          engine.joinChannel(targetToken, targetChannelName, targetUid, {
            clientRoleType: 1,
            publishMicrophoneTrack: true,
            publishCameraTrack: true,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          });
        }
      } catch (err) {
        console.log(LOG_TAG, "Agora Host RTC setup notice:", err?.message || err);
      }
    },
    [consultationId, getCallToken, maxDurationSeconds],
  );

  // Step 5: Handle Call Ended Event
  const handleCallEndedEvent = useCallback(
    (data) => {
      console.log(LOG_TAG, "call_ended event received:", data);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      cleanupAgora();
      setCallStatus("ended");
      setEndedReason(data?.reason || data?.consultation?.endReason || "client_ended");

      const mins = Math.max(1, Math.ceil(callDurationSecondsRef.current / 60));
      const rate = Number(ratePerMinute) || 25;
      const earnings = data?.amount || data?.consultation?.amount || mins * rate;
      setTotalEarnings(earnings);

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

  // Socket setup & listeners
  useEffect(() => {
    if (!consultationId || callStatusRef.current === "ended") return;

    let isMounted = true;

    const setup = async () => {
      const astrologerUser = await getStoredUser();
      if (!isMounted || callStatusRef.current === "ended") return;

      emitEvent("join_consultation", {
        consultationId,
        userId: astrologerUser?.id,
        role: "astrologer",
      });

      // Automatically join Agora RTC voice call session upon screen mount
      handleCallStartedRef.current?.({ maxDurationSeconds });

      const offStart = onEvent("call_started", (data) => handleCallStartedRef.current?.(data));
      const offEnd = onEvent("call_ended", (data) => handleCallEndedEventRef.current?.(data));

      return () => {
        offStart();
        offEnd();
      };
    };

    setup();

    return () => {
      isMounted = false;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      cleanupAgora();
    };
  }, [consultationId]);

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

  // End Call action
  const handleEndCall = (reason = "completed") => {
    console.log(LOG_TAG, "Astrologer ending call:", reason);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: "call_ended", reason });
      } catch (e) {}
    }

    emitEvent("client_end_call", { consultationId, reason });
    emitEvent("end_call_session", { consultationId, reason });
    cleanupAgora();
    setCallStatus("ended");
    setEndedReason(reason || "astrologer_hung_up");

    const mins = Math.max(1, Math.ceil(callDurationSeconds / 60));
    const rate = Number(ratePerMinute) || 25;
    setTotalEarnings(mins * rate);
    setShowSummaryModal(true);
  };

  // Decline Call
  const handleDeclineCall = () => {
    console.log(LOG_TAG, "Astrologer declined call");
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: "call_ended", reason: "declined" });
      } catch (e) {}
    }
    emitEvent("astrologer_reject_call", { consultationId });
    router.replace("/(home)");
  };

  // Android Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (callStatus === "connected") {
        if (Platform.OS === "web") {
          if (window.confirm("Do you want to end this video call consultation?")) {
            handleEndCall("astrologer_hung_up");
          }
        } else {
          Alert.alert("End Consultation", "Are you sure you want to end this video consultation?", [
            { text: "Cancel", style: "cancel" },
            { text: "End Call", style: "destructive", onPress: () => handleEndCall("astrologer_hung_up") },
          ]);
        }
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [callStatus]);

  return (
    <View style={styles.container}>
      {/* =========================================================================
          1. INCOMING CALL RINGING SCREEN (ASTROLOGER)
          ========================================================================= */}
      {callStatus === "incoming" && (
        <SafeAreaView style={styles.incomingSafeArea}>
          <View style={styles.incomingHeader}>
            <Text style={styles.incomingBadge}>Incoming Video Consultation</Text>
            <Text style={styles.problemText}>{problem}</Text>
          </View>

          <View style={styles.avatarCenterWrap}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.incomingAvatarCircle}>
              <Ionicons name="person" size={RF(50)} color="#fff" />
            </View>
            <Text style={styles.clientNameRinging}>{userName}</Text>
            <Text style={styles.rateBadgeText}>₹{ratePerMinute}/min • Private Zoom Video Call</Text>
          </View>

          <View style={styles.incomingActionButtons}>
            {/* Decline Button */}
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={handleDeclineCall}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={RF(28)} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
              <Text style={styles.btnActionLbl}>Decline</Text>
            </TouchableOpacity>

            {/* Accept Button */}
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAcceptCall}
              activeOpacity={0.85}
            >
              <Ionicons name="videocam" size={RF(28)} color="#fff" />
              <Text style={styles.btnActionLbl}>Accept Call</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* =========================================================================
          2. CONNECTED WHATSAPP-STYLE VOICE CALL STATE
          ========================================================================= */}
      {callStatus === "connected" && (
        <View style={styles.connectedContainer}>
          {/* Top Bar: Timer, Client Info & Consultation Topic */}
          <SafeAreaView style={styles.topOverlayBar} edges={["top"]}>
            <View style={styles.hostHeaderBadge}>
              <View style={styles.smallAvatarWrap}>
                <Text style={styles.avatarInitial}>{userName ? userName[0].toUpperCase() : "C"}</Text>
              </View>
              <View>
                <Text style={styles.headerHostName} numberOfLines={1}>{userName}</Text>
                <Text style={styles.headerRateText}>{problem} • Voice Call</Text>
              </View>
            </View>

            <View style={styles.timerBadge}>
              <View style={styles.redDot} />
              <Text style={styles.timerText}>{formatTimer(secondsLeft)}</Text>
            </View>
          </SafeAreaView>

          {/* Centered WhatsApp-Style Voice Avatar with Pulse Animation */}
          <View style={styles.voiceAvatarCenterWrap}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.voiceAvatarCircle}>
              <Ionicons name="person" size={RF(50)} color="#fff" />
            </View>
            <Text style={styles.voiceAstrologerName}>{currentUser?.name || "Astrologer Host"}</Text>
            <Text style={styles.voiceSubStatus}>Voice Consultation Connected</Text>

            {/* Client Icon Badge */}
            <View style={styles.clientBadgeBox}>
              <Ionicons name="person-circle" size={RF(22)} color="#ff6a00" />
              <Text style={styles.clientBadgeText}>Client ({userName})</Text>
            </View>
          </View>

          {/* Bottom WhatsApp-Style Audio Control Bar */}
          <View style={styles.bottomControlBar}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={handleToggleMute}
              activeOpacity={0.8}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={RF(24)} color="#fff" />
              <Text style={styles.controlBtnLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>

            {/* Speaker Toggle */}
            <TouchableOpacity
              style={[styles.controlBtn, !isSpeaker && styles.controlBtnActive]}
              onPress={handleToggleSpeaker}
              activeOpacity={0.8}
            >
              <Ionicons name={isSpeaker ? "volume-high" : "volume-mute"} size={RF(24)} color="#fff" />
              <Text style={styles.controlBtnLabel}>{isSpeaker ? "Speaker" : "Ear-piece"}</Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => handleEndCall("astrologer_hung_up")}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={RF(26)} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
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

            <Text style={styles.summaryTitle}>
              {endedReason === "client_ended"
                ? "Client Ended Call"
                : "Consultation Completed"}
            </Text>
            <Text style={styles.summarySub}>
              {endedReason === "balance_exhausted"
                ? `Call ended automatically as ${userName}'s wallet balance was exhausted.`
                : endedReason === "astrologer_hung_up"
                ? `You have ended the call consultation with ${userName}.`
                : endedReason === "time_expired"
                ? `Consultation time limit reached for call with ${userName}.`
                : `${userName || "Client"} has ended the call consultation.`}
            </Text>

            <View style={styles.summaryStatsGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>{formatTimer(callDurationSeconds)}</Text>
                <Text style={styles.summaryLbl}>Duration</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>₹{totalEarnings}</Text>
                <Text style={styles.summaryLbl}>Earnings</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryVal}>₹{ratePerMinute}/min</Text>
                <Text style={styles.summaryLbl}>Rate</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.returnHomeBtn}
              onPress={() => router.replace("/(home)")}
              activeOpacity={0.88}
            >
              <Text style={styles.returnHomeText}>Return to Dashboard</Text>
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
  // Incoming Call Screen
  incomingSafeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(4),
  },
  incomingHeader: {
    alignItems: "center",
    marginTop: hp(2),
  },
  incomingBadge: {
    fontSize: RF(18),
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  problemText: {
    fontSize: RF(13),
    color: "#FFB300",
    marginTop: hp(0.8),
    fontWeight: "600",
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
    backgroundColor: "rgba(52, 199, 89, 0.22)",
  },
  incomingAvatarCircle: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#2e2942",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#34C759",
  },
  clientNameRinging: {
    fontSize: RF(20),
    fontWeight: "700",
    color: "#fff",
    marginTop: hp(2.5),
  },
  rateBadgeText: {
    fontSize: RF(12),
    color: "#aaa",
    marginTop: hp(0.6),
  },
  incomingActionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: wp(10),
    marginBottom: hp(2),
  },
  declineBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#FF3B30",
    elevation: 6,
  },
  acceptBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#34C759",
    elevation: 6,
  },
  btnActionLbl: {
    color: "#fff",
    fontSize: RF(9.5),
    fontWeight: "600",
    marginTop: hp(0.3),
  },

  // Connected Video Call Screen
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
  placeholderAvatarCircle: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#2e2942",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
    borderWidth: 2,
    borderColor: "#34C759",
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

  // PiP Floating Local Camera Preview
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
  smallAvatarWrap: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: "#34C759",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: RF(11),
    fontWeight: "700",
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
    color: "#34C759",
  },
  summaryLbl: {
    fontSize: RF(10),
    color: "#888",
    marginTop: hp(0.2),
  },
  returnHomeBtn: {
    width: "100%",
    backgroundColor: "#34C759",
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
    borderColor: "#34C759",
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
    color: "#34C759",
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
});
