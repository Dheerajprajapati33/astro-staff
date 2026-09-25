import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import {
  SvgXml,
} from "react-native-svg";

import {
  hp,
  wp,
} from "../../utils/responsive";

const VedicChart = ({
  svgXml,
  size = wp(90),
}) => {
  const cleanSvg = useMemo(() => {
    if (
      !svgXml ||
      typeof svgXml !== "string"
    ) {
      return null;
    }

    let svg = svgXml.trim();

    return svg;
  }, [svgXml]);

  if (!cleanSvg) {
    return (
      <View
        style={[
          styles.empty,
          {
            width: size,
            height: size,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <SvgXml
        xml={cleanSvg}
        width="100%"
        height="100%"
      />
    </View>
  );
};

export default VedicChart;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },

  empty: {
    alignSelf: "center",
    marginBottom: hp(2),
  },
});