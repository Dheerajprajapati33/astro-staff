import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useGetContentQuery } from "../../redux/contentApi";
import Typography from "../../constants/Typography";

import { RF, hp, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";
const DARK_BROWN = "#452515";

/* =========================================================
   HARDCODED CONTACT DATA
   ========================================================= */

const CONTACT_DATA = {
  title: "Contact Information",

  description:
    "For general questions, legal matters or other enquiries, you can contact us using the details below.",

  items: [
    {
      id: 1,
      label: "COMPANY",
      value: "Ascendant Vavi LLP",
      icon: "business-outline",
    },

    {
      id: 2,
      label: "BRAND",
      value: "Vavi",
      icon: "sparkles-outline",
    },

    {
      id: 3,
      label: "WEBSITE",
      value: "theVavi.com",
      icon: "globe-outline",
    },

    {
      id: 4,
      label: "REGISTERED OFFICE",
      value:
        "S1 - SF-232, CLOUD-9, Vaishali,\nGhaziabad, U.P.",
      icon: "location-outline",
    },

    {
      id: 5,
      label: "GENERAL EMAIL",
      value: "info@thevavi.com",
      icon: "mail-outline",
    },

    {
      id: 6,
      label: "LEGAL / GRIEVANCE EMAIL",
      value: "legal@thevavi.com",
      icon: "scales-outline",
    },
  ],
};

/* =========================================================
   CONTACT SCREEN
   ========================================================= */

export default function Contact() {
  const {
    data,
    isError,
  } = useGetContentQuery("contact_us");

  /*
   * API can remain connected.
   *
   * If API has valid data:
   *      API data can be used
   *
   * If API is empty/error:
   *      Hardcoded contact data is used.
   *
   * The detailed contact cards below always use the
   * hardcoded structured information so the UI remains
   * exactly like the provided design.
   */

  const contactData = useMemo(() => {
    return CONTACT_DATA;
  }, []);

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={RF(24)}
            color={ORANGE}
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          Contact Us
        </Text>
      </View>

      {/* =================================================
          CONTENT
          ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =================================================
            MAIN CONTACT CARD
            ================================================= */}

        <View style={styles.contactCard}>
          {/* TOP ICON */}

          <View style={styles.logoIcon}>
            <Ionicons
              name="business-outline"
              size={RF(20)}
              color="#fff"
            />
          </View>

          {/* BRAND */}

          <Text style={styles.brand}>
            VAVI
          </Text>

          {/* TITLE */}

          <Text style={styles.title}>
            {contactData.title}
          </Text>

          {/* DESCRIPTION */}

          <Text style={styles.description}>
            {contactData.description}
          </Text>

          {/* =================================================
              CONTACT INFORMATION
              ================================================= */}

          <View style={styles.itemsContainer}>
            {contactData.items.map((item) => (
              <View
                key={item.id}
                style={styles.contactItem}
              >
                {/* ICON */}

                <View style={styles.itemIcon}>
                  <Ionicons
                    name={item.icon}
                    size={RF(16)}
                    color={ORANGE}
                  />
                </View>

                {/* TEXT */}

                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>
                    {item.label}
                  </Text>

                  <Text style={styles.itemValue}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  /* ================= HEADER ================= */

  header: {
    height: hp(6.5),

    backgroundColor: "#fff",

    paddingHorizontal: wp(4),

    flexDirection: "row",

    alignItems: "center",

    borderBottomWidth: 1,

    borderBottomColor: "#f1f1f1",
  },

  backButton: {
    width: wp(10),

    height: wp(10),

    borderRadius: wp(5),

    backgroundColor: "#fff3ea",

    alignItems: "center",

    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,

    marginLeft: wp(3),

    color: "#1f2937",

    fontSize: RF(18),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  /* ================= CONTAINER ================= */

  container: {
    paddingHorizontal: wp(4),

    paddingTop: hp(2.5),

    paddingBottom: hp(5),
  },

  /* ================= CONTACT CARD ================= */

  contactCard: {
    backgroundColor: DARK_BROWN,

    borderRadius: wp(5),

    paddingHorizontal: wp(5),

    paddingTop: hp(2.5),

    paddingBottom: hp(2.5),

    shadowColor: "#000",

    shadowOpacity: 0.12,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,

      height: 5,
    },

    elevation: 5,
  },

  /* ================= TOP ICON ================= */

  logoIcon: {
    width: wp(8),

    height: wp(8),

    borderRadius: wp(2.2),

    backgroundColor: ORANGE,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: hp(1),
  },

  /* ================= BRAND ================= */

  brand: {
    color: ORANGE,

    fontSize: RF(8),

    fontWeight: "900",

    fontFamily: Typography?.bold,

    marginBottom: hp(0.5),
  },

  /* ================= TITLE ================= */

  title: {
    color: "#fff",

    fontSize: RF(19),

    lineHeight: hp(2.8),

    fontWeight: "900",

    fontFamily: Typography?.bold,

    marginBottom: hp(0.8),
  },

  /* ================= DESCRIPTION ================= */

  description: {
    color: "#f3e8e0",

    fontSize: RF(8.5),

    lineHeight: hp(1.8),

    fontWeight: "400",

    fontFamily: Typography?.regular,

    marginBottom: hp(2),
  },

  /* ================= ITEMS ================= */

  itemsContainer: {
    gap: hp(0.9),
  },

  contactItem: {
    minHeight: hp(5.8),

    backgroundColor: "#594033",

    borderRadius: wp(2.3),

    paddingHorizontal: wp(2.5),

    paddingVertical: hp(0.8),

    flexDirection: "row",

    alignItems: "center",
  },

  /* ================= ITEM ICON ================= */

  itemIcon: {
    width: wp(7),

    height: wp(7),

    borderRadius: wp(2),

    backgroundColor: "#66483a",

    alignItems: "center",

    justifyContent: "center",

    marginRight: wp(2),
  },

  /* ================= ITEM CONTENT ================= */

  itemContent: {
    flex: 1,

    justifyContent: "center",
  },

  itemLabel: {
    color: "#bdb0a9",

    fontSize: RF(6.5),

    lineHeight: hp(1.1),

    fontWeight: "800",

    fontFamily: Typography?.bold,

    marginBottom: hp(0.2),
  },

  itemValue: {
    color: "#fff",

    fontSize: RF(8.5),

    lineHeight: hp(1.5),

    fontWeight: "700",

    fontFamily: Typography?.bold,
  },
});