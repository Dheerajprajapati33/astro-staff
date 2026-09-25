import React, { useMemo } from "react";

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

import {
  getApiRoot,
  getValue,
  firstObject,
  firstValue,
} from "./kundliApiHelpers";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff4df";

// =====================================================
// INFO TABLE
// =====================================================

const InfoTable = ({ title, data }) => {
  if (!data?.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      {title ? (
        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      ) : null}

      <View style={styles.card}>
        {data.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={[
              styles.row,
              index % 2 === 0 && styles.lightRow,
            ]}
          >
            <Text style={styles.label}>
              {item.label}
            </Text>

            <Text style={styles.value}>
              {getValue(item.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// =====================================================
// BASIC TAB
// =====================================================

const BasicTab = ({
  data,
  fullData,
}) => {
  // ===================================================
  // API ROOT
  // ===================================================

  const apiRoot = useMemo(
    () =>
      getApiRoot(
        data,
        fullData
      ),
    [data, fullData]
  );

  // ===================================================
  // USER DETAILS
  // ===================================================

  const userDetails = useMemo(
    () =>
      firstObject(apiRoot, [
        "user_details",
        "userDetails",
        "basic",
        "basicDetails",
        "birth_details",
        "birthDetails",
      ]),
    [apiRoot]
  );

  // ===================================================
  // MANGLIK OBJECT
  // ===================================================

  const mangal = useMemo(
    () =>
      firstObject(userDetails, [
        "manglik",
        "mangal_dosha",
        "manglik_dosha",
      ]) ??
      firstObject(apiRoot, [
        "mangal_dosha",
        "manglik",
        "manglik_dosha",
      ]),
    [userDetails, apiRoot]
  );

  // ===================================================
  // BASIC DETAILS
  // ===================================================

  const name =
    firstValue(
      userDetails,
      ["name"]
    ) ??
    firstValue(
      apiRoot,
      ["name"]
    );

  const gender =
    firstValue(
      userDetails,
      ["gender"]
    ) ??
    firstValue(
      apiRoot,
      ["gender"]
    );

  const dob =
    firstValue(
      userDetails,
      [
        "dob",
        "dateOfBirth",
        "date_of_birth",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "dob",
        "dateOfBirth",
        "date_of_birth",
      ]
    );

  const tob =
    firstValue(
      userDetails,
      [
        "tob",
        "timeOfBirth",
        "time_of_birth",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "tob",
        "timeOfBirth",
        "time_of_birth",
      ]
    );

  const birthPlace =
    firstValue(
      userDetails,
      [
        "birthPlace",
        "birth_place",
        "city",
        "place",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "birthPlace",
        "birth_place",
        "city",
        "place",
      ]
    );

  const latitude =
    firstValue(
      userDetails,
      [
        "latitude",
        "lat",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "latitude",
        "lat",
      ]
    );

  const longitude =
    firstValue(
      userDetails,
      [
        "longitude",
        "long",
        "lng",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "longitude",
        "long",
        "lng",
      ]
    );

  const timezone =
    firstValue(
      userDetails,
      ["timezone"]
    ) ??
    firstValue(
      apiRoot,
      ["timezone"]
    );

  const language =
    firstValue(
      userDetails,
      ["language"]
    ) ??
    firstValue(
      apiRoot,
      ["language"]
    );

  // ===================================================
  // OPTIONAL BASIC DATA
  // These will show only if API actually provides them
  // ===================================================

  const sunrise =
    firstValue(
      userDetails,
      [
        "sunrise",
        "sun_rise",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "sunrise",
        "sun_rise",
      ]
    );

  const sunset =
    firstValue(
      userDetails,
      [
        "sunset",
        "sun_set",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "sunset",
        "sun_set",
      ]
    );

  const ayanamsha =
    firstValue(
      userDetails,
      [
        "ayanamsha",
        "ayanamsa",
      ]
    ) ??
    firstValue(
      apiRoot,
      [
        "ayanamsha",
        "ayanamsa",
      ]
    );

  // ===================================================
  // MANGLIK STATUS
  // Actual API:
  // isManglik: false
  // ===================================================

  const isManglik =
    firstValue(
      mangal,
      [
        "isManglik",
        "is_manglik",
        "has_dosha",
        "hasDosha",
      ]
    );

  // ===================================================
  // MANGLIK TYPE
  // Actual API:
  // manglikType
  // ===================================================

  const manglikType =
    firstValue(
      mangal,
      [
        "manglikType",
        "manglik_type",
      ]
    );

  // ===================================================
  // MARS DETAILS
  // ===================================================

  const mars = useMemo(
    () =>
      firstObject(mangal, [
        "mars",
      ]),
    [mangal]
  );

  const marsSign =
    firstValue(
      mars,
      ["sign"]
    );

  const marsSignId =
    firstValue(
      mars,
      [
        "signId",
        "sign_id",
      ]
    );

  const marsDegree =
    firstValue(
      mars,
      [
        "degreeInSign",
        "degree_in_sign",
      ]
    );

  const marsRetrograde =
    firstValue(
      mars,
      [
        "isRetrograde",
        "is_retrograde",
      ]
    );

  // ===================================================
  // CHECKED FROM
  // ===================================================

  const checkedFrom =
    Array.isArray(
      mangal?.checkedFrom
    )
      ? mangal.checkedFrom
      : [];

  // ===================================================
  // DOSHA HOUSES
  // ===================================================

  const doshaHouses =
    Array.isArray(
      mangal?.doshaHouses
    )
      ? mangal.doshaHouses
      : [];

  // ===================================================
  // MANGLIK NOTE
  // ===================================================

  const manglikNote =
    firstValue(
      mangal,
      ["note"]
    );

  // ===================================================
  // BASIC BIRTH ROWS
  // ===================================================

  const birthRows = [
    {
      label: "Name",
      value: name,
    },

    {
      label: "Gender",
      value: gender,
    },

    {
      label: "Date of Birth",
      value: dob,
    },

    {
      label: "Time of Birth",
      value: tob,
    },

    {
      label: "Birth Place",
      value: birthPlace,
    },

    {
      label: "Latitude",
      value:
        latitude !== undefined &&
        latitude !== null
          ? `${latitude}°`
          : "-",
    },

    {
      label: "Longitude",
      value:
        longitude !== undefined &&
        longitude !== null
          ? `${longitude}°`
          : "-",
    },

    {
      label: "Timezone",
      value: timezone,
    },

    {
      label: "Sunrise",
      value: sunrise,
    },

    {
      label: "Sunset",
      value: sunset,
    },

    {
      label: "Ayanamsha",
      value: ayanamsha,
    },

    {
      label: "Language",
      value: language,
    },
  ];

  // ===================================================
  // MANGLIK CHECKED FROM ROWS
  // ===================================================

  const checkedFromRows =
    checkedFrom.map(
      (item, index) => ({
        label:
          item?.referencePlanet ||
          `Reference ${index + 1}`,

        value:
          item?.house !== undefined
            ? `House ${item.house} - ${
                item?.isManglik
                  ? "Manglik"
                  : "No Dosha"
              }`
            : item?.isManglik
              ? "Manglik"
              : "No Dosha",
      })
    );

  // ===================================================
  // MANGLIK DETAILS
  // ===================================================

  const manglikDetailsRows = [
    {
      label: "Manglik Type",
      value: manglikType,
    },

    {
      label: "Mars Sign",
      value: marsSign,
    },

    {
      label: "Mars Sign ID",
      value: marsSignId,
    },

    {
      label: "Degree in Sign",
      value:
        marsDegree !== undefined &&
        marsDegree !== null
          ? `${Number(marsDegree).toFixed(5)}°`
          : "-",
    },

    {
      label: "Mars Retrograde",
      value:
        marsRetrograde === true
          ? "Yes"
          : marsRetrograde === false
            ? "No"
            : "-",
    },
  ];

  // ===================================================
  // DOSHA HOUSE ROW
  // ===================================================

  const doshaHouseRows = [
    {
      label: "Applicable Houses",
      value:
        doshaHouses.length > 0
          ? doshaHouses.join(", ")
          : "-",
    },
  ];

  // ===================================================
  // DEBUG
  // ===================================================

  console.log(
    "========================================"
  );

  console.log(
    "🔎 BASIC TAB API ROOT:"
  );

  console.log(
    JSON.stringify(
      apiRoot,
      null,
      2
    )
  );

  console.log(
    "🔎 USER DETAILS:"
  );

  console.log(
    JSON.stringify(
      userDetails,
      null,
      2
    )
  );

  console.log(
    "🔎 MANGLIK DATA:"
  );

  console.log(
    JSON.stringify(
      mangal,
      null,
      2
    )
  );

  console.log(
    "🔎 MARS DATA:"
  );

  console.log(
    JSON.stringify(
      mars,
      null,
      2
    )
  );

  console.log(
    "🔎 API ROOT KEYS:",
    Object.keys(
      apiRoot || {}
    )
  );

  console.log(
    "========================================"
  );

  // ===================================================
  // UI
  // ===================================================

  return (
    <View>

      {/* =============================================
          BASIC BIRTH DETAILS
      ============================================== */}

      <InfoTable
        title="Basic Birth Details"
        data={birthRows}
      />

      {/* =============================================
          MANGLIK ANALYSIS
      ============================================== */}

      <Text style={styles.sectionTitle}>
        Manglik Analysis
      </Text>

      <View style={styles.manglikCard}>

        {/* STATUS */}

        <View
          style={[
            styles.circle,

            isManglik === true &&
              styles.manglikYes,
          ]}
        >
          <Text
            style={styles.circleText}
          >
            {isManglik === true
              ? "Yes"
              : "No"}
          </Text>
        </View>

        {/* CONTENT */}

        <View
          style={styles.manglikContent}
        >
          <Text
            style={styles.name}
          >
            {getValue(name)}
          </Text>

          <Text
            style={styles.manglikType}
          >
            {getValue(
              manglikType
            )}
          </Text>
        </View>

      </View>

      {/* =============================================
          MARS / MANGLIK DETAILS
      ============================================== */}

      <InfoTable
        title="Manglik Details"
        data={manglikDetailsRows}
      />

      {/* =============================================
          CHECKED FROM
      ============================================== */}

      <InfoTable
        title="Manglik Checked From"
        data={checkedFromRows}
      />

      {/* =============================================
          DOSHA HOUSES
      ============================================== */}

      <InfoTable
        title="Dosha Houses"
        data={doshaHouseRows}
      />

      {/* =============================================
          MANGLIK NOTE
      ============================================== */}

      {manglikNote ? (
        <View style={styles.noteCard}>

          <Text
            style={styles.noteTitle}
          >
            Note
          </Text>

          <Text
            style={styles.noteText}
          >
            {getValue(
              manglikNote
            )}
          </Text>

        </View>
      ) : null}

      {/* =============================================
          CONSULT BUTTON
      ============================================== */}

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text
          style={styles.buttonText}
        >
          Consult An Expert
        </Text>
      </TouchableOpacity>

    </View>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  section: {
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: RF(14),
    fontWeight: "700",
    color: ORANGE,
    marginBottom: hp(1),
  },

  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    overflow: "hidden",
  },

  row: {
    minHeight: hp(4.8),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    backgroundColor: "#fff",
  },

  lightRow: {
    backgroundColor: LIGHT,
  },

  label: {
    flex: 1,
    fontSize: RF(11),
    color: "#111",
    paddingRight: wp(2),
  },

  value: {
    flex: 1,
    fontSize: RF(11),
    color: "#111",
    fontWeight: "500",
  },

  // =================================================
  // MANGLIK CARD
  // =================================================

  manglikCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    padding: wp(3),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },

  circle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#4caf50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },

  manglikYes: {
    backgroundColor: ORANGE,
  },

  circleText: {
    color: "#fff",
    fontSize: RF(16),
    fontWeight: "700",
  },

  manglikContent: {
    flex: 1,
  },

  name: {
    color: ORANGE,
    fontSize: RF(12),
    fontWeight: "700",
  },

  manglikType: {
    marginTop: hp(0.4),
    fontSize: RF(11),
    color: "#111",
    fontWeight: "500",
  },

  // =================================================
  // NOTE
  // =================================================

  noteCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: LIGHT,
  },

  noteTitle: {
    color: ORANGE,
    fontSize: RF(12),
    fontWeight: "700",
    marginBottom: hp(0.5),
  },

  noteText: {
    color: "#111",
    fontSize: RF(10),
    lineHeight: RF(15),
  },

  // =================================================
  // BUTTON
  // =================================================

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

export default BasicTab;