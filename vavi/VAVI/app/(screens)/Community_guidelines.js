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

/* =========================================================
   COMMUNITY GUIDELINES
   Static screen - NO API
========================================================= */

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
   HELPERS
========================================================= */

const getFontScale = (width) => {
  if (width >= 900) return 1;
  if (width >= 600) return 0.94;
  return 0.88;
};

/* =========================================================
   TOP SUMMARY CARDS
========================================================= */

const summaryCards = [
  {
    icon: "heart-outline",
    title: "Be Respectful",
    description:
      "No harassment, threats, bullying or abuse.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Be Honest",
    description:
      "No fraud, fake accounts or fake consultations.",
  },
  {
    icon: "lock-closed-outline",
    title: "Protect Privacy",
    description:
      "Do not misuse or publicly share private information.",
  },
  {
    icon: "card-outline",
    title: "Use Payments Properly",
    description:
      "No payment manipulation or off-platform payment requests.",
  },
];

/* =========================================================
   COMMUNITY GUIDELINE DATA
========================================================= */

const guidelines = [
  {
    number: "01",
    icon: "shield-checkmark-outline",
    title: "Purpose of These Guidelines",
    description:
      "Vavi aims to provide a safe, respectful, trustworthy and lawful environment for astrology-related consultations.",
    points: [
      "Protect Users and Astrologers",
      "Prevent fraud and abuse",
      "Maintain consultation quality",
      "Protect personal information",
      "Protect Platform integrity",
    ],
  },

  {
    number: "02",
    icon: "person-add-outline",
    title: "Who Must Follow These Guidelines",
    description:
      "These Guidelines apply to everyone using Vavi, including:",
    points: [
      "Users and Astrologers",
      "Account holders",
      "People participating in chats or calls",
      "People submitting reviews",
      "People making payments or contacting support",
    ],
  },

  {
    number: "03",
    icon: "heart-outline",
    title: "Respectful Conduct",
    description:
      "All Users and Astrologers must communicate respectfully.",
    points: [
      "No abuse or harassment",
      "No threats or intimidation",
      "No stalking or blackmail",
      "No bullying or humiliation",
      "Disagreements must be handled respectfully",
    ],
  },

  {
    number: "04",
    icon: "ban-outline",
    title: "Sexual Harassment & Inappropriate Content",
    description:
      "Vavi does not permit sexual harassment or inappropriate sexual conduct.",
    points: [
      "No unsolicited sexual messages",
      "No unwanted sexual proposals",
      "No sexual photographs or videos",
      "No obscene or sexually threatening content",
      "No sexual solicitation through consultations",
      "Serious violations may result in immediate suspension or termination",
    ],
  },

  {
    number: "05",
    icon: "warning-outline",
    title: "Threats, Violence & Dangerous Conduct",
    description:
      "Vavi must not be used to promote or coordinate harmful or unlawful activities.",
    points: [
      "No threats of physical harm",
      "No encouragement of violence",
      "No promotion of criminal acts",
      "No encouragement of harm to yourself or others",
      "No coordination of unlawful violent activity",
    ],
  },

  {
    number: "06",
    icon: "medkit-outline",
    title: "Self-Harm & Emergency Situations",
    description:
      "Astrology consultations are not a substitute for emergency or medical assistance.",
    points: [
      "Astrologers must not encourage self-harm or suicide",
      "Do not encourage dangerous conduct",
      "Do not encourage refusal of urgent medical care",
      "Users at immediate risk should be encouraged to seek professional or emergency help",
    ],
  },

  {
    number: "07",
    icon: "sparkles-outline",
    title: "No Guaranteed Astrology Outcomes",
    description:
      "Astrology must be presented as interpretive guidance. Astrologers must not guarantee future outcomes.",
    points: [
      "Marriage or relationship outcomes",
      "Pregnancy or employment",
      "Promotion or business success",
      "Financial gain or lottery results",
      "Court results or medical recovery",
      "Guaranteed success of remedies",
    ],
  },

  {
    number: "08",
    icon: "alert-circle-outline",
    title: "No Fear-Based Manipulation",
    description:
      "Astrologers must not create fear to obtain money from Users.",
    points: [
      "No claims that payment is required to prevent harm",
      "No forced purchase of paid remedies",
      "No demands for personal payments",
      "No supernatural threats used for financial gain",
      "No pressure for continued payments",
    ],
  },

  {
    number: "09",
    icon: "medical-outline",
    title: "Medical, Legal & Financial Claims",
    description:
      "Astrology must not be presented as a replacement for regulated professional services.",
    points: [
      "Medical treatment",
      "Mental-health treatment",
      "Legal advice",
      "Financial or investment advice",
      "Emergency services",
    ],
  },

  {
    number: "10",
    icon: "finger-print-outline",
    title: "Fraud & Deception",
    description:
      "Users and Astrologers must not engage in fraudulent or deliberately misleading activities.",
    points: [
      "Fake identities or documents",
      "Fake qualifications or transactions",
      "Fake consultations",
      "False refund claims",
      "Fraudulent chargebacks",
      "Account impersonation",
    ],
  },

  {
    number: "11",
    icon: "people-outline",
    title: "Fake Accounts & Consultations",
    description:
      "Accounts and consultations must represent genuine Platform activity.",
    points: [
      "No identity-based fake accounts",
      "No accounts created to evade suspension",
      "No manipulation of reviews or consultation volume",
      "No self-booking or coordinated fake bookings",
      "No artificial transactions or earnings",
    ],
  },

  {
    number: "12",
    icon: "card-outline",
    title: "Payment Manipulation",
    description:
      "Users must not intentionally exploit Vavi's payment systems or technical errors.",
    points: [
      "No duplicate refund abuse",
      "No false unauthorized-payment claims",
      "No double recovery through refund and chargeback",
      "No artificial Wallet transactions",
      "No promotional Credit abuse",
    ],
  },

  {
    number: "13",
    icon: "cash-outline",
    title: "Off-Platform Payments",
    description:
      "Astrologers must not redirect Vavi Users to external payment methods to bypass Platform systems.",
    points: [
      "Personal UPI payments",
      "Direct bank transfers",
      "External payment links",
      "Cash payments",
      "Paid WhatsApp or Telegram consultations",
      "Users should report suspicious requests for external payments",
    ],
  },

  {
    number: "14",
    icon: "call-outline",
    title: "Contact Information Sharing",
    description:
      "Vavi may restrict unauthorized exchange of personal contact and payment details.",
    points: [
      "Phone or WhatsApp numbers",
      "Personal email addresses",
      "Telegram or social-media accounts",
      "Bank or UPI details",
      "External payment links",
    ],
  },

  {
    number: "15",
    icon: "lock-closed-outline",
    title: "Privacy & Personal Information",
    description:
      "Users and Astrologers must respect each other's privacy.",
    points: [
      "Do not publish private chats",
      "Do not share personal addresses",
      "Do not share private birth information without authorization",
      "Do not sell or misuse personal information",
      "Do not use personal information for harassment",
    ],
  },

  {
    number: "16",
    icon: "camera-outline",
    title: "Screenshots & Recordings",
    description:
      "Private consultation content should not be publicly disclosed in a way that violates privacy or applicable law.",
    points: [
      "Chat records may be retained for legitimate Platform purposes",
      "Call logs and metadata may be processed",
      "Transaction and complaint records may be retained",
      "Voice recording will only be represented as recorded where applicable functionality and notice exist",
    ],
  },

  {
    number: "17",
    icon: "person-remove-outline",
    title: "Impersonation",
    description:
      "You must not impersonate another person or professional for fraudulent or misleading purposes.",
    points: [
      "Users or Astrologers",
      "Vavi employees or support staff",
      "Government officials",
      "Lawyers or doctors",
      "Other professionals",
    ],
  },

  {
    number: "18",
    icon: "school-outline",
    title: "Astrologer Qualifications",
    description:
      "Astrologers must provide truthful information about their professional background.",
    points: [
      "Experience",
      "Certifications",
      "Qualifications",
      "Awards",
      "Specializations",
      "Success rates",
      "Note: Vavi may request verification where necessary",
    ],
  },

  {
    number: "19",
    icon: "megaphone-outline",
    title: "Spam & Unsolicited Marketing",
    description:
      "Vavi must not be used for spam or unauthorized marketing.",
    points: [
      "No repetitive spam",
      "No unsolicited advertisements",
      "No mass promotional messages",
      "No unauthorized referral links",
      "No malicious links",
    ],
  },

  {
    number: "20",
    icon: "bug-outline",
    title: "Security & Malicious Software",
    description:
      "Users must not interfere with Vavi's security, systems or accounts.",
    points: [
      "No malware or viruses",
      "No hacking attempts",
      "No unauthorized access",
      "No security bypass",
      "No unauthorized vulnerability probing",
      "No access to another person's account",
    ],
  },

  {
    number: "21",
    icon: "cloud-download-outline",
    title: "Automated Access & Scraping",
    description:
      "Automated collection or manipulation of Platform data is prohibited unless expressly authorized.",
    points: [
      "No scraping of Platform information",
      "No bots for account creation",
      "No automated consultations",
      "No automated collection of User profiles",
      "No copying Platform databases",
    ],
  },

  {
    number: "22",
    icon: "document-text-outline",
    title: "Intellectual Property",
    description:
      "Content uploaded to Vavi must respect applicable intellectual-property rights.",
    points: [
      "Copyright",
      "Trademark",
      "Personality rights",
      "Proprietary rights",
      "Other applicable intellectual-property rights",
      "Note: Vavi branding, software, logos, designs and technology must not be commercially exploited without authorization",
    ],
  },

  {
    number: "23",
    icon: "create-outline",
    title: "User-Generated Content",
    description:
      "Users and Astrologers may submit permitted content, but it must comply with these Guidelines.",
    points: [
      "No unlawful or fraudulent content",
      "No threatening or malicious content",
      "No abusive or sexually inappropriate content",
      "No intentionally misleading content",
      "No infringing content or malware",
    ],
  },

  {
    number: "24",
    icon: "star-outline",
    title: "Reviews & Ratings",
    description:
      "Reviews must be based on genuine Vavi experiences.",
    points: [
      "No fake reviews",
      "No paid review manipulation",
      "No threats involving reviews",
      "No coordinated rating attacks",
      "No incentives for prohibited positive ratings",
      "Note: Vavi may remove reviews that violate these Guidelines",
    ],
  },

  {
    number: "25",
    icon: "document-outline",
    title: "False Complaints",
    description:
      "Vavi encourages genuine complaints, but deliberately fabricated complaints are not permitted.",
    points: [
      "No fabricated complaints",
      "No fraudulent allegations",
      "No manipulated screenshots",
      "No deliberately false transaction claims",
      "No complaints made solely to harass another person",
      "Note: An unsuccessful complaint is not automatically treated as a false complaint",
    ],
  },

  {
    number: "26",
    icon: "headset-outline",
    title: "Customer Support Abuse",
    description:
      "Users may raise genuine complaints but must communicate appropriately with support staff.",
    points: [
      "No threats against support staff",
      "No repeated abuse",
      "No intentionally fake evidence",
      "No manipulation through threats",
      "No impersonation of authorities",
    ],
  },

  {
    number: "27",
    icon: "gift-outline",
    title: "Promotions & Free Services",
    description:
      "Promotional consultations, Credits, offers and free minutes are intended for genuine use.",
    points: [
      "No multiple fake accounts",
      "No device manipulation",
      "No payment-method manipulation",
      "No identity manipulation",
      "No coordinated promotional abuse",
    ],
  },

  {
    number: "28",
    icon: "person-circle-outline",
    title: "Account Sharing",
    description:
      "Vavi accounts are intended only for the registered account holder.",
    points: [
      "Do not sell accounts",
      "Do not rent accounts",
      "Do not transfer verified accounts",
      "Do not share login credentials with unauthorized persons",
    ],
  },

  {
    number: "29",
    icon: "eye-outline",
    title: "Platform Monitoring",
    description:
      "Vavi may use authorized manual or automated systems to maintain quality, prevent fraud and investigate complaints.",
    points: [
      "Chat communications",
      "Consultation records",
      "Call logs and metadata",
      "Transaction records",
      "Account activity and fraud indicators",
      "Complaint and support records",
      "Note: Monitoring is subject to applicable law and the Vavi Privacy Policy",
    ],
  },

  {
    number: "30",
    icon: "flag-outline",
    title: "Reporting Violations",
    description:
      "Users and Astrologers can report suspected violations through available in-app or support channels.",
    points: [
      "Harassment or abuse",
      "Fraud",
      "Payment manipulation",
      "Fake accounts",
      "Data misuse",
      "Security incidents",
    ],
  },

  {
    number: "31",
    icon: "search-outline",
    title: "Investigations",
    description:
      "Vavi may review information reasonably relevant to a reported or suspected violation.",
    points: [
      "Account information",
      "Chat and consultation records",
      "Payment information",
      "Technical logs",
      "Complaint and support information",
      "Note: A complaint or report does not automatically establish wrongdoing",
    ],
  },

  {
    number: "32",
    icon: "gavel-outline",
    title: "Enforcement Actions",
    description:
      "Depending on the nature and severity of a violation, Vavi may take appropriate enforcement action.",
    points: [
      "Warning or content removal",
      "Review removal",
      "Feature or consultation restriction",
      "Promotional benefit removal",
      "Temporary account suspension",
      "Payout review or fraud investigation",
      "Permanent account termination",
      "Serious violations may result in immediate action where reasonably necessary",
    ],
  },

  {
    number: "33",
    icon: "wallet-outline",
    title: "Payouts & Enforcement",
    description:
      "Astrologer payouts may be temporarily held while serious issues are investigated.",
    points: [
      "Fraud investigations",
      "Fake consultations",
      "Chargebacks",
      "Payment manipulation",
      "Serious User complaints",
      "Note: Legitimate undisputed earnings are handled according to the applicable Partner Agreement and law",
    ],
  },

  {
    number: "34",
    icon: "business-outline",
    title: "Legal & Law-Enforcement Requests",
    description:
      "Where required by applicable law or valid legal process, Vavi may cooperate with competent authorities.",
    points: [
      "Courts",
      "Government authorities",
      "Law-enforcement agencies",
      "Other competent authorities",
    ],
  },

  {
    number: "35",
    icon: "refresh-outline",
    title: "Appeal & Account Review",
    description:
      "Where Platform functionality permits, Users and Astrologers may request review of an enforcement action.",
    points: [
      "Nature of the violation",
      "Available evidence",
      "Previous violations",
      "Security and fraud indicators",
      "User safety considerations",
      "Note: A review request does not guarantee reversal of an enforcement action",
    ],
  },

  {
    number: "36",
    icon: "hand-left-outline",
    title: "No Retaliation",
    description:
      "Good-faith complaints and safety reports should not result in retaliation.",
    points: [
      "Do not retaliate against genuine reporters",
      "Good-faith reporting is not misconduct merely because an allegation is not established",
    ],
  },

  {
    number: "37",
    icon: "create-outline",
    title: "Changes to These Guidelines",
    description:
      "Vavi may update these Guidelines from time to time.",
    points: [
      "App notifications",
      "Website notices",
      "Email",
      "Platform dashboard",
      "Other reasonable communication methods",
      "Note: The latest version will state its applicable effective date",
    ],
  },

  {
    number: "38",
    icon: "documents-outline",
    title: "Relationship With Other Policies",
    description:
      "These Guidelines operate together with Vavi's other applicable policies.",
    points: [
      "Terms & Conditions",
      "EULA",
      "Privacy Policy",
      "Refund & Cancellation Policy",
      "Astrologer / Partner Agreement",
      "Note: Mandatory legal requirements apply to the extent of any conflict",
    ],
  },

  {
    number: "39",
    icon: "checkmark-circle-outline",
    title: "Electronic Acceptance",
    description:
      "No physical signature is required to accept these Guidelines.",
    points: [
      "Creating an account",
      "Clicking “I Agree”",
      "Clicking “Accept & Continue”",
      "Completing onboarding",
      "Continuing to use the Platform",
    ],
  },
];

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ item, scale }) {
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
            fontSize: 15.5 * scale,
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
          },
        ]}
      >
        {item.description}
      </Text>
    </View>
  );
}

/* =========================================================
   GUIDELINE CARD
========================================================= */

function GuidelineCard({ item, scale }) {
  return (
    <View style={styles.guidelineCard}>
      {/* Decorative circle */}

      <View style={styles.decorativeCircle} />

      {/* Top row */}

      <View style={styles.cardTopRow}>
        <View style={styles.guidelineIcon}>
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
          styles.guidelineTitle,
          {
            fontSize: 21 * scale,
            lineHeight: 28 * scale,
          },
        ]}
      >
        {item.title}
      </Text>

      {/* Description */}

      <Text
        style={[
          styles.guidelineDescription,
          {
            fontSize: 14 * scale,
            lineHeight: 24 * scale,
          },
        ]}
      >
        {item.description}
      </Text>

      {/* Points */}

      <View style={styles.pointsContainer}>
        {item.points?.map((point, index) => (
          <View
            key={`${item.number}-${index}`}
            style={styles.pointBox}
          >
            <View style={styles.pointIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16 * scale}
                color={COLORS.orange}
              />
            </View>

            <Text
              style={[
                styles.pointText,
                {
                  fontSize: 13.5 * scale,
                  lineHeight: 21 * scale,
                },
              ]}
            >
              {point}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Community_guidelines() {
  const { width } = useWindowDimensions();

  const scale = getFontScale(width);
  const isTablet = width >= 700;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            TOP INTRO
        ================================================= */}

        <View style={styles.topSection}>
          <Text
            style={[
              styles.importantLabel,
              {
                fontSize: 13 * scale,
                letterSpacing: 2 * scale,
              },
            ]}
          >
            IMPORTANT
          </Text>

          <Text
            style={[
              styles.mainTitle,
              {
                fontSize: 30 * scale,
                lineHeight: 38 * scale,
              },
            ]}
          >
            Core Community Rules
          </Text>

          <Text
            style={[
              styles.mainSubtitle,
              {
                fontSize: 14 * scale,
                lineHeight: 22 * scale,
              },
            ]}
          >
            A quick overview of the most important things to
            keep in mind while using Vavi.
          </Text>
        </View>

        {/* =================================================
            SUMMARY CARDS
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
            GUIDELINES HEADER
        ================================================= */}

        <View style={styles.guidelinesHeader}>
          <Text
            style={[
              styles.guidelinesLabel,
              {
                fontSize: 13 * scale,
                letterSpacing: 2 * scale,
              },
            ]}
          >
            GUIDELINES
          </Text>

          <Text
            style={[
              styles.guidelinesTitle,
              {
                fontSize: 30 * scale,
                lineHeight: 38 * scale,
              },
            ]}
          >
            Community Rules at a Glance
          </Text>

          <Text
            style={[
              styles.guidelinesSubtitle,
              {
                fontSize: 14 * scale,
                lineHeight: 22 * scale,
              },
            ]}
          >
            Please follow these rules to help maintain a safe
            and trustworthy Vavi experience.
          </Text>
        </View>

        {/* =================================================
            GUIDELINES GRID
        ================================================= */}

        <View
          style={[
            styles.guidelinesGrid,
            isTablet
              ? styles.guidelinesGridTablet
              : styles.guidelinesGridMobile,
          ]}
        >
          {guidelines.map((item) => (
            <GuidelineCard
              key={item.number}
              item={item}
              scale={scale}
            />
          ))}
        </View>

        {/* =================================================
            HELP / REPORT CARD
        ================================================= */}

        <View style={styles.helpCard}>
          {/* Left side */}

          <View style={styles.helpLeft}>
            <View style={styles.helpIcon}>
              <Ionicons
                name="mail-outline"
                size={24 * scale}
                color={COLORS.white}
              />
            </View>

            <Text
              style={[
                styles.helpTitle,
                {
                  fontSize: 28 * scale,
                  lineHeight: 36 * scale,
                },
              ]}
            >
              Need Help or Want to Report Something?
            </Text>

            <Text
              style={[
                styles.helpDescription,
                {
                  fontSize: 14 * scale,
                  lineHeight: 23 * scale,
                },
              ]}
            >
              For questions, complaints or reports related to
              these Community Guidelines, contact the Vavi
              team.
            </Text>
          </View>

          {/* Right side */}

          <View style={styles.emailList}>
            <View style={styles.emailBox}>
              <Ionicons
                name="mail-outline"
                size={18 * scale}
                color={COLORS.orange}
              />

              <Text
                style={[
                  styles.emailText,
                  {
                    fontSize: 13.5 * scale,
                  },
                ]}
              >
                info@theVavi.com
              </Text>
            </View>

            <View style={styles.emailBox}>
              <Ionicons
                name="scale-outline"
                size={18 * scale}
                color={COLORS.orange}
              />

              <Text
                style={[
                  styles.emailText,
                  {
                    fontSize: 13.5 * scale,
                  },
                ]}
              >
                legal@theVavi.com
              </Text>
            </View>

            <View style={styles.emailBox}>
              <Ionicons
                name="lock-closed-outline"
                size={18 * scale}
                color={COLORS.orange}
              />

              <Text
                style={[
                  styles.emailText,
                  {
                    fontSize: 13.5 * scale,
                  },
                ]}
              >
                privacy@theVavi.com
              </Text>
            </View>
          </View>

          {/* Divider */}

          <View style={styles.helpDivider} />

          {/* Company */}

          <View style={styles.companyInfo}>
            <Text
              style={[
                styles.companyName,
                {
                  fontSize: 12.5 * scale,
                },
              ]}
            >
              Ascendant Vavi LLP
            </Text>

            <Text
              style={[
                styles.officeText,
                {
                  fontSize: 12 * scale,
                  lineHeight: 19 * scale,
                },
              ]}
            >
              Registered Office: S1 - SF-232, CLOUD-9,
              Vaishali, Ghaziabad, U.P.
            </Text>
          </View>
        </View>

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
    paddingTop: 4,
    paddingBottom: 40,
  },

  /* =====================================================
     TOP
  ===================================================== */

  topSection: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 28,
  },

  importantLabel: {
    color: COLORS.orange,
    fontWeight: "800",
    marginBottom: 8,
  },

  mainTitle: {
    color: COLORS.brown,
    fontWeight: "700",
    marginBottom: 10,
  },

  mainSubtitle: {
    color: COLORS.paragraph,
    fontWeight: "400",
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
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 18,
    minHeight: 178,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,

    width: "48%",
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
    lineHeight: 21,
  },

  /* =====================================================
     GUIDELINES HEADER
  ===================================================== */

  guidelinesHeader: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    alignItems: "center",
    paddingTop: 72,
    paddingBottom: 35,
    paddingHorizontal: 10,
  },

  guidelinesLabel: {
    color: COLORS.orange,
    fontWeight: "800",
    marginBottom: 8,
  },

  guidelinesTitle: {
    color: COLORS.brown,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  guidelinesSubtitle: {
    color: COLORS.paragraph,
    textAlign: "center",
  },

  /* =====================================================
     GUIDELINES GRID
  ===================================================== */

  guidelinesGrid: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },

  guidelinesGridMobile: {
    flexDirection: "column",
  },

  guidelinesGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* =====================================================
     GUIDELINE CARD
  ===================================================== */

  guidelineCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,

    paddingHorizontal: 27,
    paddingTop: 27,
    paddingBottom: 26,

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

    width: "100%",
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
    marginBottom: 22,
  },

  guidelineIcon: {
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

  guidelineTitle: {
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 10,
  },

  guidelineDescription: {
    color: COLORS.paragraph,
    marginBottom: 20,
  },

  pointsContainer: {
    width: "100%",
  },

  pointBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    backgroundColor: COLORS.lightBox,

    borderRadius: 12,

    paddingHorizontal: 13,
    paddingVertical: 12,

    marginBottom: 10,

    minHeight: 44,
  },

  pointIcon: {
    width: 22,
    alignItems: "flex-start",
    paddingTop: 1,
  },

  pointText: {
    flex: 1,
    color: COLORS.paragraph,
    paddingRight: 3,
  },

  /* =====================================================
     HELP CARD
  ===================================================== */

  helpCard: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",

    backgroundColor: COLORS.darkBrown,

    borderRadius: 28,

    paddingHorizontal: 30,
    paddingVertical: 30,

    marginTop: 55,

    flexDirection: "row",
    flexWrap: "wrap",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  helpLeft: {
    flex: 1,
    minWidth: 280,
    paddingRight: 25,
  },

  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  helpTitle: {
    color: COLORS.white,
    fontWeight: "700",
    marginBottom: 10,
  },

  helpDescription: {
    color: "#E8D9D1",
  },

  emailList: {
    width: 330,
    maxWidth: "100%",
    justifyContent: "center",
  },

  emailBox: {
    minHeight: 45,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 17,
    marginBottom: 11,
  },

  emailText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 11,
  },

  helpDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginTop: 25,
    marginBottom: 22,
  },

  companyInfo: {
    width: "100%",
  },

  companyName: {
    color: COLORS.white,
    fontWeight: "700",
    marginBottom: 6,
  },

  officeText: {
    color: "#BDAEA6",
  },

  bottomSpace: {
    height: 30,
  },
});