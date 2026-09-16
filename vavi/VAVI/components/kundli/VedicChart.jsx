import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText, SvgXml } from "react-native-svg";
import { hp, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const TEXT_COLOR = "#111";

// Helper: Zodiac sign name to number (1-12)
export const SIGN_NAME_TO_NUM = {
  aries: 1,
  mesha: 1,
  mesh: 1,
  taurus: 2,
  vrishabha: 2,
  vrishabh: 2,
  gemini: 3,
  mithuna: 3,
  mithun: 3,
  cancer: 4,
  karka: 4,
  kark: 4,
  leo: 5,
  simha: 5,
  singh: 5,
  virgo: 6,
  kanya: 6,
  libra: 7,
  tula: 7,
  scorpio: 8,
  vrischika: 8,
  vrishchik: 8,
  sagittarius: 9,
  dhanu: 9,
  capricorn: 10,
  makar: 10,
  makara: 10,
  aquarius: 11,
  kumbh: 11,
  kumbha: 11,
  pisces: 12,
  meen: 12,
  meena: 12,
};

// Helper: Planet name to short 2-letter code
export const PLANET_SHORT = {
  ascendant: "As",
  lagna: "As",
  asc: "As",
  sun: "Su",
  surya: "Su",
  su: "Su",
  moon: "Mo",
  chandra: "Mo",
  mo: "Mo",
  mars: "Ma",
  mangal: "Ma",
  ma: "Ma",
  mercury: "Me",
  budh: "Me",
  me: "Me",
  jupiter: "Ju",
  guru: "Ju",
  ju: "Ju",
  venus: "Ve",
  shukra: "Ve",
  ve: "Ve",
  saturn: "Sa",
  shani: "Sa",
  sa: "Sa",
  rahu: "Ra",
  ra: "Ra",
  ketu: "Ke",
  ke: "Ke",
  uranus: "Ur",
  neptune: "Ne",
  pluto: "Pl",
};

// House layout coordinates in standard 400x400 North Indian Chart
const HOUSE_COORDINATES = {
  1: { signX: 200, signY: 170, planetX: 200, planetY: 75 },
  2: { signX: 125, signY: 65, planetX: 70, planetY: 35 },
  3: { signX: 65, signY: 125, planetX: 30, planetY: 70 },
  4: { signX: 170, signY: 200, planetX: 65, planetY: 200 },
  5: { signX: 65, signY: 275, planetX: 30, planetY: 330 },
  6: { signX: 125, signY: 335, planetX: 70, planetY: 365 },
  7: { signX: 200, signY: 230, planetX: 200, planetY: 325 },
  8: { signX: 275, signY: 335, planetX: 330, planetY: 365 },
  9: { signX: 335, signY: 275, planetX: 370, planetY: 330 },
  10: { signX: 230, signY: 200, planetX: 335, planetY: 200 },
  11: { signX: 335, signY: 125, planetX: 370, planetY: 70 },
  12: { signX: 275, signY: 65, planetX: 330, planetY: 35 },
};

export const parseSignNumber = (signVal) => {
  if (!signVal) return 1;
  if (typeof signVal === "number") return signVal;
  const num = parseInt(signVal, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  const clean = String(signVal).trim().toLowerCase();
  return SIGN_NAME_TO_NUM[clean] || 1;
};

export const getPlanetCode = (name) => {
  if (!name) return "";
  const clean = String(name).trim().toLowerCase();
  return PLANET_SHORT[clean] || name.slice(0, 2);
};

const VedicChart = ({
  planets = [],
  ascendantSign = null,
  svgXml = null,
  size = wp(90),
}) => {
  if (svgXml) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <SvgXml xml={svgXml} width="100%" height="100%" />
      </View>
    );
  }

  // 1. Determine Ascendant (Lagna) Sign Number (1 to 12)
  let lagnaSign = 1;
  if (ascendantSign) {
    lagnaSign = parseSignNumber(ascendantSign);
  } else {
    const ascPlanet = planets.find((p) => {
      const name = (p.name || p.planet || "").toLowerCase();
      return name === "ascendant" || name === "lagna" || name === "asc";
    });
    if (ascPlanet) {
      lagnaSign = parseSignNumber(ascPlanet.sign || ascPlanet.rasi);
    } else {
      // Find planet in house 1
      const house1Planet = planets.find(
        (p) => parseInt(p.house || p.bhava, 10) === 1,
      );
      if (house1Planet) {
        lagnaSign = parseSignNumber(house1Planet.sign || house1Planet.rasi);
      } else if (planets.length > 0 && planets[0]?.sign) {
        lagnaSign = parseSignNumber(planets[0].sign);
      }
    }
  }

  // 2. Calculate Sign Number for each of the 12 houses (counter-clockwise)
  const houseSigns = {};
  for (let h = 1; h <= 12; h++) {
    houseSigns[h] = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
  }

  // 3. Group Planets by House (1 to 12)
  const housePlanets = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  };

  planets.forEach((p) => {
    const rawName = p.name || p.planet || "";
    const code = getPlanetCode(rawName);
    const isRetro =
      p.isRetrograde === true ||
      p.isRetrograde === "true" ||
      p.retrograde === true;
    const label = isRetro ? `${code}*` : code;

    let targetHouse = parseInt(p.house || p.bhava, 10);

    // If house is missing, determine from planet's sign vs lagnaSign
    if (isNaN(targetHouse) || targetHouse < 1 || targetHouse > 12) {
      const pSign = parseSignNumber(p.sign || p.rasi);
      targetHouse = ((pSign - lagnaSign + 12) % 12) + 1;
    }

    if (housePlanets[targetHouse]) {
      housePlanets[targetHouse].push(label);
    }
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 400">
        {/* Background & Outer Border */}
        <Rect
          x="1"
          y="1"
          width="398"
          height="398"
          fill="#fff"
          stroke={ORANGE}
          strokeWidth="2.5"
        />

        {/* Diagonal Corner-to-Corner Lines */}
        <Line
          x1="0"
          y1="0"
          x2="400"
          y2="400"
          stroke={ORANGE}
          strokeWidth="1.8"
        />
        <Line
          x1="0"
          y1="400"
          x2="400"
          y2="0"
          stroke={ORANGE}
          strokeWidth="1.8"
        />

        {/* Center Diamond Lines (Midpoints) */}
        <Line
          x1="200"
          y1="0"
          x2="0"
          y2="200"
          stroke={ORANGE}
          strokeWidth="1.8"
        />
        <Line
          x1="0"
          y1="200"
          x2="200"
          y2="400"
          stroke={ORANGE}
          strokeWidth="1.8"
        />
        <Line
          x1="200"
          y1="400"
          x2="400"
          y2="200"
          stroke={ORANGE}
          strokeWidth="1.8"
        />
        <Line
          x1="400"
          y1="200"
          x2="200"
          y2="0"
          stroke={ORANGE}
          strokeWidth="1.8"
        />

        {/* Render House Numbers & Planets for all 12 Houses */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
          const coords = HOUSE_COORDINATES[houseNum];
          const signNum = houseSigns[houseNum];
          const planetList = housePlanets[houseNum] || [];

          return (
            <React.Fragment key={houseNum}>
              {/* Zodiac Sign (Rashi) Number in this house */}
              <SvgText
                x={coords.signX}
                y={coords.signY}
                fill={ORANGE}
                fontSize="15"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {signNum}
              </SvgText>

              {/* Planets placed in this house */}
              {planetList.length > 0 && (
                <SvgText
                  x={coords.planetX}
                  y={coords.planetY}
                  fill={TEXT_COLOR}
                  fontSize={planetList.length > 3 ? "12" : "13.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {planetList.slice(0, 2).join(" ")}
                </SvgText>
              )}
              {planetList.length > 2 && (
                <SvgText
                  x={coords.planetX}
                  y={coords.planetY + 16}
                  fill={TEXT_COLOR}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {planetList.slice(2, 5).join(" ")}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
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
