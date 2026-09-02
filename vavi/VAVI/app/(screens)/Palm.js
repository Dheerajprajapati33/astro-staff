import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";import { useScanPalmMutation } from "../../redux/PalmApi";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff7a00";

const Palm = ({ navigation }) => {
  const [scanPalm, { isLoading: apiLoading }] = useScanPalmMutation();
  const cameraRef = useRef(null);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanLoopRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => {
      setProgress(Math.round(value));
    });

    return () => {
      progressAnim.removeListener(listener);
      scanLoopRef.current?.stop();
    };
  }, []);

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }

    setPhoto(null);
    setProgress(0);
    progressAnim.setValue(0);
    setCameraOpen(true);
  };

  const startScan = () => {
    if (isScanning) return;

    setIsScanning(true);
    setProgress(0);
    scanAnim.setValue(0);
    progressAnim.setValue(0);

    scanLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    );

    scanLoopRef.current.start();

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3600,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      capturePalm();
    }, 3800);
  };

  const capturePalm = async () => {
    try {
      if (!cameraRef.current) return;

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.75,

        base64: false,

        skipProcessing: false,
      });

      scanLoopRef.current?.stop();

      setIsScanning(false);

      setPhoto(result.uri);

      setCameraOpen(false);

      // ==========================
      // PALM API CALL
      // ==========================

      const apiResponse = await scanPalm({
        uri: result.uri,

        type: "image/jpeg",

        fileName: "palmImage.jpg",
      }).unwrap();

      console.log("PALM RESULT ===>", apiResponse);

      if (apiResponse?.success) {
        router.push({
          pathname: "/palmdetail",

          params: {
            palmImage: result.uri,

            lifeLine: apiResponse.data.lifeLine,

            heartLine: apiResponse.data.heartLine,

            headLine: apiResponse.data.headLine,

            fateLine: apiResponse.data.fateLine,
          },
        });
      }
    } catch (error) {
      scanLoopRef.current?.stop();

      setIsScanning(false);

      console.log("PALM API ERROR", error);
    }
  };

  const closeCamera = () => {
    scanLoopRef.current?.stop();
    setIsScanning(false);
    setCameraOpen(false);
  };

  const scanY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(2), hp(42) - hp(3)],
  });

  if (cameraOpen) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        <TouchableOpacity style={styles.closeBtn} onPress={closeCamera}>
          <Ionicons name="close" size={RF(24)} color="#fff" />
        </TouchableOpacity>

        <View style={styles.cameraOverlay}>
          <View style={styles.scanFrame}>
            <Text style={styles.scanText}>
              {isScanning ? "Scanning Palm..." : "Place your palm inside frame"}
            </Text>

            {isScanning && (
              <>
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanY }],
                    },
                  ]}
                />

                <View style={styles.progressBox}>
                  <Text style={styles.progressText}>{progress}%</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={startScan}
            disabled={isScanning}
          >
            <MaterialCommunityIcons
              name={isScanning ? "line-scan" : "hand-back-left-outline"}
              size={RF(20)}
              color="#fff"
            />
            <Text style={styles.scanButtonText}>
              {apiLoading
                ? "Analyzing Palm..."
                : isScanning
                  ? "Scanning..."
                  : "Start Scan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Palm Reading</Text>

        <Text style={styles.sparkle}>✦</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="hand-back-left"
            size={RF(28)}
            color="#fff"
          />
        </View>

        <Text style={styles.title}>Scan Your Palm</Text>

        <Text style={styles.sub}>
          Open your camera and scan your palm clearly.
        </Text>

        <View style={styles.previewBox}>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={styles.previewImage} />

              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={RF(17)} color="#fff" />
                <Text style={styles.successText}>Palm Scan Completed</Text>
              </View>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="hand-back-left-outline"
                size={RF(95)}
                color="#ffb766"
              />
              <Text style={styles.previewText}>
                Palm preview will appear here
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={openCamera}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={RF(21)}
            color="#fff"
          />
          <Text style={styles.mainBtnText}>
            {photo ? "Scan Again" : "Start Palm Scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Palm;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fffdf8",
  },
  header: {
    height: hp(6),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: RF(21),
    color: ORANGE,
    fontWeight: "700",
  },
  sparkle: {
    color: ORANGE,
    fontSize: RF(22),
  },
  body: {
    flex: 1,
    paddingHorizontal: wp(5),
    alignItems: "center",
  },
  iconCircle: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(8),
    backgroundColor: "#ffb21a",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  title: {
    fontSize: RF(22),
    color: ORANGE,
    fontWeight: "700",
    marginTop: hp(1.5),
  },
  sub: {
    fontSize: RF(11),
    color: "#555",
    textAlign: "center",
    marginTop: hp(0.7),
    marginBottom: hp(2),
    fontWeight: "400",
  },
  previewBox: {
    width: "100%",
    height: hp(45),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: "#f7d9b8",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewText: {
    fontSize: RF(11),
    color: "#999",
    marginTop: hp(1),
  },
  successBadge: {
    position: "absolute",
    bottom: hp(2),
    backgroundColor: ORANGE,
    borderRadius: wp(8),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.9),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  successText: {
    color: "#fff",
    fontSize: RF(11),
    fontWeight: "700",
  },
  mainButton: {
    width: "100%",
    height: hp(5.8),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(3),
    marginTop: hp(2),
  },
  mainBtnText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "700",
  },

  cameraScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: hp(5),
    right: wp(5),
    zIndex: 10,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: wp(75),
    height: hp(42),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: "rgba(255,122,0,0.35)",
    overflow: "hidden",
    alignItems: "center",
  },
  scanText: {
    position: "absolute",
    top: hp(2),
    zIndex: 5,
    color: "#fff",
    fontSize: RF(12),
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(6),
    fontWeight: "700",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: hp(0.35),
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 15,
  },
  progressBox: {
    position: "absolute",
    bottom: hp(2),
    width: "80%",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
    marginBottom: hp(0.7),
  },
  progressTrack: {
    width: "100%",
    height: hp(0.8),
    borderRadius: wp(5),
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ORANGE,
    borderRadius: wp(5),
  },
  corner: {
    position: "absolute",
    width: wp(10),
    height: wp(10),
    borderColor: ORANGE,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanButton: {
    position: "absolute",
    bottom: hp(5),
    width: wp(72),
    height: hp(5.8),
    borderRadius: wp(10),
    backgroundColor: ORANGE,
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonDisabled: {
    opacity: 0.85,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "700",
  },
});
