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
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";
const DARK = "#3b2418";
const TEXT = "#374151";

/* =========================================================
   VAVI REFUND & CANCELLATION POLICY
   ========================================================= */

const REFUND_DATA = [
  {
    number: "1",
    title: "General Refund Principle",
    content: `Vavi facilitates astrology-related consultations between Users and independent Astrologers. Refunds are not automatically available for every completed or partially completed consultation. A refund may be considered where there is a genuine payment, technical, service-delivery or Platform-related issue covered by this Policy.`,
  },

  {
    number: "2",
    title: "Astrology Results Are Not Refundable",
    content: `Astrology is interpretive and subjective. A refund will not ordinarily be provided simply because a User disagrees with an Astrologer's prediction or opinion, is dissatisfied with guidance, does not receive an expected result, disagrees with a horoscope or Kundli interpretation, believes a remedy was ineffective, or changes their mind after receiving the consultation.`,
  },

  {
    number: "3",
    title: "When a Refund May Be Considered",
    content: `Subject to verification, a refund, payment reversal, Wallet restoration, Platform credit or another appropriate adjustment may be considered for duplicate payments, payment deducted but service not received, failed transactions not automatically reversed, verified Vavi technical failures, Astrologer-side failures, incorrect automatic deductions or situations where a remedy is required by applicable law.`,
  },

  {
    number: "4",
    title: "Chat Consultations",
    content: `Where charges are calculated according to chat duration, applicable charges may be deducted based on the rate displayed on the Platform. A completed chat consultation is ordinarily treated as a consumed service. A refund will not ordinarily be provided merely because the User is dissatisfied with the content, opinion, prediction, advice, response style or outcome.`,
  },

  {
    number: "5",
    title: "Voice Consultations",
    content: `Voice consultation charges may be based on eligible connected consultation time and the rate displayed on the Platform. If a consultation is interrupted because of a verified Vavi Platform failure, Vavi may review call status, connection logs, session identifiers, timestamps and duration records and may restore or refund an eligible unconsumed amount.`,
  },

  {
    number: "6",
    title: "User-Side Network or Device Issues",
    content: `A refund will not ordinarily be provided when a consultation fails or is interrupted solely because of User-side issues such as internet failure, poor mobile connectivity, Wi-Fi failure, device malfunction, low battery, incorrect permissions, microphone or speaker problems, closing the application, intentionally disconnecting or using an unsupported or improperly configured device.`,
  },

  {
    number: "7",
    title: "Astrologer-Side Failure",
    content: `If a paid consultation cannot reasonably be delivered because an Astrologer fails to participate, fails to connect, cancels after payment or otherwise does not provide the consultation, Vavi may provide an eligible refund, restore the Wallet amount, offer a replacement consultation, provide Platform credit where accepted or provide another reasonable remedy.`,
  },

  {
    number: "8",
    title: "Cancellation by User",
    content: `Where the Platform allows cancellation before a consultation begins, cancellation will be processed according to the cancellation functionality displayed in the App. Once a paid consultation has started and service has been provided, cancellation will not ordinarily create an automatic right to a full refund. Any eligible unused or undelivered portion may be reviewed.`,
  },

  {
    number: "9",
    title: "Cancellation by Astrologer",
    content: `If an Astrologer cancels or fails to provide a paid consultation before meaningful service is delivered, Vavi may reverse the eligible charge, restore the applicable Wallet amount, issue an eligible refund, allow the User to select another Astrologer or provide another appropriate remedy.`,
  },

  {
    number: "10",
    title: "Wallet & Platform Credits",
    content: `Wallet balances, recharge balances, refund credits, promotional credits, cashback credits and bonus credits may be subject to different rules. Unless required by law or expressly permitted under this Policy, Wallet Credits are non-transferable and cannot ordinarily be withdrawn to a bank account, card, UPI account or other external payment method.`,
  },

  {
    number: "11",
    title: "Paid Wallet Recharge",
    content: `A successfully completed Wallet recharge will ordinarily be non-refundable once the corresponding value has been correctly credited to the User's account. This does not prevent Vavi from correcting duplicate recharges, failed transactions, incorrect deductions, unauthorized transactions where legally required or other verified payment errors.`,
  },

  {
    number: "12",
    title: "Promotional & Free Credits",
    content: `Promotional Credits, bonus Credits, complimentary Credits, free consultation minutes, coupons and rewards generally cannot be redeemed for cash, cannot ordinarily be refunded or transferred, and may have an expiry period or promotional conditions. Unused promotional benefits may expire when an account is permanently closed or deleted.`,
  },

  {
    number: "13",
    title: "Refund Request Process",
    content: `Where available, Users may submit refund requests through Vavi's in-app customer-support functionality. Alternatively, Users may contact info@theVavi.com.

A request should ideally include:

• Registered name
• Mobile number or email
• Transaction ID
• Payment reference
• Consultation ID
• Transaction date
• Amount
• Astrologer name
• Issue description
• Relevant supporting screenshots or information`,
  },

  {
    number: "14",
    title: "Refund Review",
    content: `Vavi may review payment records, transaction IDs, Wallet ledger records, consultation records, chat records, call logs, voice-call metadata, consultation duration, technical logs, customer-support communications, Astrologer responses and fraud or security indicators to determine refund eligibility.`,
  },

  {
    number: "15",
    title: "Refund Processing Timeline",
    content: `Where a refund is approved following verification, Vavi will ordinarily initiate or process the eligible refund within 7–10 working days from approval or verification of the relevant issue.

The time for the amount to appear in the User's bank account, card, UPI account, Wallet or other payment instrument may depend on the relevant bank, gateway, card network, app store or payment provider.`,
  },

  {
    number: "16",
    title: "Refund Method",
    content: `Where reasonably possible, an approved monetary refund will be processed to the original payment method.

Depending on the circumstances, Vavi may also provide Wallet restoration, Platform credit, a replacement consultation or another reasonable remedy.

Where applicable law requires a monetary refund, a Platform credit will not replace it without the required basis or agreement.`,
  },

  {
    number: "17",
    title: "Google Play & Apple App Store Purchases",
    content: `Where a purchase is processed directly through Google Play or Apple App Store, the applicable store's billing and refund policies may also apply.

Where Google or Apple controls the relevant transaction or refund process, the User may need to submit the request through the applicable app store.`,
  },

  {
    number: "18",
    title: "Unauthorized Transactions",
    content: `Users should promptly report suspected unauthorized payments or account compromise.

Vavi may investigate using account, transaction, device, security and Platform records.

Users are responsible for protecting OTPs, passwords, UPI PINs, card PINs, banking credentials, account access and devices.`,
  },

  {
    number: "19",
    title: "Chargebacks",
    content: `Users should contact Vavi regarding a genuine payment dispute before submitting a duplicate or fraudulent chargeback.

Users must not knowingly claim an authorized transaction was unauthorized, seek both a Vavi refund and bank chargeback for the same amount, manipulate consultations for refunds or submit fabricated evidence.`,
  },

  {
    number: "20",
    title: "Refund Abuse & Fraud",
    content: `Vavi may investigate suspected refund abuse, including:

• Repeated fraudulent refund claims
• Intentionally disconnecting consultations to obtain refunds
• Multiple accounts created for promotional abuse
• Fake consultations
• Manipulated transaction information
• Collusion
• Duplicate refund claims
• Fraudulent chargebacks

Good-faith refund requests are not treated as abuse merely because a refund is requested.`,
  },

  {
    number: "21",
    title: "Taxes & Fees",
    content: `Where a refund is approved, the treatment of taxes, convenience fees, Platform charges, processing charges and other fees depends on the nature of the charge, whether the service was consumed, payment-provider rules, applicable tax requirements and applicable law.`,
  },

  {
    number: "22",
    title: "Third-Party Payment Providers",
    content: `Vavi may use payment gateways, banks, UPI providers, card networks, app stores and other payment processors.

Vavi is not responsible for delays caused solely by an independent payment provider after an approved refund has been correctly initiated by Vavi.`,
  },

  {
    number: "23",
    title: "Policy Updates",
    content: `Vavi may update this Refund & Cancellation Policy to reflect Platform changes, new payment features, Wallet functionality, regulatory requirements, app-store requirements, fraud-prevention measures and operational improvements.

Material changes may be communicated through the App, website, email or other reasonable means.`,
  },

  {
    number: "24",
    title: "Relationship with Other Policies",
    content: `This Policy should be read together with the Vavi Terms and Conditions, Privacy Policy, End User License Agreement (EULA), applicable Astrologer/Partner Agreement and other applicable Platform policies.

Mandatory legal requirements will prevail where required by law.`,
  },
];

/* =========================================================
   API CONTENT PARSER
   ========================================================= */

const parseRefundContent = (content) => {
  if (!content) {
    return [];
  }

  // If API already returns structured array
  if (Array.isArray(content)) {
    return content;
  }

  const text = String(content)
    .replace(/\r\n/g, "\n")
    .trim();

  if (!text) {
    return [];
  }

  /*
   * Supports API content like:
   *
   * 1. General Refund Principle
   * Vavi facilitates...
   *
   * 2. Astrology Results Are Not Refundable
   * Astrology is...
   */

  const regex =
    /(?:^|\n)\s*(?:##\s*)?(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n\s*(?:##\s*)?\d+\.\s+|$)/g;

  const sections = [];

  let match;

  while ((match = regex.exec(text)) !== null) {
    sections.push({
      number: match[1],
      title: match[2].trim(),
      content: match[3].trim(),
    });
  }

  return sections;
};

/* =========================================================
   REFUND SCREEN
   ========================================================= */

export default function Refund() {
  const {
    data,
    isLoading,
    isError,
  } = useGetContentQuery("refund_policy");

  /*
   * API priority:
   *
   * API available
   *      ↓
   * API content
   *
   * API empty/error
   *      ↓
   * Hardcoded VAVI content
   */

  const refundSections = useMemo(() => {
    const apiSections = parseRefundContent(data?.content);

    if (apiSections.length > 0) {
      return apiSections;
    }

    return REFUND_DATA;
  }, [data?.content]);

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
          onPress={() => router.back()}
          activeOpacity={0.7}
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
          Refund & Cancellation Policy
        </Text>
      </View>

      {/* =================================================
          SCROLL CONTENT
          ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =================================================
            ICON
            ================================================= */}

        <View style={styles.iconBox}>
          <Ionicons
            name="refresh-circle-outline"
            size={RF(42)}
            color={ORANGE}
          />
        </View>

        {/* =================================================
            PAGE TITLE
            ================================================= */}

        <Text style={styles.title}>
          Refund & Cancellation Policy
        </Text>

        <Text style={styles.subtitle}>
          Understand when refunds, cancellations, Wallet
          adjustments and payment reversals may be available
          on Vavi.
        </Text>

        {/* =================================================
            FALLBACK NOTICE
            ================================================= */}

        {isError && (
          <View style={styles.offlineNotice}>
            <Ionicons
              name="information-circle-outline"
              size={RF(16)}
              color={ORANGE}
            />

            <Text style={styles.offlineText}>
              Showing the latest available Refund & Cancellation
              Policy.
            </Text>
          </View>
        )}

        {/* =================================================
            BEFORE YOU REQUEST A REFUND
            ================================================= */}

        <View style={styles.introCard}>
          <Text style={styles.introTitle}>
            Before You Request a Refund
          </Text>

          <Text style={styles.introText}>
            Refunds are not automatically available for every
            completed or partially completed consultation. Vavi
            may consider a refund where there is a genuine
            payment, technical, service-delivery or
            Platform-related issue covered by this Policy.
          </Text>

          <View style={styles.importantBox}>
            <Text style={styles.importantText}>
              <Text style={styles.importantBold}>
                Important:
              </Text>{" "}
              Disagreement with an astrology prediction,
              opinion, interpretation, advice or expected result
              will not ordinarily qualify for a refund.
            </Text>
          </View>
        </View>

        {/* =================================================
            SUMMARY CARDS
            ================================================= */}

        <View style={styles.summaryContainer}>
          {/* REFUND MAY APPLY */}

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.greenIcon,
              ]}
            >
              <Ionicons
                name="checkmark"
                size={RF(21)}
                color="#16a34a"
              />
            </View>

            <Text style={styles.summaryTitle}>
              Refund May Apply
            </Text>

            <Text style={styles.summaryText}>
              Duplicate payment, verified technical failure,
              undelivered consultation or eligible payment
              error.
            </Text>
          </View>

          {/* REFUND TIMELINE */}

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.orangeIcon,
              ]}
            >
              <Text style={styles.rupee}>
                ₹
              </Text>
            </View>

            <Text style={styles.summaryTitle}>
              Refund Timeline
            </Text>

            <Text style={styles.summaryText}>
              Approved refunds are ordinarily initiated or
              processed within 7–10 working days.
            </Text>
          </View>

          {/* NOT AUTOMATICALLY REFUNDABLE */}

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.redIcon,
              ]}
            >
              <Ionicons
                name="alert"
                size={RF(19)}
                color="#dc2626"
              />
            </View>

            <Text style={styles.summaryTitle}>
              Not Automatically Refundable
            </Text>

            <Text style={styles.summaryText}>
              Dissatisfaction with predictions, opinions,
              advice or expected astrology results.
            </Text>
          </View>
        </View>

        {/* =================================================
            POLICY SECTIONS
            ================================================= */}

        {refundSections.map((item, index) => (
          <View
            key={`${item.number}-${index}`}
            style={styles.sectionCard}
          >
            {/* SECTION HEADER */}

            <View style={styles.sectionHeader}>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>
                  {item.number}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>
                {item.title}
              </Text>
            </View>

            {/* SECTION CONTENT */}

            <Text style={styles.content}>
              {item.content}
            </Text>
          </View>
        ))}

        {/* =================================================
            BOTTOM SPACE
            ================================================= */}

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
    backgroundColor: "#fff",
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

    color: DARK,

    fontSize: RF(17),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  /* ================= CONTAINER ================= */

  container: {
    paddingHorizontal: wp(4),

    paddingTop: hp(2),

    paddingBottom: hp(5),
  },

  /* ================= ICON ================= */

  iconBox: {
    width: wp(22),
    height: wp(22),

    borderRadius: wp(11),

    backgroundColor: "#fff3ea",

    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",

    marginTop: hp(1),

    borderWidth: 1,
    borderColor: "#ffe0cc",
  },

  /* ================= TITLE ================= */

  title: {
    textAlign: "center",

    fontSize: RF(23),

    fontWeight: "900",

    color: DARK,

    marginTop: hp(1.5),

    fontFamily: Typography?.bold,
  },

  subtitle: {
    textAlign: "center",

    fontSize: RF(11),

    lineHeight: hp(2),

    color: "#64748b",

    marginTop: hp(0.8),

    marginBottom: hp(2),

    paddingHorizontal: wp(3),

    fontFamily: Typography?.regular,
  },

  /* ================= OFFLINE NOTICE ================= */

  offlineNotice: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#fff7f0",

    borderWidth: 1,

    borderColor: "#ffe0cc",

    borderRadius: wp(2.5),

    paddingHorizontal: wp(3),

    paddingVertical: hp(1),

    marginBottom: hp(1.5),
  },

  offlineText: {
    flex: 1,

    marginLeft: wp(2),

    color: "#7c4a28",

    fontSize: RF(10),

    lineHeight: hp(1.8),

    fontFamily: Typography?.regular,
  },

  /* ================= INTRO CARD ================= */

  introCard: {
    backgroundColor: "#fff",

    borderWidth: 1,

    borderColor: "#eee5df",

    borderRadius: wp(4),

    padding: wp(4),

    marginBottom: hp(2),

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  introTitle: {
    color: DARK,

    fontSize: RF(18),

    lineHeight: hp(2.7),

    fontWeight: "900",

    marginBottom: hp(1.2),

    fontFamily: Typography?.bold,
  },

  introText: {
    color: "#4b5563",

    fontSize: RF(11),

    lineHeight: hp(2.5),

    fontWeight: "500",

    fontFamily: Typography?.regular,
  },

  importantBox: {
    marginTop: hp(1.8),

    backgroundColor: "#fff7ed",

    borderWidth: 1,

    borderColor: "#fed7aa",

    borderRadius: wp(3),

    paddingHorizontal: wp(3.5),

    paddingVertical: hp(1.5),
  },

  importantText: {
    color: "#7c2d12",

    fontSize: RF(10.5),

    lineHeight: hp(2.2),

    fontFamily: Typography?.regular,
  },

  importantBold: {
    fontWeight: "900",
  },

  /* ================= SUMMARY CARDS ================= */

  summaryContainer: {
    marginBottom: hp(1),
  },

  summaryCard: {
    backgroundColor: "#fff",

    borderWidth: 1,

    borderColor: "#eee5df",

    borderRadius: wp(4),

    padding: wp(4),

    marginBottom: hp(1.5),

    minHeight: hp(17),

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  summaryIcon: {
    width: wp(11),

    height: wp(11),

    borderRadius: wp(3),

    alignItems: "center",

    justifyContent: "center",

    marginBottom: hp(1.2),
  },

  greenIcon: {
    backgroundColor: "#dcfce7",
  },

  orangeIcon: {
    backgroundColor: "#ffedd5",
  },

  redIcon: {
    backgroundColor: "#fee2e2",
  },

  rupee: {
    color: ORANGE,

    fontSize: RF(19),

    fontWeight: "900",
  },

  summaryTitle: {
    color: "#111827",

    fontSize: RF(14),

    lineHeight: hp(2.2),

    fontWeight: "900",

    marginBottom: hp(0.7),

    fontFamily: Typography?.bold,
  },

  summaryText: {
    color: "#64748b",

    fontSize: RF(10.5),

    lineHeight: hp(2.1),

    fontWeight: "500",

    fontFamily: Typography?.regular,
  },

  /* ================= SECTION CARD ================= */

  sectionCard: {
    backgroundColor: "#fff",

    borderWidth: 1,

    borderColor: "#eee5df",

    borderRadius: wp(3.5),

    paddingHorizontal: wp(4),

    paddingVertical: hp(1.8),

    marginBottom: hp(1.5),

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  /* ================= SECTION HEADER ================= */

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: hp(1.1),
  },

  numberBox: {
    width: wp(8),

    height: wp(8),

    borderRadius: wp(2),

    backgroundColor: "#fff1e7",

    alignItems: "center",

    justifyContent: "center",

    marginRight: wp(2.5),
  },

  numberText: {
    color: ORANGE,

    fontSize: RF(11),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  sectionTitle: {
    flex: 1,

    color: DARK,

    fontSize: RF(15),

    lineHeight: hp(2.5),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  /* ================= CONTENT ================= */

  content: {
    color: TEXT,

    fontSize: RF(11),

    lineHeight: hp(2.5),

    fontWeight: "500",

    fontFamily: Typography?.regular,
  },
});