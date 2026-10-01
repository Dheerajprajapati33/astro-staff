import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { useGetAppContentQuery } from "../../redux/appContentApi";
import { hp, RF, wp } from "../../utils/responsive";

export default function TermsScreen() {
  // API kept as requested
  const { data, isLoading, isError, refetch } =
    useGetAppContentQuery("terms_conditions");

  const termsSections = [
    {
      number: "1",
      title: "About Vavi",
      content:
        "Vavi is a technology-enabled platform operated by Ascendant Vavi LLP. The Platform connects Users with independent Astrologers and provides features such as registration, astrologer discovery, chat, voice consultations, payments, reviews, ratings, notifications and customer support. Vavi generally does not provide astrology consultations itself.",
    },

    {
      number: "2",
      title: "Acceptance of Terms",
      content:
        "By registering, accessing, browsing, making a payment, accepting a consultation, providing a consultation, or otherwise using Vavi, you acknowledge that you have read, understood and agreed to these Terms and Conditions, subject to applicable law.",
    },

    {
      number: "3",
      title: "Eligibility",
      content:
        "You may use Vavi only if you are legally capable of entering into a binding agreement under applicable law. You agree that the information provided by you is accurate, that you are legally eligible to use the Platform, and that you will comply with applicable laws and these Terms.",
    },

    {
      number: "4",
      title: "Account Registration & Security",
      content:
        "Users may be required to provide information such as name, mobile number, email, date of birth, profile information and location. You are responsible for keeping your information accurate and your account secure. Fake accounts, impersonation, fraudulent information, sharing login credentials or unauthorized account use are prohibited.",
    },

    {
      number: "5",
      title: "Astrologers & Consultations",
      content:
        "Astrologers available through Vavi are independent service providers. They are responsible for the consultations, opinions, predictions, guidance, remedies and other information they provide. Services may include horoscope analysis, Kundli analysis, birth-chart interpretation, relationship-related astrology, career-related astrology and general astrology guidance.",
    },

    {
      number: "6",
      title: "Astrology Disclaimer",
      content:
        "Astrology is interpretive in nature. Vavi does not guarantee the accuracy of predictions, future events, marriage or relationship outcomes, employment, business success, financial gains, specific results or the effectiveness of remedies. Users are responsible for decisions they make based on consultations.",
    },

    {
      number: "7",
      title: "Professional Advice Disclaimer",
      content:
        "Astrology consultations are not a substitute for medical advice, mental-health treatment, legal advice, financial advice, investment advice or emergency services. Where required, Users should consult an appropriately qualified professional.",
    },

    {
      number: "8",
      title: "Communication & Conduct",
      content:
        "Vavi may provide text chat, voice calls and other communication features. Users and Astrologers must use these features lawfully and respectfully. Harassment, threats, blackmail, extortion, abuse, sexual harassment, unlawful defamation, intimidation and fraudulent manipulation are prohibited.",
    },

    {
      number: "9",
      title: "Free & Promotional Consultations",
      content:
        "Vavi may offer free consultations, introductory minutes, promotional credits, trial periods or discounts. Promotional benefits may have eligibility requirements, usage limits and expiry dates. Promotional benefits generally have no cash value and cannot be transferred, exchanged, withdrawn or redeemed for cash.",
    },

    {
      number: "10",
      title: "Payments & Wallet",
      content:
        "Users may be required to pay consultation charges, platform fees, convenience fees, processing charges, applicable taxes or other disclosed charges. Vavi may also provide a Wallet or platform-credit system. Wallet balances are intended for permitted transactions on Vavi and, subject to applicable law and the Refund & Cancellation Policy, generally cannot be transferred, withdrawn or redeemed for cash.",
    },

    {
      number: "11",
      title: "Consultation Payments",
      content:
        "Payments for paid consultations relate to private, live, one-to-one, real-time consultations between the User and the relevant independent Astrologer. Vavi acts as a technology facilitator and marketplace intermediary. The applicable consultation rate, duration and payment information will be displayed through the Platform.",
    },

    {
      number: "12",
      title: "Commission & Astrologer Earnings",
      content:
        "Vavi may retain commissions or other Platform charges from transactions. Astrologer earnings may be adjusted for commissions, refunds, chargebacks, payment reversals, applicable taxes, statutory deductions, fraudulent or invalid transactions and other applicable adjustments.",
    },

    {
      number: "13",
      title: "Refunds & Cancellations",
      content:
        "Refunds and cancellations are governed by Vavi's applicable Refund & Cancellation Policy. A User is not automatically entitled to a refund merely because they dislike an Astrologer's opinion, disagree with a prediction or do not receive an expected outcome. Refund eligibility may depend on circumstances such as technical failure, payment error, duplicate payment, consultation not delivered, cancellation circumstances or fraudulent transactions.",
    },

    {
      number: "14",
      title: "Off-Platform Transactions",
      content:
        "Astrologers must not intentionally bypass Vavi's commercial systems for transactions originating through the Platform. This includes requesting direct payment, providing personal UPI details or external payment links, redirecting Users to external paid consultations, or circumventing Vavi's commission system.",
    },

    {
      number: "15",
      title: "Privacy & Confidentiality",
      content:
        "Astrologers may receive User information for providing consultations. Such information must be kept confidential and used only for legitimate consultation purposes. It must not be sold, published, misused or used for unauthorized marketing. Users are also responsible for information they voluntarily disclose during consultations.",
    },

    {
      number: "16",
      title: "Prohibited Conduct",
      content:
        "Users and Astrologers must not commit fraud, create fake accounts, impersonate others, manipulate consultations or ratings, manipulate payments, generate fake transactions, harass or threaten others, attempt unauthorized access, upload malicious software, infringe intellectual-property rights, circumvent Platform security or use Vavi for unlawful purposes.",
    },

    {
      number: "17",
      title: "Reviews & Ratings",
      content:
        "Reviews and ratings should be honest and based on genuine experiences. Fake reviews, purchased reviews, rating manipulation, threats relating to ratings and prohibited incentives for ratings are not permitted. Vavi may remove reviews or ratings that violate applicable Platform policies.",
    },

    {
      number: "18",
      title: "Intellectual Property",
      content:
        "The Vavi application, website, software, source code, designs, logos, trademarks, graphics, databases, user interface and Platform technology belong to or are licensed to Ascendant Vavi LLP. You may not copy, modify, distribute, reverse engineer, sell, sublicense or commercially exploit Vavi without written permission.",
    },

    {
      number: "19",
      title: "Platform Monitoring",
      content:
        "To maintain Platform quality, improve safety, prevent fraud and abuse, investigate violations, resolve complaints and comply with legal obligations, Vavi may monitor, review, audit, store or process certain Platform communications and activity records, subject to applicable law and the Privacy Policy.",
    },

    {
      number: "20",
      title: "Account Suspension & Termination",
      content:
        "Vavi may suspend, restrict, investigate or temporarily disable an account where it reasonably believes there is fraud, abuse, harassment, misconduct, payment manipulation, security risk, policy violation, false information, illegal activity or a serious User complaint. Accounts may also be terminated for serious or repeated violations.",
    },

    {
      number: "21",
      title: "Third-Party Services & Availability",
      content:
        "Vavi may depend on third-party services such as payment gateways, cloud infrastructure, authentication, voice communication, analytics, notifications, hosting and security services. Vavi does not guarantee uninterrupted or error-free operation. Temporary unavailability may occur due to maintenance, updates, server issues, security incidents, internet failures, third-party failures or force majeure events.",
    },

    {
      number: "22",
      title: "Taxes",
      content:
        "Users and Astrologers are responsible for taxes applicable to their respective transactions and activities. Astrologers are responsible for complying with applicable income-tax, GST, PAN, TDS and other statutory obligations. Vavi may deduct or withhold amounts where required by law.",
    },

    {
      number: "23",
      title: "Disclaimer of Warranties",
      content:
        'To the maximum extent permitted by applicable law, Vavi is provided on an "AS IS" and "AS AVAILABLE" basis. Vavi does not guarantee uninterrupted availability, error-free operation, accuracy of every Platform listing, availability of a particular Astrologer, particular consultation results, particular earnings or particular business outcomes.',
    },

    {
      number: "24",
      title: "Limitation of Liability",
      content:
        "To the maximum extent permitted by applicable law, Ascendant Vavi LLP shall not be liable for indirect, incidental, special, consequential or speculative losses arising from astrology predictions, User decisions, Astrologer conduct, technical failures, third-party services, lost business opportunities or loss of anticipated profits. Nothing excludes liability that cannot legally be excluded.",
    },

    {
      number: "25",
      title: "Indemnification",
      content:
        "To the maximum extent permitted by applicable law, you agree to indemnify and hold harmless Ascendant Vavi LLP, its partners, employees, officers, contractors and service providers against claims, losses, liabilities, damages and reasonable legal expenses arising from your breach of these Terms, fraudulent or illegal conduct, misuse of the Platform, violation of another person's rights, intellectual-property infringement or unauthorized transactions.",
    },

    {
      number: "26",
      title: "Dispute Resolution",
      content:
        "In the event of a dispute, the parties should first make reasonable efforts to resolve the matter amicably through communication with Vavi. Where legally permissible, unresolved disputes may be referred to arbitration.",
    },

    {
      number: "27",
      title: "Governing Law & Jurisdiction",
      content:
        "These Terms are governed by the laws of India. Subject to applicable arbitration provisions, mandatory statutory rights and consumer protection laws, courts having competent jurisdiction in Delhi, India shall have jurisdiction over matters requiring judicial intervention.",
    },

    {
      number: "28",
      title: "Changes to These Terms",
      content:
        "Vavi may modify these Terms from time to time. Material changes may be communicated through App notifications, website notices, email or other reasonable methods. Updated Terms will state their effective date. Continued use of Vavi after the effective date constitutes acceptance of the updated Terms to the extent permitted by applicable law.",
    },

    {
      number: "29",
      title: "Entire Agreement",
      content:
        "These Terms, together with the applicable Privacy Policy, Refund & Cancellation Policy, EULA, Astrologer/Partner Agreement, Community Guidelines and other Platform policies, constitute the applicable agreement governing use of Vavi, subject to any separate written agreement between Vavi and an Astrologer.",
    },

    {
      number: "30",
      title: "Force Majeure",
      content:
        "Vavi shall not be responsible for delay or failure caused by circumstances beyond its reasonable control, including natural disasters, government actions, internet outages, telecommunications failures, cloud infrastructure failures, cyber incidents, power failures, third-party service outages, war, civil unrest and other force majeure events.",
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
              Legal Information
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            Terms & Conditions
          </Text>

          <Text style={styles.subtitle}>
            Please read these Terms carefully before accessing
            or using the Vavi Platform.
          </Text>
        </View>

        {/* =================================
            INTRO CARD
        ================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Welcome to Vavi
          </Text>

          <Text style={styles.sectionContent}>
            These Terms and Conditions govern your access to and
            use of the Vavi mobile applications, website and
            related services. Vavi is operated by{" "}
            <Text style={styles.boldText}>
              Ascendant Vavi LLP.
            </Text>
          </Text>

          <Text style={styles.sectionContentSpacing}>
            By registering, accessing, browsing, making a payment,
            accepting a consultation, providing a consultation or
            otherwise using Vavi, you agree to these Terms, subject
            to applicable law.
          </Text>
        </View>

        {/* =================================
            TERMS SECTIONS
        ================================== */}

        {termsSections.map((section) => (
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
    backgroundColor: "#f35a1e",
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
      CARD
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
      TITLE
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