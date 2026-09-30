import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  AppState,
  Pressable,
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
  useDeleteChatMessageMutation,
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
  getConnectionStatus,
  joinChatSession,
  onConnectionStatusChange,
  removeChatListeners,
  sendChatMessage,
  onChatMessageDeleted,
  deleteChatMessageSocket,
} from "../../services/chatSocketService";

import {
  useGetBlockStatusQuery,
  useReportUserMutation,
  useToggleBlockUserMutation,
} from "../../redux/blockReportApi";

// How long an outgoing message can sit unconfirmed before it's shown as
// failed (with a tap-to-retry affordance).
const SEND_TIMEOUT_MS = 10000;

const LOG_TAG = "[ChatConsultation]";
const KUNDLI_DETAILS_PREFIX = "__VAVI_KUNDLI_DETAILS_V1__:";
const KUNDLI_DETAILS_ACK_PREFIX = "__VAVI_KUNDLI_DETAILS_ACK_V1__:";
const KUNDLI_DETAILS_RETRY_MS = 2000;
const KUNDLI_DETAILS_MAX_ATTEMPTS = 5;

export default function ChatConsultation() {
  const params = useLocalSearchParams();

  // ==========================
  // PARAMS
  // ==========================

  const consultationId = Array.isArray(params?.consultationId)
    ? params.consultationId[0]
    : params?.consultationId;

  const astrologerId = Array.isArray(params?.astrologerId)
    ? params.astrologerId[0]
    : params?.astrologerId;

  const astrologerName = Array.isArray(params?.astrologerName)
    ? params.astrologerName[0]
    : params?.astrologerName;

  const birthDetailsParam = Array.isArray(params?.birthDetails)
    ? params.birthDetails[0]
    : params?.birthDetails;

  const initialMaxDuration =
    Number(
      Array.isArray(params?.maxDuration)
        ? params.maxDuration[0]
        : params?.maxDuration,
    ) || 1500;

  // ==========================
  // STATE
  // ==========================

  const [currentUserId, setCurrentUserId] = useState(null);

  const [isChatActive, setIsChatActive] = useState(false);

  const [maxDurationSeconds, setMaxDurationSeconds] =
    useState(initialMaxDuration);

  const [secondsLeft, setSecondsLeft] =
    useState(initialMaxDuration);

  const [messages, setMessages] = useState([]);
  const kundliDetailsSentRef = useRef(false);

  const [isAstrologerTyping, setIsAstrologerTyping] =
    useState(false);

  const [chatEnded, setChatEnded] =
    useState(false);

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  // ==========================
  // BLOCK STATE
  // ==========================

  const [isBlocked, setIsBlocked] =
    useState(false);
  const [isBlockedByOther, setIsBlockedByOther] =
    useState(false);

  // ==========================
  // API MUTATIONS
  // ==========================

  const [createReviewMutation] =
    useCreateReviewMutation();

  const [deleteChatMessageMutation] =
    useDeleteChatMessageMutation();

  const [toggleBlockUserMutation] =
    useToggleBlockUserMutation();

  const [reportUserMutation] =
    useReportUserMutation();

  // ==========================
  // BLOCK STATUS
  // ==========================

  const { data: blockStatusData } =
    useGetBlockStatusQuery(astrologerId, {
      skip: !astrologerId,
    });

  // ==========================
  // REFS
  // ==========================

  const listRef = useRef(null);

  const hasLoadedHistoryRef =
    useRef(false);

  const sendTimeoutsRef =
    useRef({});

  const hasConnectedOnceRef =
    useRef(false);

  const timerIntervalRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  const endAlertShownRef =
    useRef(false);

  const refetchConsultationHistoryRef =
    useRef(null);

  // ==========================
  // CONSULTATION HISTORY
  // ==========================

  const {
    data: consultationHistoryData,
    isFetching: isHistoryFetching,
    isLoading: isHistoryLoading,
    refetch: refetchConsultationHistory,
  } = useGetConsultationHistoryQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      skip: !consultationId,
    },
  );

  // ==========================
  // SAFE REFRESH
  // ==========================

  const safeRefetchHistory = useCallback(() => {
    try {
      if (
        typeof refetchConsultationHistory ===
        "function"
      ) {
        refetchConsultationHistory();
      }
    } catch (_e) {
      // Query not started yet
    }
  }, [refetchConsultationHistory]);

  useEffect(() => {
    refetchConsultationHistoryRef.current =
      safeRefetchHistory;
  }, [safeRefetchHistory]);

  // ==========================
  // LOAD CURRENT USER
  // ==========================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData =
          await AsyncStorage.getItem("userData");

        if (userData) {
          const parsed = JSON.parse(userData);

          const userId =
            parsed?.user?.id ??
            parsed?.id ??
            null;

          setCurrentUserId(userId);

          console.log(
            LOG_TAG,
            "Loaded current user id:",
            userId,
          );
        }
      } catch (error) {
        console.log(
          LOG_TAG,
          "Failed to load user from AsyncStorage:",
          error,
        );
      }
    };

    loadUser();
  }, []);

  // ==========================
  // UPDATE BLOCK STATUS
  // ==========================

  useEffect(() => {
    const status =
      blockStatusData?.data ??
      blockStatusData;

    const blocked =
      status?.isBlockedByMe ??
      status?.isBlocked ??
      false;

    setIsBlocked(Boolean(blocked));
    setIsBlockedByOther(
      Boolean(status?.isBlockedByThem ?? false),
    );
  }, [blockStatusData]);

  // ==========================
  // BLOCK / UNBLOCK USER
  // ==========================

  const handleBlockUser = useCallback(() => {
    if (!astrologerId) {
      return;
    }

    const nextBlocked = !isBlocked;

    Alert.alert(
      nextBlocked
        ? "Block User"
        : "Unblock User",
      nextBlocked
        ? `Are you sure you want to block ${
            astrologerName || "this user"
          }?`
        : `Do you want to unblock ${
            astrologerName || "this user"
          }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: nextBlocked
            ? "Block"
            : "Unblock",
          style: nextBlocked
            ? "destructive"
            : "default",

          onPress: async () => {
            try {
              const response =
                await toggleBlockUserMutation({
                  targetUserId: astrologerId,
                }).unwrap();

              const serverBlocked =
                response?.isBlocked ??
                response?.data?.isBlocked ??
                response?.isBlockedByMe ??
                response?.data?.isBlockedByMe;

              setIsBlocked(
                typeof serverBlocked ===
                  "boolean"
                  ? serverBlocked
                  : nextBlocked,
              );

              Alert.alert(
                nextBlocked
                  ? "User Blocked"
                  : "User Unblocked",

                nextBlocked
                  ? "This user has been blocked."
                  : "This user has been unblocked.",
              );
            } catch (error) {
              console.log(
                LOG_TAG,
                "Block/unblock error:",
                error,
              );

              Alert.alert(
                "Error",
                error?.data?.message ||
                  (nextBlocked
                    ? "Unable to block this user."
                    : "Unable to unblock this user."),
              );
            }
          },
        },
      ],
    );
  }, [
    astrologerId,
    astrologerName,
    isBlocked,
    toggleBlockUserMutation,
  ]);

  // ==========================
  // REPORT USER
  // ==========================

  const handleReportUser = useCallback(() => {
    if (!astrologerId) {
      return;
    }

    const submitReport = async (reason) => {
      try {
        const response = await reportUserMutation({
          reportedUserId: astrologerId,
          reason,
        }).unwrap();

        if (
          response?.isUserBlocked ||
          response?.data?.isUserBlocked
        ) {
          setIsBlocked(true);
        }

        Alert.alert(
          "Report Submitted",
          response?.message ||
            response?.data?.message ||
            "Your report has been submitted successfully.",
        );
      } catch (error) {
        console.log(LOG_TAG, "Report user error:", error);
        Alert.alert(
          "Error",
          error?.data?.message || "Unable to submit the report.",
        );
      }
    };

    const showMoreReasons = () =>
      Alert.alert("Report User", "Select a reason", [
        {
          text: "Harassment",
          onPress: () => submitReport("Harassment"),
        },
        {
          text: "Other",
          onPress: () => submitReport("Other"),
        },
        { text: "Cancel", style: "cancel" },
      ]);

    Alert.alert("Report User", "Select a reason", [
      {
        text: "Abusive Language",
        onPress: () => submitReport("Abusive Language"),
      },
      { text: "Fraud", onPress: () => submitReport("Fraud") },
      { text: "More", onPress: showMoreReasons },
    ]);
  }, [
    astrologerId,
    reportUserMutation,
  ]);

  // ==========================
  // MESSAGE ACTION
  // DELETE FOR ME / EVERYONE
  // ==========================

  const handleMessageAction = useCallback(
    (message) => {
      if (!message) {
        return;
      }

      const messageId =
        message?.id ||
        message?._id;

      if (!messageId) {
        Alert.alert(
          "Delete",
          "This message has no message ID.",
        );

        return;
      }

      const isOwn =
        message?.senderId === currentUserId ||
        message?.senderRole === "user";

      // ==========================
      // DELETE FOR ME
      // ==========================

      const deleteForMe = async () => {
        try {
          await deleteChatMessageMutation({
            messageId,
            deleteType: "me",
          }).unwrap();

          setMessages((prev) =>
            prev.filter(
              (item) =>
                String(item?.id || item?._id) !==
                String(messageId),
            ),
          );
        } catch (error) {
          console.log(
            LOG_TAG,
            "Delete for me error:",
            error,
          );

          Alert.alert(
            "Error",
            "Unable to delete this message.",
          );
        }
      };

      // ==========================
      // DELETE FOR EVERYONE
      // ==========================

      const deleteForEveryone = async () => {
        try {
          await deleteChatMessageMutation({
            messageId,
            deleteType: "everyone",
          }).unwrap();

          deleteChatMessageSocket({
            consultationId,
            messageId,
            deleteType: "everyone",
          });

          setMessages((prev) =>
            prev.map((item) =>
              String(item?.id || item?._id) ===
              String(messageId)
                ? {
                    ...item,

                    message:
                      "This message was deleted",

                    isDeleted: true,
                    deleted: true,
                    status: "deleted",
                  }
                : item,
            ),
          );
        } catch (error) {
          console.log(
            LOG_TAG,
            "Delete for everyone error:",
            error,
          );

          Alert.alert(
            "Error",
            "Unable to delete this message.",
          );
        }
      };

      // ==========================
      // OWN MESSAGE
      // ==========================

      if (isOwn) {
        Alert.alert(
          "Message Options",
          "Choose an action",
          [
            {
              text: "Delete for me",
              onPress: deleteForMe,
            },
            {
              text: "Delete for everyone",
              style: "destructive",
              onPress: deleteForEveryone,
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
      }

      // ==========================
      // OTHER USER MESSAGE
      // ==========================

      else {
        Alert.alert(
          "Message Options",
          "Choose an action",
          [
            {
              text: "Delete for me",
              onPress: deleteForMe,
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
      }
    },
    [
      currentUserId,
      deleteChatMessageMutation,
      consultationId,
    ],
  );

  // ==========================
  // SOCKET DELETE EVENT
  // ==========================

  const handleChatMessageDeleted =
    useCallback((data) => {
      if (
        data?.consultationId &&
        data.consultationId !== consultationId
      ) {
        return;
      }

      const messageId =
        data?.messageId ||
        data?.id;

      if (!messageId) {
        return;
      }

      // ==========================
      // DELETE FOR ME
      // ==========================

      if (data?.deleteType === "me") {
        setMessages((prev) =>
          prev.filter(
            (item) =>
              String(item?.id || item?._id) !==
              String(messageId),
          ),
        );

        return;
      }

      // ==========================
      // DELETE FOR EVERYONE
      // ==========================

      setMessages((prev) =>
        prev.map((item) =>
          String(item?.id || item?._id) ===
          String(messageId)
            ? {
                ...item,

                message:
                  "This message was deleted",

                isDeleted: true,
                deleted: true,
                status: "deleted",
              }
            : item,
        ),
      );
    }, [consultationId]);

  // ==========================
  // CONSULTATION STATE RESYNC
  // ==========================

  useEffect(() => {
    if (
      !consultationId ||
      chatEnded
    ) {
      return;
    }

    const match =
      consultationHistoryData?.consultations?.find(
        (c) => c.id === consultationId,
      );

    if (!match) {
      return;
    }

    // ==========================
    // ONGOING CHAT
    // ==========================

    if (
      match.status === "ongoing" &&
      match.startedAt
    ) {
      const startedAtMs =
        new Date(
          match.startedAt,
        ).getTime();

      const elapsedSec = Math.floor(
        (Date.now() - startedAtMs) /
          1000,
      );

      const remaining = Math.max(
        0,
        (match.maxDuration ??
          maxDurationSeconds) -
          elapsedSec,
      );

      console.log(
        LOG_TAG,
        "RECOVERED/RESYNCED ongoing chat state:",
        {
          elapsedSec,
          remaining,
        },
      );

      setIsChatActive(true);

      setMaxDurationSeconds(
        match.maxDuration ??
          maxDurationSeconds,
      );

      setSecondsLeft(remaining);
    }

    // ==========================
    // ENDED CHAT
    // ==========================

    else if (
      [
        "completed",
        "missed",
        "cancelled",
      ].includes(match.status)
    ) {
      console.log(
        LOG_TAG,
        "RECOVERED ended chat state:",
        match.status,
      );

      setIsChatActive(false);
      setChatEnded(true);

      if (!endAlertShownRef.current) {
        endAlertShownRef.current =
          true;

        Alert.alert(
          "Chat Ended",
          "Your chat consultation has ended.",
          [
            {
              text: "OK",
              onPress: () =>
                router.back(),
            },
          ],
        );
      }
    }
  }, [
    consultationHistoryData,
    consultationId,
    chatEnded,
    maxDurationSeconds,
  ]);

  // ==========================
  // COUNTDOWN TIMER
  // ==========================

  useEffect(() => {
    if (
      !isChatActive ||
      chatEnded
    ) {
      return undefined;
    }

    timerIntervalRef.current =
      setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev == null) {
            return prev;
          }

          if (prev <= 1) {
            clearInterval(
              timerIntervalRef.current,
            );

            return 0;
          }

          return prev - 1;
        });
      }, 1000);

    return () =>
      clearInterval(
        timerIntervalRef.current,
      );
  }, [
    isChatActive,
    chatEnded,
  ]);

  // ==========================
  // SOCKET LIFECYCLE
  // ==========================

  useEffect(() => {
    if (
      !consultationId ||
      !currentUserId
    ) {
      return;
    }

    let isMounted = true;
    let unsubscribeDeletedMessage = () => {};

    const setup = async () => {
      console.log(
        LOG_TAG,
        "Setting up chat socket for consultation:",
        consultationId,
      );

      const socket =
        await connectChatSocket();

      if (
        !isMounted ||
        !socket
      ) {
        return;
      }

      // Existing join flow
      joinChatSession({
        consultationId,
        userId: currentUserId,
        role: "user",
      });

      // ==========================
      // CHAT STARTED
      // ==========================

      socket.on(
        "chat_started",
        (data) => {
          console.log(
            LOG_TAG,
            "chat_started event:",
            data,
          );

          setIsChatActive(true);

          if (
            data?.maxDurationSeconds
          ) {
            setMaxDurationSeconds(
              data.maxDurationSeconds,
            );

            setSecondsLeft(
              data.maxDurationSeconds,
            );
          }
        },
      );

      // ==========================
      // NEW CHAT MESSAGE
      // ==========================

      socket.on(
        "new_chat_message",
        (data) => {
          const receivedMessage =
            typeof data?.message === "string"
              ? data.message
              : "";

          if (receivedMessage.startsWith(KUNDLI_DETAILS_PREFIX)) {
            return;
          }

          if (receivedMessage.startsWith(KUNDLI_DETAILS_ACK_PREFIX)) {
            kundliDetailsSentRef.current = true;
            console.log(
              LOG_TAG,
              "ASTRO acknowledged receipt of client Kundli details.",
            );
            return;
          }

          console.log(
            LOG_TAG,
            "new_chat_message event:",
            data,
          );

          setMessages((prev) => {
            const pendingIndex =
              data?.clientTempId
                ? prev.findIndex(
                    (m) =>
                      m.clientTempId ===
                      data.clientTempId,
                  )
                : prev.findIndex(
                    (m) =>
                      m.status ===
                        "sending" &&
                      m.senderId ===
                        data?.senderId &&
                      m.message ===
                        data?.message,
                  );

            if (
              pendingIndex === -1
            ) {
              return [
                ...prev,
                data,
              ];
            }

            const clientTempId =
              prev[pendingIndex]
                .clientTempId;

            if (
              clientTempId &&
              sendTimeoutsRef
                .current[
                  clientTempId
                ]
            ) {
              clearTimeout(
                sendTimeoutsRef
                  .current[
                  clientTempId
                ],
              );

              delete sendTimeoutsRef
                .current[
                clientTempId
              ];
            }

            const next = [
              ...prev,
            ];

            next[pendingIndex] =
              data;

            return next;
          });
        },
      );

      // ==========================
      // TYPING
      // ==========================

      socket.on(
        "user_typing",
        (data) => {
          if (
            data?.role ===
            "astrologer"
          ) {
            setIsAstrologerTyping(
              Boolean(
                data?.isTyping,
              ),
            );
          }
        },
      );

      // ==========================
      // CHAT ENDED
      // ==========================

      socket.on(
        "chat_ended",
        (data) => {
          console.log(
            LOG_TAG,
            "chat_ended event:",
            data,
          );

          setIsChatActive(false);
          setChatEnded(true);

          endAlertShownRef.current =
            true;

          if (
            timerIntervalRef.current
          ) {
            clearInterval(
              timerIntervalRef.current,
            );
          }

          setShowReviewModal(
            true,
          );
        },
      );

      // ==========================
      // MESSAGE DELETED
      // ==========================

      unsubscribeDeletedMessage = onChatMessageDeleted(
        handleChatMessageDeleted,
      );
    };

    setup();

    return () => {
      isMounted = false;

      console.log(
        LOG_TAG,
        "Cleaning up chat socket listeners for:",
        consultationId,
      );

      removeChatListeners();
      unsubscribeDeletedMessage();
    };
  }, [
    consultationId,
    currentUserId,
    handleChatMessageDeleted,
  ]);

  useEffect(() => {
    if (
      !isChatActive ||
      !consultationId ||
      !currentUserId ||
      !birthDetailsParam ||
      kundliDetailsSentRef.current
    ) {
      return;
    }

    const clientTempId =
      `${currentUserId}-kundli-${consultationId}`;
    let attempts = 0;
    let retryTimeout;

    const sendDetails = () => {
      if (kundliDetailsSentRef.current) {
        return;
      }

      if (attempts >= KUNDLI_DETAILS_MAX_ATTEMPTS) {
        console.log(
          LOG_TAG,
          "ASTRO did not acknowledge client Kundli details after retries.",
        );
        return;
      }

      attempts += 1;
      const emitted = sendChatMessage({
        consultationId,
        senderId: currentUserId,
        senderRole: "user",
        message: `${KUNDLI_DETAILS_PREFIX}${birthDetailsParam}`,
        messageType: "TEXT",
        clientTempId,
      });

      if (emitted && attempts === 1) {
        console.log(
          LOG_TAG,
          "Sent client Kundli details; waiting for ASTRO receipt acknowledgement.",
        );
      }

      if (attempts < KUNDLI_DETAILS_MAX_ATTEMPTS) {
        retryTimeout = setTimeout(
          sendDetails,
          KUNDLI_DETAILS_RETRY_MS,
        );
      }
    };

    sendDetails();

    return () => clearTimeout(retryTimeout);
  }, [
    isChatActive,
    consultationId,
    currentUserId,
    birthDetailsParam,
    connectionStatus,
  ]);

  // ==========================
  // DISCONNECT SOCKET ON UNMOUNT
  // ==========================

  useEffect(() => {
    return () => {
      console.log(
        LOG_TAG,
        "Unmounting ChatConsultation screen, disconnecting socket",
      );

      disconnectChatSocket();
    };
  }, []);

  // ==========================
  // CONNECTION STATUS
  // ==========================

  useEffect(() => {
    const unsubscribe =
      onConnectionStatusChange(
        (status) => {
          if (
            status ===
            "connected"
          ) {
            if (
              hasConnectedOnceRef.current
            ) {
              console.log(
                LOG_TAG,
                "Socket reconnected, resyncing consultation history",
              );

              refetchConsultationHistoryRef.current?.();
            }

            hasConnectedOnceRef.current =
              true;
          }

          setConnectionStatus(
            status,
          );
        },
      );

    return unsubscribe;
  }, []);

  // ==========================
  // CLEAR SEND TIMEOUTS
  // ==========================

  useEffect(() => {
    return () => {
      Object.values(
        sendTimeoutsRef.current,
      ).forEach(clearTimeout);

      sendTimeoutsRef.current = {};
    };
  }, []);

  // ==========================
  // CLEAR TYPING TIMER
  // ==========================

  useEffect(() => {
    return () => {
      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current,
        );

        typingTimeoutRef.current =
          null;
      }
    };
  }, []);

  // ==========================
  // APP FOREGROUND / BACKGROUND
  // ==========================

  useEffect(() => {
    if (
      !consultationId ||
      !currentUserId
    ) {
      return;
    }

    const appStateRef = {
      current:
        AppState.currentState,
    };

    const handleAppStateChange = (
      nextState,
    ) => {
      const cameToForeground =
        appStateRef.current.match(
          /inactive|background/,
        ) &&
        nextState ===
          "active";

      appStateRef.current =
        nextState;

      if (
        !cameToForeground
      ) {
        return;
      }

      const socket =
        getChatSocket();

      const isConnected =
        socket?.connected ||
        getConnectionStatus() ===
          "connected";

      if (!isConnected) {
        console.log(
          LOG_TAG,
          "App resumed and socket is disconnected, forcing chat socket reconnect",
        );

        if (
          typeof forceReconnectChatSocket ===
          "function"
        ) {
          forceReconnectChatSocket();
        } else if (
          typeof connectChatSocket ===
          "function"
        ) {
          connectChatSocket();
        }

        refetchConsultationHistoryRef.current?.();
      } else {
        console.log(
          LOG_TAG,
          "App resumed but socket is already active/connected. Skipping disruptive reconnect.",
        );
      }
    };

    const subscription =
      AppState.addEventListener(
        "change",
        handleAppStateChange,
      );

    return () =>
      subscription.remove();
  }, [
    consultationId,
    currentUserId,
  ]);

  // ==========================
  // SEND TIMEOUT
  // ==========================

  const armSendTimeout =
    useCallback(
      (clientTempId) => {
        if (
          sendTimeoutsRef
            .current[
            clientTempId
          ]
        ) {
          clearTimeout(
            sendTimeoutsRef
              .current[
              clientTempId
            ],
          );
        }

        sendTimeoutsRef.current[
          clientTempId
        ] = setTimeout(() => {
          console.log(
            LOG_TAG,
            "Send timed out, marking as failed:",
            clientTempId,
          );

          delete sendTimeoutsRef
            .current[
            clientTempId
          ];

          setMessages(
            (prev) =>
              prev.map((m) =>
                m.clientTempId ===
                  clientTempId &&
                m.status ===
                  "sending"
                  ? {
                      ...m,
                      status:
                        "failed",
                    }
                  : m,
              ),
          );
        }, SEND_TIMEOUT_MS);
      },
      [],
    );

  // ==========================
  // SEND MESSAGE
  // ==========================

  const handleSend =
    useCallback(
      (text) => {
        if (
          !consultationId ||
          !currentUserId ||
          isBlocked ||
          isBlockedByOther
        ) {
          console.log(
            LOG_TAG,
            "handleSend blocked",
          );

          return;
        }

        const clientTempId =
          `${currentUserId}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

        setMessages((prev) => [
          ...prev,
          {
            clientTempId,
            senderId:
              currentUserId,
            senderRole: "user",
            message: text,
            messageType: "TEXT",
            createdAt:
              new Date().toISOString(),
            status: "sending",
          },
        ]);

        const emitted =
          sendChatMessage({
            consultationId,
            senderId:
              currentUserId,
            senderRole: "user",
            message: text,
            messageType: "TEXT",
            clientTempId,
          });

        if (!emitted) {
          setMessages(
            (prev) =>
              prev.map((m) =>
                m.clientTempId ===
                clientTempId
                  ? {
                      ...m,
                      status:
                        "failed",
                    }
                  : m,
              ),
          );

          return;
        }

        armSendTimeout(
          clientTempId,
        );
      },
      [
        consultationId,
        currentUserId,
        armSendTimeout,
        isBlocked,
        isBlockedByOther,
      ],
    );

  // ==========================
  // RETRY MESSAGE
  // ==========================

  const handleRetrySend =
    useCallback(
      (message) => {
        if (
          !message?.clientTempId ||
          !consultationId ||
          !currentUserId ||
          isBlocked ||
          isBlockedByOther
        ) {
          return;
        }

        console.log(
          LOG_TAG,
          "Retrying failed send:",
          message.clientTempId,
        );

        setMessages(
          (prev) =>
            prev.map((m) =>
              m.clientTempId ===
              message.clientTempId
                ? {
                    ...m,
                    status:
                      "sending",
                  }
                : m,
            ),
        );

        const emitted =
          sendChatMessage({
            consultationId,
            senderId:
              currentUserId,
            senderRole: "user",
            message:
              message.message,
            messageType:
              message.messageType ||
              "TEXT",
            clientTempId:
              message.clientTempId,
          });

        if (!emitted) {
          setMessages(
            (prev) =>
              prev.map((m) =>
                m.clientTempId ===
                message.clientTempId
                  ? {
                      ...m,
                      status:
                        "failed",
                    }
                  : m,
              ),
          );

          return;
        }

        armSendTimeout(
          message.clientTempId,
        );
      },
      [
        consultationId,
        currentUserId,
        armSendTimeout,
        isBlocked,
        isBlockedByOther,
      ],
    );

  // ==========================
  // TYPING INDICATOR
  // ==========================

  const handleTyping =
    useCallback(
      (isTyping) => {
        if (!consultationId) {
          return;
        }

        if (
          typingTimeoutRef.current
        ) {
          clearTimeout(
            typingTimeoutRef.current,
          );

          typingTimeoutRef.current =
            null;
        }

        emitTypingIndicator({
          consultationId,
          role: "user",
          isTyping,
        });

        if (isTyping) {
          typingTimeoutRef.current =
            setTimeout(() => {
              typingTimeoutRef.current =
                null;

              emitTypingIndicator({
                consultationId,
                role: "user",
                isTyping: false,
              });
            }, 1500);
        }
      },
      [consultationId],
    );

  // ==========================
  // REFRESH
  // ==========================

  const handleRefresh =
    useCallback(() => {
      console.log(
        LOG_TAG,
        "Manual refresh pulled — resyncing consultation state + reconnecting socket",
      );

      const socket =
        getChatSocket();

      if (
        socket &&
        !socket.connected
      ) {
        forceReconnectChatSocket();
      }

      safeRefetchHistory();
    }, [safeRefetchHistory]);

  // ==========================
  // TIMER EXPIRED
  // ==========================

  const timerExpiredRef =
    useRef(false);

  useEffect(() => {
    if (
      !isChatActive ||
      chatEnded ||
      secondsLeft > 0 ||
      timerExpiredRef.current
    ) {
      return;
    }

    timerExpiredRef.current =
      true;

    console.log(
      LOG_TAG,
      "Countdown expired, auto-ending chat session",
    );

    endChatSession({
      consultationId,
      reason: "time_expired",
    });
  }, [
    isChatActive,
    chatEnded,
    secondsLeft,
    consultationId,
  ]);

  // ==========================
  // END CHAT
  // ==========================

  const handleEndChat =
    useCallback(() => {
      Alert.alert(
        "End Chat",
        "Are you sure you want to end this chat?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "End Chat",
            style: "destructive",

            onPress: () => {
              console.log(
                LOG_TAG,
                "User manually ending chat session",
              );

              endChatSession({
                consultationId,
                reason: "completed",
              });

              setIsChatActive(false);
              setChatEnded(true);
              setShowReviewModal(true);
            },
          },
        ],
      );
    }, [consultationId]);

  // ==========================
  // BACK
  // ==========================

  const handleBack =
    useCallback(() => {
      if (
        !isChatActive ||
        chatEnded
      ) {
        router.back();
        return;
      }

      Alert.alert(
        "End Chat",
        "Going back will end this chat session. Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "End Chat",
            style: "destructive",

            onPress: () => {
              console.log(
                LOG_TAG,
                "User ending chat session via back navigation",
              );

              endChatSession({
                consultationId,
                reason: "completed",
              });

              router.back();
            },
          },
        ],
      );
    }, [
      isChatActive,
      chatEnded,
      consultationId,
    ]);

  // ==========================
  // HARDWARE BACK
  // ==========================

  useEffect(() => {
    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleBack();

          return true;
        },
      );

    return () =>
      subscription.remove();
  }, [handleBack]);

  // ==========================
  // AUTO SCROLL
  // ==========================

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    }
  }, [messages.length]);

  // ==========================
  // NO CONSULTATION ID
  // ==========================

  if (!consultationId) {
    console.log(
      LOG_TAG,
      "No consultationId param provided — cannot start chat",
    );

    return (
      <SafeAreaView
        style={styles.container}
        edges={["top"]}
      >
        <ChatHeader
          astrologerName={
            astrologerName
          }
          isChatActive={false}
          onEndChat={() =>
            router.back()
          }
          onBack={() =>
            router.back()
          }
        />
      </SafeAreaView>
    );
  }

  // ==========================
  // MAIN UI
  // ==========================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <ChatHeader
        astrologerName={astrologerName}
        isChatActive={isChatActive}
        chatEnded={chatEnded}
        secondsLeft={secondsLeft}
        connectionStatus={connectionStatus}
        onEndChat={handleEndChat}
        onBack={handleBack}
        onMenuPress={() =>
          Alert.alert("User Options", astrologerName || "User", [
            {
              text: isBlocked ? "Unblock User" : "Block User",
              onPress: handleBlockUser,
            },
            {
              text: "Report User",
              onPress: handleReportUser,
            },
            { text: "Cancel", style: "cancel" },
          ])
        }
      />


      {/* ==========================
          USER OPTIONS
          ========================== */}

      {/* <View
        style={styles.headerActions}
      >
        <Pressable
          onPress={() =>
            Alert.alert(
              "User Options",
              astrologerName ||
                "User",
              [
                {
                  text: isBlocked
                    ? "Unblock User"
                    : "Block User",
                  onPress:
                    handleBlockUser,
                },
                {
                  text: "Report User",
                  onPress:
                    handleReportUser,
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ],
            )
          }
          hitSlop={10}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={RF(20)}
            color={
              Colors.textGray
            }
          />
        </Pressable>
      </View> */}

      {/* ==========================
          BLOCKED BANNER
          ========================== */}

      {isBlocked ? (
        <View
          style={
            styles.blockedBanner
          }
        >
          <Text
            style={
              styles.blockedBannerText
            }
          >
            {isBlocked
              ? "You blocked this user. Unblock to continue messaging."
              : "This user has blocked you. Messaging is unavailable."}
          </Text>
        </View>
      ) : null}

      {/* ==========================
          CONNECTION BANNER
          ========================== */}

      {connectionStatus !==
        "connected" &&
      !chatEnded ? (
        <View
          style={
            styles.connectionBanner
          }
        >
          <Text
            style={
              styles.connectionBannerText
            }
          >
            {!hasConnectedOnceRef.current
              ? "Connecting…"
              : connectionStatus ===
                  "reconnecting"
                ? "Reconnecting…"
                : "Disconnected — pull down to retry"}
          </Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? 90
            : 0
        }
      >
        {/* ==========================
            MESSAGE LIST
            ========================== */}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(
            item,
            index,
          ) =>
            item?.id?.toString() ||
            `${item?.createdAt || index}-${index}`
          }
          renderItem={({
            item,
          }) => (
            <Pressable
              onLongPress={() =>
                handleMessageAction(
                  item,
                )
              }
              delayLongPress={450}
            >
              <MessageBubble
                message={item}
                isOwnMessage={
                  item?.senderId ===
                    currentUserId ||
                  item?.senderRole ===
                    "user"
                }
                onRetry={
                  handleRetrySend
                }
              />
            </Pressable>
          )}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd(
              {
                animated: true,
              },
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={
                isHistoryFetching &&
                !isHistoryLoading
              }
              onRefresh={
                handleRefresh
              }
              colors={[
                Colors.primary,
              ]}
              tintColor={
                Colors.primary
              }
            />
          }
          ListHeaderComponent={
            <View
              style={
                styles.secureBox
              }
            >
              <Ionicons
                name="lock-closed-outline"
                size={RF(11)}
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.secureText
                }
              >
                {isHistoryLoading
                  ? "Connecting to chat..."
                  : "This is a secure chat. Your conversation is private and confidential."}
              </Text>
            </View>
          }
          ListFooterComponent={
            <TypingIndicator
              visible={
                isAstrologerTyping
              }
              name={
                astrologerName
              }
            />
          }
        />

        {/* ==========================
            CHAT INPUT
            ========================== */}

        <ChatInputBar
          disabled={
            !isChatActive ||
            chatEnded ||
            isBlocked ||
            isBlockedByOther
          }
          onSend={
            handleSend
          }
          onTyping={
            handleTyping
          }
        />
      </KeyboardAvoidingView>

      {/* ==========================
          REVIEW MODAL
          ========================== */}

      <PostConsultationReviewModal
        visible={
          showReviewModal
        }
        onClose={() =>
          router.back()
        }
        astrologer={{
          id:
            astrologerId ||
            params?.astrologerId,

          name:
            astrologerName,

          profilePic:
            params?.astrologerImage,
        }}
        consultationId={
          consultationId
        }
        onSubmitReview={async (
          payload,
        ) => {
          try {
            await createReviewMutation(
              payload,
            ).unwrap();
          } catch (e) {
            console.log(
              "[ChatConsultation] createReview error:",
              e,
            );
          }

          router.back();
        }}
      />
    </SafeAreaView>
  );
}

// ==========================
// STYLES
// ==========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.white,
  },

  flex: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal:
      wp(4),

    paddingTop:
      hp(1.5),

    paddingBottom:
      hp(2),
  },

  secureBox: {
    alignSelf: "center",

    width: "92%",

    borderWidth: 1,

    borderColor:
      "#ffe5d2",

    backgroundColor:
      "#fff8f3",

    borderRadius:
      wp(2),

    paddingVertical:
      hp(1),

    paddingHorizontal:
      wp(2.5),

    flexDirection: "row",

    alignItems: "center",

    marginBottom:
      hp(1.5),
  },

  secureText: {
    flex: 1,

    marginLeft:
      wp(2),

    color:
      Colors.textGray,

    fontSize:
      RF(12),

    textAlign:
      "center",

    lineHeight:
      hp(1.6),

    fontWeight:
      "700",
  },

  connectionBanner: {
    paddingVertical:
      hp(0.6),

    backgroundColor:
      "#fff3cd",

    alignItems:
      "center",
  },

  connectionBannerText: {
    color:
      "#8a6d3b",

    fontSize:
      RF(8.5),

    fontWeight:
      "600",
  },

  // ==========================
  // HEADER ACTIONS
  // ==========================

  headerActions: {
    position: "absolute",
    right: wp(13), // <-- 3-dots icon close button ke left me clear space ke sath aa jayega
    top: hp(2),
    zIndex: 20,
  },

  // ==========================
  // BLOCKED BANNER
  // ==========================

  blockedBanner: {
    paddingVertical:
      hp(0.8),

    paddingHorizontal:
      wp(4),

    backgroundColor:
      "#fee2e2",

    alignItems:
      "center",
  },

  blockedBannerText: {
    color:
      "#991b1b",

    fontSize:
      RF(10),

    fontWeight:
      "700",

    textAlign:
      "center",
  },
});