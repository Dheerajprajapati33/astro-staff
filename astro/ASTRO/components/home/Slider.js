import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getBanners } from "../../redux/bannerApi";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const Slider = () => {
   console.log("SLIDER RENDER");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    setLoading(true);
    const data = await getBanners();
    setSliderData(data);
    setLoading(false);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  if (loading) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="small" color="#ff5a00" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slideItem}>
            <ImageBackground
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
              style={styles.banner}
              imageStyle={styles.bannerImage}
            ></ImageBackground>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No banners found</Text>
          </View>
        }
      />

      {sliderData.length > 0 && (
        <View style={styles.dotsRow}>
          {sliderData.map((_, index) => (
            <View
              key={index}
              style={activeIndex === index ? styles.activeDot : styles.dot}
            />
          ))}
        </View>
      )}

      <View style={styles.noticeCard}>
        <View style={styles.noticeIcon}>
          <Ionicons name="megaphone" size={RF(20)} color="#ff5a00" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>Notice Board</Text>
          <Text style={styles.noticeText}>
            Stay updated with the latest announcements and important updates.
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.viewAll}>View All ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  slideItem: {
    width: wp(90),
  },
  banner: {
    width: wp(90),
    height: hp(18),
    overflow: "hidden",
    marginBottom: hp(1),
  },
  bannerImage: {
    borderRadius: wp(4),
  },
  bannerContent: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: RF(17),
    color: "#fff",
    fontWeight: "800",
    lineHeight: hp(2.5),
    fontFamily: Typography?.bold,
  },
  bannerSub: {
    fontSize: RF(9),
    color: "#fff",
    marginTop: hp(0.8),
    lineHeight: hp(1.5),
    fontFamily: Typography?.regular,
  },
  bookBtn: {
    marginTop: hp(1.2),
    backgroundColor: "#fff",
    borderRadius: wp(1.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    alignSelf: "flex-start",
  },
  bookText: {
    color: "#ff5a00",
    fontSize: RF(9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(1.5),
    marginBottom: hp(1.5),
  },
  activeDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#ff5a00",
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#ffc299",
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: "#f1e8df",
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
  noticeIcon: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#fff4ec",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  noticeTitle: {
    fontSize: RF(16),
    color: "#333",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  noticeText: {
    fontSize: RF(12),
    color: "#777",
    marginTop: hp(0.4),
    lineHeight: hp(1.5),
    fontFamily: Typography?.regular,
  },
  viewAll: {
    color: "#ff5a00",
    fontSize: RF(12),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  loaderBox: {
    height: hp(18),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    width: wp(90),
    height: hp(18),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: RF(12),
    color: "#777",
    fontFamily: Typography?.regular,
  },
});
