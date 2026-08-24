import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { BASE_URL } from "../../config/api";

import { hp, RF, wp } from "../../utils/responsive";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/ProfileApi";

const ORANGE = "#ff6a00";
const GREEN = "#22a855";
const RED = "#ef4444";

const initialForm = {
  name: "",
  username: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  country: "",
  experience: "",
  toolsUsed: "",
  dob: "",
  birthTime: "",
  birthPlace: "",
  availability: "",
  shortBio: "",
  about: "",
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://ui-avatars.com/api/?name=User&background=fff1e8&color=ff6a00";
  }

  if (imagePath.startsWith("http://")) {
    return imagePath.replace("http://", "https://");
  }

  if (imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
};

export default function EditProfile() {
  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Gallery permission is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) return;

      setSelectedProfilePic({
        uri: asset.uri,
        name: asset.fileName || asset.uri.split("/").pop() || "profile.jpg",
        type: asset.mimeType || "image/jpeg",
      });
    } catch (error) {
      console.log("IMAGE PICK ERROR:", error);
      alert("Unable to select image.");
    }
  };

  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const getSavedUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userData");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          console.log("EDIT PROFILE USER:", parsedUser);

          setUserId(parsedUser?.id || null);
        }
      } catch (error) {
        console.log("GET USER ERROR:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    getSavedUser();
  }, []);

  const {
    data: profile,
    isLoading: profileLoading,
    isFetching,
    isError,
    error: profileError,
    refetch,
  } = useGetProfileQuery(userId, {
    skip: !userId,
  });

  const [updateProfile, { isLoading: updatingProfile }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (!profile) return;

    setFormData({
      name: profile?.name || "",
      username: profile?.username || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      city: profile?.city || "",
      state: profile?.state || "",
      country: profile?.country || "",
      experience: profile?.experience ? String(Number(profile.experience)) : "",
      toolsUsed: profile?.toolsUsed || "",
      dob: profile?.dob || "",
      birthTime: profile?.birthTime || "",
      birthPlace: profile?.birthPlace || "",
      availability: profile?.availability || "",
      shortBio: profile?.shortBio || "",
      about: profile?.about || "",
    });
  }, [profile]);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const getLocation = () => {
    return [formData.city, formData.state, formData.country]
      .filter(Boolean)
      .join(", ");
  };

  const handleRefresh = async () => {
    if (!userId) return;

    try {
      await refetch();
    } catch (error) {
      console.log("PROFILE REFRESH ERROR:", error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!formData.username.trim()) {
      alert("Please enter your username.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return false;
    }

    if (!formData.experience.trim()) {
      alert("Please enter your experience.");
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    if (!validateForm()) return;

    const payload = {
      userId,

      name: formData.name.trim(),
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),

      city: formData.city.trim() || null,
      state: formData.state.trim() || null,
      country: formData.country.trim() || null,

      experience: formData.experience.trim(),
      toolsUsed: formData.toolsUsed.trim() || null,

      dob: formData.dob.trim() || null,
      birthTime: formData.birthTime.trim() || null,
      birthPlace: formData.birthPlace.trim() || null,

      availability: formData.availability.trim() || null,
      shortBio: formData.shortBio.trim() || null,
      about: formData.about.trim() || null,
      profilePic: selectedProfilePic,
    };

    try {
      console.log("UPDATE PROFILE PAYLOAD:", payload);

      const response = await updateProfile(payload).unwrap();

      console.log("UPDATE PROFILE SUCCESS:", response);

      /*
       * API update ke baad latest data immediately fetch hoga.
       * invalidatesTags bhi automatically refresh karega,
       * lekin yahan manual refetch bhi rakha hai.
       */
      await refetch();

      alert("Profile updated successfully.");
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", JSON.stringify(error, null, 2));

      const message =
        error?.data?.message ||
        error?.error ||
        "Profile update failed. Please try again.";

      alert(message);
    }
  };

  if (loadingUser || (!userId && loadingUser)) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>Loading user...</Text>
      </SafeAreaView>
    );
  }

  if (!userId) {
    return (
      <SafeAreaView style={styles.errorScreen}>
        <Ionicons name="person-circle-outline" size={RF(55)} color={ORANGE} />

        <Text style={styles.errorTitle}>User not found</Text>

        <Text style={styles.errorMessage}>
          Your saved login session was not found. Please login again.
        </Text>

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.retryText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.errorScreen}>
        <Ionicons name="alert-circle-outline" size={RF(50)} color={RED} />

        <Text style={styles.errorTitle}>Unable to load profile</Text>

        <Text style={styles.errorMessage}>
          {profileError?.data?.message ||
            profileError?.error ||
            "Please check your internet connection and try again."}
        </Text>

        <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={RF(17)} color="#fff" />

          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

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
              name="information-circle-outline"
              size={RF(20)}
              color={ORANGE}
            />
          </View>
          <Text style={styles.infoDropdownText}>
            These details appear on your public profile.{"\n"}Keep them accurate
            so clients can trust and reach you.
          </Text>
        </View>
      )}

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={hp(12)}
        extraHeight={hp(14)}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            colors={[ORANGE]}
            tintColor={ORANGE}
          />
        }
      >
        <View style={styles.imageBox}>
          <Image
            source={{
              uri: selectedProfilePic?.uri || getImageUrl(profile?.profilePic),
            }}
            style={styles.profileImg}
          />

          <TouchableOpacity
            style={styles.cameraBtn}
            activeOpacity={0.8}
            onPress={pickProfileImage}
          >
            <Ionicons name="camera" size={RF(17)} color="#fff" />
          </TouchableOpacity>
        </View>

        <Input
          label="Full Name"
          value={formData.name}
          icon="person-outline"
          onChangeText={(value) => updateField("name", value)}
        />

        <Input
          label="Username"
          value={formData.username}
          icon="at-outline"
          onChangeText={(value) => updateField("username", value)}
          autoCapitalize="none"
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          icon="call-outline"
          keyboardType="phone-pad"
          onChangeText={(value) => updateField("phone", value)}
        />

        <Input
          label="Email Address"
          value={formData.email}
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => updateField("email", value)}
        />

        <Input
          label="City"
          value={formData.city}
          icon="location-outline"
          placeholder="Enter your city"
          onChangeText={(value) => updateField("city", value)}
        />

        <Input
          label="State"
          value={formData.state}
          icon="map-outline"
          placeholder="Enter your state"
          onChangeText={(value) => updateField("state", value)}
        />

        <Input
          label="Country"
          value={formData.country}
          icon="earth-outline"
          placeholder="Enter your country"
          onChangeText={(value) => updateField("country", value)}
        />

        <Input
          label="Location"
          value={getLocation()}
          icon="navigate-outline"
          editable={false}
          placeholder="City, State, Country"
        />

        <Input
          label="Experience"
          value={formData.experience}
          icon="ribbon-outline"
          keyboardType="decimal-pad"
          placeholder="Enter experience in years"
          onChangeText={(value) => updateField("experience", value)}
        />

        <Input
          label="Tools Used"
          value={formData.toolsUsed}
          icon="star-outline"
          placeholder="Enter tools used"
          onChangeText={(value) => updateField("toolsUsed", value)}
        />

        <Input
          label="Date of Birth"
          value={formData.dob}
          icon="calendar-outline"
          placeholder="YYYY-MM-DD"
          onChangeText={(value) => updateField("dob", value)}
        />

        <Input
          label="Time of Birth"
          value={formData.birthTime}
          icon="time-outline"
          placeholder="Example: 10:30 AM"
          onChangeText={(value) => updateField("birthTime", value)}
        />

        <Input
          label="Place of Birth"
          value={formData.birthPlace}
          icon="earth-outline"
          placeholder="Enter your place of birth"
          onChangeText={(value) => updateField("birthPlace", value)}
        />

        <Input
          label="Availability"
          value={formData.availability}
          icon="alarm-outline"
          placeholder="Example: 1 PM to 6 PM"
          onChangeText={(value) => updateField("availability", value)}
        />

        <Input
          label="Short Bio"
          value={formData.shortBio}
          icon="document-text-outline"
          placeholder="Write a short bio"
          onChangeText={(value) => updateField("shortBio", value)}
        />

        <Text style={styles.aboutLabel}>About Me</Text>

        <View style={styles.aboutBox}>
          <TextInput
            value={formData.about}
            onChangeText={(value) => updateField("about", value)}
            multiline
            placeholder="Tell clients about yourself"
            placeholderTextColor="#999"
            style={styles.aboutInput}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.saveBtn, updatingProfile && styles.disabledBtn]}
          disabled={updatingProfile}
          onPress={handleUpdateProfile}
        >
          {updatingProfile ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.saveText}>Update Profile</Text>

              <Ionicons
                name="checkmark-circle-outline"
                size={RF(19)}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const Input = ({
  label,
  value,
  icon,
  placeholder,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputBox, !editable && styles.disabledInputBox]}>
        <Ionicons name={icon} size={RF(16)} color={ORANGE} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: hp(6.5),
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    // fontFamily: Typography?.bold,
    left: 4,
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
  scroll: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(2),
    paddingBottom: hp(6),
  },
  imageBox: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    alignSelf: "center",
    marginBottom: hp(2),
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: wp(12),
    backgroundColor: "#fff1e8",
  },
  cameraBtn: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  inputWrapper: {
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: RF(16),
    color: "#374151",
    fontWeight: "800",
    marginBottom: hp(0.6),
    fontFamily: Typography?.bold,
  },
  inputBox: {
    height: hp(5.8),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(2.5),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  disabledInputBox: {
    backgroundColor: "#f5f5f5",
  },
  input: {
    flex: 1,
    marginLeft: wp(2.5),
    fontSize: RF(14),
    color: "#111827",
    fontWeight: "600",
    fontFamily: Typography?.bold,
  },
  aboutLabel: {
    fontSize: RF(12),
    color: "#374151",
    fontWeight: "800",
    marginBottom: hp(0.6),
    fontFamily: Typography?.bold,
  },
  aboutBox: {
    height: hp(13),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(2.5),
    backgroundColor: "#fff",
    padding: wp(2.5),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  aboutInput: {
    flex: 1,
    fontSize: RF(11),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  saveBtn: {
    height: hp(6),
    borderRadius: wp(2),
    backgroundColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },
  saveText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  disabledBtn: {
    opacity: 0.65,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: RF(11),
    marginTop: hp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(8),
  },
  errorTitle: {
    color: "#111827",
    fontSize: RF(17),
    fontWeight: "900",
    marginTop: hp(1),
    fontFamily: Typography?.bold,
  },
  errorMessage: {
    color: "#6b7280",
    fontSize: RF(10),
    textAlign: "center",
    lineHeight: hp(1.9),
    marginTop: hp(0.8),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  retryBtn: {
    minHeight: hp(5),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    paddingHorizontal: wp(5),
    marginTop: hp(2),
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
});
