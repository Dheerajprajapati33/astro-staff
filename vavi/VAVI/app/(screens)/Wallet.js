import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";

import TransactionCard from "../../components/wallet/TransactionCard";
import TransactionHeader from "../../components/wallet/TransactionHeader";
import WalletBalanceCard from "../../components/wallet/WalletBalanceCard";
import WalletBottomBanner from "../../components/wallet/WalletBottomBanner";
import WalletHeader from "../../components/wallet/WalletHeader";
import WalletTabs from "../../components/wallet/WalletTabs";

import {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
} from "../../redux/walletApi";import { hp, RF } from "../../utils/responsive";

export default function Wallet() {
  // ==========================
  // GET BALANCE API
  // ==========================

  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useGetWalletBalanceQuery();

  // ==========================
  // GET TRANSACTIONS API
  // ==========================

  const {
    data: transactionData,

    isLoading: transactionLoading,

    refetch: refetchTransactions,
  } = useGetWalletTransactionsQuery({
    page: 1,

    limit: 10,
  });

  const balance = balanceData?.data?.balance || "0.00";

  const transactions = transactionData?.data?.transactions || [];

  const loading = balanceLoading || transactionLoading;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <WalletHeader />

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => <TransactionCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={loading}
        onRefresh={() => {
          refetchBalance();

          refetchTransactions();
        }}
        ListHeaderComponent={
          <>
            {balanceLoading ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <WalletBalanceCard balance={balance} />
            )}

            <WalletTabs />

            <WalletBottomBanner />

            <TransactionHeader />
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background || "#FFF8F4",
  },

  content: {
    paddingBottom: hp(3),
  },

  loaderBox: {
    height: hp(12),

    justifyContent: "center",

    alignItems: "center",
  },

  emptyBox: {
    height: hp(20),

    justifyContent: "center",

    alignItems: "center",
  },

  emptyText: {
    color: Colors.textGray,

    fontSize: RF(14),

    fontWeight: "400",
  },
});
