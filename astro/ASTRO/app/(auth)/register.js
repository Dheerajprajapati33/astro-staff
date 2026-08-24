import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import { useGetExpertisesQuery } from "../../redux/expertiseApi";
import { useGetLanguagesQuery } from "../../redux/languageApi";
import { useRegisterUserMutation } from "../../redux/registerApi";

const ORANGE = "#ff6a00";
const GREEN = "#25b657";
const RED = "#ef4444";

const steps = ["Basic Info", "Expertise", "Profile Details"];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "astrologer",
    experience: "",
    about: "",
    availability: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panFront, setPanFront] = useState(null);

  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validateBasicInfo = () => {
    if (!formData.name.trim()) {
      alert("Please enter astrologer name.");
      return false;
    }

    if (!formData.username.trim()) {
      alert("Please enter username.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number.");
      return false;
    }

    return true;
  };

  const validateProfileDetails = () => {
    if (!formData.about.trim()) {
      alert("Please enter information about your services.");
      return false;
    }

    if (!formData.experience.trim()) {
      alert("Please enter your experience.");
      return false;
    }

    if (selectedLanguages.length === 0) {
      alert("Please select at least one language.");
      return false;
    }

    if (!formData.availability.trim()) {
      alert("Please enter your availability.");
      return false;
    }

    return true;
  };

  const pickProfilePic = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Please allow photo library access to upload a picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        setProfilePic({
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split("/").pop(),
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch (error) {
      console.log("IMAGE PICKER ERROR:", error);
      alert("Unable to pick image. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!validateProfileDetails()) return;

    const payload = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      experience: formData.experience.trim(),
      about: formData.about.trim(),

      expertiseIds: selectedExpertise.map((item) => item.id),
      languageIds: selectedLanguages.map((item) => item.id),

      availability: formData.availability.trim(),

      profilePic,
      aadhaarFront,
      aadhaarBack,
      panFront,
    };

    try {
      console.log("REGISTER REQUEST:", payload);

      const response = await registerUser(payload).unwrap();

      console.log("REGISTER SUCCESS:", response);

      router.replace("/verification-pending");
    } catch (error) {
      console.log("REGISTER ERROR:", JSON.stringify(error, null, 2));

      const message =
        error?.data?.message ||
        error?.error ||
        "Registration failed. Please try again.";

      alert(message);
    }
  };

  const [step, setStep] = useState(1);

  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const {
    data: expertiseList = [],
    isLoading: expertiseLoading,
    isFetching: expertiseFetching,
    isError: expertiseError,
    refetch: refetchExpertise,
  } = useGetExpertisesQuery();

  const {
    data: languageList = [],
    isLoading: languageLoading,
    isFetching: languageFetching,
    isError: languageError,
    refetch: refetchLanguages,
  } = useGetLanguagesQuery();

  const toggleExpertise = (item) => {
    setSelectedExpertise((previous) => {
      const alreadySelected = previous.some(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (alreadySelected) {
        return previous.filter((selectedItem) => selectedItem.id !== item.id);
      }

      return [...previous, item];
    });
  };

  const toggleLanguage = (item) => {
    setSelectedLanguages((previous) => {
      const alreadySelected = previous.some(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (alreadySelected) {
        return previous.filter((selectedItem) => selectedItem.id !== item.id);
      }

      return [...previous, item];
    });
  };

  const getSelectedLanguageNames = () => {
    if (!selectedLanguages.length) {
      return "Select languages you are comfortable with";
    }

    return selectedLanguages.map((item) => item.name).join(", ");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!validateBasicInfo()) return;

      setStep(2);
      return;
    }

    if (step === 2) {
      if (selectedExpertise.length === 0) {
        alert("Please select at least one expertise.");
        return;
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      handleRegister();
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step > 1) {
              setLanguageDropdownOpen(false);
              setStep((previous) => previous - 1);
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={hp(12)}
          extraHeight={hp(14)}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoSpace} />

          <Text style={styles.title}>Astrologer Registration</Text>

          <Text style={styles.subTitle}>
            Let's create your professional profile
          </Text>

          <StepIndicator step={step} />

          {step === 1 && (
            <BasicInfo formData={formData} updateField={updateField} />
          )}

          {step === 2 && (
            <Expertise
              expertiseList={expertiseList}
              selectedExpertise={selectedExpertise}
              toggleExpertise={toggleExpertise}
              isLoading={expertiseLoading || expertiseFetching}
              isError={expertiseError}
              onRetry={refetchExpertise}
            />
          )}

          {step === 3 && (
            <ProfileDetails
              formData={formData}
              updateField={updateField}
              profilePic={profilePic}
              pickProfilePic={pickProfilePic}
              languageList={languageList}
              selectedLanguages={selectedLanguages}
              toggleLanguage={toggleLanguage}
              languageDropdownOpen={languageDropdownOpen}
              setLanguageDropdownOpen={setLanguageDropdownOpen}
              selectedLanguageNames={getSelectedLanguageNames()}
              isLoading={languageLoading || languageFetching}
              isError={languageError}
              onRetry={refetchLanguages}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.button, registerLoading && { opacity: 0.7 }]}
            onPress={nextStep}
            disabled={registerLoading}
          >
            {step === 3 && registerLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {step === 3 ? "Complete Registration" : "Continue"}
                </Text>

                <Ionicons
                  name={
                    step === 3 ? "checkmark-circle-outline" : "arrow-forward"
                  }
                  size={RF(18)}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={RF(13)}
              color={GREEN}
            />

            <Text style={styles.secureText}>
              Your information is secure and encrypted
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const StepIndicator = ({ step }) => (
  <View style={styles.stepWrapper}>
    <View style={styles.stepLine} />

    {steps.map((item, index) => {
      const number = index + 1;
      const completed = number < step;
      const active = number === step;

      return (
        <View key={item} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              completed && styles.completedCircle,
              active && styles.activeCircle,
            ]}
          >
            {completed ? (
              <Ionicons name="checkmark" size={RF(12)} color="#fff" />
            ) : (
              <Text style={[styles.stepNum, active && styles.activeStepNum]}>
                {number}
              </Text>
            )}
          </View>

          <Text
            style={[
              styles.stepLabel,
              (active || completed) && styles.activeStepLabel,
            ]}
          >
            {item}
          </Text>
        </View>
      );
    })}
  </View>
);

const BasicInfo = ({ formData, updateField }) => (
  <View>
    <Input
      label="Astrologer Name"
      icon="person-outline"
      placeholder="Enter your full name"
      value={formData.name}
      onChangeText={(text) => updateField("name", text)}
    />

    <Input
      label="Create Username"
      icon="at"
      placeholder="Choose a unique username"
      value={formData.username}
      onChangeText={(text) => updateField("username", text)}
      autoCapitalize="none"
    />

    <Text style={styles.helperText}>
      This will be your public profile username
    </Text>

    <Input
      label="Email Address"
      icon="mail-outline"
      placeholder="Enter your email address"
      keyboardType="email-address"
      value={formData.email}
      onChangeText={(text) => updateField("email", text)}
      autoCapitalize="none"
    />

    <Input
      label="Phone Number"
      icon="call-outline"
      placeholder="+91 98765 43210"
      keyboardType="phone-pad"
      value={formData.phone}
      onChangeText={(text) => updateField("phone", text)}
    />

    <Text style={styles.helperText}>Your phone number is verified</Text>
  </View>
);

const Expertise = ({
  expertiseList,
  selectedExpertise,
  toggleExpertise,
  isLoading,
  isError,
  onRetry,
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Expertise</Text>

      <Text style={styles.sectionSub}>
        Select all the areas you specialize in
      </Text>

      {isLoading ? (
        <LoadingBox text="Loading expertise..." />
      ) : isError ? (
        <ErrorBox text="Unable to load expertise." onRetry={onRetry} />
      ) : expertiseList.length === 0 ? (
        <EmptyBox text="No expertise available." />
      ) : (
        <View style={styles.expertiseGrid}>
          {expertiseList.map((item) => {
            const active = selectedExpertise.some(
              (selectedItem) => selectedItem.id === item.id,
            );

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={[
                  styles.expertiseBox,
                  active && styles.activeExpertiseBox,
                ]}
                onPress={() => toggleExpertise(item)}
              >
                <MaterialCommunityIcons
                  name="star-four-points-outline"
                  size={RF(14)}
                  color={active ? ORANGE : "#555"}
                />

                <Text
                  numberOfLines={2}
                  style={[
                    styles.expertiseText,
                    active && styles.activeExpertiseText,
                  ]}
                >
                  {item.name}
                </Text>

                <View style={[styles.radio, active && styles.activeRadio]}>
                  {active && (
                    <Ionicons name="checkmark" size={RF(9)} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.selectedCountBox}>
        <Text style={styles.selectedCountText}>
          {selectedExpertise.length} expertise selected
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={RF(16)}
          color={GREEN}
        />

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            You can select multiple expertise
          </Text>

          <Text style={styles.infoText}>
            This helps clients find you for the right services.
          </Text>
        </View>
      </View>
    </View>
  );
};

const ProfileDetails = ({
  formData,
  updateField,
  profilePic,
  pickProfilePic,
  languageList,
  selectedLanguages,
  toggleLanguage,
  languageDropdownOpen,
  setLanguageDropdownOpen,
  selectedLanguageNames,
  isLoading,
  isError,
  onRetry,
}) => (
  <View>
    <Text style={styles.sectionTitle}>Profile Details</Text>

    <Text style={styles.sectionSub}>
      Tell us more about your professional journey
    </Text>

    <View style={styles.photoCard}>
      <View style={styles.photoContent}>
        <Text style={styles.photoTitle}>Profile Picture</Text>

        <Text style={styles.photoSub}>
          Add a clear photo to build trust with your clients
        </Text>
      </View>

      <TouchableOpacity style={styles.uploadCircle} onPress={pickProfilePic}>
        {profilePic?.uri ? (
          <Image
            source={{ uri: profilePic.uri }}
            style={{ width: "100%", height: "100%", borderRadius: wp(10) }}
          />
        ) : (
          <>
            <Ionicons name="camera-outline" size={RF(22)} color={ORANGE} />
            <Text style={styles.uploadText}>Upload Photo</Text>
          </>
        )}
      </TouchableOpacity>
    </View>

    <Input
      label="About Your Services"
      icon="pencil-outline"
      placeholder="Describe the services you offer"
      value={formData.about}
      onChangeText={(text) => updateField("about", text)}
      multiline
    />

    <Input
      label="Experience"
      icon="ribbon-outline"
      placeholder="Enter your total experience in years"
      keyboardType="number-pad"
      value={formData.experience}
      onChangeText={(text) => updateField("experience", text)}
    />

    <LanguageDropdown
      languageList={languageList}
      selectedLanguages={selectedLanguages}
      toggleLanguage={toggleLanguage}
      isOpen={languageDropdownOpen}
      setIsOpen={setLanguageDropdownOpen}
      selectedLanguageNames={selectedLanguageNames}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
    />

    <Input
      label="Availability"
      icon="time-outline"
      placeholder="Enter your availability"
      value={formData.availability}
      onChangeText={(text) => updateField("availability", text)}
    />
  </View>
);

const LanguageDropdown = ({
  languageList,
  selectedLanguages,
  toggleLanguage,
  isOpen,
  setIsOpen,
  selectedLanguageNames,
  isLoading,
  isError,
  onRetry,
}) => {
  return (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.inputLabel}>Languages You Speak</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.dropdownHeader, isOpen && styles.dropdownHeaderActive]}
        onPress={() => setIsOpen((previous) => !previous)}
      >
        <Ionicons name="language-outline" size={RF(16)} color={ORANGE} />

        <Text
          numberOfLines={1}
          style={[
            styles.dropdownValue,
            selectedLanguages.length === 0 && styles.dropdownPlaceholder,
          ]}
        >
          {selectedLanguageNames}
        </Text>

        {selectedLanguages.length > 0 && (
          <View style={styles.languageCountBadge}>
            <Text style={styles.languageCountText}>
              {selectedLanguages.length}
            </Text>
          </View>
        )}

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={RF(17)}
          color="#777"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {isLoading ? (
            <LoadingBox text="Loading languages..." compact />
          ) : isError ? (
            <ErrorBox
              text="Unable to load languages."
              onRetry={onRetry}
              compact
            />
          ) : languageList.length === 0 ? (
            <EmptyBox text="No languages available." compact />
          ) : (
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              style={styles.languageScroll}
              contentContainerStyle={styles.languageScrollContent}
            >
              {languageList.map((item, index) => {
                const selected = selectedLanguages.some(
                  (selectedItem) => selectedItem.id === item.id,
                );

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.languageOption,
                      index !== languageList.length - 1 &&
                        styles.languageOptionBorder,
                      selected && styles.selectedLanguageOption,
                    ]}
                    onPress={() => toggleLanguage(item)}
                  >
                    <View style={styles.languageOptionLeft}>
                      <Ionicons
                        name="language-outline"
                        size={RF(15)}
                        color={selected ? ORANGE : "#777"}
                      />

                      <Text
                        style={[
                          styles.languageOptionText,
                          selected && styles.selectedLanguageOptionText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.languageCheckbox,
                        selected && styles.languageCheckboxSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons name="checkmark" size={RF(11)} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}

      {selectedLanguages.length > 0 && (
        <View style={styles.selectedLanguagesWrap}>
          {selectedLanguages.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={styles.languageChip}
              onPress={() => toggleLanguage(item)}
            >
              <Text style={styles.languageChipText}>{item.name}</Text>

              <Ionicons name="close-circle" size={RF(13)} color={ORANGE} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Input = ({
  label,
  icon,
  placeholder,
  keyboardType = "default",
  multiline = false,
  value,
  onChangeText,
  autoCapitalize = "sentences",
}) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>

    <View style={[styles.inputBox, multiline && styles.multilineInputBox]}>
      <Ionicons
        name={icon}
        size={RF(15)}
        color={ORANGE}
        style={multiline && styles.multilineIcon}
      />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType}
        style={[styles.input, multiline && styles.multilineInput]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
      />
    </View>
  </View>
);

const LoadingBox = ({ text, compact = false }) => (
  <View style={[styles.statusBox, compact && styles.compactStatusBox]}>
    <ActivityIndicator size="small" color={ORANGE} />
    <Text style={styles.statusText}>{text}</Text>
  </View>
);

const ErrorBox = ({ text, onRetry, compact = false }) => (
  <View style={[styles.statusBox, compact && styles.compactStatusBox]}>
    <Ionicons name="alert-circle-outline" size={RF(18)} color={RED} />

    <Text style={styles.errorText}>{text}</Text>

    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

const EmptyBox = ({ text, compact = false }) => (
  <View style={[styles.statusBox, compact && styles.compactStatusBox]}>
    <Ionicons name="information-circle-outline" size={RF(18)} color="#777" />

    <Text style={styles.statusText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
  },
  safe: {
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    top: hp(4.8),
    left: wp(5),
    zIndex: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(7),
    paddingBottom: hp(15),
  },
  logoSpace: {
    height: hp(13),
  },
  title: {
    fontSize: RF(18),
    color: "#222",
    textAlign: "center",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  subTitle: {
    fontSize: RF(12),
    color: "#777",
    textAlign: "center",
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  stepWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2.5),
    marginBottom: hp(2.5),
    position: "relative",
  },
  stepLine: {
    position: "absolute",
    top: hp(1.35),
    left: wp(9),
    right: wp(9),
    height: 2,
    backgroundColor: "#e7e7e7",
  },
  stepItem: {
    width: wp(19),
    alignItems: "center",
  },
  stepCircle: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  languageScroll: {
    flex: 1,
  },

  languageScrollContent: {
    paddingBottom: hp(1),
  },
  activeCircle: {
    backgroundColor: ORANGE,
  },
  completedCircle: {
    backgroundColor: GREEN,
  },
  stepNum: {
    fontSize: RF(10),
    color: "#777",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  activeStepNum: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: RF(10),
    color: "#777",
    marginTop: hp(0.7),
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  activeStepLabel: {
    color: GREEN,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: RF(14),
    color: "#222",
    fontWeight: "900",
    marginBottom: hp(0.4),
    fontFamily: Typography?.bold,
  },
  sectionSub: {
    fontSize: RF(12),
    color: "#777",
    marginBottom: hp(1.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  inputWrapper: {
    marginBottom: hp(1.25),
  },
  inputLabel: {
    fontSize: RF(12),
    color: "#222",
    fontWeight: "800",
    marginBottom: hp(0.7),
    fontFamily: Typography?.bold,
  },
  inputBox: {
    height: hp(6),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(2.5),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
  },
  input: {
    flex: 1,
    fontSize: RF(12),
    color: "#111",
    marginLeft: wp(2.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  multilineInputBox: {
    minHeight: hp(11),
    alignItems: "flex-start",
    paddingTop: hp(1.5),
  },
  multilineInput: {
    minHeight: hp(8),
  },
  multilineIcon: {
    marginTop: hp(0.3),
  },
  helperText: {
    fontSize: RF(10),
    color: "#777",
    marginTop: -hp(0.7),
    marginBottom: hp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  expertiseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: hp(1.1),
  },
  expertiseBox: {
    width: wp(40.5),
    minHeight: hp(5.5),
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  activeExpertiseBox: {
    borderColor: ORANGE,
    backgroundColor: "#fff8ef",
  },
  expertiseText: {
    flex: 1,
    fontSize: RF(11),
    color: "#333",
    marginLeft: wp(2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  activeExpertiseText: {
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  radio: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  activeRadio: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  selectedCountBox: {
    alignSelf: "flex-end",
    marginTop: hp(1),
  },
  selectedCountText: {
    color: ORANGE,
    fontSize: RF(10),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  infoBox: {
    marginTop: hp(1.5),
    backgroundColor: "#ecfff2",
    borderWidth: 1,
    borderColor: "#c8f5d4",
    borderRadius: wp(2),
    padding: wp(2.5),
    flexDirection: "row",
  },
  infoContent: {
    flex: 1,
    marginLeft: wp(2),
  },
  infoTitle: {
    fontSize: RF(12),
    color: GREEN,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  infoText: {
    fontSize: RF(11),
    color: "#5f9b70",
    marginTop: hp(0.2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  dropdownWrapper: {
    marginBottom: hp(1.25),
    zIndex: 10,
  },
  dropdownHeader: {
    minHeight: hp(6),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(2.5),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  dropdownHeaderActive: {
    borderColor: ORANGE,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownValue: {
    flex: 1,
    marginHorizontal: wp(2.5),
    color: "#111",
    fontSize: RF(12),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  dropdownPlaceholder: {
    color: "#aaa",
  },
  languageCountBadge: {
    minWidth: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  languageCountText: {
    color: "#fff",
    fontSize: RF(10),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  dropdownMenu: {
    height: hp(30),
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: ORANGE,
    borderBottomLeftRadius: wp(2.5),
    borderBottomRightRadius: wp(2.5),
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  languageOption: {
    minHeight: hp(5.2),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  languageOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  selectedLanguageOption: {
    backgroundColor: "#fff8ef",
  },
  languageOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageOptionText: {
    marginLeft: wp(2),
    color: "#333",
    fontSize: RF(11),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  selectedLanguageOptionText: {
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  languageCheckbox: {
    width: wp(4.5),
    height: wp(4.5),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  languageCheckboxSelected: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  selectedLanguagesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp(1),
    gap: wp(2),
  },
  languageChip: {
    backgroundColor: "#fff3e9",
    borderWidth: 1,
    borderColor: "#ffd7b7",
    borderRadius: wp(4),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  languageChipText: {
    color: ORANGE,
    fontSize: RF(11),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  photoCard: {
    minHeight: hp(12),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    padding: wp(3.2),
    marginBottom: hp(1.3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoContent: {
    flex: 1,
    paddingRight: wp(3),
  },
  photoTitle: {
    fontSize: RF(13),
    color: "#222",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  photoSub: {
    fontSize: RF(12),
    color: "#777",
    marginTop: hp(0.4),
    lineHeight: hp(1.7),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  uploadCircle: {
    width: wp(19),
    height: wp(19),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#ffcf9e",
    backgroundColor: "#fff7ef",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadText: {
    fontSize: RF(10),
    color: ORANGE,
    fontWeight: "800",
    marginTop: hp(0.3),
    fontFamily: Typography?.bold,
  },

  statusBox: {
    minHeight: hp(16),
    borderWidth: 1,
    borderColor: "#f1dfca",
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: wp(2.5),
  },
  compactStatusBox: {
    minHeight: hp(9),
    borderWidth: 0,
    borderRadius: 0,
  },
  statusText: {
    color: "#777",
    fontSize: RF(10),
    marginTop: hp(0.7),
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  errorText: {
    color: RED,
    fontSize: RF(10),
    marginTop: hp(0.7),
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  retryButton: {
    marginTop: hp(1),
    backgroundColor: ORANGE,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.7),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  button: {
    height: hp(5.8),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(3),
  },
  buttonText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.5),
  },
  secureText: {
    fontSize: RF(10),
    color: "#777",
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
