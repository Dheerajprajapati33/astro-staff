import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function StatePickerModal({
  visible,
  onClose,
  onSelectState,
  selectedState,
  title = "Select Birth Place / State",
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = INDIAN_STATES_AND_UTS.filter((st) =>
    st.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleSelect = (st) => {
    onSelectState(st);
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                onClose();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={RF(22)} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={RF(18)} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search State or UT..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={RF(16)} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* State List */}
          <FlatList
            data={filteredStates}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={true}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={RF(30)} color="#CCCCCC" />
                <Text style={styles.emptyText}>No state found</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isSelected = selectedState?.toLowerCase() === item.toLowerCase();
              return (
                <TouchableOpacity
                  style={[styles.itemRow, isSelected && styles.selectedItemRow]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemLeft}>
                    <Ionicons
                      name="location-outline"
                      size={RF(18)}
                      color={isSelected ? Colors.primary : "#888888"}
                    />
                    <Text
                      style={[styles.itemText, isSelected && styles.selectedItemText]}
                    >
                      {item}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={RF(20)} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  container: {
    width: "100%",
    maxHeight: hp(75),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(4),
    padding: wp(4.5),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: RF(16),
    fontWeight: "700",
    color: Colors.darkBrown,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    marginVertical: hp(1.5),
    borderWidth: 1,
    borderColor: "#EAEAEA",
    height: hp(5.5),
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: RF(14),
    color: Colors.darkBrown,
    paddingVertical: 0,
  },
  list: {
    maxHeight: hp(50),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    borderRadius: wp(2),
  },
  selectedItemRow: {
    backgroundColor: "#FFF7F0",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: RF(14),
    color: Colors.darkBrown,
    marginLeft: wp(3),
    fontWeight: "500",
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: hp(4),
  },
  emptyText: {
    fontSize: RF(14),
    color: "#999999",
    marginTop: hp(1),
  },
});

