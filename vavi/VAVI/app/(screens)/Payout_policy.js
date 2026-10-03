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

const getScale = (width) => {
  if (width >= 1000) return 1;
  if (width >= 700) return 0.94;
  return 0.88;
};

/* =========================================================
   TOP SUMMARY
========================================================= */

const summaryCards = [
  {
    icon: "percent-outline",
    title: "50 : 50",
    description: "Standard Vavi / Astrologer revenue share.",
  },
  {
    icon: "calendar-outline",
    title: "7th–10th",
    description: "Ordinary monthly payout window.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "KYC Required",
    description: "Verification may be required before payout.",
  },
  {
    icon: "sync-outline",
    title: "Adjustments",
    description: "Refunds and chargebacks can affect earnings.",
  },
];

/* =========================================================
   PAYOUT POLICY - 56 SECTIONS
========================================================= */

const policySections = [
  {
    number: "01",
    icon: "document-text-outline",
    title: "Purpose Of This Policy",
    content: `This Policy explains:

• How Astrologer earnings are calculated
• Vavi’s commission
• The Astrologer’s revenue share
• How refunds and chargebacks affect earnings
• When payouts may be processed
• When payouts may be held or adjusted
• The effect of fraud or invalid consultations
• Applicable tax and statutory deductions
• Final settlement following account closure or termination.`,
  },

  {
    number: "02",
    icon: "percent-outline",
    title: "Vavi Commission Structure",
    content: `Unless a different commercial arrangement is expressly communicated by Vavi for a particular service, campaign, or category, Vavi shall retain: 50% of the eligible consultation amount as Vavi Commission.

The remaining 50% of the eligible consultation amount shall constitute the Astrologer’s share.

Accordingly, the standard revenue-sharing arrangement is:

Vavi Share: 50%
Astrologer Share: 50%

This applies to eligible paid consultations conducted through the Vavi Platform, including eligible chat and voice consultations.`,
  },

  {
    number: "03",
    icon: "calculator-outline",
    title: "Example Of Commission Calculation",
    content: `For example, where the eligible consultation amount considered for revenue sharing is ₹1,000:

Total Eligible Consultation Amount: ₹1,000
Vavi Commission – 50%: ₹500
Astrologer Share – 50%: ₹500

This example is for illustration only. The final payable amount to the Astrologer may differ because of applicable:

• Taxes
• TDS or statutory deductions
• Refunds
• Chargebacks
• Payment reversals
• Invalid transactions
• Fraud adjustments
• Other lawful adjustments.`,
  },

  {
    number: "04",
    icon: "wallet-outline",
    title: "Eligible Consultation Amount",
    content: `For the purposes of this Policy, the “Eligible Consultation Amount” means the amount recognized by Vavi for revenue sharing in respect of a valid paid consultation.

The applicable amount may be displayed through:

• Astrologer App
• Earnings dashboard
• Consultation details
• Transaction statement
• Other official Vavi interface

Amounts collected solely towards taxes, payment-provider charges, or other components that are not treated as consultation revenue may be handled separately where applicable.

The amount displayed by Vavi as eligible for revenue sharing shall be used for commission calculation, subject to reconciliation and applicable law.`,
  },

  {
    number: "05",
    icon: "chatbubble-outline",
    title: "Chat Consultation Earnings",
    content: `Where chat consultations are charged according to time or another Platform-supported pricing model, the Astrologer’s eligible earnings shall ordinarily be calculated based on the valid paid consultation amount.

Unless otherwise communicated:

Vavi Commission: 50%
Astrologer Share: 50%

Only legitimate consultation time recognized by the Platform will qualify for earnings.

Artificial extension of chat duration for the purpose of increasing earnings is prohibited.`,
  },

  {
    number: "06",
    icon: "call-outline",
    title: "Voice Consultation Earnings",
    content: `Where voice consultations are charged according to connected consultation time, the Astrologer’s eligible share shall ordinarily be calculated from the valid paid consultation amount recognized by Vavi.

Unless otherwise communicated:

Vavi Commission: 50%
Astrologer Share: 50%

Vavi may use call logs, session information, consultation duration, and other relevant Platform records to determine eligible consultation time.`,
  },

  {
    number: "07",
    icon: "gift-outline",
    title: "Free And Promotional Consultations",
    content: `Free consultation minutes, promotional calls, promotional chats, coupons, discounts, bonus credits, or other promotional offers may be subject to separate commercial treatment.

The Astrologer will not automatically be entitled to the normal consultation value for a free or promotional consultation unless Vavi expressly provides for such payment.

Where an Astrologer incentive or promotional earning applies, the applicable amount may be displayed or communicated through the App or other official Vavi communication.`,
  },

  {
    number: "08",
    icon: "pricetag-outline",
    title: "Consultation Rate",
    content: `The applicable User consultation rate may be displayed within the Vavi Platform.

Rates may depend on:

• Astrologer profile
• Experience
• Consultation type
• Promotions
• Platform category
• Commercial arrangements
• Other relevant factors

The User-facing rate and Astrologer revenue share are not necessarily the same amount.

The applicable Astrologer earning shown in the Platform shall remain subject to this Policy.`,
  },

  {
    number: "09",
    icon: "trending-up-outline",
    title: "No Guarantee Of Earnings",
    content: `Vavi does not guarantee:

• Minimum consultation volume
• Minimum number of Users
• Minimum working hours
• Minimum daily earnings
• Minimum monthly earnings
• Minimum payout
• Specific income levels
• Future revenue

Astrologer earnings depend on valid consultation activity and User demand.`,
  },

  {
    number: "10",
    icon: "analytics-outline",
    title: "Earnings Status",
    content: `Vavi may classify earnings as:

Estimated
An amount calculated before final reconciliation.

Pending
An amount awaiting settlement, verification, or completion of the applicable payout cycle.

Under Review
An amount subject to complaint, refund, fraud, chargeback, or other investigation.

Payable
An amount determined to be eligible for payout after applicable adjustments.

Paid
An amount successfully processed through the applicable payout mechanism.

Amounts shown as estimated or pending are not necessarily final payable amounts.`,
  },

  {
    number: "11",
    icon: "calendar-outline",
    title: "Payout Process",
    content: `Eligible Astrologer earnings shall ordinarily be processed on a monthly payout cycle.

Vavi shall ordinarily release eligible Astrologer payouts between the 7th and 10th day of each calendar month, subject to applicable verification, reconciliation, refunds, chargebacks, deductions, payout holds, banking/payment-provider processing, and other applicable adjustments.

The payout schedule may be displayed or communicated through:

• Astrologer App
• Dashboard
• Email
• Official Platform notification
• Other authorized Vavi communication

Vavi may update operational payout schedules where reasonably necessary.`,
  },

  {
    number: "12",
    icon: "shield-checkmark-outline",
    title: "Payout Eligibility",
    content: `Before receiving payouts, an Astrologer may be required to complete:

• Identity verification
• KYC
• PAN verification
• Bank-account verification
• Tax information
• Other legally required verification

Vavi may delay payout until required verification is satisfactorily completed.`,
  },

  {
    number: "13",
    icon: "business-outline",
    title: "Bank Details",
    content: `Astrologers are responsible for providing accurate payout details.

This may include:

• Account holder name
• Bank name
• Account number
• IFSC
• PAN
• Other payment information

Vavi will not be responsible for delays caused by incorrect, incomplete, expired, or invalid details supplied by the Astrologer.`,
  },

  {
    number: "14",
    icon: "cash-outline",
    title: "Minimum Payout Threshold",
    content: `Where Vavi applies a minimum payout threshold, the applicable threshold may be displayed in the Astrologer App or dashboard.

If the payable amount is below the applicable threshold, the amount may remain pending and may be carried forward to a subsequent payout cycle.

No minimum threshold will apply unless communicated through the Platform or other official Vavi communication.`,
  },

  {
    number: "15",
    icon: "alert-circle-outline",
    title: "Failed Payouts",
    content: `A payout may fail because of:

• Incorrect bank details
• Closed bank account
• Invalid IFSC
• Name mismatch
• Payment-provider error
• Bank rejection
• Regulatory restrictions
• Technical failure

Where a payout fails, Vavi may reprocess the eligible amount after the issue is resolved.

Repeated failures caused by incorrect information supplied by the Astrologer may delay payment.`,
  },

  {
    number: "16",
    icon: "return-down-back-outline",
    title: "Refunds",
    content: `Where a User receives an eligible refund under the Vavi Refund & Cancellation Policy, the corresponding Astrologer share may be adjusted where the refund relates to that consultation.

This may occur where:

• Consultation was not delivered
• Astrologer did not respond
• Astrologer failed to connect
• Verified Astrologer-side technical or service failure occurred
• Payment was incorrectly charged
• Transaction was invalid or fraudulent

A User simply disagreeing with an astrology prediction does not automatically make the consultation refundable.`,
  },

  {
    number: "17",
    icon: "remove-circle-outline",
    title: "Refund After Astrologer Payout",
    content: `Where an Astrologer has already received earnings relating to a transaction that is subsequently validly refunded or reversed, Vavi may, to the extent permitted by law, adjust the corresponding Astrologer share from:

• Pending earnings
• Future earnings
• Future payouts
• Other amounts properly payable through Vavi

Vavi may also request repayment where adjustment through future earnings is not reasonably available.`,
  },

  {
    number: "18",
    icon: "card-outline",
    title: "Chargebacks",
    content: `Where a User raises a bank, card, UPI, payment-provider, or other chargeback, Vavi may temporarily hold the corresponding amount while the matter is investigated.

Vavi may review:

• Payment records
• Consultation records
• Chat logs
• Call metadata
• Consultation duration
• Customer-support records
• User complaint information
• Astrologer responses

Where the chargeback is upheld, the corresponding Astrologer earnings may be reversed or adjusted.`,
  },

  {
    number: "19",
    icon: "sync-outline",
    title: "Payment Reversals",
    content: `Amounts may be adjusted where a transaction is subsequently:

• Reversed
• Cancelled
• Declined
• Refunded
• Charged back
• Identified as unauthorized
• Determined to be invalid

An amount initially displayed as earnings does not become permanently payable where the underlying payment later becomes invalid.`,
  },

  {
    number: "20",
    icon: "ban-outline",
    title: "Fake Consultations",
    content: `No earnings shall be payable for consultations determined to be fraudulent or artificial.

Prohibited activity includes:

• Self-booking
• Fake User accounts
• Coordinated fake consultations
• Artificial transactions
• Manipulated consultation duration
• Repeated circular transactions
• Friends or associates creating fake consultations
• Promotional abuse
• Payment manipulation

Vavi may reverse earnings generated through verified fraudulent activity.`,
  },

  {
    number: "21",
    icon: "speedometer-outline",
    title: "Earnings Manipulation",
    content: `Astrologers must not intentionally manipulate Platform systems to increase earnings.

This includes:

• Unnecessarily extending chat duration
• Intentionally prolonging calls
• Reconnecting solely to create additional charges
• Artificially delaying responses to increase billable time
• Creating fake transactions
• Exploiting technical errors

Verified manipulation may result in:

• Earnings reversal
• Payout hold
• Account restriction
• Suspension
• Termination.`,
  },

  {
    number: "22",
    icon: "exit-outline",
    title: "Off-Platform Transactions",
    content: `Astrologers must not intentionally redirect Vavi-originated Users to external payment methods to avoid Vavi’s 50% commission.

Prohibited conduct may include requesting:

• Personal UPI transfers
• Direct bank payments
• Cash
• External payment links
• Paid WhatsApp consultations
• Paid Telegram consultations
• Paid consultations through another application

Transactions intentionally moved off-platform in violation of Vavi policies will not qualify as Vavi earnings.`,
  },

  {
    number: "23",
    icon: "pause-circle-outline",
    title: "Payout Hold",
    content: `Vavi may temporarily place payouts under review where reasonably necessary because of:

• Fraud
• Fake consultations
• User complaint
• Refund investigation
• Chargeback
• Payment dispute
• Suspicious transaction activity
• Identity-verification issue
• Account compromise
• Security concern
• Off-platform payment activity
• Legal or regulatory requirement

A payout hold is not automatically a permanent forfeiture.`,
  },

  {
    number: "24",
    icon: "search-outline",
    title: "Investigation",
    content: `Vavi may conduct a reasonable investigation before releasing an amount under review.

The Astrologer may be requested to provide clarification or information relating to a transaction or consultation.

Failure to reasonably cooperate with a legitimate investigation may delay resolution.`,
  },

  {
    number: "25",
    icon: "close-circle-outline",
    title: "Invalid Earnings",
    content: `Amounts arising from verified:

• Fraud
• Fake consultations
• Duplicate credits
• System errors
• Payment manipulation
• Invalid payments
• Unauthorized transactions
• Artificial consultation activity

will not constitute legitimate Astrologer earnings.

Vavi may reverse such amounts.`,
  },

  {
    number: "26",
    icon: "copy-outline",
    title: "Duplicate Or Erroneous Credits",
    content: `If an Astrologer is accidentally credited more than the amount legitimately payable because of a technical, operational, or calculation error, Vavi may correct the error.

The excess amount may be adjusted against:

• Pending balance
• Future earnings
• Future payouts

The Astrologer must not knowingly exploit or withdraw duplicate credits created by a Platform error.`,
  },

  {
    number: "27",
    icon: "receipt-outline",
    title: "Taxes And Statutory Deductions",
    content: `Astrologers remain responsible for their own tax and statutory obligations applicable to their earnings.

Where required by applicable law, Vavi may deduct or withhold:

• TDS
• Taxes
• Other statutory deductions

The exact tax treatment may depend on applicable law and the Astrologer’s tax status.

Vavi may request valid PAN, GST, or other tax information where required.`,
  },

  {
    number: "28",
    icon: "document-outline",
    title: "GST",
    content: `Where GST or other indirect-tax obligations apply, the respective tax treatment shall be handled according to applicable law and the commercial structure applicable to the transaction.

Astrologers who are independently required to obtain GST registration or issue tax documentation remain responsible for their applicable compliance obligations.

Vavi may request GST details where relevant.`,
  },

  {
    number: "29",
    icon: "receipt-outline",
    title: "Payout Statement",
    content: `Where supported by Platform functionality, Vavi may provide an earnings or payout statement showing information such as:

• Consultation earnings
• Vavi commission
• Astrologer share
• Refund adjustments
• Chargeback adjustments
• Tax deductions
• Final payable amount
• Payout status

Astrologers should review their earnings information and promptly report material discrepancies.`,
  },

  {
    number: "30",
    icon: "refresh-outline",
    title: "Commission On Refunded Transactions",
    content: `Where a transaction is completely reversed or refunded, the Vavi commission and Astrologer share associated with the refunded portion may be appropriately reversed or recalculated.

Where only part of a transaction is refunded, the adjustment may be limited to the relevant refunded portion.`,
  },

  {
    number: "31",
    icon: "chatbubbles-outline",
    title: "Partial Consultations",
    content: `Where only part of a paid consultation is legitimately delivered, Vavi may determine the eligible consultation amount based on:

• Actual consultation duration
• Applicable billing method
• Technical records
• Refund decision
• Other relevant information

The corresponding 50:50 revenue share may then be applied to the final eligible amount.`,
  },

  {
    number: "32",
    icon: "wifi-outline",
    title: "Disconnected Consultations",
    content: `A consultation being disconnected does not automatically make the entire transaction invalid.

Vavi may consider:

• Whether connection occurred
• Consultation duration
• Whether meaningful service was delivered
• Cause of disconnection
• Available technical records

The eligible amount may be adjusted where appropriate.`,
  },

  {
    number: "33",
    icon: "person-remove-outline",
    title: "Astrologer No-Show",
    content: `Where an Astrologer accepts a paid consultation but fails to participate and the User receives no meaningful service, the consultation may be treated as non-delivered.

No Astrologer earning may be payable for the undelivered portion.`,
  },

  {
    number: "34",
    icon: "phone-portrait-outline",
    title: "User-Side Failure",
    content: `Where the consultation fails solely because of circumstances attributable to the User, such as:

• User intentionally disconnecting
• User device failure
• User network failure
• Incorrect permissions
• User abandoning the consultation

the Astrologer’s legitimate earnings may remain eligible, depending on the circumstances and available Platform records.`,
  },

  {
    number: "35",
    icon: "construct-outline",
    title: "Platform Technical Failure",
    content: `Where a verified Vavi Platform failure materially prevents a paid consultation from being delivered, Vavi may adjust the relevant User charge and Astrologer earnings.

Such adjustments will be based on the consultation actually delivered and the applicable Refund & Cancellation Policy.`,
  },

  {
    number: "36",
    icon: "lock-closed-outline",
    title: "Account Suspension",
    content: `During an account suspension, Vavi may temporarily restrict:

• New consultations
• Earnings withdrawal
• Payout processing
• Certain account features

Pending legitimate amounts may remain under review until the relevant issue is resolved.`,
  },

  {
    number: "37",
    icon: "person-remove-outline",
    title: "Account Termination",
    content: `Where an Astrologer account is terminated, Vavi may conduct a final financial reconciliation.

The reconciliation may include:

• Valid consultation earnings
• Vavi commission
• Refunds
• Chargebacks
• Fraud adjustments
• Tax deductions
• Pending payment disputes
• Other legitimate adjustments

Legitimate undisputed net earnings will be handled in accordance with Vavi’s applicable payout process and law.`,
  },

  {
    number: "38",
    icon: "log-out-outline",
    title: "Astrologer Voluntary Account Closure",
    content: `An Astrologer who voluntarily closes their account remains subject to final settlement of:

• Pending earnings
• Refunds
• Chargebacks
• Tax deductions
• Payment disputes
• Other outstanding financial obligations

Closing the account does not automatically eliminate valid financial adjustments arising from transactions completed before closure.`,
  },

  {
    number: "39",
    icon: "shield-outline",
    title: "Fraud-Related Termination",
    content: `Where an account is terminated for suspected fraud, Vavi may temporarily retain relevant amounts while completing a reasonable investigation.

Amounts verified as arising from fraudulent or invalid activity will not be treated as legitimate earnings.

Legitimate undisputed earnings unrelated to the violation will be handled according to applicable policy and law.`,
  },

  {
    number: "40",
    icon: "settings-outline",
    title: "Commission Changes",
    content: `The standard Vavi commission is currently:

50% Vavi / 50% Astrologer.

Vavi may modify the commission structure in the future where reasonably necessary for commercial, operational, regulatory, or Platform reasons.

Any material change to the standard commission structure will be communicated through reasonable means, such as:

• Astrologer App
• Dashboard
• Email
• Platform notification
• Other official communication

A revised commission rate will ordinarily apply prospectively from the communicated effective date.

Consultations already completed before the effective date will ordinarily remain subject to the commercial terms applicable when they occurred, unless otherwise required by law or expressly agreed.`,
  },

  {
    number: "41",
    icon: "briefcase-outline",
    title: "Special Commercial Arrangements",
    content: `Vavi may offer certain Astrologers different commercial arrangements based on:

• Promotional campaigns
• Performance programmes
• Category
• Service type
• Temporary incentive
• Other commercial arrangements

Any such special arrangement must be communicated through an official Vavi channel.

Unless such a different arrangement applies, the standard 50:50 revenue share applies.`,
  },

  {
    number: "42",
    icon: "gift-outline",
    title: "Incentives And Bonuses",
    content: `Vavi may introduce optional incentive or bonus programmes.

These may have:

• Eligibility requirements
• Performance conditions
• Validity periods
• Minimum consultation requirements
• Other disclosed conditions

Bonuses and incentives are separate from normal consultation revenue unless expressly stated otherwise.`,
  },

  {
    number: "43",
    icon: "pricetag-outline",
    title: "Platform Promotions",
    content: `Vavi may offer discounts or promotions to Users.

Where a promotion affects Astrologer earnings, the applicable earning treatment should be displayed or otherwise communicated to the Astrologer where reasonably practicable.

Astrologers should not assume that every User discount will automatically reduce their share unless such treatment is communicated.`,
  },

  {
    number: "44",
    icon: "card-outline",
    title: "Payment Processors",
    content: `Vavi may rely on third-party banks, payment gateways, payout providers, or financial infrastructure.

Vavi is not responsible for delays caused solely by an independent third-party provider after Vavi has correctly initiated an eligible payout.`,
  },

  {
    number: "45",
    icon: "time-outline",
    title: "Payout Delays",
    content: `Payouts may occasionally be delayed due to:

• Banking holidays
• Payment-provider outages
• Technical failures
• Bank processing delays
• KYC issues
• Regulatory checks
• Fraud investigations
• Incorrect payout details
• Force majeure events

Vavi will make reasonable efforts to process legitimate eligible payouts according to its applicable payout system.`,
  },

  {
    number: "46",
    icon: "cash-outline",
    title: "Currency",
    content: `Unless expressly stated otherwise, amounts displayed in the Vavi Platform for India may be denominated in Indian Rupees (INR).`,
  },

  {
    number: "47",
    icon: "archive-outline",
    title: "Record Keeping",
    content: `Vavi may maintain financial and transaction records relating to:

• Consultation earnings
• Commission
• Payouts
• Refunds
• Chargebacks
• Taxes
• Adjustments
• Payment disputes

for legitimate accounting, audit, fraud-prevention, dispute-resolution, and legal-compliance purposes.`,
  },

  {
    number: "48",
    icon: "search-outline",
    title: "Audit And Verification",
    content: `Vavi may review relevant Platform records to verify earnings and payouts.

Such records may include:

• Consultation IDs
• Chat duration
• Call duration
• Payment transactions
• Wallet ledger information
• Refund records
• Chargeback records
• Technical logs
• Fraud indicators

The Platform’s verified transaction records may be used for reconciliation, subject to applicable law and correction of demonstrated errors.`,
  },

  {
    number: "49",
    icon: "help-circle-outline",
    title: "Payout Disputes",
    content: `If an Astrologer believes there is a genuine payout or commission-calculation error, the Astrologer should contact Vavi support with the relevant:

• Consultation ID
• Transaction details
• Payout reference
• Date
• Amount
• Description of the issue

Vavi may investigate the discrepancy using Platform and payment records.`,
  },

  {
    number: "50",
    icon: "ban-outline",
    title: "No Manipulation Of Payout Disputes",
    content: `Astrologers must not knowingly submit:

• Fake transaction evidence
• Manipulated screenshots
• False payout claims
• Duplicate payment claims
• Fraudulent earning claims

Good-faith disputes will not be treated as misconduct merely because Vavi ultimately determines that no additional amount is payable.`,
  },

  {
    number: "51",
    icon: "alert-circle-outline",
    title: "Platform Display Errors",
    content: `An accidental display error in the dashboard does not automatically create an entitlement to an incorrect amount.

Where a clearly erroneous figure is displayed because of a technical problem, Vavi may correct the record based on the underlying verified transaction data.

Likewise, Vavi should correct genuine under-crediting where verified.`,
  },

  {
    number: "52",
    icon: "refresh-circle-outline",
    title: "Policy Changes",
    content: `Vavi may update this Policy from time to time.

Material changes may be communicated through:

• App notification
• Dashboard
• Email
• Website notice
• Other reasonable means

The updated Policy will state its effective date.`,
  },

  {
    number: "53",
    icon: "documents-outline",
    title: "Relationship With Other Vavi Policies",
    content: `This Policy should be read together with:

• Vavi Astrologer / Partner Agreement
• Vavi Terms and Conditions
• Vavi Refund & Cancellation Policy
• Vavi Privacy Policy
• Vavi EULA
• Community Guidelines / Acceptable Use Policy

Where there is a specific issue concerning Astrologer earnings, commission, or payouts, this Policy should ordinarily govern that financial issue, subject to mandatory applicable law.`,
  },

  {
    number: "54",
    icon: "checkmark-circle-outline",
    title: "Electronic Acceptance",
    content: `No physical signature is required.

This Policy may be accepted electronically by:

• Clicking “I Agree”
• Clicking “Accept & Continue”
• Completing Astrologer onboarding
• Accepting consultations after this Policy has been presented
• Continuing to use the Astrologer Platform.`,
  },

  {
    number: "55",
    icon: "scale-outline",
    title: "Governing Law And Disputes",
    content: `This Policy shall be interpreted in accordance with applicable laws of India.

Where a payout or commission dispute arises, the parties should first make reasonable efforts to resolve the matter through Vavi’s internal support or grievance process.

Any unresolved dispute may thereafter be handled in accordance with the dispute-resolution provisions contained in the applicable Vavi Terms and Conditions or Astrologer / Partner Agreement.`,
  },

  {
    number: "56",
    icon: "mail-outline",
    title: "Contact",
    content: `For questions regarding earnings, payouts, commissions, or payout disputes:

Ascendant Vavi LLP
Brand: Vavi
Website: theVavi.com
General Email: info@theVavi.com
Legal/Grievance Email: legal@theVavi.com

Registered Office:
S1 - SF-232, CLOUD-9,
Vaishali, Ghaziabad, U.P.

© 2026 Ascendant Vavi LLP. All Rights Reserved.`,
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
   POLICY CARD
========================================================= */

const PolicyCard = ({ item, scale }) => {
  const lines = item.content.split("\n");

  return (
    <View style={styles.policyCard}>
      {/* Decorative circle */}

      <View style={styles.decorativeCircle} />

      {/* Top */}

      <View style={styles.cardTopRow}>
        <View style={styles.policyIcon}>
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
          styles.policyTitle,
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
   HELP CARD
========================================================= */

const HelpCard = ({ scale }) => {
  return (
    <View style={styles.helpCard}>
      <View style={styles.helpTop}>
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
            Questions About Your Payout?
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
            For questions regarding earnings, payouts,
            commissions or payout disputes, contact Vavi
            through the official contact details below and
            include the relevant transaction details.
          </Text>
        </View>

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
        </View>
      </View>

      <View style={styles.helpDivider} />

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
          styles.companyInfo,
          {
            fontSize: 12 * scale,
            lineHeight: 20 * scale,
          },
        ]}
      >
        Brand: Vavi{"\n"}
        Website: theVavi.com{"\n"}
        Registered Office: S1 - SF-232, CLOUD-9,
        Vaishali, Ghaziabad, U.P.
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

export default function Payout_policy() {
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
          <Text
            style={[
              styles.heroLabel,
              {
                fontSize: 13 * scale,
                letterSpacing: 2 * scale,
              },
            ]}
          >
            ASTROLOGER PAYMENTS
          </Text>

          <Text
            style={[
              styles.heroTitle,
              {
                fontSize: 31 * scale,
                lineHeight: 39 * scale,
              },
            ]}
          >
            Payout & Commission Policy
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                fontSize: 14 * scale,
                lineHeight: 23 * scale,
              },
            ]}
          >
            Understand how Astrologer earnings, commissions,
            payouts, adjustments and payment disputes are
            handled on Vavi.
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
            POLICY DETAILS HEADER
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
            POLICY DETAILS
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
            Complete Earnings & Payout Rules
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
            All 56 sections from the Payout & Commission
            Policy are included below.
          </Text>
        </View>

        {/* =================================================
            POLICY GRID
        ================================================= */}

        <View
          style={[
            styles.policyGrid,
            isTablet
              ? styles.policyGridTablet
              : styles.policyGridMobile,
          ]}
        >
          {policySections.map((item) => (
            <PolicyCard
              key={item.number}
              item={item}
              scale={scale}
            />
          ))}
        </View>

        {/* =================================================
            HELP CARD
        ================================================= */}

        <HelpCard scale={scale} />

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

    paddingTop: 45,
    paddingBottom: 38,
    paddingHorizontal: 15,
  },

  heroLabel: {
    color: COLORS.orange,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },

  heroTitle: {
    color: COLORS.brown,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  heroSubtitle: {
    color: COLORS.paragraph,
    textAlign: "center",
    maxWidth: 900,
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

    minHeight: 178,

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

    paddingTop: 65,
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
     POLICY GRID
  ===================================================== */

  policyGrid: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },

  policyGridMobile: {
    flexDirection: "column",
  },

  policyGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* =====================================================
     POLICY CARD
  ===================================================== */

  policyCard: {
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

  policyIcon: {
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

  policyTitle: {
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
     HELP CARD
  ===================================================== */

  helpCard: {
    width: "100%",
    maxWidth: 1200,

    alignSelf: "center",

    backgroundColor: COLORS.darkBrown,

    borderRadius: 28,

    paddingHorizontal: 30,
    paddingVertical: 32,

    marginTop: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  helpTop: {
    flexDirection: "row",
    flexWrap: "wrap",
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

  companyName: {
    color: COLORS.white,
    fontWeight: "700",

    marginBottom: 8,
  },

  companyInfo: {
    color: "#BDAEA6",
  },

  copyright: {
    color: "#BDAEA6",

    marginTop: 18,
  },

  bottomSpace: {
    height: 30,
  },
});