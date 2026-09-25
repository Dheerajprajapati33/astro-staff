// components/kundli/kundliApiHelpers.js

export const getApiRoot = (data, fullData) => {
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

export const getValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.join(", ")
      : "-";
  }

  if (typeof value === "object") {
    return (
      value.name ??
      value.title ??
      value.value ??
      value.label ??
      value.text ??
      value.displayName ??
      value.display_name ??
      "-"
    );
  }

  return String(value);
};

export const firstValue = (
  object,
  keys = []
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return undefined;
  }

  for (const key of keys) {
    const value = object[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return undefined;
};

export const firstObject = (
  object,
  keys = []
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return {};
  }

  for (const key of keys) {
    if (
      object[key] &&
      typeof object[key] === "object" &&
      !Array.isArray(object[key])
    ) {
      return object[key];
    }
  }

  return {};
};

export const firstArray = (
  object,
  keys = []
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(object[key])) {
      return object[key];
    }
  }

  return [];
};

export const getSection = (
  root,
  keys = []
) => {
  for (const key of keys) {
    if (
      root?.[key] &&
      typeof root[key] === "object"
    ) {
      return root[key];
    }
  }

  return {};
};

export const getChartSvg = (section) => {
  if (!section) {
    return null;
  }

  return (
    section?.svg ??
    section?.svgXml ??
    section?.chartSvg ??
    section?.chart?.svg ??
    section?.chart?.svgXml ??
    null
  );
};

/* =========================================================
   PLANET HELPERS
========================================================= */

const PLANET_NAMES = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "rahu",
  "ketu",

  "सूर्य",
  "चंद्र",
  "चन्द्र",
  "मंगल",
  "बुध",
  "गुरु",
  "बृहस्पति",
  "शुक्र",
  "शनि",
  "राहु",
  "केतु",
];

const PLANET_KEYS = [
  "planets",
  "planetaryPositions",
  "planetary_positions",
  "planetaryData",
  "planetary_data",
  "planetDetails",
  "planet_details",
  "occupants",
  "occupiedBy",
  "occupied_by",
  "grahas",
  "graha",
];

const isPlanetObject = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const name = firstValue(value, [
    "name",
    "planet",
    "planet_name",
    "planetName",
    "graha",
    "grahaName",
  ]);

  if (!name) {
    return false;
  }

  const text = String(name).toLowerCase();

  return PLANET_NAMES.some(
    (planet) =>
      text === planet.toLowerCase()
  );
};

/**
 * Recursively searches an object for arrays that
 * contain planet objects.
 *
 * This handles APIs where planets are inside:
 *
 * houseDetails[]
 * houses{}
 * chart{}
 * planetaryPositions[]
 * planets[]
 */
const collectPlanetObjects = (
  value,
  result = [],
  visited = new Set()
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return result;
  }

  if (
    typeof value !== "object"
  ) {
    return result;
  }

  if (visited.has(value)) {
    return result;
  }

  visited.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      if (isPlanetObject(item)) {
        result.push(item);
      } else {
        collectPlanetObjects(
          item,
          result,
          visited
        );
      }
    }

    return result;
  }

  /*
   * First check common planet keys.
   */
  for (const key of PLANET_KEYS) {
    const child = value[key];

    if (Array.isArray(child)) {
      for (const item of child) {
        if (isPlanetObject(item)) {
          result.push(item);
        } else {
          collectPlanetObjects(
            item,
            result,
            visited
          );
        }
      }
    }
  }

  /*
   * Then recursively inspect the remaining object.
   */
  for (const [key, child] of Object.entries(
    value
  )) {
    if (
      PLANET_KEYS.includes(key)
    ) {
      continue;
    }

    if (
      child &&
      typeof child === "object"
    ) {
      if (isPlanetObject(child)) {
        result.push(child);
      } else {
        collectPlanetObjects(
          child,
          result,
          visited
        );
      }
    }
  }

  return result;
};

/**
 * Remove duplicate planets.
 */
const uniquePlanets = (
  planets
) => {
  const map = new Map();

  planets.forEach(
    (planet) => {
      const name = firstValue(
        planet,
        [
          "name",
          "planet",
          "planet_name",
          "planetName",
          "graha",
          "grahaName",
        ]
      );

      if (!name) {
        return;
      }

      const key = String(
        name
      ).toLowerCase();

      if (!map.has(key)) {
        map.set(
          key,
          planet
        );
      }
    }
  );

  return Array.from(
    map.values()
  );
};

/**
 * Get planetary array from every supported
 * API structure.
 */
export const getPlanetArray = (
  section
) => {
  if (!section) {
    return [];
  }

  /*
   * 1. Existing direct API structures.
   */
  const directCandidates = [
    section?.planets,
    section?.planetaryPositions,
    section?.planetary_positions,
    section?.planetaryData,
    section?.planetary_data,

    section?.data?.planets,
    section?.data?.planetaryPositions,
    section?.data?.planetary_positions,

    section?.chart?.planets,
    section?.chart?.planetaryPositions,
    section?.chart?.planetary_positions,
  ];

  for (
    const candidate of directCandidates
  ) {
    if (
      Array.isArray(candidate) &&
      candidate.length
    ) {
      return uniquePlanets(
        candidate
      );
    }
  }

  /*
   * 2. Lagna / Chandra can store planets
   * inside houses / houseDetails.
   */
  const nestedPlanets =
    collectPlanetObjects(
      {
        houseDetails:
          section?.houseDetails,
        houses:
          section?.houses,
        chart:
          section?.chart,
        data:
          section?.data,
      }
    );

  return uniquePlanets(
    nestedPlanets
  );
};

/* =========================================================
   SIGN HELPERS
========================================================= */

const SIGN_NAMES = {
  1: "मेष",
  2: "वृषभ",
  3: "मिथुन",
  4: "कर्क",
  5: "सिंह",
  6: "कन्या",
  7: "तुला",
  8: "वृश्चिक",
  9: "धनु",
  10: "मकर",
  11: "कुंभ",
  12: "मीन",
};

const SIGN_LORDS = {
  1: "मंगल",
  2: "शुक्र",
  3: "बुध",
  4: "चंद्र",
  5: "सूर्य",
  6: "बुध",
  7: "शुक्र",
  8: "मंगल",
  9: "गुरु",
  10: "शनि",
  11: "शनि",
  12: "गुरु",
};

const SIGN_ID_BY_NAME = {
  aries: 1,
  taurus: 2,
  gemini: 3,
  cancer: 4,
  leo: 5,
  virgo: 6,
  libra: 7,
  scorpio: 8,
  sagittarius: 9,
  capricorn: 10,
  aquarius: 11,
  pisces: 12,

  मेष: 1,
  वृषभ: 2,
  मिथुन: 3,
  कर्क: 4,
  सिंह: 5,
  कन्या: 6,
  तुला: 7,
  वृश्चिक: 8,
  धनु: 9,
  मकर: 10,
  कुंभ: 11,
  मीन: 12,
};

const getSignId = (
  planet
) => {
  const explicitId =
    firstValue(planet, [
      "signId",
      "sign_id",
      "rasiId",
      "rasi_id",
      "zodiacId",
      "zodiac_id",
    ]);

  if (
    explicitId !== undefined
  ) {
    return Number(
      explicitId
    );
  }

  const sign =
    firstValue(planet, [
      "sign",
      "rasi",
      "zodiac",
      "sign_name",
    ]);

  if (!sign) {
    return undefined;
  }

  return SIGN_ID_BY_NAME[
    String(sign)
      .trim()
      .toLowerCase()
  ];
};

const getHindiSign = (
  planet
) => {
  const sign =
    firstValue(planet, [
      "sign",
      "rasi",
      "zodiac",
      "sign_name",
    ]);

  const signId =
    getSignId(planet);

  /*
   * If API already gives Hindi,
   * preserve it.
   */
  if (
    sign &&
    Object.values(
      SIGN_NAMES
    ).includes(
      String(sign)
    )
  ) {
    return sign;
  }

  if (
    signId &&
    SIGN_NAMES[signId]
  ) {
    return SIGN_NAMES[signId];
  }

  return sign;
};

/* =========================================================
   NORMALIZE PLANET
========================================================= */

export const normalizePlanet = (
  planet
) => {
  if (!planet) {
    return {};
  }

  const signId =
    getSignId(planet);

  const rawSign =
    firstValue(planet, [
      "sign",
      "rasi",
      "zodiac",
      "sign_name",
      "signName",
    ]);

  const rawDegree =
    firstValue(planet, [
      "degree",
      "degrees",
      "normDegree",
      "norm_degree",
      "degreeInSign",
      "degree_in_sign",
      "longitude",
      "absoluteDegree",
      "absolute_degree",
    ]);

  const rawNakshatra =
    firstValue(planet, [
      "nakshatra",
      "nakshatra_name",
      "nakshatraName",
      "star",
      "starName",
    ]);

  return {
    ...planet,

    name: firstValue(
      planet,
      [
        "name",
        "planet",
        "planet_name",
        "planetName",
        "graha",
        "grahaName",
      ]
    ),

    sign:
      getHindiSign(
        planet
      ),

    signId,

    house: firstValue(
      planet,
      [
        "house",
        "bhava",
        "house_number",
        "houseNumber",
      ]
    ),

    degree:
      rawDegree,

    nakshatra:
      rawNakshatra,

    nakshatraLord:
      firstValue(
        planet,
        [
          "nakshatraLord",
          "nakshatra_lord",
          "nakshatraLordName",
          "starLord",
          "star_lord",
        ]
      ),

    signLord:
      firstValue(
        planet,
        [
          "signLord",
          "sign_lord",
          "signLordName",
          "lord",
        ]
      ) ??
      (
        signId
          ? SIGN_LORDS[signId]
          : undefined
      ),

    retrograde:
      firstValue(
        planet,
        [
          "isRetrograde",
          "is_retrograde",
          "retrograde",
        ]
      ),
  };
};

/* =========================================================
   CHANDRA FALLBACK
========================================================= */

const getChandraFallback =
  (section) => {
    if (
      !section ||
      section?.chartType !==
        "moon"
    ) {
      return null;
    }

    const moonSign =
      section?.moonSign;

    const moonDegree =
      section?.moonDegree;

    const moonNakshatra =
      section?.nakshatra;

    if (
      !moonSign &&
      moonDegree ===
        undefined &&
      !moonNakshatra
    ) {
      return null;
    }

    const moonSignId =
      section?.moonSignId ??
      SIGN_ID_BY_NAME[
        String(
          moonSign || ""
        )
          .trim()
          .toLowerCase()
      ];

    const nakshatraName =
      firstValue(
        moonNakshatra,
        [
          "name",
          "title",
          "nakshatra",
          "nakshatra_name",
          "label",
        ]
      ) ??
      (
        typeof moonNakshatra ===
        "string"
          ? moonNakshatra
          : undefined
      );

    const nakshatraLord =
      firstValue(
        moonNakshatra,
        [
          "lord",
          "lordName",
          "nakshatraLord",
          "nakshatra_lord",
          "starLord",
          "star_lord",
        ]
      );

    return {
      name: "चंद्र",

      sign:
        SIGN_NAMES[
          moonSignId
        ] ??
        moonSign,

      signId:
        moonSignId,

      signLord:
        SIGN_LORDS[
          moonSignId
        ],

      degree:
        moonDegree,

      nakshatra:
        nakshatraName,

      nakshatraLord,

      house:
        undefined,

      retrograde:
        false,
    };
  };

/* =========================================================
   MAIN NORMALIZER
========================================================= */

export const getNormalizedPlanets = (
  section
) => {
  if (!section) {
    return [];
  }

  let rawPlanets =
    getPlanetArray(
      section
    );

  /*
   * Chandra API explicitly provides
   * moonSign/moonDegree/nakshatra.
   *
   * Use this when the general planetary
   * structure does not contain Moon.
   */
  const chandraFallback =
    getChandraFallback(
      section
    );

  if (
    chandraFallback
  ) {
    const hasMoon =
      rawPlanets.some(
        (planet) => {
          const name =
            firstValue(
              planet,
              [
                "name",
                "planet",
                "planet_name",
                "planetName",
                "graha",
                "grahaName",
              ]
            );

          if (!name) {
            return false;
          }

          const value =
            String(
              name
            ).toLowerCase();

          return (
            value ===
              "moon" ||
            value ===
              "चंद्र" ||
            value ===
              "चन्द्र"
          );
        }
      );

    if (!hasMoon) {
      rawPlanets = [
        ...rawPlanets,
        chandraFallback,
      ];
    }
  }

  return uniquePlanets(
    rawPlanets
  ).map(
    normalizePlanet
  );
};

/* =========================================================
   RETROGRADE
========================================================= */

export const getRetrogradeText = (
  planet
) => {
  const value =
    planet?.retrograde;

  return (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  )
    ? "true"
    : "false";
};

/* =========================================================
   DATE
========================================================= */

export const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const text =
    String(value);

  if (
    text.includes("T")
  ) {
    const date =
      new Date(text);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      const day =
        String(
          date.getDate()
        ).padStart(
          2,
          "0"
        );

      const month =
        String(
          date.getMonth() + 1
        ).padStart(
          2,
          "0"
        );

      return `${day}-${month}-${date.getFullYear()}`;
    }
  }

  const match =
    text.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  return text;
};