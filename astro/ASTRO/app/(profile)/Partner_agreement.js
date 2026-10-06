import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#F97316";
const DARK = "#171717";
const TEXT = "#333333";
const MUTED = "#666666";
const LIGHT_BG = "#F7F7F7";
const BORDER = "#E8E8E8";
const WHITE = "#FFFFFF";

/* =========================================================
   PARTNER AGREEMENT DATA
   41 SECTIONS
========================================================= */

const AGREEMENT_DATA = [
  {
    number: "01",
    title: "Platform Role",
    content: [
      "Vavi is a technology-enabled platform that connects Users seeking astrology-related consultations with independent Astrologers.",
      "The Platform may provide astrologer registration, profiles, chat, voice consultations, pricing, earnings, payouts, ratings, notifications, support and security features.",
      "Vavi does not guarantee any minimum number of Users, consultations or earnings.",
    ],
  },

  {
    number: "02",
    title: "Independent Astrologer Status",
    content: [
      "Astrologers using Vavi operate as independent service providers.",
      "The term Partner does not create a legal partnership, employment relationship, agency, joint venture, franchise or employer-employee relationship with Ascendant Vavi LLP.",
      "Astrologers remain responsible for their consultations, conduct, qualifications, taxes and statutory obligations.",
    ],
  },

  {
    number: "03",
    title: "Eligibility",
    content: [
      "To register as an Astrologer, you must:",
      "• Be legally capable of entering into a binding agreement",
      "• Provide accurate information and genuine documents",
      "• Have the experience or knowledge represented on your profile",
      "• Comply with applicable laws and Vavi policies.",
    ],
  },

  {
    number: "04",
    title: "Verification & KYC",
    content: [
      "Vavi may request information including:",
      "• Name",
      "• Mobile number",
      "• Email",
      "• Address",
      "• Photograph",
      "• Identity documents",
      "• PAN",
      "• Bank details",
      "• Qualifications",
      "• Experience",
      "• Languages",
      "• Specializations",
      "• Tax-related information",
      "All submitted information and documents must be genuine and accurate.",
    ],
  },

  {
    number: "05",
    title: "Astrologer Profile",
    content: [
      "Astrologers are responsible for keeping their profile information accurate.",
      "You must not:",
      "• Use another person's photograph",
      "• Misrepresent your identity or experience",
      "• Claim qualifications you do not possess",
      "• Provide false certifications",
      "• Display misleading consultation information",
      "• Guarantee astrology results.",
    ],
  },

  {
    number: "06",
    title: "Astrology Services",
    content: [
      "Permitted services may include:",
      "• Horoscope analysis",
      "• Kundli analysis",
      "• Birth-chart interpretation",
      "• Relationship and marriage-related astrology",
      "• Career-related astrology",
      "• General astrology guidance",
      "• Other services supported by Vavi.",
    ],
  },

  {
    number: "07",
    title: "No Guaranteed Results",
    content: [
      "Astrology is interpretive in nature.",
      "Astrologers must not guarantee:",
      "• Marriage",
      "• Relationship outcomes",
      "• Pregnancy",
      "• Career success",
      "• Jobs or promotions",
      "• Business success",
      "• Financial gain",
      "• Lottery or gambling results",
      "• Legal outcomes",
      "• Medical recovery",
      "• Remedy effectiveness",
      "• Any specific future event.",
    ],
  },

  {
    number: "08",
    title: "Professional Advice Disclaimer",
    content: [
      "Astrology consultations must not be represented as a guaranteed substitute for:",
      "• Medical treatment",
      "• Mental-health treatment",
      "• Legal advice",
      "• Financial advice",
      "• Investment advice",
      "• Emergency services",
      "Where appropriate, Users should be encouraged to consult qualified professionals.",
    ],
  },

  {
    number: "09",
    title: "Professional Conduct",
    content: [
      "Astrologers must communicate respectfully and professionally.",
      "The following are prohibited:",
      "• Abuse",
      "• Threats",
      "• Harassment",
      "• Blackmail",
      "• Extortion",
      "• Sexual harassment",
      "• Intimidation",
      "• Stalking",
      "• Unlawful defamation",
      "• Manipulation",
      "• Encouragement of illegal activity",
      "• Inappropriate content.",
    ],
  },

  {
    number: "10",
    title: "No Fear-Based Practices",
    content: [
      "Astrologers must not use fear or pressure to obtain money from Users.",
      "You must not knowingly claim that payment is urgently required to avoid:",
      "• Death",
      "• Illness",
      "• Family harm",
      "• Supernatural harm",
      "• Financial disaster",
      "• Similar consequences",
      "Vulnerable Users must not be exploited for financial gain.",
    ],
  },

  {
    number: "11",
    title: "Consultation Responsibilities",
    content: [
      "After accepting a consultation, Astrologers should make reasonable efforts to provide it professionally.",
      "You must not:",
      "• Intentionally accept consultations while unavailable",
      "• Delay consultations to increase charges",
      "• Artificially extend consultation duration",
      "• Manipulate earnings through disconnects",
      "• Avoid responding after accepting a consultation.",
    ],
  },

  {
    number: "12",
    title: "Availability & Pricing",
    content: [
      "Astrologers should maintain an accurate availability status.",
      "Consultation rates may depend on:",
      "• Category",
      "• Experience",
      "• Promotions",
      "• Platform policies",
      "• Commercial arrangements",
      "Users should only be charged according to rates communicated through the Vavi Platform.",
    ],
  },

  {
    number: "13",
    title: "Commission & Earnings",
    content: [
      "Vavi may deduct applicable commissions or Platform charges from eligible consultation earnings.",
      "Deductions may include:",
      "• Commission",
      "• Platform charges",
      "• Payment-processing charges",
      "• Applicable taxes",
      "• Statutory deductions",
      "• Refund adjustments",
      "• Chargebacks",
      "• Fraudulent transaction adjustments.",
    ],
  },

  {
    number: "14",
    title: "Payouts",
    content: [
      "Eligible Astrologer earnings may be transferred according to Vavi's applicable payout process.",
      "Astrologers must provide accurate:",
      "• Bank details",
      "• PAN",
      "• Identity information",
      "• Tax information",
      "• Other legally required information",
      "Incorrect information may cause payout delays.",
    ],
  },

  {
    number: "15",
    title: "Payout Holds & Reviews",
    content: [
      "Vavi may temporarily hold or delay payouts when reasonably necessary to investigate:",
      "• Fraud",
      "• Fake consultations",
      "• Refunds",
      "• Chargebacks",
      "• Payment disputes",
      "• User complaints",
      "• Suspicious transactions",
      "• Policy violations",
      "• Account compromise",
      "• Off-platform payment activity",
      "• Legal requirements.",
    ],
  },

  {
    number: "16",
    title: "Refunds & Earnings Adjustments",
    content: [
      "Where a User becomes eligible for a refund under the applicable Refund & Cancellation Policy, corresponding Astrologer earnings may be adjusted where appropriate.",
      "This may include:",
      "• Consultation no-shows",
      "• Verified Astrologer-side failures",
      "• Fraudulent consultations",
      "• Incorrect charging",
      "• Payment reversals.",
    ],
  },

  {
    number: "17",
    title: "Fake Consultations & Manipulation",
    content: [
      "Astrologers must not create or participate in artificial transactions.",
      "Prohibited activities include:",
      "• Fake User accounts",
      "• Self-booking",
      "• Coordinated fake consultations",
      "• Fake payments",
      "• Manipulation of consultation duration",
      "• Manipulation of earnings",
      "• Manipulation of reviews",
      "• Manipulation of ratings",
      "• Manipulation of promotional benefits.",
    ],
  },

  {
    number: "18",
    title: "Off-Platform Payments",
    content: [
      "Astrologers must not bypass Vavi's payment or commercial systems for Users obtained through Vavi.",
      "This includes requesting:",
      "• Personal UPI payments",
      "• Direct bank transfers",
      "• External payment links",
      "• Cash payments",
      "• Paid WhatsApp consultations",
      "• Paid Telegram consultations",
      "• Paid consultations through another platform",
      "for the purpose of avoiding Vavi systems or commission.",
    ],
  },

  {
    number: "19",
    title: "Contact Information Exchange",
    content: [
      "Vavi may restrict unauthorized sharing or solicitation of:",
      "• Mobile numbers",
      "• WhatsApp numbers",
      "• Personal email addresses",
      "• Telegram accounts",
      "• Social-media handles",
      "• UPI details",
      "• Bank details",
      "• External payment links",
      "to protect Users, Astrologers and the Platform.",
    ],
  },

  {
    number: "20",
    title: "Personal Contact & Off-Platform Contact",
    content: [
      "Astrologers must not directly or indirectly share, request, exchange, collect or solicit a User's personal contact information for communicating, consulting or transacting outside Vavi.",
      "A verified violation may result in a contractual penalty of ₹50,000, to the extent permitted by applicable law, in addition to other available remedies.",
    ],
  },

  {
    number: "21",
    title: "User Data & Confidentiality",
    content: [
      "Astrologers may receive User information necessary to provide consultations.",
      "Such information must remain confidential.",
      "You must not:",
      "• Sell User information",
      "• Publish private information",
      "• Share consultation screenshots or chats with unauthorized persons",
      "• Use User information for unrelated marketing",
      "• Contact Users for unauthorized commercial purposes.",
    ],
  },

  {
    number: "22",
    title: "Privacy & Data Protection",
    content: [
      "User information must only be used for legitimate consultation and Platform purposes.",
      "Astrologers must comply with applicable privacy and data-protection requirements and the Vavi Privacy Policy.",
    ],
  },

  {
    number: "23",
    title: "Chat & Call Monitoring",
    content: [
      "To maintain quality, prevent fraud, investigate complaints, resolve disputes, enforce Platform rules and maintain safety, Vavi may monitor, audit, review or process certain Platform activity.",
      "This may include:",
      "• Chat records",
      "• Consultation records",
      "• Call logs",
      "• Call metadata",
      "• Payment records",
      "• Complaint records",
      "• Support communications.",
    ],
  },

  {
    number: "24",
    title: "Call Recording & Record Retention",
    content: [
      "Vavi may maintain call logs and technical call metadata.",
      "Unless expressly disclosed, Vavi does not represent that voice-call audio is recorded.",
      "Chat, call, consultation, payment, complaint, support and related technical records may be retained as reasonably necessary for:",
      "• Platform operations",
      "• Security",
      "• Investigations",
      "• Disputes",
      "• Legal compliance.",
    ],
  },

  {
    number: "25",
    title: "Ratings & Reviews",
    content: [
      "Astrologers must not:",
      "• Create fake reviews",
      "• Purchase reviews",
      "• Threaten Users for better ratings",
      "• Offer prohibited incentives",
      "• Manipulate ratings",
      "• Create accounts to review themselves",
      "Vavi may remove reviews that violate Platform policies.",
    ],
  },

  {
    number: "26",
    title: "Astrologer Content",
    content: [
      "Astrologers may upload:",
      "• Profile photographs",
      "• Biographies",
      "• Qualifications",
      "• Experience",
      "• Specializations",
      "• Other profile materials",
      "You represent that you have the necessary rights to use uploaded content.",
      "Vavi may use approved profile content to operate, display and reasonably promote the Platform and Astrologer profiles.",
    ],
  },

  {
    number: "27",
    title: "Account Security",
    content: [
      "Astrologers are responsible for protecting:",
      "• OTPs",
      "• Passwords",
      "• Login credentials",
      "• Devices",
      "• Account access",
      "Unauthorized access should be reported to Vavi immediately.",
      "Astrologer accounts must not be sold, rented, transferred or knowingly shared with unauthorized persons.",
    ],
  },

  {
    number: "28",
    title: "Prohibited Activities",
    content: [
      "Astrologers must not:",
      "• Commit fraud",
      "• Create fake accounts",
      "• Impersonate others",
      "• Manipulate payments or consultations",
      "• Manipulate ratings",
      "• Misuse User data",
      "• Circumvent Platform security",
      "• Attempt unauthorized access",
      "• Upload malicious software",
      "• Engage in unlawful activities",
      "• Intentionally bypass Vavi's commercial systems.",
    ],
  },

  {
    number: "29",
    title: "Account Suspension & Termination",
    content: [
      "Vavi may suspend, restrict or temporarily disable an Astrologer account where it reasonably believes there is:",
      "• Fraud",
      "• Abuse",
      "• Harassment",
      "• Data misuse",
      "• Payment manipulation",
      "• Fake consultations",
      "• Security risk",
      "• Serious User complaints",
      "• False information",
      "• Policy violations",
      "• Illegal activity",
      "Serious or repeated violations may result in termination.",
    ],
  },

  {
    number: "30",
    title: "Account Closure & Taxes",
    content: [
      "Astrologers may request account closure through available Platform functionality or by contacting Vavi.",
      "Account closure does not automatically cancel:",
      "• Pending refunds",
      "• Chargebacks",
      "• Payment adjustments",
      "• Tax obligations",
      "• Investigations",
      "• Confidentiality obligations",
      "Astrologers remain responsible for applicable taxes and statutory requirements.",
    ],
  },

  {
    number: "31",
    title: "Intellectual Property",
    content: [
      "The Vavi App, website, software, source code, designs, logos, trademarks, databases, user interface and technology belong to or are licensed to Ascendant Vavi LLP.",
      "Astrologers may not:",
      "• Copy",
      "• Reverse engineer",
      "• Sell",
      "• Reproduce",
      "• Commercially exploit",
      "Vavi technology without authorization.",
    ],
  },

  {
    number: "32",
    title: "Astrologer-Generated Content",
    content: [
      "To the extent permitted by applicable law, custom remedies, Kundli notes, personalized consultation notes, written analyses, reports, recommendations and other content specifically created for services through Vavi may be owned by or assigned to Ascendant Vavi LLP.",
      "Pre-existing intellectual property created independently before Vavi remains with the Astrologer, subject to the rights necessary for applicable Platform use.",
    ],
  },

  {
    number: "33",
    title: "Third-Party Services & Availability",
    content: [
      "Vavi may use third-party services for:",
      "• Payments",
      "• Hosting",
      "• Authentication",
      "• Voice communication",
      "• Notifications",
      "• Analytics",
      "• Security",
      "Vavi does not guarantee uninterrupted operation of third-party services or continuous availability of every Platform feature or consultation request.",
    ],
  },

  {
    number: "34",
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, Vavi will not be liable for indirect, incidental, consequential or speculative losses arising solely from:",
      "• Reduced consultation volume",
      "• Loss of anticipated earnings",
      "• User decisions",
      "• Ratings or reviews",
      "• Internet failure",
      "• Third-party service failure",
      "• Temporary Platform downtime",
      "• Astrology outcomes.",
    ],
  },

  {
    number: "35",
    title: "Indemnification",
    content: [
      "To the extent permitted by applicable law, an Astrologer may be responsible for claims, losses or legal expenses arising from their own:",
      "• Fraud",
      "• Illegal activity",
      "• Material breach of this Agreement",
      "• Misuse of User information",
      "• False representations",
      "• Harassment",
      "• Intellectual-property infringement",
      "• Unauthorized transactions.",
    ],
  },

  {
    number: "36",
    title: "Platform Changes",
    content: [
      "Vavi may introduce, remove or modify:",
      "• Features",
      "• Pricing models",
      "• Consultation functionality",
      "• Commission structures",
      "• Payout systems",
      "• Platform policies",
      "Material commercial changes may be communicated through reasonable means.",
    ],
  },

  {
    number: "37",
    title: "Electronic Acceptance",
    content: [
      "No physical signature is required unless Vavi separately requests one.",
      "This Agreement may be accepted electronically by:",
      "• Clicking \"I Agree\"",
      "• Clicking \"Accept & Continue\"",
      "• Completing onboarding",
      "• Creating an Astrologer account",
      "• Providing consultations after being presented with the Agreement",
      "• Continuing to use the Astrologer Platform.",
    ],
  },

  {
    number: "38",
    title: "Other Vavi Policies",
    content: [
      "This Agreement should be read together with:",
      "• Vavi Terms and Conditions",
      "• Vavi Privacy Policy",
      "• Vavi Refund & Cancellation Policy",
      "• Vavi EULA",
      "• Applicable Community or Platform Guidelines.",
    ],
  },

  {
    number: "39",
    title: "Changes to This Agreement",
    content: [
      "Vavi may modify this Agreement from time to time.",
      "Material changes may be communicated through:",
      "• App notifications",
      "• Email",
      "• Website notices",
      "• Astrologer dashboard",
      "• Other reasonable means",
      "The updated version will state its effective date.",
    ],
  },

  {
    number: "40",
    title: "Dispute Resolution",
    content: [
      "The parties should first make reasonable efforts to resolve disputes amicably through written communication.",
      "Where legally permissible, unresolved disputes may be referred to arbitration.",
      "The seat and venue of arbitration are Delhi, India.",
      "The language is English.",
      "The governing law is the laws of India.",
    ],
  },

  {
    number: "41",
    title: "Jurisdiction",
    content: [
      "Subject to applicable arbitration provisions and mandatory applicable law, courts having competent jurisdiction in Delhi, India shall have jurisdiction over matters requiring judicial intervention.",
    ],
  },
];

/* =========================================================
   POLICY SECTION
========================================================= */

const AgreementSection = ({ item }) => {
  return (
    <View style={styles.policyCard}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>

      <View style={styles.policyContent}>
        <Text style={styles.policyTitle}>
          {item.title}
        </Text>

        {item.content.map((line, index) => {
          const isBullet = line.trim().startsWith("•");

          return (
            <View
              key={`${item.number}-${index}`}
              style={
                isBullet
                  ? styles.bulletRow
                  : styles.paragraphRow
              }
            >
              {isBullet && (
                <View style={styles.orangeDot} />
              )}

              <Text
                style={[
                  styles.policyText,
                  isBullet && styles.bulletText,
                ]}
              >
                {isBullet
                  ? line.replace(/^•\s*/, "")
                  : line}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function Partner_agreement() {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={RF(23)}
              color={DARK}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Partner Agreement
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >

          {/* HERO ICON */}
          <View style={styles.heroIconContainer}>
            <View style={styles.heroIconCircle}>
              <Ionicons
                name="document-text-outline"
                size={RF(34)}
                color={ORANGE}
              />
            </View>
          </View>

          {/* TITLE */}
          <Text style={styles.mainTitle}>
            Astrologer Partner Agreement
          </Text>

          <Text style={styles.mainSubtitle}>
            Terms governing registration, onboarding and use
            of the Vavi Astrologer Platform by independent
            Astrologers.
          </Text>

          {/* ABOUT */}
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <View style={styles.aboutIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={RF(22)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.aboutTitle}>
                About This Agreement
              </Text>
            </View>

            <Text style={styles.aboutText}>
              This Agreement governs the registration,
              onboarding, access and use of the Vavi
              Astrologer Application and related Platform
              services by Astrologers and service providers.
            </Text>

            <Text style={styles.aboutText}>
              By creating an Astrologer account, completing
              onboarding, submitting documents, accepting
              the Agreement, accepting consultations or
              continuing to use the Vavi Astrologer
              Application, you acknowledge and agree to
              these terms.
            </Text>
          </View>

          {/* IMPORTANT */}
          <View style={styles.importantCard}>
            <View style={styles.importantIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={RF(23)}
                color={ORANGE}
              />
            </View>

            <View style={styles.importantContent}>
              <Text style={styles.importantTitle}>
                Important
              </Text>

              <Text style={styles.importantText}>
                Astrologers operate as independent service
                providers. This Agreement does not create an
                employment, partnership, agency or joint
                venture relationship with Ascendant Vavi LLP.
              </Text>
            </View>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryGrid}>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="person-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                Independent
              </Text>

              <Text style={styles.summaryText}>
                Astrologers operate as independent service
                providers.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                KYC Required
              </Text>

              <Text style={styles.summaryText}>
                Accurate identity, qualification and payout
                information may be required.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="cash-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                Earnings & Payouts
              </Text>

              <Text style={styles.summaryText}>
                Eligible consultation earnings follow
                Vavi's payout process.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                Privacy & Security
              </Text>

              <Text style={styles.summaryText}>
                User information and Platform access must
                be handled responsibly.
              </Text>
            </View>

          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />

            <Text style={styles.sectionHeaderText}>
              AGREEMENT DETAILS
            </Text>

            <View style={styles.sectionLine} />
          </View>

          <Text style={styles.detailsTitle}>
            Astrologer Partner Terms
          </Text>

          <Text style={styles.detailsSubtitle}>
            All 41 sections of the Vavi Astrologer /
            Partner Agreement are included below.
          </Text>

          {/* ALL AGREEMENT SECTIONS */}
          {AGREEMENT_DATA.map((item) => (
            <AgreementSection
              key={item.number}
              item={item}
            />
          ))}

          {/* CONTACT */}
          <View style={styles.contactCard}>

            <View style={styles.contactIconCircle}>
              <Ionicons
                name="mail-outline"
                size={RF(30)}
                color={WHITE}
              />
            </View>

            <Text style={styles.contactTitle}>
              Partner Agreement Contact
            </Text>

            <Text style={styles.contactDescription}>
              For questions relating to the Astrologer /
              Partner Agreement, contact Vavi using the
              details below.
            </Text>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                Company
              </Text>

              <Text style={styles.contactValue}>
                Ascendant Vavi LLP
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                Brand
              </Text>

              <Text style={styles.contactValue}>
                Vavi
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                Website
              </Text>

              <Text style={styles.contactValue}>
                theVavi.com
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                General Email
              </Text>

              <Text style={styles.contactValue}>
                info@theVavi.com
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                Legal / Grievance Email
              </Text>

              <Text style={styles.contactValue}>
                legal@theVavi.com
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>
                Privacy Email
              </Text>

              <Text style={styles.contactValue}>
                privacy@theVavi.com
              </Text>
            </View>

            <View style={styles.contactDivider} />

            <Text style={styles.registeredLabel}>
              Registered Office
            </Text>

            <Text style={styles.registeredValue}>
              S1 - SF-232, CLOUD-9, Vaishali,
              Ghaziabad, U.P.
            </Text>

            <Text style={styles.copyright}>
              © 2026 Ascendant Vavi LLP. All Rights Reserved.
            </Text>

          </View>

          <View style={styles.bottomSpace} />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  /* HEADER */

  header: {
    height: hp(7),
    minHeight: 54,
    maxHeight: 68,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: wp(4),
  },

  backButton: {
    width: wp(10),
    height: wp(10),
    maxWidth: 44,
    maxHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: RF(17),
    fontFamily: Typography?.semiBold,
    color: DARK,
    textAlign: "center",
  },

  headerRight: {
    width: wp(10),
    maxWidth: 44,
  },

  /* SCROLL */

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2.5),
    paddingBottom: hp(5),
  },

  /* HERO */

  heroIconContainer: {
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  heroIconCircle: {
    width: wp(18),
    height: wp(18),
    minWidth: 64,
    minHeight: 64,
    maxWidth: 78,
    maxHeight: 78,
    borderRadius: 999,
    backgroundColor: "#FFF1E8",
    borderWidth: 1,
    borderColor: "#FFE0CC",
    alignItems: "center",
    justifyContent: "center",
  },

  mainTitle: {
    fontSize: RF(24),
    fontFamily: Typography?.bold,
    color: DARK,
    textAlign: "center",
    lineHeight: RF(30),
  },

  mainSubtitle: {
    fontSize: RF(13.5),
    fontFamily: Typography?.regular,
    color: MUTED,
    textAlign: "center",
    lineHeight: RF(20),
    marginTop: hp(0.7),
    marginBottom: hp(2.5),
    paddingHorizontal: wp(5),
  },

  /* ABOUT */

  aboutCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: hp(1.5),
  },

  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.2),
  },

  aboutIcon: {
    width: wp(10),
    height: wp(10),
    maxWidth: 42,
    maxHeight: 42,
    borderRadius: 12,
    backgroundColor: "#FFF3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  aboutTitle: {
    flex: 1,
    fontSize: RF(16),
    fontFamily: Typography?.semiBold,
    color: DARK,
  },

  aboutText: {
    fontSize: RF(13.5),
    fontFamily: Typography?.regular,
    color: TEXT,
    lineHeight: RF(21),
    marginBottom: hp(1),
  },

  /* IMPORTANT */

  importantCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8F3",
    borderWidth: 1,
    borderColor: "#FFE0CC",
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    marginBottom: hp(2),
  },

  importantIcon: {
    width: wp(11),
    height: wp(11),
    maxWidth: 46,
    maxHeight: 46,
    borderRadius: 13,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  importantContent: {
    flex: 1,
  },

  importantTitle: {
    fontSize: RF(15),
    fontFamily: Typography?.bold,
    color: DARK,
    marginBottom: hp(0.5),
  },

  importantText: {
    fontSize: RF(13),
    fontFamily: Typography?.regular,
    color: TEXT,
    lineHeight: RF(20),
  },

  /* SUMMARY */

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },

  summaryCard: {
    width: "48.5%",
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: wp(4),
    marginBottom: hp(1.2),
  },

  summaryIcon: {
    width: wp(10),
    height: wp(10),
    maxWidth: 42,
    maxHeight: 42,
    borderRadius: 12,
    backgroundColor: "#FFF3EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },

  summaryTitle: {
    fontSize: RF(15),
    fontFamily: Typography?.bold,
    color: DARK,
    marginBottom: hp(0.4),
  },

  summaryText: {
    fontSize: RF(12.2),
    fontFamily: Typography?.regular,
    color: MUTED,
    lineHeight: RF(18),
  },

  /* DETAILS */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    marginBottom: hp(1),
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },

  sectionHeaderText: {
    fontSize: RF(11),
    fontFamily: Typography?.bold,
    color: ORANGE,
    letterSpacing: 1.2,
    marginHorizontal: wp(3),
  },

  detailsTitle: {
    fontSize: RF(22),
    fontFamily: Typography?.bold,
    color: DARK,
    textAlign: "center",
    marginBottom: hp(0.5),
  },

  detailsSubtitle: {
    fontSize: RF(13),
    fontFamily: Typography?.regular,
    color: MUTED,
    textAlign: "center",
    lineHeight: RF(19),
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
  },

  /* POLICY CARD */

  policyCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: wp(4),
    marginBottom: hp(1.4),
    flexDirection: "row",
  },

  numberBox: {
    width: wp(10.5),
    height: wp(10.5),
    minWidth: 40,
    minHeight: 40,
    maxWidth: 44,
    maxHeight: 44,
    borderRadius: 12,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  numberText: {
    fontSize: RF(11.5),
    fontFamily: Typography?.bold,
    color: ORANGE,
  },

  policyContent: {
    flex: 1,
    minWidth: 0,
  },

  policyTitle: {
    fontSize: RF(15.5),
    fontFamily: Typography?.semiBold,
    color: DARK,
    lineHeight: RF(21),
    marginBottom: hp(1),
  },

  paragraphRow: {
    width: "100%",
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: hp(0.35),
  },

  orangeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ORANGE,
    marginTop: RF(8),
    marginRight: wp(2),
  },

  policyText: {
    fontSize: RF(13.2),
    fontFamily: Typography?.regular,
    color: TEXT,
    lineHeight: RF(20.5),
    marginBottom: hp(0.9),
  },

  bulletText: {
    flex: 1,
    marginBottom: 0,
  },

  /* CONTACT */

  contactCard: {
    backgroundColor: DARK,
    borderRadius: 20,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.8),
    marginTop: hp(2),
  },

  contactIconCircle: {
    width: wp(14),
    height: wp(14),
    maxWidth: 58,
    maxHeight: 58,
    borderRadius: 18,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },

  contactTitle: {
    fontSize: RF(20),
    fontFamily: Typography?.bold,
    color: WHITE,
    lineHeight: RF(26),
    marginBottom: hp(1),
  },

  contactDescription: {
    fontSize: RF(13.2),
    fontFamily: Typography?.regular,
    color: "#D7D7D7",
    lineHeight: RF(20),
  },

  contactDivider: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: hp(2),
  },

  contactRow: {
    marginBottom: hp(1.5),
  },

  contactLabel: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#999999",
    marginBottom: hp(0.3),
  },

  contactValue: {
    fontSize: RF(13.5),
    fontFamily: Typography?.semiBold,
    color: WHITE,
  },

  registeredLabel: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#999999",
    marginBottom: hp(0.4),
  },

  registeredValue: {
    fontSize: RF(13),
    fontFamily: Typography?.semiBold,
    color: WHITE,
    lineHeight: RF(20),
  },

  copyright: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#AAAAAA",
    marginTop: hp(2),
  },

  bottomSpace: {
    height: hp(3),
  },
});