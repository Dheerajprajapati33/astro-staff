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
   PAYOUT POLICY DATA
   56 SECTIONS
========================================================= */

const PAYOUT_DATA = [
  {
    number: "01",
    title: "Purpose Of This Policy",
    content: [
      "This Policy explains:",
      "• How Astrologer earnings are calculated",
      "• Vavi’s commission",
      "• The Astrologer’s revenue share",
      "• How refunds and chargebacks affect earnings",
      "• When payouts may be processed",
      "• When payouts may be held or adjusted",
      "• The effect of fraud or invalid consultations",
      "• Applicable tax and statutory deductions",
      "• Final settlement following account closure or termination.",
    ],
  },

  {
    number: "02",
    title: "Vavi Commission Structure",
    content: [
      "Unless a different commercial arrangement is expressly communicated by Vavi for a particular service, campaign, or category, Vavi shall retain: 50% of the eligible consultation amount as Vavi Commission.",
      "The remaining 50% of the eligible consultation amount shall constitute the Astrologer’s share.",
      "Accordingly, the standard revenue-sharing arrangement is:",
      "Vavi Share: 50%",
      "Astrologer Share: 50%",
      "This applies to eligible paid consultations conducted through the Vavi Platform, including eligible chat and voice consultations.",
    ],
  },

  {
    number: "03",
    title: "Example Of Commission Calculation",
    content: [
      "For example, where the eligible consultation amount considered for revenue sharing is ₹1,000:",
      "Total Eligible Consultation Amount: ₹1,000",
      "Vavi Commission – 50%: ₹500",
      "Astrologer Share – 50%: ₹500",
      "This example is for illustration only. The final payable amount to the Astrologer may differ because of applicable:",
      "• Taxes",
      "• TDS or statutory deductions",
      "• Refunds",
      "• Chargebacks",
      "• Payment reversals",
      "• Invalid transactions",
      "• Fraud adjustments",
      "• Other lawful adjustments.",
    ],
  },

  {
    number: "04",
    title: "Eligible Consultation Amount",
    content: [
      "For the purposes of this Policy, the “Eligible Consultation Amount” means the amount recognized by Vavi for revenue sharing in respect of a valid paid consultation.",
      "The applicable amount may be displayed through:",
      "• Astrologer App",
      "• Earnings dashboard",
      "• Consultation details",
      "• Transaction statement",
      "• Other official Vavi interface",
      "Amounts collected solely towards taxes, payment-provider charges, or other components that are not treated as consultation revenue may be handled separately where applicable.",
      "The amount displayed by Vavi as eligible for revenue sharing shall be used for commission calculation, subject to reconciliation and applicable law.",
    ],
  },

  {
    number: "05",
    title: "Chat Consultation Earnings",
    content: [
      "Where chat consultations are charged according to time or another Platform-supported pricing model, the Astrologer’s eligible earnings shall ordinarily be calculated based on the valid paid consultation amount.",
      "Unless otherwise communicated:",
      "Vavi Commission: 50%",
      "Astrologer Share: 50%",
      "Only legitimate consultation time recognized by the Platform will qualify for earnings.",
      "Artificial extension of chat duration for the purpose of increasing earnings is prohibited.",
    ],
  },

  {
    number: "06",
    title: "Voice Consultation Earnings",
    content: [
      "Where voice consultations are charged according to connected consultation time, the Astrologer’s eligible share shall ordinarily be calculated from the valid paid consultation amount recognized by Vavi.",
      "Unless otherwise communicated:",
      "Vavi Commission: 50%",
      "Astrologer Share: 50%",
      "Vavi may use call logs, session information, consultation duration, and other relevant Platform records to determine eligible consultation time.",
    ],
  },

  {
    number: "07",
    title: "Free And Promotional Consultations",
    content: [
      "Free consultation minutes, promotional calls, promotional chats, coupons, discounts, bonus credits, or other promotional offers may be subject to separate commercial treatment.",
      "The Astrologer will not automatically be entitled to the normal consultation value for a free or promotional consultation unless Vavi expressly provides for such payment.",
      "Where an Astrologer incentive or promotional earning applies, the applicable amount may be displayed or communicated through the App or other official Vavi communication.",
    ],
  },

  {
    number: "08",
    title: "Consultation Rate",
    content: [
      "The applicable User consultation rate may be displayed within the Vavi Platform.",
      "Rates may depend on:",
      "• Astrologer profile",
      "• Experience",
      "• Consultation type",
      "• Promotions",
      "• Platform category",
      "• Commercial arrangements",
      "• Other relevant factors",
      "The User-facing rate and Astrologer revenue share are not necessarily the same amount.",
      "The applicable Astrologer earning shown in the Platform shall remain subject to this Policy.",
    ],
  },

  {
    number: "09",
    title: "No Guarantee Of Earnings",
    content: [
      "Vavi does not guarantee:",
      "• Minimum consultation volume",
      "• Minimum number of Users",
      "• Minimum working hours",
      "• Minimum daily earnings",
      "• Minimum monthly earnings",
      "• Minimum payout",
      "• Specific income levels",
      "• Future revenue",
      "Astrologer earnings depend on valid consultation activity and User demand.",
    ],
  },

  {
    number: "10",
    title: "Earnings Status",
    content: [
      "Vavi may classify earnings as:",
      "Estimated",
      "An amount calculated before final reconciliation.",
      "Pending",
      "An amount awaiting settlement, verification, or completion of the applicable payout cycle.",
      "Under Review",
      "An amount subject to complaint, refund, fraud, chargeback, or other investigation.",
      "Payable",
      "An amount determined to be eligible for payout after applicable adjustments.",
      "Paid",
      "An amount successfully processed through the applicable payout mechanism.",
      "Amounts shown as estimated or pending are not necessarily final payable amounts.",
    ],
  },

  {
    number: "11",
    title: "Payout Process",
    content: [
      "Eligible Astrologer earnings shall ordinarily be processed on a monthly payout cycle.",
      "Vavi shall ordinarily release eligible Astrologer payouts between the 7th and 10th day of each calendar month, subject to applicable verification, reconciliation, refunds, chargebacks, deductions, payout holds, banking/payment-provider processing, and other applicable adjustments.",
      "The payout schedule may be displayed or communicated through:",
      "• Astrologer App",
      "• Dashboard",
      "• Email",
      "• Official Platform notification",
      "• Other authorized Vavi communication",
      "Vavi may update operational payout schedules where reasonably necessary.",
    ],
  },

  {
    number: "12",
    title: "Payout Eligibility",
    content: [
      "Before receiving payouts, an Astrologer may be required to complete:",
      "• Identity verification",
      "• KYC",
      "• PAN verification",
      "• Bank-account verification",
      "• Tax information",
      "• Other legally required verification",
      "Vavi may delay payout until required verification is satisfactorily completed.",
    ],
  },

  {
    number: "13",
    title: "Bank Details",
    content: [
      "Astrologers are responsible for providing accurate payout details.",
      "This may include:",
      "• Account holder name",
      "• Bank name",
      "• Account number",
      "• IFSC",
      "• PAN",
      "• Other payment information",
      "Vavi will not be responsible for delays caused by incorrect, incomplete, expired, or invalid details supplied by the Astrologer.",
    ],
  },

  {
    number: "14",
    title: "Minimum Payout Threshold",
    content: [
      "Where Vavi applies a minimum payout threshold, the applicable threshold may be displayed in the Astrologer App or dashboard.",
      "If the payable amount is below the applicable threshold, the amount may remain pending and may be carried forward to a subsequent payout cycle.",
      "No minimum threshold will apply unless communicated through the Platform or other official Vavi communication.",
    ],
  },

  {
    number: "15",
    title: "Failed Payouts",
    content: [
      "A payout may fail because of:",
      "• Incorrect bank details",
      "• Closed bank account",
      "• Invalid IFSC",
      "• Name mismatch",
      "• Payment-provider error",
      "• Bank rejection",
      "• Regulatory restrictions",
      "• Technical failure",
      "Where a payout fails, Vavi may reprocess the eligible amount after the issue is resolved.",
      "Repeated failures caused by incorrect information supplied by the Astrologer may delay payment.",
    ],
  },

  {
    number: "16",
    title: "Refunds",
    content: [
      "Where a User receives an eligible refund under the Vavi Refund & Cancellation Policy, the corresponding Astrologer share may be adjusted where the refund relates to that consultation.",
      "This may occur where:",
      "• Consultation was not delivered",
      "• Astrologer did not respond",
      "• Astrologer failed to connect",
      "• Verified Astrologer-side technical or service failure occurred",
      "• Payment was incorrectly charged",
      "• Transaction was invalid or fraudulent",
      "A User simply disagreeing with an astrology prediction does not automatically make the consultation refundable.",
    ],
  },

  {
    number: "17",
    title: "Refund After Astrologer Payout",
    content: [
      "Where an Astrologer has already received earnings relating to a transaction that is subsequently validly refunded or reversed, Vavi may, to the extent permitted by law, adjust the corresponding Astrologer share from:",
      "• Pending earnings",
      "• Future earnings",
      "• Future payouts",
      "• Other amounts properly payable through Vavi",
      "Vavi may also request repayment where adjustment through future earnings is not reasonably available.",
    ],
  },

  {
    number: "18",
    title: "Chargebacks",
    content: [
      "Where a User raises a bank, card, UPI, payment-provider, or other chargeback, Vavi may temporarily hold the corresponding amount while the matter is investigated.",
      "Vavi may review:",
      "• Payment records",
      "• Consultation records",
      "• Chat logs",
      "• Call metadata",
      "• Consultation duration",
      "• Customer-support records",
      "• User complaint information",
      "• Astrologer responses",
      "Where the chargeback is upheld, the corresponding Astrologer earnings may be reversed or adjusted.",
    ],
  },

  {
    number: "19",
    title: "Payment Reversals",
    content: [
      "Amounts may be adjusted where a transaction is subsequently:",
      "• Reversed",
      "• Cancelled",
      "• Declined",
      "• Refunded",
      "• Charged back",
      "• Identified as unauthorized",
      "• Determined to be invalid",
      "An amount initially displayed as earnings does not become permanently payable where the underlying payment later becomes invalid.",
    ],
  },

  {
    number: "20",
    title: "Fake Consultations",
    content: [
      "No earnings shall be payable for consultations determined to be fraudulent or artificial.",
      "Prohibited activity includes:",
      "• Self-booking",
      "• Fake User accounts",
      "• Coordinated fake consultations",
      "• Artificial transactions",
      "• Manipulated consultation duration",
      "• Repeated circular transactions",
      "• Friends or associates creating fake consultations",
      "• Promotional abuse",
      "• Payment manipulation",
      "Vavi may reverse earnings generated through verified fraudulent activity.",
    ],
  },

  {
    number: "21",
    title: "Earnings Manipulation",
    content: [
      "Astrologers must not intentionally manipulate Platform systems to increase earnings.",
      "This includes:",
      "• Unnecessarily extending chat duration",
      "• Intentionally prolonging calls",
      "• Reconnecting solely to create additional charges",
      "• Artificially delaying responses to increase billable time",
      "• Creating fake transactions",
      "• Exploiting technical errors",
      "Verified manipulation may result in:",
      "• Earnings reversal",
      "• Payout hold",
      "• Account restriction",
      "• Suspension",
      "• Termination.",
    ],
  },

  {
    number: "22",
    title: "Off-Platform Transactions",
    content: [
      "Astrologers must not intentionally redirect Vavi-originated Users to external payment methods to avoid Vavi’s 50% commission.",
      "Prohibited conduct may include requesting:",
      "• Personal UPI transfers",
      "• Direct bank payments",
      "• Cash",
      "• External payment links",
      "• Paid WhatsApp consultations",
      "• Paid Telegram consultations",
      "• Paid consultations through another application",
      "Transactions intentionally moved off-platform in violation of Vavi policies will not qualify as Vavi earnings.",
    ],
  },

  {
    number: "23",
    title: "Payout Hold",
    content: [
      "Vavi may temporarily place payouts under review where reasonably necessary because of:",
      "• Fraud",
      "• Fake consultations",
      "• User complaint",
      "• Refund investigation",
      "• Chargeback",
      "• Payment dispute",
      "• Suspicious transaction activity",
      "• Identity-verification issue",
      "• Account compromise",
      "• Security concern",
      "• Off-platform payment activity",
      "• Legal or regulatory requirement",
      "A payout hold is not automatically a permanent forfeiture.",
    ],
  },

  {
    number: "24",
    title: "Investigation",
    content: [
      "Vavi may conduct a reasonable investigation before releasing an amount under review.",
      "The Astrologer may be requested to provide clarification or information relating to a transaction or consultation.",
      "Failure to reasonably cooperate with a legitimate investigation may delay resolution.",
    ],
  },

  {
    number: "25",
    title: "Invalid Earnings",
    content: [
      "Amounts arising from verified:",
      "• Fraud",
      "• Fake consultations",
      "• Duplicate credits",
      "• System errors",
      "• Payment manipulation",
      "• Invalid payments",
      "• Unauthorized transactions",
      "• Artificial consultation activity",
      "will not constitute legitimate Astrologer earnings.",
      "Vavi may reverse such amounts.",
    ],
  },

  {
    number: "26",
    title: "Duplicate Or Erroneous Credits",
    content: [
      "If an Astrologer is accidentally credited more than the amount legitimately payable because of a technical, operational, or calculation error, Vavi may correct the error.",
      "The excess amount may be adjusted against:",
      "• Pending balance",
      "• Future earnings",
      "• Future payouts",
      "The Astrologer must not knowingly exploit or withdraw duplicate credits created by a Platform error.",
    ],
  },

  {
    number: "27",
    title: "Taxes And Statutory Deductions",
    content: [
      "Astrologers remain responsible for their own tax and statutory obligations applicable to their earnings.",
      "Where required by applicable law, Vavi may deduct or withhold:",
      "• TDS",
      "• Taxes",
      "• Other statutory deductions",
      "The exact tax treatment may depend on applicable law and the Astrologer’s tax status.",
      "Vavi may request valid PAN, GST, or other tax information where required.",
    ],
  },

  {
    number: "28",
    title: "GST",
    content: [
      "Where GST or other indirect-tax obligations apply, the respective tax treatment shall be handled according to applicable law and the commercial structure applicable to the transaction.",
      "Astrologers who are independently required to obtain GST registration or issue tax documentation remain responsible for their applicable compliance obligations.",
      "Vavi may request GST details where relevant.",
    ],
  },

  {
    number: "29",
    title: "Payout Statement",
    content: [
      "Where supported by Platform functionality, Vavi may provide an earnings or payout statement showing information such as:",
      "• Consultation earnings",
      "• Vavi commission",
      "• Astrologer share",
      "• Refund adjustments",
      "• Chargeback adjustments",
      "• Tax deductions",
      "• Final payable amount",
      "• Payout status",
      "Astrologers should review their earnings information and promptly report material discrepancies.",
    ],
  },

  {
    number: "30",
    title: "Commission On Refunded Transactions",
    content: [
      "Where a transaction is completely reversed or refunded, the Vavi commission and Astrologer share associated with the refunded portion may be appropriately reversed or recalculated.",
      "Where only part of a transaction is refunded, the adjustment may be limited to the relevant refunded portion.",
    ],
  },

  {
    number: "31",
    title: "Partial Consultations",
    content: [
      "Where only part of a paid consultation is legitimately delivered, Vavi may determine the eligible consultation amount based on:",
      "• Actual consultation duration",
      "• Applicable billing method",
      "• Technical records",
      "• Refund decision",
      "• Other relevant information",
      "The corresponding 50:50 revenue share may then be applied to the final eligible amount.",
    ],
  },

  {
    number: "32",
    title: "Disconnected Consultations",
    content: [
      "A consultation being disconnected does not automatically make the entire transaction invalid.",
      "Vavi may consider:",
      "• Whether connection occurred",
      "• Consultation duration",
      "• Whether meaningful service was delivered",
      "• Cause of disconnection",
      "• Available technical records",
      "The eligible amount may be adjusted where appropriate.",
    ],
  },

  {
    number: "33",
    title: "Astrologer No-Show",
    content: [
      "Where an Astrologer accepts a paid consultation but fails to participate and the User receives no meaningful service, the consultation may be treated as non-delivered.",
      "No Astrologer earning may be payable for the undelivered portion.",
    ],
  },

  {
    number: "34",
    title: "User-Side Failure",
    content: [
      "Where the consultation fails solely because of circumstances attributable to the User, such as:",
      "• User intentionally disconnecting",
      "• User device failure",
      "• User network failure",
      "• Incorrect permissions",
      "• User abandoning the consultation",
      "the Astrologer’s legitimate earnings may remain eligible, depending on the circumstances and available Platform records.",
    ],
  },

  {
    number: "35",
    title: "Platform Technical Failure",
    content: [
      "Where a verified Vavi Platform failure materially prevents a paid consultation from being delivered, Vavi may adjust the relevant User charge and Astrologer earnings.",
      "Such adjustments will be based on the consultation actually delivered and the applicable Refund & Cancellation Policy.",
    ],
  },

  {
    number: "36",
    title: "Account Suspension",
    content: [
      "During an account suspension, Vavi may temporarily restrict:",
      "• New consultations",
      "• Earnings withdrawal",
      "• Payout processing",
      "• Certain account features",
      "Pending legitimate amounts may remain under review until the relevant issue is resolved.",
    ],
  },

  {
    number: "37",
    title: "Account Termination",
    content: [
      "Where an Astrologer account is terminated, Vavi may conduct a final financial reconciliation.",
      "The reconciliation may include:",
      "• Valid consultation earnings",
      "• Vavi commission",
      "• Refunds",
      "• Chargebacks",
      "• Fraud adjustments",
      "• Tax deductions",
      "• Pending payment disputes",
      "• Other legitimate adjustments",
      "Legitimate undisputed net earnings will be handled in accordance with Vavi’s applicable payout process and law.",
    ],
  },

  {
    number: "38",
    title: "Astrologer Voluntary Account Closure",
    content: [
      "An Astrologer who voluntarily closes their account remains subject to final settlement of:",
      "• Pending earnings",
      "• Refunds",
      "• Chargebacks",
      "• Tax deductions",
      "• Payment disputes",
      "• Other outstanding financial obligations",
      "Closing the account does not automatically eliminate valid financial adjustments arising from transactions completed before closure.",
    ],
  },

  {
    number: "39",
    title: "Fraud-Related Termination",
    content: [
      "Where an account is terminated for suspected fraud, Vavi may temporarily retain relevant amounts while completing a reasonable investigation.",
      "Amounts verified as arising from fraudulent or invalid activity will not be treated as legitimate earnings.",
      "Legitimate undisputed earnings unrelated to the violation will be handled according to applicable policy and law.",
    ],
  },

  {
    number: "40",
    title: "Commission Changes",
    content: [
      "The standard Vavi commission is currently:",
      "50% Vavi / 50% Astrologer.",
      "Vavi may modify the commission structure in the future where reasonably necessary for commercial, operational, regulatory, or Platform reasons.",
      "Any material change to the standard commission structure will be communicated through reasonable means, such as:",
      "• Astrologer App",
      "• Dashboard",
      "• Email",
      "• Platform notification",
      "• Other official communication",
      "A revised commission rate will ordinarily apply prospectively from the communicated effective date.",
      "Consultations already completed before the effective date will ordinarily remain subject to the commercial terms applicable when they occurred, unless otherwise required by law or expressly agreed.",
    ],
  },

  {
    number: "41",
    title: "Special Commercial Arrangements",
    content: [
      "Vavi may offer certain Astrologers different commercial arrangements based on:",
      "• Promotional campaigns",
      "• Performance programmes",
      "• Category",
      "• Service type",
      "• Temporary incentive",
      "• Other commercial arrangements",
      "Any such special arrangement must be communicated through an official Vavi channel.",
      "Unless such a different arrangement applies, the standard 50:50 revenue share applies.",
    ],
  },

  {
    number: "42",
    title: "Incentives And Bonuses",
    content: [
      "Vavi may introduce optional incentive or bonus programmes.",
      "These may have:",
      "• Eligibility requirements",
      "• Performance conditions",
      "• Validity periods",
      "• Minimum consultation requirements",
      "• Other disclosed conditions",
      "Bonuses and incentives are separate from normal consultation revenue unless expressly stated otherwise.",
    ],
  },

  {
    number: "43",
    title: "Platform Promotions",
    content: [
      "Vavi may offer discounts or promotions to Users.",
      "Where a promotion affects Astrologer earnings, the applicable earning treatment should be displayed or otherwise communicated to the Astrologer where reasonably practicable.",
      "Astrologers should not assume that every User discount will automatically reduce their share unless such treatment is communicated.",
    ],
  },

  {
    number: "44",
    title: "Payment Processors",
    content: [
      "Vavi may rely on third-party banks, payment gateways, payout providers, or financial infrastructure.",
      "Vavi is not responsible for delays caused solely by an independent third-party provider after Vavi has correctly initiated an eligible payout.",
    ],
  },

  {
    number: "45",
    title: "Payout Delays",
    content: [
      "Payouts may occasionally be delayed due to:",
      "• Banking holidays",
      "• Payment-provider outages",
      "• Technical failures",
      "• Bank processing delays",
      "• KYC issues",
      "• Regulatory checks",
      "• Fraud investigations",
      "• Incorrect payout details",
      "• Force majeure events",
      "Vavi will make reasonable efforts to process legitimate eligible payouts according to its applicable payout system.",
    ],
  },

  {
    number: "46",
    title: "Currency",
    content: [
      "Unless expressly stated otherwise, amounts displayed in the Vavi Platform for India may be denominated in Indian Rupees (INR).",
    ],
  },

  {
    number: "47",
    title: "Record Keeping",
    content: [
      "Vavi may maintain financial and transaction records relating to:",
      "• Consultation earnings",
      "• Commission",
      "• Payouts",
      "• Refunds",
      "• Chargebacks",
      "• Taxes",
      "• Adjustments",
      "• Payment disputes",
      "for legitimate accounting, audit, fraud-prevention, dispute-resolution, and legal-compliance purposes.",
    ],
  },

  {
    number: "48",
    title: "Audit And Verification",
    content: [
      "Vavi may review relevant Platform records to verify earnings and payouts.",
      "Such records may include:",
      "• Consultation IDs",
      "• Chat duration",
      "• Call duration",
      "• Payment transactions",
      "• Wallet ledger information",
      "• Refund records",
      "• Chargeback records",
      "• Technical logs",
      "• Fraud indicators",
      "The Platform’s verified transaction records may be used for reconciliation, subject to applicable law and correction of demonstrated errors.",
    ],
  },

  {
    number: "49",
    title: "Payout Disputes",
    content: [
      "If an Astrologer believes there is a genuine payout or commission-calculation error, the Astrologer should contact Vavi support with the relevant:",
      "• Consultation ID",
      "• Transaction details",
      "• Payout reference",
      "• Date",
      "• Amount",
      "• Description of the issue",
      "Vavi may investigate the discrepancy using Platform and payment records.",
    ],
  },

  {
    number: "50",
    title: "No Manipulation Of Payout Disputes",
    content: [
      "Astrologers must not knowingly submit:",
      "• Fake transaction evidence",
      "• Manipulated screenshots",
      "• False payout claims",
      "• Duplicate payment claims",
      "• Fraudulent earning claims",
      "Good-faith disputes will not be treated as misconduct merely because Vavi ultimately determines that no additional amount is payable.",
    ],
  },

  {
    number: "51",
    title: "Platform Display Errors",
    content: [
      "An accidental display error in the dashboard does not automatically create an entitlement to an incorrect amount.",
      "Where a clearly erroneous figure is displayed because of a technical problem, Vavi may correct the record based on the underlying verified transaction data.",
      "Likewise, Vavi should correct genuine under-crediting where verified.",
    ],
  },

  {
    number: "52",
    title: "Policy Changes",
    content: [
      "Vavi may update this Policy from time to time.",
      "Material changes may be communicated through:",
      "• App notification",
      "• Dashboard",
      "• Email",
      "• Website notice",
      "• Other reasonable means",
      "The updated Policy will state its effective date.",
    ],
  },

  {
    number: "53",
    title: "Relationship With Other Vavi Policies",
    content: [
      "This Policy should be read together with:",
      "• Vavi Astrologer / Partner Agreement",
      "• Vavi Terms and Conditions",
      "• Vavi Refund & Cancellation Policy",
      "• Vavi Privacy Policy",
      "• Vavi EULA",
      "• Community Guidelines / Acceptable Use Policy",
      "Where there is a specific issue concerning Astrologer earnings, commission, or payouts, this Policy should ordinarily govern that financial issue, subject to mandatory applicable law.",
    ],
  },

  {
    number: "54",
    title: "Electronic Acceptance",
    content: [
      "No physical signature is required.",
      "This Policy may be accepted electronically by:",
      "• Clicking “I Agree”",
      "• Clicking “Accept & Continue”",
      "• Completing Astrologer onboarding",
      "• Accepting consultations after this Policy has been presented",
      "• Continuing to use the Astrologer Platform.",
    ],
  },

  {
    number: "55",
    title: "Governing Law And Disputes",
    content: [
      "This Policy shall be interpreted in accordance with applicable laws of India.",
      "Where a payout or commission dispute arises, the parties should first make reasonable efforts to resolve the matter through Vavi’s internal support or grievance process.",
      "Any unresolved dispute may thereafter be handled in accordance with the dispute-resolution provisions contained in the applicable Vavi Terms and Conditions or Astrologer / Partner Agreement.",
    ],
  },

  {
    number: "56",
    title: "Contact",
    content: [
      "For questions regarding earnings, payouts, commissions, or payout disputes:",
      "Ascendant Vavi LLP",
      "Brand: Vavi",
      "Website: theVavi.com",
      "General Email: info@theVavi.com",
      "Legal/Grievance Email: legal@theVavi.com",
      "Registered Office:",
      "S1 - SF-232, CLOUD-9,",
      "Vaishali, Ghaziabad, U.P.",
      "© 2026 Ascendant Vavi LLP. All Rights Reserved.",
    ],
  },
];

/* =========================================================
   POLICY SECTION
========================================================= */

const PolicySection = ({ item }) => {
  return (
    <View style={styles.policyCard}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>

      <View style={styles.policyContent}>
        <Text style={styles.policyTitle}>{item.title}</Text>

        {item.content.map((line, index) => {
          const isBullet = line.trim().startsWith("•");

          return (
            <View
              key={`${item.number}-${index}`}
              style={isBullet ? styles.bulletRow : styles.paragraphRow}
            >
              {isBullet && <View style={styles.orangeDot} />}

              <Text
                style={[
                  styles.policyParagraph,
                  isBullet && styles.bulletText,
                ]}
              >
                {isBullet ? line.replace(/^•\s*/, "") : line}
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

export default function Payout_policy() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>

        {/* HEADER */}
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
            <Text style={styles.headerTitle}>
              Payout Policy
            </Text>
          </View>

          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >

          {/* HERO ICON */}
          <View style={styles.heroIconContainer}>
            <View style={styles.heroIconCircle}>
              <Ionicons
                name="wallet-outline"
                size={RF(34)}
                color={ORANGE}
              />
            </View>
          </View>

          {/* TITLE */}
          <Text style={styles.mainTitle}>
            Payout & Commission Policy
          </Text>

          <Text style={styles.mainSubtitle}>
            Understand how Astrologer earnings, commissions,
            payouts, adjustments and payment disputes are handled
            on Vavi.
          </Text>

          {/* ABOUT CARD */}
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
                About This Policy
              </Text>
            </View>

            <Text style={styles.aboutText}>
              This Policy explains how Astrologer earnings are
              calculated, how Vavi commission and revenue sharing
              work, when payouts are processed, and how refunds,
              chargebacks and other adjustments can affect
              earnings.
            </Text>

            <Text style={styles.aboutText}>
              The standard revenue-sharing arrangement stated in
              the policy is 50% Vavi and 50% Astrologer for
              eligible paid consultations.
            </Text>
          </View>

          {/* IMPORTANT CARD */}
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
                Payouts are subject to applicable verification,
                reconciliation, refunds, chargebacks, deductions,
                payout holds, banking/payment-provider processing
                and other applicable adjustments.
              </Text>
            </View>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryGrid}>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="percent-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                50 : 50
              </Text>

              <Text style={styles.summaryText}>
                Standard Vavi / Astrologer revenue share.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                7th–10th
              </Text>

              <Text style={styles.summaryText}>
                Ordinary monthly payout window.
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
                Verification may be required before payout.
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="sync-outline"
                  size={RF(21)}
                  color={ORANGE}
                />
              </View>

              <Text style={styles.summaryTitle}>
                Adjustments
              </Text>

              <Text style={styles.summaryText}>
                Refunds and chargebacks can affect earnings.
              </Text>
            </View>

          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />

            <Text style={styles.sectionHeaderText}>
              PAYOUT POLICY
            </Text>

            <View style={styles.sectionLine} />
          </View>

          {/* ALL 56 SECTIONS */}
          {PAYOUT_DATA.map((item) => (
            <PolicySection
              key={item.number}
              item={item}
            />
          ))}

          {/* CONTACT CARD */}
          <View style={styles.contactCard}>

            <View style={styles.contactIconCircle}>
              <Ionicons
                name="mail-outline"
                size={RF(30)}
                color={WHITE}
              />
            </View>

            <Text style={styles.contactTitle}>
              Questions About Your Payout?
            </Text>

            <Text style={styles.contactDescription}>
              For questions regarding earnings, payouts,
              commissions or payout disputes, contact Vavi
              through the official contact details below and
              include the relevant transaction details.
            </Text>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <Ionicons
                name="mail-outline"
                size={RF(19)}
                color={ORANGE}
              />

              <Text style={styles.contactEmail}>
                info@theVavi.com
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons
                name="scale-outline"
                size={RF(19)}
                color={ORANGE}
              />

              <Text style={styles.contactEmail}>
                legal@theVavi.com
              </Text>
            </View>

            <View style={styles.companyBox}>
              <Text style={styles.companyName}>
                Ascendant Vavi LLP
              </Text>

              <Text style={styles.companyInfo}>
                Brand: Vavi{"\n"}
                Website: theVavi.com{"\n"}
                Registered Office: S1 - SF-232, CLOUD-9,
                Vaishali, Ghaziabad, U.P.
              </Text>
            </View>

          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Ionicons
              name="wallet-outline"
              size={RF(18)}
              color={ORANGE}
            />

            <Text style={styles.footerText}>
              © 2026 Ascendant Vavi LLP. All Rights Reserved.
            </Text>
          </View>

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
    borderRadius: 22,
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
    justifyContent: "center",
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

  /* SECTION HEADER */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    marginBottom: hp(1.8),
    paddingHorizontal: wp(1),
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

  policyParagraph: {
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  contactEmail: {
    fontSize: RF(13.5),
    fontFamily: Typography?.semiBold,
    color: WHITE,
    marginLeft: wp(3),
  },

  companyBox: {
    marginTop: hp(1),
    paddingTop: hp(1.8),
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },

  companyName: {
    fontSize: RF(14),
    fontFamily: Typography?.semiBold,
    color: WHITE,
    marginBottom: hp(0.5),
  },

  companyInfo: {
    fontSize: RF(12.5),
    fontFamily: Typography?.regular,
    color: "#C8C8C8",
    lineHeight: RF(19),
  },

  /* FOOTER */

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.5),
    paddingHorizontal: wp(4),
  },

  footerText: {
    fontSize: RF(11.5),
    fontFamily: Typography?.regular,
    color: MUTED,
    marginLeft: wp(2),
    textAlign: "center",
  },
});