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
import { INDIAN_PLACES } from "../../utils/cityCoordinates";

export default function StatePickerModal({
  visible,
  onClose,
  onSelectState,
  selectedState,
  title = "Select Birth Place / City",
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaces = INDIAN_PLACES.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item) => {
    onSelectState(item.name, item);
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
            <Ionicons
              name="search"
              size={RF(18)}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search City or State (e.g. Delhi, Mumbai)..."
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

          {/* Place List */}
          <FlatList
            data={filteredPlaces}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            showsVerticalScrollIndicator={true}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={RF(30)} color="#CCCCCC" />
                <Text style={styles.emptyText}>No city or state found</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isSelected =
                selectedState?.toLowerCase() === item.name.toLowerCase() ||
                selectedState?.toLowerCase() === item.state.toLowerCase();
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
                    <View style={styles.textColumn}>
                      <Text
                        style={[
                          styles.itemText,
                          isSelected && styles.selectedItemText,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {item.state !== item.name && (
                        <Text style={styles.subText}>{item.state}</Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={RF(20)}
                      color={Colors.primary}
                    />
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
    backgroundColor: "#F6F6F6",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3),
    height: hp(5.2),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: RF(13),
    color: Colors.darkBrown,
    paddingVertical: 0,
  },
  list: {
    marginTop: hp(0.5),
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F7",
    borderRadius: wp(1.5),
  },
  selectedItemRow: {
    backgroundColor: "#FFF5EC",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textColumn: {
    marginLeft: wp(3),
  },
  itemText: {
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "500",
  },
  subText: {
    fontSize: RF(11),
    color: "#888",
    marginTop: hp(0.1),
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(5),
  },
  emptyText: {
    marginTop: hp(1),
    fontSize: RF(13),
    color: "#999999",
  },
});
