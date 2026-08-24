import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetAppContentQuery } from "../../redux/appContentApi";
import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function PrivacyScreen() {
  // Change type to "privacy_policy", "terms", "about_us" as needed
  const { data, isLoading, isError, refetch } = useGetAppContentQuery("privacy_policy");

  if (isLoading) return <ActivityIndicator size="large" color={Colors.primary} />;
  if (isError) return <Text>Error loading content</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{data?.data?.title}</Text>
        <Text style={styles.body}>{data?.data?.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background || "#FFF8F4" },
  content: { padding: wp(4), paddingBottom: hp(4) },
  title: { fontSize: RF(18), fontWeight: "600", color: Colors.darkBrown, marginBottom: hp(2) },
  body: { fontSize: RF(14), fontWeight: "400", color: Colors.textGray, lineHeight: RF(20) },
});