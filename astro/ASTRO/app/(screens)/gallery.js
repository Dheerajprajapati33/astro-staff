import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import {
  useGetGalleryQuery,
  useUploadGalleryMutation,
} from "../../redux/GalleryApi";

const ORANGE = "#ff6a00";

export default function Gallery() {
  const [showInfo, setShowInfo] = useState(false);

  const { data: galleryData, isLoading, refetch } = useGetGalleryQuery();

  const [uploadGallery, { isLoading: uploading }] = useUploadGalleryMutation();

  const galleryImages = galleryData?.gallery || [];

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission Required");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const images = result.assets;
        await uploadGallery(images).unwrap(); // Uses token from AsyncStorage
        Alert.alert("Success", "Images uploaded successfully");
        refetch();
      } catch (err) {
        console.log("UPLOAD ERROR:", err);
        Alert.alert(
          "Upload Failed",
          err?.data?.message || "Cannot upload images",
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Gallery</Text>

        <View style={styles.headerActions}>
          {/* <TouchableOpacity onPress={pickImageFromGallery} disabled={uploading}>
            <Ionicons
              name="cloud-upload-outline"
              size={RF(22)}
              color={ORANGE}
            />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => setShowInfo((prev) => !prev)}>
            <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
          </TouchableOpacity>
        </View>
      </View>

      {showInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="image" size={RF(31)} color={ORANGE} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>
              Your gallery helps clients get to know you better.
            </Text>

            <Text style={styles.infoText}>
              Add high-quality photos to build trust and attract more clients.
            </Text>
          </View>

          <Text style={styles.art}>🖼️</Text>
        </View>
      )}

      <FlatList
        data={[...galleryImages, "add"]}
        keyExtractor={(item, index) =>
          item === "add" ? "add" : item.id.toString()
        }
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={
          <>
            <View style={styles.tabBox}>
              <View style={styles.tabLeft}>
                <Ionicons name="images" size={RF(16)} color={ORANGE} />

                <Text style={styles.tabText}>
                  Photos ({galleryData?.totalImages || 0})
                </Text>
              </View>

              {/* <TouchableOpacity style={styles.reorderBtn}>
                <Ionicons
                  name="reorder-three-outline"
                  size={RF(22)}
                  color={ORANGE}
                />

                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.actionRow}>
              {/* <TouchableOpacity
                style={styles.addBtn}
                onPress={pickImageFromGallery}
                disabled={uploading}
              >
                <Ionicons name="add" size={RF(18)} color={ORANGE} />

                <Text style={styles.addText}>
                  {uploading ? "Uploading..." : "Add Photos"}
                </Text>
              </TouchableOpacity> */}
            </View>
          </>
        }
        renderItem={({ item }) =>
          item === "add" ? (
            <TouchableOpacity
              style={styles.addMoreCard}
              onPress={pickImageFromGallery}
            >
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={RF(25)} color="#fff" />
              </View>

              <Text style={styles.addMoreText}>Add More{"\n"}Photos</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.8} style={styles.photoCard}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.photo}
              />

              <View style={styles.moreDot}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={RF(14)}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          )
        }
        ListFooterComponent={
          <View style={styles.footerCard}>
            <View style={styles.shield}>
              <Ionicons name="shield-checkmark" size={RF(20)} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.footerTitle}>
                Upload clear, professional photos to build trust.
              </Text>

              <Text style={styles.footerSub}>You can add up to 20 photos.</Text>
            </View>

            <Text style={styles.countText}>
              {galleryData?.totalImages || 0} / 20 Photos
            </Text>
          </View>
        }
      />
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
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3.5),
    marginLeft: "auto",
  },

  content: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    minHeight: hp(92),
  },

  infoCard: {
    minHeight: hp(12),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(3.2),
    marginTop: hp(1),
    marginBottom: hp(0.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  infoIcon: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  infoTitle: {
    fontSize: RF(12),
    color: "#111827",
    fontWeight: "900",
    lineHeight: hp(2),
    fontFamily: Typography?.bold,
  },

  infoText: {
    fontSize: RF(9.5),
    color: "#607086",
    lineHeight: hp(1.8),
    marginTop: hp(0.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  art: {
    fontSize: RF(30),
    marginLeft: wp(1),
  },

  tabBox: {
    height: hp(4.5),
    borderBottomWidth: 2,
    borderBottomColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.3),
  },

  tabLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  tabText: {
    color: ORANGE,
    fontSize: RF(16),
    fontWeight: "900",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.2),
  },

  addBtn: {
    height: hp(4),
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
  },

  addText: {
    color: ORANGE,
    fontSize: RF(14),
    fontWeight: "900",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  reorderBtn: {
    height: hp(4),
    flexDirection: "row",
    alignItems: "center",
  },

  reorderText: {
    color: ORANGE,
    fontSize: RF(16),
    fontWeight: "900",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  gridRow: {
    justifyContent: "space-between",
  },

  photoCard: {
    width: wp(29),
    height: hp(14),
    borderRadius: wp(2),
    overflow: "hidden",
    marginBottom: hp(1),
    backgroundColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  moreDot: {
    position: "absolute",
    top: hp(0.6),
    right: wp(1.5),
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  addMoreCard: {
    width: wp(29),
    height: hp(14),
    borderRadius: wp(2),
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ffb98a",
    backgroundColor: "#fff8f3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },

  plusCircle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.8),
  },

  addMoreText: {
    color: "#374151",
    fontSize: RF(12),
    textAlign: "center",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  footerCard: {
    marginTop: hp(1.2),
    minHeight: hp(7),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  shield: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  footerTitle: {
    fontSize: RF(14),
    color: "#374151",
    lineHeight: RF(14) * 1.35,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  footerSub: {
    fontSize: RF(12),
    color: "#607086",
    marginTop: hp(0.3),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  countText: {
    color: ORANGE,
    fontSize: RF(10),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
});
