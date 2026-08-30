import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
// expo-speech-recognition uses native modules — not available in Expo Go.
// We wrap the import so the app degrades gracefully (mic button is hidden)
// instead of crashing on load.
let ExpoSpeechRecognitionModule = { stop: () => {}, requestPermissionsAsync: async () => ({ granted: false }) };
let useSpeechRecognitionEvent = () => {};
try {
  const speechMod = require("expo-speech-recognition");
  if (speechMod?.ExpoSpeechRecognitionModule) {
    ExpoSpeechRecognitionModule = speechMod.ExpoSpeechRecognitionModule;
  }
  if (speechMod?.useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent = speechMod.useSpeechRecognitionEvent;
  }
} catch (_e) {
  // Native module not available (Expo Go) — mic feature will be hidden
}
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CountdownTimer from "../../components/chat/CountdownTimer";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { getStoredUser } from "../../utils/auth";
import {
  connectSocket,
  emitEvent,
  endChatSession,
  forceReconnectChatSocket,
  getConnectionStatus,
  getSocket,
  joinChatSession,
  onConnectionStatusChange,
  onEvent,
  sendChatMessage,
  emitTypingIndicator,
} from "../../utils/socket";
import {
  useGetChatMessagesQuery,
  useGetConsultationHistoryQuery,
  useMarkRoomReadMutation,
  useSendChatMessageMutation,
} from "../../redux/ChatApi";

const ORANGE = "#ff6a00";
const LOG_TAG = "[ChatScreen]";
const ROOM_POLL_INTERVAL_MS = 5000;

export default function Chat() {
  const {
    consultationId,
    roomId,
    userId,
    name = "Client",
    city = "",
    initials = "C",
    maxDurationSeconds,
  } = useLocalSearchParams();

  // Two independent chat systems share this screen (see ChatApi.js note):
  // - consultationId present -> paid, timed /consultation flow (socket-driven).
  // - roomId only -> persistent /chat/rooms free-form thread (REST-driven,
  //   polled for near-real-time since no confirmed live-push event exists yet).
  const isConsultationMode = !!consultationId;
  const effectiveRoomId = roomId || consultationId;

  const [astrologer, setAstrologer] = useState(null);
  const [messages, setMessages] = useState([]); // consultation mode only (socket-appended)
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  // Optimistic: this screen is only ever reached (in consultation mode) right
  // after the astrologer accepts, via ChatRequestProvider's accept -> push.
  // Waiting for network confirmation before showing "active" leaves the
  // header stuck on "Connected"/"Reconnecting..." for however long that
  // round trip takes, even though the chat is already live. The fallback
  // resync effect below still corrects this if the assumption turns out
  // wrong (e.g. the chat had already ended by the time this mounts).
  const [chatActive, setChatActive] = useState(isConsultationMode);
  const [chatEnded, setChatEnded] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    maxDurationSeconds ? Number(maxDurationSeconds) : null,
  );
  // Gates the consultation-history poll below off once the fallback resync
  // effect has actually seen a definitive status (ongoing-with-startedAt, or
  // ended) - until then, the very first fetch may have raced the backend's
  // own write of that status (it's queried immediately after accept), so a
  // single one-shot fetch isn't reliable.
  const [historyResolved, setHistoryResolved] = useState(false);
  const [socketConnected, setSocketConnected] = useState(
    () => getConnectionStatus() === "connected",
  );
  const [connStatus, setConnStatus] = useState(() => getConnectionStatus());

  const listRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const timerRef = useRef(null);
  // Guards against double-alerting: the live "chat_ended" socket event and
  // the consultation-history fallback below can both independently decide
  // the chat has ended (e.g. one while backgrounded, the other on resume).
  const endAlertShownRef = useRef(false);
  const refetchMessagesRef = useRef(null);
  const refetchConsultationHistoryRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const user = await getStoredUser();
      if (isMounted) setAstrologer(user);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(
    { roomId },
    {
      skip: !roomId || isConsultationMode,
      // Room mode has no confirmed real-time push event yet (see ChatApi.js),
      // so poll for new messages. Consultation mode gets messages live via
      // socket, no polling needed there.
      pollingInterval: isConsultationMode ? 0 : ROOM_POLL_INTERVAL_MS,
    },
  );

  // Kept in refs (rather than added to the socket effect's deps) so the
  // reconnect handler always calls the latest refetch fn without needing to
  // tear down and re-run the join/listener setup on every render.
  useEffect(() => {
    refetchMessagesRef.current = refetchMessages;
  }, [refetchMessages]);

  const [sendChatMessageMutation] = useSendChatMessageMutation();
  const [markRoomRead] = useMarkRoomReadMutation();

  // Room mode renders directly from the polled query (REST is the source of
  // truth). Consultation mode seeds once from history then appends live via
  // socket (see onNewMessage below).
  const displayMessages = isConsultationMode ? messages : (historyData?.messages ?? []);

  // Consultation mode: messaging only makes sense while a live session is
  // actually running - not before it's started (e.g. this screen mounted
  // ahead of "chat_started"/the wall-clock fallback resolving) and not after
  // it's ended. Room mode has no such live/active concept, so it's always
  // sendable until the thread itself is gone.
  const canMessage = !chatEnded && (!isConsultationMode || chatActive);

  useEffect(() => {
    console.log(LOG_TAG, "history query state:", {
      isConsultationMode,
      effectiveRoomId,
      historyLoading,
      messageCount: historyData?.messages?.length ?? 0,
    });

    if (isConsultationMode && historyData?.messages) {
      console.log(LOG_TAG, "SEEDING HISTORY MESSAGES:", historyData.messages.length);
      setMessages(historyData.messages);
    }
  }, [historyData, historyLoading, effectiveRoomId, isConsultationMode]);

  useEffect(() => {
    if (historyError) {
      console.log(
        LOG_TAG,
        "HISTORY FETCH ERROR:",
        JSON.stringify(historyError),
      );
    }
  }, [historyError]);

  // Room mode: mark the thread read as soon as it's opened.
  useEffect(() => {
    if (!isConsultationMode && effectiveRoomId) {
      console.log(LOG_TAG, "ROOM MODE: marking room read:", effectiveRoomId);
      markRoomRead(effectiveRoomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsultationMode, effectiveRoomId]);

  // Room mode: debug tap on the shared app-wide socket so the real live-push
  // event name (if the backend has one) shows up in logs immediately when
  // observed, instead of guessing. Does not attach any active listeners.
  useEffect(() => {
    if (isConsultationMode) return undefined;

    const socket = getSocket();

    if (!socket) {
      console.log(LOG_TAG, "ROOM MODE: no socket instance for debug tap");
      return undefined;
    }

    const debugTap = (eventName, ...args) => {
      console.log(
        LOG_TAG,
        "ROOM MODE socket event (debug tap - not yet wired to any handler):",
        eventName,
        JSON.stringify(args),
      );
    };

    socket.onAny(debugTap);
    console.log(LOG_TAG, "ROOM MODE: attached debug onAny tap");

    return () => socket.offAny(debugTap);
  }, [isConsultationMode]);

  // Consultation mode: "chat_started" only fires ONCE, at the exact moment
  // the astrologer accepts (confirmed live). If this screen mounts any time
  // after that (reconnect, app backgrounded/foregrounded, any remount) that
  // event never fires again, so relying on it alone leaves the header stuck
  // on "Connecting..." forever even while messages are actively flowing.
  // Fall back to the real consultation record (status/startedAt/maxDuration -
  // confirmed present on every consultation via GET /consultation/history)
  // to compute the true state and remaining time from wall-clock, self-
  // healing regardless of whether the live event fires this session.
  const {
    data: consultationHistoryData,
    refetch: refetchConsultationHistory,
  } = useGetConsultationHistoryQuery(
    { page: 1, limit: 50 },
    {
      skip: !isConsultationMode,
      // Short-lived poll so the fallback below can retry if its first fetch
      // raced the backend's status write right after accept - stops once a
      // definitive status has actually been seen.
      pollingInterval: isConsultationMode && !historyResolved ? 3000 : 0,
    },
  );

  useEffect(() => {
    refetchConsultationHistoryRef.current = refetchConsultationHistory;
  }, [refetchConsultationHistory]);

  // Note this no longer gates on `chatActive` - the countdown's own
  // setInterval (below) is paused for the entire time the app is
  // backgrounded (RN freezes JS timers), so on resume it just keeps
  // counting from wherever it was left, understating how much time has
  // actually elapsed. Recomputing "remaining" from match.startedAt/
  // maxDuration here (wall-clock truth) resyncs it any time this query is
  // refetched - including the reconnect-triggered refetch below - not just
  // on first mount.
  useEffect(() => {
    if (!isConsultationMode || chatEnded) return;

    const match = consultationHistoryData?.consultations?.find(
      (c) => c.id === consultationId,
    );

    console.log(LOG_TAG, "consultation status fallback lookup:", JSON.stringify(match));

    if (!match) return;

    if (match.status === "ongoing" && match.startedAt) {
      const startedAtMs = new Date(match.startedAt).getTime();
      const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
      const remaining = Math.max(0, (match.maxDuration ?? 0) - elapsedSec);

      console.log(LOG_TAG, "RECOVERED/RESYNCED ongoing chat state:", { elapsedSec, remaining });

      setChatActive(true);
      setSecondsLeft(remaining);
      setHistoryResolved(true);
    } else if (["completed", "missed", "cancelled"].includes(match.status)) {
      console.log(LOG_TAG, "RECOVERED ended chat state:", match.status);

      setChatActive(false);
      setChatEnded(true);
      setHistoryResolved(true);

      // The live "chat_ended" socket event (which carries the amount and
      // shows the alert) only fires while connected - if the chat ended
      // entirely during a backgrounded/disconnected window, that event is
      // gone for good and this fallback is the only thing that ever learns
      // the chat ended. Without this, the astrologer just sees the input
      // silently disable with no explanation of what happened or what they
      // earned.
      if (!endAlertShownRef.current) {
        endAlertShownRef.current = true;

        const amount = match?.amount ?? match?.consultation?.amount ?? null;

        Alert.alert(
          "Chat Ended",
          amount != null
            ? `Consultation Amount: ₹${amount}`
            : "This chat session has ended.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log(LOG_TAG, "fallback chat-ended alert dismissed: navigating to home");
                router.replace("/(home)");
              },
            },
          ],
        );
      }
    }
  }, [consultationHistoryData, isConsultationMode, consultationId, chatEnded]);

  // Consultation mode: join the socket room + wire up all live listeners.
  useEffect(() => {
    if (!isConsultationMode) return undefined;

    let isMounted = true;
    const unsubscribers = [];
    let currentUser = null;

    // Re-emits the join. A reconnect (app backgrounded/foregrounded, network
    // flap) gets the socket a brand-new socket.id, so the server-side room
    // membership set up by the first join is gone even though the client-side
    // socket instance and its listeners are untouched. Without replaying this
    // on every reconnect, the client looks connected but silently stops
    // receiving chat events.
    const joinChatSession = () => {
      if (!isMounted || !consultationId) return;

      console.log(LOG_TAG, "EMIT join_chat_session:", consultationId);

      emitEvent("join_chat_session", {
        consultationId,
        userId: currentUser?.id,
        role: "astrologer",
      });
    };

    const setup = async () => {
      currentUser = await getStoredUser();

      if (!isMounted) return;

      const socket = getSocket();

      console.log(LOG_TAG, "socket setup:", {
        hasSocket: !!socket,
        socketConnected: socket?.connected,
        consultationId,
      });

      if (!socket || !consultationId) {
        console.log(
          LOG_TAG,
          "CANNOT JOIN, MISSING SOCKET OR consultationId",
          { hasSocket: !!socket, consultationId },
        );
        return;
      }

      // Track connection status
      const unsubStatus = onConnectionStatusChange((status) => {
        if (!isMounted) return;
        setConnStatus(status);
        setSocketConnected(status === "connected");
      });
      unsubscribers.push(unsubStatus);

      joinChatSession();

      // Verified live (socket.io probe): the server acks the join on the
      // caller's own socket via "chat_session_joined", e.g.
      // { status, room: "chat_session_<consultationId>", consultationId, message }.
      const onSessionJoined = (data) => {
        console.log(LOG_TAG, "chat_session_joined:", JSON.stringify(data));
      };

      const onChatStarted = (data) => {
        console.log(LOG_TAG, "chat_started:", JSON.stringify(data));

        setChatActive(true);

        if (data?.maxDurationSeconds != null) {
          setSecondsLeft(data.maxDurationSeconds);
        }
      };

      const onNewMessage = (data) => {
        console.log(LOG_TAG, "new_chat_message:", JSON.stringify(data));

        setMessages((prev) => {
          const pendingIndex = data?.clientTempId
            ? prev.findIndex((m) => m.clientTempId === data.clientTempId)
            : prev.findIndex(
                (m) =>
                  m.status === "sending" &&
                  m.senderId === data?.senderId &&
                  m.message === data?.message,
              );

          if (pendingIndex > -1) {
            const next = [...prev];
            next[pendingIndex] = { ...data, status: "sent" };
            return next;
          }

          return [...prev, data];
        });

        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: true });
        });
      };

      // Verified live: the backend broadcasts typing state as "user_typing"
      // (NOT "typing_indicator" - that's only the client->server emit name
      // used when the *other* party is the one typing). Payload shape:
      // { consultationId, role, isTyping }.
      const onTyping = (data) => {
        console.log(LOG_TAG, "user_typing:", JSON.stringify(data));

        if (data?.role === "astrologer") return; // ignore our own echo, if any

        setRemoteTyping(!!data?.isTyping);
      };

      const onChatEnded = (data) => {
        console.log(LOG_TAG, "chat_ended:", JSON.stringify(data));

        setChatActive(false);
        setChatEnded(true);
        endAlertShownRef.current = true;

        if (timerRef.current) clearInterval(timerRef.current);

        // Verified live: chat_ended payload is
        // { consultationId, reason, consultation: { amount, duration, ... }, userMessage }.
        // There is no astrologerEarnings/netEarnings field from the backend.
        const amount = data?.consultation?.amount;
        const endReason = data?.reason;

        let alertTitle = "Chat Ended";
        let alertMsg = "This chat session has ended.";

        if (endReason === "time_expired") {
          alertTitle = "Time Expired";
          alertMsg = "Consultation time limit reached.";
        } else {
          alertTitle = "Chat Ended by Client";
          alertMsg = `Client has ended this chat consultation session.${amount != null ? ` Total Earnings: ₹${amount}` : ""}`;
        }

        Alert.alert(
          alertTitle,
          alertMsg,
          [
            {
              text: "OK",
              onPress: () => {
                console.log(LOG_TAG, "chat_ended: navigating to home");
                router.replace("/(home)");
              },
            },
          ],
        );
      };

      socket.on("chat_session_joined", onSessionJoined);
      socket.on("chat_started", onChatStarted);
      socket.on("new_chat_message", onNewMessage);
      socket.on("user_typing", onTyping);
      socket.on("chat_ended", onChatEnded);

      // Rejoin the room + backfill anything we missed. Rejoining alone only
      // restores *future* events - it does nothing for messages, a
      // chat_started, or a chat_ended that the server pushed while we had
      // no live listener running to receive them (either fully disconnected,
      // or connected-but-frozen while backgrounded). Refetching both queries
      // makes the existing history-seeding effects (above) replace local
      // state wholesale with server truth, so it doubles as backfill without
      // needing to manually dedupe/merge messages.
      const reconcileAfterReconnect = (source) => {
        console.log(LOG_TAG, "reconciling chat state:", source);

        joinChatSession();
        if (!isConsultationMode && roomId) {
          refetchMessagesRef.current?.();
        }
        if (isConsultationMode) {
          refetchConsultationHistoryRef.current?.();
        }
      };

      let hasConnectedBefore = socket.connected;
      let prevStatus = getConnectionStatus();

      // We'll reconcile state if status transitions from non-connected to connected
      const unsubStatusReconcile = onConnectionStatusChange((status) => {
        if (status === "connected" && prevStatus !== "connected" && hasConnectedBefore) {
          reconcileAfterReconnect("socket reconnected");
        }
        if (status === "connected") {
          hasConnectedBefore = true;
        }
        prevStatus = status;
      });
      unsubscribers.push(unsubStatusReconcile);

      // The RN JS thread itself is suspended while backgrounded, so socket.io's
      // reconnection loop doesn't run at all during that time no matter how
      // many attempts are configured - it only resumes once the app is
      // foregrounded again. Even then, socket.io may not notice the
      // connection died until its ping-timeout heartbeat expires (up to
      // ~20s), which was itself frozen while backgrounded. So on resume we
      // can't just passively wait for "connect"/"reconnect" to fire on its
      // own timeline - force it.
      const onAppStateChange = (nextState) => {
        if (nextState !== "active") return;

        console.log(LOG_TAG, "app foregrounded:", {
          socketConnected: socket.connected,
        });

        if (getConnectionStatus() !== "connected") {
          console.log(LOG_TAG, "forcing socket reconnect on foreground");
          forceReconnectChatSocket();
        }

        // Always reconcile on resume, even if the socket claims it never
        // disconnected: the transport can stay technically "connected"
        // through a background cycle while the JS thread (and therefore
        // event handling) was frozen the whole time, so events the server
        // pushed during that window may never have been processed. This is
        // idempotent/cheap, so there's no reason to try to be clever about
        // detecting which case happened.
        reconcileAfterReconnect("app foregrounded");
      };

      const appStateSub = AppState.addEventListener("change", onAppStateChange);

      unsubscribers.push(
        () => socket.off("chat_session_joined", onSessionJoined),
        () => socket.off("chat_started", onChatStarted),
        () => socket.off("new_chat_message", onNewMessage),
        () => socket.off("user_typing", onTyping),
        () => socket.off("chat_ended", onChatEnded),
        () => appStateSub.remove(),
      );
    };

    setup();

    return () => {
      isMounted = false;
      unsubscribers.forEach((off) => off());
      if (timerRef.current) clearInterval(timerRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId, isConsultationMode]);

  // Countdown timer while chat is active (consultation mode only)
  useEffect(() => {
    if (!chatActive || secondsLeft == null) return undefined;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev == null) return prev;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [chatActive]);

  // Auto-end chat when timer expires
  useEffect(() => {
    if (!chatActive || chatEnded || secondsLeft === null || secondsLeft > 0) {
      return;
    }

    console.log(LOG_TAG, "Countdown expired, auto-ending chat session");
    endChatSession("time_expired");
  }, [chatActive, chatEnded, secondsLeft]);

  // Voice-to-text: permission is requested lazily, only when the user
  // actually taps the mic - not upfront on mount - so we don't prompt
  // people who never use dictation.
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results?.[0]?.transcript;
    if (transcript != null) setInputText(transcript);
  });

  useSpeechRecognitionEvent("end", () => setIsListening(false));

  useSpeechRecognitionEvent("error", (event) => {
    console.log(LOG_TAG, "speech recognition error:", event.error, event.message);
    setIsListening(false);
  });

  // Stop listening if the user navigates away mid-dictation.
  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  const handleMicPress = async () => {
    if (!canMessage) return;

    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
      return;
    }

    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();

    if (!granted) {
      Alert.alert(
        "Microphone Access Needed",
        "Please allow microphone and speech recognition access to use voice-to-text.",
      );
      return;
    }

    setIsListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  const handleChangeText = (text) => {
    setInputText(text);

    if (!isConsultationMode) return; // typing indicator is consultation-flow only

    emitEvent("typing_indicator", {
      consultationId,
      role: "astrologer",
      isTyping: true,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitEvent("typing_indicator", {
        consultationId,
        role: "astrologer",
        isTyping: false,
      });
    }, 1500);
  };

  const handleSend = async () => {
    const trimmed = inputText.trim();

    if (!trimmed || !canMessage) return;

    if (isConsultationMode) {
      console.log(LOG_TAG, "SENDING MESSAGE (consultation/socket):", trimmed);

      const clientTempId = "temp_" + Date.now();
      const tempMsg = {
        id: clientTempId,
        clientTempId,
        senderId: astrologer?.id,
        senderRole: "astrologer",
        message: trimmed,
        messageType: "TEXT",
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, tempMsg]);

      emitEvent("send_chat_message", {
        consultationId,
        senderId: astrologer?.id,
        senderRole: "astrologer",
        message: trimmed,
        messageType: "TEXT",
        clientTempId,
      });

      setInputText("");
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
      return;
    }

    console.log(LOG_TAG, "SENDING MESSAGE (room/REST):", trimmed);
    setInputText("");

    try {
      const result = await sendChatMessageMutation({
        roomId: effectiveRoomId,
        message: trimmed,
        messageType: "TEXT",
      }).unwrap();

      console.log(LOG_TAG, "ROOM MESSAGE SENT:", JSON.stringify(result));

      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    } catch (err) {
      console.log(LOG_TAG, "ROOM MESSAGE SEND FAILED:", JSON.stringify(err));

      Alert.alert(
        "Send Failed",
        "Couldn't send your message. Please check your connection and try again.",
      );

      setInputText(trimmed); // restore so they can retry
    }
  };

  // There is no REST endpoint for ending a chat on this backend (confirmed
  // live: the socket emit itself is what marks the consultation "completed"
  // server-side). Returns whether the emit actually had a connected socket
  // to go out on, so callers can warn instead of assuming it worked.
  const endChatSession = (reason = "completed") => {
    const socket = getSocket();
    const connected = !!socket?.connected;

    console.log(LOG_TAG, "EMIT end_chat_session:", {
      consultationId,
      socketConnected: connected,
      reason,
    });

    if (!connected) {
      console.log(
        LOG_TAG,
        `end_chat_session NOT SENT (${reason}) - socket disconnected, backend session will remain open`,
      );

      Alert.alert(
        "Connection Issue",
        "Couldn't reach the server to end this chat (no connection). The session may still be running on the server - please check your connection and try again.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log(LOG_TAG, "connection issue alert dismissed: navigating to home");
              router.replace("/(home)");
            },
          },
        ],
      );

      return false;
    }

    emitEvent("end_chat_session", {
      consultationId,
      reason,
    });

    return true;
  };

  const handleEndChat = () => {
    Alert.alert("End Chat", "Are you sure you want to end this chat session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Chat",
        style: "destructive",
        onPress: endChatSession,
      },
    ]);
  };

  // Back (header chevron and Android hardware back). Consultation mode must
  // end the chat session the same way the top-right close button does, not
  // just navigate away and leave the session hanging open on the backend.
  // Room mode has no session to end - just navigate back.
  const handleBack = () => {
    console.log(LOG_TAG, "BACK PRESSED:", {
      isConsultationMode,
      chatActive,
      chatEnded,
      consultationId,
    });

    if (!isConsultationMode || chatEnded || !chatActive) {
      router.back();
      return;
    }

    Alert.alert(
      "End Chat",
      "Going back will end this chat session. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Chat",
          style: "destructive",
          onPress: () => {
            const sent = endChatSession();

            console.log(LOG_TAG, "BACK: end_chat_session sent =", sent);

            // Navigate back regardless - endChatSession() already surfaced a
            // connection-issue alert if the emit couldn't go out, and there's
            // no point trapping the astrologer on this screen either way.
            router.back();
          },
        },
      ],
    );
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        console.log(LOG_TAG, "HARDWARE BACK PRESSED");
        handleBack();
        return true; // we handle navigation ourselves
      },
    );

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsultationMode, chatActive, chatEnded, consultationId]);

  const renderMessage = ({ item }) => {
    const isMine =
      item.senderRole === "astrologer" || item.senderId === astrologer?.id;

    return (
      <View style={isMine ? styles.rightBubble : styles.leftBubble}>
        <Text style={styles.msgText}>{item.message}</Text>
        <Text style={isMine ? styles.rightTime : styles.leftTime}>
          {item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{name}</Text>

            {isConsultationMode && (
              <View style={styles.locationRow}>
                {/* <Ionicons name="time-outline" size={RF(11)} color={ORANGE} /> */}
                {chatActive && !chatEnded && socketConnected && secondsLeft != null ? (
                  <Text style={styles.city}>
                    Live · <CountdownTimer secondsLeft={secondsLeft} /> left
                  </Text>
                ) : (
                  <Text style={styles.city}>
                    {chatEnded
                      ? "Client ended chat"
                      : !socketConnected
                        ? "Reconnecting..."
                        : chatActive
                          ? "Connected"
                          : city || "Connected"}
                  </Text>
                )}
              </View>
            )}
          </View>

          {isConsultationMode ? (
            <TouchableOpacity onPress={handleEndChat} disabled={chatEnded}>
              <Ionicons
                name="close-circle-outline"
                size={RF(22)}
                color={chatEnded ? "#c9c9c9" : "#dc2626"}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: RF(22) }} />
          )}
        </View>

        {isConsultationMode && connStatus !== "connected" && !chatEnded && (
          <View style={styles.warningBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={RF(14)}
              color="#fff"
            />
            <Text style={styles.warningText}>
              {connStatus === "connecting"
                ? "Connecting to server..."
                : connStatus === "reconnecting"
                  ? "Reconnecting to server..."
                  : "Disconnected. Check your internet connection."}
            </Text>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={displayMessages}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          ListHeaderComponent={
            <View style={styles.secureBox}>
              <Ionicons name="lock-closed-outline" size={RF(11)} color={ORANGE} />
              <Text style={styles.secureText}>
                {historyLoading
                  ? "Loading chat history..."
                  : "This is a secure chat. Your conversation is private and confidential."}
              </Text>
            </View>
          }
          ListFooterComponent={
            remoteTyping ? (
              <Text style={styles.typingText}>{name} is typing...</Text>
            ) : null
          }
        />

        {isListening && (
          <View style={styles.listeningRow}>
            <Ionicons name="mic" size={RF(12)} color={ORANGE} />
            <Text style={styles.listeningText}>Listening...</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder={
              chatEnded
                ? "Chat has ended"
                : !canMessage
                  ? "Waiting for chat to start..."
                  : "Type a message..."
            }
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={inputText}
            onChangeText={handleChangeText}
            editable={canMessage}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[
              styles.micBtn,
              isListening && styles.micBtnActive,
              !canMessage && { opacity: 0.5 },
            ]}
            onPress={handleMicPress}
            disabled={!canMessage}
          >
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={RF(18)}
              color={isListening ? "#fff" : ORANGE}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendBtn, !canMessage && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={!canMessage}
          >
            <Ionicons name="send" size={RF(18)} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  header: {
    height: hp(7),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  avatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#fff1e8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
    marginRight: wp(3),
  },
  avatarText: {
    color: ORANGE,
    fontSize: RF(11.5),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.3),
  },
  city: {
    color: "#607086",
    fontSize: RF(10),
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  chatContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(2),
  },
  secureBox: {
    alignSelf: "center",
    width: "92%",
    borderWidth: 1,
    borderColor: "#ffe5d2",
    backgroundColor: "#fff8f3",
    borderRadius: wp(2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  secureText: {
    flex: 1,
    marginLeft: wp(2),
    color: "#607086",
    fontSize: RF(12),
    textAlign: "center",
    lineHeight: hp(1.6),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  listeningRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(0.6),
  },
  listeningText: {
    color: ORANGE,
    fontSize: RF(11),
    marginLeft: wp(1.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  typingText: {
    alignSelf: "flex-start",
    color: "#9ca3af",
    fontSize: RF(12),
    fontStyle: "italic",
    marginTop: hp(0.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  leftBubble: {
    maxWidth: "85%",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  rightBubble: {
    maxWidth: "85%",
    alignSelf: "flex-end",
    backgroundColor: "#fff6f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2.5),
  },
  msgText: {
    fontSize: RF(16),
    color: "#111827",
    lineHeight: RF(16) * 1.35,
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  leftTime: {
    color: "#607086",
    fontSize: RF(12),
    marginTop: hp(0.6),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  rightTime: {
    color: "#607086",
    fontSize: RF(12),
    marginTop: hp(0.6),
    textAlign: "right",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  inputWrapper: {
    minHeight: hp(7),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: hp(5),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(6),
    paddingHorizontal: wp(3.5),
    fontSize: RF(11),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  sendBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
  },
  micBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#fff1e8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
  },
  micBtnActive: {
    backgroundColor: "#dc2626",
  },
  warningBanner: {
    backgroundColor: "#eab308",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(0.8),
    gap: wp(1.5),
  },
  warningText: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
