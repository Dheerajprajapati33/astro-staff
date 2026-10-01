import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetAppContentQuery } from "../../redux/appContentApi";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function RefundPolicyScreen() {
  // API kept as requested
  const { data, isLoading, isError, refetch } =
    useGetAppContentQuery("refund_policy");

  const refundSections = [
    {
      number: "1",
      title: "General Refund Principle",
      content:
        "Vavi facilitates astrology-related consultations between Users and independent Astrologers. Refunds are not automatically available for every completed or partially completed consultation. A refund may be considered where there is a genuine payment, technical, service-delivery or Platform-related issue covered by this Policy.",
    },

    {
      number: "2",
      title: "Astrology Results Are Not Refundable",
      content:
        "Astrology is interpretive and subjective. A refund will not ordinarily be provided simply because a User disagrees with an Astrologer's prediction or opinion, is dissatisfied with guidance, does not receive an expected result, disagrees with a horoscope or Kundli interpretation, believes a remedy was ineffective, or changes their mind after receiving the consultation.",
    },

    {
      number: "3",
      title: "When a Refund May Be Considered",
      content:
        "Subject to verification, a refund, payment reversal, Wallet restoration, Platform credit or another appropriate adjustment may be considered for duplicate payments, payment deducted but service not received, failed transactions not automatically reversed, verified Vavi technical failures, Astrologer-side failures, incorrect automatic deductions or situations where a remedy is required by applicable law.",
    },

    {
      number: "4",
      title: "Chat Consultations",
      content:
        "Where charges are calculated according to chat duration, applicable charges may be deducted based on the rate displayed on the Platform. A completed chat consultation is ordinarily treated as a consumed service. A refund will not ordinarily be provided merely because the User is dissatisfied with the content, opinion, prediction, advice, response style or outcome.",
    },

    {
      number: "5",
      title: "Voice Consultations",
      content:
        "Voice consultation charges may be based on eligible connected consultation time and the rate displayed on the Platform. If a consultation is interrupted because of a verified Vavi Platform failure, Vavi may review call status, connection logs, session identifiers, timestamps and duration records and may restore or refund an eligible unconsumed amount.",
    },

    {
      number: "6",
      title: "User-Side Network or Device Issues",
      content:
        "A refund will not ordinarily be provided when a consultation fails or is interrupted solely because of User-side issues such as internet failure, poor mobile connectivity, Wi-Fi failure, device malfunction, low battery, incorrect permissions, microphone or speaker problems, closing the application, intentionally disconnecting or using an unsupported or improperly configured device.",
    },

    {
      number: "7",
      title: "Astrologer-Side Failure",
      content:
        "If a paid consultation cannot reasonably be delivered because an Astrologer fails to participate, fails to connect, cancels after payment or otherwise does not provide the consultation, Vavi may provide an eligible refund, restore the Wallet amount, offer a replacement consultation, provide Platform credit where accepted or provide another reasonable remedy.",
    },

    {
      number: "8",
      title: "Cancellation by User",
      content:
        "Where the Platform allows cancellation before a consultation begins, cancellation will be processed according to the cancellation functionality displayed in the App. Once a paid consultation has started and service has been provided, cancellation will not ordinarily create an automatic right to a full refund. Any eligible unused or undelivered portion may be reviewed.",
    },

    {
      number: "9",
      title: "Cancellation by Astrologer",
      content:
        "If an Astrologer cancels or fails to provide a paid consultation before meaningful service is delivered, Vavi may reverse the eligible charge, restore the applicable Wallet amount, issue an eligible refund, allow the User to select another Astrologer or provide another appropriate remedy.",
    },

    {
      number: "10",
      title: "Wallet & Platform Credits",
      content:
        "Wallet balances, recharge balances, refund credits, promotional credits, cashback credits and bonus credits may be subject to different rules. Unless required by law or expressly permitted under this Policy, Wallet Credits are non-transferable and cannot ordinarily be withdrawn to a bank account, card, UPI account or other external payment method.",
    },

    {
      number: "11",
      title: "Paid Wallet Recharge",
      content:
        "A successfully completed Wallet recharge will ordinarily be non-refundable once the corresponding value has been correctly credited to the User's account. This does not prevent Vavi from correcting duplicate recharges, failed transactions, incorrect deductions, unauthorized transactions where legally required or other verified payment errors.",
    },

    {
      number: "12",
      title: "Promotional & Free Credits",
      content:
        "Promotional Credits, bonus Credits, complimentary Credits, free consultation minutes, coupons and rewards generally cannot be redeemed for cash, cannot ordinarily be refunded or transferred, and may have an expiry period or promotional conditions. Unused promotional benefits may expire when an account is permanently closed or deleted.",
    },

    {
      number: "13",
      title: "Refund Request Process",
      content:
        "Where available, Users may submit refund requests through Vavi's in-app customer-support functionality. Alternatively, Users may contact info@theVavi.com. A request should ideally include the registered name, mobile number or email, Transaction ID, payment reference, Consultation ID, transaction date, amount, Astrologer name, issue description and relevant supporting screenshots or information.",
    },

    {
      number: "14",
      title: "Refund Review",
      content:
        "Vavi may review payment records, transaction IDs, Wallet ledger records, consultation records, chat records, call logs, voice-call metadata, consultation duration, technical logs, customer-support communications, Astrologer responses and fraud or security indicators to determine refund eligibility.",
    },

    {
      number: "15",
      title: "Refund Processing Timeline",
      content:
        "Where a refund is approved following verification, Vavi will ordinarily initiate or process the eligible refund within 7–10 working days from approval or verification of the relevant issue. The time for the amount to appear in the User's bank account, card, UPI account, Wallet or other payment instrument may depend on the relevant bank, gateway, card network, app store or payment provider.",
    },

    {
      number: "16",
      title: "Refund Method",
      content:
        "Where reasonably possible, an approved monetary refund will be processed to the original payment method. Depending on the circumstances, Vavi may also provide Wallet restoration, Platform credit, a replacement consultation or another reasonable remedy. Where applicable law requires a monetary refund, a Platform credit will not replace it without the required basis or agreement.",
    },

    {
      number: "17",
      title: "Google Play & Apple App Store Purchases",
      content:
        "Where a purchase is processed directly through Google Play or Apple App Store, the applicable store's billing and refund policies may also apply. Where Google or Apple controls the relevant transaction or refund process, the User may need to submit the request through the applicable app store.",
    },

    {
      number: "18",
      title: "Unauthorized Transactions",
      content:
        "Users should promptly report suspected unauthorized payments or account compromise. Vavi may investigate using account, transaction, device, security and Platform records. Users are responsible for protecting OTPs, passwords, UPI PINs, card PINs, banking credentials, account access and devices.",
    },

    {
      number: "19",
      title: "Chargebacks",
      content:
        "Users should contact Vavi regarding a genuine payment dispute before submitting a duplicate or fraudulent chargeback. Users must not knowingly claim an authorized transaction was unauthorized, seek both a Vavi refund and bank chargeback for the same amount, manipulate consultations for refunds or submit fabricated evidence.",
    },

    {
      number: "20",
      title: "Refund Abuse & Fraud",
      content:
        "Vavi may investigate suspected refund abuse, including repeated fraudulent refund claims, intentionally disconnecting consultations to obtain refunds, multiple accounts created for promotional abuse, fake consultations, manipulated transaction information, collusion, duplicate refund claims and fraudulent chargebacks. Good-faith refund requests are not treated as abuse merely because a refund is requested.",
    },

    {
      number: "21",
      title: "Taxes & Fees",
      content:
        "Where a refund is approved, the treatment of taxes, convenience fees, Platform charges, processing charges and other fees depends on the nature of the charge, whether the service was consumed, payment-provider rules, applicable tax requirements and applicable law.",
    },

    {
      number: "22",
      title: "Third-Party Payment Providers",
      content:
        "Vavi may use payment gateways, banks, UPI providers, card networks, app stores and other payment processors. Vavi is not responsible for delays caused solely by an independent payment provider after an approved refund has been correctly initiated by Vavi.",
    },

    {
      number: "23",
      title: "Policy Updates",
      content:
        "Vavi may update this Refund & Cancellation Policy to reflect Platform changes, new payment features, Wallet functionality, regulatory requirements, app-store requirements, fraud-prevention measures and operational improvements. Material changes may be communicated through the App, website, email or other reasonable means.",
    },

    {
      number: "24",
      title: "Relationship with Other Policies",
      content:
        "This Policy should be read together with the Vavi Terms and Conditions, Privacy Policy, End User License Agreement (EULA), applicable Astrologer/Partner Agreement and other applicable Platform policies. Mandatory legal requirements will prevail where required by law.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================
            HEADER
        ================================== */}

        <View style={styles.headerContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Payments & Support
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            Refund & Cancellation Policy
          </Text>

          <Text style={styles.subtitle}>
            Understand when refunds, cancellations, Wallet
            adjustments and payment reversals may be available
            on Vavi.
          </Text>
        </View>

        {/* =================================
            INTRO CARD
        ================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Before You Request a Refund
          </Text>

          <Text style={styles.sectionContent}>
            Refunds are not automatically available for every
            completed or partially completed consultation. Vavi
            may consider a refund where there is a genuine
            payment, technical, service-delivery or
            Platform-related issue covered by this Policy.
          </Text>

          {/* Important Box */}
          <View style={styles.importantBox}>
            <Text style={styles.importantText}>
              <Text style={styles.importantLabel}>
                Important:
              </Text>{" "}
              Disagreement with an astrology prediction, opinion,
              interpretation, advice or expected result will not
              ordinarily qualify for a refund.
            </Text>
          </View>
        </View>

        {/* =================================
            SUMMARY CARDS
        ================================== */}

        <View style={styles.summaryContainer}>
          {/* Refund May Apply */}
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.iconBox,
                styles.successIconBox,
              ]}
            >
              <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.summaryTitle}>
              Refund May Apply
            </Text>

            <Text style={styles.summaryText}>
              Duplicate payment, verified technical failure,
              undelivered consultation or eligible payment error.
            </Text>
          </View>

          {/* Refund Timeline */}
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.iconBox,
                styles.paymentIconBox,
              ]}
            >
              <Text style={styles.paymentIcon}>₹</Text>
            </View>

            <Text style={styles.summaryTitle}>
              Refund Timeline
            </Text>

            <Text style={styles.summaryText}>
              Approved refunds are ordinarily initiated or
              processed within 7–10 working days.
            </Text>
          </View>

          {/* Not Automatically Refundable */}
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.iconBox,
                styles.warningIconBox,
              ]}
            >
              <Text style={styles.warningIcon}>!</Text>
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

        {/* =================================
            ALL POLICY SECTIONS
        ================================== */}

        {refundSections.map((section) => (
          <View
            key={section.number}
            style={styles.card}
          >
            <Text style={styles.sectionTitle}>
              {section.number}. {section.title}
            </Text>

            <Text style={styles.sectionContent}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background || "#FFF8F4",
  },

  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },

  /* =================================
      HEADER
  ================================== */

  headerContainer: {
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
    paddingBottom: hp(3),
  },

  badge: {
    backgroundColor: "#f15a1e",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.9),
    borderRadius: wp(6),
    marginBottom: hp(1.8),
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: RF(13.5),
    fontWeight: "700",
  },

  mainTitle: {
    fontSize: RF(30),
    fontWeight: "800",
    color: "#3A2117",
    textAlign: "center",
    marginBottom: hp(1.2),
  },

  subtitle: {
    fontSize: RF(14),
    lineHeight: RF(21),
    fontWeight: "400",
    color: "#405579",
    textAlign: "center",
    paddingHorizontal: wp(2),
  },

  /* =================================
      COMMON CARD
  ================================== */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),

    marginBottom: hp(2),

    borderWidth: 1,
    borderColor: "#E9E2DD",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,

    elevation: 3,
  },

  /* =================================
      SECTION TITLE
  ================================== */

  sectionTitle: {
    fontSize: RF(20),
    lineHeight: RF(28),
    fontWeight: "700",
    color: "#24140E",
    marginBottom: hp(1.4),
  },

  /* =================================
      CONTENT
  ================================== */

  sectionContent: {
    fontSize: RF(14),
    lineHeight: RF(24),
    fontWeight: "400",
    color: "#405579",
  },

  /* =================================
      IMPORTANT BOX
  ================================== */

  importantBox: {
    marginTop: hp(2),

    backgroundColor: "#FFF7ED",

    borderWidth: 1,
    borderColor: "#FFDDB5",

    borderRadius: wp(4),

    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },

  importantText: {
    fontSize: RF(13.5),
    lineHeight: RF(22),
    color: "#4A2A16",
  },

  importantLabel: {
    fontWeight: "800",
    color: "#24140E",
  },

  /* =================================
      SUMMARY CARDS
  ================================== */

  summaryContainer: {
    width: "100%",
    marginBottom: hp(2),
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),

    marginBottom: hp(1.5),

    borderWidth: 1,
    borderColor: "#E9E2DD",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,

    elevation: 3,
  },

  /* =================================
      ICON BOX
  ================================== */

  iconBox: {
    width: wp(10),
    height: wp(10),

    borderRadius: wp(3),

    alignItems: "center",
    justifyContent: "center",

    marginBottom: hp(1.8),
  },

  successIconBox: {
    backgroundColor: "#D9FBE7",
  },

  paymentIconBox: {
    backgroundColor: "#FFF0D9",
  },

  warningIconBox: {
    backgroundColor: "#FFE0E0",
  },

  successIcon: {
    fontSize: RF(20),
    fontWeight: "700",
    color: "#16A34A",
  },

  paymentIcon: {
    fontSize: RF(18),
    fontWeight: "700",
    color: "#F59E0B",
  },

  warningIcon: {
    fontSize: RF(20),
    fontWeight: "700",
    color: "#EF4444",
  },

  /* =================================
      SUMMARY TEXT
  ================================== */

  summaryTitle: {
    fontSize: RF(16),
    lineHeight: RF(22),
    fontWeight: "700",
    color: "#24140E",
    marginBottom: hp(0.8),
  },

  summaryText: {
    fontSize: RF(13),
    lineHeight: RF(20),
    fontWeight: "400",
    color: "#405579",
  },

  bottomSpace: {
    height: hp(3),
  },
});