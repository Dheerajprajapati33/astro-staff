// app/(screens)/call.js
// 1:1 Private Zoom-Style Video Consultation Call screen for ASTRO Astrologer App.
// Follows Section B of Voice & Video Call Consultation Guide (1_voice_video_call_consultation_guide.md).

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Image,
  PanResponder,
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
import {
  clearLastJoinParams,
  connectSocket,
  emitEvent,
  joinCallConsultation,
  onEvent,
} from "../../utils/socket";
import { useGetCallTokenMutation } from "../../redux/ChatApi";
import { useGetFullKundliMutation } from "../../redux/KundliApi";
import KundliScreen from "./Kundli";

// Safe Agora loader for dev/web resilience
let createAgoraRtcEngine = null;
try {
  const agoraModule = require("react-native-agora");
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
} catch (_e) {
  console.log(
    "[AstroCall] react-native-agora native module not loaded; running in web/mock mode.",
  );
}

const LOG_TAG = "[AstroCall]";
const ORANGE = "#ff6a00";
const MAX_AGORA_DATA_PACKET_BYTES = 1024;

const encodeAgoraMessage = (message) => {
  const encoded = encodeURIComponent(JSON.stringify(message));
  const bytes = [];
  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded[index] === "%") {
      bytes.push(parseInt(encoded.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(encoded.charCodeAt(index));
    }
  }
  return Uint8Array.from(bytes);
};

const decodeAgoraMessage = (data, length) => {
  try {
    const bytes = Array.from(data).slice(0, length);
    const encoded = bytes
      .map((byte) => `%${byte.toString(16).padStart(2, "0")}`)
      .join("");
    return JSON.parse(decodeURIComponent(encoded));
  } catch (error) {
    console.log(LOG_TAG, "Could not decode Agora call data message:", error);
    return null;
  }
};

const parseBirthDetails = (value) => {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch (_error) {
    return null;
  }
};

const normalizeKundliResponse = (response) => {
  if (response?.data && typeof response.data === "object") {
    return { ...response, ...response.data };
  }
  if (response?.kundli && typeof response.kundli === "object") {
    return { ...response, ...response.kundli };
  }
  return response;
};

const normalizeBirthDate = (value) => {
  const date = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const match = date.match(/^(\d{2})[-/:](\d{2})[-/:](\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : date;
};

const normalizeBirthTime = (value) => {
  const time = String(value || "").trim();
  const amPm = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (amPm) {
    let hour = Number(amPm[1]);
    const period = amPm[4].toUpperCase();
    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
    return `${String(hour).padStart(2, "0")}:${amPm[2]}:${amPm[3] || "00"}`;
  }
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return /^\d{2}:\d{2}:\d{2}$/.test(time) ? time : "12:00:00";
};

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
  const birthDetailsParam = Array.isArray(params?.birthDetails)
    ? params.birthDetails[0]
    : params?.birthDetails;

  const [currentUser, setCurrentUser] = useState(null);
  const [callStatus, setCallStatus] = useState("connected"); // "connected" | "ended"
  const [secondsLeft, setSecondsLeft] = useState(
    Number(maxDurationSeconds) || 1500,
  );
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // Media Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [endedReason, setEndedReason] = useState("");
  const [clientBirthDetails, setClientBirthDetails] = useState(() =>
    parseBirthDetails(birthDetailsParam),
  );
  const [clientKundliData, setClientKundliData] = useState(null);
  const [showClientKundli, setShowClientKundli] = useState(false);
  const [isClientKundliMinimized, setIsClientKundliMinimized] =
    useState(false);
  const [isClientKundliExpanded, setIsClientKundliExpanded] =
    useState(false);
  const [kundliOverlaySize, setKundliOverlaySize] = useState({
    width: 0,
    height: 0,
  });
  const [isLoadingClientKundli, setIsLoadingClientKundli] = useState(false);
  const [isAgoraDataStreamReady, setIsAgoraDataStreamReady] = useState(false);

  // Video Feeds (Web & Native)
  const [clientVideoFrame, setClientVideoFrame] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const [getCallToken] = useGetCallTokenMutation();
  const [getFullKundli] = useGetFullKundliMutation();

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
  const agoraDataStreamIdRef = useRef(null);
  const pendingKundliAckRef = useRef(false);
  const kundliPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const kundliPositionRef = useRef({ x: 0, y: 0 });
  const kundliDragStartRef = useRef({ x: 0, y: 0 });
  const kundliBoundsRef = useRef({
    width: 0,
    height: 0,
    windowWidth: 0,
    windowHeight: 0,
  });
  const centerKundliOnOpenRef = useRef(false);

  const kundliWindowWidth = Math.max(
    0,
    Math.min(
      kundliOverlaySize.width - 12,
      kundliOverlaySize.width * (isClientKundliExpanded ? 0.98 : 0.9),
    ),
  );
  const kundliWindowHeight = Math.max(
    0,
    Math.min(
      kundliOverlaySize.height - 12,
      kundliOverlaySize.height * (isClientKundliExpanded ? 0.9 : 0.72),
    ),
  );
  const kundliBubbleSize = 58;
  const renderedKundliWidth = isClientKundliMinimized
    ? kundliBubbleSize
    : kundliWindowWidth;
  const renderedKundliHeight = isClientKundliMinimized
    ? kundliBubbleSize
    : kundliWindowHeight;

  kundliBoundsRef.current = {
    width: kundliOverlaySize.width,
    height: kundliOverlaySize.height,
    windowWidth: renderedKundliWidth,
    windowHeight: renderedKundliHeight,
  };

  const kundliPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: () => {
        kundliDragStartRef.current = { ...kundliPositionRef.current };
      },
      onPanResponderMove: (_, gestureState) => {
        const bounds = kundliBoundsRef.current;
        const maxX = Math.max(0, bounds.width - bounds.windowWidth);
        const maxY = Math.max(0, bounds.height - bounds.windowHeight);

        kundliPosition.setValue({
          x: Math.min(
            maxX,
            Math.max(0, kundliDragStartRef.current.x + gestureState.dx),
          ),
          y: Math.min(
            maxY,
            Math.max(0, kundliDragStartRef.current.y + gestureState.dy),
          ),
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        const bounds = kundliBoundsRef.current;
        const maxX = Math.max(0, bounds.width - bounds.windowWidth);
        const maxY = Math.max(0, bounds.height - bounds.windowHeight);
        const position = {
          x: Math.min(
            maxX,
            Math.max(0, kundliDragStartRef.current.x + gestureState.dx),
          ),
          y: Math.min(
            maxY,
            Math.max(0, kundliDragStartRef.current.y + gestureState.dy),
          ),
        };

        kundliPositionRef.current = position;
        kundliPosition.setValue(position);
      },
    }),
  ).current;

  useEffect(() => {
    if (
      !showClientKundli ||
      !kundliOverlaySize.width ||
      !kundliOverlaySize.height ||
      !renderedKundliWidth ||
      !renderedKundliHeight
    ) {
      return;
    }

    const maxX = Math.max(0, kundliOverlaySize.width - renderedKundliWidth);
    const maxY = Math.max(0, kundliOverlaySize.height - renderedKundliHeight);
    const currentPosition = centerKundliOnOpenRef.current
      ? { x: maxX / 2, y: maxY / 2 }
      : kundliPositionRef.current;
    const position = {
      x: Math.min(maxX, Math.max(0, currentPosition.x)),
      y: Math.min(maxY, Math.max(0, currentPosition.y)),
    };

    centerKundliOnOpenRef.current = false;
    kundliPositionRef.current = position;
    kundliPosition.setValue(position);
  }, [
    showClientKundli,
    kundliOverlaySize,
    kundliPosition,
    renderedKundliHeight,
    renderedKundliWidth,
  ]);

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

  // Stream local webcam frames to the client tab (Web)
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
          broadcastChannelRef.current.postMessage({
            type: "remote_video_frame",
            frame: null,
          });
        } catch (e) {}
      }
    };
  }, [callStatus, isCameraOff]);

  // Cleanup Agora Engine
  const cleanupAgora = useCallback(async () => {
    hasJoinedAgoraRef.current = false;
    agoraDataStreamIdRef.current = null;
    pendingKundliAckRef.current = false;
    setIsAgoraDataStreamReady(false);
    clearLastJoinParams(); // 👈 Call khatam hone par purana call ID socket se clear karein

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

      const duration =
        data?.maxDurationSeconds || Number(maxDurationSeconds) || 1500;
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

      // Fetch Host Agora Token & Join Video RTC
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ]);
        }

        console.log(LOG_TAG, "Fetching Host Agora token for:", consultationId);
        const tokenRes = await getCallToken({
          consultationId,
          uid: 2,
          role: "astrologer",
        }).unwrap();
        const agoraData =
          tokenRes?.data?.agora ||
          tokenRes?.agora ||
          tokenRes?.data ||
          tokenRes;

        if (agoraData && createAgoraRtcEngine) {
          const targetToken = agoraData.astrologerToken || agoraData.token;
          const targetChannelName =
            agoraData.channelName || `call_${consultationId}`;
          const rawUid =
            agoraData.astrologerUid !== undefined
              ? agoraData.astrologerUid
              : agoraData.uid;
          const targetUid =
            rawUid !== undefined && rawUid !== null && Number(rawUid) !== 1
              ? Number(rawUid)
              : 2;
          const targetAppId =
            agoraData.appId || agoraData.app_id || AGORA_APP_ID;
          console.log(
            LOG_TAG,
            "Joining Agora 2-Way Voice/Video Call as Host:",
            targetChannelName,
            "uid:",
            targetUid,
            "tokenPresent:",
            !!targetToken,
          );

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
                console.log(
                  LOG_TAG,
                  "Agora Host onJoinChannelSuccess:",
                  connection.channelId,
                );
                try {
                  const streamId = engine.createDataStream({
                    syncWithAudio: false,
                    ordered: true,
                  });
                  if (streamId < 0) {
                    console.log(
                      LOG_TAG,
                      "Could not create Agora Kundli data stream:",
                      streamId,
                    );
                  } else {
                    agoraDataStreamIdRef.current = streamId;
                    setIsAgoraDataStreamReady(true);
                    console.log(LOG_TAG, "Agora Kundli data stream ready.");
                  }
                } catch (error) {
                  console.log(
                    LOG_TAG,
                    "Agora Kundli data stream setup failed:",
                    error,
                  );
                }
                if (engine.enableLocalAudio) engine.enableLocalAudio(true);
                if (engine.setDefaultAudioRouteToSpeakerphone)
                  engine.setDefaultAudioRouteToSpeakerphone(false);
                if (engine.setEnableSpeakerphone)
                  engine.setEnableSpeakerphone(false);
                if (engine.muteLocalAudioStream)
                  engine.muteLocalAudioStream(false);
                if (engine.muteAllRemoteAudioStreams)
                  engine.muteAllRemoteAudioStreams(false);
              },
              onUserJoined: (connection, remoteUid, elapsed) => {
                console.log(
                  LOG_TAG,
                  "Agora Host onUserJoined remoteUid:",
                  remoteUid,
                );
                if (engine.muteRemoteAudioStream)
                  engine.muteRemoteAudioStream(remoteUid, false);
              },
              onUserOffline: (connection, remoteUid, reason) => {
                console.log(
                  LOG_TAG,
                  "Agora Host onUserOffline remoteUid:",
                  remoteUid,
                  "reason:",
                  reason,
                );
                handleCallEndedEventRef.current?.({
                  reason: "user_hung_up",
                  message: "Client ended the call.",
                });
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
                  "Agora Host onRemoteAudioStateChanged:",
                  remoteUid,
                  state,
                  reason,
                );
              },
              onStreamMessage: (
                connection,
                remoteUid,
                streamId,
                data,
                length,
              ) => {
                const message = decodeAgoraMessage(data, length);
                if (
                  message?.type !== "client_kundli_details" ||
                  String(message.consultationId) !== String(consultationId)
                ) {
                  return;
                }

                const details = parseBirthDetails(message.birthDetails);
                if (!details) {
                  console.log(LOG_TAG, "Received invalid client Kundli details.");
                  return;
                }

                setClientBirthDetails(details);
                pendingKundliAckRef.current = true;
                console.log(
                  LOG_TAG,
                  "Client Kundli details received over Agora data stream.",
                );
                sendKundliDetailsAck();
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
          if (engine.setDefaultAudioRouteToSpeakerphone)
            engine.setDefaultAudioRouteToSpeakerphone(false);
          if (engine.setEnableSpeakerphone) engine.setEnableSpeakerphone(false);
          engine.enableVideo();

          if (engine.adjustRecordingSignalVolume)
            engine.adjustRecordingSignalVolume(100);
          if (engine.adjustPlaybackSignalVolume)
            engine.adjustPlaybackSignalVolume(100);
          if (engine.muteLocalAudioStream) engine.muteLocalAudioStream(false);
          if (engine.muteAllRemoteAudioStreams)
            engine.muteAllRemoteAudioStreams(false);

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
        console.log(
          LOG_TAG,
          "Agora Host RTC setup notice:",
          err?.message || err,
        );
      }
    },
    [consultationId, getCallToken, maxDurationSeconds],
  );

  // Step 5: Handle Call Ended Event
  const handleCallEndedEvent = useCallback(
    (data) => {
      console.log(LOG_TAG, "call_ended event received:", data);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current)
        clearInterval(durationIntervalRef.current);
      cleanupAgora();
      setCallStatus("ended");
      setEndedReason(
        data?.reason || data?.consultation?.endReason || "client_ended",
      );

      const mins = Math.max(1, Math.ceil(callDurationSecondsRef.current / 60));
      const rate = Number(ratePerMinute) || 25;
      const earnings =
        data?.amount || data?.consultation?.amount || mins * rate;
      setTotalEarnings(earnings);

      setShowSummaryModal(true);
    },
    [cleanupAgora, ratePerMinute],
  );

  const sendKundliDetailsAck = useCallback(() => {
    const streamId = agoraDataStreamIdRef.current;
    const engine = agoraEngineRef.current;
    if (streamId == null || !engine || !pendingKundliAckRef.current) {
      return false;
    }

    const message = encodeAgoraMessage({
      type: "client_kundli_details_ack",
      consultationId: String(consultationId),
    });
    if (message.length > MAX_AGORA_DATA_PACKET_BYTES) {
      console.log(
        LOG_TAG,
        "Kundli acknowledgement exceeds Agora's 1 KB limit.",
      );
      return false;
    }

    const result = engine.sendStreamMessage(streamId, message, message.length);
    if (result !== 0) {
      console.log(LOG_TAG, "Agora Kundli acknowledgement send failed:", result);
      return false;
    }

    pendingKundliAckRef.current = false;
    return true;
  }, [consultationId]);

  useEffect(() => {
    if (isAgoraDataStreamReady) sendKundliDetailsAck();
  }, [isAgoraDataStreamReady, sendKundliDetailsAck]);

  const handleOpenClientKundli = async () => {
    if (clientKundliData) {
      centerKundliOnOpenRef.current = true;
      setIsClientKundliMinimized(false);
      setIsClientKundliExpanded(false);
      setShowClientKundli(true);
      return;
    }

    if (!clientBirthDetails) {
      Alert.alert(
        "Client Kundli",
        "Client birth details have not arrived yet. Please try again shortly.",
      );
      return;
    }

    const dob = normalizeBirthDate(
      clientBirthDetails.dob ||
        clientBirthDetails.dateOfBirth ||
        clientBirthDetails.birthDate,
    );
    const birthPlace =
      clientBirthDetails.birthPlace ||
      clientBirthDetails.placeOfBirth ||
      clientBirthDetails.city;

    if (!dob || !birthPlace) {
      Alert.alert(
        "Client Kundli",
        "The client's date of birth or birth place is missing.",
      );
      return;
    }

    const genderValue = String(
      clientBirthDetails.gender || clientBirthDetails.sex || "MALE",
    ).toUpperCase();
    const payload = {
      name:
        clientBirthDetails.name ||
        clientBirthDetails.clientName ||
        userName ||
        "Client",
      gender:
        genderValue === "FEMALE" || genderValue === "F"
          ? "FEMALE"
          : genderValue === "OTHER"
            ? "OTHER"
            : "MALE",
      dob,
      tob: normalizeBirthTime(
        clientBirthDetails.tob ||
          clientBirthDetails.birthTime ||
          clientBirthDetails.timeOfBirth,
      ),
      birthPlace,
      city: clientBirthDetails.city || birthPlace,
      timezone: clientBirthDetails.timezone || "Asia/Kolkata",
      la: "hi",
    };

    const latitude =
      clientBirthDetails.latitude ?? clientBirthDetails.lat;
    const longitude =
      clientBirthDetails.longitude ?? clientBirthDetails.lng;
    if (latitude !== undefined && latitude !== null && latitude !== "") {
      payload.latitude = Number(latitude);
    }
    if (longitude !== undefined && longitude !== null && longitude !== "") {
      payload.longitude = Number(longitude);
    }

    setIsLoadingClientKundli(true);
    try {
      const response = await getFullKundli(payload).unwrap();
      const data = normalizeKundliResponse(response);
      if (!data || typeof data !== "object") {
        throw new Error("Kundli response did not contain chart data.");
      }
      setClientKundliData(data);
      centerKundliOnOpenRef.current = true;
      setIsClientKundliMinimized(false);
      setIsClientKundliExpanded(false);
      setShowClientKundli(true);
    } catch (error) {
      console.log(LOG_TAG, "Client Kundli generation failed:", error);
      Alert.alert(
        "Client Kundli",
        error?.data?.message ||
          error?.message ||
          "Could not generate the client's Kundli.",
      );
    } finally {
      setIsLoadingClientKundli(false);
    }
  };

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
    let offStart = () => {};
    let offEnd = () => {};
    let offConsultationEnd = () => {};
    let offCancelled = () => {};

    const setup = async () => {
      const astrologerUser = await getStoredUser();
      if (!isMounted || callStatusRef.current === "ended") return;

      await connectSocket(astrologerUser?.token);
      if (!isMounted || callStatusRef.current === "ended") return;

      offStart = onEvent("call_started", (data) =>
        handleCallStartedRef.current?.(data),
      );
      offEnd = onEvent("call_ended", (data) =>
        handleCallEndedEventRef.current?.(data),
      );
      offConsultationEnd = onEvent("consultation_ended", (data) =>
        handleCallEndedEventRef.current?.(data),
      );
      offCancelled = onEvent("call_cancelled", (data) =>
        handleCallEndedEventRef.current?.(data),
      );

      joinCallConsultation({
        consultationId,
        userId: astrologerUser?.id,
        role: "astrologer",
      });

      // Automatically join Agora RTC voice call session upon screen mount
      handleCallStartedRef.current?.({ maxDurationSeconds });
    };

    setup();

    return () => {
      isMounted = false;
      offStart();
      offEnd();
      offConsultationEnd();
      offCancelled();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (durationIntervalRef.current)
        clearInterval(durationIntervalRef.current);
      cleanupAgora();
    };
  }, [consultationId]);

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
    clearLastJoinParams(); // 👈 Socket consultation ID clear karein
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
        broadcastChannelRef.current.postMessage({
          type: "call_ended",
          reason: "declined",
        });
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
          if (
            window.confirm("Do you want to end this video call consultation?")
          ) {
            handleEndCall("astrologer_hung_up");
          }
        } else {
          Alert.alert(
            "End Consultation",
            "Are you sure you want to end this video consultation?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "End Call",
                style: "destructive",
                onPress: () => handleEndCall("astrologer_hung_up"),
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

  return (
    <View style={styles.container}>
      {/* =========================================================================
          1. INCOMING CALL RINGING SCREEN (ASTROLOGER)
          ========================================================================= */}
      {callStatus === "incoming" && (
        <SafeAreaView style={styles.incomingSafeArea}>
          <View style={styles.incomingHeader}>
            <Text style={styles.incomingBadge}>Incoming Voice Call</Text>
            <Text style={styles.problemText}>{problem}</Text>
          </View>

          <View style={styles.avatarCenterWrap}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
            />
            <View style={styles.incomingAvatarCircle}>
              <Ionicons name="person" size={RF(50)} color="#fff" />
            </View>
            <Text style={styles.clientNameRinging}>{userName}</Text>
            <Text style={styles.rateBadgeText}>
              ₹{ratePerMinute}/min • Voice call
            </Text>
          </View>

          <View style={styles.incomingActionButtons}>
            {/* Decline Button */}
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={handleDeclineCall}
              activeOpacity={0.85}
            >
              <Ionicons
                name="call"
                size={RF(28)}
                color="#fff"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
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
                <Text style={styles.avatarInitial}>
                  {userName ? userName[0].toUpperCase() : "C"}
                </Text>
              </View>
              <View>
                <Text style={styles.headerHostName} numberOfLines={1}>
                  {userName}
                </Text>
                <Text style={styles.headerRateText}>
                  {problem} • Voice Call
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
              <Ionicons name="person" size={RF(50)} color="#fff" />
            </View>
            <Text style={styles.voiceAstrologerName}>
              {currentUser?.name || "Astrologer Host"}
            </Text>
            <Text style={styles.voiceSubStatus}>
              Voice Consultation Connected
            </Text>

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
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
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

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleOpenClientKundli}
              activeOpacity={0.8}
              accessibilityLabel="View client Kundli"
            >
              {isLoadingClientKundli ? (
                <Ionicons
                  name="hourglass-outline"
                  size={RF(28)}
                  color="#fff"
                />
              ) : (
                <Image
                  source={require("../../assets/images/kundli.jpg")}
                  style={{ width: RF(34), height: RF(34) }}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.controlBtnLabel}>Kundli</Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => handleEndCall("astrologer_hung_up")}
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
                <Text style={styles.summaryVal}>
                  {formatTimer(callDurationSeconds)}
                </Text>
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

      {showClientKundli && (
        <View
          pointerEvents="box-none"
          style={styles.kundliOverlayHost}
          onLayout={({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            setKundliOverlaySize((current) =>
              current.width === width && current.height === height
                ? current
                : { width, height },
            );
          }}
        >
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.kundliWindow,
              {
                width: renderedKundliWidth,
                height: renderedKundliHeight,
                transform: kundliPosition.getTranslateTransform(),
              },
            ]}
          >
            <View
              pointerEvents={isClientKundliMinimized ? "none" : "auto"}
              style={[
                styles.kundliWindowToolbar,
                isClientKundliMinimized && styles.kundliHidden,
              ]}
            >
              <View
                style={styles.kundliDragHandle}
                {...kundliPanResponder.panHandlers}
              >
                <Ionicons name="move" size={RF(16)} color="#fff" />
                <Text style={styles.kundliWindowTitle}>Client Kundli</Text>
              </View>

              <View style={styles.kundliWindowActions}>
                <TouchableOpacity
                  accessibilityLabel="Minimize client Kundli"
                  onPress={() => setIsClientKundliMinimized(true)}
                  style={styles.kundliWindowAction}
                >
                  <Ionicons name="remove" size={RF(19)} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel={
                    isClientKundliExpanded
                      ? "Restore client Kundli size"
                      : "Expand client Kundli"
                  }
                  onPress={() =>
                    setIsClientKundliExpanded((expanded) => !expanded)
                  }
                  style={styles.kundliWindowAction}
                >
                  <Ionicons
                    name={
                      isClientKundliExpanded
                        ? "contract-outline"
                        : "expand-outline"
                    }
                    size={RF(16)}
                    color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Close client Kundli"
                  onPress={() => setShowClientKundli(false)}
                  style={styles.kundliWindowAction}
                >
                  <Ionicons name="close" size={RF(18)} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              pointerEvents={isClientKundliMinimized ? "none" : "auto"}
              style={[
                styles.kundliWindowContent,
                isClientKundliMinimized && styles.kundliHiddenContent,
              ]}
            >
              <KundliScreen
                data={clientKundliData}
                availableWidth={kundliWindowWidth}
                onClose={() => setShowClientKundli(false)}
              />
            </View>

            {isClientKundliMinimized && (
              <View
                style={styles.kundliBubble}
                {...kundliPanResponder.panHandlers}
              >
                <TouchableOpacity
                  accessibilityLabel="Restore client Kundli"
                  onPress={() => setIsClientKundliMinimized(false)}
                  style={styles.kundliBubbleButton}
                >
                  <Image
                    source={require("../../assets/images/kundli.jpg")}
                    style={{ width: RF(32), height: RF(32) }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0914",
    position: "relative",
  },
  kundliOverlayHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 150,
    elevation: 150,
  },
  kundliWindow: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#e8e8e8",
    backgroundColor: "#fff",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.24,
    shadowRadius: 8,
  },
  kundliWindowToolbar: {
    height: hp(5.5),
    paddingLeft: wp(3),
    paddingRight: wp(1.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ORANGE,
  },
  kundliDragHandle: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  kundliWindowTitle: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
  kundliWindowActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  kundliWindowAction: {
    width: wp(9),
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  kundliWindowContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  kundliHidden: {
    display: "none",
  },
  kundliHiddenContent: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  kundliBubble: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
    borderRadius: wp(3),
  },
  kundliBubbleButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "transparent",
  },
  incomingAvatarCircle: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#16a34a",
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
    backgroundColor: "#16a34a",
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
