import React, { useEffect, useState } from "react";
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

// ==========================================
// 12-HOUR HOURS
// ==========================================

const HOURS_12 = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

// ==========================================
// MINUTES
// ==========================================

const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export default function TimePickerModal({
  visible,
  onClose,
  onSelectTime,
  initialTime,
}) {
  const [selectedHour, setSelectedHour] = useState("06");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("PM");

  const [activeTab, setActiveTab] = useState("hour");
  // "hour" | "minute"

  // ==========================================
  // CONVERT 24-HOUR TIME TO 12-HOUR UI
  // ==========================================

  useEffect(() => {
    if (
      initialTime &&
      /^\d{1,2}:\d{2}(:\d{2})?$/.test(
        initialTime.trim()
      )
    ) {
      const parts = initialTime.trim().split(":");

      const hour24 = Number(parts[0]);

      const minute = String(
        Number(parts[1] || "00")
      ).padStart(2, "0");

      let hour12;
      let period;

      // 00:xx -> 12:xx AM
      if (hour24 === 0) {
        hour12 = 12;
        period = "AM";
      }

      // 01:xx - 11:xx -> AM
      else if (hour24 < 12) {
        hour12 = hour24;
        period = "AM";
      }

      // 12:xx -> 12:xx PM
      else if (hour24 === 12) {
        hour12 = 12;
        period = "PM";
      }

      // 13:xx - 23:xx -> PM
      else {
        hour12 = hour24 - 12;
        period = "PM";
      }

      setSelectedHour(
        String(hour12).padStart(2, "0")
      );

      setSelectedMinute(minute);

      setSelectedPeriod(period);
    } else {
      // Default time
      setSelectedHour("06");
      setSelectedMinute("30");
      setSelectedPeriod("PM");
    }

    setActiveTab("hour");
  }, [visible, initialTime]);

  // ==========================================
  // CONVERT 12-HOUR TO 24-HOUR
  // ==========================================

  const convertTo24Hour = (
    hour12,
    minute,
    period
  ) => {
    let hour24 = Number(hour12);

    // AM
    if (period === "AM") {
      // 12 AM = 00
      if (hour24 === 12) {
        hour24 = 0;
      }
    }

    // PM
    else {
      // 01 PM - 11 PM
      if (hour24 !== 12) {
        hour24 += 12;
      }
    }

    return `${String(hour24).padStart(
      2,
      "0"
    )}:${minute}:00`;
  };

  // ==========================================
  // CONFIRM
  // ==========================================

  const handleConfirm = () => {
    const formatted24Hour = convertTo24Hour(
      selectedHour,
      selectedMinute,
      selectedPeriod
    );

    console.log(
      "================================"
    );

    console.log(
      "Selected UI Time:",
      `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    );

    console.log(
      "Converted API Time:",
      formatted24Hour
    );

    console.log(
      "================================"
    );

    // IMPORTANT:
    // Parent receives 24-hour format
    //
    // 05:30 AM -> 05:30:00
    // 05:30 PM -> 17:30:00
    // 12:00 AM -> 00:00:00
    // 12:00 PM -> 12:00:00

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

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Select Birth Time
            </Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Ionicons
                name="close"
                size={RF(22)}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* ================================= */}
          {/* TIME DISPLAY */}
          {/* ================================= */}

          <View style={styles.timeDisplayRow}>
            <View style={styles.timeDigitsBox}>

              {/* HOUR */}

              <TouchableOpacity
                style={[
                  styles.timeSegment,
                  activeTab === "hour" &&
                    styles.activeTimeSegment,
                ]}
                onPress={() =>
                  setActiveTab("hour")
                }
              >
                <Text
                  style={[
                    styles.timeDisplayText,
                    activeTab === "hour" &&
                      styles.activeTimeDisplayText,
                  ]}
                >
                  {selectedHour}
                </Text>

                <Text style={styles.segmentLabel}>
                  Hour
                </Text>
              </TouchableOpacity>

              {/* COLON */}

              <Text style={styles.colonText}>
                :
              </Text>

              {/* MINUTE */}

              <TouchableOpacity
                style={[
                  styles.timeSegment,
                  activeTab === "minute" &&
                    styles.activeTimeSegment,
                ]}
                onPress={() =>
                  setActiveTab("minute")
                }
              >
                <Text
                  style={[
                    styles.timeDisplayText,
                    activeTab === "minute" &&
                      styles.activeTimeDisplayText,
                  ]}
                >
                  {selectedMinute}
                </Text>

                <Text style={styles.segmentLabel}>
                  Minute
                </Text>
              </TouchableOpacity>

              {/* AM / PM */}

              <View style={styles.ampmContainer}>

                {/* AM */}

                <TouchableOpacity
                  style={[
                    styles.ampmBtn,
                    selectedPeriod === "AM" &&
                      styles.activeAmpmBtn,
                  ]}
                  onPress={() =>
                    setSelectedPeriod("AM")
                  }
                >
                  <Text
                    style={[
                      styles.ampmText,
                      selectedPeriod === "AM" &&
                        styles.activeAmpmText,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>

                {/* PM */}

                <TouchableOpacity
                  style={[
                    styles.ampmBtn,
                    selectedPeriod === "PM" &&
                      styles.activeAmpmBtn,
                  ]}
                  onPress={() =>
                    setSelectedPeriod("PM")
                  }
                >
                  <Text
                    style={[
                      styles.ampmText,
                      selectedPeriod === "PM" &&
                        styles.activeAmpmText,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>

          {/* ================================= */}
          {/* SELECTED TIME */}
          {/* ================================= */}

          <Text style={styles.selectedTimeText}>
            {selectedHour}:{selectedMinute}{" "}
            {selectedPeriod}
          </Text>

          {/* ================================= */}
          {/* TAB SWITCH */}
          {/* ================================= */}

          <View style={styles.tabSwitchContainer}>

            {/* HOURS */}

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "hour" &&
                  styles.activeTabButton,
              ]}
              onPress={() =>
                setActiveTab("hour")
              }
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "hour" &&
                    styles.activeTabButtonText,
                ]}
              >
                Hours (01 - 12)
              </Text>
            </TouchableOpacity>

            {/* MINUTES */}

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "minute" &&
                  styles.activeTabButton,
              ]}
              onPress={() =>
                setActiveTab("minute")
              }
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "minute" &&
                    styles.activeTabButtonText,
                ]}
              >
                Minutes (00 - 59)
              </Text>
            </TouchableOpacity>

          </View>

          {/* ================================= */}
          {/* GRID */}
          {/* ================================= */}

          <View style={styles.gridContainer}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={
                styles.gridContent
              }
            >
              {/* HOURS */}

              {activeTab === "hour"
                ? HOURS_12.map((hour) => {
                    const isSelected =
                      selectedHour === hour;

                    return (
                      <TouchableOpacity
                        key={`hour-${hour}`}
                        style={[
                          styles.gridItem,
                          isSelected &&
                            styles.selectedGridItem,
                        ]}
                        onPress={() => {
                          setSelectedHour(hour);

                          // Automatically go to minutes
                          setActiveTab("minute");
                        }}
                      >
                        <Text
                          style={[
                            styles.gridItemText,
                            isSelected &&
                              styles.selectedGridItemText,
                          ]}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    );
                  })

                // MINUTES

                : MINUTES.map((minute) => {
                    const isSelected =
                      selectedMinute === minute;

                    return (
                      <TouchableOpacity
                        key={`minute-${minute}`}
                        style={[
                          styles.gridItem,
                          isSelected &&
                            styles.selectedGridItem,
                        ]}
                        onPress={() =>
                          setSelectedMinute(
                            minute
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.gridItemText,
                            isSelected &&
                              styles.selectedGridItemText,
                          ]}
                        >
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
          </View>

          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}

          <View style={styles.footer}>

            {/* CANCEL */}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            {/* CONFIRM */}

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>
                Confirm
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}

// ==========================================
// STYLES
// ==========================================

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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },

  timeDigitsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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

  selectedTimeText: {
    textAlign: "center",
    fontSize: RF(14),
    fontWeight: "700",
    color: Colors.primary,
    marginTop: hp(0.5),
    marginBottom: hp(1),
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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