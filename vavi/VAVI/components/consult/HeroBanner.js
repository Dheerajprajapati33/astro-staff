import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, RF, wp } from "../../utils/responsive";

// ⭐ Apni banner image ka path yaha update kar lena
import BannerImage from "../../assets/images/placeholder.jpeg";

const BANNERS = [
  {
    id: "1",
    orangeTitle: "Get Answers.",
    greenTitle: "Gain Clarity.",
    description: "Consult top astrologers and\nfind the right guidance.",
    buttonText: "Consult Now",
    image: BannerImage,
  },
  {
    id: "2",
    orangeTitle: "Live Guidance.",
    greenTitle: "Instant Talk.",
    description: "Connect with expert astrologers\nvia Call & Chat 24/7.",
    buttonText: "Consult Now",
    image: BannerImage,
  },
  {
    id: "3",
    orangeTitle: "Future Insights.",
    greenTitle: "Peace of Mind.",
    description: "Discover Kundli, Tarot Reading,\nand personalized predictions.",
    buttonText: "Consult Now",
    image: BannerImage,
  },
];

const SLIDE_WIDTH = wp(92); // wp(100) - paddingHorizontal wp(4) * 2

export default function HeroBanner({ onPress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleConsultPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/(tabs)");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BANNERS.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SLIDE_WIDTH);
    if (index >= 0 && index < BANNERS.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderBannerItem = ({ item }) => (
    <View style={styles.shadowWrap}>
      <View style={styles.banner}>
        {/* Left Content */}
        <View style={styles.leftSection}>
          <Text style={styles.orangeTitle}>{item.orangeTitle}</Text>

          <Text style={styles.greenTitle}>{item.greenTitle}</Text>

          <Text style={styles.description}>{item.description}</Text>

          <TouchableOpacity activeOpacity={0.9} onPress={handleConsultPress}>
            <LinearGradient
              colors={["#34C759", "#168F1A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{item.buttonText}</Text>

              <Ionicons name="arrow-forward" size={RF(15)} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Right Banner Image */}
        <Image
          source={item.image}
          resizeMode="contain"
          style={styles.bannerImage}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        keyExtractor={(item) => item.id}
        renderItem={renderBannerItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(data, index) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * index,
          index,
        })}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {BANNERS.map((_, index) => (
          <View
            key={index}
            style={index === activeIndex ? styles.activeDot : styles.dot}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    marginTop: hp(2.4),
  },

  shadowWrap: {
    width: SLIDE_WIDTH,
    borderRadius: wp(4),
    backgroundColor: "#ffffff",
    shadowColor: "#B5651D",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  banner: {
    height: hp(20),
    backgroundColor: "#ffffff",
    borderRadius: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    paddingLeft: wp(5),
    paddingRight: wp(2),
    borderWidth: 1,
    borderColor: "#F8E7DB",
  },

  leftSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: wp(2),
  },

  orangeTitle: {
    color: "#FF6A00",
    fontSize: RF(18),
    fontWeight: "700",
    lineHeight: RF(23),
  },

  greenTitle: {
    color: "#2AAE37",
    fontSize: RF(18),
    fontWeight: "700",
    lineHeight: RF(23),
    marginTop: hp(0.1),
  },

  description: {
    marginTop: hp(0.8),
    color: "#555",
    fontSize: RF(16),
    lineHeight: RF(16),
    fontWeight: "400",
  },

  button: {
    marginTop: hp(1.6),
    width: wp(31),
    height: hp(4.3),
    borderRadius: hp(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#168F1A",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  buttonText: {
    color: "#FFF",
    fontSize: RF(11.5),
    fontWeight: "700",
    marginRight: wp(1.5),
  },
  bannerImage: {
    width: wp(44),
    height: hp(15.5),
    resizeMode: "contain",
    marginLeft: wp(2),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1),
  },

  activeDot: {
    width: wp(4),
    height: hp(0.7),
    borderRadius: hp(1),
    backgroundColor: "#FF6A00",
    marginHorizontal: wp(0.7),
  },

  dot: {
    width: hp(0.7),
    height: hp(0.7),
    borderRadius: hp(1),
    backgroundColor: "#CCCCCC",
    marginHorizontal: wp(0.7),
  },
});
