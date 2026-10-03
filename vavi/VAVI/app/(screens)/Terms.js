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
      title: "Definitions",
      content: `“Vavi”, “Company”, “we”, “us”, and “our” means Ascendant Vavi LLP, the operator of the Vavi Platform.

“Platform” means the Vavi mobile applications, website theVavi.com, dashboards, APIs, software, and related services.

“User” means a person accessing Vavi to search for, communicate with, or obtain astrology-related consultations or services.

“Astrologer” means an independent astrologer or service provider who provides astrology-related consultations through Vavi.

“Consultation” means an astrology-related interaction between a User and Astrologer through features made available by Vavi, including chat or voice consultation.`,
    },

    {
      number: "2",
      title: "Nature of Vavi",
      content: `Vavi is a technology-enabled intermediary platform connecting Users with independent Astrologers.

Vavi may provide:

• User registration
• Astrologer registration
• Astrologer profiles
• Search and discovery
• Chat
• Voice consultations
• Consultation requests
• Payment facilitation
• Commission calculation
• Astrologer payouts
• Reviews and ratings
• Notifications
• Customer support
• Security and fraud prevention

Vavi itself does not generally provide astrology consultations. Astrologers are independent service providers and are responsible for the consultations, opinions, predictions, guidance, remedies, and other information they provide.`,
    },

    {
      number: "3",
      title: "Eligibility",
      content: `You may use Vavi only if you are legally capable of entering into a binding agreement under applicable law.

By using Vavi, you represent that:

• Information provided by you is accurate.
• You are legally eligible to use the Platform.
• You will comply with applicable laws.
• You will comply with these Terms.

Vavi may restrict or terminate accounts that do not satisfy applicable eligibility requirements.`,
    },

    {
      number: "4",
      title: "Account Registration",
      content: `You may be required to provide:

• Name
• Mobile number
• Email
• Date of birth
• Profile information
• Location
• Other information reasonably required by Vavi

You are responsible for maintaining accurate information. You must not:

• Create fake accounts
• Impersonate another person
• Use another person’s account
• Provide fraudulent information
• Share your login credentials`,
    },

    {
      number: "5",
      title: "Astrologer Verification",
      content: `Vavi may verify Astrologers through:

• Identity verification
• Documentation
• Qualifications
• Experience
• Professional information
• Fraud checks
• Other reasonable verification processes

A verification badge or status does not constitute a guarantee by Vavi regarding an Astrologer’s accuracy, expertise, prediction, conduct, or outcome.`,
    },

    {
      number: "6",
      title: "Astrology Services",
      content: `Astrologers may provide services including:

• Horoscope analysis
• Kundli analysis
• Birth-chart interpretation
• Relationship-related astrology
• Career-related astrology
• General astrology guidance
• Other permitted astrology-related consultations

Availability of particular services may vary.`,
    },

    {
      number: "7",
      title: "No Guarantee of Astrology Results",
      content: `Astrology is interpretive in nature. Vavi does not guarantee:

• Accuracy of predictions
• Future events
• Marriage
• Relationship outcomes
• Employment
• Business success
• Financial gains
• Any specific result
• Effectiveness of remedies

Users are responsible for decisions they make based upon consultations.`,
    },

    {
      number: "8",
      title: "Professional Advice Disclaimer",
      content: `Astrology consultations are not a substitute for professional:

• Medical advice
• Mental-health treatment
• Legal advice
• Financial advice
• Investment advice
• Emergency services

Users should consult an appropriately qualified professional where required. Astrologers must not knowingly represent astrology consultation as a guaranteed substitute for professional services.`,
    },

    {
      number: "9",
      title: "Communication Features",
      content: `Vavi may provide:

• Text chat
• Voice calls
• Consultation notifications
• Other communication features

Users and Astrologers must use communication features lawfully and respectfully.`,
    },

    {
      number: "10",
      title: "Prohibited Communication",
      content: `Users and Astrologers must not use Vavi to:

• Harass
• Threaten
• Blackmail
• Extort
• Abuse
• Sexually harass
• Defame unlawfully
• Intimidate
• Fraudulently manipulate another person

Vavi may investigate reports and take appropriate action.`,
    },

    {
      number: "11",
      title: "Voice Calls",
      content: `Vavi may provide voice consultation functionality.

Voice calls depend upon:

• Internet connection
• Device compatibility
• Network availability
• Third-party communication infrastructure

Vavi does not guarantee uninterrupted voice communication. Vavi does not provide video consultation functionality unless expressly introduced in the Platform.

Unless expressly disclosed, Vavi does not represent that voice calls are recorded.`,
    },

    {
      number: "11A",
      title: "Free, Promotional and Paid Consultations",
      content: `Vavi may, from time to time, offer free consultations, introductory chat or call minutes, promotional credits, trial periods, discount offers, or other promotional benefits (“Promotional Benefits”).

The availability, duration, eligibility, usage limit, and expiry of any Promotional Benefit may be displayed within the Platform at the time the benefit is offered.

Unless otherwise expressly stated:

• Promotional Benefits are limited to eligible Users and may be subject to a specified number of minutes, consultations, transactions, or validity period.
• Unused promotional minutes or credits may expire after the applicable validity period.
• Promotional Benefits have no cash value and cannot be transferred, exchanged, withdrawn, or redeemed for cash.
• A Promotional Benefit does not guarantee that the same benefit will be available again in the future.
• Once the applicable free or promotional limit has been exhausted or expired, further consultation may be charged at the applicable rate displayed on the Platform. Where reasonably practicable, Vavi will display the applicable consultation rate or otherwise inform the User before a paid consultation or paid continuation begins.

Fair Usage Policy

Promotional Benefits are provided for genuine personal use only.

Users must not attempt to obtain additional Promotional Benefits through:

• Multiple or duplicate accounts
• False or misleading information
• Account manipulation
• Device, mobile-number, payment-method, or identity manipulation
• Coordinated or artificial transactions
• Any other attempt to circumvent promotional limits

Where Vavi reasonably detects misuse, fraud, manipulation, or violation of this Fair Usage Policy, Vavi may restrict, withdraw, suspend, or cancel the applicable Promotional Benefit and may take appropriate action against the relevant account, subject to applicable law.

Vavi may modify or discontinue future promotional offers from time to time, provided that any rights already accrued to Users will be handled in accordance with the applicable offer terms and law.`,
    },

    {
      number: "12",
      title: "Payments",
      content: `Users may be required to pay applicable charges before or during a consultation.

Payments may include:

• Consultation charges
• Platform fees
• Convenience fees
• Processing charges
• Applicable taxes
• Other disclosed charges

Payments may be processed through authorized third-party payment providers.`,
    },

    {
      number: "12A",
      title: "Vavi Wallet / Platform Credits",
      content: `Vavi may provide a recharge balance, wallet, or platform-credit functionality (“Vavi Wallet”) that enables Users to maintain an eligible balance for purchasing consultations or other services made available through the Vavi Platform.

Amounts credited to the Vavi Wallet may include:

• Amounts paid or recharged by the User
• Promotional credits
• Cashback or incentive credits
• Refund credits
• Other credits expressly provided by Vavi

The Vavi Wallet is intended solely for permitted transactions within the Vavi Platform, subject to applicable law.

Unless otherwise required by applicable law or expressly permitted under the Vavi Refund and Cancellation Policy:

• Wallet balances cannot be transferred to another User or Astrologer.
• Wallet balances cannot be transferred to a bank account, UPI account, card, or other external payment method.
• Wallet balances cannot be withdrawn or redeemed for cash.
• Amounts validly used for completed consultations or services are non-refundable.
• Promotional, cashback, bonus, or complimentary credits have no cash value and are non-refundable and non-transferable.
• Promotional credits may have an expiry period where such expiry is disclosed at the time they are issued.

Applicable consultation charges may be deducted from the User’s available Wallet balance based on the rate displayed or communicated through the Platform. Where the Wallet balance is insufficient, the User may be required to recharge the Wallet or use another permitted payment method before continuing or initiating a paid consultation.

Account Closure and Remaining Wallet Balance

If a User voluntarily closes their account, the User should use any eligible Wallet balance before account closure.

After account closure, any remaining balance may become inaccessible and may lapse, except where a refund, restoration, or other treatment is required under applicable law or expressly provided under the Vavi Refund and Cancellation Policy.

Where Vavi suspends or terminates an account due to suspected fraud, payment dispute, chargeback, manipulation, policy violation, or unlawful activity, Vavi may temporarily freeze the Wallet balance while the matter is investigated.

Where Vavi itself permanently closes an account for reasons unrelated to User misconduct, any unused paid balance will be handled in accordance with Vavi’s Refund and Cancellation Policy and applicable law.

Nothing in this Section limits any mandatory statutory or consumer rights that cannot legally be excluded.`,
    },

    {
      number: "12B",
      title: "Payments & Consultation Nature",
      content: `All payments made on this Platform for a paid consultation are solely for facilitating a private, live, one-to-one (1:1), real-time consultation between the User and the relevant independent Specialist Astrologer.

The Platform acts only as a technology facilitator and marketplace intermediary; it does not provide astrological advice itself. The advisory service is delivered directly by the independent Specialist Astrologer.

Each paid consultation is live, personalized, interactive and non-replayable. No pre-recorded content, automated reports, or downloadable digital goods are delivered as part of the live consultation transaction.

The consultation fee is paid in connection with the Specialist Astrologer’s time and expertise. The Platform facilitates collection of the applicable fee and may retain a facilitation commission or other applicable Platform charges.

The applicable consultation rate, duration, and payment information will be displayed to the User through the Platform before or during the relevant paid consultation, as applicable.`,
    },

    {
      number: "13",
      title: "Vavi Commission",
      content: `Vavi may retain a commission or other Platform charges from transactions conducted through Vavi.

Such charges may include:

• Commission
• Platform fees
• Technology fees
• Service fees
• Convenience charges
• Payment processing charges
• Applicable taxes

For Astrologers, the applicable commission structure may be communicated through the App, Astrologer Agreement, dashboard, email, or other official communication.`,
    },

    {
      number: "14",
      title: "Astrologer Earnings",
      content: `Astrologer earnings may be calculated based on eligible consultations completed through the Platform.

Earnings may be adjusted for:

• Vavi commission
• Refunds
• Chargebacks
• Payment reversals
• Applicable taxes
• Statutory deductions
• Fraudulent or invalid transactions
• Other applicable adjustments`,
    },

    {
      number: "15",
      title: "Astrologer Payouts",
      content: `Eligible Astrologer earnings may be paid according to Vavi’s applicable payout process.

Vavi may require:

• Valid bank details
• PAN
• Tax information
• Identity verification
• Other legally required information

Payouts may be delayed where verification, refund, chargeback, fraud investigation, or legal compliance is pending.`,
    },

    {
      number: "16",
      title: "Payout Holds",
      content: `Vavi may temporarily hold or delay payouts where reasonably necessary to investigate:

• Fraud
• Suspicious transactions
• Chargebacks
• Refunds
• User complaints
• Fake consultations
• Payment manipulation
• Account compromise
• Off-platform transactions
• Policy violations
• Legal requirements

Where an amount has been improperly credited, Vavi may make lawful adjustments or seek recovery.`,
    },

    {
      number: "17",
      title: "Refund and Cancellation Policy",
      content: `Refunds and cancellations shall be governed by the Vavi Refund and Cancellation Policy.

A User is not automatically entitled to a refund merely because the User:

• Dislikes an Astrologer’s opinion
• Disagrees with a prediction
• Does not receive the expected outcome
• Is dissatisfied with a future prediction

However, this does not limit any mandatory consumer or other statutory rights available under applicable law.

Refund eligibility may depend upon:

• Technical failure
• Payment error
• Duplicate payment
• Consultation not delivered
• Cancellation circumstances
• Service-related issues
• Fraudulent transaction
• Other circumstances specified in the Refund Policy`,
    },

    {
      number: "18",
      title: "Chargebacks and Payment Disputes",
      content: `Vavi may investigate payment disputes and chargebacks.

Relevant information may include:

• Transaction records
• Consultation details
• Chat records
• Voice-call metadata
• Payment information
• Customer support communications

Users and Astrologers must not knowingly submit fraudulent payment disputes.`,
    },

    {
      number: "19",
      title: "Off-Platform Transactions",
      content: `Astrologers must not intentionally bypass Vavi’s commercial systems for transactions originating through the Platform.

Astrologers must not:

• Request direct payment
• Provide personal UPI details
• Provide external payment links
• Redirect Users to external paid consultations
• Circumvent Vavi commission

Users should also exercise caution regarding requests to move transactions outside Vavi.`,
    },

    {
      number: "20",
      title: "Contact Information Exchange",
      content: `Vavi may restrict the exchange of:

• Phone numbers
• WhatsApp details
• Personal email addresses
• Social-media handles
• External payment details
• Payment links

These restrictions are intended to protect Users, Astrologers, and the Platform from fraud, abuse, and unauthorized transactions.`,
    },

    {
      number: "21",
      title: "User Privacy and Astrologer Confidentiality",
      content: `Astrologers may receive User information for providing consultations.

Astrologers must:

• Keep User information confidential
• Use it only for legitimate consultation purposes
• Not sell it
• Not publish it
• Not misuse it
• Not use it for unauthorized marketing

Users are also responsible for information they voluntarily disclose during consultations.`,
    },

    {
      number: "22",
      title: "Prohibited Conduct",
      content: `Users and Astrologers must not:

• Commit fraud
• Create fake accounts
• Impersonate another person
• Manipulate consultations
• Manipulate ratings
• Manipulate payments
• Generate fake transactions
• Abuse another person
• Harass another person
• Threaten another person
• Blackmail another person
• Attempt unauthorized access
• Upload malicious software
• Infringe intellectual-property rights
• Circumvent Platform security
• Use Vavi for unlawful purposes
• Attempt to manipulate Platform algorithms
• Attempt to obtain unauthorized personal information`,
    },

    {
      number: "23",
      title: "Fake Consultations and Manipulation",
      content: `Users and Astrologers must not create fake or artificial transactions.

Prohibited activities include:

• Self-booking
• Fake accounts
• Artificial consultations
• Coordinated fake transactions
• Manipulating consultation duration
• Manipulating ratings
• Manipulating earnings
• Other fraudulent Platform activity

Vavi may investigate and take appropriate action.`,
    },

    {
      number: "24",
      title: "Reviews and Ratings",
      content: `Users may be permitted to provide ratings and reviews. Reviews must be honest and based on genuine experience.

You must not:

• Purchase fake reviews
• Create fake reviews
• Manipulate ratings
• Threaten someone for a rating
• Offer prohibited incentives for ratings

Vavi may remove reviews or ratings that violate Platform policies.`,
    },

    {
      number: "25",
      title: "Astrologer Profile",
      content: `Astrologers are responsible for ensuring that their profile information is accurate.

Astrologers must not:

• Claim false qualifications
• Misrepresent experience
• Use another person’s identity
• Upload unauthorized photographs
• Make fraudulent claims
• Guarantee outcomes

Vavi may modify, restrict, or remove misleading profile information.`,
    },

    {
      number: "26",
      title: "User-Generated Content",
      content: `Users and Astrologers may submit:

• Profile photographs
• Reviews
• Messages
• Consultation-related information
• Other content

You represent that you have the right to submit such content.

You must not submit content that is:

• Unlawful
• Fraudulent
• Abusive
• Threatening
• Defamatory
• Infringing
• Malicious
• Intended to deceive`,
    },

    {
      number: "27",
      title: "Intellectual Property",
      content: `All rights in Vavi’s:

• Application
• Website
• Software
• Source code
• Designs
• Logos
• Trademarks
• Graphics
• Databases
• User interface
• Platform technology

belong to or are licensed to Ascendant Vavi LLP.

You may not copy, modify, distribute, reverse engineer, sell, sublicense, or commercially exploit Vavi without written permission.`,
    },

    {
      number: "28",
      title: "Astrologer Content License",
      content: `By submitting profile content or other material to Vavi, an Astrologer grants Vavi a limited, non-exclusive license to use such content as reasonably necessary to:

• Display the Astrologer’s profile
• Promote the Platform
• Provide Platform services
• Improve Platform functionality
• Operate marketing activities

This does not transfer ownership of the Astrologer’s underlying intellectual property.`,
    },

    {
      number: "29",
      title: "Platform Monitoring, Audit and Records",
      content: `To maintain Platform quality, improve safety, prevent fraud and abuse, investigate violations, protect Users and Astrologers, resolve complaints or disputes, process payment-related investigations, and comply with applicable legal obligations, Vavi may monitor, review, audit, store, or process certain Platform communications and activity records, subject to applicable law.

Such information may include, where applicable:

• Chat communications conducted through Vavi
• Consultation timestamps and duration
• Voice-call metadata and call logs
• Connection and technical information
• Transaction and Wallet records
• Customer-support communications
• Complaints and dispute records
• Fraud, security, and Platform-abuse indicators

Vavi may use automated systems as well as authorized personnel for these purposes. Vavi will handle such information in accordance with its Privacy Policy and applicable data-protection and privacy laws.

Voice Call Recording

Voice-call metadata or call logs may be maintained for legitimate Platform purposes. Vavi will not represent that the audio content of a voice consultation is being recorded unless such recording functionality is actually enabled.

If Vavi introduces recording of voice-call audio, Users and Astrologers will be provided appropriate notice before or at the commencement of such recording, and consent will be obtained where required by applicable law.

Use of Monitoring and Records

Information obtained through monitoring, audits, or records may be used for:

• Fraud prevention and investigation
• Safety and security
• Quality assurance
• Customer support
• Dispute and complaint resolution
• Payment or chargeback investigation
• Enforcement of Platform policies
• Compliance with lawful requests or legal obligations

Access to such information will be restricted to authorized persons and service providers where reasonably necessary and will remain subject to applicable privacy and data-protection requirements.`,
    },

    {
      number: "30",
      title: "Account Suspension",
      content: `Vavi may suspend, restrict, investigate, or temporarily disable an account where it reasonably believes there is:

• Fraud
• Abuse
• Harassment
• Misconduct
• Payment manipulation
• Security risk
• Policy violation
• False information
• Illegal activity
• Serious User complaint`,
    },

    {
      number: "31",
      title: "Account Termination",
      content: `Vavi may terminate an account for serious or repeated violations.

Termination may result in:

• Loss of Platform access
• Removal of profile
• Suspension of consultation functionality
• Payout review
• Other lawful consequences

Any legitimate undisputed amount payable to an Astrologer will be handled according to applicable policy and law.`,
    },

    {
      number: "32",
      title: "Account Security",
      content: `You are responsible for maintaining the security of:

• Passwords
• OTPs
• Login credentials
• Devices
• Account access

You must immediately notify Vavi if you suspect unauthorized access.`,
    },

    {
      number: "33",
      title: "Third-Party Services",
      content: `Vavi may depend upon third-party services including:

• Payment gateways
• Cloud infrastructure
• Authentication
• Voice communication
• Analytics
• Notifications
• Hosting
• Security services

Vavi is not responsible for independent failures caused solely by third-party providers, subject to applicable law.`,
    },

    {
      number: "34",
      title: "Platform Availability",
      content: `Vavi does not guarantee uninterrupted or error-free operation.

Temporary unavailability may occur due to:

• Maintenance
• Updates
• Server issues
• Security incidents
• Internet failures
• Third-party failures
• Force majeure events`,
    },

    {
      number: "35",
      title: "Taxes",
      content: `Users and Astrologers are responsible for taxes applicable to their respective transactions and activities.

Astrologers are responsible for complying with applicable:

• Income-tax requirements
• GST requirements
• PAN requirements
• TDS requirements
• Other statutory obligations

Vavi may deduct or withhold amounts where required by law.`,
    },

    {
      number: "36",
      title: "Disclaimer of Warranties",
      content: `To the maximum extent permitted by applicable law, Vavi is provided on an “AS IS” and “AS AVAILABLE” basis.

Vavi does not guarantee:

• Uninterrupted availability
• Error-free operation
• Accuracy of every Platform listing
• Availability of a particular Astrologer
• Particular consultation results
• Particular earnings
• Particular number of Users
• Particular business outcomes`,
    },

    {
      number: "37",
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by applicable law, Ascendant Vavi LLP shall not be liable for indirect, incidental, special, consequential, or speculative losses arising from:

• Astrology predictions
• User decisions
• Astrologer conduct
• Technical failures
• Third-party services
• Lost business opportunities
• Loss of anticipated profits

Nothing in these Terms excludes liability that cannot legally be excluded.`,
    },

    {
      number: "38",
      title: "Indemnification",
      content: `To the maximum extent permitted by applicable law, you agree to indemnify and hold harmless Ascendant Vavi LLP, its partners, employees, officers, contractors, and service providers against claims, losses, liabilities, damages, and reasonable legal expenses arising from:

• Your breach of these Terms
• Fraudulent conduct
• Illegal conduct
• Misrepresentation
• Misuse of the Platform
• Violation of another person’s rights
• Intellectual-property infringement
• Misuse of personal information
• Unauthorized transactions`,
    },

    {
      number: "39",
      title: "False or Malicious Complaints",
      content: `Vavi respects genuine complaints and does not restrict good-faith reporting.

However, knowingly fabricated, fraudulent, malicious, or deliberately misleading complaints are prohibited.

Where legally permissible, Vavi reserves the right to seek recovery of actual losses, investigation costs, reasonable legal expenses, and other damages legally recoverable from a person who knowingly engages in fraudulent or malicious conduct.`,
    },

    {
      number: "40",
      title: "False or Malicious Legal Claims",
      content: `Nothing in these Terms prevents any person from exercising a genuine legal right or filing a good-faith complaint.

However, where a person knowingly initiates a fraudulent, fabricated, malicious, or bad-faith claim against Ascendant Vavi LLP, the Company reserves all rights available under law.

Where legally permissible and supported by evidence, the Company may seek recovery of:

• Actual financial losses
• Reasonable legal expenses
• Proven business losses
• Proven reputational damages
• Other legally recoverable damages

Where legally permissible, the Company may seek damages up to INR 1,00,00,000 (Rupees One Crore) or such other amount as may be legally recoverable.

This clause does not create an automatic ₹1 crore penalty merely because a claim is unsuccessful.`,
    },

    {
      number: "41",
      title: "Dispute Resolution",
      content: `In the event of a dispute, the parties shall first make reasonable efforts to resolve the dispute amicably through communication with Vavi.

If the dispute cannot be resolved amicably, it may be referred to arbitration where legally permissible.`,
    },

    {
      number: "42",
      title: "Arbitration",
      content: `Subject to applicable law, disputes arising out of or relating to these Terms may be referred to arbitration.

Seat of Arbitration: Delhi, India

Venue: Delhi, India

Language: English

Governing Law: Laws of India

The arbitration shall be conducted in accordance with applicable Indian arbitration law.

Nothing prevents a party from seeking urgent or interim relief from a competent court where legally permissible.`,
    },

    {
      number: "43",
      title: "Jurisdiction",
      content: `Subject to:

• Arbitration provisions
• Mandatory statutory rights
• Consumer protection laws
• Other applicable laws

courts having competent jurisdiction in Delhi, India shall have jurisdiction over matters requiring judicial intervention.`,
    },

    {
      number: "44",
      title: "Electronic Acceptance",
      content: `You may accept these Terms electronically by:

• Clicking “I Agree”
• Clicking “Accept”
• Creating an account
• Logging into the Platform
• Making a payment
• Accepting a consultation
• Providing a consultation
• Continuing to use Vavi

Such actions may constitute electronic acceptance to the extent permitted by applicable law.`,
    },

    {
      number: "45",
      title: "Changes to These Terms",
      content: `Vavi may modify these Terms from time to time.

Material changes may be communicated through:

• App notifications
• Website notices
• Email
• Other reasonable methods

The updated Terms will state their effective date.

Continued use of Vavi after the effective date constitutes acceptance of the updated Terms to the extent permitted by applicable law.`,
    },

    {
      number: "46",
      title: "Severability",
      content: `If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in effect to the maximum extent permitted by law.`,
    },

    {
      number: "47",
      title: "Waiver",
      content: `Failure by Vavi to enforce any provision of these Terms shall not constitute a waiver of its right to enforce that provision later.`,
    },

    {
      number: "48",
      title: "Entire Agreement",
      content: `These Terms, together with applicable:

• Privacy Policy
• Refund & Cancellation Policy
• EULA
• Astrologer/Partner Agreement
• Community Guidelines
• Other Platform policies

constitute the applicable agreement governing use of Vavi, subject to any separate written agreement between Vavi and an Astrologer.`,
    },

    {
      number: "49",
      title: "No Employment Relationship",
      content: `Use of Vavi by an Astrologer does not create an employment relationship between the Astrologer and Ascendant Vavi LLP unless expressly agreed in a separate written agreement.

The Astrologer remains responsible for their own professional, tax, and statutory obligations.`,
    },

    {
      number: "50",
      title: "Force Majeure",
      content: `Vavi shall not be responsible for delay or failure caused by circumstances beyond its reasonable control, including:

• Natural disasters
• Government actions
• Internet outages
• Telecommunications failures
• Cloud infrastructure failures
• Cyber incidents
• Power failures
• Third-party service outages
• War
• Civil unrest
• Other force majeure events`,
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
            These Terms and Conditions (“Terms”, “Agreement”)
            govern your access to and use of the Vavi mobile
            applications, website, and related services.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            Vavi is operated by{" "}
            <Text style={styles.boldText}>
              Ascendant Vavi LLP
            </Text>
            . Brand:{" "}
            <Text style={styles.boldText}>
              Vavi
            </Text>
            .
          </Text>

          <Text style={styles.sectionContentSpacing}>
            Website: theVavi.com
          </Text>

          <Text style={styles.sectionContentSpacing}>
            General Email: info@theVavi.com
          </Text>

          <Text style={styles.sectionContentSpacing}>
            Legal/Grievance Email: legal@theVavi.com
          </Text>

          <Text style={styles.sectionContentSpacing}>
            Registered Office: S1 - SF-232, CLOUD-9,
            Vaishali, Ghaziabad, U.P.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            These Terms apply to all persons using Vavi,
            including Users seeking astrology-related
            consultations and Astrologers/service providers
            providing consultations.
          </Text>

          <Text style={styles.sectionContentSpacing}>
            By registering, accessing, browsing, making a
            payment, accepting a consultation, providing a
            consultation, or otherwise using Vavi, you
            acknowledge that you have read, understood,
            and agreed to these Terms, subject to applicable law.
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

        {/* =================================
            CONTACT - SECTION 51
        ================================== */}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>
            51. Contact
          </Text>

          <View style={styles.contactGrid}>
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
                Legal / Grievance Email
              </Text>

              <Text style={styles.contactValue}>
                legal@theVavi.com
              </Text>
            </View>

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

              <Text style={styles.contactLabel}>
                Privacy Email
              </Text>

              <Text style={styles.contactValue}>
                privacy@theVavi.com
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