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
      content: `Vavi is a technology-enabled platform operated by Ascendant Vavi LLP that facilitates interaction between Users seeking astrology-related consultations and independent Astrologers or service providers.

Vavi primarily acts as an intermediary and technology platform connecting Users and Astrologers.

Vavi provides and facilitates:

• User and Astrologer registration
• Profile creation and management
• Astrologer discovery
• Astrology consultation services
• Text chat
• Voice consultations
• Consultation requests
• Notifications
• Payment facilitation
• Commission calculation
• Astrologer payout processing
• Reviews and ratings
• Customer support
• Fraud prevention
• Security and moderation

Unless expressly stated otherwise, Ascendant Vavi LLP does not itself provide astrology consultations and does not guarantee the accuracy, effectiveness, outcome, or success of any prediction, opinion, advice, remedy, or guidance provided by an Astrologer.

Astrologers may operate as independent service providers and are responsible for the services and information they provide.`,
    },

    {
      number: "2",
      title: "Information We Collect",
      content: `Depending upon how you use Vavi, we may collect different categories of information.

2.1 Account and Identity Information

• Full name
• Username
• Profile photograph
• Mobile number
• Email address
• Date of birth
• Gender, where voluntarily provided
• Address
• Location information
• Account credentials
• Profile information

For Astrologers, we may additionally collect:

• Identity verification information
• PAN
• Professional information
• Astrology experience
• Qualifications or certifications
• Astrology specialization
• Languages
• Bank/payment information
• Tax-related information`,
    },

    {
      number: "3",
      title: "Astrology and Consultation Information",
      content: `Users may voluntarily provide the following information:

• Date of birth
• Time of birth
• Place of birth
• Kundli/birth-chart information
• Horoscope information
• Questions submitted to an Astrologer
• Relationship-related information
• Career-related information
• Family-related information
• Personal concerns
• Other information voluntarily shared during consultations

Users should avoid providing unnecessary highly sensitive information.`,
    },

    {
      number: "4",
      title: "Communication Information",
      content: `Where Vavi provides communication functionality, we may process information relating to communications conducted through the Platform, including:

• Chat messages
• Messages between Users and Astrologers
• Attachments or media submitted through the Platform
• Consultation-related communications
• Customer support communications
• Reports and complaints

Such information may be processed for:

• Providing the Platform service
• Customer support
• Fraud prevention
• Abuse prevention
• Security
• Dispute resolution
• Policy enforcement
• Legal compliance`,
    },

    {
      number: "5",
      title: "Voice Consultations",
      content: `Vavi may provide voice-call functionality between Users and Astrologers.

We may process technical and operational information relating to voice consultations, including:

• Call initiation
• Call duration
• Participants
• Session identifiers
• Call status
• Technical connection information
• Network-related information

Unless expressly disclosed to you, Vavi does not represent that voice calls are recorded.

If Vavi introduces call-recording functionality in the future, appropriate notice and consent will be provided where required by applicable law.`,
    },

    {
      number: "6",
      title: "Payment Information",
      content: `Vavi may facilitate payments made by Users for consultations or other services.

We may collect or receive:

• Transaction ID
• Payment amount
• Payment status
• Transaction date and time
• Payment gateway reference
• Refund information
• Chargeback information
• Commission information
• Payout information

Payment card, UPI, banking, or other payment credentials may be processed directly by authorized third-party payment providers.

Vavi will not intentionally ask Users or Astrologers to disclose their UPI PIN, card PIN, banking password, OTP, or similar confidential authentication credentials through the Platform.`,
    },

    {
      number: "7",
      title: "Astrologer Commission and Payout Information",
      content: `For Astrologers, Vavi may process:

• Gross consultation earnings
• Vavi commission
• Platform fees
• Applicable taxes or deductions
• Refund adjustments
• Chargebacks
• Net payable earnings
• Payout history
• Bank/payment information

This information may be used to calculate and process Astrologer payouts and maintain financial and accounting records.`,
    },

    {
      number: "8",
      title: "Device and Technical Information",
      content: `When you access Vavi, we may automatically collect:

• IP address
• Device type
• Device model
• Operating system
• Operating system version
• Application version
• Browser information
• Device identifiers
• Network information
• Approximate location information
• Language settings
• Crash reports
• Error logs
• Security logs

We may use this information to:

• Operate the Platform
• Improve performance
• Diagnose technical problems
• Prevent fraud
• Maintain security
• Analyze usage`,
    },

    {
      number: "9",
      title: "Location Information",
      content: `Where you provide permission, Vavi may collect location information.

Location information may be used for:

• Platform functionality
• Personalization
• Security
• Fraud prevention
• Analytics
• Location-related features

You may manage location permissions through your device settings, subject to functionality that requires location access.`,
    },

    {
      number: "10",
      title: "How We Use Your Information",
      content: `We may use information to:

• Create and manage accounts
• Verify Users and Astrologers
• Facilitate astrology consultations
• Connect Users with Astrologers
• Provide chat functionality
• Provide voice consultations
• Process payments
• Calculate commissions
• Process Astrologer payouts
• Process refunds
• Investigate chargebacks
• Provide customer support
• Send service notifications
• Send security notifications
• Improve Platform functionality
• Analyze Platform performance
• Detect fraud
• Prevent abuse and harassment
• Investigate complaints
• Resolve disputes
• Enforce our Terms and Conditions
• Maintain business and transaction records
• Comply with applicable laws
• Respond to lawful government requests
• Protect the rights, property, security, and legitimate interests of Ascendant Vavi LLP`,
    },

    {
      number: "11",
      title: "Information Shared with Astrologers",
      content: `When a User requests a consultation, Vavi may provide the selected Astrologer with information reasonably necessary to conduct the consultation.

This may include:

• Name
• Profile information
• Date of birth
• Time of birth
• Place of birth
• Astrology information
• Questions submitted by the User
• Information voluntarily provided during consultation

The exact information visible to an Astrologer may depend upon Platform functionality.

Users should avoid sharing unnecessary sensitive information.`,
    },

    {
      number: "12",
      title: "Astrologer Information Available to Users",
      content: `To facilitate consultations, Vavi may display certain Astrologer information, including:

• Name/display name
• Profile photograph
• Astrology specialization
• Experience
• Languages
• Ratings
• Reviews
• Consultation pricing
• Availability
• Verification status, where applicable

Astrologers should not include unnecessary sensitive personal information in publicly visible profiles.`,
    },

    {
      number: "13",
      title: "Third-Party Service Providers",
      content: `Vavi may use authorized third-party service providers for:

• Payment processing
• Cloud hosting
• Database hosting
• Authentication
• Push notifications
• Voice communication
• Analytics
• Crash reporting
• Security
• Customer support
• Email/SMS services
• Fraud prevention
• Infrastructure management

These providers may process information as reasonably necessary to provide their services and subject to applicable contractual and legal requirements.`,
    },

    {
      number: "14",
      title: "Payment Processors",
      content: `Payments may be processed through third-party payment gateways or payment processors.

Such providers may have their own terms and privacy policies governing their services.

Vavi does not control the independent privacy practices of third-party payment providers.`,
    },

    {
      number: "15",
      title: "Refunds, Cancellations and Payment Disputes",
      content: `Vavi may process refunds, cancellations, payment reversals, chargebacks, and payment disputes in accordance with the applicable Vavi Refund and Cancellation Policy, Terms and Conditions, and applicable law.

For this purpose, we may process:

• Account information
• Transaction details
• Payment status
• Consultation details
• Chat records
• Voice-session metadata
• Customer support communications
• Complaint information
• Refund reasons
• Chargeback information

Where appropriate and legally permissible, Vavi may provide:

• Full refund
• Partial refund
• Platform credit
• Replacement consultation
• Other appropriate resolution

A refund is not automatically guaranteed merely because a User is dissatisfied with an Astrologer's prediction, opinion, guidance, remedy, or expected outcome, subject to applicable consumer and other mandatory legal rights.`,
    },

    {
      number: "16",
      title: "User and Astrologer Reports",
      content: `Users and Astrologers may report:

• Harassment
• Fraud
• Abuse
• Misconduct
• Payment issues
• Policy violations
• Suspicious activity

When a report is submitted, we may process information reasonably necessary to investigate the report.

This may include:

• Account information
• Communication information
• Transaction information
• Technical information
• Complaint details`,
    },

    {
      number: "17",
      title: "Fraud and Security",
      content: `We may process information to identify, investigate, and prevent:

• Fraud
• Fake accounts
• Payment manipulation
• Fake consultations
• Account takeover
• Identity misuse
• Spam
• Harassment
• Abuse
• Unauthorized access
• Platform manipulation
• Off-platform payment circumvention

We may use automated systems and manual review processes for these purposes.`,
    },

    {
      number: "18",
      title: "Off-Platform Communication and Transactions",
      content: `To protect Users, Astrologers, and the Platform, Vavi may detect or restrict attempts to exchange certain information for the purpose of bypassing Platform systems.

This may include:

• Phone numbers
• WhatsApp details
• Personal email addresses
• External payment details
• Payment links
• Social-media handles

Where permitted by applicable law and Platform policies, Vavi may review relevant Platform activity to detect fraud, circumvention, or abuse.`,
    },

    {
      number: "19",
      title: "Legal Disclosures",
      content: `We may disclose information where reasonably necessary to:

• Comply with applicable law
• Respond to lawful government requests
• Respond to court orders
• Respond to legal processes
• Prevent fraud
• Investigate suspected illegal activity
• Protect Users
• Protect Ascendant Vavi LLP
• Protect Platform infrastructure
• Enforce agreements
• Protect public safety`,
    },

    {
      number: "20",
      title: "Business Transfers",
      content: `If Ascendant Vavi LLP undergoes any of the following:

• Merger
• Acquisition
• Restructuring
• Sale of assets
• Investment transaction
• Business transfer

Information may be transferred as part of the relevant transaction, subject to applicable law.`,
    },

    {
      number: "21",
      title: "Data Security",
      content: `We use reasonable technical, administrative, and organizational safeguards designed to protect information against:

• Unauthorized access
• Unauthorized disclosure
• Alteration
• Destruction
• Misuse

However, no electronic system, server, application, or internet transmission can be guaranteed to be completely secure.

Accordingly, Vavi cannot guarantee absolute security of information.`,
    },

    {
      number: "22",
      title: "Data Retention",
      content: `Vavi retains personal data only for as long as reasonably necessary for the purpose for which it was collected or processed, including for:

• Providing Platform services
• Maintaining active User and Astrologer accounts
• Processing transactions and payouts
• Maintaining legally required financial and accounting records
• Preventing and investigating fraud
• Resolving complaints and disputes
• Maintaining Platform security
• Complying with applicable legal or regulatory obligations
• Establishing, exercising, or defending legal claims

Where a User or Astrologer deletes their account, personal data that is no longer required for a lawful or specified purpose will ordinarily be deleted, anonymized, or removed from active systems within 30 days, subject to applicable law and technical requirements.

Certain records may be retained for a longer period where reasonably necessary or required for legal, tax, accounting, payment, fraud-prevention, security, dispute-resolution, or regulatory purposes.

Such retained information will be kept only for the period reasonably necessary for the applicable purpose or for the period required under applicable law and will thereafter be securely deleted or anonymized.

Vavi does not retain all categories of personal data for a fixed three-to-five-year period merely because an account has been deleted or has become inactive.

Where a specific legal or operational retention period applies to a particular category of information, Vavi may retain that category for the applicable period.

Unused promotional, bonus, cashback, or complimentary Wallet Credits may expire upon account closure in accordance with the Vavi Terms and Conditions and EULA.`,
    },

    {
      number: "23",
      title: "Account Deletion",
      content: `Users and Astrologers may request deletion of their account through available Platform functionality or by contacting Vavi.

Deletion requests may be subject to identity verification.

We may retain certain information where required or permitted by applicable law, including information necessary for:

• Tax/accounting purposes
• Fraud prevention
• Dispute resolution
• Legal compliance
• Security
• Enforcement of agreements`,
    },

    {
      number: "24",
      title: "Data Correction",
      content: `Where supported by applicable law and Platform functionality, you may request correction of inaccurate or incomplete personal information.

We may verify the identity of the requester before processing such request.`,
    },

    {
      number: "25",
      title: "Children's Privacy",
      content: `Vavi is not intended for persons who are not legally capable of entering into applicable agreements.

We do not knowingly seek to collect personal information from children in violation of applicable law.

If we become aware that information has been collected in violation of applicable legal requirements, we may take reasonable steps to delete or restrict such information.`,
    },

    {
      number: "26",
      title: "Cookies and Similar Technologies",
      content: `TheVavi.com may use cookies and similar technologies for:

• Authentication
• Security
• Preferences
• Analytics
• Performance
• Website functionality
• Fraud prevention

You may control cookies through your browser settings, although disabling certain cookies may affect website functionality.`,
    },

    {
      number: "27",
      title: "Marketing Communications",
      content: `Where permitted by applicable law, Vavi may send:

• Service notifications
• Transactional communications
• Security alerts
• Product updates
• Promotional communications

You may opt out of promotional communications through available unsubscribe or account settings.

Essential service and security communications may continue even after promotional opt-out.`,
    },

    {
      number: "28",
      title: "Data Transfers",
      content: `Information may be processed or stored using infrastructure located in India or other jurisdictions, subject to applicable law.

Where information is transferred across jurisdictions, Vavi will take reasonable steps required by applicable law to protect the information.`,
    },

    {
      number: "29",
      title: "Astrologer Confidentiality Obligation",
      content: `Astrologers may receive information about Users solely for providing consultations.

Astrologers are expected to:

• Keep User information confidential
• Use information only for legitimate Platform purposes
• Not sell User information
• Not publish User information
• Not misuse User information
• Not use User information for unauthorized marketing
• Not use User information to circumvent Vavi

Vavi may take appropriate action against Astrologers who misuse User information.`,
    },

    {
      number: "30",
      title: "User Responsibility",
      content: `Users are responsible for information they voluntarily provide to Astrologers.

Users should never provide:

• OTP
• UPI PIN
• Card PIN
• Banking password
• Internet banking credentials
• Authentication codes
• Passwords

Vavi shall not be responsible for losses arising solely from confidential credentials voluntarily disclosed by a User to another person, subject to applicable law.`,
    },

    {
      number: "31",
      title: "No Sale of Personal Information",
      content: `Vavi does not intentionally sell personal information as a standalone commercial product.

However, information may be processed or shared with authorized service providers, payment processors, infrastructure providers, or other parties where reasonably necessary to operate the Platform or comply with applicable law.`,
    },

    {
      number: "32",
      title: "Third-Party Websites and Services",
      content: `Vavi may contain links or integrations with third-party services.

Third-party services operate under their own terms and privacy policies.

Vavi is not responsible for the independent privacy practices of third parties.`,
    },

    {
      number: "33",
      title: "Account Suspension and Information Retention",
      content: `If an account is suspended or terminated because of any of the following, we may retain and process relevant information for investigation, security, dispute resolution, and legal compliance:

• Fraud
• Abuse
• Harassment
• Payment manipulation
• Security violations
• Illegal activity
• False information
• Policy violations`,
    },

    {
      number: "34",
      title: "Privacy Rights and Requests",
      content: `Subject to applicable law, you may have rights relating to your personal information, including rights to:

• Request access to certain personal information
• Request correction of inaccurate information
• Request deletion where legally permissible
• Withdraw consent where applicable
• Raise privacy-related concerns
• Submit complaints regarding processing of personal information

Requests may be subject to reasonable identity verification and applicable legal limitations.

Withdrawal of Consent

Where processing of personal data is based on the User’s or Astrologer’s consent, the individual may withdraw such consent at any time through available privacy or account settings within the Vavi Platform or by emailing privacy@thevavi.com.

Vavi will provide a reasonable and accessible method for withdrawal of consent.

Withdrawal of consent will not affect the lawfulness of processing carried out before such consent was withdrawn.

Following a valid withdrawal of consent, Vavi will cease processing personal data based on that consent within a reasonable period, except where continued processing is required or permitted under applicable law or another valid legal basis.

Withdrawal of consent may affect or restrict access to features or services that reasonably require the relevant personal data in order to operate.

For example, withdrawal of consent required for account authentication, astrology consultations, or other essential Platform functionality may prevent Vavi from continuing to provide the relevant service.`,
    },

    {
      number: "35",
      title: "Grievance / Privacy Complaints",
      content: `Users and Astrologers may submit privacy-related requests, grievances, or complaints by contacting Vavi at privacy@thevavi.com.

Vavi may request reasonable information necessary to:

• Verify the identity of the requester
• Identify the relevant account
• Understand the nature of the grievance
• Investigate and resolve the matter

Vavi will endeavour to acknowledge eligible complaints within 24 hours of receipt.

Where applicable to Vavi under relevant intermediary or other legal requirements, grievances will be addressed within the timeline prescribed by applicable law.

Vavi will ordinarily seek to resolve eligible grievances within 15 days from receipt of the complaint.

Where a matter is unusually complex or requires additional verification, investigation, third-party information, or legal review, Vavi will communicate the status of the matter to the complainant and handle it in accordance with applicable legal requirements.

Nothing in this section restricts any statutory grievance, complaint, or appeal right available to an individual under applicable law.`,
    },

    {
      number: "36",
      title: "Policy Changes",
      content: `We may update this Privacy Policy from time to time.

Where appropriate, material changes may be communicated through:

• App notification
• Website notice
• Email
• Other reasonable means

The updated Privacy Policy will become effective on the date stated in the updated version.

Your continued use of Vavi after the effective date of an updated Privacy Policy will be subject to the updated Privacy Policy, to the extent permitted by applicable law.`,
    },

    {
      number: "37",
      title: "Governing Law",
      content: `This Privacy Policy shall be interpreted in accordance with the applicable laws of India, subject to mandatory legal rights and requirements that cannot legally be excluded or restricted.`,
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
            Your privacy matters to us. Learn how Vavi
            collects, uses, protects and manages your information.
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
            , operating the Vavi platform, collects, uses,
            stores, processes, shares and protects information
            relating to individuals who access or use Vavi.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            This Privacy Policy applies to the Vavi User
            Application, Vavi Astrologer Application,
            theVavi.com website, dashboards, and related
            services, features, and technologies operated by
            Ascendant Vavi LLP.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            For the purposes of this Privacy Policy, persons
            seeking astrology-related services may be referred
            to as <Text style={styles.boldText}>Users</Text>,
            and persons providing astrology-related services
            may be referred to as{" "}
            <Text style={styles.boldText}>Astrologers</Text>.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            By accessing or using Vavi, you acknowledge that
            you have read and understood this Privacy Policy.
            Where applicable law requires specific consent for
            a particular processing activity, Vavi will obtain
            such consent through appropriate means.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            Introduction
          </Text>

          <Text style={styles.sectionContentSpacing}>
            This Privacy Policy is intended to comply with
            applicable Indian laws relating to privacy,
            information technology, and personal data
            protection, including, where applicable, the
            Information Technology Act, 2000, the Digital
            Personal Data Protection Act, 2023, the rules made
            thereunder, and other applicable laws and
            regulations, as amended from time to time.
          </Text>
        </View>

        {/* =================================
            PRIVACY SECTIONS
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

        {/* =================================
            CONTACT - SECTION 38
        ================================== */}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>
            38. Contact Us
          </Text>

          <Text style={styles.contactIntro}>
            For privacy-related questions, requests, or concerns:
          </Text>

          <View style={styles.contactGrid}>
            {/* LEFT */}
            <View style={styles.contactColumn}>
              <Text style={styles.contactLabel}>
                Company
              </Text>

              <Text style={styles.contactValue}>
                Ascendant Vavi LLP
              </Text>

              <Text style={styles.contactLabel}>
                Website
              </Text>

              <Text style={styles.contactValue}>
                theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Privacy Email
              </Text>

              <Text style={styles.contactValue}>
                privacy@theVavi.com
              </Text>
            </View>

            {/* RIGHT */}
            <View style={styles.contactColumn}>
              <Text style={styles.contactLabel}>
                Brand
              </Text>

              <Text style={styles.contactValue}>
                Vavi
              </Text>

              <Text style={styles.contactLabel}>
                General Email
              </Text>

              <Text style={styles.contactValue}>
                info@theVavi.com
              </Text>
            </View>
          </View>

          <Text style={styles.contactLabel}>
            Registered Office
          </Text>

          <Text style={styles.contactValue}>
            S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad, U.P.
          </Text>

          <View style={styles.footerDivider} />

          <Text style={styles.footerText}>
            © 2026 Ascendant Vavi LLP. All Rights Reserved.
          </Text>
        </View>

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
    backgroundColor: "#f15619",
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

  /* =================================
      CONTACT CARD
  ================================== */

  contactCard: {
    backgroundColor: "#3A2117",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(3),

    marginTop: hp(1),
    marginBottom: hp(2),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },

  contactTitle: {
    fontSize: RF(22),
    lineHeight: RF(30),
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: hp(1),
  },

  contactIntro: {
    fontSize: RF(14),
    lineHeight: RF(22),
    color: "#D7C7BF",
    marginBottom: hp(2.5),
  },

  contactGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(5),
  },

  contactColumn: {
    flex: 1,
  },

  contactLabel: {
    fontSize: RF(14),
    lineHeight: RF(21),
    color: "#D7C7BF",
    marginBottom: hp(0.5),
  },

  contactValue: {
    fontSize: RF(15),
    lineHeight: RF(22),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: hp(2),
  },

  footerDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: hp(1),
    marginBottom: hp(2),
  },

  footerText: {
    fontSize: RF(13),
    lineHeight: RF(20),
    color: "#D7C7BF",
  },

  bottomSpace: {
    height: hp(3),
  },
});