import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/home/Header";
import Slider from "../../components/home/Slider";
import OnlineCards from "../../components/home/OnlineCards";
import Tools from "../../components/home/Tools";
import { wp } from "../../utils/responsive";

const Home = () => {
  console.log("HOME START");
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.headerWrapper}>
          <Header />
          <Slider />
        </View>

        <OnlineCards />

        <Tools />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: wp(13),
  },
  headerWrapper: {
    backgroundColor: "#fff",
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: wp(5),
    paddingBottom: 0,
  },
});
