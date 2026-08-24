# 💳 4. Wallet & Razorpay Payment Gateway Guide (User App & Astrologer App)

> **Target Platform**: React Native / Flutter / iOS / Android / Web Admin  
> **Backend Base URL**: `http://<your-server-domain>:5000/api`  

---

## 📌 Overview

This document contains the step-by-step implementation for **Wallet Balance**, **Passbook Statements**, **Razorpay Payment Gateway (User App)**, and **Bank Account Withdrawals (Astrologer App)**.

---

# SECTION A: 📱 USER APP IMPLEMENTATION (ONLINE RECHARGE & PASSBOOK)

### 🔹 Step 1: Check Wallet Balance & Passbook

- **Fetch Balance**: `GET /api/wallet/balance` (Headers: `Authorization: Bearer <userToken>`)
  - **Response**: `{ "balance": "1090.00", "totalCredit": "1500.00" }`
- **Fetch Passbook Statement**: `GET /api/wallet/transactions?page=1&limit=10`
  - **Response**: List of past recharges, call payments, and refunds.

### 🔹 Step 2: User Selects "Recharge ₹500"

- **Call API**: `POST /api/payment/create-order`
- **Body**: `{ "amount": 500 }`
- **Response**: Returns `orderId`, `amountInPaise`, `keyId`.

**Open Native Razorpay Payment Sheet**:
```javascript
import RazorpayCheckout from 'react-native-razorpay';

const options = {
  description: 'VAVI Wallet Recharge',
  currency: 'INR',
  key: keyId,
  amount: amountInPaise,
  name: 'VAVI Astrology',
  order_id: orderId,
  theme: { color: '#6200ee' }
};

RazorpayCheckout.open(options).then(async (data) => {
  // Verify Payment Signature & Credit Wallet
  const verifyRes = await axios.post(
    'http://<domain>:5000/api/payment/verify',
    {
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature,
      amount: 500
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  alert('🎉 Wallet Recharged! New Balance: ₹' + verifyRes.data.data.balance);
});
```

---

# SECTION B: 🔮 ASTROLOGER APP IMPLEMENTATION (EARNINGS & BANK WITHDRAWALS)

### 🔹 Step 1: Astrologer Checks Net Take-Home Earnings

- **Call API**: `GET /api/wallet/balance` (Headers: `Authorization: Bearer <astrologerToken>`)
- Displays Net Take-Home Earnings Balance (calculated after 18% GST & 50% Platform Commission deductions).

### 🔹 Step 2: Astrologer Submits Bank Payout Request

- **API Endpoint**: `POST /api/wallet/withdraw`
- **Headers**: `Authorization: Bearer <astrologerToken>`
- **Request Body**:
  ```json
  {
    "amount": 1000,
    "paymentMethod": "UPI",
    "paymentDetails": {
      "upiId": "rajesh@upi",
      "accountName": "Pandit Rajesh Sharma"
    }
  }
  ```
- **Response**: Returns withdrawal request object with status "pending".

### 🔹 Step 3: Astrologer Views Past Withdrawal History

- **Call API**: `GET /api/wallet/withdrawals`
- Displays list of past bank payout requests with status badges (`pending`, `approved`, `rejected`).
