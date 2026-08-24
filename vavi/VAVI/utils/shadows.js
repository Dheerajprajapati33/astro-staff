import { Platform } from "react-native";

// Cross-platform elevation presets: soft, layered shadows on iOS via
// shadow* props, mapped to a matching Android `elevation`.
const shadow = (elevation, opacity, radius, offsetY, color = "#000000") =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation,
    },
  });

export default {
  xs: shadow(2, 0.06, 3, 1),
  sm: shadow(3, 0.08, 5, 2),
  md: shadow(6, 0.12, 8, 3),
  lg: shadow(10, 0.16, 14, 5),
  primary: shadow(6, 0.28, 8, 4, "#FF8A00"),
};
