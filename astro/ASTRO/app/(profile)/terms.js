import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { useGetContentQuery } from "../../redux/contentApi";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";


const ORANGE="#ff6a00";


export default function Terms(){


const {
 data,
 isLoading
}=useGetContentQuery(
 "terms_conditions"
);



if(isLoading){

return(
<SafeAreaView style={styles.safe}>

<ActivityIndicator
size="large"
color={ORANGE}
/>

</SafeAreaView>
);

}



return(

<SafeAreaView
style={styles.safe}
edges={["top"]}
>


<View style={styles.header}>
<TouchableOpacity onPress={() => router.back()}>
<Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
</TouchableOpacity>

<Text style={styles.headerTitle}>
{data?.title || "Terms & Conditions"}
</Text>
</View>



<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={styles.container}
>


<View style={styles.iconBox}>

<Ionicons
name="reader-outline"
size={RF(42)}
color={ORANGE}
/>

</View>


<Text style={styles.title}>
{data?.title}
</Text>



<View style={styles.card}>

<Text style={styles.content}>

{data?.content ||
"Terms content not available"}

</Text>


</View>


</ScrollView>


</SafeAreaView>

);

}
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
    justifyContent: "flex-start",
  },

  headerTitle: {
    color: "#1f2937",
    fontSize: RF(18),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },

  container: {
    padding: wp(3.2),
    paddingBottom: hp(5),
  },

  iconBox: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#fff3ea",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },

  title: {
    textAlign: "center",
    fontSize: RF(16),
    fontWeight: "900",
    color: "#111827",
    marginTop: hp(1.5),
    fontFamily: Typography?.bold,
  },

  card: {
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fffaf6",
    padding: wp(3.2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  content: {
    fontSize: RF(11),
    color: "#374151",
    lineHeight: hp(2.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  footerCard: {
    marginTop: hp(2),
    backgroundColor: "#fff8f3",
    borderRadius: wp(3),
    padding: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: RF(10),
    color: "#555",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
