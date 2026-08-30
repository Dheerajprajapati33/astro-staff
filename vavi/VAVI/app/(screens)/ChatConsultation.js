import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  AppState,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "../../components/chat/ChatHeader";
import ChatInputBar from "../../components/chat/ChatInputBar";
import MessageBubble from "../../components/chat/MessageBubble";
import TypingIndicator from "../../components/chat/TypingIndicator";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import {
  useCreateReviewMutation,
  useGetConsultationHistoryQuery,
} from "../../redux/consultationApi";
import PostConsultationReviewModal from "../../components/review/PostConsultationReviewModal";
import {
  connectChatSocket,
  disconnectChatSocket,
  emitTypingIndicator,
  endChatSession,
  forceReconnectChatSocket,
  getChatSocket,
  joinChatSession,
  onConnectionStatusChange,
  removeChatListeners,
  sendChatMessage,
} from "../../services/chatSocketService";

// How long an outgoing message can sit unconfirmed before it's shown as
// failed (with a tap-to-retry affordance). sendChatMessage() is a bare
// socket.emit with no server ack, so without this timeout a dropped send
// looks identical to a successful one — the bubble just never appears.
const SEND_TIMEOUT_MS = 10000;

const LOG_TAG = "[ChatConsultation]";

export default function ChatConsultation() {
  const params = useLocalSearchParams();

  const consultationId = Array.isArray(params?.consultationId)
    ? params.consultationId[0]
    : params?.consultationId;

  const astrologerId = Array.isArray(params?.astrologerId)
    ? params.astrologerId[0]
    : params?.astrologerId;

  const astrologerName = Array.isArray(params?.astrologerName)
    ? params.astrologerName[0]
    : params?.astrologerName;

  const initialMaxDuration = Number(
    Array.isArray(params?.maxDuration) ? params.maxDuration[0] : params?.maxDuration,
  ) || 1500;

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(initialMaxDuration);
  const [secondsLeft, setSecondsLeft] = useState(initialMaxDuration);
  const [messages, setMessages] = useState([]);
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const [createReviewMutation] = useCreateReviewMutation();

  const listRef = useRef(null);
  const hasLoadedHistoryRef = useRef(false);
  const sendTimeoutsRef = useRef({});
  const hasConnectedOnceRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // Guards against double-alerting: the live "chat_ended" socket event and
  // the consultation-history wall-clock fallback below can both
  // independently decide the chat has ended (e.g. one while backgrounded,
  // the other on resume).
  const endAlertShownRef = useRef(false);
  const refetchConsultationHistoryRef = useRef(null);

  const {
    data: consultationHistoryData,
    isFetching: isHistoryFetching,
    isLoading: isHistoryLoading,
    refetch: refetchConsultationHistory,
  } = useGetConsultationHistoryQuery(
    { page: 1, limit: 50 },
    { skip: !consultationId },
  );

  useEffect(() => {
    refetchConsultationHistoryRef.current = refetchConsultationHistory;
  }, [refetchConsultationHistory]);

  // Load current user id (needed to tag outgoing messages / senderId)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");

        if (userData) {
          const parsed = JSON.parse(userData);

          setCurrentUserId(parsed?.user?.id ?? parsed?.id ?? null);

          console.log(LOG_TAG, "Loaded current user id:", parsed?.user?.id);
        }
      } catch (error) {
        console.log(LOG_TAG, "Failed to load user from AsyncStorage:", error);
      }
    };

    loadUser();
  }, []);

  // Messages are populated entirely from socket events (new_chat_message).
  // The /chat/rooms REST endpoint is NOT used for consultation-based chat —
  // that endpoint is for persistent standalone chat rooms which are a
  // separate backend system. Messages received before this screen mounted
  // are recoverable via pull-to-refresh → refetchConsultationHistory.

  // Resync chat/timer state from wall-clock truth whenever the consultation
  // history query lands (mount, reconnect, foreground). Doesn't gate on
  // isChatActive — the countdown's own setInterval below is paused for the
  // entire time the app is backgrounded (RN freezes JS timers), so on resume
  // it just keeps counting from wherever it was left, understating how much
  // time has actually elapsed. Recomputing "remaining" from
  // consultation.startedAt/maxDuration here resyncs it any time this query
  // refetches, not just on first mount.
  useEffect(() => {
    if (!consultationId || chatEnded) return;

    const match = consultationHistoryData?.consultations?.find(
      (c) => c.id === consultationId,
    );

    if (!match) return;

    if (match.status === "ongoing" && match.startedAt) {
      const startedAtMs = new Date(match.startedAt).getTime();
      const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
      const remaining = Math.max(0, (match.maxDuration ?? maxDurationSeconds) - elapsedSec);

      console.log(LOG_TAG, "RECOVERED/RESYNCED ongoing chat state:", { elapsedSec, remaining });

      setIsChatActive(true);
      setMaxDurationSeconds(match.maxDuration ?? maxDurationSeconds);
      setSecondsLeft(remaining);
    } else if (["completed", "missed", "cancelled"].includes(match.status)) {
      console.log(LOG_TAG, "RECOVERED ended chat state:", match.status);

      setIsChatActive(false);
      setChatEnded(true);

      // The live "chat_ended" socket event only fires while connected - if
      // the chat ended entirely during a backgrounded/disconnected window,
      // that event is gone for good and this fallback is the only thing
      // that ever learns the chat ended.
      if (!endAlertShownRef.current) {
        endAlertShownRef.current = true;

        Alert.alert(
          "Chat Ended",
          "Your chat consultation has ended.",
          [{ text: "OK", onPress: () => router.back() }],
        );
      }
    }
  }, [consultationHistoryData, consultationId, chatEnded, maxDurationSeconds]);

  // Countdown timer while chat is active. Paused entirely while the app is
  // backgrounded (RN freezes JS timers) — the resync effect above corrects
  // for the lost time as soon as history is refetched on foreground/reconnect.
  useEffect(() => {
    if (!isChatActive || chatEnded) return undefined;

    timerIntervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev == null) return prev;

        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [isChatActive, chatEnded]);

  // Socket lifecycle: connect, join room, wire listeners
  useEffect(() => {
    if (!consultationId || !currentUserId) {
      return;
    }

    let isMounted = true;

    const setup = async () => {
      console.log(LOG_TAG, "Setting up chat socket for consultation:", consultationId);

      const socket = await connectChatSocket();

      if (!isMounted || !socket) return;

      joinChatSession({
        consultationId,
        userId: currentUserId,
        role: "user",
      });

      socket.on("chat_started", (data) => {
        console.log(LOG_TAG, "chat_started event:", data);

        setIsChatActive(true);

        if (data?.maxDurationSeconds) {
          setMaxDurationSeconds(data.maxDurationSeconds);
          setSecondsLeft(data.maxDurationSeconds);
        }
      });

      socket.on("new_chat_message", (data) => {
        console.log(LOG_TAG, "new_chat_message event:", data);

        setMessages((prev) => {
          // Reconcile against our own optimistic "sending" bubble instead of
          // appending a duplicate: prefer an echoed clientTempId, and fall
          // back to matching the oldest still-pending message with the same
          // text/sender in case the server strips unknown fields.
          const pendingIndex = data?.clientTempId
            ? prev.findIndex((m) => m.clientTempId === data.clientTempId)
            : prev.findIndex(
                (m) =>
                  m.status === "sending" &&
                  m.senderId === data?.senderId &&
                  m.message === data?.message,
              );

          if (pendingIndex === -1) {
            return [...prev, data];
          }

          const clientTempId = prev[pendingIndex].clientTempId;

          if (clientTempId && sendTimeoutsRef.current[clientTempId]) {
            clearTimeout(sendTimeoutsRef.current[clientTempId]);

            delete sendTimeoutsRef.current[clientTempId];
          }

          const next = [...prev];

          next[pendingIndex] = data;

          return next;
        });
      });

      // The backend broadcasts the OTHER party's typing state under
      // "user_typing" — "typing_indicator" (emitted via emitTypingIndicator)
      // is the outbound event name only and never comes back to us.
      socket.on("user_typing", (data) => {
        if (data?.role === "astrologer") {
          setIsAstrologerTyping(Boolean(data?.isTyping));
        }
      });

      socket.on("chat_ended", (data) => {
        console.log(LOG_TAG, "chat_ended event:", data);

        setIsChatActive(false);
        setChatEnded(true);
        endAlertShownRef.current = true;

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        setShowReviewModal(true);
      });
    };

    setup();

    return () => {
      isMounted = false;

      console.log(LOG_TAG, "Cleaning up chat socket listeners for:", consultationId);

      removeChatListeners();
    };
  }, [consultationId, currentUserId]);

  // Fully disconnect socket on screen unmount
  useEffect(() => {
    return () => {
      console.log(LOG_TAG, "Unmounting ChatConsultation screen, disconnecting socket");

      disconnectChatSocket();
    };
  }, []);

  // Mirror the socket's connection status so the UI can show a banner
  // instead of leaving "connecting"/"reconnecting"/dropped states silent.
  useEffect(() => {
    const unsubscribe = onConnectionStatusChange((status) => {
      if (status === "connected") {
        // Reconciles state after a real reconnect (not the initial connect,
        // which the join + history queries already cover). A reconnect gets
        // the socket a brand-new socket.id, so any chat_started/chat_ended
        // pushed while we were disconnected was missed — refetching history
        // is what backfills it, doubling as the timer resync.
        if (hasConnectedOnceRef.current) {
          console.log(LOG_TAG, "Socket reconnected, resyncing consultation history");

          refetchConsultationHistoryRef.current?.();
        }

        hasConnectedOnceRef.current = true;
      }

      setConnectionStatus(status);
    });

    return unsubscribe;
  }, []);

  // Clear any outstanding send-confirmation timers on unmount.
  useEffect(() => {
    return () => {
      Object.values(sendTimeoutsRef.current).forEach(clearTimeout);

      sendTimeoutsRef.current = {};
    };
  }, []);

  // Clear the pending typing-debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = null;
      }
    };
  }, []);

  // Resuming from background: the JS thread (and with it socket.io's
  // reconnect loop + ping/pong heartbeat) was frozen while backgrounded, so
  // the socket won't notice it's dead on its own for a while. Force a fresh
  // handshake immediately and backfill anything sent while we were away.
  useEffect(() => {
    if (!consultationId || !currentUserId) {
      return;
    }

    const appStateRef = { current: AppState.currentState };

    const handleAppStateChange = (nextState) => {
      const cameToForeground =
        appStateRef.current.match(/inactive|background/) && nextState === "active";

      appStateRef.current = nextState;

      if (!cameToForeground) {
        return;
      }

      console.log(LOG_TAG, "App resumed, forcing chat socket reconnect");

      forceReconnectChatSocket();
      refetchConsultationHistoryRef.current?.();
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [consultationId, currentUserId]);

  const armSendTimeout = useCallback((clientTempId) => {
    if (sendTimeoutsRef.current[clientTempId]) {
      clearTimeout(sendTimeoutsRef.current[clientTempId]);
    }

    sendTimeoutsRef.current[clientTempId] = setTimeout(() => {
      console.log(LOG_TAG, "Send timed out, marking as failed:", clientTempId);

      delete sendTimeoutsRef.current[clientTempId];

      setMessages((prev) =>
        prev.map((m) =>
          m.clientTempId === clientTempId && m.status === "sending"
            ? { ...m, status: "failed" }
            : m,
        ),
      );
    }, SEND_TIMEOUT_MS);
  }, []);

  const handleSend = useCallback(
    (text) => {
      if (!consultationId || !currentUserId) {
        console.log(LOG_TAG, "handleSend blocked: missing consultationId/currentUserId");

        return;
      }

      const clientTempId = `${currentUserId}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      setMessages((prev) => [
        ...prev,
        {
          clientTempId,
          senderId: currentUserId,
          senderRole: "user",
          message: text,
          messageType: "TEXT",
          createdAt: new Date().toISOString(),
          status: "sending",
        },
      ]);

      const emitted = sendChatMessage({
        consultationId,
        senderId: currentUserId,
        senderRole: "user",
        message: text,
        messageType: "TEXT",
        clientTempId,
      });

      if (!emitted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.clientTempId === clientTempId ? { ...m, status: "failed" } : m,
          ),
        );

        return;
      }

      armSendTimeout(clientTempId);
    },
    [consultationId, currentUserId, armSendTimeout],
  );

  const handleRetrySend = useCallback(
    (message) => {
      if (!message?.clientTempId || !consultationId || !currentUserId) {
        return;
      }

      console.log(LOG_TAG, "Retrying failed send:", message.clientTempId);

      setMessages((prev) =>
        prev.map((m) =>
          m.clientTempId === message.clientTempId ? { ...m, status: "sending" } : m,
        ),
      );

      const emitted = sendChatMessage({
        consultationId,
        senderId: currentUserId,
        senderRole: "user",
        message: message.message,
        messageType: message.messageType || "TEXT",
        clientTempId: message.clientTempId,
      });

      if (!emitted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.clientTempId === message.clientTempId ? { ...m, status: "failed" } : m,
          ),
        );

        return;
      }

      armSendTimeout(message.clientTempId);
    },
    [consultationId, currentUserId, armSendTimeout],
  );

  const handleTyping = useCallback(
    (isTyping) => {
      if (!consultationId) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      emitTypingIndicator({ consultationId, role: "user", isTyping });

      // Auto-clear our own typing state after 1.5s of no further keystrokes,
      // so the astrologer's indicator doesn't stay stuck on if we stop
      // typing without sending (mirrors chat.js's debounce).
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          typingTimeoutRef.current = null;

          emitTypingIndicator({ consultationId, role: "user", isTyping: false });
        }, 1500);
      }
    },
    [consultationId],
  );

  const handleRefresh = useCallback(() => {
    console.log(LOG_TAG, "Manual refresh pulled — resyncing consultation state + reconnecting socket");

    // Pull-to-refresh: nudge the socket back to life if it dropped silently,
    // and refetch the consultation record to resync timer/status from wall-clock.
    const socket = getChatSocket();

    if (socket && !socket.connected) {
      forceReconnectChatSocket();
    }

    refetchConsultationHistory();
  }, [refetchConsultationHistory]);

  // Fires once the wall-clock-synced countdown (above) actually reaches 0
  // while the chat is live — guarded so a resync landing on 0 again (e.g.
  // another history refetch after the emit already went out) can't
  // double-fire the end-session emit.
  const timerExpiredRef = useRef(false);

  useEffect(() => {
    if (!isChatActive || chatEnded || secondsLeft > 0 || timerExpiredRef.current) {
      return;
    }

    timerExpiredRef.current = true;

    console.log(LOG_TAG, "Countdown expired, auto-ending chat session");

    endChatSession({ consultationId, reason: "time_expired" });
  }, [isChatActive, chatEnded, secondsLeft, consultationId]);

  const handleEndChat = useCallback(() => {
    Alert.alert("End Chat", "Are you sure you want to end this chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Chat",
        style: "destructive",
        onPress: () => {
          console.log(LOG_TAG, "User manually ending chat session");
          endChatSession({ consultationId, reason: "completed" });
          setIsChatActive(false);
          setChatEnded(true);
          setShowReviewModal(true);
        },
      },
    ]);
  }, [consultationId]);

  const handleBack = useCallback(() => {
    if (!isChatActive || chatEnded) {
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
            console.log(LOG_TAG, "User ending chat session via back navigation");

            endChatSession({ consultationId, reason: "completed" });
            router.back();
          },
        },
      ],
    );
  }, [isChatActive, chatEnded, consultationId]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();

      return true;
    });

    return () => subscription.remove();
  }, [handleBack]);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  if (!consultationId) {
    console.log(LOG_TAG, "No consultationId param provided — cannot start chat");

    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ChatHeader
          astrologerName={astrologerName}
          isChatActive={false}
          onEndChat={() => router.back()}
          onBack={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader
        astrologerName={astrologerName}
        isChatActive={isChatActive}
        chatEnded={chatEnded}
        secondsLeft={secondsLeft}
        connectionStatus={connectionStatus}
        onEndChat={handleEndChat}
        onBack={handleBack}
      />

      {connectionStatus !== "connected" && !chatEnded ? (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionBannerText}>
            {!hasConnectedOnceRef.current
              ? "Connecting…"
              : connectionStatus === "reconnecting"
                ? "Reconnecting…"
                : "Disconnected — pull down to retry"}
          </Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item, index) =>
            item?.id?.toString() || `${item?.createdAt || index}-${index}`
          }
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwnMessage={
                item?.senderId === currentUserId || item?.senderRole === "user"
              }
              onRetry={handleRetrySend}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          refreshControl={
            <RefreshControl
              refreshing={isHistoryFetching && !isHistoryLoading}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.secureBox}>
              <Ionicons name="lock-closed-outline" size={RF(11)} color={Colors.primary} />
              <Text style={styles.secureText}>
                {isHistoryLoading
                  ? "Connecting to chat..."
                  : "This is a secure chat. Your conversation is private and confidential."}
              </Text>
            </View>
          }
          ListFooterComponent={
            <TypingIndicator visible={isAstrologerTyping} name={astrologerName} />
          }
        />

        <ChatInputBar
          disabled={!isChatActive || chatEnded}
          onSend={handleSend}
          onTyping={handleTyping}
        />
      </KeyboardAvoidingView>

      {/* Post Consultation Rating & Review Modal */}
      <PostConsultationReviewModal
        visible={showReviewModal}
        onClose={() => router.back()}
        astrologer={{
          id: astrologerId || params?.astrologerId,
          name: astrologerName,
          profilePic: params?.astrologerImage,
        }}
        consultationId={consultationId}
        onSubmitReview={async (payload) => {
          try {
            await createReviewMutation(payload).unwrap();
          } catch (e) {
            console.log("[ChatConsultation] createReview error:", e);
          }
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  flex: {
    flex: 1,
  },

  listContent: {
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
    color: Colors.textGray,
    fontSize: RF(12),
    textAlign: "center",
    lineHeight: hp(1.6),
    fontWeight: "700",
  },

  connectionBanner: {
    paddingVertical: hp(0.6),
    backgroundColor: "#fff3cd",
    alignItems: "center",
  },

  connectionBannerText: {
    color: "#8a6d3b",
    fontSize: RF(8.5),
    fontWeight: "600",
  },
});
