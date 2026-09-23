import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

const HOURS_24 = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export default function TimePickerModal({
  visible,
  onClose,
  onSelectTime,
  initialTime,
}) {
  const [selectedHour, setSelectedHour] = useState("06");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [activeTab, setActiveTab] = useState("hour"); // "hour" | "minute"

  useEffect(() => {
    if (initialTime && /^\d{1,2}:\d{2}(:\d{2})?$/.test(initialTime.trim())) {
      const parts = initialTime.trim().split(":");
      const h = String(Number(parts[0])).padStart(2, "0");
      const m = (parts[1] || "00").padStart(2, "0");

      setSelectedHour(h);
      setSelectedMinute(m);
    } else {
      setSelectedHour("06");
      setSelectedMinute("30");
    }
    setActiveTab("hour");
  }, [visible, initialTime]);

  const handleConfirm = () => {
    const formatted24Hour = `${selectedHour}:${selectedMinute}:00`;
    onSelectTime(formatted24Hour);
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
            <Text style={styles.headerTitle}>Select Birth Time</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={RF(22)} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Time Display */}
          <View style={styles.timeDisplayRow}>
            <View style={styles.timeDigitsBox}>
              <TouchableOpacity
                style={[
                  styles.timeSegment,
                  activeTab === "hour" && styles.activeTimeSegment,
                ]}
                onPress={() => setActiveTab("hour")}
              >
                <Text
                  style={[
                    styles.timeDisplayText,
                    activeTab === "hour" && styles.activeTimeDisplayText,
                  ]}
                >
                  {selectedHour}
                </Text>
                <Text style={styles.segmentLabel}>Hour (24h)</Text>
              </TouchableOpacity>

              <Text style={styles.colonText}>:</Text>

              <TouchableOpacity
                style={[
                  styles.timeSegment,
                  activeTab === "minute" && styles.activeTimeSegment,
                ]}
                onPress={() => setActiveTab("minute")}
              >
                <Text
                  style={[
                    styles.timeDisplayText,
                    activeTab === "minute" && styles.activeTimeDisplayText,
                  ]}
                >
                  {selectedMinute}
                </Text>
                <Text style={styles.segmentLabel}>Minute</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs switch */}
          <View style={styles.tabSwitchContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "hour" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("hour")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "hour" && styles.activeTabButtonText,
                ]}
              >
                Hours (00 - 23)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "minute" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("minute")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "minute" && styles.activeTabButtonText,
                ]}
              >
                Minutes (00 - 59)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid Selection */}
          <View style={styles.gridContainer}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.gridContent}
            >
              {activeTab === "hour"
                ? HOURS_24.map((hour) => {
                    const isSelected = selectedHour === hour;
                    return (
                      <TouchableOpacity
                        key={`hour-${hour}`}
                        style={[
                          styles.gridItem,
                          isSelected && styles.selectedGridItem,
                        ]}
                        onPress={() => {
                          setSelectedHour(hour);
                          setActiveTab("minute"); // Auto-advance to minute
                        }}
                      >
                        <Text
                          style={[
                            styles.gridItemText,
                            isSelected && styles.selectedGridItemText,
                          ]}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : MINUTES.map((min) => {
                    const isSelected = selectedMinute === min;
                    return (
                      <TouchableOpacity
                        key={`min-${min}`}
                        style={[
                          styles.gridItem,
                          isSelected && styles.selectedGridItem,
                        ]}
                        onPress={() => {
                          setSelectedMinute(min);
                        }}
                      >
                        <Text
                          style={[
                            styles.gridItemText,
                            isSelected && styles.selectedGridItemText,
                          ]}
                        >
                          {min}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: wp(6),
  },
  container: {
    width: "100%",
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
  timeDisplayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  timeDigitsBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  timeSegment: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: wp(2.5),
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    minWidth: wp(19),
  },
  activeTimeSegment: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF5EC",
  },
  timeDisplayText: {
    fontSize: RF(24),
    fontWeight: "700",
    color: Colors.darkBrown,
  },
  activeTimeDisplayText: {
    color: Colors.primary,
  },
  segmentLabel: {
    fontSize: RF(10),
    color: "#888888",
    marginTop: hp(0.2),
  },
  colonText: {
    fontSize: RF(24),
    fontWeight: "700",
    color: Colors.darkBrown,
    marginHorizontal: wp(2),
    marginBottom: hp(1.5),
  },
  ampmContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: wp(2.5),
    padding: wp(0.8),
    marginLeft: wp(3),
  },
  ampmBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(2),
    alignItems: "center",
  },
  activeAmpmBtn: {
    backgroundColor: Colors.primary,
  },
  ampmText: {
    fontSize: RF(12),
    fontWeight: "700",
    color: "#777777",
  },
  activeAmpmText: {
    color: "#FFFFFF",
  },
  tabSwitchContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: wp(2),
    padding: wp(0.8),
    marginVertical: hp(1),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(0.8),
    alignItems: "center",
    borderRadius: wp(1.5),
  },
  activeTabButton: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButtonText: {
    fontSize: RF(12),
    fontWeight: "600",
    color: "#777777",
  },
  activeTabButtonText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  gridContainer: {
    height: hp(22),
    marginVertical: hp(0.5),
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: wp(2),
  },
  gridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: wp(2),
  },
  gridItem: {
    width: "22%",
    marginHorizontal: "1.5%",
    paddingVertical: hp(1.1),
    alignItems: "center",
    marginVertical: hp(0.4),
    borderRadius: wp(2),
    backgroundColor: "#F8F8F8",
  },
  selectedGridItem: {
    backgroundColor: Colors.primary,
  },
  gridItemText: {
    fontSize: RF(14),
    fontWeight: "600",
    color: Colors.darkBrown,
  },
  selectedGridItemText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: hp(1.5),
    paddingTop: hp(1.2),
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelBtn: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginRight: wp(2),
  },
  cancelText: {
    fontSize: RF(14),
    color: "#888888",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  confirmText: {
    fontSize: RF(14),
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
