import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import {
  Svg,
  Line,
  Rect,
  SvgXml,
  Text as SvgText,
} from "react-native-svg";

import {
  hp,
  wp,
} from "../../utils/responsive";

const HOUSE_POSITIONS = {
  1: { x: 200, y: 155 },
  2: { x: 115, y: 65 },
  3: { x: 62, y: 125 },
  4: { x: 155, y: 205 },
  5: { x: 62, y: 275 },
  6: { x: 115, y: 335 },
  7: { x: 200, y: 245 },
  8: { x: 285, y: 335 },
  9: { x: 338, y: 275 },
  10: { x: 245, y: 205 },
  11: { x: 338, y: 125 },
  12: { x: 285, y: 65 },
};

const VedicChart = ({
  svgXml,
  planets = [],
  size = wp(90),
}) => {
  const cleanSvg = useMemo(() => {
    if (
      !svgXml ||
      typeof svgXml !== "string"
    ) {
      return null;
    }

    return svgXml
      .trim()
      .replace(
        /(["'])(?=[A-Za-z_:][\w:.-]*\s*=)/g,
        "$1 ",
      );
  }, [svgXml]);

  const planetsByHouse = useMemo(() => {
    const grouped = {};

    for (const planet of Array.isArray(planets) ? planets : []) {
      const house = Number(planet?.house);

      if (
        Number.isInteger(house) &&
        house >= 1 &&
        house <= 12
      ) {
        grouped[house] ??= [];
        grouped[house].push(planet);
      }
    }

    return grouped;
  }, [planets]);

  if (!cleanSvg) {
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
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <Rect
            x="1"
            y="1"
            width="398"
            height="398"
            fill="#fff"
            stroke="#ff5a00"
            strokeWidth="2"
          />
          <Line
            x1="0"
            y1="0"
            x2="400"
            y2="400"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          <Line
            x1="0"
            y1="400"
            x2="400"
            y2="0"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          <Line
            x1="200"
            y1="0"
            x2="0"
            y2="200"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          <Line
            x1="0"
            y1="200"
            x2="200"
            y2="400"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          <Line
            x1="200"
            y1="400"
            x2="400"
            y2="200"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          <Line
            x1="400"
            y1="200"
            x2="200"
            y2="0"
            stroke="#ff5a00"
            strokeWidth="1.5"
          />
          {Object.entries(HOUSE_POSITIONS).map(([houseKey, position]) => {
            const house = Number(houseKey);
            const housePlanets = planetsByHouse[house] || [];

            return (
              <React.Fragment key={houseKey}>
                <SvgText
                  x={position.x}
                  y={position.y}
                  fill="#ff5a00"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {`House ${house}`}
                </SvgText>
                {housePlanets.map((planet, index) => {
                  const degree = planet?.degree;
                  const label = [
                    String(planet?.name || "Planet"),
                    degree !== undefined && degree !== null
                      ? `${degree}°`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <SvgText
                      key={`${houseKey}-${planet?.name || "planet"}-${index}`}
                      x={position.x}
                      y={position.y + 13 + index * 12}
                      fill="#222"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {label}
                    </SvgText>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
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
});