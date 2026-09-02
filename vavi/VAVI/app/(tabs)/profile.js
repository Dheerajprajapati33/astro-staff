import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import { resolveImageUri } from "../../config/api";
import Colors from "../../constants/Colors";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/updateApi";
import { hp, RF, wp } from "../../utils/responsive";
import { performClientLogoutVavi } from "../../utils/auth";

const ProfileRow = ({
  icon,
  label,
  value,
  onChangeText,
  rightIcon,
  keyboardType = "default",
  editable = true,
  maxLength,
  autoCapitalize = "sentences",
}) => {
  return (
    <View style={[styles.row, !editable && styles.disabledRow]}>
      <View style={styles.leftSection}>
        <Ionicons name={icon} size={RF(16)} color={Colors.primary} />

        <Text style={styles.label}>{label}</Text>
      </View>

      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={label}
        placeholderTextColor="#999"
        editable={editable}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </View>
  );
};

export default function Profile() {
  const segments = useSegments();
  const [hasToken, setHasToken] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [hasFilledProfile, setHasFilledProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        const parsed = raw ? JSON.parse(raw) : null;
        if (isMounted) setHasToken(!!parsed?.token);
      } catch (_e) {
        if (isMounted) setHasToken(false);
      }
    };
    checkToken();
    return () => {
      isMounted = false;
    };
  }, [segments]);

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    isError: isProfileError,
    error: profileError,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: !hasToken || segments?.[0] === "(auth)",
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profile = profileResponse?.data;

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFullName(profile?.name || "");
    setUsername(profile?.username || "");
    setEmail(profile?.email || "");
    setPhone(profile?.phone || "");
    setDob(profile?.dob || "");
    setBirthTime(profile?.birthTime || "");
    setBirthPlace(profile?.birthPlace || "");
    setCity(profile?.city || "");
    setStateName(profile?.state || "");
    setCountry(profile?.country || "");

    setHasFilledProfile(true);
  }, [profile]);

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Profile picture select karne ke liye gallery permission allow karein.",
        );

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert("Image Error", "Selected image read nahi ho paayi.");

        return;
      }

      setSelectedImage({
        uri: asset.uri,
        name: asset.fileName || `profile-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    } catch (error) {
      console.log("Image picker error:", error);

      Alert.alert(
        "Gallery Error",
        "Gallery open nahi ho paayi. Please try again.",
      );
    }
  };

  const validateProfile = () => {
    if (!fullName.trim()) {
      Alert.alert("Name Required", "Please enter your full name.");

      return false;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");

      return false;
    }

    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10 digit phone number.",
      );

      return false;
    }

    if (dob.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
      Alert.alert(
        "Invalid Date",
        "Date of birth YYYY-MM-DD format me enter karein.",
      );

      return false;
    }

    if (birthTime.trim() && !/^\d{2}:\d{2}(:\d{2})?$/.test(birthTime.trim())) {
      Alert.alert(
        "Invalid Time",
        "Birth time HH:MM ya HH:MM:SS format me enter karein.",
      );

      return false;
    }

    return true;
  };

  const appendFormValue = (formData, fieldName, value) => {
    const cleanValue =
      value === null || value === undefined ? "" : String(value).trim();

    formData.append(fieldName, cleanValue);
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    try {
      const formData = new FormData();

      appendFormValue(formData, "name", fullName);

      appendFormValue(formData, "username", username);

      appendFormValue(formData, "email", email);

      /*
       * Phone login identity hoti hai, isliye ise normally
       * update request me bhejna avoid kiya gaya hai.
       *
       * Backend phone update support karta ho to ye uncomment karo:
       *
       * appendFormValue(formData, "phone", phone);
       */

      appendFormValue(formData, "dob", dob);

      appendFormValue(formData, "birthTime", birthTime);

      appendFormValue(formData, "birthPlace", birthPlace);

      appendFormValue(formData, "city", city);

      appendFormValue(formData, "state", stateName);

      appendFormValue(formData, "country", country);

      if (selectedImage?.uri) {
        formData.append("profilePic", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.name || "profile.jpg",
        });
      }

      console.log("Submitting profile update...");
      const res = await updateProfile(formData).unwrap();
      console.log("Profile update response:", res);

      Alert.alert("Success", "Profile updated successfully!");
      setSelectedImage(null);
      refetch();
    } catch (error) {
      console.log("Profile update error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "Profile update failed. Please try again.";

      Alert.alert("Update Failed", errorMessage);
    }
  };

  const performLogout = async () => {
    try {
      await performClientLogoutVavi();
    } catch (error) {
      console.log("Logout error:", error);

      Alert.alert("Logout Failed", "Logout nahi ho paaya. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  const getProfileImageSource = () => {
    if (selectedImage?.uri) {
      return {
        uri: selectedImage.uri,
      };
    }

    if (profile?.profilePic) {
      return resolveImageUri(profile.profilePic);
    }

    return null;
  };

  const profileImageSource = getProfileImageSource();

  if (isProfileLoading && !hasFilledProfile) {
    return (
      <SafeAreaView style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={Colors.primary} />

        <Text style={styles.loaderText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (isProfileError && !hasFilledProfile) {
    return (
      <SafeAreaView style={styles.errorScreen}>
        <Ionicons
          name="alert-circle-outline"
          size={RF(45)}
          color={Colors.primary}
        />

        <Text style={styles.errorTitle}>Profile load nahi ho paayi</Text>

        <Text style={styles.errorMessage}>
          {profileError?.data?.message ||
            profileError?.error ||
            "Please check your internet connection."}
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isProfileFetching && !isProfileLoading}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons size={RF(22)} color={Colors.darkBrown} />

          <TouchableOpacity onPress={() => router.push("/(auth)/profile")}>
            <Ionicons
              name="settings-outline"
              size={RF(24)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>
        </View>

        {/* Profile picture */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profileImageSource ? (
              <Image
                source={profileImageSource}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={RF(55)} color="#FFFFFF" />
            )}

            {isUpdating ? (
              <View style={styles.avatarLoader}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={handlePickImage}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            <Ionicons name="create" size={RF(14)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>{fullName || "Your Profile"}</Text>

        <Text style={styles.profilePhone}>{phone ? `+91 ${phone}` : ""}</Text>

        {/* Personal information */}
        <View style={styles.sectionHeader}>
          <View style={styles.orangeBar} />

          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <ProfileRow
          icon="person-outline"
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <ProfileRow
          icon="at-outline"
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <ProfileRow
          icon="mail-outline"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ProfileRow
          icon="call-outline"
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
          editable={false}
          rightIcon={
            <Ionicons
              name="lock-closed-outline"
              size={RF(15)}
              color="#999999"
            />
          }
        />

        <ProfileRow
          icon="calendar-outline"
          label="Date of Birth"
          value={dob}
          onChangeText={setDob}
          keyboardType="numbers-and-punctuation"
          rightIcon={
            <Ionicons name="calendar-outline" size={RF(16)} color="#999999" />
          }
        />

        <Text style={styles.fieldHint}>Date format: YYYY-MM-DD</Text>

        <ProfileRow
          icon="time-outline"
          label="Birth Time"
          value={birthTime}
          onChangeText={setBirthTime}
          keyboardType="numbers-and-punctuation"
          rightIcon={
            <Ionicons name="time-outline" size={RF(16)} color="#999999" />
          }
        />

        <Text style={styles.fieldHint}>Time format: HH:MM:SS</Text>

        <ProfileRow
          icon="location-outline"
          label="Birth Place"
          value={birthPlace}
          onChangeText={setBirthPlace}
        />

        {/* Address information */}

        <View style={styles.sectionHeader}>
          <View style={styles.orangeBar} />

          <Text style={styles.sectionTitle}>Address Information</Text>
        </View>

        <ProfileRow
          icon="business-outline"
          label="City"
          value={city}
          onChangeText={setCity}
        />

        <ProfileRow
          icon="map-outline"
          label="State"
          value={stateName}
          onChangeText={setStateName}
        />

        <ProfileRow
          icon="earth-outline"
          label="Country"
          value={country}
          onChangeText={setCountry}
        />

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, isUpdating && styles.disabledButton]}
          onPress={handleUpdateProfile}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          {isUpdating ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={styles.saveText}>Updating Profile...</Text>
            </>
          ) : (
            <>
              <Ionicons name="save-outline" size={RF(17)} color="#FFFFFF" />

              <Text style={styles.saveText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={RF(18)}
            color={Colors.primary}
          />

          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: wp(3),
    paddingBottom: hp(3),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1),
  },

  logo: {
    width: wp(26),
    height: hp(6),
  },

  avatarContainer: {
    alignSelf: "center",
    marginTop: hp(2),
    position: "relative",
  },

  avatar: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#D8173E",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  avatarLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  editBtn: {
    position: "absolute",
    right: -wp(1),
    bottom: wp(0.5),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  profileName: {
    marginTop: hp(1),
    textAlign: "center",
    fontWeight: "600",
    fontSize: RF(16),
    color: Colors.darkBrown,
  },

  profilePhone: {
    marginTop: hp(0.3),
    marginBottom: hp(2),
    textAlign: "center",
    fontWeight: "400",
    fontSize: RF(12),
    color: Colors.textGray,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },

  orangeBar: {
    width: 3,
    height: hp(2),
    backgroundColor: Colors.primary,
    marginRight: wp(2),
  },

  sectionTitle: {
    fontWeight: "800",
    fontSize: RF(16),
    color: Colors.darkBrown,
  },

  row: {
    minHeight: hp(6),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
  },

  disabledRow: {
    backgroundColor: "#F5F5F5",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(30),
  },

  label: {
    marginLeft: wp(2),
    fontSize: RF(16),
    color: "#999999",
    fontWeight: "600",
  },

  input: {
    flex: 1,
    minHeight: hp(5.5),
    paddingVertical: 0,
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  disabledInput: {
    color: "#777777",
  },

  rightIcon: {
    marginLeft: wp(2),
  },

  fieldHint: {
    marginTop: -hp(0.5),
    marginBottom: hp(1),
    marginLeft: wp(33),
    fontSize: RF(9),
    color: "#999999",
    fontWeight: "400",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1.5),
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#F2D6BA",
  },

  addressTitle: {
    marginHorizontal: wp(2),
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "600",
  },

  saveBtn: {
    minHeight: hp(6),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1),
  },

  saveText: {
    color: "#FFFFFF",
    marginLeft: wp(2),
    fontWeight: "600",
    fontSize: RF(14),
  },

  disabledButton: {
    opacity: 0.65,
  },

  logoutBtn: {
    height: hp(6),
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: wp(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1.5),
  },

  logoutText: {
    color: Colors.primary,
    marginLeft: wp(2),
    fontWeight: "600",
    fontSize: RF(14),
  },

  loaderScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  loaderText: {
    marginTop: hp(1.5),
    fontSize: RF(14),
    color: Colors.textGray,
    fontWeight: "400",
  },

  errorScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
    backgroundColor: "#FAFAFA",
  },

  errorTitle: {
    marginTop: hp(1.5),
    fontSize: RF(17),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  errorMessage: {
    marginTop: hp(1),
    textAlign: "center",
    fontSize: RF(13),
    color: Colors.textGray,
    fontWeight: "400",
  },

  retryButton: {
    marginTop: hp(2),
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.3),
    borderRadius: wp(3),
    backgroundColor: Colors.primary,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: RF(14),
    fontWeight: "600",
  },
});
