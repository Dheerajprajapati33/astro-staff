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

import { Typography } from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

// ============================================================
// COLORS - same style as ASTRO legal / EULA screens
// ============================================================

const ORANGE = "#F97316";
const DARK = "#171717";
const TEXT = "#333333";
const MUTED = "#666666";
const LIGHT_BG = "#F7F7F7";
const BORDER = "#E8E8E8";
const WHITE = "#FFFFFF";

// ============================================================
// COMMUNITY GUIDELINES DATA
// ============================================================
// Source: VAVI Community Guidelines
// Total sections: 39
// ============================================================

const COMMUNITY_GUIDELINES_DATA = [
  {
    number: "01",
    title: "Purpose of These Guidelines",
    content: [
      "These Community Guidelines are intended to help maintain a safe, respectful, honest and trustworthy environment across Vavi.",
      "They apply to interactions between Users and Astrologers and to the use of Vavi's features, services and communication tools.",
      "These Guidelines are designed to support responsible participation and to explain conduct that may result in review or enforcement action.",
    ],
  },

  {
    number: "02",
    title: "Who Must Follow These Guidelines",
    content: [
      "These Guidelines apply to all Users, Astrologers and other persons who access or use Vavi.",
      "By using Vavi, you agree to follow these Guidelines together with the applicable Terms, EULA, Privacy Policy, Refund Policy and other Vavi policies.",
    ],
  },

  {
    number: "03",
    title: "Respectful Conduct",
    content: [
      "Users and Astrologers must communicate respectfully and must not engage in abusive, threatening, hateful, discriminatory or harassing behaviour.",
      "You must not use insulting, degrading, humiliating or offensive language toward another person.",
      "Disagreements should be handled respectfully without intimidation or personal attacks.",
    ],
  },

  {
    number: "04",
    title: "Sexual Harassment & Inappropriate Content",
    content: [
      "Sexual harassment, unwanted sexual advances, sexually explicit requests or inappropriate sexual behaviour are prohibited.",
      "You must not send or request sexually explicit images, videos, messages or other inappropriate content.",
      "Vavi may take appropriate action where sexual harassment or inappropriate content is reported or detected.",
    ],
  },

  {
    number: "05",
    title: "Threats, Violence & Dangerous Conduct",
    content: [
      "Threats of violence, encouragement of violence or other dangerous conduct are prohibited.",
      "You must not threaten another person, encourage physical harm or attempt to intimidate another person through threats.",
      "Where appropriate, Vavi may take action to protect Users, Astrologers or other persons.",
    ],
  },

  {
    number: "06",
    title: "Self-Harm & Emergency Situations",
    content: [
      "Vavi is not an emergency service and should not be relied upon for immediate emergency assistance.",
      "Astrology consultations must not be represented as a replacement for emergency, medical or professional assistance.",
      "Where an immediate safety concern is reported, appropriate action may be taken consistent with applicable law and Vavi policies.",
    ],
  },

  {
    number: "07",
    title: "No Guaranteed Astrology Outcomes",
    content: [
      "Astrology is interpretive and subjective and does not provide guaranteed outcomes.",
      "Astrologers must not represent an astrological interpretation as a guaranteed future event or guaranteed result.",
      "Users should understand that astrology consultations are provided for informational and interpretive purposes.",
    ],
  },

  {
    number: "08",
    title: "No Fear-Based Manipulation",
    content: [
      "Astrologers must not intentionally create fear, panic or emotional distress in order to pressure a User into purchasing additional services.",
      "Statements intended to manipulate a User into paying money by claiming unavoidable disasters, curses or guaranteed negative events are prohibited.",
      "Astrological guidance should be communicated responsibly and without coercive manipulation.",
    ],
  },

  {
    number: "09",
    title: "Medical, Legal & Financial Claims",
    content: [
      "Astrology consultations must not be presented as professional medical, legal or financial advice.",
      "Astrologers must not claim that an astrological consultation can replace qualified professional advice.",
      "Users should consult appropriate licensed professionals for medical, legal or financial matters.",
    ],
  },

  {
    number: "10",
    title: "Fraud & Deception",
    content: [
      "Fraudulent, deceptive or intentionally misleading conduct is prohibited.",
      "You must not provide false information, manipulate transactions or intentionally mislead another person for financial or personal gain.",
      "Vavi may investigate suspected fraud and take appropriate enforcement action.",
    ],
  },

  {
    number: "11",
    title: "Fake Accounts & Consultations",
    content: [
      "Creating or operating fake accounts or using another person's identity without authorization is prohibited.",
      "You must not create fake consultations, manipulate consultation activity or otherwise attempt to artificially increase platform activity.",
      "Accounts suspected of fraudulent activity may be reviewed or restricted.",
    ],
  },

  {
    number: "12",
    title: "Payment Manipulation",
    content: [
      "Users and Astrologers must not manipulate payments, consultation charges, wallet balances or platform credits.",
      "Attempts to bypass Vavi's payment systems or obtain unauthorized financial benefits are prohibited.",
      "Suspicious payment activity may be investigated and may result in account action.",
    ],
  },

  {
    number: "13",
    title: "Off-Platform Payments",
    content: [
      "Users and Astrologers must not use Vavi consultations to arrange unauthorized off-platform payments.",
      "Astrologers must not request that Users transfer consultation payments outside Vavi's approved payment mechanisms.",
      "Attempts to move transactions outside the platform may result in enforcement action.",
    ],
  },

  {
    number: "14",
    title: "Contact Information Sharing",
    content: [
      "Sharing personal contact information for the purpose of bypassing Vavi's platform or payment systems is prohibited where such sharing violates Vavi policies.",
      "You should use Vavi's available communication features for consultations and platform-related interactions.",
      "Vavi may review activity where contact information is used to facilitate prohibited off-platform transactions.",
    ],
  },

  {
    number: "15",
    title: "Privacy & Personal Information",
    content: [
      "You must respect the privacy of other Users and Astrologers.",
      "Do not request, collect, publish or misuse another person's personal information without an appropriate reason or authorization.",
      "Personal information shared during a consultation should be handled responsibly and in accordance with applicable Vavi policies.",
    ],
  },

  {
    number: "16",
    title: "Screenshots & Recordings",
    content: [
      "Users and Astrologers should respect applicable privacy rights when taking screenshots, recordings or copies of consultation communications.",
      "You must not misuse, distribute or publicly share private consultation content in a manner that violates applicable law, privacy rights or Vavi policies.",
      "Vavi may maintain or review platform records where permitted by applicable policies and law.",
    ],
  },

  {
    number: "17",
    title: "Impersonation",
    content: [
      "Impersonating another User, Astrologer, Vavi representative or other person is prohibited.",
      "You must not falsely represent your identity, qualifications, position or relationship with Vavi.",
      "Accounts involved in impersonation may be restricted or terminated.",
    ],
  },

  {
    number: "18",
    title: "Astrologer Qualifications",
    content: [
      "Astrologers must provide truthful information regarding their experience, qualifications and services.",
      "Astrologers must not falsely claim certifications, professional qualifications, achievements or experience.",
      "Vavi may review information provided by Astrologers where required for platform safety, integrity or compliance.",
    ],
  },

  {
    number: "19",
    title: "Spam & Unsolicited Marketing",
    content: [
      "Spam, excessive unsolicited messages and unauthorized promotional activity are prohibited.",
      "Users and Astrologers must not use Vavi communication features to distribute unrelated advertisements or promotional content.",
      "Repeated unwanted communication may result in restrictions or other enforcement action.",
    ],
  },

  {
    number: "20",
    title: "Security & Malicious Software",
    content: [
      "You must not attempt to compromise the security of Vavi or another person's account, device or information.",
      "Uploading, distributing or using malicious software, harmful code or other security threats through Vavi is prohibited.",
      "Security vulnerabilities or suspected malicious activity should be reported to Vavi.",
    ],
  },

  {
    number: "21",
    title: "Automated Access & Scraping",
    content: [
      "Unauthorized automated access, scraping, crawling, data extraction or similar activity is prohibited.",
      "You must not use bots, scripts or automated systems to access or collect Vavi data without authorization.",
      "Vavi may take technical or account-level measures to protect the platform from unauthorized automated activity.",
    ],
  },

  {
    number: "22",
    title: "Intellectual Property",
    content: [
      "You must respect the intellectual property rights of Vavi, Users, Astrologers and other third parties.",
      "You must not copy, distribute, modify or use protected content without appropriate authorization.",
      "Use of Vavi content must comply with applicable intellectual property rights and Vavi's applicable terms.",
    ],
  },

  {
    number: "23",
    title: "User-Generated Content",
    content: [
      "Users and Astrologers are responsible for content they submit, upload or communicate through Vavi.",
      "Content must comply with applicable laws and Vavi policies.",
      "Vavi may review, restrict or remove content where permitted by applicable policies or law.",
    ],
  },

  {
    number: "24",
    title: "Reviews & Ratings",
    content: [
      "Reviews and ratings should be genuine, honest and based on actual experiences.",
      "You must not manipulate reviews or ratings, create fake reviews or offer incentives for misleading ratings.",
      "False or abusive review activity may be reviewed and may result in appropriate action.",
    ],
  },

  {
    number: "25",
    title: "False Complaints",
    content: [
      "Complaints should be made honestly and in good faith.",
      "Knowingly submitting false, fabricated or malicious complaints is prohibited.",
      "Vavi may take appropriate action where a complaint process is intentionally abused.",
    ],
  },

  {
    number: "26",
    title: "Customer Support Abuse",
    content: [
      "Customer support channels must be used respectfully and for genuine support or complaint purposes.",
      "Threatening, abusive or repeatedly disruptive behaviour toward support personnel is prohibited.",
      "Vavi may restrict support access where the support process is intentionally abused.",
    ],
  },

  {
    number: "27",
    title: "Promotions & Free Services",
    content: [
      "Promotional offers, discounts, free consultations and platform credits must be used according to their applicable terms.",
      "You must not manipulate promotional systems or create multiple accounts to obtain unauthorized promotional benefits.",
      "Vavi may cancel or restrict promotional benefits where misuse is identified.",
    ],
  },

  {
    number: "28",
    title: "Account Sharing",
    content: [
      "Accounts should not be shared with other persons where such sharing is prohibited by Vavi's applicable terms.",
      "You are responsible for maintaining the security of your account credentials.",
      "Activity performed through your account may be associated with your account unless otherwise established.",
    ],
  },

  {
    number: "29",
    title: "Platform Monitoring",
    content: [
      "Vavi may monitor platform activity and communications where permitted by applicable policies and law.",
      "Monitoring may be used for safety, fraud prevention, quality assurance, security, dispute resolution and compliance purposes.",
      "Platform monitoring does not mean that every communication or activity will necessarily be reviewed manually.",
    ],
  },

  {
    number: "30",
    title: "Reporting Violations",
    content: [
      "Users and Astrologers are encouraged to report suspected violations of these Community Guidelines.",
      "Reports should provide sufficient information to help Vavi understand the issue.",
      "Reports may be reviewed and investigated according to applicable Vavi procedures.",
    ],
  },

  {
    number: "31",
    title: "Investigations",
    content: [
      "Vavi may investigate suspected violations of these Guidelines.",
      "During an investigation, Vavi may review relevant platform activity, communications, account information and other available information where permitted.",
      "Users and Astrologers may be asked to provide information or cooperate with an investigation.",
    ],
  },

  {
    number: "32",
    title: "Enforcement Actions",
    content: [
      "Where a violation is identified, Vavi may take appropriate enforcement action.",
      "Possible actions may include warnings, content restrictions, communication restrictions, temporary suspension, limitation of platform features or account termination.",
      "The action taken may depend on the nature, seriousness and circumstances of the violation.",
    ],
  },

  {
    number: "33",
    title: "Payouts & Enforcement",
    content: [
      "Where an Astrologer's account is subject to enforcement action, applicable payout or balance issues may be reviewed according to Vavi's applicable policies.",
      "Vavi may withhold, adjust or review payments where permitted by applicable terms, policies or law.",
      "Enforcement decisions may take into account suspected fraud, abuse, prohibited conduct or other policy violations.",
    ],
  },

  {
    number: "34",
    title: "Legal & Law-Enforcement Requests",
    content: [
      "Vavi may respond to valid legal requests, court orders, regulatory requirements or law-enforcement requests as required or permitted by applicable law.",
      "Information may be disclosed where legally required or otherwise permitted under applicable privacy and legal requirements.",
    ],
  },

  {
    number: "35",
    title: "Appeal & Account Review",
    content: [
      "Where an applicable Vavi process provides for an appeal or review, Users and Astrologers may use the relevant support or review process.",
      "Appeals should contain relevant information explaining why a decision should be reconsidered.",
      "Vavi may review the available information and determine whether an action should be maintained, modified or reversed.",
    ],
  },

  {
    number: "36",
    title: "No Retaliation",
    content: [
      "Vavi does not permit retaliation against persons who make genuine reports or participate in an investigation.",
      "Users and Astrologers should not threaten, harass or otherwise target another person because they submitted a genuine complaint or report.",
    ],
  },

  {
    number: "37",
    title: "Changes to These Guidelines",
    content: [
      "Vavi may update these Community Guidelines from time to time.",
      "Changes may be made to reflect changes in the platform, applicable law, safety requirements or operational practices.",
      "Continued use of Vavi after applicable updates may be subject to the updated Guidelines.",
    ],
  },

  {
    number: "38",
    title: "Relationship With Other Policies",
    content: [
      "These Community Guidelines should be read together with Vavi's Terms, EULA, Privacy Policy, Refund Policy, Contact and Grievance Policy and other applicable policies.",
      "If another Vavi policy contains additional requirements for a specific subject, those requirements may also apply.",
    ],
  },

  {
    number: "39",
    title: "Electronic Acceptance",
    content: [
      "By accessing or using Vavi, you acknowledge that you have had an opportunity to review these Community Guidelines.",
      "Your continued use of Vavi constitutes your acceptance of the Guidelines to the extent permitted by applicable law.",
    ],
  },
];

// ============================================================
// HELP / CONTACT DATA
// ============================================================

const CONTACT_DATA = [
  {
    label: "General Support",
    value: "info@theVavi.com",
    icon: "mail-outline",
  },
  {
    label: "Legal",
    value: "legal@theVavi.com",
    icon: "document-text-outline",
  },
  {
    label: "Privacy",
    value: "privacy@theVavi.com",
    icon: "lock-closed-outline",
  },
];

// ============================================================
// POLICY CARD
// ============================================================

const PolicySection = ({ item }) => {
  return (
    <View style={styles.policyCard}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>

      <View style={styles.policyContent}>
        <Text style={styles.policyTitle}>{item.title}</Text>

        {item.content?.map((paragraph, index) => (
          <Text
            key={`${item.number}-${index}`}
            style={[
              styles.policyParagraph,
              index === item.content.length - 1 &&
                styles.lastPolicyParagraph,
            ]}
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );
};

// ============================================================
// CONTACT ROW
// ============================================================

const ContactRow = ({ item }) => {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <Ionicons
          name={item.icon}
          size={RF(18)}
          color={ORANGE}
        />
      </View>

      <View style={styles.contactTextContainer}>
        <Text style={styles.contactLabel}>{item.label}</Text>
        <Text style={styles.contactValue}>{item.value}</Text>
      </View>
    </View>
  );
};

// ============================================================
// MAIN SCREEN
// ============================================================

export default function Community_guidelines() {
  const guidelines = useMemo(() => {
    return COMMUNITY_GUIDELINES_DATA;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* ====================================================
            HEADER
        ==================================================== */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={RF(23)}
              color={DARK}
            />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Community Guidelines</Text>
          </View>

          <View style={styles.headerRightSpace} />
        </View>

        {/* ====================================================
            CONTENT
        ==================================================== */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              TOP ICON
          ================================================== */}
          <View style={styles.heroIconContainer}>
            <View style={styles.heroIconCircle}>
              <Ionicons
                name="people-outline"
                size={RF(34)}
                color={ORANGE}
              />
            </View>
          </View>

          {/* ==================================================
              TITLE
          ================================================== */}
          <Text style={styles.mainTitle}>Community Guidelines</Text>

          <Text style={styles.mainSubtitle}>
            Guidelines for safe, respectful and responsible use of
            Vavi.
          </Text>

          {/* ==================================================
              ABOUT CARD - SAME STYLE AS EULA
          ================================================== */}
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
                About These Guidelines
              </Text>
            </View>

            <Text style={styles.aboutText}>
              These Community Guidelines are designed to maintain a
              safe, respectful, honest and trustworthy environment
              across Vavi.
            </Text>

            <Text style={styles.aboutText}>
              They apply to Users, Astrologers and other persons
              accessing or using Vavi and should be read together
              with the applicable Vavi policies and terms.
            </Text>
          </View>

          {/* ==================================================
              IMPORTANT CARD
          ================================================== */}
          <View style={styles.importantCard}>
            <View style={styles.importantIconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={RF(23)}
                color={ORANGE}
              />
            </View>

            <View style={styles.importantContent}>
              <Text style={styles.importantTitle}>Important</Text>

              <Text style={styles.importantText}>
                Please follow these Guidelines when communicating
                with Users, Astrologers and using Vavi's services.
                Violations may result in warnings, restrictions,
                suspension or other enforcement action.
              </Text>
            </View>
          </View>

          {/* ==================================================
              SECTION HEADER
          ================================================== */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLine} />

            <Text style={styles.sectionHeaderText}>
              COMMUNITY GUIDELINES
            </Text>

            <View style={styles.sectionHeaderLine} />
          </View>

          {/* ==================================================
              ALL 39 GUIDELINES
          ================================================== */}
          {guidelines.map((item) => (
            <PolicySection
              key={`${item.number}-${item.title}`}
              item={item}
            />
          ))}

          {/* ==================================================
              HELP / CONTACT CARD
          ================================================== */}
          <View style={styles.contactCard}>
            <View style={styles.contactCardIcon}>
              <Ionicons
                name="help-buoy-outline"
                size={RF(30)}
                color={WHITE}
              />
            </View>

            <Text style={styles.contactCardTitle}>
              Need Help or Want to Report Something?
            </Text>

            <Text style={styles.contactCardText}>
              If you have a question, concern or want to report a
              possible violation of these Community Guidelines,
              please contact Vavi through the appropriate support
              channel.
            </Text>

            <View style={styles.contactDivider} />

            {CONTACT_DATA.map((item) => (
              <ContactRow
                key={item.label}
                item={item}
              />
            ))}

            <View style={styles.companyContainer}>
              <Text style={styles.companyLabel}>Company</Text>

              <Text style={styles.companyName}>
                Ascendant Vavi LLP
              </Text>

              <Text style={styles.companyAddress}>
                S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad,
                U.P.
              </Text>
            </View>
          </View>

          {/* ==================================================
              FOOTER
          ================================================== */}
          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={RF(18)}
              color={ORANGE}
            />

            <Text style={styles.footerText}>
              Please use Vavi responsibly and respectfully.
            </Text>
          </View>

          <Text style={styles.footerCopyright}>
            © Vavi. All rights reserved.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  header: {
    height: hp(7),
    minHeight: 54,
    maxHeight: 68,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  backButton: {
    width: wp(10),
    height: wp(10),
    maxWidth: 44,
    maxHeight: 44,
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleContainer: {
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

  headerRightSpace: {
    width: wp(10),
    maxWidth: 44,
  },

  // ----------------------------------------------------------
  // SCROLL
  // ----------------------------------------------------------

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2.5),
    paddingBottom: hp(5),
  },

  // ----------------------------------------------------------
  // HERO
  // ----------------------------------------------------------

  heroIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },

  heroIconCircle: {
    width: wp(18),
    height: wp(18),
    maxWidth: 78,
    maxHeight: 78,
    minWidth: 64,
    minHeight: 64,
    borderRadius: 999,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE0CC",
  },

  mainTitle: {
    fontSize: RF(24),
    fontFamily: Typography?.bold,
    color: DARK,
    textAlign: "center",
    lineHeight: RF(30),
    marginTop: hp(0.5),
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

  // ----------------------------------------------------------
  // ABOUT CARD
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // IMPORTANT
  // ----------------------------------------------------------

  importantCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8F3",
    borderWidth: 1,
    borderColor: "#FFE0CC",
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    marginBottom: hp(2.8),
  },

  importantIconContainer: {
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

  // ----------------------------------------------------------
  // SECTION HEADER
  // ----------------------------------------------------------

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.8),
    paddingHorizontal: wp(1),
  },

  sectionHeaderLine: {
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
    textAlign: "center",
  },

  // ----------------------------------------------------------
  // POLICY CARD
  // ----------------------------------------------------------

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
    maxWidth: 44,
    maxHeight: 44,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  numberText: {
    fontSize: RF(12),
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

  policyParagraph: {
    fontSize: RF(13.2),
    fontFamily: Typography?.regular,
    color: TEXT,
    lineHeight: RF(20.5),
    marginBottom: hp(1),
  },

  lastPolicyParagraph: {
    marginBottom: 0,
  },

  // ----------------------------------------------------------
  // CONTACT CARD
  // ----------------------------------------------------------

  contactCard: {
    backgroundColor: DARK,
    borderRadius: 20,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.8),
    marginTop: hp(2),
  },

  contactCardIcon: {
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

  contactCardTitle: {
    fontSize: RF(19),
    fontFamily: Typography?.bold,
    color: WHITE,
    lineHeight: RF(25),
    marginBottom: hp(1),
  },

  contactCardText: {
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

  // ----------------------------------------------------------
  // CONTACT ROW
  // ----------------------------------------------------------

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  contactIcon: {
    width: wp(10),
    height: wp(10),
    maxWidth: 42,
    maxHeight: 42,
    borderRadius: 12,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  contactTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  contactLabel: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#AFAFAF",
    marginBottom: hp(0.2),
  },

  contactValue: {
    fontSize: RF(13.5),
    fontFamily: Typography?.semiBold,
    color: WHITE,
  },

  companyContainer: {
    marginTop: hp(1),
    paddingTop: hp(1.8),
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },

  companyLabel: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#AFAFAF",
    marginBottom: hp(0.4),
  },

  companyName: {
    fontSize: RF(14),
    fontFamily: Typography?.semiBold,
    color: WHITE,
    marginBottom: hp(0.5),
  },

  companyAddress: {
    fontSize: RF(12.5),
    fontFamily: Typography?.regular,
    color: "#C8C8C8",
    lineHeight: RF(19),
  },

  // ----------------------------------------------------------
  // FOOTER
  // ----------------------------------------------------------

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.5),
    paddingHorizontal: wp(4),
  },

  footerText: {
    fontSize: RF(12),
    fontFamily: Typography?.regular,
    color: MUTED,
    marginLeft: wp(2),
    textAlign: "center",
  },

  footerCopyright: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: "#999999",
    textAlign: "center",
    marginTop: hp(1),
  },
});