import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { hp, RF, wp } from "../../utils/responsive";

/* =========================================================
   CONTACT / GRIEVANCE POLICY DATA
========================================================= */

const sections = [
  {
    number: "1",
    title: "PURPOSE",
    paragraphs: [
      "Vavi is committed to providing Users and Astrologers with a clear mechanism to:",
    ],
    bullets: [
      "Raise complaints;",
      "Report Platform problems;",
      "Report misconduct;",
      "Raise payment or refund issues;",
      "Raise payout or commission issues;",
      "Submit privacy requests;",
      "Report fraud or security concerns;",
      "Report abusive or prohibited content;",
      "Request review of certain Platform actions;",
      "Contact Vavi regarding legal or regulatory matters.",
    ],
  },

  {
    number: "2",
    title: "WHO MAY SUBMIT A GRIEVANCE",
    paragraphs: [
      "A grievance may be submitted by:",
    ],
    bullets: [
      "A registered Vavi User;",
      "A registered Astrologer;",
      "A person whose rights or personal information may be affected;",
      "An authorized representative where legally permissible;",
      "Any other person entitled to submit a complaint under applicable law.",
    ],
    afterBullets:
      "Vavi may request reasonable verification before acting on a complaint.",
  },

  {
    number: "3",
    title: "TYPES OF GRIEVANCES",
    paragraphs: [
      "Users and Astrologers may contact Vavi regarding matters including:",
    ],

    subSections: [
      {
        title: "Account Issues",
        bullets: [
          "Login problems;",
          "Unauthorized access;",
          "Account suspension;",
          "Account termination;",
          "Account deletion;",
          "Incorrect profile information.",
        ],
      },

      {
        title: "Consultation Issues",
        bullets: [
          "Chat consultation problems;",
          "Voice-call problems;",
          "Astrologer no-show;",
          "Consultation not delivered;",
          "Misconduct during consultation;",
          "Technical consultation failure.",
        ],
      },

      {
        title: "Payment Issues",
        bullets: [
          "Failed payment;",
          "Duplicate payment;",
          "Incorrect deduction;",
          "Wallet issue;",
          "Refund status;",
          "Unauthorized transaction;",
          "Payment reversal;",
          "Chargeback matter.",
        ],
      },

      {
        title: "Astrologer Issues",
        bullets: [
          "Earnings discrepancy;",
          "Commission calculation;",
          "Payout delay;",
          "Failed payout;",
          "Payout hold;",
          "Refund adjustment;",
          "Account restriction.",
        ],
      },

      {
        title: "Privacy Issues",
        bullets: [
          "Access to personal data;",
          "Data correction;",
          "Account deletion;",
          "Data-erasure request;",
          "Withdrawal of consent;",
          "Unauthorized use of personal information;",
          "Privacy complaints.",
        ],
      },

      {
        title: "Safety and Conduct Issues",
        bullets: [
          "Harassment;",
          "Abuse;",
          "Threats;",
          "Blackmail;",
          "Sexual harassment;",
          "Fraud;",
          "Fake astrologers;",
          "Fear-based manipulation;",
          "Off-platform payment requests;",
          "User-data misuse.",
        ],
      },
    ],
  },

  {
    number: "4",
    title: "HOW TO CONTACT VAVI",
    paragraphs: [
      "Depending on the nature of the matter, Users and Astrologers may contact Vavi through the following channels.",
    ],

    subSections: [
      {
        title: "General Support",
        paragraphs: [
          "For general Platform questions, account support, consultation issues, and service-related queries:",
          "Email: info@theVavi.com",
        ],
      },

      {
        title: "Privacy Requests",
        paragraphs: [
          "For data access, correction, deletion, consent withdrawal, or other privacy matters:",
          "Email: privacy@theVavi.com",
        ],
      },

      {
        title: "Legal / Grievance Complaints",
        paragraphs: [
          "For formal grievances, policy complaints, legal notices, serious misconduct, or unresolved complaints:",
          "Email: legal@theVavi.com",
        ],
      },
    ],

    afterBullets:
      "Users may also use any in-app Help, Support, Report, or Grievance functionality made available by Vavi.",
  },

  {
    number: "5",
    title: "GRIEVANCE OFFICER",
    paragraphs: [
      "Where required under applicable law, Vavi shall designate a Grievance Officer responsible for receiving and addressing eligible grievances.",
    ],

    info: [
      ["Grievance Officer", "Sunil Kumar Barleja"],
      ["Company", "Ascendant Vavi LLP"],
      ["Brand", "Vavi"],
      ["Email", "legal@theVavi.com"],
      [
        "Address",
        "S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad, U.P.",
      ],
      ["Availability", "Monday to Friday"],
      ["Working Hours", "10:00 AM to 5:00 PM"],
    ],

    paragraphs2: [
      "The Grievance Officer may coordinate with relevant Vavi teams including:",
    ],

    bullets2: [
      "Customer support;",
      "Privacy;",
      "Payments;",
      "Security;",
      "Fraud prevention;",
      "Legal;",
      "Astrologer operations.",
    ],

    afterBullets2:
      "Current IT Rules require an intermediary, where applicable, to prominently publish the Grievance Officer’s name, contact details, and complaint mechanism.",
  },

  {
    number: "6",
    title: "INFORMATION TO INCLUDE IN A COMPLAINT",
    paragraphs: [
      "To assist Vavi in investigating a grievance, the complainant should provide, where relevant:",
    ],
    bullets: [
      "Full name;",
      "Registered mobile number;",
      "Registered email address;",
      "User or Astrologer account details;",
      "Consultation ID;",
      "Transaction ID;",
      "Payment reference;",
      "Payout reference;",
      "Date and approximate time of incident;",
      "Name/profile of the relevant User or Astrologer;",
      "Description of the issue;",
      "Screenshots or supporting documents;",
      "Details of the resolution requested.",
    ],

    afterBullets:
      "Users should not send:",
    bullets2: [
      "OTP;",
      "UPI PIN;",
      "Card PIN;",
      "Banking password;",
      "Account password;",
      "Other confidential authentication credentials.",
    ],
  },

  {
    number: "7",
    title: "IDENTITY VERIFICATION",
    paragraphs: [
      "Vavi may reasonably verify the identity of a person submitting a request where necessary to:",
    ],
    bullets: [
      "Protect account security;",
      "Prevent unauthorized account deletion;",
      "Protect personal data;",
      "Prevent fraudulent refunds;",
      "Verify transaction ownership;",
      "Prevent impersonation.",
    ],
    afterBullets:
      "Verification requirements will be proportionate to the nature of the request.",
  },

  {
    number: "8",
    title: "ACKNOWLEDGEMENT AND RESOLUTION TIMELINES",
    paragraphs: [
      "Vavi will endeavour to acknowledge formal eligible grievances promptly. Where the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended, apply to Vavi in relation to a grievance:",
    ],
    bullets: [
      "Eligible grievances will ordinarily be acknowledged within 24 hours;",
      "General grievances will ordinarily be resolved within 7 days of receipt;",
      "Certain eligible requests for removal or disabling access to prohibited information may be subject to an expedited 36-hour timeline;",
      "Specified complaints involving intimate, nudity, sexual-act, morphed, impersonation, or similar protected content may require action within 2 hours, where the applicable legal requirements are satisfied.",
    ],
    afterBullets:
      "Vavi may apply shorter timelines where required by applicable law. Current amended IT Rules reflect those 24-hour / 7-day, 36-hour and 2-hour timelines. For matters governed by another applicable law or regulatory framework, Vavi will handle the grievance within the applicable statutory period.",
  },

  {
    number: "9",
    title: "GENERAL SUPPORT REQUESTS",
    paragraphs: [
      "Ordinary customer-support enquiries that do not constitute formal legal grievances may be handled according to Vavi’s normal operational support process. Examples include:",
    ],
    bullets: [
      "How to use the App;",
      "Consultation availability;",
      "Profile questions;",
      "General service information;",
      "Basic transaction-status questions.",
    ],
    afterBullets:
      "Such support requests may not necessarily require formal Grievance Officer review.",
  },

  {
    number: "10",
    title: "PAYMENT AND REFUND COMPLAINTS",
    paragraphs: [
      "Payment-related complaints may concern:",
    ],
    bullets: [
      "Duplicate deductions;",
      "Payment failure;",
      "Failed recharge;",
      "Technical deduction;",
      "Refund not received;",
      "Incorrect Wallet balance.",
    ],
    afterBullets:
      "Refund eligibility will be determined in accordance with the Vavi Refund & Cancellation Policy. Where a refund is approved, the applicable refund-processing timeline stated in that Policy will apply. Bank, UPI, payment-gateway, card-network, or third-party processing time may be outside Vavi’s direct control after a valid refund has been initiated.",
  },

  {
    number: "11",
    title: "WALLET COMPLAINTS",
    paragraphs: [
      "Users may report:",
    ],
    bullets: [
      "Incorrect Wallet balance;",
      "Duplicate Wallet deduction;",
      "Recharge not credited;",
      "Technical Wallet error;",
      "Unauthorized Wallet activity.",
    ],
    afterBullets:
      "Vavi may review:",
    bullets2: [
      "Wallet ledger records;",
      "Transaction information;",
      "Consultation records;",
      "Payment-gateway information;",
      "Relevant technical logs.",
    ],
    afterBullets2:
      "Promotional or bonus Credits remain subject to their applicable terms and the Vavi Refund & Cancellation Policy.",
  },

  {
    number: "12",
    title: "ASTROLOGER PAYOUT AND COMMISSION GRIEVANCES",
    paragraphs: [
      "Astrologers may raise complaints regarding:",
    ],
    bullets: [
      "50% commission calculation;",
      "Earnings calculations;",
      "Refund adjustments;",
      "Chargebacks;",
      "Payout holds;",
      "Failed payouts;",
      "Tax deductions;",
      "Final settlement.",
    ],
    afterBullets:
      "Astrologers should provide the relevant consultation or payout reference. Payout disputes will be reviewed according to the Vavi Payout & Commission Policy, under which the standard revenue share is: Vavi: 50% Astrologer: 50% subject to applicable taxes and valid adjustments.",
  },

  {
    number: "13",
    title: "CONSULTATION COMPLAINTS",
    paragraphs: [
      "A User may report an Astrologer for:",
    ],
    bullets: [
      "Failure to provide a consultation;",
      "Harassment;",
      "Abuse;",
      "Fraud;",
      "Misrepresentation;",
      "Inappropriate conduct;",
      "Fear-based financial manipulation;",
      "Off-platform payment solicitation;",
      "Privacy violations;",
      "Serious policy violations.",
    ],
    afterBullets:
      "Vavi may review consultation-related records reasonably necessary to investigate the complaint.",
  },

  {
    number: "14",
    title: "ASTROLOGY RESULT COMPLAINTS",
    paragraphs: [
      "Astrology is interpretive in nature. A complaint will not automatically result in a refund or disciplinary action merely because a User:",
    ],
    bullets: [
      "Disagrees with a prediction;",
      "Does not receive the expected outcome;",
      "Dislikes an opinion;",
      "Finds a prediction inaccurate;",
      "Does not experience the expected effect of a remedy.",
    ],
    afterBullets:
      "However, complaints regarding fraud, misconduct, false guarantees, harassment, or other policy violations may be investigated separately.",
  },

  {
    number: "15",
    title: "CHAT AND CALL RECORDS",
    paragraphs: [
      "For legitimate complaint resolution, fraud prevention, quality review, security, and dispute resolution, Vavi may review relevant:",
    ],
    bullets: [
      "Chat records;",
      "Consultation records;",
      "Call logs;",
      "Call metadata;",
      "Consultation duration;",
      "Transaction records;",
      "Support records.",
    ],
    afterBullets:
      "Such processing will be subject to Vavi’s Privacy Policy and applicable law. Voice-call audio will not be represented as being recorded unless recording functionality is actually enabled and appropriate notice is provided.",
  },

  {
    number: "16",
    title: "PRIVACY GRIEVANCES",
    paragraphs: [
      "Privacy-related requests should ordinarily be directed to: privacy@theVavi.com",
      "Requests may relate to:",
    ],
    bullets: [
      "Access to personal data;",
      "Correction;",
      "Updating information;",
      "Data deletion;",
      "Account deletion;",
      "Withdrawal of consent;",
      "Unauthorized data use;",
      "Privacy concerns.",
    ],
    afterBullets:
      "Vavi may verify the identity of the requester before disclosing, modifying, or deleting personal information.",
  },

  {
    number: "17",
    title: "WITHDRAWAL OF CONSENT",
    paragraphs: [
      "Where processing is based on consent, Users or Astrologers may request withdrawal of consent through available App settings or by contacting: privacy@theVavi.com",
      "Withdrawal may affect access to services that reasonably require the relevant information. Certain information may continue to be processed or retained where required or permitted by applicable law.",
    ],
  },

  {
    number: "18",
    title: "URGENT SAFETY REPORTS",
    paragraphs: [
      "Reports involving immediate or serious safety risks should be clearly marked URGENT. These may include:",
    ],
    bullets: [
      "Credible threats of violence;",
      "Blackmail or extortion;",
      "Serious sexual harassment;",
      "Account compromise;",
      "Identity fraud;",
      "Serious financial fraud;",
      "Unauthorized disclosure of highly sensitive private content.",
    ],
    afterBullets:
      "Vavi may prioritize urgent safety cases and take temporary protective action while investigating.",
  },

  {
    number: "19",
    title: "INTIMATE OR IMPERSONATION CONTENT",
    paragraphs: [
      "Where a complaint concerns content that may trigger special expedited obligations under applicable law, Vavi may prioritize removal or restriction. This may include qualifying content involving:",
    ],
    bullets: [
      "Private or intimate areas;",
      "Nudity;",
      "Sexual acts;",
      "Morphed intimate content;",
      "Electronic impersonation involving protected content.",
    ],
    afterBullets:
      "Where the amended IT Rules apply, specified complaints in this category may require action within 2 hours.",
  },

  {
    number: "20",
    title: "FRAUD AND SECURITY REPORTS",
    paragraphs: [
      "Users and Astrologers should promptly report suspected:",
    ],
    bullets: [
      "Account takeover;",
      "Fake account;",
      "Fake Astrologer;",
      "Unauthorized payment;",
      "Payment manipulation;",
      "Fake consultation;",
      "Wallet manipulation;",
      "Suspicious login activity;",
      "Off-platform payment request.",
    ],
    afterBullets:
      "Vavi may temporarily restrict an account or transaction while a serious security issue is investigated.",
  },

  {
    number: "21",
    title: "EVIDENCE AND INVESTIGATION",
    paragraphs: [
      "Vavi may consider reasonably available evidence including:",
    ],
    bullets: [
      "Account records;",
      "Chat communications;",
      "Consultation records;",
      "Transaction data;",
      "Wallet ledger entries;",
      "Call metadata;",
      "Technical logs;",
      "Screenshots;",
      "Support correspondence;",
      "Responses provided by the parties.",
    ],
    afterBullets:
      "A complaint alone does not automatically establish that a violation occurred.",
  },

  {
    number: "22",
    title: "FAIR REVIEW",
    paragraphs: [
      "Where reasonably practicable, Vavi may obtain information from the person complained against before making a serious enforcement decision. However, immediate temporary action may be taken without prior notice where reasonably necessary for:",
    ],
    bullets: [
      "User safety;",
      "Fraud prevention;",
      "Security;",
      "Legal compliance;",
      "Prevention of serious harm.",
    ],
  },

  {
    number: "23",
    title: "POSSIBLE OUTCOMES",
    paragraphs: [
      "Depending on the circumstances, Vavi may:",
    ],
    bullets: [
      "Provide information or clarification;",
      "Correct an account issue;",
      "Correct a transaction;",
      "Process an eligible refund;",
      "Restore an eligible Wallet amount;",
      "Correct an Astrologer payout;",
      "Issue a warning;",
      "Remove content;",
      "Restrict a feature;",
      "Suspend an account;",
      "Terminate an account;",
      "Take no action where no violation is established;",
      "Take another lawful and proportionate action.",
    ],
  },

  {
    number: "24",
    title: "APPEAL OR REVIEW",
    paragraphs: [
      "If a User or Astrologer believes a grievance was incorrectly resolved, they may request an internal review by replying to the grievance decision or contacting: legal@theVavi.com",
      "The request should include:",
    ],
    bullets: [
      "Original complaint reference;",
      "Reason for disagreement;",
      "Any additional relevant evidence.",
    ],
    afterBullets:
      "Where an external statutory appeal mechanism applies, the complainant may exercise the rights available under applicable law.",
  },

  {
    number: "25",
    title: "FALSE OR MALICIOUS COMPLAINTS",
    paragraphs: [
      "Vavi encourages genuine complaints and good-faith reporting. Users and Astrologers must not knowingly submit:",
    ],
    bullets: [
      "Fabricated evidence;",
      "False payment claims;",
      "Manipulated screenshots;",
      "Fraudulent allegations;",
      "Malicious complaints intended solely to harass another person.",
    ],
    afterBullets:
      "A complaint will not be treated as malicious merely because Vavi ultimately does not uphold it.",
  },

  {
    number: "26",
    title: "REPEATED OR ABUSIVE CONTACT",
    paragraphs: [
      "Vavi may reasonably manage communications involving:",
    ],
    bullets: [
      "Repeated identical complaints already resolved;",
      "Spam;",
      "Threats against support personnel;",
      "Abusive communications;",
      "Automated or malicious submissions.",
    ],
    afterBullets:
      "This provision does not restrict legitimate statutory complaints or lawful remedies.",
  },

  {
    number: "27",
    title: "CONFIDENTIALITY",
    paragraphs: [
      "Vavi will handle grievance information with reasonable confidentiality. Information may be shared internally or with authorized service providers where reasonably necessary for:",
    ],
    bullets: [
      "Investigation;",
      "Resolution;",
      "Fraud prevention;",
      "Security;",
      "Legal compliance.",
    ],
    afterBullets:
      "Information may also be disclosed where required by law, court order, or lawful government request.",
  },

  {
    number: "28",
    title: "RECORD RETENTION",
    paragraphs: [
      "Vavi may retain complaint and grievance records where reasonably necessary for:",
    ],
    bullets: [
      "Dispute resolution;",
      "Fraud prevention;",
      "Legal compliance;",
      "Audit;",
      "Security;",
      "Establishment or defence of legal claims;",
      "Improving Platform safety.",
    ],
    afterBullets:
      "Retention will be governed by the Vavi Privacy Policy and applicable law.",
  },

  {
    number: "29",
    title: "THIRD-PARTY PAYMENT OR APP-STORE ISSUES",
    paragraphs: [
      "Certain transactions may be processed through:",
    ],
    bullets: [
      "Google Play;",
      "Apple App Store;",
      "Banks;",
      "UPI providers;",
      "Payment gateways;",
      "Other third-party providers.",
    ],
    afterBullets:
      "Where a matter falls solely within a third party’s billing or refund system, Vavi may direct the User to the relevant provider. Vavi will provide reasonable assistance with Vavi-controlled information where appropriate.",
  },

  {
    number: "30",
    title: "EMERGENCY SERVICES",
    paragraphs: [
      "Vavi customer support and grievance channels are not emergency services. Where there is an immediate risk to life, physical safety, or a medical emergency, Users should contact the appropriate emergency or qualified professional service. Astrology consultations should not be relied upon as emergency assistance.",
    ],
  },

  {
    number: "31",
    title: "LEGAL NOTICES",
    paragraphs: [
      "Formal legal notices intended for Ascendant Vavi LLP should be directed to: legal@theVavi.com and, where legally required, to:",
      "Ascendant Vavi LLP",
      "S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad, U.P.",
      "Sending an ordinary customer-support message does not automatically constitute formal legal service where applicable law requires another method.",
    ],
  },

  {
    number: "32",
    title: "CHANGES TO THIS POLICY",
    paragraphs: [
      "Vavi may update this Policy from time to time to reflect:",
    ],
    bullets: [
      "Changes in law;",
      "Platform changes;",
      "New complaint mechanisms;",
      "Security requirements;",
      "Regulatory requirements;",
      "Operational improvements.",
    ],
    afterBullets:
      "Material changes may be communicated through:",
    bullets2: [
      "App notification;",
      "Website notice;",
      "Email;",
      "Other reasonable means.",
    ],
    afterBullets2:
      "The latest version will state its effective date.",
  },

  {
    number: "33",
    title: "RELATIONSHIP WITH OTHER VAVI POLICIES",
    paragraphs: [
      "This Policy should be read together with:",
    ],
    bullets: [
      "Terms and Conditions;",
      "Privacy Policy;",
      "Refund & Cancellation Policy;",
      "EULA;",
      "Astrologer / Partner Agreement;",
      "Payout & Commission Policy;",
      "Community Guidelines / Acceptable Use Policy.",
    ],
    afterBullets:
      "Specific refund, privacy, payout, or account rules contained in the relevant policy will continue to govern those matters. Mandatory provisions of applicable law will prevail over conflicting policy provisions.",
  },
];

/* =========================================================
   COMPONENTS
========================================================= */

const BulletList = ({ items }) => {
  if (!items?.length) return null;

  return (
    <View style={styles.bulletContainer}>
      {items.map((item, index) => (
        <View
          key={`${item}-${index}`}
          style={styles.bulletRow}
        >
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.bulletText}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
};

const InfoRows = ({ items }) => {
  if (!items?.length) return null;

  return (
    <View style={styles.infoContainer}>
      {items.map(([label, value], index) => (
        <View
          key={`${label}-${index}`}
          style={styles.infoRow}
        >
          <Text style={styles.infoLabel}>
            {label}
          </Text>

          <Text style={styles.infoValue}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const PolicySection = ({ section }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        {section.number}. {section.title}
      </Text>

      {/* Paragraphs */}

      {section.paragraphs?.map((paragraph, index) => (
        <Text
          key={`p-${index}`}
          style={styles.sectionContent}
        >
          {paragraph}
        </Text>
      ))}

      {/* Main bullets */}

      <BulletList items={section.bullets} />

      {/* Sub sections */}

      {section.subSections?.map((sub, index) => (
        <View
          key={`${sub.title}-${index}`}
          style={styles.subSection}
        >
          <Text style={styles.subTitle}>
            {sub.title}
          </Text>

          {sub.paragraphs?.map((paragraph, pIndex) => (
            <Text
              key={`sub-p-${pIndex}`}
              style={styles.sectionContent}
            >
              {paragraph}
            </Text>
          ))}

          <BulletList items={sub.bullets} />
        </View>
      ))}

      {/* Info rows */}

      <InfoRows items={section.info} />

      {/* Additional paragraph */}

      {section.afterBullets ? (
        <Text style={styles.sectionContent}>
          {section.afterBullets}
        </Text>
      ) : null}

      {/* Second bullets */}

      <BulletList items={section.bullets2} />

      {/* Second paragraph */}

      {section.afterBullets2 ? (
        <Text style={styles.sectionContent}>
          {section.afterBullets2}
        </Text>
      ) : null}

      {/* Additional paragraphs */}

      {section.paragraphs2?.map((paragraph, index) => (
        <Text
          key={`p2-${index}`}
          style={styles.sectionContent}
        >
          {paragraph}
        </Text>
      ))}

      <BulletList items={section.bullets2} />
    </View>
  );
};

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function Contact_policy() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =========================================
            HEADER
        ========================================== */}

        <View style={styles.headerContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Support & Grievance Policy
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            Grievance Redressal & Contact Policy
          </Text>

          <Text style={styles.subtitle}>
            A clear mechanism for Users, Astrologers, and other
            eligible persons to raise complaints, report
            Platform issues, and seek resolution.
          </Text>
        </View>

        {/* =========================================
            ABOUT THIS POLICY
        ========================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            About This Policy
          </Text>

          <Text style={styles.sectionContent}>
            This Grievance Redressal & Contact Policy
            (“Policy”) explains how Users, Astrologers, and
            other persons may contact Vavi, submit complaints
            or grievances, report Platform issues, and seek
            resolution of matters relating to the Vavi
            Platform.
          </Text>

          <Text style={styles.sectionContent}>
            Vavi is operated by: Ascendant Vavi LLP
          </Text>

          <Text style={styles.sectionContent}>
            Brand: Vavi
          </Text>

          <Text style={styles.sectionContent}>
            Website: theVavi.com
          </Text>

          <Text style={styles.sectionContent}>
            Registered Office: S1 - SF-232, CLOUD-9,
            Vaishali, Ghaziabad, U.P.
          </Text>

          <Text style={styles.sectionContent}>
            This Policy should be read together with the Vavi
            Terms and Conditions, Privacy Policy, Refund &
            Cancellation Policy, EULA, Astrologer / Partner
            Agreement, Payout & Commission Policy, and
            Community Guidelines / Acceptable Use Policy.
          </Text>
        </View>

        {/* =========================================
            IMPORTANT
        ========================================== */}

        <View style={styles.importantCard}>
          <Text style={styles.importantTitle}>
            Important
          </Text>

          <Text style={styles.importantText}>
            For urgent safety matters, clearly mark the
            complaint as URGENT. Do not share OTPs, UPI PINs,
            card PINs, passwords, or other confidential
            authentication credentials in a complaint.
          </Text>
        </View>

        {/* =========================================
            POLICY SECTIONS 1 - 33
        ========================================== */}

        {sections.map((section) => (
          <PolicySection
            key={section.number}
            section={section}
          />
        ))}

        {/* =========================================
            CONTACT VAVI
        ========================================== */}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>
            Contact Vavi
          </Text>

          <Text style={styles.contactDescription}>
            For support, privacy requests, or formal
            grievances, use the appropriate contact channel
            below.
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
                General Support
              </Text>

              <Text style={styles.contactValue}>
                info@theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Formal Grievances / Legal
              </Text>

              <Text style={styles.contactValue}>
                legal@theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Website
              </Text>

              <Text style={styles.contactValue}>
                theVavi.com
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
                Privacy & Personal Data
              </Text>

              <Text style={styles.contactValue}>
                privacy@theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Grievance Officer
              </Text>

              <Text style={styles.contactValue}>
                Sunil Barleja
              </Text>
            </View>
          </View>

          {/* REGISTERED OFFICE */}

          <Text style={styles.contactLabel}>
            Registered Office
          </Text>

          <Text style={styles.contactValue}>
            S1 - SF-232, CLOUD-9, Vaishali, Ghaziabad, U.P.
          </Text>

          {/* DIVIDER */}

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            © 2026 Ascendant Vavi LLP. All Rights Reserved.
          </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },

  /* =========================================
      HEADER
  ========================================== */

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
    lineHeight: RF(38),
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

  /* =========================================
      WHITE CONTENT CARD
  ========================================== */

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(2.7),

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

  /* =========================================
      SECTION TITLE
  ========================================== */

  sectionTitle: {
    fontSize: RF(20),
    lineHeight: RF(28),
    fontWeight: "700",
    color: "#24140E",
    marginBottom: hp(1.5),
  },

  sectionContent: {
    fontSize: RF(14),
    lineHeight: RF(24),
    fontWeight: "400",
    color: "#405579",
    marginBottom: hp(1.2),
  },

  /* =========================================
      SUB SECTION
  ========================================== */

  subSection: {
    marginTop: hp(0.8),
    marginBottom: hp(1.3),
  },

  subTitle: {
    fontSize: RF(15.5),
    lineHeight: RF(23),
    fontWeight: "700",
    color: "#3A2117",
    marginBottom: hp(0.8),
  },

  /* =========================================
      BULLETS
  ========================================== */

  bulletContainer: {
    marginTop: hp(0.2),
    marginBottom: hp(1.1),
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.8),
    paddingRight: wp(1),
  },

  bullet: {
    width: wp(4),
    fontSize: RF(15),
    lineHeight: RF(23),
    color: "#405579",
    fontWeight: "700",
  },

  bulletText: {
    flex: 1,
    fontSize: RF(14),
    lineHeight: RF(23),
    color: "#405579",
    fontWeight: "400",
  },

  /* =========================================
      INFO ROWS
  ========================================== */

  infoContainer: {
    marginTop: hp(0.5),
    marginBottom: hp(1.2),
  },

  infoRow: {
    marginBottom: hp(1.1),
  },

  infoLabel: {
    fontSize: RF(12.5),
    lineHeight: RF(19),
    color: "#8A7971",
    fontWeight: "500",
    marginBottom: hp(0.3),
  },

  infoValue: {
    fontSize: RF(14),
    lineHeight: RF(21),
    color: "#405579",
    fontWeight: "600",
  },

  /* =========================================
      IMPORTANT CARD
  ========================================== */

  importantCard: {
    backgroundColor: "#FF5A00",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(3),

    marginBottom: hp(3),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },

  importantTitle: {
    color: "#FFFFFF",
    fontSize: RF(23),
    lineHeight: RF(30),
    fontWeight: "800",
    marginBottom: hp(1.2),
  },

  importantText: {
    color: "#FFFFFF",
    fontSize: RF(14),
    lineHeight: RF(23),
    fontWeight: "500",
  },

  /* =========================================
      CONTACT CARD
  ========================================== */

  contactCard: {
    backgroundColor: "#3A2117",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),
    paddingVertical: hp(3),

    marginTop: hp(1),

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
    color: "#FFFFFF",
    fontSize: RF(26),
    lineHeight: RF(34),
    fontWeight: "800",
    marginBottom: hp(1),
  },

  contactDescription: {
    color: "#E8D9D1",
    fontSize: RF(14),
    lineHeight: RF(22),
    marginBottom: hp(2.8),
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
    color: "#B9AAA2",
    fontSize: RF(13),
    lineHeight: RF(20),
    marginBottom: hp(0.5),
  },

  contactValue: {
    color: "#FFFFFF",
    fontSize: RF(14),
    lineHeight: RF(21),
    fontWeight: "700",
    marginBottom: hp(2.3),
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: hp(1),
    marginBottom: hp(2),
  },

  footerText: {
    color: "#B9AAA2",
    fontSize: RF(13),
    lineHeight: RF(20),
  },

  bottomSpace: {
    height: hp(3),
  },
});