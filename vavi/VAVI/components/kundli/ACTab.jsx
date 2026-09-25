import React, { useEffect, useMemo, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Svg, {
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";

import {
  hp,
  RF,
  wp,
} from "../../utils/responsive";

import {
  getApiRoot,
  getSection,
  getValue,
} from "./kundliApiHelpers";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const GREEN = "#0b6b1c";

const tabs = [
  "Sarv",
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

/* =========================================================
   NORTH INDIAN CHART COORDINATES
========================================================= */

const COORDINATES = {
  1: {
    signX: 200,
    signY: 165,
    scoreX: 200,
    scoreY: 80,
  },

  2: {
    signX: 130,
    signY: 70,
    scoreX: 75,
    scoreY: 40,
  },

  3: {
    signX: 70,
    signY: 130,
    scoreX: 35,
    scoreY: 75,
  },

  4: {
    signX: 165,
    signY: 200,
    scoreX: 85,
    scoreY: 200,
  },

  5: {
    signX: 70,
    signY: 270,
    scoreX: 35,
    scoreY: 325,
  },

  6: {
    signX: 130,
    signY: 330,
    scoreX: 75,
    scoreY: 360,
  },

  7: {
    signX: 200,
    signY: 235,
    scoreX: 200,
    scoreY: 320,
  },

  8: {
    signX: 270,
    signY: 330,
    scoreX: 325,
    scoreY: 360,
  },

  9: {
    signX: 330,
    signY: 270,
    scoreX: 365,
    scoreY: 325,
  },

  10: {
    signX: 235,
    signY: 200,
    scoreX: 315,
    scoreY: 200,
  },

  11: {
    signX: 330,
    signY: 130,
    scoreX: 365,
    scoreY: 75,
  },

  12: {
    signX: 270,
    signY: 70,
    scoreX: 325,
    scoreY: 40,
  },
};

/* =========================================================
   GET ASHTAKAVARGA SECTION
========================================================= */

const getAshtakavargaSection = (apiRoot) => {
  if (!apiRoot) {
    return null;
  }

  return getSection(apiRoot, [
    "8_ashtakavarga_points",

    // Fallbacks
    "8_ashtakvarga_points",
    "8_ashtakvarga",
    "8_ashtakavarga",
    "ashtakvarga",
    "ashtakavarga",
    "ashtak_varga",
  ]);
};

/* =========================================================
   DEBUG RAW API
========================================================= */

const printRawAshtakavarga = (section) => {
  if (!section) {
    console.log(
      "========== ASHTAKAVARGA =========="
    );

    console.log(
      "Ashtakavarga section not found."
    );

    console.log(
      "=================================="
    );

    return;
  }

  console.log(
    "========== ASHTAKAVARGA RAW =========="
  );

  console.log(
    JSON.stringify(
      section,
      null,
      2
    )
  );

  console.log(
    "======================================="
  );

  console.log(
    "Ashtakavarga total_points:",
    section?.total_points
  );

  console.log(
    "Ashtakavarga houses:",
    JSON.stringify(
      section?.houses,
      null,
      2
    )
  );

  console.log(
    "Bhinna Ashtakavarga:",
    JSON.stringify(
      section?.bhinnashtakavarga,
      null,
      2
    )
  );

  console.log(
    "======================================="
  );
};

/* =========================================================
   CHECK NUMERIC
========================================================= */

const isNumericValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return true;
  }

  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(
      Number(value)
    )
  ) {
    return true;
  }

  return false;
};

/* =========================================================
   NORMALIZE ARRAY
========================================================= */

const normalizeArray = (source) => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item) => {
    if (
      item === null ||
      item === undefined
    ) {
      return "-";
    }

    if (
      typeof item === "object"
    ) {
      return (
        item.score ??
        item.value ??
        item.bindu ??
        item.points ??
        item.total ??
        item.sarva ??
        item.count ??
        "-"
      );
    }

    return item;
  });
};

/* =========================================================
   RECURSIVELY FIND 12 VALUES
========================================================= */

const findTwelveValues = (
  source,
  depth = 0
) => {
  if (
    source === null ||
    source === undefined
  ) {
    return [];
  }

  if (depth > 8) {
    return [];
  }

  /* -------------------------------------------------------
     ARRAY
  ------------------------------------------------------- */

  if (Array.isArray(source)) {
    const normalized =
      normalizeArray(source);

    /*
     * Exact 12 values
     */
    if (
      normalized.length === 12
    ) {
      return normalized;
    }

    /*
     * More than 12
     */
    if (
      normalized.length > 12
    ) {
      const first12 =
        normalized.slice(
          0,
          12
        );

      if (
        first12.some(
          (item) =>
            item !== "-"
        )
      ) {
        return first12;
      }
    }

    /*
     * Search nested objects
     */
    for (
      const item of source
    ) {
      if (
        item &&
        typeof item === "object"
      ) {
        const result =
          findTwelveValues(
            item,
            depth + 1
          );

        if (
          result.length === 12
        ) {
          return result;
        }
      }
    }

    return [];
  }

  /* -------------------------------------------------------
     OBJECT
  ------------------------------------------------------- */

  if (
    typeof source === "object"
  ) {
    const keys =
      Object.keys(source);

    /*
     * Important keys first.
     */
    const priorityKeys = [
      "values",
      "scores",
      "points",
      "bindus",
      "houses",
      "houseValues",
      "house_values",
      "data",
      "chart",
      "result",
      "results",
    ];

    for (
      const key of priorityKeys
    ) {
      if (
        source[key] ===
        undefined
      ) {
        continue;
      }

      const result =
        findTwelveValues(
          source[key],
          depth + 1
        );

      if (
        result.length === 12
      ) {
        return result;
      }
    }

    /*
     * Object like:
     *
     * {
     *   "1": 30,
     *   "2": 25,
     *   ...
     * }
     */

    const numericKeys =
      keys.filter(
        (key) =>
          isNumericValue(
            source[key]
          )
      );

    if (
      numericKeys.length === 12
    ) {
      const sortedKeys =
        [...numericKeys].sort(
          (a, b) =>
            Number(a) -
            Number(b)
        );

      return sortedKeys.map(
        (key) =>
          source[key]
      );
    }

    /*
     * Search nested objects.
     */

    for (
      const key of keys
    ) {
      const value =
        source[key];

      if (
        value &&
        typeof value === "object"
      ) {
        const result =
          findTwelveValues(
            value,
            depth + 1
          );

        if (
          result.length === 12
        ) {
          return result;
        }
      }
    }
  }

  return [];
};

/* =========================================================
   GET SARV VALUES
========================================================= */

const getSarvValues = (
  section
) => {
  if (!section) {
    return [];
  }

  /*
   * Keep current working logic first.
   *
   * We will verify this against total_points
   * using the raw console output.
   */

  const candidates = [
    section?.houses,

    section?.sarvashtakavarga,
    section?.sarvashtakvarga,
    section?.sarv,
    section?.total,
    section?.scores,
    section?.values,

    section?.chart?.houses,
    section?.chart?.values,
  ];

  for (
    const source of candidates
  ) {
    if (
      !Array.isArray(source)
    ) {
      continue;
    }

    const values =
      normalizeArray(
        source
      );

    if (
      values.length === 12
    ) {
      return values;
    }

    const recursive =
      findTwelveValues(
        source
      );

    if (
      recursive.length ===
      12
    ) {
      return recursive;
    }
  }

  /*
   * Try recursively against complete section.
   */

  const recursive =
    findTwelveValues(
      section
    );

  if (
    recursive.length === 12
  ) {
    return recursive;
  }

  return [];
};

/* =========================================================
   PLANET ALIASES
========================================================= */

const PLANET_ALIASES = {
  Sun: [
    "Sun",
    "sun",
    "SUN",
    "Surya",
    "surya",
    "SURYA",
  ],

  Moon: [
    "Moon",
    "moon",
    "MOON",
    "Chandra",
    "chandra",
    "CHANDRA",
  ],

  Mars: [
    "Mars",
    "mars",
    "MARS",
    "Mangal",
    "mangal",
    "MANGAL",
  ],

  Mercury: [
    "Mercury",
    "mercury",
    "MERCURY",
    "Budh",
    "budh",
    "BUDH",
  ],

  Jupiter: [
    "Jupiter",
    "jupiter",
    "JUPITER",
    "Guru",
    "guru",
    "GURU",
  ],

  Venus: [
    "Venus",
    "venus",
    "VENUS",
    "Shukra",
    "shukra",
    "SHUKRA",
  ],

  Saturn: [
    "Saturn",
    "saturn",
    "SATURN",
    "Shani",
    "shani",
    "SHANI",
  ],
};

/* =========================================================
   FIND PLANET DATA RECURSIVELY
========================================================= */

const findPlanetData = (
  source,
  planet,
  depth = 0
) => {
  if (
    !source ||
    typeof source !== "object" ||
    depth > 8
  ) {
    return null;
  }

  const target =
    planet.toLowerCase();

  const aliases =
    PLANET_ALIASES[
      planet
    ] || [
      planet,
      target,
    ];

  const aliasSet =
    aliases.map(
      (item) =>
        item.toLowerCase()
    );

  for (
    const key of Object.keys(
      source
    )
  ) {
    const lowerKey =
      key.toLowerCase();

    if (
      aliasSet.includes(
        lowerKey
      )
    ) {
      return source[key];
    }
  }

  for (
    const key of Object.keys(
      source
    )
  ) {
    const value =
      source[key];

    if (
      value &&
      typeof value === "object"
    ) {
      const result =
        findPlanetData(
          value,
          planet,
          depth + 1
        );

      if (
        result !== null
      ) {
        return result;
      }
    }
  }

  return null;
};

/* =========================================================
   GET PLANET VALUES
========================================================= */

const getPlanetValues = (
  section,
  active
) => {
  if (
    !section ||
    active === "Sarv"
  ) {
    return [];
  }

  const bav =
    section?.bhinnashtakavarga;

  if (!bav) {
    return [];
  }

  /*
   * Find selected planet.
   */

  const planetData =
    findPlanetData(
      bav,
      active
    );

  if (
    planetData === null
  ) {
    return [];
  }

  /*
   * Find its 12 house values.
   */

  const values =
    findTwelveValues(
      planetData
    );

  if (
    values.length === 12
  ) {
    return values;
  }

  /*
   * Last fallback: recursively inspect
   * complete BAV object for selected planet.
   */

  const nestedPlanet =
    findPlanetData(
      section,
      active
    );

  if (
    nestedPlanet !== null
  ) {
    const nestedValues =
      findTwelveValues(
        nestedPlanet
      );

    if (
      nestedValues.length ===
      12
    ) {
      return nestedValues;
    }
  }

  return [];
};

/* =========================================================
   GET CURRENT VALUES
========================================================= */

const getValues = (
  section,
  active
) => {
  if (!section) {
    return [];
  }

  if (
    active === "Sarv"
  ) {
    return getSarvValues(
      section
    );
  }

  return getPlanetValues(
    section,
    active
  );
};

/* =========================================================
   GET ZODIAC SIGNS
========================================================= */

const getSignsFromApi = (
  section,
  apiRoot
) => {
  if (!section) {
    return [];
  }

  const candidates = [
    section?.houses,
    section?.chart?.houses,
  ];

  for (
    const source of candidates
  ) {
    if (
      !Array.isArray(source)
    ) {
      continue;
    }

    const signs =
      source.map(
        (item) => {
          if (
            item &&
            typeof item ===
              "object"
          ) {
            return (
              item.sign ??
              item.rasi ??
              item.zodiac ??
              item.signNumber ??
              item.sign_number ??
              item.rashi ??
              "-"
            );
          }

          return "-";
        }
      );

    if (
      signs.length >= 12 &&
      signs.some(
        (item) =>
          item !== "-"
      )
    ) {
      return signs.slice(
        0,
        12
      );
    }
  }

  /*
   * Fallback to Lagna chart.
   */

  const lagnaSection =
    getSection(
      apiRoot,
      [
        "1_lagna_chart",
        "lagna_chart",
        "lagna",
      ]
    );

  const ascendant =
    lagnaSection?.ascendant;

  const possibleLagna =
    ascendant?.signNumber ??
    ascendant?.sign_number ??
    ascendant?.rasi ??
    ascendant?.sign ??
    lagnaSection
      ?.houses?.[0]
      ?.signNumber ??
    lagnaSection
      ?.houses?.[0]
      ?.sign;

  const numericLagna =
    Number(
      possibleLagna
    );

  if (
    numericLagna >= 1 &&
    numericLagna <= 12
  ) {
    return Array.from(
      {
        length: 12,
      },
      (_, index) =>
        ((numericLagna -
          1 +
          index) %
          12) +
        1
    );
  }

  /*
   * Final fallback based on your current
   * Kundli: Sagittarius Lagna = 9.
   */

  return [
    9,
    10,
    11,
    12,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
  ];
};

/* =========================================================
   MAIN AC TAB
========================================================= */

const ACTab = ({
  data,
  fullData,
}) => {
  const [
    active,
    setActive,
  ] = useState("Sarv");

  /*
   * API ROOT
   */

  const apiRoot = useMemo(
    () =>
      getApiRoot(
        data,
        fullData
      ),
    [
      data,
      fullData,
    ]
  );

  /*
   * ASHTAKAVARGA SECTION
   */

  const section = useMemo(
    () =>
      getAshtakavargaSection(
        apiRoot
      ),
    [apiRoot]
  );

  /*
   * PRINT RAW API ONCE WHEN SECTION CHANGES
   */

  useEffect(() => {
    printRawAshtakavarga(
      section
    );
  }, [section]);

  /*
   * CURRENT TAB VALUES
   */

  const scores = useMemo(
    () =>
      getValues(
        section,
        active
      ),
    [
      section,
      active,
    ]
  );

  /*
   * SIGNS
   */

  const signs = useMemo(
    () =>
      getSignsFromApi(
        section,
        apiRoot
      ),
    [
      section,
      apiRoot,
    ]
  );

  /*
   * DEBUG TOTAL
   */

  const displayedTotal =
    scores
      .filter(
        (value) =>
          isNumericValue(
            value
          )
      )
      .reduce(
        (
          sum,
          value
        ) =>
          sum +
          Number(value),
        0
      );

  const apiTotal =
    Number(
      section?.total_points
    );

  return (
    <View
      style={
        styles.container
      }
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Text
        style={styles.title}
      >
        Ashtakavarga Chart
      </Text>

      {/* =================================================
          TABS
      ================================================= */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View
          style={
            styles.pillRow
          }
        >
          {tabs.map(
            (item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={
                  0.8
                }
                onPress={() =>
                  setActive(
                    item
                  )
                }
                style={[
                  styles.pill,
                  active ===
                    item &&
                    styles.activePill,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    active ===
                      item &&
                      styles.activeText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>

      {/* =================================================
          CHART
      ================================================= */}

      <AshtakChart
        scores={
          scores
        }
        signs={
          signs
        }
      />

      {/* =================================================
          DEBUG / STATUS
      ================================================= */}

      <Text
        style={
          styles.statusText
        }
      >
        {active} •{" "}
        {scores.length ===
        12
          ? "12 values loaded"
          : `${scores.length} values loaded`}
      </Text>

      {/* Show Sarv comparison */}
      {active ===
        "Sarv" &&
        scores.length ===
          12 && (
          <Text
            style={
              styles.totalText
            }
          >
            Displayed Total:{" "}
            {displayedTotal}
            {"  "} | {"  "}
            API Total:{" "}
            {Number.isFinite(
              apiTotal
            )
              ? apiTotal
              : "-"}
          </Text>
        )}

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <Text
        style={styles.desc}
      >
        Ashtakavarga is a
        Vedic mathematical
        method used to
        evaluate strength
        and patterns within
        a birth chart.
      </Text>

      {/* =================================================
          CONSULT BUTTON
      ================================================= */}

      <TouchableOpacity
        activeOpacity={
          0.85
        }
        style={
          styles.button
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          ☏ Consult An Expert
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* =========================================================
   ASHTAKAVARGA CHART
========================================================= */

const AshtakChart = ({
  scores,
  signs,
}) => {
  return (
    <View
      style={
        styles.chartWrapper
      }
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
      >
        {/* =================================================
            OUTER BORDER
        ================================================= */}

        <Rect
          x="1"
          y="1"
          width="398"
          height="398"
          fill="#fff"
          stroke={
            ORANGE
          }
          strokeWidth="2.5"
        />

        {/* =================================================
            DIAGONALS
        ================================================= */}

        <Line
          x1="0"
          y1="0"
          x2="400"
          y2="400"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        <Line
          x1="0"
          y1="400"
          x2="400"
          y2="0"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        {/* =================================================
            DIAMOND
        ================================================= */}

        <Line
          x1="200"
          y1="0"
          x2="0"
          y2="200"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        <Line
          x1="0"
          y1="200"
          x2="200"
          y2="400"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        <Line
          x1="200"
          y1="400"
          x2="400"
          y2="200"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        <Line
          x1="400"
          y1="200"
          x2="200"
          y2="0"
          stroke={
            ORANGE
          }
          strokeWidth="1.8"
        />

        {/* =================================================
            HOUSES
        ================================================= */}

        {Array.from(
          {
            length: 12,
          },
          (_, index) =>
            index + 1
        ).map(
          (house) => {
            const c =
              COORDINATES[
                house
              ];

            const sign =
              signs?.[
                house - 1
              ] ?? "-";

            const score =
              scores?.[
                house - 1
              ] ?? "-";

            return (
              <React.Fragment
                key={
                  house
                }
              >
                {/* -----------------------------------------
                    ZODIAC SIGN
                ----------------------------------------- */}

                <SvgText
                  x={
                    c.signX
                  }
                  y={
                    c.signY
                  }
                  fill={
                    ORANGE
                  }
                  fontSize="15"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {getValue(
                    sign
                  )}
                </SvgText>

                {/* -----------------------------------------
                    SCORE
                ----------------------------------------- */}

                <SvgText
                  x={
                    c.scoreX
                  }
                  y={
                    c.scoreY
                  }
                  fill={
                    GREEN
                  }
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {getValue(
                    score
                  )}
                </SvgText>
              </React.Fragment>
            );
          }
        )}
      </Svg>
    </View>
  );
};

export default ACTab;

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    container: {
      paddingBottom:
        hp(2),
    },

    title: {
      fontSize:
        RF(16),
      fontWeight:
        "700",
      color: "#111",
      marginBottom:
        hp(1.5),
    },

    scrollContent: {
      paddingRight:
        wp(3),
    },

    pillRow: {
      flexDirection:
        "row",
      gap: wp(2),
      marginBottom:
        hp(2),
    },

    pill: {
      height:
        hp(3.8),
      minWidth:
        wp(16),
      paddingHorizontal:
        wp(3),
      borderRadius:
        wp(10),
      borderWidth: 1,
      borderColor:
        BORDER,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    activePill: {
      backgroundColor:
        ORANGE,
      borderColor:
        ORANGE,
    },

    pillText: {
      fontSize:
        RF(10.5),
      color: "#111",
    },

    activeText: {
      color: "#fff",
      fontWeight:
        "700",
    },

    chartWrapper: {
      width:
        wp(90),
      height:
        wp(90),
      alignSelf:
        "center",
      marginBottom:
        hp(1),
      backgroundColor:
        "#fff",
    },

    statusText: {
      textAlign:
        "center",
      fontSize:
        RF(9),
      color: "#777",
      marginBottom:
        hp(0.5),
    },

    totalText: {
      textAlign:
        "center",
      fontSize:
        RF(9),
      fontWeight:
        "600",
      color:
        ORANGE,
      marginBottom:
        hp(1),
    },

    desc: {
      fontSize:
        RF(11.5),
      color: "#333",
      lineHeight:
        hp(2.3),
      marginBottom:
        hp(2),
    },

    button: {
      height:
        hp(5.4),
      backgroundColor:
        ORANGE,
      borderRadius:
        wp(2),
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    buttonText: {
      color: "#fff",
      fontSize:
        RF(13),
      fontWeight:
        "700",
    },
  });