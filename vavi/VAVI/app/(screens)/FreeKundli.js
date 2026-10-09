import { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

import DatePickerModal from "../../components/common/DatePickerModal";
import TimePickerModal from "../../components/common/TimePickerModal";
import StatePickerModal from "../../components/common/StatePickerModal";

import { useGetFullKundliMutation } from "../../redux/KundliApi";

import {
  useDeleteSavedKundliMutation,
  useGetSavedKundliQuery,
  useSaveKundliMutation,
} from "../../redux/SaveKundliApi";

import {
  DEFAULT_COORDINATES,
  getCoordinatesForPlace,
} from "../../utils/cityCoordinates";

export default function FreeKundli() {
  // ==================================================
  // TABS
  // ==================================================

  const [activeTab, setActiveTab] = useState("new");

  // ==================================================
  // FORM STATE
  // ==================================================

  const [name, setName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [coordinates, setCoordinates] =
    useState(DEFAULT_COORDINATES);
  const [unknownTime, setUnknownTime] = useState(false);
  const [language, setLanguage] = useState("hi");
  const [asOfDate, setAsOfDate] = useState("");

  // ==================================================
  // MODALS
  // ==================================================

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);
  const [showAsOfPicker, setShowAsOfPicker] = useState(false);

  // ==================================================
  // KUNDLI API
  // ==================================================

  const [
    getFullKundli,
    {
      isLoading: generating,
    },
  ] = useGetFullKundliMutation();

  // ==================================================
  // SAVE KUNDLI API
  // ==================================================

  const [
    saveKundli,
    {
      isLoading: saving,
    },
  ] = useSaveKundliMutation();

  const [
    deleteSavedKundli,
    {
      isLoading: deleting,
    },
  ] = useDeleteSavedKundliMutation();

  const {
    data: savedData,
    isLoading: savedLoading,
    refetch: refetchSavedKundli,
  } = useGetSavedKundliQuery();

  // ==================================================
  // DOB FORMAT FOR UI
  // API: YYYY-MM-DD
  // UI : DD:MM:YYYY
  // ==================================================

  const formatDobForUI = (date) => {
    if (!date) {
      return "";
    }

    const value = String(date).trim();

    const dashParts = value.split("-");

    if (
      dashParts.length === 3 &&
      dashParts[0].length === 4
    ) {
      const [year, month, day] = dashParts;

      return `${String(day).padStart(2, "0")}:${String(
        month
      ).padStart(2, "0")}:${year}`;
    }

    const colonParts = value.split(":");

    if (
      colonParts.length === 3 &&
      colonParts[2].length === 4
    ) {
      const [day, month, year] = colonParts;

      return `${String(day).padStart(2, "0")}:${String(
        month
      ).padStart(2, "0")}:${year}`;
    }

    return value;
  };

  // ==================================================
  // DOB FORMAT FOR API
  // ==================================================

  const formatDobForApi = (date) => {
    if (!date) {
      return "";
    }

    const value = String(date).trim();

    // YYYY-MM-DD
    const dashParts = value.split("-");

    if (
      dashParts.length === 3 &&
      dashParts[0].length === 4
    ) {
      const [year, month, day] = dashParts;

      return `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }

    // DD:MM:YYYY
    const colonParts = value.split(":");

    if (
      colonParts.length === 3 &&
      colonParts[2].length === 4
    ) {
      const [day, month, year] = colonParts;

      return `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }

    // DD-MM-YYYY
    if (
      dashParts.length === 3 &&
      dashParts[2].length === 4
    ) {
      const [day, month, year] = dashParts;

      return `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }

    return value;
  };

  // ==================================================
  // AS OF DATE/TIME
  // Used for Dasha + Gochar calculation
  // ==================================================

  const getCurrentAsOf = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
      now.getSeconds()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
  };

  const formatAsOfForApi = (dateValue) => {
    if (!dateValue) return getCurrentAsOf();
    const formattedDate = formatDobForApi(dateValue);
    if (!formattedDate) return getCurrentAsOf();

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${formattedDate}T${hours}:${minutes}:${seconds}+05:30`;
  };

  // ==================================================
  // NORMALIZE GENDER
  // ==================================================

  const normalizeGender = (value) => {
    const genderValue = String(value || "")
      .trim()
      .toLowerCase();

    if (
      genderValue === "female" ||
      genderValue === "महिला" ||
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
  // GET API DATA
  // ==================================================

  const getApiData = (response) => {
    if (
      response &&
      typeof response === "object" &&
      response.data &&
      typeof response.data === "object"
    ) {
      return {
        ...response,
        ...response.data,
      };
    }

    return response || {};
  };

  // ==================================================
  // GET USER DETAILS
  // ==================================================

  const getUserDetails = (response) => {
    return (
      response?.user_details ||
      response?.data?.user_details ||
      {}
    );
  };

  // ==================================================
  // PREPARE SAVE PAYLOAD
  // ==================================================

  const createSavePayload = (
    response,
    payload,
    resolvedCoords
  ) => {
    const userDetails = getUserDetails(response);

    return {
      name:
        userDetails?.name ||
        payload?.name ||
        "User",

      relation: "Self",

      gender: normalizeGender(
        userDetails?.gender ||
          payload?.gender ||
          "MALE"
      ),

      dob:
        formatDobForApi(
          userDetails?.dob ||
            payload?.dob
        ) || "2000-01-01",

      tob:
        userDetails?.tob ||
        payload?.tob ||
        "12:00:00",

      birthPlace:
        userDetails?.birthPlace ||
        payload?.birthPlace ||
        payload?.city ||
        "Delhi",

      latitude:
        userDetails?.latitude ??
        payload?.latitude ??
        resolvedCoords.latitude,

      longitude:
        userDetails?.longitude ??
        payload?.longitude ??
        resolvedCoords.longitude,

      timezone:
        userDetails?.timezone ||
        payload?.timezone ||
        "Asia/Kolkata",

      isDefault: true,

      // IMPORTANT:
      // Complete response of Kundli API
      apiResponse: response,
    };
  };

  // ==================================================
  // SAVE KUNDLI
  // ==================================================

  const saveGeneratedKundli = async (
    response,
    payload,
    resolvedCoords
  ) => {
    try {
      const savePayload = createSavePayload(
        response,
        payload,
        resolvedCoords
      );

      console.log(
        "========================================"
      );

      console.log(
        "💾 SAVE KUNDLI PAYLOAD"
      );

      console.log(
        JSON.stringify(
          savePayload,
          null,
          2
        )
      );

      console.log(
        "========================================"
      );

      const saveResponse =
        await saveKundli(
          savePayload
        ).unwrap();

      console.log(
        "========================================"
      );

      console.log(
        "✅ KUNDLI SAVED SUCCESSFULLY"
      );

      console.log(
        JSON.stringify(
          saveResponse,
          null,
          2
        )
      );

      console.log(
        "========================================"
      );

      return saveResponse;
    } catch (error) {
      console.log(
        "========================================"
      );

      console.log(
        "❌ SAVE KUNDLI ERROR"
      );

      console.log(
        "STATUS:",
        error?.status
      );

      console.log(
        "DATA:",
        error?.data
      );

      console.log(
        "ERROR:",
        error
      );

      console.log(
        "========================================"
      );

      return null;
    }
  };

  // ==================================================
  // CREATE KUNDLI PAYLOAD
  // ==================================================

  const createKundliPayload = (
    customPayload
  ) => {
    const isCustomData =
      customPayload &&
      typeof customPayload === "object" &&
      !customPayload.nativeEvent &&
      customPayload.name;

    let resolvedCoords;

    if (isCustomData) {
      const place =
        customPayload.city ||
        customPayload.birthPlace ||
        "Delhi";

      const placeCoordinates =
        getCoordinatesForPlace(place);

      resolvedCoords = {
        latitude:
          customPayload.latitude ??
          placeCoordinates.latitude,

        longitude:
          customPayload.longitude ??
          placeCoordinates.longitude,

        timezone: "Asia/Kolkata",
      };

      const payload = {
        ...customPayload,

        name:
          customPayload.name ||
          "User",

        gender:
          customPayload.gender ||
          "MALE",

        dob:
          formatDobForApi(
            customPayload.dob
          ),

        tob:
          customPayload.tob ||
          "12:00:00",

        city:
          customPayload.city ||
          customPayload.birthPlace ||
          "Delhi",

        birthPlace:
          customPayload.birthPlace ||
          customPayload.city ||
          "Delhi",

        latitude:
          resolvedCoords.latitude,

        longitude:
          resolvedCoords.longitude,

        timezone: "Asia/Kolkata",

        la:
          customPayload.la ||
          language ||
          "hi",

        // Reference date/time for Dasha + Gochar
        asOf:
          customPayload.asOf
            ? formatAsOfForApi(customPayload.asOf)
            : asOfDate
            ? formatAsOfForApi(asOfDate)
            : getCurrentAsOf(),
      };

      return {
        payload,
        resolvedCoords,
        isCustomData: true,
      };
    }

    const placeCoordinates =
      getCoordinatesForPlace(
        birthPlace || "Delhi"
      );

    resolvedCoords = {
      latitude:
        coordinates?.latitude ??
        placeCoordinates.latitude,

      longitude:
        coordinates?.longitude ??
        placeCoordinates.longitude,

      timezone: "Asia/Kolkata",
    };

    const payload = {
      name:
        name.trim() || "User",

      gender:
        gender || "MALE",

      dob:
        formatDobForApi(dob) ||
        "2000-01-01",

      tob:
        unknownTime
          ? "12:00:00"
          : birthTime || "12:00:00",

      city:
        birthPlace.trim() ||
        "Delhi",

      birthPlace:
        birthPlace.trim() ||
        "Delhi",

      latitude:
        resolvedCoords.latitude,

      longitude:
        resolvedCoords.longitude,

      timezone:
        "Asia/Kolkata",

      la:
        language || "hi",

      // Reference date/time for Dasha + Gochar
      asOf: asOfDate ? formatAsOfForApi(asOfDate) : getCurrentAsOf(),
    };

    return {
      payload,
      resolvedCoords,
      isCustomData: false,
    };
  };

  // ==================================================
  // PREPARE KUNDLI SCREEN DATA
  // ==================================================

  const prepareKundliScreenData = (
    response,
    payload,
    resolvedCoords
  ) => {
    const basePayload =
      getApiData(response);

    const userDetails =
      getUserDetails(response);

    return {
      ...basePayload,

      asOf:
        userDetails?.asOf ||
        basePayload?.asOf ||
        payload?.asOf,

      dob:
        userDetails?.dob ||
        basePayload?.dob ||
        payload?.dob,

      tob:
        userDetails?.tob ||
        basePayload?.tob ||
        payload?.tob,

      city:
        userDetails?.birthPlace ||
        basePayload?.city ||
        payload?.city,

      birthPlace:
        userDetails?.birthPlace ||
        basePayload?.birthPlace ||
        payload?.birthPlace,

      latitude:
        userDetails?.latitude ??
        basePayload?.latitude ??
        resolvedCoords.latitude,

      longitude:
        userDetails?.longitude ??
        basePayload?.longitude ??
        resolvedCoords.longitude,

      timezone:
        userDetails?.timezone ||
        basePayload?.timezone ||
        payload?.timezone ||
        "Asia/Kolkata",

      gender:
        userDetails?.gender ||
        basePayload?.gender ||
        payload?.gender,

      name:
        userDetails?.name ||
        basePayload?.name ||
        payload?.name,

      la:
        userDetails?.language ||
        basePayload?.la ||
        basePayload?.language ||
        payload?.la ||
        language ||
        "hi",
    };
  };

  // ==================================================
  // OPEN KUNDLI SCREEN
  // ==================================================

  const openKundliScreen = (
    kundliData
  ) => {
    router.push({
      pathname: "/kundli",
      params: {
        data: JSON.stringify(
          kundliData
        ),
      },
    });
  };

  // ==================================================
  // GENERATE NEW KUNDLI
  // ==================================================

  const handleGenerateKundli =
    async (customPayload) => {
      try {
        const {
          payload,
          resolvedCoords,
          isCustomData,
        } =
          createKundliPayload(
            customPayload
          );

        console.log(
          "========================================"
        );

        console.log(
          "🔮 KUNDLI API REQUEST"
        );

        console.log(
          "PAYLOAD:",
          JSON.stringify(
            payload,
            null,
            2
          )
        );

        console.log(
          "========================================"
        );

        // ==========================================
        // GENERATE KUNDLI
        // ==========================================

        const response =
          await getFullKundli(
            payload
          ).unwrap();

        console.log(
          "========================================"
        );

        console.log(
          "✅ KUNDLI API RESPONSE"
        );

        console.log(
          JSON.stringify(
            response,
            null,
            2
          )
        );

        console.log(
          "========================================"
        );

        // ==========================================
        // SAVE ONLY NEW KUNDLI
        // ==========================================
        //
        // When opening an existing saved Kundli,
        // customPayload is used.
        //
        // Therefore we don't save it again.
        //
        // ==========================================

        if (!isCustomData) {
          await saveGeneratedKundli(
            response,
            payload,
            resolvedCoords
          );
        }

        // ==========================================
        // PREPARE DATA FOR KUNDLI SCREEN
        // ==========================================

        const kundliPayload =
          prepareKundliScreenData(
            response,
            payload,
            resolvedCoords
          );

        // ==========================================
        // OPEN KUNDLI
        // ==========================================

        openKundliScreen(
          kundliPayload
        );
      } catch (error) {
        console.log(
          "========================================"
        );

        console.log(
          "❌ KUNDLI GENERATION ERROR"
        );

        console.log(
          "ERROR:",
          error
        );

        console.log(
          "STATUS:",
          error?.status
        );

        console.log(
          "DATA:",
          error?.data
        );

        console.log(
          "========================================"
        );
      }
    };

  // ==================================================
  // OPEN SAVED KUNDLI
  // ==================================================

  const handleOpenSavedKundli =
    async (item) => {
      try {
        console.log(
          "========================================"
        );

        console.log(
          "📂 OPEN SAVED KUNDLI"
        );

        console.log(
          "ITEM:",
          JSON.stringify(
            item,
            null,
            2
          )
        );

        console.log(
          "========================================"
        );

        // ==================================================
        // BEST CASE:
        // Saved API response is already available.
        //
        // Open it directly.
        // No need to calculate again.
        // No duplicate save.
        // ==================================================

        if (
          item?.apiResponse &&
          typeof item.apiResponse ===
            "object"
        ) {
          const savedResponse =
            item.apiResponse;

          const userDetails =
            getUserDetails(
              savedResponse
            );

          const savedPayload = {
            name:
              userDetails?.name ||
              item.name ||
              "User",

            gender:
              userDetails?.gender ||
              item.gender ||
              "MALE",

            dob:
              formatDobForApi(
                userDetails?.dob ||
                  item.dob
              ),

            tob:
              userDetails?.tob ||
              item.tob ||
              "12:00:00",

            city:
              userDetails?.birthPlace ||
              item.city ||
              item.birthPlace ||
              "Delhi",

            birthPlace:
              userDetails?.birthPlace ||
              item.birthPlace ||
              item.city ||
              "Delhi",

            latitude:
              userDetails?.latitude ??
              item.latitude ??
              DEFAULT_COORDINATES.latitude,

            longitude:
              userDetails?.longitude ??
              item.longitude ??
              DEFAULT_COORDINATES.longitude,

            timezone:
              userDetails?.timezone ||
              item.timezone ||
              "Asia/Kolkata",

            la:
              language || "hi",
          };

          const savedCoords = {
            latitude:
              savedPayload.latitude,

            longitude:
              savedPayload.longitude,

            timezone:
              savedPayload.timezone,
          };

          const kundliPayload =
            prepareKundliScreenData(
              savedResponse,
              savedPayload,
              savedCoords
            );

          openKundliScreen(
            kundliPayload
          );

          return;
        }

        // ==================================================
        // FALLBACK:
        // If apiResponse is not stored,
        // regenerate from saved birth details.
        // ==================================================

        const place =
          item?.city ||
          item?.birthPlace ||
          "Delhi";

        const placeCoordinates =
          getCoordinatesForPlace(
            place
          );

        const savedPayload = {
          name:
            item?.name ||
            "User",

          gender:
            normalizeGender(
              item?.gender
            ),

          dob:
            formatDobForApi(
              item?.dob
            ),

          tob:
            item?.tob ||
            "12:00:00",

          city: place,

          birthPlace: place,

          latitude:
            item?.latitude ??
            placeCoordinates.latitude,

          longitude:
            item?.longitude ??
            placeCoordinates.longitude,

          timezone:
            item?.timezone ||
            "Asia/Kolkata",

          la:
            language || "hi",
        };

        await handleGenerateKundli(
          savedPayload
        );
      } catch (error) {
        console.log(
          "❌ OPEN SAVED KUNDLI ERROR:",
          error
        );
      }
    };

  // ==================================================
  // DELETE SAVED KUNDLI
  // ==================================================

  const handleDeleteSaved =
    async (id) => {
      try {
        if (!id) {
          console.log(
            "❌ Saved Kundli ID missing"
          );

          return;
        }

        console.log(
          "🗑️ DELETE SAVED KUNDLI:",
          id
        );

        await deleteSavedKundli(
          id
        ).unwrap();

        await refetchSavedKundli();
      } catch (error) {
        console.log(
          "❌ DELETE SAVED KUNDLI ERROR:",
          error
        );

        console.log(
          "STATUS:",
          error?.status
        );

        console.log(
          "DATA:",
          error?.data
        );
      }
    };

  // ==================================================
  // DISPLAY TIME
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

    return `${String(hour12).padStart(
      2,
      "0"
    )}:${minute} ${period}`;
  };

  // ==================================================
  // SAVED DATA NORMALIZATION
  // ==================================================

  const savedKundlis =
    Array.isArray(
      savedData?.data
    )
      ? savedData.data
      : Array.isArray(
          savedData
        )
      ? savedData
      : Array.isArray(
          savedData?.kundalis
        )
      ? savedData.kundalis
      : [];

  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        extraHeight={120}
        contentContainerStyle={
          styles.content
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={RF(24)}
              color={
                Colors.darkBrown
              }
            />
          </TouchableOpacity>

          <Text
            style={styles.logo}
          >
            VAVI
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                "/Notification"
              )
            }
          >
            <Ionicons
              name="notifications-outline"
              size={RF(23)}
              color={
                Colors.darkBrown
              }
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            HEADING
        ================================================== */}

        <Text
          style={styles.heading}
        >
          Free Kundli Online
        </Text>

        {/* ==================================================
            LANGUAGE
        ================================================== */}

        <View
          style={
            styles.languageWrapper
          }
        >
          <Text
            style={
              styles.languageLabel
            }
          >
            Kundli Language
          </Text>

          <View
            style={
              styles.languageContainer
            }
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setLanguage("hi")
              }
              style={[
                styles.languageButton,
                language === "hi" &&
                  styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === "hi" &&
                    styles.languageButtonTextActive,
                ]}
              >
                हिन्दी
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setLanguage("en")
              }
              style={[
                styles.languageButton,
                language === "en" &&
                  styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === "en" &&
                    styles.languageButtonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================================================
            TABS
        ================================================== */}

        <View
          style={
            styles.tabContainer
          }
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setActiveTab("saved")
            }
            style={[
              styles.tab,
              activeTab === "saved" &&
                styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" &&
                  styles.activeTabText,
              ]}
            >
              Saved Kundli
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setActiveTab("new")
            }
            style={[
              styles.tab,
              activeTab === "new" &&
                styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "new" &&
                  styles.activeTabText,
              ]}
            >
              New Kundli
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================================
            NEW KUNDLI
        ================================================== */}

        {activeTab === "new" && (
          <View
            style={
              styles.formCard
            }
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <Ionicons
                name="document-text-outline"
                size={RF(20)}
                color={
                  Colors.primary
                }
              />

              <View
                style={{
                  marginLeft: wp(2),
                }}
              >
                <Text
                  style={
                    styles.cardTitle
                  }
                >
                  Enter Details
                </Text>

                <Text
                  style={
                    styles.cardSubtitle
                  }
                >
                  Please enter your birth
                  details to generate Kundli
                </Text>
              </View>
            </View>

            {/* NAME */}

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
                style={styles.input}
              />
            </View>

            {/* GENDER */}

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
                  value: "MALE",
                  icon: "male",
                },
                {
                  label: "Female",
                  value: "FEMALE",
                  icon: "female",
                },
                {
                  label: "Others",
                  value: "OTHER",
                  icon: "person",
                },
              ].map((item) => {
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
                        item.value
                      )
                    }
                  >
                    <Ionicons
                      name={
                        item.icon
                      }
                      size={RF(16)}
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
              })}
            </View>

            {/* DOB */}

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
                  true
                )
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
                        dob
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

            {/* BIRTH TIME */}

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
                unknownTime
              }
              onPress={() =>
                setShowTimePicker(
                  true
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

            {/* UNKNOWN TIME */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.checkboxRow
              }
              onPress={() => {
                const next =
                  !unknownTime;

                setUnknownTime(
                  next
                );

                if (next) {
                  setBirthTime(
                    "12:00:00"
                  );
                } else {
                  setBirthTime(
                    ""
                  );
                }
              }}
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

            {/* BIRTH PLACE */}

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
                  true
                )
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

            {/* CALCULATION / AS OF DATE */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: hp(1.4),
                marginBottom: hp(0.8),
              }}
            >
              <Text
                style={{
                  color: Colors.darkBrown,
                  fontSize: RF(13),
                  fontWeight: "500",
                }}
              >
                Calculation Date (asOf)
              </Text>

              {asOfDate ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAsOfDate("")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text
                    style={{
                      fontSize: RF(11),
                      color: Colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    Reset to Today
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.pickerInputContainer}
              onPress={() => setShowAsOfPicker(true)}
            >
              <View style={styles.pickerInputLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(18)}
                  color={Colors.primary}
                />

                <Text
                  style={[
                    styles.pickerInputText,
                    !asOfDate && styles.placeholderText,
                  ]}
                >
                  {asOfDate
                    ? formatDobForUI(asOfDate)
                    : "Today (Present / Current Date)"}
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={RF(16)}
                color="#888"
              />
            </TouchableOpacity>

            {/* CONTINUE */}

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={
                generating ||
                saving
              }
              style={[
                styles.continueButton,
                (generating ||
                  saving) && {
                  opacity: 0.7,
                },
              ]}
              onPress={() =>
                handleGenerateKundli()
              }
            >
              {generating ||
              saving ? (
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
                    style={[
                      styles.continueText,
                      {
                        marginLeft:
                          wp(2),
                      },
                    ]}
                  >
                    {generating
                      ? "Generating..."
                      : "Saving..."}
                  </Text>
                </View>
              ) : (
                <Text
                  style={
                    styles.continueText
                  }
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ==================================================
            SAVED KUNDLI
        ================================================== */}

        {activeTab === "saved" && (
          <View>
            {savedLoading ? (
              <View
                style={
                  styles.loadingContainer
                }
              >
                <ActivityIndicator
                  size="large"
                  color={
                    Colors.primary
                  }
                />

                <Text
                  style={
                    styles.loadingText
                  }
                >
                  Loading Saved Kundli...
                </Text>
              </View>
            ) : savedKundlis.length ===
              0 ? (
              <View
                style={
                  styles.emptyContainer
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={RF(45)}
                  color="#CCC"
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Saved Kundli
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Generate a new Kundli
                  to save it here.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.emptyButton
                  }
                  onPress={() =>
                    setActiveTab(
                      "new"
                    )
                  }
                >
                  <Text
                    style={
                      styles.emptyButtonText
                    }
                  >
                    Create New Kundli
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={
                  savedKundlis
                }
                keyExtractor={(
                  item,
                  index
                ) =>
                  String(
                    item?.id ??
                      item?._id ??
                      index
                  )
                }
                scrollEnabled={
                  false
                }
                renderItem={({
                  item,
                }) => (
                  <TouchableOpacity
                    activeOpacity={
                      0.85
                    }
                    onPress={() =>
                      handleOpenSavedKundli(
                        item
                      )
                    }
                    style={
                      styles.savedCard
                    }
                  >
                    <View
                      style={
                        styles.savedTopRow
                      }
                    >
                      <View
                        style={
                          styles.userSection
                        }
                      >
                        <View
                          style={
                            styles.avatar
                          }
                        >
                          <Ionicons
                            name="person"
                            size={RF(
                              26
                            )}
                            color="#FFF"
                          />
                        </View>

                        <View
                          style={
                            styles.userInfo
                          }
                        >
                          <Text
                            style={
                              styles.userName
                            }
                            numberOfLines={
                              1
                            }
                          >
                            {item?.name ||
                              "User"}

                            <Text
                              style={
                                styles.gender
                              }
                            >
                              {" "}
                              (
                              {item?.gender ||
                                "MALE"}
                              )
                            </Text>
                          </Text>

                          <Text
                            style={
                              styles.dateText
                            }
                          >
                            {formatDobForUI(
                              item?.dob
                            )}
                            {item?.tob
                              ? `, ${item.tob}`
                              : ""}
                          </Text>

                          <Text
                            style={
                              styles.placeText
                            }
                            numberOfLines={
                              1
                            }
                          >
                            {item?.birthPlace ||
                              item?.city ||
                              "Delhi"}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={
                          styles.actionRow
                        }
                      >
                        {/* VIEW */}

                        <TouchableOpacity
                          activeOpacity={
                            0.8
                          }
                          style={
                            styles.actionButton
                          }
                          onPress={() =>
                            handleOpenSavedKundli(
                              item
                            )
                          }
                        >
                          <Ionicons
                            name="eye-outline"
                            size={RF(
                              16
                            )}
                            color={
                              Colors.primary
                            }
                          />
                        </TouchableOpacity>

                        {/* DELETE */}

                        <TouchableOpacity
                          activeOpacity={
                            0.8
                          }
                          disabled={
                            deleting
                          }
                          style={
                            styles.actionButton
                          }
                          onPress={() =>
                            handleDeleteSaved(
                              item?.id ??
                                item?._id
                            )
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={RF(
                              16
                            )}
                            color="#F44336"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={
                        styles.divider
                      }
                    />

                    <View
                      style={
                        styles.detailRow
                      }
                    >
                      {/* DATE */}

                      <View
                        style={
                          styles.detailItem
                        }
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={RF(
                            17
                          )}
                          color={
                            Colors.primary
                          }
                        />

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Date
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                        >
                          {formatDobForUI(
                            item?.dob
                          ) ||
                            "--"}
                        </Text>
                      </View>

                      {/* TIME */}

                      <View
                        style={
                          styles.detailItem
                        }
                      >
                        <Ionicons
                          name="time-outline"
                          size={RF(
                            17
                          )}
                          color={
                            Colors.primary
                          }
                        />

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Time
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                        >
                          {item?.tob ||
                            "--"}
                        </Text>
                      </View>

                      {/* PLACE */}

                      <View
                        style={
                          styles.detailItem
                        }
                      >
                        <Ionicons
                          name="location-outline"
                          size={RF(
                            17
                          )}
                          color={
                            Colors.primary
                          }
                        />

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Place
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                          numberOfLines={
                            1
                          }
                        >
                          {item?.birthPlace ||
                            item?.city ||
                            "--"}
                        </Text>
                      </View>

                      {/* GENDER */}

                      <View
                        style={
                          styles.detailItem
                        }
                      >
                        <Ionicons
                          name="male-female-outline"
                          size={RF(
                            17
                          )}
                          color={
                            Colors.primary
                          }
                        />

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Gender
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                        >
                          {item?.gender ||
                            "--"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </KeyboardAwareScrollView>

      {/* ==================================================
          DATE PICKER
      ================================================== */}

      <DatePickerModal
        visible={
          showDobPicker
        }
        onClose={() =>
          setShowDobPicker(
            false
          )
        }
        onSelectDate={(date) => {
          const apiDate =
            formatDobForApi(
              date
            );

          console.log(
            "DOB selected:",
            date
          );

          console.log(
            "DOB for API:",
            apiDate
          );

          console.log(
            "DOB for UI:",
            formatDobForUI(
              apiDate
            )
          );

          setDob(
            apiDate
          );

          setShowDobPicker(
            false
          );
        }}
        initialDate={dob}
      />

      {/* ==================================================
          AS OF / CALCULATION DATE PICKER
      ================================================== */}

      <DatePickerModal
        visible={showAsOfPicker}
        title="Select Calculation Date (asOf)"
        maxDate={new Date(2030, 11, 31)}
        onClose={() => setShowAsOfPicker(false)}
        onSelectDate={(date) => {
          const apiDate = formatDobForApi(date);
          console.log("asOf selected:", date, "API format:", apiDate);
          setAsOfDate(apiDate);
          setShowAsOfPicker(false);
        }}
        initialDate={asOfDate || new Date().toISOString().split("T")[0]}
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
            false
          )
        }
        onSelectTime={(time) => {
          console.log(
            "Time received in FreeKundli:",
            time
          );

          setBirthTime(
            time
          );

          setUnknownTime(
            false
          );

          setShowTimePicker(
            false
          );
        }}
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
            false
          )
        }
        onSelectState={(
          place,
          item
        ) => {
          setBirthPlace(
            place
          );

          if (
            item &&
            item.latitude != null &&
            item.longitude != null
          ) {
            setCoordinates({
              latitude:
                Number(
                  item.latitude
                ),
              longitude:
                Number(
                  item.longitude
                ),
            });
          } else {
            setCoordinates(
              getCoordinatesForPlace(
                place
              )
            );
          }

          setShowPlacePicker(
            false
          );
        }}
        selectedState={
          birthPlace
        }
        title="Select Birth Place"
      />
    </SafeAreaView>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#FFF8F4",
    },

    content: {
      paddingHorizontal:
        wp(4),
      paddingBottom:
        hp(12),
    },

    header: {
      marginTop:
        hp(1),
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    logo: {
      fontSize:
        RF(28),
      color:
        Colors.primary,
      fontWeight:
        "700",
      letterSpacing: 1,
    },

    heading: {
      marginTop:
        hp(2),
      textAlign:
        "center",
      color:
        Colors.darkBrown,
      fontSize:
        RF(20),
      fontWeight:
        "600",
    },

    languageWrapper: {
      marginTop:
        hp(1.5),
      alignItems:
        "center",
    },

    languageLabel: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(12),
      fontWeight:
        "600",
      marginBottom:
        hp(0.7),
    },

    languageContainer: {
      flexDirection:
        "row",
      backgroundColor:
        "#FFF",
      borderRadius:
        wp(8),
      borderWidth: 1,
      borderColor:
        Colors.primary,
      overflow:
        "hidden",
      width:
        wp(48),
      height:
        hp(5.2),
    },

    languageButton: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#FFF",
    },

    languageButtonActive: {
      backgroundColor:
        Colors.primary,
    },

    languageButtonText: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(13),
      fontWeight:
        "500",
    },

    languageButtonTextActive: {
      color:
        "#FFF",
      fontWeight:
        "700",
    },

    tabContainer: {
      flexDirection:
        "row",
      backgroundColor:
        "#FFF",
      borderRadius:
        wp(8),
      borderWidth: 1,
      borderColor:
        Colors.primary,
      overflow:
        "hidden",
      marginTop:
        hp(2),
      marginBottom:
        hp(2),
    },

    tab: {
      flex: 1,
      height:
        hp(6),
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    activeTab: {
      backgroundColor:
        Colors.primary,
    },

    tabText: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(14),
      fontWeight:
        "500",
    },

    activeTabText: {
      color:
        "#FFF",
      fontWeight:
        "600",
    },

    formCard: {
      backgroundColor:
        "#FFF",
      borderRadius:
        wp(4),
      padding:
        wp(4),
      shadowColor:
        "#000",
      shadowOpacity:
        0.06,
      shadowRadius:
        10,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 3,
    },

    cardHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom:
        hp(2),
    },

    cardTitle: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(15),
      fontWeight:
        "600",
    },

    cardSubtitle: {
      marginTop:
        hp(0.2),
      color:
        "#888",
      fontSize:
        RF(11),
      fontWeight:
        "400",
    },

    label: {
      marginBottom:
        hp(0.8),
      marginTop:
        hp(1.4),
      color:
        Colors.darkBrown,
      fontSize:
        RF(13),
      fontWeight:
        "500",
    },

    inputContainer: {
      height:
        hp(6.5),
      borderWidth: 1,
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
        "400",
    },

    genderRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom:
        hp(0.5),
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
        1.2,
      borderColor:
        "#E7E7E7",
      backgroundColor:
        "#FAFAFA",
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal:
        wp(2),
    },

    genderOptionActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    genderOptionText: {
      marginLeft:
        wp(1.5),
      fontSize:
        RF(13),
      fontWeight:
        "500",
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
      height:
        hp(6.5),
      borderWidth: 1,
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
      color:
        Colors.darkBrown,
      fontSize:
        RF(14),
      fontWeight:
        "500",
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
      opacity: 0.6,
    },

    checkboxRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop:
        hp(1.8),
    },

    checkboxText: {
      marginLeft:
        wp(2),
      color:
        "#666",
      fontSize:
        RF(12),
      fontWeight:
        "400",
    },

    continueButton: {
      height:
        hp(6),
      backgroundColor:
        Colors.primary,
      borderRadius:
        wp(3),
      justifyContent:
        "center",
      alignItems:
        "center",
      marginTop:
        hp(3),
    },

    continueText: {
      color:
        "#FFF",
      fontSize:
        RF(15),
      fontWeight:
        "600",
    },

    loadingRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    loadingContainer: {
      minHeight:
        hp(25),
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    loadingText: {
      marginTop:
        hp(1.5),
      color:
        "#777",
      fontSize:
        RF(13),
    },

    emptyContainer: {
      backgroundColor:
        "#FFF",
      borderRadius:
        wp(4),
      padding:
        wp(7),
      alignItems:
        "center",
      justifyContent:
        "center",
      minHeight:
        hp(35),
      elevation: 2,
    },

    emptyTitle: {
      marginTop:
        hp(1.5),
      color:
        Colors.darkBrown,
      fontSize:
        RF(17),
      fontWeight:
        "600",
    },

    emptyText: {
      marginTop:
        hp(0.8),
      color:
        "#888",
      fontSize:
        RF(12),
      textAlign:
        "center",
    },

    emptyButton: {
      marginTop:
        hp(2),
      backgroundColor:
        Colors.primary,
      borderRadius:
        wp(3),
      paddingHorizontal:
        wp(6),
      paddingVertical:
        hp(1.4),
    },

    emptyButtonText: {
      color:
        "#FFF",
      fontSize:
        RF(13),
      fontWeight:
        "600",
    },

    savedCard: {
      backgroundColor:
        "#FFF",
      borderRadius:
        wp(4),
      padding:
        wp(4),
      marginBottom:
        hp(2),
      shadowColor:
        "#000",
      shadowOpacity:
        0.06,
      shadowRadius:
        10,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 3,
    },

    savedTopRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    userSection: {
      flexDirection:
        "row",
      flex: 1,
      alignItems:
        "center",
    },

    avatar: {
      width:
        wp(16),
      height:
        wp(16),
      borderRadius:
        wp(8),
      backgroundColor:
        Colors.primary,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    userInfo: {
      flex: 1,
      marginLeft:
        wp(3),
    },

    userName: {
      color:
        Colors.darkBrown,
      fontSize:
        RF(15),
      fontWeight:
        "600",
    },

    gender: {
      color:
        Colors.primary,
      fontSize:
        RF(12),
      fontWeight:
        "500",
    },

    dateText: {
      marginTop:
        hp(0.4),
      color:
        "#666",
      fontSize:
        RF(12),
      fontWeight:
        "400",
    },

    placeText: {
      marginTop:
        hp(0.3),
      color:
        "#888",
      fontSize:
        RF(12),
      fontWeight:
        "400",
    },

    actionRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    actionButton: {
      width:
        wp(10),
      height:
        wp(10),
      borderRadius:
        wp(5),
      backgroundColor:
        "#FFF5EF",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginLeft:
        wp(2),
    },

    divider: {
      height: 1,
      backgroundColor:
        "#EEEEEE",
      marginVertical:
        hp(2),
    },

    detailRow: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
    },

    detailItem: {
      width: "48%",
      backgroundColor:
        "#FAFAFA",
      borderRadius:
        wp(3),
      paddingVertical:
        hp(1.3),
      paddingHorizontal:
        wp(3),
      marginBottom:
        hp(1.5),
    },

    detailLabel: {
      marginTop:
        hp(0.6),
      color:
        "#888",
      fontSize:
        RF(11),
      fontWeight:
        "500",
    },

    detailValue: {
      marginTop:
        hp(0.4),
      color:
        Colors.darkBrown,
      fontSize:
        RF(13),
      fontWeight:
        "600",
    },
  });