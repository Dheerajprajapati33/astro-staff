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

const sections = [
  {
    number: "1",
    title: "License Grant",
    paragraphs: [
      "Subject to your compliance with this EULA and the applicable Vavi Terms and Conditions, Ascendant Vavi LLP grants you a limited, personal, revocable, non-exclusive, non-transferable, non-sublicensable license to:",
    ],
    bullets: [
      "Download the Vavi application;",
      "Install the Vavi application on a compatible device;",
      "Access and use the Platform;",
      "Use the features made available to your account.",
    ],
    afterBullets:
      "The license is provided solely for lawful use of Vavi. You do not acquire ownership of:",
    bullets2: [
      "The Vavi application;",
      "Source code;",
      "Software;",
      "Algorithms;",
      "Databases;",
      "Designs;",
      "Trademarks;",
      "Logos;",
      "Content owned by Vavi;",
      "Other intellectual property belonging to Ascendant Vavi LLP.",
    ],
  },

  {
    number: "2",
    title: "User App and Astrologer App",
    paragraphs: [
      "Vavi may provide different applications or interfaces for different categories of users. These may include: Vavi User Application Designed primarily for persons seeking astrology-related consultations and services. Vavi Astrologer Application Designed primarily for Astrologers and service providers providing astrology-related consultations through the Platform. Different features, permissions, dashboards, payment functionality, communication functionality, and account controls may be made available depending on the type of account. Your access to a particular feature does not create any ownership right in that feature or technology.",
    ],
  },

  {
    number: "3",
    title: "License Restrictions",
    paragraphs: [
      "You may not, directly or indirectly:",
    ],
    bullets: [
      "Copy the application except as permitted by applicable law;",
      "Modify the application;",
      "Reverse engineer the application;",
      "Decompile the application;",
      "Disassemble the application;",
      "Attempt to extract source code;",
      "Create derivative works;",
      "Sell the application;",
      "Rent or lease the application;",
      "Sublicense the application;",
      "Transfer your license;",
      "Circumvent security mechanisms;",
      "Interfere with Platform infrastructure;",
      "Attempt unauthorized access;",
      "Introduce malicious code;",
      "Use automated bots without authorization;",
      "Scrape Platform data without permission;",
      "Replicate Vavi's functionality without authorization;",
      "Use Vavi to develop a competing service through unauthorized means.",
    ],
  },

  {
    number: "4",
    title: "Platform Role",
    paragraphs: [
      "Vavi is primarily a technology-enabled intermediary platform that facilitates interaction between Users and independent Astrologers. Vavi may provide:",
    ],
    bullets: [
      "Profiles;",
      "Search and discovery;",
      "Chat;",
      "Voice consultations;",
      "Consultation requests;",
      "Payments;",
      "Commission processing;",
      "Astrologer payouts;",
      "Reviews;",
      "Notifications;",
      "Customer support.",
    ],
    afterBullets:
      "Vavi does not generally provide astrology consultations itself. Astrologers may operate as independent service providers.",
  },

  {
    number: "5",
    title: "Astrology Disclaimer",
    paragraphs: [
      "Astrology-related consultations, predictions, opinions, interpretations, remedies, and guidance are provided by independent Astrologers. Vavi does not guarantee:",
    ],
    bullets: [
      "Accuracy of predictions;",
      "Future events;",
      "Marriage outcomes;",
      "Relationship outcomes;",
      "Career outcomes;",
      "Business outcomes;",
      "Financial outcomes;",
      "Personal outcomes;",
      "Effectiveness of remedies;",
      "Any specific result.",
    ],
    afterBullets:
      "Users are responsible for decisions made based on astrology-related content.",
  },

  {
    number: "6",
    title: "No Professional Advice",
    paragraphs: [
      "Information provided through Vavi must not be treated as a substitute for professional:",
    ],
    bullets: [
      "Medical advice;",
      "Mental-health advice;",
      "Legal advice;",
      "Financial advice;",
      "Investment advice;",
      "Emergency services;",
      "Other regulated professional services.",
    ],
    afterBullets:
      "Users should consult an appropriately qualified professional whenever necessary.",
  },

  {
    number: "7",
    title: "Communication Features",
    paragraphs: [
      "Vavi may provide communication functionality including:",
    ],
    bullets: [
      "Text chat;",
      "Voice consultation;",
      "Consultation-related messaging;",
      "Notifications.",
    ],
    afterBullets:
      "Vavi does not currently provide video consultation functionality, unless such functionality is expressly introduced in a future version of the Platform. Communication functionality may depend upon:",
    bullets2: [
      "Internet connectivity;",
      "Device compatibility;",
      "Network availability;",
      "Third-party infrastructure.",
    ],
    afterBullets2:
      "Vavi does not guarantee uninterrupted communication.",
  },

  {
    number: "8",
    title: "Voice Calls",
    paragraphs: [
      "Where voice consultation functionality is available, Vavi may process technical information required to establish and operate calls. Unless expressly disclosed to you, Vavi does not represent that voice calls are recorded. If recording functionality is introduced in the future, applicable notices and consents will be provided where required by law.",
    ],
  },

  {
    number: "8A",
    title: "Platform Monitoring, Chat and Call Audit",
    paragraphs: [
      "To maintain Platform quality and safety, prevent fraud, investigate misuse, enforce Platform policies, and resolve complaints, payment disputes, or consultation-related disputes, Vavi may monitor, review, or audit communications and activity conducted through the Platform. Such monitoring may include, where applicable:",
    ],
    bullets: [
      "Chat communications;",
      "Consultation records;",
      "Call logs and call metadata;",
      "Call duration and timestamps;",
      "Transaction-related information;",
      "Customer-support communications;",
      "Security and fraud-related activity.",
    ],
    afterBullets:
      "By using the Platform, Users and Astrologers acknowledge that such monitoring and auditing may take place for the purposes described above, subject to Vavi’s Privacy Policy and applicable law. Voice-call audio will not be represented as being recorded unless audio-recording functionality is actually enabled. Where audio recording is introduced or used, Vavi will provide appropriate notice and obtain consent where required by applicable law. Information obtained through monitoring or auditing will only be accessed or used for legitimate Platform, security, quality, dispute-resolution, fraud-prevention, or legal-compliance purposes.",
  },

  {
    number: "9",
    title: "User Content",
    paragraphs: [
      "You may submit:",
    ],
    bullets: [
      "Questions;",
      "Profile information;",
      "Photographs;",
      "Reviews;",
      "Messages;",
      "Consultation-related information;",
      "Feedback;",
      "Other content.",
    ],
    afterBullets:
      "You represent that:",
    bullets2: [
      "You have the right to provide such content;",
      "The content is not knowingly unlawful;",
      "The content does not knowingly infringe third-party rights;",
      "The content does not contain malicious software;",
      "You will not intentionally submit fraudulent information.",
    ],
    afterBullets2:
      "You grant Vavi a limited, non-exclusive right to process submitted content as reasonably necessary to:",
    bullets3: [
      "Operate the Platform;",
      "Provide services;",
      "Display content to intended recipients;",
      "Maintain security;",
      "Investigate abuse;",
      "Improve Platform functionality;",
      "Comply with applicable law.",
    ],
  },

  {
    number: "10",
    title: "Astrologer Content",
    paragraphs: [
      "Astrologers may submit:",
    ],
    bullets: [
      "Profile information;",
      "Profile photographs;",
      "Qualifications;",
      "Experience;",
      "Astrology specializations;",
      "Consultation descriptions;",
      "Reviews and other professional information.",
    ],
    afterBullets:
      "Astrologers represent that such information is accurate to the best of their knowledge and does not intentionally misrepresent their identity or qualifications. Vavi may review, modify, restrict, or remove content that violates applicable policies.",
  },

  {
    number: "11",
    title: "Astrologer Independent Status",
    paragraphs: [
      "Using the Vavi Astrologer Application does not, by itself, create an employment, partnership, joint-venture, or agency relationship between an Astrologer and Ascendant Vavi LLP. Unless separately agreed in writing, Astrologers operate as independent service providers. Astrologers remain responsible for their own:",
    ],
    bullets: [
      "Professional conduct;",
      "Tax obligations;",
      "Statutory obligations;",
      "Qualifications;",
      "Representations;",
      "Consultations;",
      "Advice and opinions.",
    ],
  },

  {
    number: "12",
    title: "Payments",
    paragraphs: [
      "Certain Platform services may require payment. Payments may include:",
    ],
    bullets: [
      "Consultation charges;",
      "Platform fees;",
      "Service charges;",
      "Convenience fees;",
      "Payment-processing charges;",
      "Applicable taxes;",
      "Other disclosed charges.",
    ],
    afterBullets:
      "Payments may be processed through authorized third-party payment processors.",
  },

  {
    number: "12A",
    title: "Vavi Wallet and Platform Credits",
    paragraphs: [
      "Vavi may provide Users with wallet balances, recharge balances, promotional credits, bonus credits, cashback credits, refund credits, or other Platform credits (“Wallet Credits”) for use on eligible services available through Vavi. Wallet Credits are intended solely for permitted transactions within the Vavi Platform. Except where otherwise required by applicable law or expressly permitted under the Vavi Refund & Cancellation Policy:",
    ],
    bullets: [
      "Wallet Credits are non-transferable;",
      "Wallet Credits cannot be transferred to another User or Astrologer;",
      "Wallet Credits cannot be withdrawn or transferred to a bank account, UPI account, card, or other external payment method;",
      "Wallet Credits are non-refundable and cannot be redeemed for cash;",
      "Promotional, bonus, complimentary, or cashback credits have no cash value.",
    ],
    afterBullets:
      "Any unused promotional, bonus, cashback, or complimentary credits will expire upon closure or deletion of the User’s account. Where an account is suspended or closed due to suspected fraud, chargebacks, payment manipulation, misuse, or violation of Platform policies, Vavi may temporarily restrict or freeze Wallet Credits while the matter is investigated. Any treatment of paid Wallet balances following account closure, suspension, or termination will remain subject to applicable law and the Vavi Refund & Cancellation Policy.",
  },

  {
    number: "13",
    title: "Vavi Commission",
    paragraphs: [
      "Vavi may charge or retain commission or other Platform fees from transactions conducted through the Platform. For Astrologers, applicable deductions may include:",
    ],
    bullets: [
      "Vavi commission;",
      "Platform fees;",
      "Payment-processing charges;",
      "Applicable taxes;",
      "Refund adjustments;",
      "Chargebacks;",
      "Other disclosed or legally required deductions.",
    ],
    afterBullets:
      "The applicable commission structure may be communicated through the application, dashboard, Astrologer agreement, email, or other official communication.",
  },

  {
    number: "14",
    title: "Astrologer Payouts",
    paragraphs: [
      "Eligible Astrologer earnings may be processed through the Vavi Platform's payout system. Vavi may require:",
    ],
    bullets: [
      "Bank details;",
      "PAN;",
      "Tax information;",
      "Identity verification;",
      "Other legally required information.",
    ],
    afterBullets:
      "Payouts may be delayed where reasonably necessary because of:",
    bullets2: [
      "Verification;",
      "Refunds;",
      "Chargebacks;",
      "Fraud investigation;",
      "Payment disputes;",
      "Security concerns;",
      "Legal requirements.",
    ],
  },

  {
    number: "15",
    title: "Off-Platform Transactions",
    paragraphs: [
      "Astrologers must not intentionally circumvent Vavi's Platform by moving Vavi-originated consultations to unauthorized external payment arrangements. This includes attempts to:",
    ],
    bullets: [
      "Request direct payments;",
      "Provide personal UPI details;",
      "Provide external payment links;",
      "Redirect Users to external paid services;",
      "Avoid Vavi commission.",
    ],
    afterBullets:
      "Vavi may take appropriate action against accounts involved in unauthorized circumvention.",
  },

  {
    number: "16",
    title: "Account Security",
    paragraphs: [
      "You are responsible for maintaining the confidentiality and security of your:",
    ],
    bullets: [
      "Login credentials;",
      "Passwords;",
      "OTPs;",
      "Authentication information;",
      "Device access.",
    ],
    afterBullets:
      "You must notify Vavi promptly if you suspect:",
    bullets2: [
      "Unauthorized access;",
      "Account takeover;",
      "Credential compromise;",
      "Suspicious activity.",
    ],
    afterBullets2:
      "Vavi may temporarily restrict an account to protect the Platform or its users.",
  },

  {
    number: "17",
    title: "Prohibited Use",
    paragraphs: [
      "You must not use Vavi to:",
    ],
    bullets: [
      "Commit fraud;",
      "Harass another person;",
      "Threaten another person;",
      "Blackmail another person;",
      "Extort money;",
      "Impersonate another person;",
      "Create fake accounts;",
      "Manipulate payments;",
      "Manipulate consultations;",
      "Manipulate ratings;",
      "Circumvent Platform security;",
      "Access another person's account;",
      "Upload malware;",
      "Infringe intellectual property;",
      "Distribute unlawful content;",
      "Conduct illegal activities;",
      "Attempt to exploit Platform vulnerabilities;",
      "Collect personal information without authorization.",
    ],
  },

  {
    number: "18",
    title: "Intellectual Property",
    paragraphs: [
      "All intellectual property associated with Vavi, including:",
    ],
    bullets: [
      "Application software;",
      "Source code;",
      "Object code;",
      "Website;",
      "Designs;",
      "Graphics;",
      "Logos;",
      "Trademarks;",
      "Branding;",
      "Databases;",
      "User interfaces;",
      "Platform architecture;",
      "Documentation;",
    ],
    afterBullets:
      "is owned by, controlled by, or licensed to Ascendant Vavi LLP. Except for the limited license expressly granted by this EULA, no intellectual-property rights are transferred to you.",
  },

  {
    number: "19",
    title: "Trademarks",
    paragraphs: [
      "“Vavi”, the Vavi logo, branding, names, graphics, and related marks may constitute trademarks or other proprietary assets of Ascendant Vavi LLP. You may not use them without prior written authorization.",
    ],
  },

  {
    number: "20",
    title: "Platform Modifications",
    paragraphs: [
      "Vavi may:",
    ],
    bullets: [
      "Add features;",
      "Remove features;",
      "Modify functionality;",
      "Update software;",
      "Change interfaces;",
      "Introduce new services;",
      "Discontinue features;",
      "Modify Platform infrastructure.",
    ],
    afterBullets:
      "Such changes may occur for:",
    bullets2: [
      "Security;",
      "Technical reasons;",
      "Business requirements;",
      "Legal compliance;",
      "Product improvement.",
    ],
    afterBullets2:
      "No particular feature is guaranteed to remain available indefinitely.",
  },

  {
    number: "21",
    title: "Updates",
    paragraphs: [
      "Vavi may require application updates for:",
    ],
    bullets: [
      "Security;",
      "Compatibility;",
      "Bug fixes;",
      "New features;",
      "Regulatory requirements;",
      "Performance improvements.",
    ],
    afterBullets:
      "Failure to install required updates may affect Platform functionality.",
  },

  {
    number: "22",
    title: "Third-Party Services",
    paragraphs: [
      "Vavi may depend upon third-party services including:",
    ],
    bullets: [
      "Payment gateways;",
      "Cloud hosting;",
      "Authentication providers;",
      "Voice communication providers;",
      "Analytics services;",
      "Notification providers;",
      "Security services;",
      "Other infrastructure providers.",
    ],
    afterBullets:
      "Vavi is not responsible for independent failures of third-party services beyond its reasonable control, subject to applicable law.",
  },

  {
    number: "22A",
    title: "Google Play Store and Apple App Store Terms",
    paragraphs: [
      "Where the Vavi application is downloaded, installed, purchased, or accessed through the Google Play Store or Apple App Store, the User’s use of the relevant app store may also be governed by the applicable terms, policies, usage rules, and billing requirements of Google or Apple. This EULA operates alongside such applicable app-store terms. To the extent that a mandatory Google Play Store or Apple App Store term conflicts with this EULA specifically in relation to application download, installation, distribution, store-provided billing mechanisms, or other services provided directly by the applicable app store, the mandatory app-store requirement will prevail only to the extent of that conflict. All other matters relating to the Vavi Platform, Vavi services, astrology consultations, User conduct, Astrologer conduct, Wallet Credits, Platform policies, and Vavi’s relationship with the User will continue to be governed by this EULA, the Vavi Terms and Conditions, Privacy Policy, Refund & Cancellation Policy, and applicable law. Google and Apple are not responsible for providing astrology consultations or other services independently provided by Vavi or Astrologers, except to the extent of their respective obligations under their own applicable terms.",
    ],
  },

  {
    number: "23",
    title: "Disclaimer of Warranties",
    paragraphs: [
      "To the maximum extent permitted by applicable law, Vavi is provided on an: “AS IS” and “AS AVAILABLE” basis. Vavi does not guarantee that:",
    ],
    bullets: [
      "The Platform will always be available;",
      "The Platform will always be error-free;",
      "All features will operate continuously;",
      "Every Astrologer will be available;",
      "Every consultation will meet a particular expectation;",
      "Astrology predictions will be accurate;",
      "A consultation will produce a particular outcome.",
    ],
    afterBullets:
      "Nothing in this EULA excludes any warranty or legal right that cannot lawfully be excluded.",
  },

  {
    number: "24",
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, Ascendant Vavi LLP shall not be liable for indirect, incidental, special, consequential, exemplary, punitive, or speculative losses arising from use of the Platform. This may include losses relating to:",
    ],
    bullets: [
      "Business opportunities;",
      "Expected profits;",
      "Personal decisions;",
      "Astrology predictions;",
      "Astrologer conduct;",
      "Third-party services;",
      "Temporary Platform unavailability.",
    ],
    afterBullets:
      "Nothing in this EULA excludes liability that cannot legally be excluded.",
  },

  {
    number: "25",
    title: "Indemnification",
    paragraphs: [
      "To the maximum extent permitted by applicable law, you agree to indemnify and hold harmless Ascendant Vavi LLP, its partners, employees, officers, contractors, and service providers against claims, losses, liabilities, damages, and reasonable legal expenses arising from:",
    ],
    bullets: [
      "Your violation of this EULA;",
      "Fraudulent conduct;",
      "Illegal activity;",
      "Misuse of Vavi;",
      "Violation of third-party rights;",
      "Intellectual-property infringement;",
      "Unauthorized use of the Platform;",
      "Misuse of another person's information.",
    ],
  },

  {
    number: "26",
    title: "Suspension",
    paragraphs: [
      "Vavi may suspend, restrict, investigate, or temporarily disable access where we reasonably believe that you:",
    ],
    bullets: [
      "Violated this EULA;",
      "Violated the Terms and Conditions;",
      "Engaged in fraud;",
      "Engaged in abuse or harassment;",
      "Created a security risk;",
      "Attempted unauthorized access;",
      "Manipulated payments;",
      "Attempted commission circumvention;",
      "Engaged in illegal activity;",
      "Submitted knowingly false information.",
    ],
  },

  {
    number: "27",
    title: "Termination",
    paragraphs: [
      "Vavi may terminate your license to use the application where permitted by applicable law. Upon termination:",
    ],
    bullets: [
      "Your right to use the application may immediately cease;",
      "You must stop unauthorized use of Vavi;",
      "Certain information may be retained where required or permitted by law;",
      "Outstanding legitimate financial obligations may survive termination.",
    ],
    afterBullets:
      "Termination does not automatically eliminate rights or obligations that by their nature should survive termination.",
  },

  {
    number: "28",
    title: "Data and Privacy",
    paragraphs: [
      "Your use of Vavi is also governed by the Vavi Privacy Policy. The Privacy Policy explains how Vavi collects, processes, stores, and protects personal information. The Privacy Policy is available at: theVavi.com/privacy-policy",
    ],
  },

  {
    number: "28A",
    title: "Account Deletion and Data Retention",
    paragraphs: [
      "Users may request deletion of their Vavi account through the account-deletion functionality provided within the application, such as: Profile / Settings → Delete Account Where the in-app deletion option is unavailable or cannot be accessed, a User may submit an account-deletion request to: privacy@theVavi.com Before completing deletion, Vavi may reasonably verify the identity of the person making the request to prevent unauthorized deletion of an account. Following a valid account-deletion request, the User’s account will be disabled or closed and personal information that is no longer required for a specified or lawful purpose will be deleted or anonymized from Vavi’s active systems, ordinarily within 30 days. Depending upon the information held, this may include:",
    ],
    bullets: [
      "Name;",
      "Mobile number;",
      "Email address;",
      "Profile information;",
      "Birth details;",
      "Profile photographs;",
      "Consultation-related personal information;",
      "Chat history or other communications that are no longer required.",
    ],
    afterBullets:
      "Certain information may be retained for a longer period where retention is reasonably necessary or required for:",
    bullets2: [
      "Compliance with applicable law;",
      "Tax, accounting, or financial-record requirements;",
      "Payment and transaction records;",
      "Prevention or investigation of fraud;",
      "Chargebacks or payment disputes;",
      "User or Astrologer complaints;",
      "Security investigations;",
      "Establishment, exercise, or defence of legal claims;",
      "Other lawful purposes.",
    ],
    afterBullets2:
      "Where only part of a record must be retained, Vavi may delete, anonymize, restrict, or otherwise limit personal information that is no longer necessary. Account deletion does not automatically require Vavi to erase information that applicable law requires or permits Vavi to retain. Unused promotional, bonus, complimentary, or cashback Wallet Credits will expire upon account deletion in accordance with Section 12A. Further information regarding collection, processing, retention, deletion, and User privacy rights is provided in the Vavi Privacy Policy.",
  },

  {
    number: "29",
    title: "Refunds and Cancellations",
    paragraphs: [
      "Payments, refunds, cancellations, chargebacks, and related matters are governed by the applicable Vavi Refund & Cancellation Policy and Terms and Conditions. The existence of a refund policy does not guarantee a refund in every situation. Mandatory rights under applicable law remain unaffected.",
    ],
  },

  {
    number: "30",
    title: "Dispute Resolution",
    paragraphs: [
      "Before initiating formal proceedings, you and Vavi should make reasonable efforts to resolve disputes through written communication. Where legally permissible, disputes arising out of or relating to this EULA may be referred to arbitration. Seat of Arbitration: Delhi, India Venue: Delhi, India Language: English The arbitration shall be conducted in accordance with applicable Indian arbitration law. Nothing prevents a party from seeking urgent or interim relief from a competent court where legally permissible.",
    ],
  },

  {
    number: "31",
    title: "Jurisdiction",
    paragraphs: [
      "Subject to:",
    ],
    bullets: [
      "Applicable arbitration provisions;",
      "Mandatory statutory rights;",
      "Consumer protection laws;",
      "Other applicable laws;",
    ],
    afterBullets:
      "courts having competent jurisdiction in Delhi, India shall have jurisdiction over matters requiring judicial intervention.",
  },

  {
    number: "32",
    title: "False or Malicious Claims",
    paragraphs: [
      "Vavi respects genuine complaints and legal rights. However, knowingly fabricated, fraudulent, malicious, or deliberately misleading claims are prohibited. Where legally permissible, Ascendant Vavi LLP reserves the right to seek recovery of legally recoverable:",
    ],
    bullets: [
      "Actual losses;",
      "Reasonable legal expenses;",
      "Proven business losses;",
      "Proven reputational damages;",
      "Other damages available under applicable law.",
    ],
    afterBullets:
      "Where legally permissible and supported by evidence, the Company may seek damages up to INR 1,00,00,000 (Rupees One Crore) or such other amount as may legally be recoverable. This clause does not impose an automatic ₹1 crore penalty merely because a complaint or legal proceeding is unsuccessful.",
  },

  {
    number: "33",
    title: "Electronic Acceptance",
    paragraphs: [
      "You may accept this EULA electronically by:",
    ],
    bullets: [
      "Clicking “I Agree”;",
      "Clicking “Accept”;",
      "Creating an account;",
      "Installing or accessing the application;",
      "Making a payment;",
      "Accepting a consultation;",
      "Providing a consultation;",
      "Continuing to use Vavi after being presented with the EULA.",
    ],
    afterBullets:
      "Such electronic acceptance may constitute legally valid acceptance to the extent permitted by applicable law.",
  },

  {
    number: "34",
    title: "Severability",
    paragraphs: [
      "If any provision of this EULA is found to be invalid, unlawful, or unenforceable, that provision shall be modified or limited to the minimum extent necessary, and the remaining provisions shall continue to apply to the maximum extent permitted by law.",
    ],
  },

  {
    number: "35",
    title: "Waiver",
    paragraphs: [
      "Failure by Vavi to enforce any provision of this EULA does not constitute a waiver of its right to enforce that provision in the future.",
    ],
  },

  {
    number: "36",
    title: "Entire Agreement",
    paragraphs: [
      "This EULA should be read together with:",
    ],
    bullets: [
      "Vavi Privacy Policy;",
      "Vavi Terms and Conditions;",
      "Vavi Refund & Cancellation Policy;",
      "Applicable Astrologer/Partner Agreement;",
      "Other Platform policies.",
    ],
    afterBullets:
      "Together, these documents govern your use of Vavi, subject to any separate written agreement entered into with Ascendant Vavi LLP.",
  },

  {
    number: "37",
    title: "Changes to This EULA",
    paragraphs: [
      "Ascendant Vavi LLP may modify this EULA from time to time. Material changes may be communicated through:",
    ],
    bullets: [
      "App notifications;",
      "Website notices;",
      "Email;",
      "Other reasonable means.",
    ],
    afterBullets:
      "The updated EULA will specify its effective date. Continued use of Vavi after the effective date of an updated EULA constitutes acceptance of the updated EULA to the extent permitted by applicable law.",
  },

  {
    number: "38",
    title: "Governing Law",
    paragraphs: [
      "This EULA shall be governed and interpreted in accordance with the applicable laws of India, subject to mandatory legal rights that cannot legally be excluded or restricted.",
    ],
  },
];

function BulletList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.bulletContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>

          <Text style={styles.bulletText}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PolicySection({ section }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        {section.number}. {section.title}
      </Text>

      {section.paragraphs?.map((paragraph, index) => (
        <Text
          key={`paragraph-${index}`}
          style={styles.sectionContent}
        >
          {paragraph}
        </Text>
      ))}

      <BulletList items={section.bullets} />

      {section.afterBullets ? (
        <Text style={styles.sectionContent}>
          {section.afterBullets}
        </Text>
      ) : null}

      <BulletList items={section.bullets2} />

      {section.afterBullets2 ? (
        <Text style={styles.sectionContent}>
          {section.afterBullets2}
        </Text>
      ) : null}

      <BulletList items={section.bullets3} />
    </View>
  );
}

export default function EULA() {
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
              Legal Agreement
            </Text>
          </View>

          <Text style={styles.mainTitle}>
            End User License Agreement
          </Text>

          <Text style={styles.subtitle}>
            Please read these terms carefully before downloading,
            installing, accessing or using the Vavi Platform.
          </Text>
        </View>

        {/* =========================================
            ABOUT THIS AGREEMENT
        ========================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            About This Agreement
          </Text>

          <Text style={styles.sectionContent}>
            This End User License Agreement ("EULA") is a legal
            agreement between you ("User", "you", or "your") and
            Ascendant Vavi LLP ("Company", "Vavi", "we", "us",
            or "our"). This EULA governs your download,
            installation, access to, and use of the Vavi User
            Application, Vavi Astrologer Application,
            theVavi.com website, software, and associated
            Platform services.
          </Text>

          <Text style={styles.sectionContent}>
            For the purposes of this EULA, "User" includes any
            person accessing the Vavi Platform, including a
            person using Vavi as a customer seeking
            astrology-related services and an Astrologer or
            service provider using Vavi to provide such
            services.
          </Text>

          <Text style={styles.sectionContent}>
            By downloading, installing, accessing, registering
            for, or using Vavi, you acknowledge that you have
            read, understood, and agreed to this EULA, subject
            to applicable law.
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
            Vavi is a technology-enabled intermediary platform.
            Astrology consultations are provided by independent
            Astrologers, and astrology-related information does
            not replace qualified medical, legal, financial or
            other professional advice.
          </Text>
        </View>

        {/* =========================================
            POLICY SECTIONS
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
            If you have questions regarding this EULA or the
            Vavi Platform, you can contact Ascendant Vavi LLP.
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
                General Email
              </Text>

              <Text style={styles.contactValue}>
                info@theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Legal / Grievance
              </Text>

              <Text style={styles.contactValue}>
                legal@theVavi.com
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
                Privacy Email
              </Text>

              <Text style={styles.contactValue}>
                privacy@theVavi.com
              </Text>

              <Text style={styles.contactLabel}>
                Website
              </Text>

              <Text style={styles.contactValue}>
                theVavi.com
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
      WHITE CARD
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
      IMPORTANT ORANGE CARD
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