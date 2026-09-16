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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  initialDate,
  maxDate = new Date(),
}) {
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));
  const [viewYear, setViewYear] = useState(2000);
  const [viewMonth, setViewMonth] = useState(0); // 0-indexed
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate.trim())) {
      const parts = initialDate.trim().split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        return;
      }
    }
    const defaultD = new Date(2000, 0, 1);
    setSelectedDate(defaultD);
    setViewYear(2000);
    setViewMonth(0);
  }, [visible, initialDate]);

  const currentMaxYear = maxDate.getFullYear();
  const years = [];
  for (let y = currentMaxYear; y >= 1940; y--) {
    years.push(y);
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewYear === currentMaxYear && viewMonth >= maxDate.getMonth()) {
      return; // Cannot go to future month
    }
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (newDate > maxDate) return;
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    onSelectDate(`${y}-${m}-${d}`);
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
            <Text style={styles.headerTitle}>Select Date of Birth</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={RF(22)} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Month / Year Bar */}
          <View style={styles.monthYearBar}>
            <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevMonth}>
              <Ionicons
                name="chevron-back"
                size={RF(18)}
                color={Colors.darkBrown}
              />
            </TouchableOpacity>

            <View style={styles.monthYearSelector}>
              <Text style={styles.monthText}>{MONTHS[viewMonth]}</Text>
              <TouchableOpacity
                style={styles.yearBadge}
                onPress={() => setShowYearPicker((prev) => !prev)}
              >
                <Text style={styles.yearText}>{viewYear}</Text>
                <Ionicons
                  name={showYearPicker ? "chevron-up" : "chevron-down"}
                  size={RF(14)}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.arrowBtn} onPress={handleNextMonth}>
              <Ionicons
                name="chevron-forward"
                size={RF(18)}
                color={Colors.darkBrown}
              />
            </TouchableOpacity>
          </View>

          {/* Year Picker Dropdown */}
          {showYearPicker ? (
            <View style={styles.yearListContainer}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.yearListContent}
              >
                {years.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.yearItem,
                      y === viewYear && styles.selectedYearItem,
                    ]}
                    onPress={() => {
                      setViewYear(y);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearItemText,
                        y === viewYear && styles.selectedYearItemText,
                      ]}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            /* Calendar Grid */
            <View style={styles.calendarContainer}>
              {/* Day Headers */}
              <View style={styles.daysRow}>
                {DAYS.map((day, index) => (
                  <View key={index} style={styles.dayHeaderCell}>
                    <Text style={styles.dayHeaderText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Day Cells */}
              <View style={styles.grid}>
                {Array.from({ length: firstDayIndex }).map((_, index) => (
                  <View key={`empty-${index}`} style={styles.cell} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const isSelected =
                    selectedDate.getFullYear() === viewYear &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getDate() === day;

                  const isFuture = new Date(viewYear, viewMonth, day) > maxDate;

                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.cell,
                        isSelected && styles.selectedCell,
                        isFuture && styles.disabledCell,
                      ]}
                      disabled={isFuture}
                      onPress={() => handleSelectDay(day)}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          isSelected && styles.selectedCellText,
                          isFuture && styles.disabledCellText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

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
  monthYearBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1.5),
    marginBottom: hp(1.2),
  },
  arrowBtn: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  monthYearSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    fontSize: RF(15),
    fontWeight: "700",
    color: Colors.darkBrown,
    marginRight: wp(2),
  },
  yearBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E8",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
  },
  yearText: {
    fontSize: RF(14),
    fontWeight: "700",
    color: Colors.primary,
    marginRight: wp(1),
  },
  yearListContainer: {
    height: hp(26),
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: wp(2),
  },
  yearListContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: wp(2),
  },
  yearItem: {
    width: "30%",
    paddingVertical: hp(1.2),
    alignItems: "center",
    marginVertical: hp(0.4),
    borderRadius: wp(2),
    backgroundColor: "#F8F8F8",
  },
  selectedYearItem: {
    backgroundColor: Colors.primary,
  },
  yearItemText: {
    fontSize: RF(13),
    fontWeight: "600",
    color: Colors.darkBrown,
  },
  selectedYearItemText: {
    color: "#FFFFFF",
  },
  calendarContainer: {
    marginTop: hp(0.5),
  },
  daysRow: {
    flexDirection: "row",
    marginBottom: hp(0.8),
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: RF(12),
    fontWeight: "600",
    color: "#999999",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    height: hp(4.2),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(0.2),
    borderRadius: wp(2),
  },
  selectedCell: {
    backgroundColor: Colors.primary,
    borderRadius: wp(5),
  },
  disabledCell: {
    opacity: 0.3,
  },
  cellText: {
    fontSize: RF(13),
    fontWeight: "500",
    color: Colors.darkBrown,
  },
  selectedCellText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  disabledCellText: {
    color: "#CCCCCC",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: hp(2),
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
