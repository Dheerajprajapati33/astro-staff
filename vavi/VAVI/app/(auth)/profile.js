import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={RF(28)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <TouchableOpacity>
            <Ionicons size={RF(24)} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuRow}
          onPress={() => router.push("/Services")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Ionicons
                name="wallet-outline"
                size={RF(20)}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.menuTitle}>Our Services</Text>
          </View>

          <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuRow}
          onPress={() => router.push("/FollowAstro")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Ionicons
                name="wallet-outline"
                size={RF(20)}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.menuTitle}>Following Astrologers</Text>
          </View>

          <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
        </TouchableOpacity>

        {/* Notifications */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuRow}
          onPress={() => router.push("/Notification")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Ionicons
                name="notifications-outline"
                size={RF(20)}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.menuTitle}>Notifications</Text>
          </View>

          <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
        </TouchableOpacity>

        {/* Refer */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuRow}
          onPress={() => router.push("/Refer")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Ionicons
                name="gift-outline"
                size={RF(20)}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.menuTitle}>Refer & Earn</Text>
          </View>

          <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
        </TouchableOpacity>

        {/* Free Kundli*/}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuRow}
          onPress={() => router.push("/FreeKundli")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
              <Ionicons
                name="moon-outline"
                size={RF(20)}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.menuTitle}>Free kundli</Text>
          </View>

          <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
        </TouchableOpacity>

        {/* Settings Section */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuRow}
            onPress={() => router.push("/Privacy")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.menuTitle}>Privacy Policy</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuRow}
            onPress={() => router.push("/Refund_policy")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.menuTitle}>Refund Policy</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuRow}
            onPress={() => router.push("/Terms")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="document-text-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.menuTitle}>Terms & Conditions</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuRow}
            onPress={() => router.push("/Aboutus")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.menuTitle}>About App</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.menuRow,

              {
                borderBottomWidth: 0,
              },
            ]}
            onPress={() => router.push("/FAQs")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="headset-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.menuTitle}>FAQs</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.menuRow,

              {
                borderBottomWidth: 0,
              },
            ]}
            onPress={() => router.push("/HelpSupport")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="headset-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.menuTitle}>Help & Support</Text>
            </View>

            <Ionicons name="chevron-forward" size={RF(20)} color="#999" />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingBottom: hp(12),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1),
  },

  headerTitle: {
    fontSize: RF(22),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  profileCard: {
    marginTop: hp(3),
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: "center",
    elevation: 3,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  userName: {
    marginTop: hp(1.5),
    fontSize: RF(20),
    fontWeight: "600",
    color: Colors.darkBrown,
  },

  userId: {
    marginTop: hp(0.4),
    fontSize: RF(12),
    color: Colors.textGray,
    fontWeight: "400",
  },

  mobile: {
    marginTop: hp(1),
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "500",
  },

  email: {
    marginTop: hp(0.5),
    fontSize: RF(13),
    color: Colors.textGray,
    fontWeight: "400",
  },

  walletCard: {
    marginTop: hp(3),
    width: "100%",
    backgroundColor: "#FFF4ED",
    borderRadius: wp(4),
    padding: wp(4),
    flexDirection: "row",
    alignItems: "center",
  },

  walletLabel: {
    fontSize: RF(12),
    color: Colors.textGray,
    fontWeight: "400",
  },

  walletAmount: {
    marginTop: hp(0.3),
    fontSize: RF(22),
    color: Colors.primary,
    fontWeight: "700",
  },

  addMoney: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(8),
    flexDirection: "row",
    alignItems: "center",
  },

  addMoneyText: {
    color: "#FFF",
    marginLeft: wp(1),
    fontSize: RF(12),
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2.5),
  },

  statCard: {
    width: wp(27),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    paddingVertical: hp(2),
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),

    backgroundColor: "#FFF4ED",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: hp(1),
  },

  statNumber: {
    fontSize: RF(18),

    color: Colors.darkBrown,

    fontWeight: "700",
  },

  statLabel: {
    marginTop: hp(0.4),

    fontSize: RF(12),

    color: Colors.textGray,

    fontWeight: "400",
  },

  sectionCard: {
    marginTop: hp(3),

    backgroundColor: Colors.white,

    borderRadius: wp(5),

    padding: wp(5),

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  sectionTitle: {
    fontSize: RF(18),

    color: Colors.darkBrown,

    fontWeight: "600",

    marginBottom: hp(2),
  },

  menuRow: {
    height: hp(7.5),

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderBottomWidth: 1,

    borderBottomColor: "#F2F2F2",
  },

  menuLeft: {
    flexDirection: "row",

    alignItems: "center",
  },

  iconBox: {
    width: wp(11),

    height: wp(11),

    borderRadius: wp(5.5),

    backgroundColor: "#FFF4ED",

    justifyContent: "center",

    alignItems: "center",

    marginRight: wp(3),
  },

  menuTitle: {
    fontSize: RF(14),

    color: Colors.darkBrown,

    fontWeight: "500",
  },
  logoutButton: {
    marginTop: hp(3),

    height: hp(7),

    borderRadius: wp(4),

    backgroundColor: Colors.primary,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.12,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  logoutText: {
    marginLeft: wp(2),

    color: Colors.white,

    fontSize: RF(16),

    fontWeight: "600",
  },

  deleteButton: {
    marginTop: hp(2),

    height: hp(7),

    borderRadius: wp(4),

    borderWidth: 1.5,

    borderColor: "#E53935",

    backgroundColor: "#FFF",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },

  deleteText: {
    marginLeft: wp(2),

    color: "#E53935",

    fontSize: RF(16),

    fontWeight: "600",
  },

  versionCard: {
    marginTop: hp(4),

    marginBottom: hp(5),

    alignItems: "center",

    justifyContent: "center",
  },

  versionTitle: {
    marginTop: hp(1),

    fontSize: RF(18),

    color: Colors.darkBrown,

    fontWeight: "700",
  },

  versionText: {
    marginTop: hp(0.5),

    fontSize: RF(13),

    color: Colors.textGray,

    fontWeight: "500",
  },

  copyText: {
    marginTop: hp(1),

    textAlign: "center",

    color: "#9E9E9E",

    fontSize: RF(11),

    fontWeight: "400",
  },
});
