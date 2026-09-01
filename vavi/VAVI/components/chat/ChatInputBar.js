import { Ionicons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatInputBar({
  disabled,
  onSend,
  onTyping,
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [isListening, setIsListening] =
    useState(false);

  // ==========================================
  // SPEECH STARTED
  // ==========================================

  useSpeechRecognitionEvent(
    "start",
    () => {
      console.log(
        "[Speech] Recognition started",
      );

      setIsListening(true);
    },
  );

  // ==========================================
  // SPEECH RESULT
  // ==========================================

  useSpeechRecognitionEvent(
    "result",
    (event) => {
      console.log(
        "[Speech] Result:",
        event.results,
      );

      const transcript =
        event.results?.[0]?.transcript;

      if (
        transcript !== undefined &&
        transcript !== null
      ) {
        setText(transcript);

        onTyping?.(
          transcript.trim().length > 0,
        );
      }
    },
  );

  // ==========================================
  // SPEECH ENDED
  // ==========================================

  useSpeechRecognitionEvent(
    "end",
    () => {
      console.log(
        "[Speech] Recognition ended",
      );

      setIsListening(false);

      onTyping?.(false);
    },
  );

  // ==========================================
  // SPEECH ERROR
  // ==========================================

  useSpeechRecognitionEvent(
    "error",
    (event) => {
      console.log(
        "[Speech] Error:",
        event.error,
        event.message,
      );

      setIsListening(false);

      onTyping?.(false);

      if (
        event.error === "not-allowed"
      ) {
        Alert.alert(
          "Microphone Permission",
          "Please allow microphone permission to use voice typing.",
        );
      } else if (
        event.error === "no-speech"
      ) {
        console.log(
          "[Speech] No speech detected.",
        );
      }
    },
  );

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (error) {
        console.log(
          "[Speech] Cleanup error:",
          error,
        );
      }
    };
  }, []);

  // ==========================================
  // TEXT INPUT
  // ==========================================

  const handleChangeText = (
    value,
  ) => {
    setText(value);

    onTyping?.(
      value.trim().length > 0,
    );
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSend = () => {
    const trimmed =
      text.trim();

    if (
      !trimmed ||
      disabled
    ) {
      return;
    }

    // Stop voice recognition
    if (isListening) {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (error) {
        console.log(
          "[Speech] Stop error:",
          error,
        );
      }

      setIsListening(false);
    }

    onSend?.(trimmed);

    setText("");

    onTyping?.(false);
  };

  // ==========================================
  // MICROPHONE
  // ==========================================

  const handleMicPress =
    async () => {
      if (disabled) {
        return;
      }

      // ----------------------------------------
      // STOP LISTENING
      // ----------------------------------------

      if (isListening) {
        console.log(
          "[Speech] Stopping...",
        );

        try {
          ExpoSpeechRecognitionModule.stop();
        } catch (error) {
          console.log(
            "[Speech] Stop error:",
            error,
          );
        }

        setIsListening(false);

        return;
      }

      // ----------------------------------------
      // CHECK PERMISSION
      // ----------------------------------------

      try {
        const permission =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();

        console.log(
          "[Speech] Permission:",
          permission,
        );

        if (!permission.granted) {
          Alert.alert(
            "Microphone Access Needed",
            "Please allow microphone and speech recognition access to use voice typing.",
          );

          return;
        }

        // --------------------------------------
        // START RECOGNITION
        // --------------------------------------

        console.log(
          "[Speech] Starting...",
        );

        ExpoSpeechRecognitionModule.start(
          {
            lang: "en-US",

            interimResults: true,

            maxAlternatives: 1,

            continuous: false,

            addsPunctuation: true,
          },
        );
      } catch (error) {
        console.error(
          "[Speech] Start error:",
          error,
        );

        setIsListening(false);

        Alert.alert(
          "Voice Typing Error",
          "Unable to start voice typing. Please check your microphone permission.",
        );
      }
    };

  return (
    <View>
      {/* ====================================== */}
      {/* LISTENING INDICATOR */}
      {/* ====================================== */}

      {isListening ? (
        <View
          style={styles.listeningRow}
        >
          <Ionicons
            name="mic"
            size={RF(13)}
            color={Colors.primary}
          />

          <Text
            style={
              styles.listeningText
            }
          >
            Listening...
          </Text>

          <View
            style={
              styles.listeningDot
            }
          />
        </View>
      ) : null}

      {/* ====================================== */}
      {/* INPUT BAR */}
      {/* ====================================== */}

      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, hp(0.8)) },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={
            disabled
              ? "Waiting for astrologer to join..."
              : "Type a message..."
          }
          placeholderTextColor="#9ca3af"
          value={text}
          onChangeText={
            handleChangeText
          }
          editable={!disabled}
          multiline={true}
          textAlignVertical="center"
          returnKeyType="send"
          onSubmitEditing={
            handleSend
          }
        />

        {/* ================================== */}
        {/* MICROPHONE */}
        {/* ================================== */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.micBtn,

            isListening &&
              styles.micBtnActive,

            disabled &&
              styles.micButtonDisabled,
          ]}
          onPress={
            handleMicPress
          }
          disabled={disabled}
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
                ? Colors.white
                : Colors.primary
            }
          />
        </TouchableOpacity>

        {/* ================================== */}
        {/* SEND */}
        {/* ================================== */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.sendButton,

            (disabled ||
              !text.trim()) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={
            disabled ||
            !text.trim()
          }
        >
          <Ionicons
            name="send"
            size={RF(18)}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      minHeight: hp(7),

      paddingHorizontal: wp(
        2.5,
      ),

      paddingVertical: hp(
        0.8,
      ),

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        Colors.white,

      borderTopWidth: 1,

      borderTopColor:
        "#f2f2f2",
    },

    input: {
      flex: 1,

      minHeight: hp(5),

      maxHeight: hp(14),

      borderWidth: 1,

      borderColor:
        "#e5e7eb",

      borderRadius: wp(6),

      paddingHorizontal:
        wp(3.5),

      paddingVertical: hp(
        1,
      ),

      fontSize: RF(11),

      color:
        Colors.darkBrown,

      fontWeight: "700",
    },

    micBtn: {
      width: wp(10),

      height: wp(10),

      borderRadius: wp(5),

      backgroundColor:
        "#fff1e8",

      alignItems: "center",

      justifyContent:
        "center",

      marginLeft: wp(2),
    },

    micBtnActive: {
      backgroundColor:
        "#dc2626",
    },

    micButtonDisabled: {
      opacity: 0.5,
    },

    sendButton: {
      width: wp(10),

      height: wp(10),

      borderRadius: wp(5),

      backgroundColor:
        Colors.primary,

      justifyContent:
        "center",

      alignItems: "center",

      marginLeft: wp(2),
    },

    sendButtonDisabled: {
      opacity: 0.5,
    },

    listeningRow: {
      height: hp(3.5),

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        wp(4),

      backgroundColor:
        Colors.white,
    },

    listeningText: {
      marginLeft: wp(
        1.5,
      ),

      fontSize: RF(10),

      color:
        Colors.primary,

      fontWeight: "600",
    },

    listeningDot: {
      width: wp(2),

      height: wp(2),

      borderRadius:
        wp(1),

      backgroundColor:
        Colors.primary,

      marginLeft: wp(1.5),
    },
  });