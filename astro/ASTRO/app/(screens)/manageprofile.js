import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../../config/api";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetProfileQuery } from "../../redux/ProfileApi";

const ORANGE = "#ff6a00";
const GREEN = "#22a855";
const RED = "#ef4444";

const showValue = (value, fallback = "Not added") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

const formatExperience = (value) => {
  if (!value) return "Not added";

  const number = Number(value);

  if (Number.isNaN(number)) return value;

  return `${number} ${number === 1 ? "Year" : "Years"}`;
};

const formatLocation = (profile) => {
  const location = [profile?.city, profile?.state, profile?.country].filter(
    Boolean,
  );

  return location.length ? location.join(", ") : "Not added";
};

const formatDate = (date) => {
  if (!date) return "Not added";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProfileImage = (url) => {
  if (!url) {
    return "https://ui-avatars.com/api/?name=Astrologer&background=fff1e8&color=ff6a00";
  }

  if (url.startsWith("http")) {
    return url.replace("http://", "https://");
  }

  return `${BASE_URL}/${url}`;
};

export default function ManageProfile() {
  const [showInfo, setShowInfo] = useState(false);

  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetProfileQuery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView style={styles.errorScreen}>
        <Ionicons name="alert-circle-outline" size={RF(48)} color={RED} />

        <Text style={styles.errorTitle}>Unable to load profile</Text>

        <Text style={styles.errorMessage}>
          {error?.data?.message ||
            error?.error ||
            "Please check your internet connection and try again."}
        </Text>

        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Ionicons name="refresh" size={RF(17)} color="#fff" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const personalInformation = [
    ["person-outline", "Full Name", showValue(profile?.name)],
    ["at-outline", "Username", showValue(profile?.username)],
    ["call-outline", "Phone Number", showValue(profile?.phone)],
    ["mail-outline", "Email Address", showValue(profile?.email)],
    ["location-outline", "Location", formatLocation(profile)],
  ];

  const aboutInformation = [
    ["ribbon-outline", "Experience", formatExperience(profile?.experience)],
    ["reader-outline", "About Me", showValue(profile?.about)],
    ["document-text-outline", "Short Bio", showValue(profile?.shortBio)],
    ["time-outline", "Availability", showValue(profile?.availability)],
  ];

  const consultationInformation = [
    [
      "chatbubble-ellipses-outline",
      "Chat Price",
      profile?.chatPrice ? `₹${profile.chatPrice}/min` : "Not set",
    ],
    [
      "call-outline",
      "Call Price",
      profile?.callPrice ? `₹${profile.callPrice}/min` : "Not set",
    ],
    [
      "globe-outline",
      "Internet Call Price",
      profile?.internetCallPrice
        ? `₹${profile.internetCallPrice}/min`
        : "Not set",
    ],
    ["people-outline", "Followers", showValue(profile?.followersCount, "0")],
    [
      "star-outline",
      "Rating",
      `${showValue(profile?.rating, "0.0")} (${showValue(
        profile?.totalReviews,
        "0",
      )} reviews)`,
    ],
  ];

  const otherInformation = [
    ["calendar-outline", "Date of Birth", formatDate(profile?.dob)],
    ["time-outline", "Time of Birth", showValue(profile?.birthTime)],
    ["earth-outline", "Place of Birth", showValue(profile?.birthPlace)],
    ["construct-outline", "Tools Used", showValue(profile?.toolsUsed)],
    ["person-circle-outline", "Role", showValue(profile?.role)],
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Manage Profile</Text>
          <Text style={styles.headerSub}>Update your profile information</Text>
        </View>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowInfo((prev) => !prev)}
        >
          <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {showInfo && (
        <View style={styles.infoDropdown}>
          <View style={styles.infoDropdownIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={RF(20)}
              color={ORANGE}
            />
          </View>
          <Text style={styles.infoDropdownText}>
            Your profile is visible to clients on the app.{"\n"}Keep it accurate
            and up to date to build trust.
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[ORANGE]}
            tintColor={ORANGE}
          />
        }
      >
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.imageWrap}>
              <Image
                source={{
                  uri: getProfileImage(profile?.profilePic),
                }}
                style={styles.profileImg}
              />
            </View>

            <View style={styles.profileContent}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{showValue(profile?.name)}</Text>

                {profile?.verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={RF(15)}
                    color={GREEN}
                  />
                )}
              </View>

              <Text style={styles.username}>
                @{showValue(profile?.username, "username")}
              </Text>

              <Text style={styles.role}>
                {profile?.role === "astrologer"
                  ? "Astrologer"
                  : showValue(profile?.role)}
              </Text>

              {/* <View
                style={[
                  styles.verifiedBadge,
                  !profile?.verified && styles.pendingBadge,
                ]}
              >
                <Ionicons
                  name={
                    profile?.verified
                      ? "checkmark-circle-outline"
                      : "time-outline"
                  }
                  size={RF(12)}
                  color={profile?.verified ? GREEN : ORANGE}
                />

                <Text
                  style={[
                    styles.verifiedText,
                    !profile?.verified && styles.pendingText,
                  ]}
                >
                  {profile?.verified
                    ? "Profile Verified"
                    : "Verification Pending"}
                </Text>
              </View> */}
            </View>
          </View>

          <View style={styles.statusRow}>
            <StatusBadge title="Chat" active={profile?.isChatOnline} />

            <StatusBadge title="Call" active={profile?.isCallOnline} />

            <StatusBadge title="Live" active={profile?.isLive} />
          </View>

          <View style={styles.lockBox}>
            <View style={styles.lockLeft}>
              <Ionicons
                name="information-circle-outline"
                size={RF(20)}
                color={ORANGE}
              />

              <Text style={styles.lockText}>
                You can update your profile information.{"\n"}
                Price can be updated from the Update Price screen.
              </Text>
            </View>

            <View style={styles.priceLocked}>
              <Ionicons
                name="lock-closed-outline"
                size={RF(13)}
                color={ORANGE}
              />

              <Text style={styles.priceLockedText}>Price Locked</Text>
            </View>
          </View>
        </View>

        <Section
          title="Personal Information"
          icon="person"
          editColor={ORANGE}
          data={personalInformation}
        />

        <Section
          title="About You"
          icon="document-text"
          editColor={GREEN}
          data={aboutInformation}
        />

        <Section
          title="Consultation Details"
          icon="cash-outline"
          editColor={ORANGE}
          data={consultationInformation}
          showEdit={false}
        />

        <Section
          title="Other Information"
          icon="information-circle"
          editColor={GREEN}
          data={otherInformation}
        />

        <View style={styles.bottomCard}>
          <View style={styles.shieldBox}>
            <Ionicons name="shield-checkmark" size={RF(32)} color={GREEN} />
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.bottomTitle}>
              Your profile helps clients trust you.
            </Text>

            <Text style={styles.bottomText}>
              Keep your information updated to get more clients.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatusBadge = ({ title, active }) => (
  <View
    style={[
      styles.statusBadge,
      active ? styles.onlineBadge : styles.offlineBadge,
    ]}
  >
    <View
      style={[
        styles.statusDot,
        {
          backgroundColor: active ? GREEN : "#9ca3af",
        },
      ]}
    />

    <Text
      style={[
        styles.statusBadgeText,
        {
          color: active ? GREEN : "#6b7280",
        },
      ]}
    >
      {title}: {active ? "Online" : "Offline"}
    </Text>
  </View>
);

const Section = ({ title, icon, data, editColor, showEdit = true }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <View
          style={[styles.sectionIcon, { backgroundColor: `${editColor}15` }]}
        >
          <Ionicons name={icon} size={RF(15)} color={editColor} />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {showEdit && (
        <TouchableOpacity
          style={[styles.editBtn, { borderColor: editColor }]}
          onPress={() =>
            router.push({
              pathname: "/editprofile",
            })
          }
        >
          <Ionicons name="pencil-outline" size={RF(11)} color={editColor} />

          <Text style={[styles.editText, { color: editColor }]}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>

    {data.map((item, index) => (
      <InfoRow
        key={`${item[1]}-${index}`}
        item={item}
        isLast={index === data.length - 1}
      />
    ))}
  </View>
);

const InfoRow = ({ item, isLast }) => (
  <View style={[styles.infoRow, !isLast && styles.rowBorder]}>
    <View style={styles.infoLeft}>
      <View style={styles.infoIcon}>
        <Ionicons name={item[0]} size={RF(14)} color={GREEN} />
      </View>

      <Text style={styles.infoLabel}>{item[1]}</Text>
    </View>

    <Text numberOfLines={3} style={styles.infoValue}>
      {item[2]}
    </Text>
  </View>
);
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: wp(4),
  },
  header: {
    height: hp(7),
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitleWrap: {
    marginLeft: wp(3),
  },
  helpButton: {
    marginLeft: "auto",
  },
  infoDropdown: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(0.5),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  infoDropdownIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  infoDropdownText: {
    flex: 1,
    fontSize: RF(10.5),
    color: "#4b5563",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  loaderScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  loaderText: {
    marginTop: hp(1.2),
    color: "#6b7280",
    fontSize: RF(11),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  errorScreen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(8),
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: hp(1.5),
    color: "#111827",
    fontSize: RF(17),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  errorMessage: {
    marginTop: hp(0.8),
    color: "#6b7280",
    fontSize: RF(10),
    textAlign: "center",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  retryBtn: {
    marginTop: hp(2),
    height: hp(5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    backgroundColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },

  retryText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  profileContent: {
    flex: 1,
  },

  username: {
    color: ORANGE,
    fontSize: RF(9.5),
    marginTop: hp(0.25),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  pendingBadge: {
    backgroundColor: "#fff5e8",
  },

  pendingText: {
    color: ORANGE,
  },

  statusRow: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },

  statusBadge: {
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.9),
    flexDirection: "row",
    alignItems: "center",
  },

  onlineBadge: {
    backgroundColor: "#ecfff2",
  },

  offlineBadge: {
    backgroundColor: "#f3f4f6",
  },

  statusDot: {
    width: wp(1.7),
    height: wp(1.7),
    borderRadius: wp(1),
    marginRight: wp(1),
  },

  statusBadgeText: {
    fontSize: RF(9.5),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  bottomContent: {
    flex: 1,
  },
  headerTitle: {
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  headerSub: {
    color: "#607086",
    fontSize: RF(9.5),
    marginTop: hp(0.3),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  scroll: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(3),
    paddingTop: hp(2),
    paddingBottom: hp(3),
    minHeight: hp(92),
  },
  profileCard: {
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3.2),
  },
  imageWrap: {
    width: wp(19),
    height: wp(19),
    borderRadius: wp(9.5),
    marginRight: wp(4),
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: wp(9.5),
  },
  cameraBtn: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  name: {
    fontSize: RF(18),
    color: "#1f2937",
    fontWeight: "800",
    //fontFamily: Typography?.bold,
  },
  role: {
    fontSize: RF(14),
    color: "#4b5563",
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  verifiedBadge: {
    marginTop: hp(1),
    alignSelf: "flex-start",
    backgroundColor: "#eaffef",
    borderRadius: wp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  verifiedText: {
    color: GREEN,
    fontSize: RF(9.5),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  lockBox: {
    backgroundColor: "#fff8ef",
    borderTopWidth: 1,
    borderTopColor: "#ffe1cc",
    padding: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lockLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lockText: {
    fontSize: RF(9.5),
    color: "#374151",
    marginLeft: wp(2),
    lineHeight: hp(1.6),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  priceLocked: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(2),
  },
  priceLockedText: {
    color: ORANGE,
    fontSize: RF(9.5),
    fontWeight: "800",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    marginBottom: hp(1.5),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeader: {
    height: hp(5),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  sectionTitle: {
    fontSize: RF(16),
    color: "#1f2937",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  editBtn: {
    borderWidth: 1,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
  },
  editText: {
    fontSize: RF(10),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  infoRow: {
    minHeight: hp(5.4),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(34),
  },
  infoIcon: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "#eaffef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  infoLabel: {
    fontSize: RF(14),
    color: "#374151",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: RF(14),
    color: "#4b5563",
    lineHeight: hp(1.7) * 1.35,
    marginRight: wp(1.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  bottomCard: {
    borderWidth: 1,
    borderColor: "#d8f3df",
    borderRadius: wp(3),
    backgroundColor: "#f3fff6",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  shieldBox: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "#eaffef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  bottomTitle: {
    fontSize: RF(12),
    color: GREEN,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  bottomText: {
    fontSize: RF(9.5),
    color: "#374151",
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
