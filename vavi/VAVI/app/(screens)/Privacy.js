import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function PrivacyScreen() {
  const privacySections = [
    {
      number: "1",
      title: "About Vavi",
      content:
        "Vavi is a technology-enabled platform operated by Ascendant Vavi LLP that facilitates interaction between Users seeking astrology-related consultations and independent Astrologers. Vavi primarily acts as an intermediary and technology platform.",
    },

    {
      number: "2",
      title: "Information We Collect",
      content:
        "Depending on how you use Vavi, we may collect account and identity information such as your name, username, profile photograph, mobile number, email address, date of birth, address, location, account credentials and profile information. For Astrologers, additional information may include identity verification details, PAN, professional information, qualifications, experience, specialization, languages, bank/payment and tax-related information.",
    },

    {
      number: "3",
      title: "Astrology & Consultation Information",
      content:
        "Users may voluntarily provide information such as date, time and place of birth, Kundli or birth-chart information, horoscope details, questions, relationship-related information, career-related information, family-related information and other information shared during consultations. Users should avoid providing unnecessary highly sensitive information.",
    },

    {
      number: "4",
      title: "Communication Information",
      content:
        "Where communication features are available, Vavi may process chat messages, messages between Users and Astrologers, attachments or media, consultation-related communications, customer support communications, reports and complaints. This information may be used for providing services, support, fraud prevention, security, dispute resolution, policy enforcement and legal compliance.",
    },

    {
      number: "5",
      title: "Voice Consultations",
      content:
        "Vavi may provide voice-call functionality between Users and Astrologers. We may process technical and operational information such as call initiation, duration, participants, session identifiers, call status and connection information. Unless expressly disclosed, Vavi does not represent that voice calls are recorded.",
    },

    {
      number: "6",
      title: "Payment Information",
      content:
        "Vavi may process information related to consultation payments, including transaction ID, payment amount, payment status, transaction date and time, payment gateway reference, refund information, chargeback information, commission information and payout information. Payment credentials may be processed directly by authorized third-party payment providers.",
    },

    {
      number: "7",
      title: "Device & Technical Information",
      content:
        "When you access Vavi, we may automatically collect information such as IP address, device type, device model, operating system, browser information, device identifiers, network information, approximate location, language settings, crash reports, error logs and security logs. This information helps us operate, secure and improve the Platform.",
    },

    {
      number: "8",
      title: "Location Information",
      content:
        "Where you provide permission, Vavi may collect location information for Platform functionality, personalization, security, fraud prevention, analytics and location-related features. You may manage location permissions through your device settings.",
    },

    {
      number: "9",
      title: "How We Use Your Information",
      content:
        "We may use information to create and manage accounts, verify Users and Astrologers, facilitate consultations, connect Users with Astrologers, provide chat and voice services, process payments and refunds, process Astrologer payouts, provide customer support, send notifications, improve Platform functionality, detect fraud, prevent abuse, investigate complaints, resolve disputes, enforce our Terms and comply with applicable laws.",
    },

    {
      number: "10",
      title: "Information Shared with Astrologers",
      content:
        "When a User requests a consultation, Vavi may provide the selected Astrologer with information reasonably necessary to conduct the consultation. This may include name, profile information, date, time and place of birth, astrology information, questions submitted by the User and information voluntarily provided during the consultation.",
    },

    {
      number: "11",
      title: "Astrologer Information Available to Users",
      content:
        "To facilitate consultations, Vavi may display certain Astrologer information including display name, profile photograph, specialization, experience, languages, ratings, reviews, consultation pricing, availability and verification status where applicable.",
    },

    {
      number: "12",
      title: "Third-Party Service Providers",
      content:
        "Vavi may use authorized third-party providers for payment processing, cloud hosting, database hosting, authentication, notifications, voice communication, analytics, crash reporting, security, customer support, email/SMS services, fraud prevention and infrastructure management.",
    },

    {
      number: "13",
      title: "Refunds, Cancellations & Payment Disputes",
      content:
        "Vavi may process refunds, cancellations, payment reversals, chargebacks and payment disputes in accordance with applicable policies and law. Information processed for these purposes may include account information, transaction details, consultation details, chat records, voice-session metadata, support communications and complaint information.",
    },

    {
      number: "14",
      title: "Reports, Fraud & Security",
      content:
        "We may process information to identify, investigate and prevent fraud, fake accounts, payment manipulation, fake consultations, account takeover, identity misuse, spam, harassment, abuse, unauthorized access, Platform manipulation and off-platform payment circumvention. Automated systems and manual review processes may be used.",
    },

    {
      number: "15",
      title: "Legal Disclosures",
      content:
        "We may disclose information where reasonably necessary to comply with applicable law, respond to lawful government requests or court orders, prevent fraud, investigate suspected illegal activity, protect Users, protect Ascendant Vavi LLP and Platform infrastructure, enforce agreements or protect public safety.",
    },

    {
      number: "16",
      title: "Data Security",
      content:
        "We use reasonable technical, administrative and organizational safeguards designed to protect information against unauthorized access, disclosure, alteration, destruction and misuse. However, no electronic system, server, application or internet transmission can be guaranteed to be completely secure.",
    },

    {
      number: "17",
      title: "Data Retention",
      content:
        "Vavi retains personal data only for as long as reasonably necessary for the purpose for which it was collected or processed, including providing Platform services, maintaining accounts, processing transactions, legal compliance, fraud prevention, dispute resolution and Platform security. Certain information may be retained longer where required or permitted by law.",
    },

    {
      number: "18",
      title: "Account Deletion",
      content:
        "Users and Astrologers may request deletion of their account through available Platform functionality or by contacting Vavi. Deletion requests may be subject to identity verification. Certain information may still be retained where required or permitted by law for tax, accounting, fraud prevention, dispute resolution, security or legal compliance.",
    },

    {
      number: "19",
      title: "Data Correction",
      content:
        "Where supported by applicable law and Platform functionality, you may request correction of inaccurate or incomplete personal information. Vavi may verify the identity of the requester before processing such requests.",
    },

    {
      number: "20",
      title: "Children's Privacy",
      content:
        "Vavi is not intended for persons who are not legally capable of entering into applicable agreements. We do not knowingly seek to collect personal information from children in violation of applicable law.",
    },

    {
      number: "21",
      title: "Cookies & Similar Technologies",
      content:
        "TheVavi.com may use cookies and similar technologies for authentication, security, preferences, analytics, performance, website functionality and fraud prevention. You may control cookies through your browser settings, although disabling certain cookies may affect website functionality.",
    },

    {
      number: "22",
      title: "Marketing Communications",
      content:
        "Where permitted by applicable law, Vavi may send service notifications, transactional communications, security alerts, product updates and promotional communications. You may opt out of promotional communications through available unsubscribe or account settings. Essential service and security communications may continue.",
    },

    {
      number: "23",
      title: "Data Transfers",
      content:
        "Information may be processed or stored using infrastructure located in India or other jurisdictions, subject to applicable law. Where information is transferred across jurisdictions, Vavi will take reasonable steps required by applicable law to protect the information.",
    },

    {
      number: "24",
      title: "Astrologer Confidentiality",
      content:
        "Astrologers may receive User information solely for providing consultations. Astrologers are expected to keep User information confidential, use it only for legitimate Platform purposes, not sell or publish it, not misuse it, not use it for unauthorized marketing and not use it to circumvent Vavi.",
    },

    {
      number: "25",
      title: "User Responsibility",
      content:
        "Users are responsible for information they voluntarily provide to Astrologers. Users should never provide OTPs, UPI PINs, card PINs, banking passwords, internet banking credentials, authentication codes or passwords to another person.",
    },

    {
      number: "26",
      title: "No Sale of Personal Information",
      content:
        "Vavi does not intentionally sell personal information as a standalone commercial product. However, information may be processed or shared with authorized service providers, payment processors, infrastructure providers or other parties where reasonably necessary to operate the Platform or comply with applicable law.",
    },

    {
      number: "27",
      title: "Third-Party Websites & Services",
      content:
        "Vavi may contain links or integrations with third-party services. Third-party services operate under their own terms and privacy policies. Vavi is not responsible for the independent privacy practices of third parties.",
    },

    {
      number: "28",
      title: "Privacy Rights",
      content:
        "Subject to applicable law, you may have rights relating to your personal information, including requesting access, correction or deletion where legally permissible, withdrawing consent where applicable, raising privacy concerns and submitting complaints regarding processing of personal information.",
    },

    {
      number: "29",
      title: "Withdrawal of Consent",
      content:
        "Where processing of personal data is based on consent, you may withdraw consent through available privacy or account settings or by emailing privacy@thevavi.com. Withdrawal of consent does not affect processing carried out before withdrawal and may affect access to features that require the relevant personal data.",
    },

    {
      number: "30",
      title: "Privacy Complaints",
      content:
        "Users and Astrologers may submit privacy-related requests, grievances or complaints by contacting privacy@thevavi.com. Vavi may request reasonable information to verify the requester, identify the relevant account and investigate the grievance. Eligible complaints will be handled in accordance with applicable legal requirements.",
    },

    {
      number: "31",
      title: "Policy Changes",
      content:
        "We may update this Privacy Policy from time to time. Where appropriate, material changes may be communicated through App notifications, website notices, email or other reasonable means. The updated Privacy Policy will become effective on the date stated in the updated version.",
    },

    {
      number: "32",
      title: "Governing Law",
      content:
        "This Privacy Policy shall be interpreted in accordance with the applicable laws of India, subject to mandatory legal rights and requirements that cannot legally be excluded or restricted.",
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
              Privacy & Data Protection
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            Privacy Policy
          </Text>

          <Text style={styles.subtitle}>
            Your privacy matters to us. Learn how Vavi collects,
            uses, protects and manages your information.
          </Text>
        </View>

        {/* =================================
            INTRO CARD
        ================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Your Privacy at Vavi
          </Text>

          <Text style={styles.sectionContent}>
            This Privacy Policy explains how{" "}
            <Text style={styles.boldText}>
              Ascendant Vavi LLP
            </Text>
            , operating the Vavi platform, collects, uses, stores,
            processes, shares and protects information relating to
            individuals who access or use Vavi.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            This policy applies to the Vavi User Application, Vavi
            Astrologer Application, theVavi.com website, dashboards
            and related services and technologies.
          </Text>
        </View>

        {/* =================================
            ALL PRIVACY SECTIONS
        ================================== */}

        {privacySections.map((section) => (
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

        {/* Bottom spacing */}
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
    backgroundColor: "#f7591a",
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
      WHITE CARD
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
      SECTION TEXT
  ================================== */

  sectionContent: {
    fontSize: RF(14),
    lineHeight: RF(24),
    fontWeight: "400",
    color: "#405579",
  },

  sectionContentSpacing: {
    fontSize: RF(14),
    lineHeight: RF(24),
    fontWeight: "400",
    color: "#405579",
    marginTop: hp(1.8),
  },

  boldText: {
    fontWeight: "700",
    color: "#24140E",
  },

  bottomSpace: {
    height: hp(3),
  },
});