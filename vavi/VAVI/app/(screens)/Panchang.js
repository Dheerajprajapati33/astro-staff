import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

import { useGetPanchangMutation } from "../../redux/PanchangApi";

export default function Panchang() {
  const router = useRouter();

  const [date, setDate] = useState("");

  const [place, setPlace] = useState("");

  const [panchang, setPanchang] = useState(null);

  const [getPanchang, { isLoading }] = useGetPanchangMutation();

  const handleGetPanchang = async () => {
    if (!date) {
      Alert.alert("Required", "Please enter date");

      return;
    }

    if (!place) {
      Alert.alert("Required", "Please enter place");

      return;
    }

    try {
      const response = await getPanchang({
        date: date,

        place: place,
      }).unwrap();

      console.log("Panchang Response", response);

      if (response?.success) {
        setPanchang(response.data);
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Unable to fetch Panchang");
    }
  };

  const timings = [
    {
      id: 1,
      title: "Sunrise",
      time: panchang?.sunrise || "--",
      icon: "weather-sunset-up",
    },

    {
      id: 2,
      title: "Sunset",
      time: panchang?.sunset || "--",
      icon: "weather-sunset-down",
    },

    {
      id: 3,
      title: "Moonrise",
      time: panchang?.moonrise || "--",
      icon: "moon-waning-crescent",
    },

    {
      id: 4,
      title: "Moonset",
      time: panchang?.moonset || "--",
      icon: "moon-waning-crescent",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={RF(22)} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Panchang</Text>

          <View style={{ width: wp(6) }} />
        </View>

        {/* Input Card */}

        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>Enter Panchang Details</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="calendar-outline"
              size={RF(18)}
              color={Colors.primary}
            />

            <TextInput
              placeholder="Enter Date (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons
              name="location-outline"
              size={RF(18)}
              color={Colors.primary}
            />

            <TextInput
              placeholder="Enter Place"
              placeholderTextColor="#999"
              value={place}
              onChangeText={setPlace}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleGetPanchang}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#FF9800", "#FF6A00"]}
              style={styles.getButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons
                    name="sparkles-outline"
                    size={RF(20)}
                    color="#FFF"
                  />

                  <Text style={styles.getButtonText}>Get Panchang</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Location */}

        {panchang && (
          <>
            <View style={styles.locationCard}>
              <View style={styles.locationLeft}>
                <Ionicons
                  name="location-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />

                <Text style={styles.locationText}>{panchang.place}</Text>
              </View>
            </View>

            {/* Timings */}

            <View style={styles.timingCard}>
              {timings.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.timingItem,

                    index !== timings.length - 1 && styles.timingBorder,
                  ]}
                >
                  <LinearGradient
                    colors={["#FF9800", "#FF6A00"]}
                    style={styles.timingHeader}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={RF(17)}
                      color="#FFF"
                    />

                    <Text style={styles.timingTitle}>{item.title}</Text>
                  </LinearGradient>

                  <View style={styles.timingBody}>
                    <Text style={styles.timingValue}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Abhijit */}

            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={RF(22)}
                  color={Colors.primary}
                />

                <Text style={styles.cardTitle}>Abhijit Muhurta</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.leftLabel}>Start</Text>

                <Text style={styles.rightValue}>
                  {panchang.abhijitMuhurta.start}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.tableRow}>
                <Text style={styles.leftLabel}>End</Text>

                <Text style={styles.rightValue}>
                  {panchang.abhijitMuhurta.end}
                </Text>
              </View>
            </View>

            {/* Kaal */}

            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="alert-outline"
                  size={RF(22)}
                  color={Colors.primary}
                />

                <Text style={styles.cardTitle}>
                  Kaal (Inauspicious Muhurta)
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.leftLabel}>Rahukaal</Text>

                <Text style={styles.rightValue}>{panchang.kaal.rahukaal}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.tableRow}>
                <Text style={styles.leftLabel}>Gulika</Text>

                <Text style={styles.rightValue}>{panchang.kaal.gulika}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.tableRow}>
                <Text style={styles.leftLabel}>Yamaganda</Text>

                <Text style={styles.rightValue}>{panchang.kaal.yamaganda}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  content: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(2),
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary,
    fontSize: RF(19),
    fontWeight: "700",
  },

  locationCard: {
    backgroundColor: Colors.white,

    borderRadius: wp(4),

    paddingHorizontal: wp(4),

    paddingVertical: hp(1.6),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,

    marginBottom: hp(2),
  },

  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    marginLeft: wp(2.5),

    color: "#222",

    fontSize: RF(14),

    fontWeight: "500",
  },

  timingCard: {
    flexDirection: "row",

    backgroundColor: Colors.white,

    borderRadius: wp(4),

    overflow: "hidden",

    marginBottom: hp(2),

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  timingItem: {
    flex: 1,
  },

  timingBorder: {
    borderRightWidth: 1,
    borderRightColor: "#EFEFEF",
  },

  timingHeader: {
    justifyContent: "center",

    alignItems: "center",

    paddingVertical: hp(1.1),
  },

  timingTitle: {
    color: "#FFF",

    fontSize: RF(11),

    fontWeight: "600",

    marginTop: hp(0.4),

    textAlign: "center",
  },

  timingBody: {
    paddingVertical: hp(1.5),

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: wp(1),
  },

  timingValue: {
    color: "#444",

    fontSize: RF(10.5),

    fontWeight: "500",

    textAlign: "center",

    lineHeight: RF(15),
  },

  infoCard: {
    backgroundColor: Colors.white,

    borderRadius: wp(4),

    padding: wp(4),

    marginBottom: hp(2),

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: hp(1.8),
  },

  cardTitle: {
    color: "#222",

    fontSize: RF(15),

    fontWeight: "700",

    marginLeft: wp(2),
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.2),
  },

  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
  },

  leftLabel: {
    flex: 1,

    color: "#555",

    fontSize: RF(13),

    fontWeight: "500",
  },

  rightValue: {
    flex: 1.3,

    textAlign: "right",

    color: Colors.primary,

    fontSize: RF(13),

    fontWeight: "700",
  },

  buttonWrapper: {
    marginTop: hp(1.5),
    marginBottom: hp(3),
  },

  consultButton: {
    height: hp(6.4),

    borderRadius: wp(4),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#FF8A00",

    shadowOpacity: 0.25,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  consultButtonText: {
    color: "#FFF",

    fontSize: RF(15),

    fontWeight: "700",

    marginLeft: wp(2.5),
  },
  inputCard: {
    backgroundColor: Colors.white,

    borderRadius: wp(5),

    padding: wp(4),

    marginBottom: hp(2),

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  inputTitle: {
    color: Colors.darkBrown,

    fontSize: RF(16),

    fontWeight: "600",

    marginBottom: hp(1.5),
  },
  inputBox: {

  height: hp(6.5),

  backgroundColor: "#FFF9F2",

  borderWidth: 1,

  borderColor: "#F4D7B8",

  borderRadius: wp(3),

  flexDirection: "row",

  alignItems: "center",

  paddingHorizontal: wp(3),

  marginBottom: hp(1.5),

},



input: {

  flex: 1,

  marginLeft: wp(2),

  color: Colors.darkBrown,

  fontSize: RF(13),

  fontWeight: "500",

},

buttonWrapper: {

  marginTop: hp(1),

},



getButton: {

  height: hp(6.5),

  borderRadius: wp(4),

  flexDirection: "row",

  alignItems: "center",

  justifyContent: "center",

  shadowColor: "#FF9800",

  shadowOpacity: 0.25,

  shadowRadius: 10,

  shadowOffset: {
    width:0,
    height:4,
  },

  elevation:5,

},



getButtonText: {

  color:"#FFF",

  fontSize: RF(15),

  fontWeight: "700",

  marginLeft: wp(2),

},

});
