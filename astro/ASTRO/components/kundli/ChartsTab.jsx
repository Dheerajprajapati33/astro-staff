import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  hp,
  RF,
  wp,
} from "../../utils/responsive";

import VedicChart from "./VedicChart";

import {
  getApiRoot,
  getSection,
  getChartSvg,
  getNormalizedPlanets,
  normalizePlanet,
  getRetrogradeText,
  getValue,
} from "./kundliApiHelpers";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff4df";

const chartTypes = [
  {
    label: "Lagna",
    key: "1_lagna_chart",
  },
  {
    label: "Chandra",
    key: "2_chandra_kundli",
  },
  {
    label: "Navamsa",
    key: "3_navamsha_kundli",
  },
  {
    label: "Gochar",
    key: "4_gochar_kundli",
  },
];

const planetTabs = [
  "Sign",
  "Nakshatra",
];

const ChartsTab = ({
  data,
  fullData,
  chartSize = wp(90),
}) => {
  const [
    activeChart,
    setActiveChart,
  ] = useState(
    chartTypes[0]
  );

  const [
    activePlanetTab,
    setActivePlanetTab,
  ] = useState("Sign");

  const apiRoot = useMemo(
    () =>
      getApiRoot(
        data,
        fullData
      ),
    [data, fullData]
  );

  const chartSection = useMemo(
    () =>
      getSection(
        apiRoot,
        [activeChart.key]
      ),
    [apiRoot, activeChart]
  );

  const planets = useMemo(
    () =>
      getNormalizedPlanets(
        chartSection
      ),
    [chartSection]
  );

  const chartPlanets = useMemo(() => {
    const houses = chartSection?.houses;

    if (
      !houses ||
      typeof houses !== "object"
    ) {
      return planets;
    }

    const houseEntries = Array.isArray(houses)
      ? houses.map((item, index) => [
          item?.house ?? index + 1,
          item?.planets ?? item?.occupants ?? item?.grahas ?? [],
        ])
      : Object.entries(houses);

    const planetsByHouse = houseEntries.flatMap(
      ([houseValue, occupants]) => {
        const house = Number(houseValue);
        const housePlanets = Array.isArray(occupants)
          ? occupants
          : occupants?.planets ??
            occupants?.occupants ??
            occupants?.grahas ??
            [];

        if (
          !Number.isInteger(house) ||
          house < 1 ||
          house > 12 ||
          !Array.isArray(housePlanets)
        ) {
          return [];
        }

        return housePlanets.map((planet) =>
          normalizePlanet({
            ...planet,
            house: planet?.house ?? house,
          })
        );
      }
    );

    return planetsByHouse.length
      ? planetsByHouse
      : planets;
  }, [chartSection, planets]);

  const svgXml = useMemo(
    () =>
      getChartSvg(
        chartSection
      ),
    [chartSection]
  );

  const signData = useMemo(
    () =>
      planets.map(
        (planet) => [
          getValue(
            planet.name
          ),
          getValue(
            planet.sign
          ),
          getValue(
            planet.signLord
          ),
          getValue(
            planet.degree
          ),
          getRetrogradeText(
            planet
          ),
          getValue(
            planet.house
          ),
        ]
      ),
    [planets]
  );

  const nakshatraData = useMemo(
    () =>
      planets.map(
        (planet) => [
          getValue(
            planet.name
          ),
          getValue(
            planet.nakshatra
          ),
          getValue(
            planet.nakshatraLord
          ),
          getValue(
            planet.house
          ),
        ]
      ),
    [planets]
  );

  useEffect(() => {
    console.log("[Kundli Charts] section diagnostics", {
      chartKey: activeChart.key,
      sectionFound: Boolean(apiRoot?.[activeChart.key]),
      sectionKeys: Object.keys(chartSection || {}),
      housesType: Array.isArray(chartSection?.houses)
        ? "array"
        : typeof chartSection?.houses,
      houseCount:
        chartSection?.houses &&
        typeof chartSection.houses === "object"
          ? Object.keys(chartSection.houses).length
          : 0,
      svgType: typeof svgXml,
      svgLength:
        typeof svgXml === "string"
          ? svgXml.length
          : 0,
      normalizedPlanets: planets.length,
      chartPlanets: chartPlanets.length,
    });
  }, [
    activeChart.key,
    apiRoot,
    chartPlanets.length,
    chartSection,
    planets.length,
    svgXml,
  ]);

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>
        {activeChart.label} Chart
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
      >
        <View
          style={styles.chartBtnRow}
        >
          {chartTypes.map(
            (item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() =>
                  setActiveChart(
                    item
                  )
                }
                style={[
                  styles.pillBtn,
                  activeChart.key ===
                    item.key &&
                    styles.activePillBtn,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    activeChart.key ===
                      item.key &&
                      styles.activePillText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>

      {svgXml ? (
        <VedicChart
          svgXml={svgXml}
          size={chartSize}
        />
      ) : (
        <VedicChart
          planets={chartPlanets}
          size={chartSize}
        />
      )}

      <Text style={styles.title}>
        Planets
      </Text>

      <View
        style={styles.planetTabRow}
      >
        {planetTabs.map(
          (item) => (
            <TouchableOpacity
              key={item}
              onPress={() =>
                setActivePlanetTab(
                  item
                )
              }
              style={[
                styles.smallPillBtn,
                activePlanetTab ===
                  item &&
                  styles.activePillBtn,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  activePlanetTab ===
                    item &&
                    styles.activePillText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {activePlanetTab ===
      "Sign" ? (
        <PlanetTable
          headers={[
            "Planets",
            "Sign",
            "Sign Lord",
            "Degree",
            "Retrograde",
            "House",
          ]}
          data={signData}
        />
      ) : (
        <PlanetTable
          headers={[
            "Planets",
            "Nakshatra",
            "Naksh Lord",
            "House",
          ]}
          data={nakshatraData}
        />
      )}

      <TouchableOpacity
        style={styles.button}
      >
        <Text
          style={styles.buttonText}
        >
          ☏ Consult An Expert
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PlanetTable = ({
  headers,
  data,
}) => {
  if (!data.length) {
    return (
      <View
        style={styles.emptyContainer}
      >
        <Text
          style={styles.emptyText}
        >
          No planetary data available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={
        false
      }
    >
      <View style={styles.table}>
        <View
          style={styles.headerRow}
        >
          {headers.map(
            (header) => (
              <Text
                key={header}
                style={
                  styles.headerCell
                }
              >
                {header}
              </Text>
            )
          )}
        </View>

        {data.map(
          (row, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.tableRow,
                rowIndex % 2 ===
                  0 &&
                  styles.lightRow,
              ]}
            >
              {row.map(
                (
                  cell,
                  cellIndex
                ) => (
                  <Text
                    key={cellIndex}
                    style={
                      styles.bodyCell
                    }
                  >
                    {getValue(cell)}
                  </Text>
                )
              )}
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default ChartsTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
  },

  title: {
    fontSize: RF(15),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1),
  },

  chartBtnRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2),
  },

  pillBtn: {
    width: wp(25),
    height: hp(4),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },

  activePillBtn: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },

  pillText: {
    fontSize: RF(10),
    color: "#111",
    fontWeight: "500",
  },

  activePillText: {
    color: "#fff",
    fontWeight: "700",
  },

  planetTabRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(1.5),
  },

  smallPillBtn: {
    width: wp(25),
    height: hp(4),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },

  table: {
    minWidth: wp(110),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    overflow: "hidden",
    marginBottom: hp(2),
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
  },

  headerCell: {
    width: wp(18),
    minHeight: hp(4.5),
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: wp(1),
  },

  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  lightRow: {
    backgroundColor: LIGHT,
  },

  bodyCell: {
    width: wp(18),
    minHeight: hp(4.5),
    color: "#111",
    fontSize: RF(9),
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: wp(1),
  },

  emptyContainer: {
    padding: hp(2.5),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    alignItems: "center",
    marginBottom: hp(2),
  },

  emptyText: {
    color: "#888",
    fontSize: RF(11),
  },

  button: {
    height: hp(5.2),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});