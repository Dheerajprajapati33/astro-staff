import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#FFF8F2",
  brown: "#3A2117",
  darkBrown: "#432619",
  orange: "#FF5A00",
  lightOrange: "#FFF3E9",
  card: "#FFFFFF",
  border: "#F1E2D5",
  text: "#1F140F",
  paragraph: "#405579",
  muted: "#8C7B72",
  lightBox: "#FFF9F4",
  white: "#FFFFFF",
};

/* =========================================================
   RESPONSIVE SCALE
========================================================= */

const getScale = (width) => {
  if (width >= 1000) return 1;
  if (width >= 700) return 0.94;
  return 0.88;
};

/* =========================================================
   TOP SUMMARY CARDS
========================================================= */

const summaryCards = [
  {
    icon: "person-outline",
    title: "Independent Astrologers",
    description:
      "Astrologers operate as independent service providers.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "KYC Required",
    description:
      "Accurate identity, qualification and payout information may be required.",
  },
  {
    icon: "cash-outline",
    title: "Earnings & Payouts",
    description:
      "Eligible consultation earnings are handled under Vavi's payout process.",
  },
  {
    icon: "lock-closed-outline",
    title: "Privacy & Security",
    description:
      "User information and Platform access must be handled responsibly.",
  },
];

/* =========================================================
   PARTNER AGREEMENT - 41 SECTIONS
========================================================= */

const agreementSections = [
  {
    number: "01",
    icon: "layers-outline",
    title: "Platform Role",
    content: `Vavi is a technology-enabled platform that connects Users seeking astrology-related consultations with independent Astrologers.

The Platform may provide astrologer registration, profiles, chat, voice consultations, pricing, earnings, payouts, ratings, notifications, support and security features.

Vavi does not guarantee any minimum number of Users, consultations or earnings.`,
  },

  {
    number: "02",
    icon: "person-outline",
    title: "Independent Astrologer Status",
    content: `Astrologers using Vavi operate as independent service providers.

The term Partner does not create a legal partnership, employment relationship, agency, joint venture, franchise or employer-employee relationship with Ascendant Vavi LLP.

Astrologers remain responsible for their consultations, conduct, qualifications, taxes and statutory obligations.`,
  },

  {
    number: "03",
    icon: "checkmark-circle-outline",
    title: "Eligibility",
    content: `To register as an Astrologer, you must:

• Be legally capable of entering into a binding agreement
• Provide accurate information and genuine documents
• Have the experience or knowledge represented on your profile
• Comply with applicable laws and Vavi policies.`,
  },

  {
    number: "04",
    icon: "shield-checkmark-outline",
    title: "Verification & KYC",
    content: `Vavi may request information including:

• Name
• Mobile number
• Email
• Address
• Photograph
• Identity documents
• PAN
• Bank details
• Qualifications
• Experience
• Languages
• Specializations
• Tax-related information

All submitted information and documents must be genuine and accurate.`,
  },

  {
    number: "05",
    icon: "person-circle-outline",
    title: "Astrologer Profile",
    content: `Astrologers are responsible for keeping their profile information accurate.

You must not:

• Use another person's photograph
• Misrepresent your identity or experience
• Claim qualifications you do not possess
• Provide false certifications
• Display misleading consultation information
• Guarantee astrology results.`,
  },

  {
    number: "06",
    icon: "sparkles-outline",
    title: "Astrology Services",
    content: `Permitted services may include:

• Horoscope analysis
• Kundli analysis
• Birth-chart interpretation
• Relationship and marriage-related astrology
• Career-related astrology
• General astrology guidance
• Other services supported by Vavi.`,
  },

  {
    number: "07",
    icon: "alert-circle-outline",
    title: "No Guaranteed Results",
    content: `Astrology is interpretive in nature.

Astrologers must not guarantee:

• Marriage
• Relationship outcomes
• Pregnancy
• Career success
• Jobs or promotions
• Business success
• Financial gain
• Lottery or gambling results
• Legal outcomes
• Medical recovery
• Remedy effectiveness
• Any specific future event.`,
  },

  {
    number: "08",
    icon: "medical-outline",
    title: "Professional Advice Disclaimer",
    content: `Astrology consultations must not be represented as a guaranteed substitute for:

• Medical treatment
• Mental-health treatment
• Legal advice
• Financial advice
• Investment advice
• Emergency services

Where appropriate, Users should be encouraged to consult qualified professionals.`,
  },

  {
    number: "09",
    icon: "people-outline",
    title: "Professional Conduct",
    content: `Astrologers must communicate respectfully and professionally.

The following are prohibited:

• Abuse
• Threats
• Harassment
• Blackmail
• Extortion
• Sexual harassment
• Intimidation
• Stalking
• Unlawful defamation
• Manipulation
• Encouragement of illegal activity
• Inappropriate content.`,
  },

  {
    number: "10",
    icon: "warning-outline",
    title: "No Fear-Based Practices",
    content: `Astrologers must not use fear or pressure to obtain money from Users.

You must not knowingly claim that payment is urgently required to avoid:

• Death
• Illness
• Family harm
• Supernatural harm
• Financial disaster
• Similar consequences

Vulnerable Users must not be exploited for financial gain.`,
  },

  {
    number: "11",
    icon: "chatbubble-ellipses-outline",
    title: "Consultation Responsibilities",
    content: `After accepting a consultation, Astrologers should make reasonable efforts to provide it professionally.

You must not:

• Intentionally accept consultations while unavailable
• Delay consultations to increase charges
• Artificially extend consultation duration
• Manipulate earnings through disconnects
• Avoid responding after accepting a consultation.`,
  },

  {
    number: "12",
    icon: "time-outline",
    title: "Availability & Pricing",
    content: `Astrologers should maintain an accurate availability status.

Consultation rates may depend on:

• Category
• Experience
• Promotions
• Platform policies
• Commercial arrangements

Users should only be charged according to rates communicated through the Vavi Platform.`,
  },

  {
    number: "13",
    icon: "cash-outline",
    title: "Commission & Earnings",
    content: `Vavi may deduct applicable commissions or Platform charges from eligible consultation earnings.

Deductions may include:

• Commission
• Platform charges
• Payment-processing charges
• Applicable taxes
• Statutory deductions
• Refund adjustments
• Chargebacks
• Fraudulent transaction adjustments.`,
  },

  {
    number: "14",
    icon: "wallet-outline",
    title: "Payouts",
    content: `Eligible Astrologer earnings may be transferred according to Vavi's applicable payout process.

Astrologers must provide accurate:

• Bank details
• PAN
• Identity information
• Tax information
• Other legally required information

Incorrect information may cause payout delays.`,
  },

  {
    number: "15",
    icon: "pause-circle-outline",
    title: "Payout Holds & Reviews",
    content: `Vavi may temporarily hold or delay payouts when reasonably necessary to investigate:

• Fraud
• Fake consultations
• Refunds
• Chargebacks
• Payment disputes
• User complaints
• Suspicious transactions
• Policy violations
• Account compromise
• Off-platform payment activity
• Legal requirements.`,
  },

  {
    number: "16",
    icon: "return-down-back-outline",
    title: "Refunds & Earnings Adjustments",
    content: `Where a User becomes eligible for a refund under the applicable Refund & Cancellation Policy, corresponding Astrologer earnings may be adjusted where appropriate.

This may include:

• Consultation no-shows
• Verified Astrologer-side failures
• Fraudulent consultations
• Incorrect charging
• Payment reversals.`,
  },

  {
    number: "17",
    icon: "ban-outline",
    title: "Fake Consultations & Manipulation",
    content: `Astrologers must not create or participate in artificial transactions.

Prohibited activities include:

• Fake User accounts
• Self-booking
• Coordinated fake consultations
• Fake payments
• Manipulation of consultation duration
• Manipulation of earnings
• Manipulation of reviews
• Manipulation of ratings
• Manipulation of promotional benefits.`,
  },

  {
    number: "18",
    icon: "exit-outline",
    title: "Off-Platform Payments",
    content: `Astrologers must not bypass Vavi's payment or commercial systems for Users obtained through Vavi.

This includes requesting:

• Personal UPI payments
• Direct bank transfers
• External payment links
• Cash payments
• Paid WhatsApp consultations
• Paid Telegram consultations
• Paid consultations through another platform

for the purpose of avoiding Vavi systems or commission.`,
  },

  {
    number: "19",
    icon: "share-outline",
    title: "Contact Information Exchange",
    content: `Vavi may restrict unauthorized sharing or solicitation of:

• Mobile numbers
• WhatsApp numbers
• Personal email addresses
• Telegram accounts
• Social-media handles
• UPI details
• Bank details
• External payment links

to protect Users, Astrologers and the Platform.`,
  },

  {
    number: "20",
    icon: "phone-portrait-outline",
    title: "Personal Contact & Off-Platform Contact",
    content: `Astrologers must not directly or indirectly share, request, exchange, collect or solicit a User's personal contact information for communicating, consulting or transacting outside Vavi.

A verified violation may result in a contractual penalty of ₹50,000, to the extent permitted by applicable law, in addition to other available remedies.`,
  },

  {
    number: "21",
    icon: "lock-closed-outline",
    title: "User Data & Confidentiality",
    content: `Astrologers may receive User information necessary to provide consultations.

Such information must remain confidential.

You must not:

• Sell User information
• Publish private information
• Share consultation screenshots or chats with unauthorized persons
• Use User information for unrelated marketing
• Contact Users for unauthorized commercial purposes.`,
  },

  {
    number: "22",
    icon: "shield-outline",
    title: "Privacy & Data Protection",
    content: `User information must only be used for legitimate consultation and Platform purposes.

Astrologers must comply with applicable privacy and data-protection requirements and the Vavi Privacy Policy.`,
  },

  {
    number: "23",
    icon: "eye-outline",
    title: "Chat & Call Monitoring",
    content: `To maintain quality, prevent fraud, investigate complaints, resolve disputes, enforce Platform rules and maintain safety, Vavi may monitor, audit, review or process certain Platform activity.

This may include:

• Chat records
• Consultation records
• Call logs
• Call metadata
• Payment records
• Complaint records
• Support communications.`,
  },

  {
    number: "24",
    icon: "recording-outline",
    title: "Call Recording & Record Retention",
    content: `Vavi may maintain call logs and technical call metadata.

Unless expressly disclosed, Vavi does not represent that voice-call audio is recorded.

Chat, call, consultation, payment, complaint, support and related technical records may be retained as reasonably necessary for:

• Platform operations
• Security
• Investigations
• Disputes
• Legal compliance.`,
  },

  {
    number: "25",
    icon: "star-outline",
    title: "Ratings & Reviews",
    content: `Astrologers must not:

• Create fake reviews
• Purchase reviews
• Threaten Users for better ratings
• Offer prohibited incentives
• Manipulate ratings
• Create accounts to review themselves

Vavi may remove reviews that violate Platform policies.`,
  },

  {
    number: "26",
    icon: "images-outline",
    title: "Astrologer Content",
    content: `Astrologers may upload:

• Profile photographs
• Biographies
• Qualifications
• Experience
• Specializations
• Other profile materials

You represent that you have the necessary rights to use uploaded content.

Vavi may use approved profile content to operate, display and reasonably promote the Platform and Astrologer profiles.`,
  },

  {
    number: "27",
    icon: "key-outline",
    title: "Account Security",
    content: `Astrologers are responsible for protecting:

• OTPs
• Passwords
• Login credentials
• Devices
• Account access

Unauthorized access should be reported to Vavi immediately.

Astrologer accounts must not be sold, rented, transferred or knowingly shared with unauthorized persons.`,
  },

  {
    number: "28",
    icon: "prohibited-outline",
    title: "Prohibited Activities",
    content: `Astrologers must not:

• Commit fraud
• Create fake accounts
• Impersonate others
• Manipulate payments or consultations
• Manipulate ratings
• Misuse User data
• Circumvent Platform security
• Attempt unauthorized access
• Upload malicious software
• Engage in unlawful activities
• Intentionally bypass Vavi's commercial systems.`,
  },

  {
    number: "29",
    icon: "lock-open-outline",
    title: "Account Suspension & Termination",
    content: `Vavi may suspend, restrict or temporarily disable an Astrologer account where it reasonably believes there is:

• Fraud
• Abuse
• Harassment
• Data misuse
• Payment manipulation
• Fake consultations
• Security risk
• Serious User complaints
• False information
• Policy violations
• Illegal activity

Serious or repeated violations may result in termination.`,
  },

  {
    number: "30",
    icon: "log-out-outline",
    title: "Account Closure & Taxes",
    content: `Astrologers may request account closure through available Platform functionality or by contacting Vavi.

Account closure does not automatically cancel:

• Pending refunds
• Chargebacks
• Payment adjustments
• Tax obligations
• Investigations
• Confidentiality obligations

Astrologers remain responsible for applicable taxes and statutory requirements.`,
  },

  {
    number: "31",
    icon: "document-text-outline",
    title: "Intellectual Property",
    content: `The Vavi App, website, software, source code, designs, logos, trademarks, databases, user interface and technology belong to or are licensed to Ascendant Vavi LLP.

Astrologers may not:

• Copy
• Reverse engineer
• Sell
• Reproduce
• Commercially exploit

Vavi technology without authorization.`,
  },

  {
    number: "32",
    icon: "create-outline",
    title: "Astrologer-Generated Content",
    content: `To the extent permitted by applicable law, custom remedies, Kundli notes, personalized consultation notes, written analyses, reports, recommendations and other content specifically created for services through Vavi may be owned by or assigned to Ascendant Vavi LLP.

Pre-existing intellectual property created independently before Vavi remains with the Astrologer, subject to the rights necessary for applicable Platform use.`,
  },

  {
    number: "33",
    icon: "cloud-outline",
    title: "Third-Party Services & Availability",
    content: `Vavi may use third-party services for:

• Payments
• Hosting
• Authentication
• Voice communication
• Notifications
• Analytics
• Security

Vavi does not guarantee uninterrupted operation of third-party services or continuous availability of every Platform feature or consultation request.`,
  },

  {
    number: "34",
    icon: "information-circle-outline",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, Vavi will not be liable for indirect, incidental, consequential or speculative losses arising solely from:

• Reduced consultation volume
• Loss of anticipated earnings
• User decisions
• Ratings or reviews
• Internet failure
• Third-party service failure
• Temporary Platform downtime
• Astrology outcomes.`,
  },

  {
    number: "35",
    icon: "shield-checkmark-outline",
    title: "Indemnification",
    content: `To the extent permitted by applicable law, an Astrologer may be responsible for claims, losses or legal expenses arising from their own:

• Fraud
• Illegal activity
• Material breach of this Agreement
• Misuse of User information
• False representations
• Harassment
• Intellectual-property infringement
• Unauthorized transactions.`,
  },

  {
    number: "36",
    icon: "settings-outline",
    title: "Platform Changes",
    content: `Vavi may introduce, remove or modify:

• Features
• Pricing models
• Consultation functionality
• Commission structures
• Payout systems
• Platform policies

Material commercial changes may be communicated through reasonable means.`,
  },

  {
    number: "37",
    icon: "checkmark-done-outline",
    title: "Electronic Acceptance",
    content: `No physical signature is required unless Vavi separately requests one.

This Agreement may be accepted electronically by:

• Clicking "I Agree"
• Clicking "Accept & Continue"
• Completing onboarding
• Creating an Astrologer account
• Providing consultations after being presented with the Agreement
• Continuing to use the Astrologer Platform.`,
  },

  {
    number: "38",
    icon: "documents-outline",
    title: "Other Vavi Policies",
    content: `This Agreement should be read together with:

• Vavi Terms and Conditions
• Vavi Privacy Policy
• Vavi Refund & Cancellation Policy
• Vavi EULA
• Applicable Community or Platform Guidelines.`,
  },

  {
    number: "39",
    icon: "refresh-circle-outline",
    title: "Changes to This Agreement",
    content: `Vavi may modify this Agreement from time to time.

Material changes may be communicated through:

• App notifications
• Email
• Website notices
• Astrologer dashboard
• Other reasonable means

The updated version will state its effective date.`,
  },

  {
    number: "40",
    icon: "scale-outline",
    title: "Dispute Resolution",
    content: `The parties should first make reasonable efforts to resolve disputes amicably through written communication.

Where legally permissible, unresolved disputes may be referred to arbitration.

The seat and venue of arbitration are Delhi, India.

The language is English.

The governing law is the laws of India.`,
  },

  {
    number: "41",
    icon: "business-outline",
    title: "Jurisdiction",
    content: `Subject to applicable arbitration provisions and mandatory applicable law, courts having competent jurisdiction in Delhi, India shall have jurisdiction over matters requiring judicial intervention.`,
  },
];

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({ item, scale }) => {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <Ionicons
          name={item.icon}
          size={22 * scale}
          color={COLORS.orange}
        />
      </View>

      <Text
        style={[
          styles.summaryTitle,
          {
            fontSize: 16 * scale,
          },
        ]}
      >
        {item.title}
      </Text>

      <Text
        style={[
          styles.summaryDescription,
          {
            fontSize: 13.5 * scale,
            lineHeight: 21 * scale,
          },
        ]}
      >
        {item.description}
      </Text>
    </View>
  );
};

/* =========================================================
   AGREEMENT CARD
========================================================= */

const AgreementCard = ({ item, scale }) => {
  const lines = item.content.split("\n");

  return (
    <View style={styles.agreementCard}>
      <View style={styles.decorativeCircle} />

      {/* Top Row */}

      <View style={styles.cardTopRow}>
        <View style={styles.agreementIcon}>
          <Ionicons
            name={item.icon}
            size={21 * scale}
            color={COLORS.orange}
          />
        </View>

        <View style={styles.numberBadge}>
          <Text
            style={[
              styles.numberText,
              {
                fontSize: 11.5 * scale,
              },
            ]}
          >
            {item.number}
          </Text>
        </View>
      </View>

      {/* Title */}

      <Text
        style={[
          styles.agreementTitle,
          {
            fontSize: 21 * scale,
            lineHeight: 28 * scale,
          },
        ]}
      >
        {item.title}
      </Text>

      {/* Content */}

      <View style={styles.contentBox}>
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return (
              <View
                key={index}
                style={{ height: 7 }}
              />
            );
          }

          const isBullet = trimmed.startsWith("•");

          return (
            <View
              key={index}
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
                  styles.contentText,
                  isBullet && styles.bulletText,
                  {
                    fontSize: 14 * scale,
                    lineHeight: 24 * scale,
                  },
                ]}
              >
                {isBullet
                  ? trimmed.substring(1).trim()
                  : trimmed}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* =========================================================
   CONTACT CARD
========================================================= */

const ContactCard = ({ scale }) => {
  return (
    <View style={styles.contactCard}>
      <View style={styles.contactTop}>
        <View style={styles.contactLeft}>
          <View style={styles.contactIcon}>
            <Ionicons
              name="mail-outline"
              size={24 * scale}
              color={COLORS.white}
            />
          </View>

          <Text
            style={[
              styles.contactTitle,
              {
                fontSize: 28 * scale,
                lineHeight: 36 * scale,
              },
            ]}
          >
            Partner Agreement Contact
          </Text>

          <Text
            style={[
              styles.contactDescription,
              {
                fontSize: 14 * scale,
                lineHeight: 23 * scale,
              },
            ]}
          >
            For questions relating to the Astrologer /
            Partner Agreement, contact Vavi using the
            details below.
          </Text>
        </View>

        <View style={styles.contactDetails}>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              Company
            </Text>

            <Text style={styles.contactValue}>
              Ascendant Vavi LLP
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              Brand
            </Text>

            <Text style={styles.contactValue}>
              Vavi
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              Website
            </Text>

            <Text style={styles.contactValue}>
              theVavi.com
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              General Email
            </Text>

            <Text style={styles.contactValue}>
              info@theVavi.com
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              Legal / Grievance Email
            </Text>

            <Text style={styles.contactValue}>
              legal@theVavi.com
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>
              Privacy Email
            </Text>

            <Text style={styles.contactValue}>
              privacy@theVavi.com
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contactDivider} />

      <Text
        style={[
          styles.registeredLabel,
          {
            fontSize: 12.5 * scale,
          },
        ]}
      >
        Registered Office
      </Text>

      <Text
        style={[
          styles.registeredValue,
          {
            fontSize: 13 * scale,
            lineHeight: 21 * scale,
          },
        ]}
      >
        S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad, U.P.
      </Text>

      <Text
        style={[
          styles.copyright,
          {
            fontSize: 12 * scale,
          },
        ]}
      >
        © 2026 Ascendant Vavi LLP. All Rights Reserved.
      </Text>
    </View>
  );
};

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function Partner_agreement() {
  const { width } = useWindowDimensions();

  const scale = getScale(width);
  const isTablet = width >= 700;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text
              style={[
                styles.heroBadgeText,
                {
                  fontSize: 12.5 * scale,
                },
              ]}
            >
              Astrologer & Partner
            </Text>
          </View>

          <Text
            style={[
              styles.heroTitle,
              {
                fontSize: 34 * scale,
                lineHeight: 43 * scale,
              },
            ]}
          >
            Partner Agreement
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                fontSize: 14.5 * scale,
                lineHeight: 24 * scale,
              },
            ]}
          >
            Terms governing registration, onboarding and
            use of the Vavi Astrologer Platform by
            independent Astrologers.
          </Text>
        </View>

        {/* =================================================
            INTRODUCTION
        ================================================= */}

        <View style={styles.introductionCard}>
          <Text
            style={[
              styles.introductionTitle,
              {
                fontSize: 23 * scale,
                lineHeight: 30 * scale,
              },
            ]}
          >
            Welcome to Vavi Partner Network
          </Text>

          <Text
            style={[
              styles.introductionText,
              {
                fontSize: 14 * scale,
                lineHeight: 24 * scale,
              },
            ]}
          >
            This Agreement governs the registration,
            onboarding, access and use of the Vavi
            Astrologer Application and related Platform
            services by Astrologers and service providers.
          </Text>

          <Text
            style={[
              styles.introductionText,
              {
                fontSize: 14 * scale,
                lineHeight: 24 * scale,
              },
            ]}
          >
            By creating an Astrologer account, completing
            onboarding, submitting documents, accepting
            the Agreement, accepting consultations or
            continuing to use the Vavi Astrologer
            Application, you acknowledge and agree to
            these terms.
          </Text>
        </View>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <View
          style={[
            styles.summaryGrid,
            isTablet
              ? styles.summaryGridTablet
              : styles.summaryGridMobile,
          ]}
        >
          {summaryCards.map((item, index) => (
            <SummaryCard
              key={index}
              item={item}
              scale={scale}
            />
          ))}
        </View>

        {/* =================================================
            DETAILS HEADER
        ================================================= */}

        <View style={styles.detailsHeader}>
          <Text
            style={[
              styles.detailsLabel,
              {
                fontSize: 13 * scale,
                letterSpacing: 2 * scale,
              },
            ]}
          >
            AGREEMENT DETAILS
          </Text>

          <Text
            style={[
              styles.detailsTitle,
              {
                fontSize: 30 * scale,
                lineHeight: 38 * scale,
              },
            ]}
          >
            Astrologer Partner Terms
          </Text>

          <Text
            style={[
              styles.detailsSubtitle,
              {
                fontSize: 14 * scale,
                lineHeight: 22 * scale,
              },
            ]}
          >
            All 41 sections of the Vavi Astrologer /
            Partner Agreement are included below.
          </Text>
        </View>

        {/* =================================================
            AGREEMENT CARDS
        ================================================= */}

        <View style={styles.agreementGrid}>
          {agreementSections.map((item) => (
            <AgreementCard
              key={item.number}
              item={item}
              scale={scale}
            />
          ))}
        </View>

        {/* =================================================
            CONTACT
        ================================================= */}

        <ContactCard scale={scale} />

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* =====================================================
     HERO
  ===================================================== */

  heroSection: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",

    alignItems: "center",

    paddingTop: 35,
    paddingBottom: 38,

    paddingHorizontal: 15,
  },

  heroBadge: {
    backgroundColor: COLORS.orange,

    paddingHorizontal: 17,
    paddingVertical: 9,

    borderRadius: 20,

    marginBottom: 18,
  },

  heroBadgeText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  heroTitle: {
    color: COLORS.brown,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 13,
  },

  heroSubtitle: {
    color: COLORS.paragraph,

    textAlign: "center",

    maxWidth: 900,
  },

  /* =====================================================
     INTRODUCTION
  ===================================================== */

  introductionCard: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 24,

    paddingHorizontal: 27,
    paddingVertical: 30,

    marginBottom: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  introductionTitle: {
    color: COLORS.text,
    fontWeight: "700",

    marginBottom: 16,
  },

  introductionText: {
    color: COLORS.paragraph,

    marginBottom: 13,
  },

  /* =====================================================
     SUMMARY
  ===================================================== */

  summaryGrid: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },

  summaryGridMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryGridTablet: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryCard: {
    width: "48%",

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 22,

    paddingHorizontal: 20,
    paddingVertical: 20,

    minHeight: 185,

    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },

  summaryIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: COLORS.lightOrange,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 17,
  },

  summaryTitle: {
    color: COLORS.text,

    fontWeight: "700",

    marginBottom: 10,
  },

  summaryDescription: {
    color: COLORS.paragraph,
  },

  /* =====================================================
     DETAILS HEADER
  ===================================================== */

  detailsHeader: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",

    alignItems: "center",

    paddingTop: 60,
    paddingBottom: 35,

    paddingHorizontal: 10,
  },

  detailsLabel: {
    color: COLORS.orange,

    fontWeight: "800",

    marginBottom: 8,
  },

  detailsTitle: {
    color: COLORS.brown,

    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  detailsSubtitle: {
    color: COLORS.paragraph,

    textAlign: "center",
  },

  /* =====================================================
     AGREEMENT GRID
  ===================================================== */

  agreementGrid: {
    width: "100%",
    maxWidth: 1200,

    alignSelf: "center",
  },

  /* =====================================================
     AGREEMENT CARD
  ===================================================== */

  agreementCard: {
    width: "100%",

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 24,

    paddingHorizontal: 27,
    paddingTop: 27,
    paddingBottom: 27,

    marginBottom: 20,

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },

  decorativeCircle: {
    position: "absolute",

    right: -45,
    top: -55,

    width: 125,
    height: 125,

    borderRadius: 70,

    backgroundColor: "#FFF9F4",
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 21,
  },

  agreementIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: COLORS.lightOrange,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11,
  },

  numberBadge: {
    backgroundColor: COLORS.lightOrange,

    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 14,
  },

  numberText: {
    color: COLORS.orange,

    fontWeight: "800",
  },

  agreementTitle: {
    color: COLORS.text,

    fontWeight: "700",

    marginBottom: 17,
  },

  /* =====================================================
     CONTENT BOX
  ===================================================== */

  contentBox: {
    backgroundColor: COLORS.lightBox,

    borderRadius: 15,

    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  paragraphRow: {
    width: "100%",
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",

    width: "100%",

    marginBottom: 4,
  },

  orangeDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: COLORS.orange,

    marginTop: 9,
    marginRight: 10,
  },

  contentText: {
    color: COLORS.paragraph,
  },

  bulletText: {
    flex: 1,
  },

  /* =====================================================
     CONTACT CARD
  ===================================================== */

  contactCard: {
    width: "100%",
    maxWidth: 1200,

    alignSelf: "center",

    backgroundColor: COLORS.darkBrown,

    borderRadius: 28,

    paddingHorizontal: 30,
    paddingVertical: 32,

    marginTop: 45,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  contactTop: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  contactLeft: {
    flex: 1,

    minWidth: 280,

    paddingRight: 25,
  },

  contactIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: COLORS.orange,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 20,
  },

  contactTitle: {
    color: COLORS.white,

    fontWeight: "700",

    marginBottom: 10,
  },

  contactDescription: {
    color: "#E8D9D1",
  },

  contactDetails: {
    width: 340,
    maxWidth: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    alignContent: "center",
  },

  contactItem: {
    width: "48%",

    marginBottom: 20,
  },

  contactLabel: {
    color: "#AFA09A",

    fontSize: 12,

    marginBottom: 6,
  },

  contactValue: {
    color: COLORS.white,

    fontSize: 13.5,

    fontWeight: "700",
  },

  contactDivider: {
    width: "100%",
    height: 1,

    backgroundColor: "rgba(255,255,255,0.16)",

    marginTop: 10,
    marginBottom: 22,
  },

  registeredLabel: {
    color: "#AFA09A",

    marginBottom: 6,
  },

  registeredValue: {
    color: COLORS.white,

    fontWeight: "700",
  },

  copyright: {
    color: "#BDAEA6",

    marginTop: 20,
  },

  bottomSpace: {
    height: 30,
  },
});