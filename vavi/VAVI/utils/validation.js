import { Alert } from "react-native";
import { router } from "expo-router";

/**
 * Checks if the user profile contains the required mandatory fields:
 * - name
 * - username
 * - email
 * - dob
 *
 * @param {Object} profile - User profile object from Redux / API
 * @returns {boolean} - true if all 4 fields are valid and non-empty, false otherwise
 */
export const isProfileComplete = (profile) => {
  if (!profile) return false;

  const rawName = profile?.name || profile?.fullName;
  const rawUsername = profile?.username;
  const rawEmail = profile?.email;
  const rawDob = profile?.dob;

  const hasName = typeof rawName === "string" && rawName.trim().length > 0;
  const hasUsername =
    typeof rawUsername === "string" && rawUsername.trim().length > 0;
  const hasEmail =
    typeof rawEmail === "string" &&
    rawEmail.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail.trim());
  const hasDob = typeof rawDob === "string" && rawDob.trim().length > 0;

  return Boolean(hasName && hasUsername && hasEmail && hasDob);
};

/**
 * Shows an alert requesting the user to complete their profile before consultation,
 * with an action button that takes the user directly to the Profile screen.
 *
 * @param {Object} [profile] - Optional profile object to indicate which fields are missing
 */
export const showProfileIncompleteAlert = (profile) => {
  const missing = [];
  const rawName = profile?.name || profile?.fullName;
  if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
    missing.push("Name");
  }
  if (
    !profile?.username ||
    typeof profile?.username !== "string" ||
    !profile.username.trim()
  ) {
    missing.push("Username");
  }
  if (
    !profile?.email ||
    typeof profile?.email !== "string" ||
    !profile.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
  ) {
    missing.push("Valid Email");
  }
  if (
    !profile?.dob ||
    typeof profile?.dob !== "string" ||
    !profile.dob.trim()
  ) {
    missing.push("Date of Birth");
  }

  const message =
    missing.length > 0
      ? `Please complete your profile details (${missing.join(
          ", ",
        )}) before starting a consultation with an astrologer.`
      : "Please complete your profile (Name, Username, Email, Date of Birth) before starting a consultation.";

  Alert.alert(
    "Complete Your Profile",
    message,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Complete Profile",
        onPress: () => {
          router.push("/(tabs)/profile");
        },
      },
    ],
    { cancelable: true },
  );
};

