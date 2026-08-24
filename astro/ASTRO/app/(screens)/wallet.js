// astro/ASTRO/app/(screens)/wallet.js
// Net Take-Home Earnings & Bank/UPI Payout Management Screen for Astrologer App

import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { hp, RF, wp } from "../../utils/responsive";
import WithdrawModal from "../../components/wallet/WithdrawModal";
import {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useGetWithdrawalsQuery,
  useRequestWithdrawalMutation,
} from "../../redux/walletApi";

const ORANGE = "#ff6a00";
const GREEN = "#22a855";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("transactions"); // "transactions" | "withdrawals"
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  // RTK Query API Hooks
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGetWalletBalanceQuery();

  const {
    data: transactionsData,
    isLoading: isTxLoading,
    isFetching: isTxFetching,
    refetch: refetchTx,
  } = useGetWalletTransactionsQuery({ page: 1, limit: 20 });

  const {
    data: withdrawalsData,
    isLoading: isWithLoading,
    refetch: refetchWithdrawals,
  } = useGetWithdrawalsQuery();

  const [requestWithdrawal] = useRequestWithdrawalMutation();

  const balance = Number(balanceData?.data?.balance ?? balanceData?.balance ?? 0);
  const totalCredit = Number(balanceData?.data?.totalCredit ?? balanceData?.totalCredit ?? balance);

  const rawTx = Array.isArray(transactionsData?.data?.transactions)
    ? transactionsData.data.transactions
    : Array.isArray(transactionsData?.transactions)
    ? transactionsData.transactions
    : Array.isArray(transactionsData?.data)
    ? transactionsData.data
    : [];

  const rawWithdrawals = Array.isArray(withdrawalsData?.data?.withdrawals)
    ? withdrawalsData.data.withdrawals
    : Array.isArray(withdrawalsData?.withdrawals)
    ? withdrawalsData.withdrawals
    : Array.isArray(withdrawalsData?.data)
    ? withdrawalsData.data
    : [];

  const handleRefreshAll = () => {
    refetchBalance();
    refetchTx();
    refetchWithdrawals();
  };

  const handleWithdrawSubmit = async (payload) => {
    return await requestWithdrawal(payload).unwrap();
  };

  const formatStatus = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "approved":
      case "completed":
        return { label: "APPROVED", bg: "#E8F8EE", color: "#2E7D32", icon: "checkmark-circle" };
      case "rejected":
        return { label: "REJECTED", bg: "#FEECEB", color: "#D32F2F", icon: "close-circle" };
      default:
        return { label: "PENDING", bg: "#FFF4E5", color: ORANGE, icon: "time-outline" };
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr || "Recent";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings & Wallet</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={handleRefreshAll}>
          <Ionicons name="refresh-outline" size={RF(20)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isTxFetching}
            onRefresh={handleRefreshAll}
            tintColor={ORANGE}
            colors={[ORANGE]}
          />
        }
      >
        {/* Net Take-Home Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsTopRow}>
            <View>
              <Text style={styles.balanceLabel}>Net Take-Home Balance</Text>
              <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
              <Text style={styles.subtext}>
                (Calculated after 18% GST & 50% Platform Commission)
              </Text>
            </View>
            <View style={styles.walletIconWrap}>
              <Ionicons name="wallet" size={RF(28)} color={ORANGE} />
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Action Row */}
          <View style={styles.cardActionRow}>
            <View style={styles.lifetimeBlock}>
              <Text style={styles.lifetimeLbl}>Total Gross Earnings</Text>
              <Text style={styles.lifetimeVal}>₹{totalCredit.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => setWithdrawModalVisible(true)}
              activeOpacity={0.88}
            >
              <Ionicons name="arrow-down-circle" size={RF(16)} color="#fff" />
              <Text style={styles.withdrawBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Switcher: Transactions vs Withdrawals */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.switchTab, activeTab === "transactions" && styles.switchTabActive]}
            onPress={() => setActiveTab("transactions")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="receipt-outline"
              size={RF(15)}
              color={activeTab === "transactions" ? "#fff" : "#666"}
            />
            <Text style={[styles.switchTabText, activeTab === "transactions" && styles.switchTabTextActive]}>
              Earnings Passbook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchTab, activeTab === "withdrawals" && styles.switchTabActive]}
            onPress={() => setActiveTab("withdrawals")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="business-outline"
              size={RF(15)}
              color={activeTab === "withdrawals" ? "#fff" : "#666"}
            />
            <Text style={[styles.switchTabText, activeTab === "withdrawals" && styles.switchTabTextActive]}>
              Payout Requests ({rawWithdrawals.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ====================================================
            TAB 1: TRANSACTIONS / PASSBOOK
            ==================================================== */}
        {activeTab === "transactions" && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Consultation Earnings & Deductions</Text>

            {isTxLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={ORANGE} />
                <Text style={styles.loadingText}>Loading transactions...</Text>
              </View>
            ) : rawTx.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="receipt-outline" size={RF(36)} color="#CCC" />
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptySub}>
                  Earnings from your calls, chats, and live sessions will appear here.
                </Text>
              </View>
            ) : (
              rawTx.map((item, idx) => {
                const clientName = item?.user?.name || item?.userName || item?.clientName || "Client";
                const amount = item?.amount || item?.grossAmount || 0;
                const netAmount = item?.netAmount || item?.takeHome || (Number(amount) * 0.41).toFixed(2);
                const type = (item?.type || item?.consultationType || "consultation").toLowerCase();
                const createdAt = item?.createdAt || item?.date;

                return (
                  <View key={item?.id || idx} style={styles.txCard}>
                    <View style={styles.txHeader}>
                      <View style={styles.clientAvatar}>
                        <Text style={styles.avatarInitial}>{clientName[0]?.toUpperCase() || "C"}</Text>
                      </View>
                      <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{clientName}</Text>
                        <Text style={styles.txDate}>{formatDate(createdAt)}</Text>
                      </View>
                      <View style={styles.amountBadge}>
                        <Text style={styles.amountNetText}>+ ₹{netAmount}</Text>
                        <Text style={styles.netTag}>Net Take-Home</Text>
                      </View>
                    </View>

                    <View style={styles.deductionRow}>
                      <View style={styles.deductItem}>
                        <Text style={styles.deductLbl}>Gross Client Pay</Text>
                        <Text style={styles.deductVal}>₹{amount}</Text>
                      </View>
                      <View style={styles.deductItem}>
                        <Text style={styles.deductLbl}>GST (18%)</Text>
                        <Text style={[styles.deductVal, { color: "#E53935" }]}>
                          - ₹{(Number(amount) * 0.18).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.deductItem}>
                        <Text style={styles.deductLbl}>Platform (50%)</Text>
                        <Text style={[styles.deductVal, { color: "#FB8C00" }]}>
                          - ₹{(Number(amount) * 0.41).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ====================================================
            TAB 2: WITHDRAWALS / PAYOUT REQUESTS
            ==================================================== */}
        {activeTab === "withdrawals" && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Bank & UPI Payout History</Text>

            {isWithLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={ORANGE} />
                <Text style={styles.loadingText}>Loading payout requests...</Text>
              </View>
            ) : rawWithdrawals.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="business-outline" size={RF(36)} color="#CCC" />
                <Text style={styles.emptyTitle}>No Payout Requests</Text>
                <Text style={styles.emptySub}>
                  You haven't submitted any bank or UPI withdrawal requests yet.
                </Text>
                <TouchableOpacity
                  style={styles.emptyActionBtn}
                  onPress={() => setWithdrawModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.emptyActionText}>Request First Payout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              rawWithdrawals.map((w, idx) => {
                const statusInfo = formatStatus(w?.status);
                const reqAmount = w?.amount || 0;
                const method = w?.paymentMethod || "UPI";
                const upi = w?.paymentDetails?.upiId || w?.upiId;
                const acc = w?.paymentDetails?.accountNumber || w?.accountNumber;

                return (
                  <View key={w?.id || idx} style={styles.withdrawalCard}>
                    <View style={styles.withTopRow}>
                      <View>
                        <Text style={styles.withAmount}>₹{reqAmount}</Text>
                        <Text style={styles.withMethod}>
                          {method === "UPI" ? `UPI: ${upi || "Registered UPI"}` : `Bank A/C: ••••${acc?.slice(-4) || "Bank"}`}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon} size={RF(12)} color={statusInfo.color} />
                        <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.withDateRow}>
                      <Ionicons name="calendar-outline" size={RF(11)} color="#888" />
                      <Text style={styles.withDateText}>Requested: {formatDate(w?.createdAt)}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* Withdraw Modal */}
      <WithdrawModal
        visible={withdrawModalVisible}
        onClose={() => setWithdrawModalVisible(false)}
        balance={balance}
        onSubmitWithdrawal={handleWithdrawSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.5),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  backBtn: {
    padding: wp(1),
  },
  headerTitle: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#222",
  },
  historyBtn: {
    padding: wp(1),
  },
  scrollContent: {
    paddingHorizontal: wp(4.5),
    paddingTop: hp(2),
    paddingBottom: hp(6),
  },
  earningsCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4.5),
    padding: wp(4.5),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: hp(2),
  },
  earningsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: RF(12),
    fontWeight: "600",
    color: "#666",
  },
  balanceAmount: {
    fontSize: RF(24),
    fontWeight: "800",
    color: GREEN,
    marginVertical: hp(0.3),
  },
  subtext: {
    fontSize: RF(9.5),
    color: "#888",
    maxWidth: wp(60),
    lineHeight: RF(13),
  },
  walletIconWrap: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: hp(1.5),
  },
  cardActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lifetimeBlock: {},
  lifetimeLbl: {
    fontSize: RF(10.5),
    color: "#888",
  },
  lifetimeVal: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#333",
  },
  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(3),
    gap: wp(1.5),
  },
  withdrawBtnText: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
    borderRadius: wp(3),
    padding: wp(1),
    marginBottom: hp(2),
    gap: wp(1),
  },
  switchTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
    gap: wp(1.5),
  },
  switchTabActive: {
    backgroundColor: ORANGE,
  },
  switchTabText: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#555",
  },
  switchTabTextActive: {
    color: "#fff",
  },
  sectionWrap: {},
  sectionTitle: {
    fontSize: RF(13),
    fontWeight: "700",
    color: "#444",
    marginBottom: hp(1.2),
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: hp(4),
  },
  loadingText: {
    fontSize: RF(11.5),
    color: "#888",
    marginTop: hp(1),
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(6),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginTop: hp(1),
  },
  emptyTitle: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#444",
    marginTop: hp(1),
  },
  emptySub: {
    fontSize: RF(11),
    color: "#888",
    textAlign: "center",
    marginTop: hp(0.5),
    lineHeight: RF(16),
  },
  emptyActionBtn: {
    marginTop: hp(2),
    backgroundColor: ORANGE,
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
  },
  emptyActionText: {
    color: "#fff",
    fontSize: RF(11.5),
    fontWeight: "700",
  },
  txCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3.5),
    padding: wp(3.5),
    marginBottom: hp(1.4),
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  txHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: RF(14),
    fontWeight: "800",
    color: ORANGE,
  },
  clientInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  clientName: {
    fontSize: RF(13),
    fontWeight: "700",
    color: "#222",
  },
  txDate: {
    fontSize: RF(10),
    color: "#888",
    marginTop: hp(0.2),
  },
  amountBadge: {
    alignItems: "flex-end",
  },
  amountNetText: {
    fontSize: RF(13.5),
    fontWeight: "800",
    color: GREEN,
  },
  netTag: {
    fontSize: RF(8.5),
    color: "#888",
    fontWeight: "500",
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9FB",
    borderRadius: wp(2.5),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  deductItem: {},
  deductLbl: {
    fontSize: RF(9),
    color: "#888",
  },
  deductVal: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#444",
    marginTop: hp(0.1),
  },
  withdrawalCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3.5),
    padding: wp(3.5),
    marginBottom: hp(1.4),
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  withTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  withAmount: {
    fontSize: RF(16),
    fontWeight: "800",
    color: "#222",
  },
  withMethod: {
    fontSize: RF(11),
    color: "#666",
    marginTop: hp(0.2),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
    gap: wp(1),
  },
  statusBadgeText: {
    fontSize: RF(9.5),
    fontWeight: "800",
  },
  withDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    marginTop: hp(1),
    paddingTop: hp(0.8),
    borderTopWidth: 1,
    borderColor: "#F4F4F4",
  },
  withDateText: {
    fontSize: RF(10),
    color: "#888",
  },
});
