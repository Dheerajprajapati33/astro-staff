import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Design Size (Figma Design)
// iPhone 13 / 14 base size
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

/**
 * Width Percentage
 * Example: wp(90)
 */
export const wp = (percentage) => {
  return (width * percentage) / 100;
};

/**
 * Height Percentage
 * Example: hp(5)
 */
export const hp = (percentage) => {
  return (height * percentage) / 100;
};

/**
 * Scale Width
 */
export const scale = (size) => {
  return (width / guidelineBaseWidth) * size;
};

/**
 * Scale Height
 */
export const verticalScale = (size) => {
  return (height / guidelineBaseHeight) * size;
};

/**
 * Moderate Scale
 */
export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

/**
 * Responsive Font Size
 */
export const RF = (size) => {
  return moderateScale(size) / PixelRatio.getFontScale();
};

export default {
  wp,
  hp,
  scale,
  verticalScale,
  moderateScale,
  RF,
};