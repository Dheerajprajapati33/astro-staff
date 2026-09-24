import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const LIGHT = "#fff8ef";

const dashaTabs = ["Major dasha", "Yogini"];

/*
|--------------------------------------------------------------------------
| Planet Normalization
|--------------------------------------------------------------------------
| API may return Hindi names while some frontend data may use English names.
| This helper makes filtering work in both cases.
|--------------------------------------------------------------------------
*/

const PLANET_MAP = {
  // Hindi
  "राहु": "rahu",
  "केतु": "ketu",
  "गुरू": "jupiter",
  "गुरु": "jupiter",
  "बृहस्पति": "jupiter",
  "शनि": "saturn",
  "बुध": "mercury",
  "शुक्र": "venus",
  "सूर्य": "sun",
  "चंद्र": "moon",
  "चन्द्र": "moon",
  "मंगल": "mars",

  // English
  rahu: "rahu",
  ketu: "ketu",
  jupiter: "jupiter",
  saturn: "saturn",
  mercury: "mercury",
  venus: "venus",
  sun: "sun",
  moon: "moon",
  mars: "mars",
};

const normalizePlanet = (name = "") => {
  const value = String(name).trim().toLowerCase();

  return PLANET_MAP[value] || value;
};

/*
|--------------------------------------------------------------------------
| Fallback Mahadasha Data
|--------------------------------------------------------------------------
| Used only if API data is unavailable.
|--------------------------------------------------------------------------
*/

const majorFallbackData = [
  {
    name: "Ketu",
    startDate: "15-06-1973",
    endDate: "15-06-1980",
  },
  {
    name: "Venus",
    startDate: "15-06-1980",
    endDate: "15-06-2000",
  },
  {
    name: "Sun",
    startDate: "15-06-2000",
    endDate: "15-06-2006",
  },
  {
    name: "Moon",
    startDate: "15-06-2006",
    endDate: "15-06-2016",
  },
  {
    name: "Mars",
    startDate: "15-06-2016",
    endDate: "16-06-2023",
  },
  {
    name: "Rahu",
    startDate: "16-06-2023",
    endDate: "15-06-2041",
  },
  {
    name: "Jupiter",
    startDate: "15-06-2041",
    endDate: "15-06-2057",
  },
  {
    name: "Saturn",
    startDate: "15-06-2057",
    endDate: "15-06-2076",
  },
  {
    name: "Mercury",
    startDate: "15-06-2076",
    endDate: "15-06-2093",
  },
];

const yoginiFallbackData = [
  {
    name: "Bhadrika",
    startDate: "Birth",
    endDate: "23-07-1981",
  },
  {
    name: "Ulka",
    startDate: "23-07-1981",
    endDate: "23-07-1987",
  },
  {
    name: "Siddha",
    startDate: "23-07-1987",
    endDate: "23-07-1994",
  },
  {
    name: "Sankata",
    startDate: "23-07-1994",
    endDate: "23-07-2002",
  },
  {
    name: "Mangala",
    startDate: "23-07-2002",
    endDate: "23-07-2003",
  },
  {
    name: "Pingala",
    startDate: "23-07-2003",
    endDate: "23-07-2005",
  },
  {
    name: "Dhanya",
    startDate: "23-07-2005",
    endDate: "23-07-2008",
  },
  {
    name: "Bhramari",
    startDate: "23-07-2008",
    endDate: "23-07-2012",
  },
];

/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

const formatDashaDate = (value) => {
  if (!value) return "-";

  if (typeof value !== "string") {
    return String(value);
  }

  /*
   * API can return:
   * 2026-06-23
   * 2026-06-23T04:48:58+05:30
   */

  if (value.includes("T")) {
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }

    return value.split("T")[0];
  }

  /*
   * Convert YYYY-MM-DD → DD-MM-YYYY
   */

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;

    return `${day}-${month}-${year}`;
  }

  /*
   * Already DD-MM-YYYY
   */

  return value;
};

/*
|--------------------------------------------------------------------------
| Extract API Root
|--------------------------------------------------------------------------
| Depending on your API service, the component may receive:
|
| data = API data object
|
| OR
|
| data = {
|   success: true,
|   data: {...}
| }
|
| This helper supports both.
|--------------------------------------------------------------------------
*/

const getApiRoot = (data, fullData) => {
  if (fullData?.data && typeof fullData.data === "object") {
    return fullData.data;
  }

  if (data?.data && typeof data.data === "object") {
    return data.data;
  }

  return fullData || data || {};
};

/*
|--------------------------------------------------------------------------
| Dasha Component
|--------------------------------------------------------------------------
*/

const DashaTab = ({ data, fullData }) => {
  const [activeTab, setActiveTab] = useState("Major dasha");

  const [selectedMahadasha, setSelectedMahadasha] = useState(null);

  const [selectedAntardasha, setSelectedAntardasha] = useState(null);

  const isYogini = activeTab === "Yogini";

  /*
  |--------------------------------------------------------------------------
  | API ROOT
  |--------------------------------------------------------------------------
  */

  const apiRoot = useMemo(() => {
    return getApiRoot(data, fullData);
  }, [data, fullData]);

  /*
  |--------------------------------------------------------------------------
  | Level 1: Mahadasha
  |--------------------------------------------------------------------------
  |
  | Correct API:
  |
  | data["5_mahadasha"].list
  |
  |--------------------------------------------------------------------------
  */

  const mahadashaList = useMemo(() => {
    const mahaData = apiRoot?.["5_mahadasha"];

    if (
      mahaData &&
      Array.isArray(mahaData.list) &&
      mahaData.list.length > 0
    ) {
      return mahaData.list.map((item) => ({
        id: item.id,

        name:
          item.planet ||
          item.name ||
          "Planet",

        startDate: formatDashaDate(
          item.startDate || item.start
        ),

        endDate: formatDashaDate(
          item.endDate || item.end
        ),

        rawStart:
          item.startDate ||
          item.start,

        rawEnd:
          item.endDate ||
          item.end,
      }));
    }

    /*
     * Fallback only when API data is unavailable.
     */

    return [];
  }, [apiRoot]);

  /*
  |--------------------------------------------------------------------------
  | Yogini Dasha
  |--------------------------------------------------------------------------
  */

  const yoginiList = useMemo(() => {
    const raw =
      apiRoot?.["yogini"] ||
      apiRoot?.["yogini_dasha"];

    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => ({
        name:
          item.planet ||
          item.name ||
          "Dasha",

        ruler:
          item.ruler ||
          "-",

        startDate: formatDashaDate(
          item.startDate ||
            item.start
        ),

        endDate: formatDashaDate(
          item.endDate ||
            item.end
        ),
      }));
    }

    return [];
  }, [apiRoot]);

  /*
  |--------------------------------------------------------------------------
  | Level 2: Antardasha
  |--------------------------------------------------------------------------
  |
  | Correct API:
  |
  | data["6_antardasha"].list
  |
  | Example:
  |
  | Rahu Mahadasha
  |
  | Rahu     16-06-2023 → 26-02-2026
  | Jupiter  26-02-2026 → 21-07-2028
  | Saturn   21-07-2028 → 28-05-2031
  |
  |--------------------------------------------------------------------------
  */

  const antardashaList = useMemo(() => {
    if (!selectedMahadasha) {
      return [];
    }

    const antarData = apiRoot?.["6_antardasha"];

    if (
      !antarData ||
      !Array.isArray(antarData.list)
    ) {
      return [];
    }

    const selectedMahaPlanet =
      normalizePlanet(
        selectedMahadasha.name
      );

    const filtered = antarData.list.filter(
      (item) => {
        const itemMahaPlanet =
          normalizePlanet(
            item.mahadasha
          );

        return (
          itemMahaPlanet ===
          selectedMahaPlanet
        );
      }
    );

    return filtered.map((item) => ({
      id: item.id,

      name:
        item.planet ||
        item.name ||
        "Planet",

      startDate: formatDashaDate(
        item.startDate ||
          item.start
      ),

      endDate: formatDashaDate(
        item.endDate ||
          item.end
      ),

      rawStart:
        item.startDate ||
        item.start,

      rawEnd:
        item.endDate ||
        item.end,

      /*
       * We don't calculate Pratyantardasha here.
       * It comes directly from the API's
       * 7_pratyantardasha.list.
       */
    }));
  }, [selectedMahadasha, apiRoot]);

  /*
  |--------------------------------------------------------------------------
  | Level 3: Pratyantardasha
  |--------------------------------------------------------------------------
  |
  | Correct API:
  |
  | data["7_pratyantardasha"].list
  |
  |--------------------------------------------------------------------------
  */

  const pratyantardashaList = useMemo(() => {
    if (
      !selectedMahadasha ||
      !selectedAntardasha
    ) {
      return [];
    }

    const pratyaData =
      apiRoot?.["7_pratyantardasha"];

    if (
      !pratyaData ||
      !Array.isArray(pratyaData.list)
    ) {
      return [];
    }

    const selectedMahaPlanet =
      normalizePlanet(
        selectedMahadasha.name
      );

    const selectedAntarPlanet =
      normalizePlanet(
        selectedAntardasha.name
      );

    const filtered =
      pratyaData.list.filter(
        (item) => {
          const itemMahaPlanet =
            normalizePlanet(
              item.mahadasha
            );

          const itemAntarPlanet =
            normalizePlanet(
              item.antardasha
            );

          return (
            itemMahaPlanet ===
              selectedMahaPlanet &&
            itemAntarPlanet ===
              selectedAntarPlanet
          );
        }
      );

    return filtered.map((item) => ({
      id: item.id,

      name:
        item.planet ||
        item.name ||
        "Planet",

      startDate: formatDashaDate(
        item.startDate ||
          item.start
      ),

      endDate: formatDashaDate(
        item.endDate ||
          item.end
      ),
    }));
  }, [
    selectedMahadasha,
    selectedAntardasha,
    apiRoot,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Tab Switch
  |--------------------------------------------------------------------------
  */

  const handleTabSwitch = (item) => {
    setActiveTab(item);

    setSelectedMahadasha(null);

    setSelectedAntardasha(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.container}>

      {/* =========================================================
          Major Dasha / Yogini
      ========================================================= */}

      <View style={styles.switchRow}>
        {dashaTabs.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() =>
              handleTabSwitch(item)
            }
            activeOpacity={0.8}
            style={[
              styles.switchBtn,

              activeTab === item &&
                styles.activeSwitchBtn,
            ]}
          >
            <Text
              style={[
                styles.switchText,

                activeTab === item &&
                  styles.activeSwitchText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* =========================================================
          Breadcrumb
      ========================================================= */}

      {!isYogini && (
        <View style={styles.pathRow}>

          {/* Mahadasha */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedMahadasha(null);

              setSelectedAntardasha(null);
            }}
          >
            <Text
              style={[
                styles.breadcrumbText,

                !selectedMahadasha &&
                  styles.breadcrumbActive,
              ]}
            >
              Mahadasha
            </Text>
          </TouchableOpacity>

          <Text style={styles.arrow}>
            ›
          </Text>

          {/* Antardasha */}

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!selectedMahadasha}
            onPress={() =>
              setSelectedAntardasha(null)
            }
          >
            <Text
              style={[
                styles.breadcrumbText,

                selectedMahadasha &&
                  !selectedAntardasha &&
                  styles.breadcrumbActive,

                !selectedMahadasha &&
                  styles.breadcrumbDisabled,
              ]}
            >
              {selectedMahadasha
                ? `Antardasha (${selectedMahadasha.name})`
                : "Antardasha"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.arrow}>
            ›
          </Text>

          {/* Pratyantar */}

          <Text
            style={[
              styles.breadcrumbText,

              selectedAntardasha &&
                styles.breadcrumbActive,

              !selectedAntardasha &&
                styles.breadcrumbDisabled,
            ]}
          >
            {selectedAntardasha
              ? `Pratyantar (${selectedAntardasha.name})`
              : "PratyantarDasha"}
          </Text>
        </View>
      )}

      {/* =========================================================
          Yogini Header
      ========================================================= */}

      {isYogini && (
        <View style={styles.pathRow}>
          <Text
            style={
              styles.breadcrumbActive
            }
          >
            Yogini Dasha
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>

          <Text
            style={styles.breadcrumbText}
          >
            Cycle Periods
          </Text>
        </View>
      )}

      {/* =========================================================
          Table Content
      ========================================================= */}

      {isYogini ? (

        /*
        |--------------------------------------------------------------------------
        | Yogini
        |--------------------------------------------------------------------------
        */

        <DashaTable
          headers={[
            "Dasha",
            "Ruler",
            "Start Date",
            "End Date",
          ]}
          data={yoginiList.map(
            (item) => [
              item.name,
              item.ruler,
              item.startDate,
              item.endDate,
            ]
          )}
        />

      ) : selectedAntardasha ? (

        /*
        |--------------------------------------------------------------------------
        | Level 3: Pratyantardasha
        |--------------------------------------------------------------------------
        */

        <View>

          <View style={styles.subHeaderBox}>

            <TouchableOpacity
              onPress={() =>
                setSelectedAntardasha(
                  null
                )
              }
              style={styles.backButton}
            >
              <Text
                style={
                  styles.backButtonText
                }
              >
                ‹ Back to Antardasha
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.subHeaderTitle
              }
            >
              {selectedMahadasha?.name} ›{" "}
              {selectedAntardasha?.name}{" "}
              Pratyantardashas
            </Text>

          </View>

          <DashaTable
            headers={[
              "Pratyantar Lord",
              "Start Date",
              "End Date",
            ]}
            data={pratyantardashaList.map(
              (item) => [
                item.name,
                item.startDate,
                item.endDate,
              ]
            )}
          />

        </View>

      ) : selectedMahadasha ? (

        /*
        |--------------------------------------------------------------------------
        | Level 2: Antardasha
        |--------------------------------------------------------------------------
        */

        <View>

          <View style={styles.subHeaderBox}>

            <TouchableOpacity
              onPress={() =>
                setSelectedMahadasha(
                  null
                )
              }
              style={styles.backButton}
            >
              <Text
                style={
                  styles.backButtonText
                }
              >
                ‹ Back to Mahadashas
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.subHeaderTitle
              }
            >
              {selectedMahadasha?.name}{" "}
              Mahadasha Antardashas
            </Text>

          </View>

          <DashaTable
            headers={[
              "Antardasha Lord",
              "Start Date",
              "End Date",
            ]}
            data={antardashaList.map(
              (item) => [
                item.name,
                item.startDate,
                item.endDate,
              ]
            )}
            showArrow
            onRowPress={(index) => {
              if (
                antardashaList[index]
              ) {
                setSelectedAntardasha(
                  antardashaList[index]
                );
              }
            }}
          />

        </View>

      ) : (

        /*
        |--------------------------------------------------------------------------
        | Level 1: Mahadasha
        |--------------------------------------------------------------------------
        */

        <DashaTable
          headers={[
            "Mahadasha Lord",
            "Start Date",
            "End Date",
          ]}
          data={mahadashaList.map(
            (item) => [
              item.name,
              item.startDate,
              item.endDate,
            ]
          )}
          showArrow
          onRowPress={(index) => {
            if (
              mahadashaList[index]
            ) {
              setSelectedMahadasha(
                mahadashaList[index]
              );
            }
          }}
        />

      )}

      {/* =========================================================
          Consult Button
      ========================================================= */}

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
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

/*
|--------------------------------------------------------------------------
| Dasha Table
|--------------------------------------------------------------------------
*/

const DashaTable = ({
  headers,
  data,
  showArrow = false,
  onRowPress,
}) => {
  return (
    <View style={styles.table}>

      {/* Header */}

      <View style={styles.headerRow}>

        {headers.map(
          (header, index) => (
            <Text
              key={index}
              style={
                styles.headerCell
              }
            >
              {header}
            </Text>
          )
        )}

        {showArrow && (
          <Text
            style={styles.iconHeader}
          />
        )}

      </View>

      {/* Rows */}

      {data.map((row, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={
            onRowPress
              ? 0.7
              : 1
          }
          onPress={() =>
            onRowPress &&
            onRowPress(index)
          }
          style={[
            styles.row,

            index % 2 === 0 &&
              styles.lightRow,
          ]}
        >

          {row.map(
            (cell, cellIndex) => (
              <Text
                key={cellIndex}
                style={
                  styles.bodyCell
                }
              >
                {cell}
              </Text>
            )
          )}

          {showArrow && (
            <Text
              style={
                styles.iconCell
              }
            >
              ›
            </Text>
          )}

        </TouchableOpacity>
      ))}

    </View>
  );
};

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
  },

  switchRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2),
  },

  switchBtn: {
    width: wp(32),
    height: hp(4.2),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  activeSwitchBtn: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },

  switchText: {
    fontSize: RF(11),
    color: "#111",
    fontWeight: "600",
  },

  activeSwitchText: {
    color: "#fff",
  },

  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.8),
    flexWrap: "wrap",
  },

  breadcrumbText: {
    fontSize: RF(11.5),
    color: "#777",
    fontWeight: "600",
  },

  breadcrumbActive: {
    color: ORANGE,
    fontWeight: "700",
  },

  breadcrumbDisabled: {
    color: "#aaa",
    fontWeight: "400",
  },

  arrow: {
    fontSize: RF(18),
    color: "#999",
    marginHorizontal: wp(2),
  },

  subHeaderBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.2),
  },

  backButton: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    backgroundColor: "#ffece2",
    borderRadius: wp(1.5),
  },

  backButtonText: {
    color: ORANGE,
    fontSize: RF(10.5),
    fontWeight: "700",
  },

  subHeaderTitle: {
    fontSize: RF(11),
    fontWeight: "600",
    color: "#333",
  },

  table: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#ff8a50",
    overflow: "hidden",
    marginBottom: hp(2),
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
    minHeight: hp(5),
    alignItems: "center",
  },

  headerCell: {
    flex: 1,
    color: "#fff",
    fontSize: RF(10),
    textAlign: "center",
    fontWeight: "700",
    paddingHorizontal: wp(1),
  },

  iconHeader: {
    width: wp(6),
  },

  row: {
    flexDirection: "row",
    minHeight: hp(5.2),
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ffd6c2",
  },

  lightRow: {
    backgroundColor: LIGHT,
  },

  bodyCell: {
    flex: 1,
    textAlign: "center",
    fontSize: RF(10.5),
    color: "#111",
    fontWeight: "400",
    paddingHorizontal: wp(1),
  },

  iconCell: {
    width: wp(6),
    textAlign: "center",
    fontSize: RF(18),
    color: ORANGE,
    fontWeight: "700",
  },

  button: {
    height: hp(5.4),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.5),
  },

  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});

export default DashaTab;