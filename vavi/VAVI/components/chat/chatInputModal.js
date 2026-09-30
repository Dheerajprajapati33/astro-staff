import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

import DatePickerModal from "../common/DatePickerModal";
import TimePickerModal from "../common/TimePickerModal";
import StatePickerModal from "../common/StatePickerModal";

import {
  DEFAULT_COORDINATES,
  getCoordinatesForPlace,
} from "../../utils/cityCoordinates";

export default function ChatInputModal({
  visible,
  onClose,
  onChat,
  astrologerName = "Astrologer",
  loading = false,
  consultationType = "chat",
}) {
  const isCall = consultationType === "call";
  // ==================================================
  // FORM STATE
  // ==================================================

  const [name, setName] =
    useState("");

  const [gender, setGender] =
    useState("MALE");

  const [dob, setDob] =
    useState("");

  const [birthTime, setBirthTime] =
    useState("");

  const [birthPlace, setBirthPlace] =
    useState("");

  const [coordinates, setCoordinates] =
    useState(
      DEFAULT_COORDINATES,
    );

  const [unknownTime, setUnknownTime] =
    useState(false);

  // ==================================================
  // PICKER STATE
  // ==================================================

  const [showDobPicker, setShowDobPicker] =
    useState(false);

  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const [showPlacePicker, setShowPlacePicker] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setName("");
    setGender("MALE");
    setDob("");
    setBirthTime("");
    setBirthPlace("");
    setCoordinates(
      DEFAULT_COORDINATES,
    );
    setUnknownTime(false);
    setShowDobPicker(false);
    setShowTimePicker(false);
    setShowPlacePicker(false);
    setSubmitting(false);
  };

  // ==================================================
  // CLOSE
  // ==================================================

  const handleClose = () => {
    if (submitting || loading) {
      return;
    }

    resetForm();

    onClose?.();
  };

  // ==================================================
  // DOB → UI
  // API: YYYY-MM-DD
  // UI : DD:MM:YYYY
  // ==================================================

  const formatDobForUI = (date) => {
    if (!date) {
      return "";
    }

    const value =
      String(date).trim();

    const dashParts =
      value.split("-");

    // YYYY-MM-DD
    if (
      dashParts.length === 3 &&
      dashParts[0].length === 4
    ) {
      const [
        year,
        month,
        day,
      ] = dashParts;

      return `${String(day).padStart(
        2,
        "0",
      )}:${String(month).padStart(
        2,
        "0",
      )}:${year}`;
    }

    // DD-MM-YYYY
    if (
      dashParts.length === 3 &&
      dashParts[2].length === 4
    ) {
      const [
        day,
        month,
        year,
      ] = dashParts;

      return `${String(day).padStart(
        2,
        "0",
      )}:${String(month).padStart(
        2,
        "0",
      )}:${year}`;
    }

    // DD:MM:YYYY
    const colonParts =
      value.split(":");

    if (
      colonParts.length === 3 &&
      colonParts[2].length === 4
    ) {
      const [
        day,
        month,
        year,
      ] = colonParts;

      return `${String(day).padStart(
        2,
        "0",
      )}:${String(month).padStart(
        2,
        "0",
      )}:${year}`;
    }

    return value;
  };

  // ==================================================
  // DOB → API
  // ==================================================

  const formatDobForApi = (date) => {
    if (!date) {
      return "";
    }

    const value =
      String(date).trim();

    // YYYY-MM-DD
    const dashParts =
      value.split("-");

    if (
      dashParts.length === 3 &&
      dashParts[0].length === 4
    ) {
      const [
        year,
        month,
        day,
      ] = dashParts;

      return `${year}-${String(
        month,
      ).padStart(
        2,
        "0",
      )}-${String(day).padStart(
        2,
        "0",
      )}`;
    }

    // DD-MM-YYYY
    if (
      dashParts.length === 3 &&
      dashParts[2].length === 4
    ) {
      const [
        day,
        month,
        year,
      ] = dashParts;

      return `${year}-${String(
        month,
      ).padStart(
        2,
        "0",
      )}-${String(day).padStart(
        2,
        "0",
      )}`;
    }

    // DD:MM:YYYY
    const colonParts =
      value.split(":");

    if (
      colonParts.length === 3 &&
      colonParts[2].length === 4
    ) {
      const [
        day,
        month,
        year,
      ] = colonParts;

      return `${year}-${String(
        month,
      ).padStart(
        2,
        "0",
      )}-${String(day).padStart(
        2,
        "0",
      )}`;
    }

    return value;
  };

  // ==================================================
  // TIME DISPLAY
  // ==================================================

  const getDisplayTime = () => {
    if (!birthTime) {
      return "Select Birth Time (AM/PM)";
    }

    const parts =
      birthTime.split(":");

    if (parts.length < 2) {
      return birthTime;
    }

    const hour24 =
      Number(parts[0]);

    const minute =
      parts[1];

    let hour12;
    let period;

    if (hour24 === 0) {
      hour12 = 12;
      period = "AM";
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = "AM";
    } else if (hour24 === 12) {
      hour12 = 12;
      period = "PM";
    } else {
      hour12 =
        hour24 - 12;
      period = "PM";
    }

    return `${String(
      hour12,
    ).padStart(
      2,
      "0",
    )}:${minute} ${period}`;
  };

  // ==================================================
  // NORMALIZE GENDER
  // ==================================================

  const normalizeGender = (
    value,
  ) => {
    const genderValue =
      String(value || "")
        .trim()
        .toLowerCase();

    if (
      genderValue ===
        "female" ||
      genderValue ===
        "महिला" ||
      genderValue === "f"
    ) {
      return "FEMALE";
    }

    if (
      genderValue === "other" ||
      genderValue === "others"
    ) {
      return "OTHER";
    }

    return "MALE";
  };

  // ==================================================
  // VALIDATE
  // ==================================================

  const validateForm = () => {
    if (!name.trim()) {
      return {
        valid: false,
        message:
          "Please enter your name.",
      };
    }

    if (!dob) {
      return {
        valid: false,
        message:
          "Please select your date of birth.",
      };
    }

    if (
      !unknownTime &&
      !birthTime
    ) {
      return {
        valid: false,
        message:
          "Please select your birth time or choose 'I don't know my exact time of birth'.",
      };
    }

    if (!birthPlace.trim()) {
      return {
        valid: false,
        message:
          "Please select your birth place.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  };

  // ==================================================
  // CHAT BUTTON
  // ==================================================

  const handleChatPress =
    async () => {
      if (
        submitting ||
        loading
      ) {
        return;
      }

      const validation =
        validateForm();

      if (!validation.valid) {
        // Use simple alert without adding
        // another dependency.
        const {
          Alert,
        } = require("react-native");

        Alert.alert(
          "Required Details",
          validation.message,
        );

        return;
      }

      const apiDob =
        formatDobForApi(dob);

      const finalTime =
        unknownTime
          ? "12:00:00"
          : birthTime ||
            "12:00:00";

      const finalPlace =
        birthPlace.trim();

      const fallbackCoordinates =
        getCoordinatesForPlace(
          finalPlace ||
            "Delhi",
        );

      const latitude =
        coordinates?.latitude ??
        fallbackCoordinates?.latitude;

      const longitude =
        coordinates?.longitude ??
        fallbackCoordinates?.longitude;

      const birthDetails = {
        name:
          name.trim(),

        gender:
          normalizeGender(
            gender,
          ),

        dob:
          apiDob,

        tob:
          finalTime,

        birthPlace:
          finalPlace,

        city:
          finalPlace,

        latitude:
          latitude,

        longitude:
          longitude,

        timezone:
          "Asia/Kolkata",
      };

      if (!isCall) {
        if (!isCall) {
          console.log(
            "[ChatInputModal] Birth details:",
            birthDetails,
          );
        }
      }

      try {
        setSubmitting(true);

        const result =
          await onChat?.(
            birthDetails,
          );

        // Parent returns true when
        // consultation was successfully
        // created.

        if (result === true) {
          resetForm();
        }
      } catch (error) {
        console.log(
          "[ChatInputModal] Chat error:",
          error,
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ==================================================
  // DATE SELECT
  // ==================================================

  const handleDateSelect = (
    date,
  ) => {
    const apiDate =
      formatDobForApi(
        date,
      );

    setDob(apiDate);

    setShowDobPicker(false);
  };

  // ==================================================
  // TIME SELECT
  // ==================================================

  const handleTimeSelect = (
    time,
  ) => {
    setBirthTime(time);

    setUnknownTime(false);

    setShowTimePicker(false);
  };

  // ==================================================
  // PLACE SELECT
  // ==================================================

  const handlePlaceSelect = (
    place,
    item,
  ) => {
    setBirthPlace(place);

    if (
      item &&
      item.latitude != null &&
      item.longitude != null
    ) {
      setCoordinates({
        latitude:
          Number(
            item.latitude,
          ),

        longitude:
          Number(
            item.longitude,
          ),
      });
    } else {
      setCoordinates(
        getCoordinatesForPlace(
          place,
        ),
      );
    }

    setShowPlacePicker(false);
  };

  // ==================================================
  // MODAL
  // ==================================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={
        handleClose
      }
    >
      <KeyboardAvoidingView
        style={
          styles.modalRoot
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* ==================================================
            BACKDROP
        ================================================== */}

        <TouchableOpacity
          activeOpacity={1}
          style={
            styles.backdrop
          }
          onPress={
            handleClose
          }
        />

        {/* ==================================================
            MODAL CARD
        ================================================== */}

        <View
          style={
            styles.modalCard
          }
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <View
            style={
              styles.modalHeader
            }
          >
            <View
              style={
                styles.headerTextContainer
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Birth Details
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
                numberOfLines={1}
              >
                Start {isCall ? "call" : "chat"} with{" "}
                {astrologerName}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.closeButton
              }
              onPress={
                handleClose
              }
              disabled={
                submitting ||
                loading
              }
            >
              <Ionicons
                name="close"
                size={RF(22)}
                color={
                  Colors.darkBrown
                }
              />
            </TouchableOpacity>
          </View>

          {/* ==================================================
              SCROLL CONTENT
          ================================================== */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* ==================================================
                NAME
            ================================================== */}

            <Text
              style={styles.label}
            >
              Name
            </Text>

            <View
              style={
                styles.inputContainer
              }
            >
              <Ionicons
                name="person-outline"
                size={RF(18)}
                color={
                  Colors.primary
                }
              />

              <TextInput
                value={name}
                onChangeText={
                  setName
                }
                placeholder="Enter Name"
                placeholderTextColor="#999"
                style={
                  styles.input
                }
                editable={
                  !submitting &&
                  !loading
                }
              />
            </View>

            {/* ==================================================
                GENDER
            ================================================== */}

            <Text
              style={styles.label}
            >
              Gender
            </Text>

            <View
              style={
                styles.genderRow
              }
            >
              {[
                {
                  label: "Male",
                  value:
                    "MALE",
                  icon: "male",
                },
                {
                  label: "Female",
                  value:
                    "FEMALE",
                  icon: "female",
                },
                {
                  label: "Others",
                  value:
                    "OTHER",
                  icon: "person",
                },
              ].map(
                (item) => {
                  const isSelected =
                    gender ===
                    item.value;

                  return (
                    <TouchableOpacity
                      key={
                        item.value
                      }
                      activeOpacity={
                        0.8
                      }
                      style={[
                        styles.genderOption,
                        isSelected &&
                          styles.genderOptionActive,
                      ]}
                      onPress={() =>
                        setGender(
                          item.value,
                        )
                      }
                      disabled={
                        submitting ||
                        loading
                      }
                    >
                      <Ionicons
                        name={
                          item.icon
                        }
                        size={RF(
                          16,
                        )}
                        color={
                          isSelected
                            ? "#FFF"
                            : Colors.darkBrown
                        }
                      />

                      <Text
                        style={[
                          styles.genderOptionText,
                          isSelected &&
                            styles.genderOptionTextActive,
                        ]}
                      >
                        {
                          item.label
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>

            {/* ==================================================
                DOB
            ================================================== */}

            <Text
              style={styles.label}
            >
              Date of Birth
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.pickerInputContainer
              }
              onPress={() =>
                setShowDobPicker(
                  true,
                )
              }
              disabled={
                submitting ||
                loading
              }
            >
              <View
                style={
                  styles.pickerInputLeft
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={RF(18)}
                  color={
                    Colors.primary
                  }
                />

                <Text
                  style={[
                    styles.pickerInputText,
                    !dob &&
                      styles.placeholderText,
                  ]}
                >
                  {dob
                    ? formatDobForUI(
                        dob,
                      )
                    : "Select Date of Birth"}
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={RF(16)}
                color="#888"
              />
            </TouchableOpacity>

            {/* ==================================================
                BIRTH TIME
            ================================================== */}

            <Text
              style={styles.label}
            >
              Birth Time
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.pickerInputContainer,
                unknownTime &&
                  styles.disabledPicker,
              ]}
              disabled={
                unknownTime ||
                submitting ||
                loading
              }
              onPress={() =>
                setShowTimePicker(
                  true,
                )
              }
            >
              <View
                style={
                  styles.pickerInputLeft
                }
              >
                <Ionicons
                  name="time-outline"
                  size={RF(18)}
                  color={
                    unknownTime
                      ? "#BBB"
                      : Colors.primary
                  }
                />

                <Text
                  style={[
                    styles.pickerInputText,
                    (!birthTime ||
                      unknownTime) &&
                      styles.placeholderText,
                  ]}
                >
                  {unknownTime
                    ? "Time Unknown (12:00 PM)"
                    : getDisplayTime()}
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={RF(16)}
                color="#888"
              />
            </TouchableOpacity>

            {/* ==================================================
                UNKNOWN TIME
            ================================================== */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.checkboxRow
              }
              onPress={() => {
                const next =
                  !unknownTime;

                setUnknownTime(
                  next,
                );

                if (next) {
                  setBirthTime(
                    "12:00:00",
                  );
                } else {
                  setBirthTime(
                    "",
                  );
                }
              }}
              disabled={
                submitting ||
                loading
              }
            >
              <Ionicons
                name={
                  unknownTime
                    ? "checkbox"
                    : "square-outline"
                }
                size={RF(20)}
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.checkboxText
                }
              >
                I don't know my exact
                time of birth
              </Text>
            </TouchableOpacity>

            {/* ==================================================
                BIRTH PLACE
            ================================================== */}

            <Text
              style={styles.label}
            >
              Birth Place
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.pickerInputContainer
              }
              onPress={() =>
                setShowPlacePicker(
                  true,
                )
              }
              disabled={
                submitting ||
                loading
              }
            >
              <View
                style={
                  styles.pickerInputLeft
                }
              >
                <Ionicons
                  name="location-outline"
                  size={RF(18)}
                  color={
                    Colors.primary
                  }
                />

                <Text
                  style={[
                    styles.pickerInputText,
                    !birthPlace &&
                      styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {birthPlace ||
                    "Select Birth Place / State"}
                </Text>
              </View>

              <Ionicons
                name="search-outline"
                size={RF(18)}
                color="#888"
              />
            </TouchableOpacity>

            {/* ==================================================
                CHAT BUTTON
            ================================================== */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.chatButton,
                (submitting ||
                  loading) &&
                  styles.chatButtonDisabled,
              ]}
              onPress={
                handleChatPress
              }
              disabled={
                submitting ||
                loading
              }
            >
              {submitting ||
              loading ? (
                <View
                  style={
                    styles.loadingRow
                  }
                >
                  <ActivityIndicator
                    size="small"
                    color="#FFF"
                  />

                  <Text
                    style={
                      styles.chatButtonText
                    }
                  >
                    Connecting...
                  </Text>
                </View>
              ) : (
                <View
                  style={
                    styles.loadingRow
                  }
                >
                  <Ionicons
                    name={
                      isCall
                        ? "call-outline"
                        : "chatbubble-ellipses-outline"
                    }
                    size={RF(
                      19,
                    )}
                    color="#FFF"
                  />

                  <Text
                    style={[
                      styles.chatButtonText,
                      {
                        marginLeft:
                          wp(2),
                      },
                    ]}
                  >
                    {isCall ? "Call" : "Chat"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View
              style={
                styles.bottomSpace
              }
            />
          </ScrollView>
        </View>

        {/* ==================================================
            DATE PICKER
        ================================================== */}

        <DatePickerModal
          visible={
            showDobPicker
          }
          onClose={() =>
            setShowDobPicker(
              false,
            )
          }
          onSelectDate={
            handleDateSelect
          }
          initialDate={dob}
        />

        {/* ==================================================
            TIME PICKER
        ================================================== */}

        <TimePickerModal
          visible={
            showTimePicker
          }
          onClose={() =>
            setShowTimePicker(
              false,
            )
          }
          onSelectTime={
            handleTimeSelect
          }
          initialTime={
            birthTime
          }
        />

        {/* ==================================================
            PLACE PICKER
        ================================================== */}

        <StatePickerModal
          visible={
            showPlacePicker
          }
          onClose={() =>
            setShowPlacePicker(
              false,
            )
          }
          onSelectState={
            handlePlaceSelect
          }
          selectedState={
            birthPlace
          }
          title="Select Birth Place"
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles =
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent:
        "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(0,0,0,0.45)",
    },

    modalCard: {
      width: "100%",
      maxHeight: "92%",
      backgroundColor:
        "#FFF8F4",
      borderTopLeftRadius:
        wp(6),
      borderTopRightRadius:
        wp(6),
      overflow: "hidden",
    },

    modalHeader: {
      minHeight:
        hp(8),
      backgroundColor:
        Colors.white,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      paddingHorizontal:
        wp(5),
      borderBottomWidth:
        1,
      borderBottomColor:
        "#F0F0F0",
    },

    headerTextContainer: {
      flex: 1,
      paddingRight:
        wp(3),
    },

    modalTitle: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(19),
      fontWeight:
        "800",
    },

    modalSubtitle: {
      marginTop:
        hp(0.4),
      color:
        Colors.textGray,
      fontSize:
        RF(11),
      fontWeight:
        "500",
    },

    closeButton: {
      width:
        wp(10),
      height:
        wp(10),
      borderRadius:
        wp(5),
      backgroundColor:
        "#FFF1E8",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    scrollContent: {
      paddingHorizontal:
        wp(5),
      paddingTop:
        hp(1),
      paddingBottom:
        hp(4),
    },

    label: {
      marginTop:
        hp(1.5),
      marginBottom:
        hp(0.8),
      color:
        Colors.darkBrown,
      fontSize:
        RF(13),
      fontWeight:
        "600",
    },

    inputContainer: {
      height:
        hp(6.3),
      borderWidth:
        1,
      borderColor:
        "#E7E7E7",
      borderRadius:
        wp(3),
      backgroundColor:
        "#FFF",
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal:
        wp(3),
    },

    input: {
      flex: 1,
      marginLeft:
        wp(3),
      color:
        Colors.darkBrown,
      fontSize:
        RF(14),
      fontWeight:
        "500",
    },

    genderRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginHorizontal:
        -wp(1),
    },

    genderOption: {
      flex: 1,
      height:
        hp(5.5),
      marginHorizontal:
        wp(1),
      borderRadius:
        wp(2.5),
      borderWidth:
        1,
      borderColor:
        "#E7E7E7",
      backgroundColor:
        "#FFF",
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    genderOptionActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    genderOptionText: {
      marginLeft:
        wp(1.3),
      fontSize:
        RF(12),
      fontWeight:
        "600",
      color:
        Colors.darkBrown,
    },

    genderOptionTextActive: {
      color:
        "#FFF",
      fontWeight:
        "700",
    },

    pickerInputContainer: {
      minHeight:
        hp(6.3),
      borderWidth:
        1,
      borderColor:
        "#E7E7E7",
      borderRadius:
        wp(3),
      backgroundColor:
        "#FFF",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      paddingHorizontal:
        wp(3),
    },

    pickerInputLeft: {
      flexDirection:
        "row",
      alignItems:
        "center",
      flex: 1,
    },

    pickerInputText: {
      marginLeft:
        wp(3),
      paddingRight:
        wp(2),
      color:
        Colors.darkBrown,
      fontSize:
        RF(13),
      fontWeight:
        "500",
      flex: 1,
    },

    placeholderText: {
      color:
        "#999",
      fontWeight:
        "400",
    },

    disabledPicker: {
      backgroundColor:
        "#F7F7F7",
      borderColor:
        "#EFEFEF",
      opacity: 0.65,
    },

    checkboxRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop:
        hp(1.5),
    },

    checkboxText: {
      flex: 1,
      marginLeft:
        wp(2),
      color:
        "#666",
      fontSize:
        RF(12),
      fontWeight:
        "500",
    },

    chatButton: {
      height:
        hp(6.3),
      marginTop:
        hp(2.5),
      backgroundColor:
        Colors.primary,
      borderRadius:
        wp(3),
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    chatButtonDisabled: {
      opacity: 0.7,
    },

    chatButtonText: {
      color:
        "#FFF",
      fontSize:
        RF(15),
      fontWeight:
        "700",
    },

    loadingRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    bottomSpace: {
      height:
        hp(2),
    },
  });