import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useGetOffersQuery,
} from "../../redux/OfferApi";

const ORANGE = "#ff6a00";
const PURPLE = "#7c3aed";
const RED = "#ff2d2d";

export default function Offers() {
  const [offerType, setOfferType] = useState("call");

  const [showInfo, setShowInfo] = useState(false);

  const [discount, setDiscount] = useState("");

  // GET OFFERS

  const { data: offers = [], isLoading, refetch } = useGetOffersQuery();

  // CREATE OFFER

  const [createOffer, { isLoading: createLoading }] = useCreateOfferMutation();

  // DELETE OFFER

  const [deleteOffer] = useDeleteOfferMutation();

  const handleCreateOffer = async () => {
    if (!discount) {
      Alert.alert("Required", "Please enter discount");

      return;
    }

    try {
      await createOffer({
        type: offerType,

        discountType: "percentage",

        discountValue: Number(discount),
      }).unwrap();

      Alert.alert("Success", "Offer created successfully");

      setDiscount("");

      refetch();
    } catch (error) {
      console.log("CREATE OFFER ERROR", error);

      Alert.alert("Error", error?.data?.message || "Unable to create offer");
    }
  };

  const handleDeleteOffer = async (id) => {
    Alert.alert(
      "Delete Offer",

      "Are you sure you want to delete this offer?",

      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",

          style: "destructive",

          onPress: async () => {
            try {
              await deleteOffer(id).unwrap();

              refetch();
            } catch (error) {
              console.log("DELETE OFFER ERROR", error);

              Alert.alert("Error", "Unable to delete offer");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create New Offer</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowInfo((prev) => !prev)}
        >
          <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {showInfo && (
        <View style={styles.infoDropdown}>
          <View style={styles.infoDropdownIcon}>
            <Ionicons name="pricetag-outline" size={RF(20)} color={ORANGE} />
          </View>
          <Text style={styles.infoDropdownText}>
            Create discount offers on your call or chat sessions{"\n"}to attract
            more clients.
          </Text>
        </View>
      )}

      <FlatList
        data={[]}
        keyExtractor={() => "offers-list"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={null}
        ListHeaderComponent={
          <>
            <View style={styles.createCard}>
              <Text style={styles.label}>Offer Type</Text>

              <View style={styles.typeRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.typeCard,
                    offerType === "call" && styles.activeCallCard,
                  ]}
                  onPress={() => setOfferType("call")}
                >
                  {offerType === "call" && (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={RF(11)} color="#fff" />
                    </View>
                  )}

                  <View style={styles.callIcon}>
                    <Ionicons name="call" size={RF(22)} color="#fff" />
                  </View>

                  <Text style={styles.typeText}>Call Offer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.typeCard,
                    offerType === "chat" && styles.activeChatCard,
                  ]}
                  onPress={() => setOfferType("chat")}
                >
                  {offerType === "chat" && (
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: PURPLE,
                        },
                      ]}
                    >
                      <Ionicons name="checkmark" size={RF(11)} color="#fff" />
                    </View>
                  )}

                  <View style={styles.chatIcon}>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={RF(22)}
                      color="#fff"
                    />
                  </View>

                  <Text style={styles.typeText}>Chat Offer</Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.label,
                  {
                    marginTop: hp(2.2),
                  },
                ]}
              >
                Discount
              </Text>

              <View style={styles.inputBox}>
                <View style={styles.percentBox}>
                  <Text style={styles.percentText}>%</Text>

                  <Ionicons name="chevron-down" size={RF(13)} color="#6b7280" />
                </View>

                <TextInput
                  placeholder="Enter discount"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={discount}
                  onChangeText={setDiscount}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleCreateOffer}
                disabled={createLoading}
              >
                <Text style={styles.createText}>
                  {createLoading ? "Creating..." : "Create Offer"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.offersCard}>
              <Text style={styles.sectionTitle}>Your Offers</Text>

              {offers.length === 0 ? (
                <Text style={styles.emptyOffersText}>
                  You haven't created any offers yet.
                </Text>
              ) : (
                offers.map((item) => (
                  <OfferItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteOffer}
                  />
                ))
              )}

              <View style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <Ionicons name="bulb-outline" size={RF(20)} color={ORANGE} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.tipTitle}>Tip</Text>
                  <Text style={styles.tipText}>
                    More aggressive offers attract more clients.
                  </Text>
                </View>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const OfferItem = ({ item, onDelete }) => {
  return (
    <View style={styles.offerCard}>
      <View style={styles.offerTop}>
        <View
          style={[
            styles.offerIcon,
            {
              backgroundColor: item.type === "call" ? "#fff1e8" : "#f3e8ff",
            },
          ]}
        >
          <Ionicons
            name={item.type === "call" ? "call" : "chatbubble-ellipses"}
            size={RF(20)}
            color={item.type === "call" ? ORANGE : PURPLE}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.offerTitle}>
            {item.type === "call" ? "Call Offer" : "Chat Offer"}
          </Text>

          <Text style={styles.offerDiscount}>{item.discountValue}% OFF</Text>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={RF(18)} color={RED} />
        </TouchableOpacity>
      </View>

      <View style={styles.offerBottom}>
        <View style={styles.statusRow}>
          <View style={styles.activeDot} />

          <Text style={styles.activeText}>Active</Text>
        </View>

        <Text style={styles.dateText}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,

    backgroundColor: "#fff",
  },

  header: {
    height: hp(6.5),

    backgroundColor: "#fff",

    paddingHorizontal: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#1f2937",

    fontSize: RF(18),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  helpButton: {
    marginLeft: "auto",
  },

  infoDropdown: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(0.5),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  infoDropdownIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  infoDropdownText: {
    flex: 1,
    fontSize: RF(10.5),
    color: "#4b5563",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  list: {
    paddingHorizontal: wp(4),

    paddingBottom: hp(5),
  },

  createCard: {
    marginTop: hp(2),

    backgroundColor: "#fff",

    borderRadius: wp(4),

    padding: wp(3.2),

    borderWidth: 1,

    borderColor: "#f2e6da",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  label: {
    fontSize: RF(16),

    color: "#374151",

    fontWeight: "800",

    fontFamily: Typography?.bold,

    marginBottom: hp(1),
  },

  typeRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  typeCard: {
    width: wp(42),

    height: hp(12),

    borderRadius: wp(3),

    borderWidth: 1,

    borderColor: "#eee",

    alignItems: "center",

    justifyContent: "center",

    position: "relative",
  },

  activeCallCard: {
    borderColor: ORANGE,

    backgroundColor: "#fff8f2",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  activeChatCard: {
    borderColor: PURPLE,

    backgroundColor: "#faf5ff",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  checkCircle: {
    position: "absolute",

    right: wp(2),

    top: hp(1),

    width: RF(18),

    height: RF(18),

    borderRadius: RF(9),

    backgroundColor: ORANGE,

    alignItems: "center",

    justifyContent: "center",
  },

  callIcon: {
    width: wp(10),

    height: wp(10),

    borderRadius: wp(5),

    backgroundColor: ORANGE,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: hp(0.7),
  },

  chatIcon: {
    width: wp(10),

    height: wp(10),

    borderRadius: wp(5),

    backgroundColor: PURPLE,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: hp(0.7),
  },

  typeText: {
    fontSize: RF(14),

    color: "#111827",

    fontWeight: "700",

    fontFamily: Typography?.bold,
  },

  inputBox: {
    height: hp(6),

    borderWidth: 1,

    borderColor: "#eadfd5",

    borderRadius: wp(2),

    flexDirection: "row",

    alignItems: "center",

    overflow: "hidden",
  },

  percentBox: {
    width: wp(18),

    height: "100%",

    backgroundColor: "#f8fafc",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: wp(1),

    borderRightWidth: 1,

    borderColor: "#eee",
  },

  percentText: {
    fontSize: RF(11.5),

    color: "#374151",

    fontWeight: "800",

    fontFamily: Typography?.bold,
  },

  input: {
    flex: 1,

    paddingHorizontal: wp(2.5),

    fontSize: RF(14),

    color: "#111827",

    fontWeight: "700",

    fontFamily: Typography?.bold,
  },

  createBtn: {
    marginTop: hp(2),

    height: hp(6),

    borderRadius: wp(3),

    backgroundColor: ORANGE,

    alignItems: "center",

    justifyContent: "center",
  },

  createText: {
    color: "#fff",

    fontSize: RF(16),

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  offersCard: {
    marginTop: hp(2),

    backgroundColor: "#fff",

    borderRadius: wp(4),

    padding: wp(3.2),

    borderWidth: 1,

    borderColor: "#f2e6da",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  tipCard: {
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3),
    flexDirection: "row",
    alignItems: "center",
  },

  tipIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  tipTitle: {
    fontSize: RF(11),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  tipText: {
    fontSize: RF(10.5),
    color: "#4b5563",
    marginTop: hp(0.2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  sectionTitle: {
    marginBottom: hp(1),

    fontSize: RF(16),

    color: "#111827",

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  emptyOffersText: {
    fontSize: RF(11),

    color: "#6b7280",

    fontWeight: "700",

    fontFamily: Typography?.bold,

    textAlign: "center",

    paddingVertical: hp(2),
  },

  offerCard: {
    backgroundColor: "#fff",

    borderRadius: wp(3),

    padding: wp(2.5),

    borderWidth: 1,

    borderColor: "#f1e8df",

    marginBottom: hp(1.5),

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  offerTop: {
    flexDirection: "row",

    alignItems: "center",
  },

  offerIcon: {
    width: wp(11),

    height: wp(11),

    borderRadius: wp(5.5),

    alignItems: "center",

    justifyContent: "center",

    marginRight: wp(3),
  },

  offerTitle: {
    fontSize: RF(13),

    color: "#111827",

    fontWeight: "900",

    fontFamily: Typography?.bold,
  },

  offerDiscount: {
    fontSize: RF(14),

    color: ORANGE,

    fontWeight: "900",

    fontFamily: Typography?.bold,

    marginTop: hp(0.3),
  },

  deleteBtn: {
    width: wp(9),

    height: wp(9),

    borderRadius: wp(4.5),

    backgroundColor: "#fff0f0",

    alignItems: "center",

    justifyContent: "center",
  },

  offerBottom: {
    marginTop: hp(1.5),

    paddingTop: hp(1),

    borderTopWidth: 1,

    borderColor: "#eee",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  statusRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  activeDot: {
    width: wp(2),

    height: wp(2),

    borderRadius: wp(1),

    backgroundColor: "#22c55e",

    marginRight: wp(1),
  },

  activeText: {
    fontSize: RF(9.5),

    color: "#22c55e",

    fontWeight: "800",

    fontFamily: Typography?.bold,
  },

  dateText: {
    fontSize: RF(9.5),

    color: "#6b7280",

    fontWeight: "700",

    fontFamily: Typography?.bold,
  },
});
