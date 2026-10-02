import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// expo-speech-recognition uses native modules — not available in Expo Go.
// We wrap the import so the app degrades gracefully.
let ExpoSpeechRecognitionModule = {
  stop: () => {},
  requestPermissionsAsync: async () => ({ granted: false }),
};

let useSpeechRecognitionEvent = () => {};

try {
  const speechMod = require("expo-speech-recognition");

  if (speechMod?.ExpoSpeechRecognitionModule) {
    ExpoSpeechRecognitionModule =
      speechMod.ExpoSpeechRecognitionModule;
  }

  if (speechMod?.useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent =
      speechMod.useSpeechRecognitionEvent;
  }
} catch (_e) {
  // Native module not available
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Alert,
  AppState,
  BackHandler,
  FlatList,
  Image,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import CountdownTimer from "../../components/chat/CountdownTimer";
import KundliScreen from "./Kundli";
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
  deleteChatMessageSocket,
} from "../../utils/socket";

import {
  useDeleteChatMessageMutation,
  useGetChatMessagesQuery,
  useGetConsultationHistoryQuery,
  useMarkRoomReadMutation,
  useSendChatMessageMutation,
} from "../../redux/ChatApi";

// IMPORTANT: Client Kundli API
import { useGetFullKundliMutation } from "../../redux/KundliApi";

import {
  useGetBlockStatusQuery,
  useReportUserMutation,
  useToggleBlockUserMutation,
} from "../../redux/blockReportApi";

const ORANGE = "#ff6a00";
const LOG_TAG = "[ChatScreen]";
const ROOM_POLL_INTERVAL_MS = 5000;
const KUNDLI_DETAILS_PREFIX = "__VAVI_KUNDLI_DETAILS_V1__:";
const KUNDLI_DETAILS_ACK_PREFIX = "__VAVI_KUNDLI_DETAILS_ACK_V1__:";
const containsAsciiDigit = (value) =>
  typeof value === "string" && /[0-9]/.test(value);
const summarizeImagePayload = (message) => {
  const fields = [
    "message",
    "imageUrl",
    "image",
    "url",
    "content",
    "text",
    "data",
    "payload",
  ];

  return {
    keys: Object.keys(message || {}),
    fields: fields.reduce((summary, field) => {
      const value = message?.[field];
      if (typeof value === "string") {
        summary[field] = {
          kind: value.startsWith("data:image/")
            ? "data-uri"
            : /^https?:\/\//i.test(value)
              ? "url"
              : /^[A-Za-z0-9+/]{256,}={0,2}$/.test(value)
                ? "base64"
                : "string",
          length: value.length,
        };
      } else if (value && typeof value === "object") {
        summary[field] = {
          kind: "object",
          keys: Object.keys(value),
        };
      }
      return summary;
    }, {}),
  };
};
const getImageChatUri = (message) => {
  const candidates = [
    message?.message,
    message?.imageUrl,
    message?.image,
    message?.url,
    message?.content,
    message?.text,
    message?.message?.url,
    message?.message?.uri,
    message?.image?.url,
    message?.image?.uri,
    message?.content?.url,
    message?.content?.uri,
    message?.data?.url,
    message?.data?.uri,
    message?.payload?.imageUrl,
    message?.payload?.url,
  ];

  const uri = candidates.find(
    (value) =>
      typeof value === "string" &&
      /^(data:image\/|https?:\/\/|file:\/\/|content:\/\/|blob:)/i.test(value),
  );
  if (uri) return uri;

  if (
    String(message?.messageType || message?.type || "").toUpperCase() !==
    "IMAGE"
  ) {
    return undefined;
  }

  const base64 = candidates.find(
    (value) =>
      typeof value === "string" &&
      value.length > 256 &&
      /^[A-Za-z0-9+/]+={0,2}$/.test(value),
  );
  if (!base64) return undefined;

  const mimeType = base64.startsWith("iVBORw0KGgo")
    ? "image/png"
    : base64.startsWith("/9j/")
      ? "image/jpeg"
      : base64.startsWith("R0lGOD")
        ? "image/gif"
        : base64.startsWith("UklGR")
          ? "image/webp"
          : "image/jpeg";
  return `data:${mimeType};base64,${base64}`;
};
const isImageChatMessage = (message) =>
  String(message?.messageType || message?.type || "").toUpperCase() ===
    "IMAGE" ||
  Boolean(getImageChatUri(message));
const sameImageChatMessage = (first, second) =>
  isImageChatMessage(first) &&
  isImageChatMessage(second) &&
  first?.senderId === second?.senderId &&
  Boolean(getImageChatUri(first)) &&
  getImageChatUri(first) === getImageChatUri(second);
const isDuplicateImageEvent = (first, second) => {
  if (
    !isImageChatMessage(first) ||
    !isImageChatMessage(second) ||
    first?.senderId !== second?.senderId
  ) {
    return false;
  }

  if (sameImageChatMessage(first, second)) return true;

  const firstTime = Date.parse(first?.createdAt || "");
  const secondTime = Date.parse(second?.createdAt || "");
  return (
    Number.isFinite(firstTime) &&
    Number.isFinite(secondTime) &&
    Math.abs(firstTime - secondTime) < 1000
  );
};
const ChatImage = ({ uri }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  return failed ? (
    <Text style={styles.msgText}>Could not load this image</Text>
  ) : (
    <Image
      source={{ uri }}
      style={styles.chatImage}
      resizeMode="contain"
      onError={(event) => {
        console.warn(
          LOG_TAG,
          "Image renderer failed:",
          event?.nativeEvent?.error || "unknown image decode/load error",
        );
        setFailed(true);
      }}
    />
  );
};
const getChatMessageText = (message) =>
  [message?.message, message?.content, message?.text].find(
    (value) => typeof value === "string",
  ) || "";
const shouldHideChatMessage = (message) => {
  if (isImageChatMessage(message)) return false;
  const text = getChatMessageText(message);
  return (
    text.startsWith(KUNDLI_DETAILS_PREFIX) ||
    text.startsWith(KUNDLI_DETAILS_ACK_PREFIX) ||
    containsAsciiDigit(text)
  );
};

const getKundliApiData = (response) => {
  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    response.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    return {
      ...response,
      ...response.data,
    };
  }

  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    response.kundli &&
    typeof response.kundli === "object" &&
    !Array.isArray(response.kundli)
  ) {
    return {
      ...response,
      ...response.kundli,
    };
  }

  return response;
};


/* =========================================================
   KUNDLI HELPERS
========================================================= */

const normalizeGender = (gender) => {
  if (!gender) return "MALE";

  const value = String(gender).trim().toUpperCase();

  if (value === "FEMALE" || value === "F") {
    return "FEMALE";
  }

  if (value === "OTHER") {
    return "OTHER";
  }

  return "MALE";
};


const normalizeDob = (dob) => {
  if (!dob) return "";

  const value = String(dob).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("-");

    return `${yyyy}-${mm}-${dd}`;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("/");

    return `${yyyy}-${mm}-${dd}`;
  }

  // DD:MM:YYYY
  if (/^\d{2}:\d{2}:\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split(":");

    return `${yyyy}-${mm}-${dd}`;
  }

  return value;
};


const normalizeTime = (time) => {
  if (!time) return "12:00:00";

  const value = String(time).trim();

  // HH:mm:ss
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  // HH:mm
  if (/^\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }

  // 05:30 PM / 05:30PM
  const amPmMatch = value.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
  );

  if (amPmMatch) {
    let hour = Number(amPmMatch[1]);

    const minute = amPmMatch[2];
    const second = amPmMatch[3] || "00";
    const period = amPmMatch[4].toUpperCase();

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    return `${String(hour).padStart(
      2,
      "0",
    )}:${minute}:${second}`;
  }

  return value;
};


const parseBirthDetails = (birthDetails) => {
  if (!birthDetails) return null;

  if (typeof birthDetails === "object") {
    return birthDetails;
  }

  if (typeof birthDetails === "string") {
    try {
      return JSON.parse(birthDetails);
    } catch (error) {
      console.log(
        LOG_TAG,
        "Unable to parse birthDetails:",
        birthDetails,
      );

      return null;
    }
  }

  return null;
};


/* =========================================================
   CHAT SCREEN
========================================================= */

export default function Chat() {
  const insets = useSafeAreaInsets();

  const {
    consultationId,
    roomId,
    userId,
    name = "Client",
    city = "",
    initials = "C",
    maxDurationSeconds,
    birthDetails: birthDetailsParam,
  } = useLocalSearchParams();

  const targetUserId = Array.isArray(userId)
    ? userId[0]
    : userId;

  const isConsultationMode = !!consultationId;

  const effectiveRoomId =
    roomId || consultationId;


  /* =========================================================
     STATES
  ========================================================= */

  const [astrologer, setAstrologer] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [clientBirthDetails, setClientBirthDetails] =
    useState(null);

  const hasClientBirthDetails = Boolean(
    clientBirthDetails ||
      (Array.isArray(birthDetailsParam)
        ? birthDetailsParam[0]
        : birthDetailsParam),
  );

  const [clientKundliData, setClientKundliData] =
    useState(null);

  const [isClientKundliVisible, setIsClientKundliVisible] =
    useState(false);

  const [isClientKundliMinimized, setIsClientKundliMinimized] =
    useState(false);

  const [isClientKundliExpanded, setIsClientKundliExpanded] =
    useState(false);

  const [kundliOverlaySize, setKundliOverlaySize] =
    useState({ width: 0, height: 0 });

  const kundliPosition = useRef(
    new Animated.ValueXY({ x: 0, y: 0 }),
  ).current;
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
      kundliOverlaySize.width *
        (isClientKundliExpanded ? 0.98 : 0.9),
    ),
  );
  const kundliWindowHeight = Math.max(
    0,
    Math.min(
      kundliOverlaySize.height - 12,
      kundliOverlaySize.height *
        (isClientKundliExpanded ? 0.9 : 0.72),
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
        Math.abs(gestureState.dx) > 3 ||
        Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: () => {
        kundliDragStartRef.current = {
          ...kundliPositionRef.current,
        };
      },
      onPanResponderMove: (_, gestureState) => {
        const bounds = kundliBoundsRef.current;
        const maxX = Math.max(
          0,
          bounds.width - bounds.windowWidth,
        );
        const maxY = Math.max(
          0,
          bounds.height - bounds.windowHeight,
        );

        kundliPosition.setValue({
          x: Math.min(
            maxX,
            Math.max(
              0,
              kundliDragStartRef.current.x + gestureState.dx,
            ),
          ),
          y: Math.min(
            maxY,
            Math.max(
              0,
              kundliDragStartRef.current.y + gestureState.dy,
            ),
          ),
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        const bounds = kundliBoundsRef.current;
        const maxX = Math.max(
          0,
          bounds.width - bounds.windowWidth,
        );
        const maxY = Math.max(
          0,
          bounds.height - bounds.windowHeight,
        );

        const position = {
          x: Math.min(
            maxX,
            Math.max(
              0,
              kundliDragStartRef.current.x + gestureState.dx,
            ),
          ),
          y: Math.min(
            maxY,
            Math.max(
              0,
              kundliDragStartRef.current.y + gestureState.dy,
            ),
          ),
        };

        kundliPositionRef.current = position;
        kundliPosition.setValue(position);
      },
    }),
  ).current;

  useEffect(() => {
    if (
      !isClientKundliVisible ||
      !kundliOverlaySize.width ||
      !kundliOverlaySize.height ||
      !renderedKundliWidth ||
      !renderedKundliHeight
    ) {
      return;
    }

    const maxX = Math.max(
      0,
      kundliOverlaySize.width - renderedKundliWidth,
    );
    const maxY = Math.max(
      0,
      kundliOverlaySize.height - renderedKundliHeight,
    );
    const currentPosition = centerKundliOnOpenRef.current
      ? {
          x: maxX / 2,
          y: maxY / 2,
        }
      : kundliPositionRef.current;
    const position = {
      x: Math.min(maxX, Math.max(0, currentPosition.x)),
      y: Math.min(maxY, Math.max(0, currentPosition.y)),
    };

    centerKundliOnOpenRef.current = false;
    kundliPositionRef.current = position;
    kundliPosition.setValue(position);
  }, [
    isClientKundliVisible,
    kundliOverlaySize,
    kundliPosition,
    renderedKundliHeight,
    renderedKundliWidth,
  ]);

  const [inputText, setInputText] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [chatActive, setChatActive] =
    useState(isConsultationMode);

  const [chatEnded, setChatEnded] =
    useState(false);

  const [isBlocked, setIsBlocked] =
    useState(false);

  const [isBlockedByOther, setIsBlockedByOther] =
    useState(false);

  const [remoteTyping, setRemoteTyping] =
    useState(false);

  const [secondsLeft, setSecondsLeft] =
    useState(
      maxDurationSeconds
        ? Number(maxDurationSeconds)
        : null,
    );

  const [historyResolved, setHistoryResolved] =
    useState(false);

  const [socketConnected, setSocketConnected] =
    useState(
      () =>
        getConnectionStatus() ===
        "connected",
    );

  const [connStatus, setConnStatus] =
    useState(
      () => getConnectionStatus(),
    );


  /* =========================================================
     REFS
  ========================================================= */

  const listRef = useRef(null);

  const typingTimeoutRef =
    useRef(null);

  const timerRef =
    useRef(null);

  const endAlertShownRef =
    useRef(false);

  const refetchMessagesRef =
    useRef(null);

  const refetchConsultationHistoryRef =
    useRef(null);


  /* =========================================================
     GET ASTROLOGER
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const user =
        await getStoredUser();

      if (isMounted) {
        setAstrologer(user);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =========================================================
     CHAT HISTORY
  ========================================================= */

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(
    { roomId },
    {
      skip:
        !roomId ||
        isConsultationMode,

      pollingInterval:
        isConsultationMode
          ? 0
          : ROOM_POLL_INTERVAL_MS,
    },
  );


  useEffect(() => {
    refetchMessagesRef.current =
      refetchMessages;
  }, [refetchMessages]);


  /* =========================================================
     MUTATIONS
  ========================================================= */

  const [
    sendChatMessageMutation,
  ] = useSendChatMessageMutation();

  const [
    deleteChatMessageMutation,
  ] = useDeleteChatMessageMutation();

  const [
    markRoomRead,
  ] = useMarkRoomReadMutation();

  const [
    toggleBlockUserMutation,
  ] = useToggleBlockUserMutation();

  const [
    reportUserMutation,
  ] = useReportUserMutation();


  /* =========================================================
     CLIENT KUNDLI API
  ========================================================= */

  const [
    getFullKundli,
    {
      isLoading:
        isGeneratingKundli,
    },
  ] = useGetFullKundliMutation();


  /* =========================================================
     BLOCK STATUS
  ========================================================= */

  const {
    data: blockStatusData,
  } = useGetBlockStatusQuery(
    targetUserId,
    {
      skip: !targetUserId,
    },
  );


  useEffect(() => {
    const status =
      blockStatusData?.data ??
      blockStatusData;

    setIsBlocked(
      Boolean(
        status?.isBlockedByMe ??
          status?.isBlocked ??
          false,
      ),
    );

    setIsBlockedByOther(
      Boolean(
        status?.isBlockedByThem ??
          false,
      ),
    );
  }, [blockStatusData]);


  /* =========================================================
     DISPLAY MESSAGES
  ========================================================= */

  const displayMessages =
    (isConsultationMode
      ? messages
      : historyData?.messages ?? []).filter(
        (message) => !shouldHideChatMessage(message),
      );


  const canMessage =
    !chatEnded &&
    !isBlocked &&
    !isBlockedByOther &&
    (!isConsultationMode ||
      chatActive);

      /* =========================================================
   DELETE MESSAGE EVENT
========================================================= */

const handleChatMessageDeleted =
  useCallback(
    (data) => {
      if (
        data?.consultationId &&
        data.consultationId !==
          consultationId
      ) {
        return;
      }

      const messageId =
        data?.messageId ||
        data?.id;

      if (!messageId) return;

      setMessages((previous) =>
        data?.deleteType === "me"
          ? previous.filter(
              (message) =>
                String(
                  message?.id ||
                    message?._id,
                ) !==
                String(messageId),
            )
          : previous.map(
              (message) =>
                String(
                  message?.id ||
                    message?._id,
                ) ===
                String(messageId)
                  ? {
                      ...message,
                      message:
                        "This message was deleted",
                      isDeleted: true,
                    }
                  : message,
            ),
      );
    },
    [consultationId],
  );


/* =========================================================
   BLOCK USER
========================================================= */

const handleBlockUser =
  useCallback(
    (
      targetId = targetUserId,
    ) => {
      if (!targetId) return;

      const nextBlocked =
        !isBlocked;

      Alert.alert(
        nextBlocked
          ? "Block user"
          : "Unblock user",

        `Are you sure you want to ${
          nextBlocked
            ? "block"
            : "unblock"
        } ${
          name || "this user"
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

            onPress:
              async () => {
                try {
                  const response =
                    await toggleBlockUserMutation(
                      {
                        targetUserId:
                          targetId,
                      },
                    ).unwrap();

                  const status =
                    response?.data ??
                    response;

                  setIsBlocked(
                    typeof status?.isBlocked ===
                      "boolean"
                      ? status.isBlocked
                      : nextBlocked,
                  );

                  Alert.alert(
                    nextBlocked
                      ? "User blocked"
                      : "User unblocked",

                    response?.message ||
                      (nextBlocked
                        ? "This user has been blocked."
                        : "This user has been unblocked."),
                  );
                } catch (error) {
                  console.log(
                    LOG_TAG,
                    "Block/unblock failed:",
                    error,
                  );

                  Alert.alert(
                    "Error",
                    error?.data
                      ?.message ||
                      "Unable to update block status.",
                  );
                }
              },
          },
        ],
      );
    },
    [
      isBlocked,
      name,
      targetUserId,
      toggleBlockUserMutation,
    ],
  );


/* =========================================================
   REPORT USER
========================================================= */

const handleReportUser =
  useCallback(
    (
      targetId = targetUserId,
    ) => {
      if (!targetId) return;

      const submitReport =
        async (reason) => {
          try {
            const response =
              await reportUserMutation(
                {
                  reportedUserId:
                    targetId,
                  reason,
                },
              ).unwrap();

            const result =
              response?.data ??
              response;

            if (
              result?.isUserBlocked
            ) {
              setIsBlocked(true);
            }

            Alert.alert(
              "Report submitted",
              response?.message ||
                "Your report was submitted successfully.",
            );
          } catch (error) {
            console.log(
              LOG_TAG,
              "Report submission failed:",
              error,
            );

            Alert.alert(
              "Error",
              error?.data
                ?.message ||
                "Unable to submit the report.",
            );
          }
        };

      const showMoreReasons =
        () =>
          Alert.alert(
            "Report user",
            "Select a reason",
            [
              {
                text: "Harassment",
                onPress: () =>
                  submitReport(
                    "Harassment",
                  ),
              },

              {
                text: "Other",
                onPress: () =>
                  submitReport(
                    "Other",
                  ),
              },

              {
                text: "Cancel",
                style: "cancel",
              },
            ],
          );

      Alert.alert(
        "Report user",
        "Select a reason",
        [
          {
            text: "Abusive Language",
            onPress: () =>
              submitReport(
                "Abusive Language",
              ),
          },

          {
            text: "Fraud",
            onPress: () =>
              submitReport(
                "Fraud",
              ),
          },

          {
            text: "More",
            onPress:
              showMoreReasons,
          },
        ],
      );
    },
    [
      reportUserMutation,
      targetUserId,
    ],
  );


/* =========================================================
   MESSAGE ACTION
========================================================= */

const handleMessageAction =
  useCallback(
    (message) => {
      const messageId =
        message?.id ||
        message?._id;

      if (!messageId) {
        Alert.alert(
          "Delete message",
          "This message has no message ID.",
        );

        return;
      }

      const isOwnMessage =
        message?.senderId ===
          astrologer?.id ||
        message?.senderRole ===
          "astrologer" ||
        message?.senderRole ===
          "user" ||
        message?.senderId ===
          targetUserId;

      const messageUserId =
        message?.senderRole ===
          "astrologer" ||
        message?.senderId ===
          astrologer?.id
          ? astrologer?.id
          : targetUserId;

      const deleteMessage =
        async (deleteType) => {
          try {
            await deleteChatMessageMutation(
              {
                messageId,
                deleteType,
              },
            ).unwrap();

            if (
              deleteType ===
              "everyone"
            ) {
              if (
                isConsultationMode
              ) {
                deleteChatMessageSocket(
                  {
                    consultationId,
                    messageId,
                    deleteType,
                  },
                );

                setMessages(
                  (previous) =>
                    previous.map(
                      (item) =>
                        String(
                          item?.id ||
                            item?._id,
                        ) ===
                        String(
                          messageId,
                        )
                          ? {
                              ...item,
                              message:
                                "This message was deleted",
                              isDeleted:
                                true,
                            }
                          : item,
                    ),
                );
              } else {
                refetchMessages();
              }
            } else if (
              isConsultationMode
            ) {
              setMessages(
                (previous) =>
                  previous.filter(
                    (item) =>
                      String(
                        item?.id ||
                          item?._id,
                      ) !==
                      String(
                        messageId,
                      ),
                  ),
              );
            } else {
              refetchMessages();
            }
          } catch (error) {
            console.log(
              LOG_TAG,
              "Delete message failed:",
              error,
            );

            Alert.alert(
              "Delete failed",
              error?.data
                ?.message ||
                "Unable to delete this message.",
            );
          }
        };

      const options = [
        {
          text: "Delete for me",
          onPress: () =>
            deleteMessage("me"),
        },
      ];

      if (isOwnMessage) {
        options.push({
          text: "Delete for everyone",
          style: "destructive",

          onPress: () =>
            deleteMessage(
              "everyone",
            ),
        });
      }

      if (messageUserId) {
        options.push({
          text: "More",

          onPress: () =>
            Alert.alert(
              "Sender options",
              "Choose an action",
              [
                {
                  text: "Block sender",
                  style:
                    "destructive",

                  onPress: () =>
                    handleBlockUser(
                      messageUserId,
                    ),
                },

                {
                  text: "Report sender",

                  onPress: () =>
                    handleReportUser(
                      messageUserId,
                    ),
                },

                {
                  text: "Cancel",
                  style: "cancel",
                },
              ],
            ),
        });
      } else {
        options.push({
          text: "Cancel",
          style: "cancel",
        });
      }

      Alert.alert(
        "Message options",
        "Choose an action",
        options,
      );
    },
    [
      astrologer?.id,
      consultationId,
      deleteChatMessageMutation,
      handleBlockUser,
      handleReportUser,
      isConsultationMode,
      refetchMessages,
      targetUserId,
    ],
  );


/* =========================================================
   SEED CHAT HISTORY
========================================================= */

useEffect(() => {
  console.log(
    LOG_TAG,
    "history query state:",
    {
      isConsultationMode,
      effectiveRoomId,
      historyLoading,
      messageCount:
        historyData?.messages
          ?.length ?? 0,
    },
  );

  if (
    isConsultationMode &&
    historyData?.messages
  ) {
    console.log(
      LOG_TAG,
      "SEEDING HISTORY MESSAGES:",
      historyData.messages.length,
    );

    setMessages(
      historyData.messages.filter(
        (message) => !shouldHideChatMessage(message),
      ),
    );
  }
}, [
  historyData,
  historyLoading,
  effectiveRoomId,
  isConsultationMode,
]);


useEffect(() => {
  if (historyError) {
    console.log(
      LOG_TAG,
      "HISTORY FETCH ERROR:",
      JSON.stringify(
        historyError,
      ),
    );
  }
}, [historyError]);


/* =========================================================
   ROOM MODE - MARK READ
========================================================= */

useEffect(() => {
  if (
    !isConsultationMode &&
    effectiveRoomId
  ) {
    console.log(
      LOG_TAG,
      "ROOM MODE: marking room read:",
      effectiveRoomId,
    );

    markRoomRead(
      effectiveRoomId,
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  isConsultationMode,
  effectiveRoomId,
]);


/* =========================================================
   ROOM SOCKET DEBUG
========================================================= */

useEffect(() => {
  if (isConsultationMode) {
    return undefined;
  }

  const socket = getSocket();

  if (!socket) {
    console.log(
      LOG_TAG,
      "ROOM MODE: no socket instance for debug tap",
    );

    return undefined;
  }

  const debugTap = (
    eventName,
    ...args
  ) => {
    const containsPrivateKundliDetails =
      eventName === "new_chat_message" &&
      args.some(
        (argument) =>
          typeof argument?.message === "string" &&
          argument.message.startsWith(KUNDLI_DETAILS_PREFIX),
      );

    console.log(
      LOG_TAG,
      "ROOM MODE socket event:",
      eventName,
      containsPrivateKundliDetails
        ? "[private Kundli details omitted]"
        : eventName === "new_chat_message" &&
            args.some(isImageChatMessage)
          ? "[image payload omitted]"
        : JSON.stringify(args),
    );
  };

  socket.onAny(debugTap);

  console.log(
    LOG_TAG,
    "ROOM MODE: attached debug onAny tap",
  );

  return () =>
    socket.offAny(
      debugTap,
    );
}, [isConsultationMode]);


/* =========================================================
   CONSULTATION HISTORY
========================================================= */

const {
  data: consultationHistoryData,
  refetch:
    refetchConsultationHistory,
} =
  useGetConsultationHistoryQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      skip:
        !isConsultationMode,

      pollingInterval:
        isConsultationMode &&
        !historyResolved
          ? 3000
          : 0,
    },
  );


useEffect(() => {
  refetchConsultationHistoryRef.current =
    refetchConsultationHistory;
}, [
  refetchConsultationHistory,
]);


/* =========================================================
   CONSULTATION STATUS
========================================================= */

useEffect(() => {
  if (
    !isConsultationMode ||
    chatEnded
  ) {
    return;
  }

  const match =
    consultationHistoryData?.consultations?.find(
      (c) =>
        String(
          c?.id ||
            c?._id,
        ) ===
        String(
          consultationId,
        ),
    );

  console.log(
    LOG_TAG,
    "consultation status fallback lookup:",
    JSON.stringify(match),
  );

  if (!match) return;

  if (
    match.status ===
      "ongoing" &&
    match.startedAt
  ) {
    const startedAtMs =
      new Date(
        match.startedAt,
      ).getTime();

    const elapsedSec =
      Math.floor(
        (Date.now() -
          startedAtMs) /
          1000,
      );

    const remaining =
      Math.max(
        0,
        (match.maxDuration ??
          0) -
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

    setChatActive(true);

    setSecondsLeft(
      remaining,
    );

    setHistoryResolved(true);
  } else if (
    [
      "completed",
      "missed",
      "cancelled",
    ].includes(
      match.status,
    )
  ) {
    console.log(
      LOG_TAG,
      "RECOVERED ended chat state:",
      match.status,
    );

    setChatActive(false);
    setChatEnded(true);
    setHistoryResolved(true);

    if (
      !endAlertShownRef.current
    ) {
      endAlertShownRef.current =
        true;

      const amount =
        match?.amount ??
        match?.consultation
          ?.amount ??
        null;

      Alert.alert(
        "Chat Ended",

        amount != null
          ? `Consultation Amount: ₹${amount}`
          : "This chat session has ended.",

        [
          {
            text: "OK",

            onPress: () => {
              router.replace(
                "/(home)",
              );
            },
          },
        ],
      );
    }
  }
}, [
  consultationHistoryData,
  isConsultationMode,
  consultationId,
  chatEnded,
]);


/* =========================================================
   NEXT PART
========================================================= */
/* =========================================================
   OPEN CURRENT CLIENT KUNDLI
========================================================= */

const handleOpenClientKundli = async () => {
  if (!consultationId) {
    Alert.alert(
      "Kundli",
      "Client consultation details are not available.",
    );
    return;
  }

  try {
    const rawBirthDetails =
      clientBirthDetails ||
      (Array.isArray(birthDetailsParam)
        ? birthDetailsParam[0]
        : birthDetailsParam);
    const suppliedBirthDetails = parseBirthDetails(rawBirthDetails);

    if (rawBirthDetails && !suppliedBirthDetails) {
      Alert.alert(
        "Kundli Details Error",
        "Client birth details could not be read. Please ask the client to re-enter them.",
      );
      return;
    }

    console.log(
      LOG_TAG,
      "Opening client Kundli for consultation:",
      consultationId,
    );

const rawHistory =
  consultationHistoryData?.consultations ??
  consultationHistoryData?.data?.consultations ??
  consultationHistoryData?.data ??
  consultationHistoryData ??
  [];

const consultations = Array.isArray(rawHistory)
  ? rawHistory
  : [];

console.log(
  LOG_TAG,
  "KUNDLI consultationId:",
  consultationId,
);

console.log(
  LOG_TAG,
  "KUNDLI HISTORY RESPONSE:",
  JSON.stringify(
    consultationHistoryData,
    null,
    2,
  ),
);

console.log(
  LOG_TAG,
  "KUNDLI HISTORY CONSULTATIONS:",
  JSON.stringify(
    consultations,
    null,
    2,
  ),
);

let currentConsultation =
  consultations.find((item) => {
    const ids = [
      item?.id,
      item?._id,
      item?.consultationId,
      item?.consultation?.id,
      item?.consultation?._id,
      item?.consultation?.consultationId,
    ]
      .filter(
        (value) =>
          value !== undefined &&
          value !== null,
      )
      .map((value) =>
        String(value),
      );

    return ids.includes(
      String(consultationId),
    );
  });

if (!currentConsultation && suppliedBirthDetails) {
  currentConsultation = {
    birthDetails: suppliedBirthDetails,
    user: { name },
    city,
  };
}

console.log(
  LOG_TAG,
  "KUNDLI CURRENT CONSULTATION:",
  JSON.stringify(
    currentConsultation,
    null,
    2,
  ),
);
    console.log(
      LOG_TAG,
      "CURRENT CONSULTATION:",
      JSON.stringify(
        currentConsultation,
        null,
        2,
      ),
    );

if (!currentConsultation) {
  Alert.alert(
    "Kundli",
    "Client consultation data is not available. Please check the console logs.",
  );
  return;
}

    /* =====================================================
       GET CLIENT BIRTH DETAILS
    ===================================================== */

    let birthDetails =
      currentConsultation?.birthDetails ||
      currentConsultation?.clientBirthDetails ||
      currentConsultation?.userBirthDetails;

    birthDetails =
      parseBirthDetails(
        birthDetails,
      );


    /* =====================================================
       FALLBACK
       IF BACKEND RETURNS FIELDS DIRECTLY
    ===================================================== */

    if (!birthDetails) {
      birthDetails = {
        name:
          currentConsultation?.clientName ||
          currentConsultation?.userName ||
          currentConsultation?.name ||
          name,

        gender:
          currentConsultation?.gender ||
          currentConsultation?.clientGender ||
          currentConsultation?.userGender,

        dob:
          currentConsultation?.dob ||
          currentConsultation?.dateOfBirth ||
          currentConsultation?.birthDate,

        tob:
          currentConsultation?.tob ||
          currentConsultation?.birthTime ||
          currentConsultation?.timeOfBirth,

        birthPlace:
          currentConsultation?.birthPlace ||
          currentConsultation?.placeOfBirth ||
          currentConsultation?.city ||
          city,

        city:
          currentConsultation?.city ||
          city,

        latitude:
          currentConsultation?.latitude ??
          currentConsultation?.lat,

        longitude:
          currentConsultation?.longitude ??
          currentConsultation?.lng,

        timezone:
          currentConsultation?.timezone ||
          "Asia/Kolkata",
      };
    }


    console.log(
      LOG_TAG,
      "CLIENT BIRTH DETAILS:",
      JSON.stringify(
        birthDetails,
        null,
        2,
      ),
    );


    /* =====================================================
       NORMALIZE CLIENT DATA
    ===================================================== */

    const clientName =
      birthDetails?.name ||
      birthDetails?.clientName ||
      birthDetails?.userName ||
      name ||
      "Client";

    const gender =
      normalizeGender(
        birthDetails?.gender ||
          birthDetails?.sex ||
          currentConsultation?.gender,
      );

    const dob =
      normalizeDob(
        birthDetails?.dob ||
          birthDetails?.dateOfBirth ||
          birthDetails?.birthDate,
      );

    const tob =
      normalizeTime(
        birthDetails?.tob ||
          birthDetails?.birthTime ||
          birthDetails?.timeOfBirth,
      );

    const birthPlace =
      birthDetails?.birthPlace ||
      birthDetails?.placeOfBirth ||
      birthDetails?.city ||
      currentConsultation?.birthPlace ||
      city;

    const clientCity =
      birthDetails?.city ||
      currentConsultation?.city ||
      city ||
      birthPlace;

    const latitude =
      birthDetails?.latitude ??
      birthDetails?.lat ??
      currentConsultation?.latitude ??
      currentConsultation?.lat;

    const longitude =
      birthDetails?.longitude ??
      birthDetails?.lng ??
      currentConsultation?.longitude ??
      currentConsultation?.lng;

    const timezone =
      birthDetails?.timezone ||
      currentConsultation?.timezone ||
      "Asia/Kolkata";


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!dob) {
      Alert.alert(
        "Kundli Details Missing",
        "Client date of birth is not available.",
      );
      return;
    }

    if (!birthPlace) {
      Alert.alert(
        "Kundli Details Missing",
        "Client birth place is not available.",
      );
      return;
    }


    /* =====================================================
       API PAYLOAD
    ===================================================== */

    const payload = {
      name: clientName,
      gender,
      dob,
      tob,
      birthPlace,
      city: clientCity,
      timezone,
      la: "hi",
    };


    if (
      latitude !== undefined &&
      latitude !== null &&
      latitude !== ""
    ) {
      payload.latitude =
        Number(latitude);
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      longitude !== ""
    ) {
      payload.longitude =
        Number(longitude);
    }


    console.log(
      LOG_TAG,
      "CLIENT KUNDLI API PAYLOAD:",
      JSON.stringify(
        payload,
        null,
        2,
      ),
    );


    /* =====================================================
       CALL ASTROLOGY ENGINE
    ===================================================== */

    const response =
      await getFullKundli(
        payload,
      ).unwrap();


    console.log(
      LOG_TAG,
      "CLIENT KUNDLI API RESPONSE:",
      JSON.stringify(
        response,
        null,
        2,
      ),
    );


    const kundliData =
      getKundliApiData(response);


    if (!kundliData) {
      Alert.alert(
        "Kundli",
        "Kundli data could not be generated.",
      );
      return;
    }


    /* =====================================================
       OPEN KUNDLI SCREEN
    ===================================================== */

    centerKundliOnOpenRef.current = true;
    setIsClientKundliMinimized(false);
    setIsClientKundliExpanded(false);
    setClientKundliData(kundliData);
    setIsClientKundliVisible(true);
  } catch (error) {
    console.log(
      LOG_TAG,
      "CLIENT KUNDLI ERROR:",
      JSON.stringify(
        error,
        null,
        2,
      ),
    );

    const message =
      error?.data?.message ||
      error?.error ||
      error?.message ||
      "Unable to generate client's Kundli.";

    Alert.alert(
      "Kundli Error",
      message,
    );
  }
};


/* =========================================================
   CONSULTATION SOCKET
========================================================= */

useEffect(() => {
  if (!isConsultationMode) {
    return undefined;
  }

  let isMounted = true;

  const unsubscribers = [];

  let currentUser = null;


  /* =====================================================
     JOIN CHAT SESSION
  ===================================================== */

  const joinChatSession = () => {
    if (
      !isMounted ||
      !consultationId
    ) {
      return;
    }

    console.log(
      LOG_TAG,
      "EMIT join_chat_session:",
      consultationId,
    );

    emitEvent(
      "join_chat_session",
      {
        consultationId,
        userId:
          currentUser?.id,
        role: "astrologer",
      },
    );
  };


  /* =====================================================
     SOCKET SETUP
  ===================================================== */

  const setup = async () => {
    currentUser =
      await getStoredUser();

    if (!isMounted) {
      return;
    }

    let socket =
      getSocket();

    if (
      !socket?.connected &&
      currentUser?.token
    ) {
      socket =
        await connectSocket(
          currentUser.token,
        );
    }


    console.log(
      LOG_TAG,
      "socket setup:",
      {
        hasSocket:
          !!socket,

        socketConnected:
          socket?.connected,

        consultationId,
      },
    );


    if (
      !socket ||
      !consultationId
    ) {
      console.log(
        LOG_TAG,
        "CANNOT JOIN, MISSING SOCKET OR consultationId",
        {
          hasSocket:
            !!socket,

          consultationId,
        },
      );

      return;
    }


    /* ===================================================
       CONNECTION STATUS
    =================================================== */

    const unsubStatus =
      onConnectionStatusChange(
        (status) => {
          if (!isMounted) {
            return;
          }

          setConnStatus(
            status,
          );

          setSocketConnected(
            status ===
              "connected",
          );
        },
      );

    unsubscribers.push(
      unsubStatus,
    );


    /* ===================================================
       SESSION JOINED
    =================================================== */

    const onSessionJoined =
      (data) => {
        console.log(
          LOG_TAG,
          "chat_session_joined:",
          JSON.stringify(
            data,
          ),
        );
      };


    /* ===================================================
       CHAT STARTED
    =================================================== */

    const onChatStarted =
      (data) => {
        console.log(
          LOG_TAG,
          "chat_started:",
          JSON.stringify(
            data,
          ),
        );

        setChatActive(
          true,
        );

        if (
          data?.maxDurationSeconds !=
          null
        ) {
          setSecondsLeft(
            data.maxDurationSeconds,
          );
        }
      };


    /* ===================================================
       NEW MESSAGE
    =================================================== */

    const onNewMessage =
      (data) => {
        const incomingText =
          typeof data?.message === "string"
            ? data.message
            : "";

        if (incomingText.startsWith(KUNDLI_DETAILS_ACK_PREFIX)) {
          return;
        }

        if (incomingText.startsWith(KUNDLI_DETAILS_PREFIX)) {
          const details = parseBirthDetails(
            incomingText.slice(KUNDLI_DETAILS_PREFIX.length),
          );

          if (details) {
            setClientBirthDetails(details);
            console.log(
              LOG_TAG,
              "Private client Kundli details received.",
            );
            emitEvent("send_chat_message", {
              consultationId,
              senderId: currentUser?.id,
              senderRole: "astrologer",
              message: `${KUNDLI_DETAILS_ACK_PREFIX}${consultationId}`,
              messageType: "TEXT",
              clientTempId: `${currentUser?.id || "astrologer"}-kundli-ack-${consultationId}`,
            });
          } else {
            console.log(
              LOG_TAG,
              "Private client Kundli details could not be parsed.",
            );
          }

          return;
        }

        if (
          !isImageChatMessage(data) &&
          containsAsciiDigit(incomingText)
        ) {
          console.log(
            LOG_TAG,
            "Ignored incoming chat message containing digits.",
          );
          return;
        }

        console.log(
          LOG_TAG,
          "new_chat_message:",
          isImageChatMessage(data)
            ? {
                id: data?.id || data?._id || data?.messageId,
                messageType: data?.messageType || data?.type,
                imagePayload: summarizeImagePayload(data),
              }
              : JSON.stringify(data),
        );

        setMessages(
          (prev) => {
            const incomingId =
              data?.id || data?._id || data?.messageId;
            const duplicateIndex = incomingId
              ? prev.findIndex(
                  (message) =>
                    String(
                      message?.id ||
                        message?._id ||
                        message?.messageId ||
                        "",
                    ) === String(incomingId),
                )
              : isImageChatMessage(data)
                ? prev.findIndex((message) =>
                    isDuplicateImageEvent(message, data),
                  )
                : -1;
            const pendingIndex = data?.clientTempId
              ? prev.findIndex(
                  (message) =>
                    message.clientTempId === data.clientTempId,
                )
              : prev.findIndex(
                  (message) =>
                    (message.status === "sending" ||
                      message.status === "sent") &&
                    message.senderId === data?.senderId &&
                    (message.message === data?.message ||
                      sameImageChatMessage(message, data)),
                );
            const matchIndex =
              pendingIndex !== -1 ? pendingIndex : duplicateIndex;

            if (matchIndex > -1) {
              const next =
                [
                  ...prev,
                ];

              next[matchIndex] = {
                ...prev[matchIndex],
                ...data,
                message:
                  data?.message ?? prev[matchIndex].message,
                messageType:
                  data?.messageType ?? prev[matchIndex].messageType,
                clientTempId:
                  data?.clientTempId ?? prev[matchIndex].clientTempId,
                status:
                  "sent",
              };

              return next;
            }

            return [
              ...prev,
              data,
            ];
          },
        );

        requestAnimationFrame(
          () => {
            listRef.current?.scrollToEnd(
              {
                animated:
                  true,
              },
            );
          },
        );
      };


    /* ===================================================
       TYPING
    =================================================== */

    const onTyping =
      (data) => {
        console.log(
          LOG_TAG,
          "user_typing:",
          JSON.stringify(
            data,
          ),
        );

        if (
          data?.role ===
          "astrologer"
        ) {
          return;
        }

        setRemoteTyping(
          !!data?.isTyping,
        );
      };


    /* ===================================================
       CHAT ENDED
    =================================================== */

    const onChatEnded =
      (data) => {
        console.log(
          LOG_TAG,
          "chat_ended:",
          JSON.stringify(
            data,
          ),
        );

        setChatActive(
          false,
        );

        setChatEnded(
          true,
        );

        endAlertShownRef.current =
          true;

        if (
          timerRef.current
        ) {
          clearInterval(
            timerRef.current,
          );
        }

        const amount =
          data?.consultation
            ?.amount;

        const endReason =
          data?.reason;

        let alertTitle =
          "Chat Ended";

        let alertMsg =
          "This chat session has ended.";


        if (
          endReason ===
          "time_expired"
        ) {
          alertTitle =
            "Time Expired";

          alertMsg =
            "Consultation time limit reached.";
        } else {
          alertTitle =
            "Chat Ended by Client";

          alertMsg =
            `Client has ended this chat consultation session.${
              amount != null
                ? ` Total Earnings: ₹${amount}`
                : ""
            }`;
        }


        Alert.alert(
          alertTitle,
          alertMsg,
          [
            {
              text: "OK",

              onPress: () => {
                router.replace(
                  "/(home)",
                );
              },
            },
          ],
        );
      };


    /* ===================================================
       SOCKET LISTENERS
    =================================================== */

    socket.on(
      "chat_session_joined",
      onSessionJoined,
    );

    socket.on(
      "chat_started",
      onChatStarted,
    );

    socket.on(
      "new_chat_message",
      onNewMessage,
    );

    socket.on(
      "user_typing",
      onTyping,
    );

    socket.on(
      "chat_ended",
      onChatEnded,
    );

    socket.on(
      "chat_message_deleted",
      handleChatMessageDeleted,
    );

    joinChatSession();


    /* ===================================================
       RECONNECT
    =================================================== */

    const reconcileAfterReconnect =
      (source) => {
        console.log(
          LOG_TAG,
          "reconciling chat state:",
          source,
        );

        joinChatSession();

        if (
          !isConsultationMode &&
          roomId
        ) {
          refetchMessagesRef.current?.();
        }

        if (
          isConsultationMode
        ) {
          refetchConsultationHistoryRef.current?.();
        }
      };


    let hasConnectedBefore =
      socket.connected;

    let prevStatus =
      getConnectionStatus();


    const unsubStatusReconcile =
      onConnectionStatusChange(
        (status) => {
          if (
            status ===
              "connected" &&
            prevStatus !==
              "connected" &&
            hasConnectedBefore
          ) {
            reconcileAfterReconnect(
              "socket reconnected",
            );
          }

          if (
            status ===
            "connected"
          ) {
            hasConnectedBefore =
              true;
          }

          prevStatus =
            status;
        },
      );


    unsubscribers.push(
      unsubStatusReconcile,
    );


    /* ===================================================
       APP FOREGROUND
    =================================================== */

    const onAppStateChange =
      (nextState) => {
        if (
          nextState !==
          "active"
        ) {
          return;
        }

        console.log(
          LOG_TAG,
          "app foregrounded:",
          {
            socketConnected:
              socket.connected,
          },
        );


        if (
          getConnectionStatus() !==
          "connected"
        ) {
          console.log(
            LOG_TAG,
            "forcing socket reconnect on foreground",
          );

          forceReconnectChatSocket();
        }


        reconcileAfterReconnect(
          "app foregrounded",
        );
      };


    const appStateSub =
      AppState.addEventListener(
        "change",
        onAppStateChange,
      );


    /* ===================================================
       CLEANUP
    =================================================== */

    unsubscribers.push(
      () =>
        socket.off(
          "chat_session_joined",
          onSessionJoined,
        ),

      () =>
        socket.off(
          "chat_started",
          onChatStarted,
        ),

      () =>
        socket.off(
          "new_chat_message",
          onNewMessage,
        ),

      () =>
        socket.off(
          "user_typing",
          onTyping,
        ),

      () =>
        socket.off(
          "chat_ended",
          onChatEnded,
        ),

      () =>
        socket.off(
          "chat_message_deleted",
          handleChatMessageDeleted,
        ),

      () =>
        appStateSub.remove(),
    );
  };


  setup();


  return () => {
    isMounted =
      false;

    unsubscribers.forEach(
      (off) => off(),
    );

    if (
      timerRef.current
    ) {
      clearInterval(
        timerRef.current,
      );
    }

    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current,
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  consultationId,
  isConsultationMode,
  handleChatMessageDeleted,
]);


/* =========================================================
   COUNTDOWN TIMER
========================================================= */

useEffect(() => {
  if (
    !chatActive ||
    secondsLeft == null
  ) {
    return undefined;
  }

  timerRef.current =
    setInterval(() => {
      setSecondsLeft(
        (prev) => {
          if (
            prev == null
          ) {
            return prev;
          }

          if (
            prev <= 1
          ) {
            clearInterval(
              timerRef.current,
            );

            return 0;
          }

          return prev - 1;
        },
      );
    }, 1000);

  return () =>
    clearInterval(
      timerRef.current,
    );
}, [chatActive]);


/* =========================================================
   AUTO END CHAT
========================================================= */

useEffect(() => {
  if (
    !chatActive ||
    chatEnded ||
    secondsLeft ===
      null ||
    secondsLeft > 0
  ) {
    return;
  }

  console.log(
    LOG_TAG,
    "Countdown expired, auto-ending chat session",
  );

  endChatSession(
    "time_expired",
  );
}, [
  chatActive,
  chatEnded,
  secondsLeft,
]);


/* =========================================================
   SPEECH RECOGNITION
========================================================= */

useSpeechRecognitionEvent(
  "result",
  (event) => {
    const transcript =
      event.results?.[0]
        ?.transcript;

    if (
      transcript !=
      null
    ) {
      setInputText(
        transcript.replace(/[0-9]/g, ""),
      );
    }
  },
);


useSpeechRecognitionEvent(
  "end",
  () =>
    setIsListening(false),
);


useSpeechRecognitionEvent(
  "error",
  (event) => {
    console.log(
      LOG_TAG,
      "speech recognition error:",
      event.error,
      event.message,
    );

    setIsListening(
      false,
    );
  },
);


useEffect(() => {
  return () => {
    ExpoSpeechRecognitionModule.stop();
  };
}, []);
/* =========================================================
   MICROPHONE
========================================================= */

const handleMicPress = async () => {
  if (!canMessage) {
    return;
  }

  if (isListening) {
    ExpoSpeechRecognitionModule.stop();

    setIsListening(false);

    return;
  }

  const { granted } =
    await ExpoSpeechRecognitionModule
      .requestPermissionsAsync();

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


/* =========================================================
   TEXT CHANGE / TYPING INDICATOR
========================================================= */

const handleChangeText = (text) => {
  setInputText(text.replace(/[0-9]/g, ""));

  if (!isConsultationMode) {
    return;
  }

  emitEvent(
    "typing_indicator",
    {
      consultationId,
      role: "astrologer",
      isTyping: true,
    },
  );

  if (
    typingTimeoutRef.current
  ) {
    clearTimeout(
      typingTimeoutRef.current,
    );
  }

  typingTimeoutRef.current =
    setTimeout(() => {
      emitEvent(
        "typing_indicator",
        {
          consultationId,
          role: "astrologer",
          isTyping: false,
        },
      );
    }, 1500);
};


/* =========================================================
   SEND MESSAGE
========================================================= */

const handleSend = async () => {
  const trimmed =
    inputText.trim();

  if (
    !trimmed ||
    !canMessage
  ) {
    return;
  }

  if (containsAsciiDigit(trimmed)) {
    Alert.alert(
      "Numbers not allowed",
      "Chat messages cannot contain digits 0–9.",
    );
    return;
  }


  /* =======================================================
     CONSULTATION MODE
  ======================================================= */

  if (isConsultationMode) {
    console.log(
      LOG_TAG,
      "SENDING MESSAGE (consultation/socket):",
      trimmed,
    );

    const clientTempId =
      "temp_" +
      Date.now();

    const tempMsg = {
      id: clientTempId,
      clientTempId,
      senderId:
        astrologer?.id,
      senderRole:
        "astrologer",
      message:
        trimmed,
      messageType:
        "TEXT",
      createdAt:
        new Date().toISOString(),
      status:
        "sending",
    };

    setMessages(
      (prev) => [
        ...prev,
        tempMsg,
      ],
    );


    emitEvent(
      "send_chat_message",
      {
        consultationId,

        senderId:
          astrologer?.id,

        senderRole:
          "astrologer",

        message:
          trimmed,

        messageType:
          "TEXT",

        clientTempId,
      },
    );


    setInputText("");


    requestAnimationFrame(
      () => {
        listRef.current?.scrollToEnd(
          {
            animated:
              true,
          },
        );
      },
    );

    return;
  }


  /* =======================================================
     ROOM / REST MODE
  ======================================================= */

  console.log(
    LOG_TAG,
    "SENDING MESSAGE (room/REST):",
    trimmed,
  );

  setInputText("");


  try {
    const result =
      await sendChatMessageMutation(
        {
          roomId:
            effectiveRoomId,

          message:
            trimmed,

          messageType:
            "TEXT",
        },
      ).unwrap();


    console.log(
      LOG_TAG,
      "ROOM MESSAGE SENT:",
      JSON.stringify(
        result,
      ),
    );


    requestAnimationFrame(
      () => {
        listRef.current?.scrollToEnd(
          {
            animated:
              true,
          },
        );
      },
    );
  } catch (err) {
    console.log(
      LOG_TAG,
      "ROOM MESSAGE SEND FAILED:",
      JSON.stringify(
        err,
      ),
    );


    Alert.alert(
      "Send Failed",
      "Couldn't send your message. Please check your connection and try again.",
    );


    setInputText(
      trimmed,
    );
  }
};


/* =========================================================
   END CHAT SESSION
========================================================= */

const endChatSession =
  (reason = "completed") => {
    const socket =
      getSocket();

    const connected =
      !!socket?.connected;


    console.log(
      LOG_TAG,
      "EMIT end_chat_session:",
      {
        consultationId,
        socketConnected:
          connected,
        reason,
      },
    );


    if (!connected) {
      console.log(
        LOG_TAG,
        `end_chat_session NOT SENT (${reason}) - socket disconnected`,
      );


      Alert.alert(
        "Connection Issue",

        "Couldn't reach the server to end this chat (no connection). The session may still be running on the server - please check your connection and try again.",

        [
          {
            text: "OK",

            onPress: () => {
              router.replace(
                "/(home)",
              );
            },
          },
        ],
      );


      return false;
    }


    emitEvent(
      "end_chat_session",
      {
        consultationId,
        reason,
      },
    );


    return true;
  };


/* =========================================================
   END CHAT BUTTON
========================================================= */

const handleEndChat = () => {
  Alert.alert(
    "End Chat",
    "Are you sure you want to end this chat session?",

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
            "Astrologer ending chat session",
          );

          endChatSession(
            "completed",
          );

          setChatActive(
            false,
          );

          setChatEnded(
            true,
          );

          router.replace(
            "/(home)",
          );
        },
      },
    ],
  );
};


/* =========================================================
   BACK BUTTON
========================================================= */

const handleBack = () => {
  if (isClientKundliVisible) {
    setIsClientKundliMinimized(true);
    return;
  }

  console.log(
    LOG_TAG,
    "BACK PRESSED:",
    {
      isConsultationMode,
      chatActive,
      chatEnded,
      consultationId,
    },
  );


  if (
    !isConsultationMode ||
    chatEnded ||
    !chatActive
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
          const sent =
            endChatSession();

          console.log(
            LOG_TAG,
            "BACK: end_chat_session sent =",
            sent,
          );

          router.back();
        },
      },
    ],
  );
};


/* =========================================================
   ANDROID HARDWARE BACK
========================================================= */

useEffect(() => {
  const subscription =
    BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        console.log(
          LOG_TAG,
          "HARDWARE BACK PRESSED",
        );

        if (isClientKundliVisible) {
          setIsClientKundliMinimized(true);
          return true;
        }

        handleBack();

        return true;
      },
    );


  return () =>
    subscription.remove();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  isConsultationMode,
  chatActive,
  chatEnded,
  consultationId,
  isClientKundliVisible,
]);


/* =========================================================
   RENDER MESSAGE
========================================================= */

const renderMessage = ({
  item,
}) => {
  const isMine =
    item.senderRole ===
      "astrologer" ||
    item.senderId ===
      astrologer?.id;
  const isImage = isImageChatMessage(item);
  const imageUri =
    getImageChatUri(item);


  return (
    <Pressable
      onLongPress={() =>
        handleMessageAction(
          item,
        )
      }
      delayLongPress={450}
    >
      <View
        style={
          isMine
            ? styles.rightBubble
            : styles.leftBubble
        }
      >
        {item.isDeleted || item.deleted ? (
          <Text style={styles.msgText}>
            This message was deleted
          </Text>
        ) : isImage ? (
          imageUri ? (
            <ChatImage uri={imageUri} />
          ) : (
            <Text style={styles.msgText}>
              Image data was not included in this message
            </Text>
          )
        ) : (
          <Text style={styles.msgText}>
            {item.message}
          </Text>
        )}


        <Text
          style={
            isMine
              ? styles.rightTime
              : styles.leftTime
          }
        >
          {item.createdAt
            ? new Date(
                item.createdAt,
              ).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute:
                    "2-digit",
                },
              )
            : ""}
        </Text>
      </View>
    </Pressable>
  );
};


/* =========================================================
   UI START
========================================================= */

return (
  <SafeAreaView
    style={styles.safe}
  >
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <View
        style={styles.header}
      >

        {/* BACK */}
        <TouchableOpacity
          onPress={
            handleBack
          }
        >
          <Ionicons
            name="chevron-back"
            size={RF(24)}
            color={ORANGE}
          />
        </TouchableOpacity>


        {/* AVATAR */}
        <View
          style={styles.avatar}
        >
          <Text
            style={
              styles.avatarText
            }
          >
            {initials}
          </Text>
        </View>


        {/* CLIENT INFO */}
        <View
          style={
            styles.headerInfo
          }
        >
          <Text
            style={styles.name}
          >
            {name}
          </Text>


          {isConsultationMode && (
            <View
              style={
                styles.locationRow
              }
            >
              {chatActive &&
              !chatEnded &&
              socketConnected &&
              secondsLeft !=
                null ? (
                <Text
                  style={
                    styles.city
                  }
                >
                  Live ·{" "}
                  <CountdownTimer
                    secondsLeft={
                      secondsLeft
                    }
                  />{" "}
                  left
                </Text>
              ) : (
                <Text
                  style={
                    styles.city
                  }
                >
                  {chatEnded
                    ? "Client ended chat"
                    : !socketConnected
                      ? "Reconnecting..."
                      : chatActive
                        ? "Connected"
                        : city ||
                          "Connected"}
                </Text>
              )}
            </View>
          )}
        </View>


        {/* =================================================
            HEADER ACTIONS
        ================================================= */}

        <View
          style={
            styles.headerActions
          }
        >

          {/* ===============================================
              CLIENT KUNDLI BUTTON
          =============================================== */}

          <TouchableOpacity
            onPress={
              handleOpenClientKundli
            }
            disabled={
              isGeneratingKundli ||
              !hasClientBirthDetails
            }
            accessibilityLabel={
              hasClientBirthDetails
                ? "Client Kundli"
                : "Waiting for client birth details"
            }
          >
            {isGeneratingKundli ? (
              <Ionicons
                name="hourglass-outline"
                size={RF(26)}
                color="#c9c9c9"
              />
            ) : (
              <Image
                source={require("../../assets/images/kundli.jpg")}
                style={{
                  width: RF(34),
                  height: RF(34),
                  opacity: hasClientBirthDetails ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>


          {/* ===============================================
              BLOCK / REPORT
          =============================================== */}

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                name ||
                  "Client",
                "Choose an action",
                [
                  {
                    text:
                      isBlocked
                        ? "Unblock user"
                        : "Block user",

                    onPress:
                      handleBlockUser,
                  },

                  {
                    text:
                      "Report user",

                    onPress:
                      handleReportUser,
                  },

                  {
                    text: "Cancel",
                    style:
                      "cancel",
                  },
                ],
              )
            }
            accessibilityLabel="Chat user actions"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={RF(20)}
              color="#607086"
            />
          </TouchableOpacity>


          {/* ===============================================
              END CHAT
          =============================================== */}

          {isConsultationMode ? (
            <TouchableOpacity
              onPress={
                handleEndChat
              }
              disabled={
                chatEnded
              }
              accessibilityLabel="End chat"
            >
              <Ionicons
                name="close-circle-outline"
                size={RF(22)}
                color={
                  chatEnded
                    ? "#c9c9c9"
                    : "#dc2626"
                }
              />
            </TouchableOpacity>
          ) : null}

        </View>
      </View> 
      
      {/* =================================================
          BLOCKED BANNER
      ================================================= */}

      {isBlocked ? (
        <View
          style={
            styles.blockedBanner
          }
        >
          <Text
            style={
              styles.blockedText
            }
          >
            You blocked this user.
            Unblock to continue
            messaging.
          </Text>
        </View>
      ) : null}


      {/* =================================================
          CONNECTION WARNING
      ================================================= */}

      {isConsultationMode &&
        connStatus !==
          "connected" &&
        !chatEnded && (
          <View
            style={
              styles.warningBanner
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={RF(14)}
              color="#fff"
            />

            <Text
              style={
                styles.warningText
              }
            >
              {connStatus ===
              "connecting"
                ? "Connecting to server..."
                : connStatus ===
                    "reconnecting"
                  ? "Reconnecting to server..."
                  : "Disconnected. Check your internet connection."}
            </Text>
          </View>
        )}


      {/* =================================================
          CHAT LIST
      ================================================= */}

      <FlatList
        ref={listRef}
        data={
          displayMessages
        }
        keyExtractor={(
          item,
          index,
        ) =>
          String(
            item.id ||
              item._id ||
              index,
          )
        }
        renderItem={
          renderMessage
        }
        contentContainerStyle={
          styles.chatContent
        }
        showsVerticalScrollIndicator={
          false
        }
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd(
            {
              animated:
                false,
            },
          )
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
              color={ORANGE}
            />

            <Text
              style={
                styles.secureText
              }
            >
              {historyLoading
                ? "Loading chat history..."
                : "This is a secure chat. Your conversation is private and confidential."}
            </Text>
          </View>
        }
        ListFooterComponent={
          remoteTyping ? (
            <Text
              style={
                styles.typingText
              }
            >
              {name} is typing...
            </Text>
          ) : null
        }
      />


      {/* =================================================
          LISTENING
      ================================================= */}

      {isListening && (
        <View
          style={
            styles.listeningRow
          }
        >
          <Ionicons
            name="mic"
            size={RF(12)}
            color={ORANGE}
          />

          <Text
            style={
              styles.listeningText
            }
          >
            Listening...
          </Text>
        </View>
      )}


      {/* =================================================
          INPUT BAR
      ================================================= */}

      <View
        style={[
          styles.inputWrapper,
          {
            paddingBottom:
              Math.max(
                insets.bottom,
                hp(0.8),
              ),
          },
        ]}
      >

        {/* TEXT INPUT */}

        <TextInput
          placeholder={
            chatEnded
              ? "Chat has ended"
              : isBlockedByOther
                ? "This user has blocked you"
                : isBlocked
                  ? "You blocked this user"
                  : !canMessage
                    ? "Waiting for chat to start..."
                    : "Type a message..."
          }
          placeholderTextColor="#9ca3af"
          style={
            styles.input
          }
          value={
            inputText
          }
          onChangeText={
            handleChangeText
          }
          editable={
            canMessage
          }
          onSubmitEditing={
            handleSend
        }
        />


        {/* MIC */}

        <TouchableOpacity
          style={[
            styles.micBtn,
            isListening &&
              styles.micBtnActive,
            !canMessage && {
              opacity: 0.5,
            },
          ]}
          onPress={
            handleMicPress
          }
          disabled={
            !canMessage
          }
        >
          <Ionicons
            name={
              isListening
                ? "mic"
                : "mic-outline"
            }
            size={RF(18)}
            color={
              isListening
                ? "#fff"
                : ORANGE
            }
          />
        </TouchableOpacity>


        {/* SEND */}

        <TouchableOpacity
          style={[
            styles.sendBtn,
            !canMessage && {
              opacity: 0.5,
            },
          ]}
          onPress={
            handleSend
          }
          disabled={
            !canMessage
          }
        >
          <Ionicons
            name="send"
            size={RF(18)}
            color="#fff"
          />
        </TouchableOpacity>

      </View>
    {isClientKundliVisible && (
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
            pointerEvents={
              isClientKundliMinimized ? "none" : "auto"
            }
            style={[
              styles.kundliWindowToolbar,
              isClientKundliMinimized && styles.kundliHidden,
            ]}
          >
            <View
              style={styles.kundliDragHandle}
              {...kundliPanResponder.panHandlers}
            >
              <Ionicons
                name="move"
                size={RF(16)}
                color="#fff"
              />
              <Text style={styles.kundliWindowTitle}>
                Client Kundli
              </Text>
            </View>

            <View style={styles.kundliWindowActions}>
              <TouchableOpacity
                accessibilityLabel="Minimize client Kundli"
                onPress={() =>
                  setIsClientKundliMinimized(true)
                }
                style={styles.kundliWindowAction}
              >
                <Ionicons
                  name="remove"
                  size={RF(19)}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={
                  isClientKundliExpanded
                    ? "Restore client Kundli size"
                    : "Expand client Kundli"
                }
                onPress={() =>
                  setIsClientKundliExpanded(
                    (expanded) => !expanded,
                  )
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
                onPress={() =>
                  setIsClientKundliVisible(false)
                }
                style={styles.kundliWindowAction}
              >
                <Ionicons
                  name="close"
                  size={RF(18)}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            pointerEvents={
              isClientKundliMinimized ? "none" : "auto"
            }
            style={[
              styles.kundliWindowContent,
              isClientKundliMinimized &&
                styles.kundliHiddenContent,
            ]}
          >
            <KundliScreen
              data={clientKundliData}
              availableWidth={kundliWindowWidth}
              onClose={() =>
                setIsClientKundliVisible(false)
              }
            />
          </View>

          {isClientKundliMinimized && (
            <View
              style={styles.kundliBubble}
              {...kundliPanResponder.panHandlers}
            >
              <TouchableOpacity
                accessibilityLabel="Restore client Kundli"
                onPress={() =>
                  setIsClientKundliMinimized(false)
                }
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
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}


/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor: "#fff",
    },

    flex: {
      flex: 1,
      position: "relative",
    },

    kundliOverlayHost: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 20,
      elevation: 20,
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

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      height: hp(7),
      paddingHorizontal: wp(4),
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor:
        "#f2f2f2",
    },

    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp(4),
      marginLeft: wp(2),
    },

    avatar: {
      width: wp(11),
      height: wp(11),
      borderRadius: wp(5.5),
      backgroundColor:
        "#fff1e8",
      alignItems: "center",
      justifyContent:
        "center",
      marginLeft: wp(2),
      marginRight: wp(3),
    },

    avatarText: {
      color: ORANGE,
      fontSize: RF(11.5),
      fontWeight: "900",
      fontFamily:
        Typography?.bold,
    },

    headerInfo: {
      flex: 1,
    },

    name: {
      fontSize: RF(16),
      color: "#111827",
      fontWeight: "900",
      fontFamily:
        Typography?.bold,
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
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       CHAT
    ===================================================== */

    chatContent: {
      paddingHorizontal:
        wp(4),
      paddingTop: hp(1.5),
      paddingBottom:
        hp(2),
    },


    /* =====================================================
       SECURE CHAT BOX
    ===================================================== */

    secureBox: {
      alignSelf: "center",
      width: "92%",
      borderWidth: 1,
      borderColor:
        "#ffe5d2",
      backgroundColor:
        "#fff8f3",
      borderRadius: wp(2),
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
      marginLeft: wp(2),
      color: "#607086",
      fontSize: RF(12),
      textAlign: "center",
      lineHeight:
        hp(1.6),
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       MESSAGES
    ===================================================== */

    leftBubble: {
      maxWidth: "85%",
      alignSelf:
        "flex-start",
      backgroundColor:
        "#fff",
      borderWidth: 1,
      borderColor:
        "#f0f0f0",
      borderRadius:
        wp(3),
      padding: wp(4),
      marginBottom:
        hp(1.5),
    },

    rightBubble: {
      maxWidth: "85%",
      alignSelf:
        "flex-end",
      backgroundColor:
        "#fff6f0",
      borderRadius:
        wp(3),
      padding: wp(4),
      marginBottom:
        hp(2.5),
    },

    chatImage: {
      width: 220,
      height: 220,
      borderRadius: wp(2),
      backgroundColor: "#f3f4f6",
    },

    msgText: {
      fontSize: RF(16),
      color: "#111827",
      lineHeight:
        RF(16) * 1.35,
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },

    leftTime: {
      color: "#607086",
      fontSize: RF(12),
      marginTop: hp(0.6),
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },

    rightTime: {
      color: "#607086",
      fontSize: RF(12),
      marginTop: hp(0.6),
      textAlign: "right",
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       TYPING
    ===================================================== */

    typingText: {
      alignSelf:
        "flex-start",
      color: "#9ca3af",
      fontSize: RF(12),
      fontStyle:
        "italic",
      marginTop:
        hp(0.5),
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       LISTENING
    ===================================================== */

    listeningRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal:
        wp(4),
      paddingTop:
        hp(0.6),
    },

    listeningText: {
      color: ORANGE,
      fontSize: RF(11),
      marginLeft:
        wp(1.5),
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       INPUT
    ===================================================== */

    inputWrapper: {
      minHeight:
        hp(7),
      paddingHorizontal:
        wp(2.5),
      paddingVertical:
        hp(0.8),
      borderTopWidth: 1,
      borderTopColor:
        "#f2f2f2",
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#fff",
    },

    input: {
      flex: 1,
      height: hp(5),
      borderWidth: 1,
      borderColor:
        "#e5e7eb",
      borderRadius:
        wp(6),
      paddingHorizontal:
        wp(3.5),
      fontSize: RF(11),
      color: "#111827",
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       MIC BUTTON
    ===================================================== */

    micBtn: {
      width: wp(10),
      height: wp(10),
      borderRadius:
        wp(5),
      backgroundColor:
        "#fff1e8",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginLeft:
        wp(2),
    },

    micBtnActive: {
      backgroundColor:
        "#dc2626",
    },


    /* =====================================================
       SEND BUTTON
    ===================================================== */

    sendBtn: {
      width: wp(10),
      height: wp(10),
      borderRadius:
        wp(5),
      backgroundColor:
        ORANGE,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginLeft:
        wp(2),
    },


    /* =====================================================
       BLOCKED
    ===================================================== */

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

    blockedText: {
      color: "#991b1b",
      fontSize: RF(10),
      fontWeight: "700",
      textAlign:
        "center",
      fontFamily:
        Typography?.bold,
    },


    /* =====================================================
       CONNECTION WARNING
    ===================================================== */

    warningBanner: {
      backgroundColor:
        "#eab308",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingVertical:
        hp(0.8),
      gap: wp(1.5),
    },

    warningText: {
      color: "#fff",
      fontSize: RF(12),
      fontWeight: "700",
      fontFamily:
        Typography?.bold,
    },

  });