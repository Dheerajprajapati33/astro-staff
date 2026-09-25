import React, {
  useMemo,
  useState,
} from "react";

import {
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

const ORANGE = "#ff5a00";
const LIGHT = "#fff8ef";

// =====================================================
// PLANET MAP
// =====================================================

const PLANET_MAP = {
  rahu: "rahu",
  ketu: "ketu",
  jupiter: "jupiter",
  guru: "jupiter",
  brihaspati: "jupiter",
  saturn: "saturn",
  shani: "saturn",
  mercury: "mercury",
  budh: "mercury",
  venus: "venus",
  shukra: "venus",
  sun: "sun",
  surya: "sun",
  moon: "moon",
  chandra: "moon",
  mars: "mars",
  mangal: "mars",

  "राहु": "rahu",
  "केतु": "ketu",
  "गुरु": "jupiter",
  "गुरू": "jupiter",
  "बृहस्पति": "jupiter",
  "शनि": "saturn",
  "बुध": "mercury",
  "शुक्र": "venus",
  "सूर्य": "sun",
  "चंद्र": "moon",
  "चन्द्र": "moon",
  "मंगल": "mars",
};

// =====================================================
// NORMALIZE PLANET
// =====================================================

const normalizePlanet = (value) => {
  const key = String(value || "")
    .trim()
    .toLowerCase();

  return PLANET_MAP[key] || key;
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDashaDate = (value) => {
  if (!value) return "-";

  const text = String(value).trim();

  if (!text) return "-";

  // ISO datetime
  if (text.includes("T")) {
    const date = new Date(text);

    if (!Number.isNaN(date.getTime())) {
      const day = String(
        date.getDate()
      ).padStart(2, "0");

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }
  }

  // YYYY-MM-DD
  const iso = text.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (iso) {
    return `${iso[3]}-${iso[2]}-${iso[1]}`;
  }

  return text;
};

// =====================================================
// GET API ROOT
// =====================================================

const getApiRoot = (
  data,
  fullData
) => {
  if (
    fullData?.data &&
    typeof fullData.data === "object"
  ) {
    return fullData.data;
  }

  if (
    data?.data &&
    typeof data.data === "object"
  ) {
    return data.data;
  }

  return fullData || data || {};
};

// =====================================================
// GET PLANET NAME
// =====================================================

const getPlanetName = (item) => {
  return (
    item?.planet ||
    item?.name ||
    item?.ruler ||
    item?.lord ||
    item?.planetName ||
    item?.planet_name ||
    "-"
  );
};

// =====================================================
// GET START DATE
// =====================================================

const getStart = (item) =>
  formatDashaDate(
    item?.startDate ||
      item?.start_date ||
      item?.start ||
      item?.from ||
      item?.fromDate ||
      item?.from_date
  );

// =====================================================
// GET END DATE
// =====================================================

const getEnd = (item) =>
  formatDashaDate(
    item?.endDate ||
      item?.end_date ||
      item?.end ||
      item?.to ||
      item?.toDate ||
      item?.to_date
  );

// =====================================================
// GET MAHADASHA FROM ANTARDASHA
// =====================================================

const getMahaFromItem = (item) => {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  return (
    item?.mahadasha ||
    item?.maha ||
    item?.mahadashaPlanet ||
    item?.mahadasha_planet ||
    item?.mahaLord ||
    item?.mahadashaLord ||
    item?.mahadasha_lord ||
    item?.parent ||
    item?.parentPlanet ||
    item?.parent_planet ||
    null
  );
};

// =====================================================
// GET ANTARDASHA FROM PRATYANTARDASHA
// =====================================================

const getAntarFromItem = (item) => {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  return (
    item?.antardasha ||
    item?.antar ||
    item?.antardashaPlanet ||
    item?.antardasha_planet ||
    item?.antarLord ||
    item?.antardashaLord ||
    item?.antardasha_lord ||
    item?.parentAntardasha ||
    item?.parent_antar ||
    null
  );
};

// =====================================================
// FLATTEN ANTARDASHA LIST
// =====================================================

const flattenAntardashaList = (
  list
) => {
  if (!Array.isArray(list)) {
    return [];
  }

  const result = [];

  list.forEach(
    (item, index) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return;
      }

      const nested =
        item?.antardasha ||
        item?.antardashas ||
        item?.antarDashas ||
        item?.children ||
        item?.items ||
        item?.list;

      /*
       * If antardasha is an ARRAY,
       * this object is probably a
       * Mahadasha group.
       */

      if (Array.isArray(nested)) {
        const parentMaha =
          item?.mahadasha ||
          item?.maha ||
          item?.mahadashaPlanet ||
          item?.mahadasha_planet ||
          item?.mahaLord ||
          item?.mahadashaLord ||
          item?.mahadasha_lord ||
          item?.planet ||
          item?.name ||
          item?.lord;

        nested.forEach(
          (
            child,
            childIndex
          ) => {
            if (
              child &&
              typeof child === "object"
            ) {
              result.push({
                ...child,

                /*
                 * Preserve parent's
                 * Mahadasha so filtering
                 * works correctly.
                 */

                __parentMahadasha:
                  parentMaha,

                __originalIndex:
                  `${index}-${childIndex}`,
              });
            }
          }
        );

        return;
      }

      result.push({
        ...item,
        __originalIndex: index,
      });
    }
  );

  return result;
};

// =====================================================
// GET FLATTENED MAHADASHA
// =====================================================

const getFlattenedMaha = (
  item
) => {
  return (
    getMahaFromItem(item) ||
    item?.__parentMahadasha ||
    null
  );
};

// =====================================================
// FLATTEN PRATYANTARDASHA LIST
// =====================================================

const flattenPratyantardashaList = (
  list
) => {
  if (!Array.isArray(list)) {
    return [];
  }

  const result = [];

  list.forEach(
    (item, index) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return;
      }

      const nested =
        item?.pratyantardasha ||
        item?.pratyantardashas ||
        item?.pratyantarDashas ||
        item?.children ||
        item?.items ||
        item?.list;

      if (Array.isArray(nested)) {
        const parentMaha =
          item?.mahadasha ||
          item?.maha ||
          item?.mahadashaPlanet ||
          item?.mahadasha_planet ||
          item?.mahaLord ||
          item?.mahadashaLord ||
          item?.mahadasha_lord;

        const parentAntar =
          item?.antardasha ||
          item?.antar ||
          item?.antardashaPlanet ||
          item?.antardasha_planet ||
          item?.antarLord ||
          item?.antardashaLord ||
          item?.antardasha_lord;

        nested.forEach(
          (
            child,
            childIndex
          ) => {
            if (
              child &&
              typeof child === "object"
            ) {
              result.push({
                ...child,

                __parentMahadasha:
                  parentMaha,

                __parentAntardasha:
                  parentAntar,

                __originalIndex:
                  `${index}-${childIndex}`,
              });
            }
          }
        );

        return;
      }

      result.push({
        ...item,
        __originalIndex: index,
      });
    }
  );

  return result;
};

// =====================================================
// GET FLATTENED ANTARDASHA
// =====================================================

const getFlattenedAntar = (
  item
) => {
  return (
    getAntarFromItem(item) ||
    item?.__parentAntardasha ||
    null
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const DashaTab = ({
  data,
  fullData,
}) => {
  const [
    selectedMahadasha,
    setSelectedMahadasha,
  ] = useState(null);

  const [
    selectedAntardasha,
    setSelectedAntardasha,
  ] = useState(null);

  // =====================================================
  // API ROOT
  // =====================================================

  const apiRoot = useMemo(
    () =>
      getApiRoot(
        data,
        fullData
      ),
    [data, fullData]
  );

  // =====================================================
  // MAHADASHA
  // =====================================================

  const mahadashaList =
    useMemo(() => {
      const list =
        apiRoot?.[
          "5_mahadasha"
        ]?.list;

      if (!Array.isArray(list)) {
        console.log(
          "❌ Mahadasha list missing:",
          apiRoot?.[
            "5_mahadasha"
          ]
        );

        return [];
      }

      return list.map(
        (
          item,
          index
        ) => ({
          id:
            item?.id ??
            index,

          name:
            getPlanetName(
              item
            ),

          startDate:
            getStart(item),

          endDate:
            getEnd(item),

          raw: item,
        })
      );
    }, [apiRoot]);

  // =====================================================
  // ANTARDASHA
  // =====================================================

  const antardashaList =
    useMemo(() => {
      if (!selectedMahadasha) {
        return [];
      }

      const rawList =
        apiRoot?.[
          "6_antardasha"
        ]?.list;

      if (!Array.isArray(rawList)) {
        console.log(
          "❌ Antardasha list missing:",
          apiRoot?.[
            "6_antardasha"
          ]
        );

        return [];
      }

      const list =
        flattenAntardashaList(
          rawList
        );

      const selected =
        normalizePlanet(
          selectedMahadasha.name
        );

      console.log(
        "================================"
      );

      console.log(
        "🔎 Selected Mahadasha:",
        selectedMahadasha.name
      );

      console.log(
        "🔎 Normalized Mahadasha:",
        selected
      );

      console.log(
        "🔎 Raw Antardasha count:",
        rawList.length
      );

      console.log(
        "🔎 Flattened Antardasha count:",
        list.length
      );

      console.log(
        "🔎 FULL ANTARDASHA:",
        JSON.stringify(
          rawList,
          null,
          2
        )
      );

      const filtered =
        list.filter(
          (item) => {
            const maha =
              getFlattenedMaha(
                item
              );

            const normalizedMaha =
              normalizePlanet(
                maha
              );

            console.log(
              "➡️ Antardasha item:",
              {
                maha,
                normalizedMaha,
                selected,
                name:
                  getPlanetName(
                    item
                  ),
              }
            );

            return (
              normalizedMaha ===
              selected
            );
          }
        );

      console.log(
        "✅ Filtered Antardasha:",
        JSON.stringify(
          filtered,
          null,
          2
        )
      );

      console.log(
        "================================"
      );

      return filtered.map(
        (
          item,
          index
        ) => ({
          id:
            item?.id ??
            item?.__originalIndex ??
            index,

          name:
            getPlanetName(
              item
            ),

          startDate:
            getStart(item),

          endDate:
            getEnd(item),

          raw: item,
        })
      );
    }, [
      apiRoot,
      selectedMahadasha,
    ]);

  // =====================================================
  // PRATYANTARDASHA
  // =====================================================

  const pratyantardashaList =
    useMemo(() => {
      if (
        !selectedMahadasha ||
        !selectedAntardasha
      ) {
        return [];
      }

      const rawList =
        apiRoot?.[
          "7_pratyantardasha"
        ]?.list;

      if (!Array.isArray(rawList)) {
        console.log(
          "❌ Pratyantardasha list missing:",
          apiRoot?.[
            "7_pratyantardasha"
          ]
        );

        return [];
      }

      const list =
        flattenPratyantardashaList(
          rawList
        );

      const maha =
        normalizePlanet(
          selectedMahadasha.name
        );

      const antar =
        normalizePlanet(
          selectedAntardasha.name
        );

      console.log(
        "================================"
      );

      console.log(
        "🔎 Selected Maha:",
        maha
      );

      console.log(
        "🔎 Selected Antar:",
        antar
      );

      console.log(
        "🔎 Raw Pratyantardasha count:",
        rawList.length
      );

      console.log(
        "🔎 Flattened Pratyantardasha count:",
        list.length
      );

      const filtered =
        list.filter(
          (item) => {
            const itemMaha =
              getFlattenedMaha(
                item
              );

            const itemAntar =
              getFlattenedAntar(
                item
              );

            const normalizedMaha =
              normalizePlanet(
                itemMaha
              );

            const normalizedAntar =
              normalizePlanet(
                itemAntar
              );

            console.log(
              "➡️ Pratyantardasha item:",
              {
                itemMaha,
                itemAntar,
                normalizedMaha,
                normalizedAntar,
                expectedMaha:
                  maha,
                expectedAntar:
                  antar,
                name:
                  getPlanetName(
                    item
                  ),
              }
            );

            return (
              normalizedMaha ===
                maha &&
              normalizedAntar ===
                antar
            );
          }
        );

      console.log(
        "✅ Filtered Pratyantardasha:",
        JSON.stringify(
          filtered,
          null,
          2
        )
      );

      console.log(
        "================================"
      );

      return filtered.map(
        (
          item,
          index
        ) => ({
          id:
            item?.id ??
            item?.__originalIndex ??
            index,

          name:
            getPlanetName(
              item
            ),

          startDate:
            getStart(item),

          endDate:
            getEnd(item),

          raw: item,
        })
      );
    }, [
      apiRoot,
      selectedMahadasha,
      selectedAntardasha,
    ]);

  // =====================================================
  // RESET SELECTION
  // =====================================================

  const resetSelection =
    () => {
      setSelectedMahadasha(
        null
      );

      setSelectedAntardasha(
        null
      );
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <View
      style={styles.container}
    >

      {/* MAJOR DASHA TAB */}

      <View
        style={styles.switchRow}
      >
        <View
          style={[
            styles.switchBtn,
            styles.activeSwitchBtn,
          ]}
        >
          <Text
            style={[
              styles.switchText,
              styles.activeSwitchText,
            ]}
          >
            Major dasha
          </Text>
        </View>
      </View>

      {/* BREADCRUMB */}

      <View
        style={styles.pathRow}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedMahadasha(
              null
            );

            setSelectedAntardasha(
              null
            );
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

        <Text
          style={styles.arrow}
        >
          ›
        </Text>

        <TouchableOpacity
          disabled={
            !selectedMahadasha
          }
          onPress={() =>
            setSelectedAntardasha(
              null
            )
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
            Antardasha
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.arrow}
        >
          ›
        </Text>

        <Text
          style={[
            styles.breadcrumbText,
            selectedAntardasha &&
              styles.breadcrumbActive,
            !selectedAntardasha &&
              styles.breadcrumbDisabled,
          ]}
        >
          Pratyantardasha
        </Text>
      </View>

      {/* =================================================
          LEVEL 3
          ================================================= */}

      {selectedAntardasha ? (
        <>
          <SubHeader
            title={`${selectedMahadasha?.name} › ${selectedAntardasha?.name} Pratyantardasha`}
            onBack={() =>
              setSelectedAntardasha(
                null
              )
            }
          />

          {pratyantardashaList.length ? (
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
          ) : (
            <EmptyData
              text="No Pratyantardasha data available"
            />
          )}
        </>
      ) : selectedMahadasha ? (
        <>
          <SubHeader
            title={`${selectedMahadasha.name} Antardashas`}
            onBack={() =>
              setSelectedMahadasha(
                null
              )
            }
          />

          {antardashaList.length ? (
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
              onRowPress={(
                index
              ) => {
                const item =
                  antardashaList[
                    index
                  ];

                if (item) {
                  setSelectedAntardasha(
                    item
                  );
                }
              }}
            />
          ) : (
            <EmptyData
              text="No Antardasha data available"
            />
          )}
        </>
      ) : (
        <>
          {mahadashaList.length ? (
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
              onRowPress={(
                index
              ) => {
                const item =
                  mahadashaList[
                    index
                  ];

                if (item) {
                  setSelectedMahadasha(
                    item
                  );
                }
              }}
            />
          ) : (
            <EmptyData
              text="No Mahadasha data available"
            />
          )}
        </>
      )}

      {/* =================================================
          CONSULT BUTTON
          ================================================= */}

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

// =====================================================
// SUB HEADER
// =====================================================

const SubHeader = ({
  title,
  onBack,
}) => (
  <View
    style={
      styles.subHeaderBox
    }
  >
    <TouchableOpacity
      onPress={onBack}
      style={styles.backButton}
    >
      <Text
        style={
          styles.backButtonText
        }
      >
        ‹ Back
      </Text>
    </TouchableOpacity>

    <Text
      style={
        styles.subHeaderTitle
      }
    >
      {title}
    </Text>
  </View>
);

// =====================================================
// EMPTY DATA
// =====================================================

const EmptyData = ({
  text,
}) => (
  <View
    style={
      styles.emptyContainer
    }
  >
    <Text
      style={styles.emptyText}
    >
      {text}
    </Text>
  </View>
);

// =====================================================
// DASHA TABLE
// =====================================================

const DashaTable = ({
  headers,
  data,
  showArrow = false,
  onRowPress,
}) => (
  <View style={styles.table}>
    {/* HEADER */}

    <View
      style={styles.headerRow}
    >
      {headers.map(
        (
          header,
          index
        ) => (
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

      {showArrow ? (
        <Text
          style={
            styles.iconHeader
          }
        />
      ) : null}
    </View>

    {/* ROWS */}

    {data.map(
      (
        row,
        rowIndex
      ) => (
        <TouchableOpacity
          key={rowIndex}
          activeOpacity={
            onRowPress
              ? 0.7
              : 1
          }
          onPress={() =>
            onRowPress?.(
              rowIndex
            )
          }
          style={[
            styles.row,
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
                {String(
                  cell ?? "-"
                )}
              </Text>
            )
          )}

          {showArrow ? (
            <Text
              style={
                styles.iconCell
              }
            >
              ›
            </Text>
          ) : null}
        </TouchableOpacity>
      )
    )}
  </View>
);

// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({
    container: {
      paddingBottom: hp(2),
    },

    switchRow: {
      flexDirection: "row",
      marginBottom: hp(2),
    },

    switchBtn: {
      flex: 1,
      height: hp(4.5),
      borderWidth: 1,
      borderColor: ORANGE,
      alignItems: "center",
      justifyContent:
        "center",
    },

    activeSwitchBtn: {
      backgroundColor:
        ORANGE,
    },

    switchText: {
      color: ORANGE,
      fontSize: RF(11),
      fontWeight: "600",
    },

    activeSwitchText: {
      color: "#fff",
    },

    pathRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(1.5),
      flexWrap: "wrap",
    },

    breadcrumbText: {
      color: "#777",
      fontSize: RF(10),
      fontWeight: "600",
    },

    breadcrumbActive: {
      color: ORANGE,
    },

    breadcrumbDisabled: {
      color: "#bbb",
    },

    arrow: {
      marginHorizontal: wp(2),
      color: "#999",
    },

    subHeaderBox: {
      marginBottom: hp(1.5),
    },

    backButton: {
      marginBottom: hp(0.7),
    },

    backButtonText: {
      color: ORANGE,
      fontSize: RF(10),
      fontWeight: "700",
    },

    subHeaderTitle: {
      color: "#111",
      fontSize: RF(12),
      fontWeight: "700",
    },

    table: {
      borderWidth: 1,
      borderColor: "#ff8a50",
      borderRadius: wp(2),
      overflow: "hidden",
      marginBottom: hp(2),
    },

    headerRow: {
      flexDirection: "row",
      backgroundColor:
        ORANGE,
    },

    headerCell: {
      flex: 1,
      minHeight: hp(5),
      color: "#fff",
      fontSize: RF(9),
      fontWeight: "700",
      textAlign: "center",
      textAlignVertical:
        "center",
      paddingHorizontal:
        wp(1),
    },

    iconHeader: {
      width: wp(8),
    },

    row: {
      flexDirection: "row",
      minHeight: hp(5),
      alignItems: "center",
      backgroundColor:
        "#fff",
    },

    lightRow: {
      backgroundColor: LIGHT,
    },

    bodyCell: {
      flex: 1,
      fontSize: RF(9),
      color: "#111",
      textAlign: "center",
      textAlignVertical:
        "center",
      paddingHorizontal:
        wp(1),
    },

    iconCell: {
      width: wp(8),
      textAlign: "center",
      fontSize: RF(18),
      color: ORANGE,
    },

    emptyContainer: {
      padding: hp(2.5),
      borderWidth: 1,
      borderColor: "#ff8a50",
      borderRadius: wp(2),
      alignItems: "center",
      marginBottom: hp(2),
    },

    emptyText: {
      color: "#888",
      fontSize: RF(11),
    },

    button: {
      height: hp(5.4),
      backgroundColor: ORANGE,
      borderRadius: wp(2),
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: hp(0.5),
    },

    buttonText: {
      color: "#fff",
      fontSize: RF(13),
      fontWeight: "700",
    },
  });

export default DashaTab;