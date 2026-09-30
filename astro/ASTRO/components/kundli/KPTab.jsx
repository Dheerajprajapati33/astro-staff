import React, {
  useMemo,
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

import {
  getApiRoot,
  getSection,
  getNormalizedPlanets,
  firstArray,
  getValue,
} from "./kundliApiHelpers";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff8ef";

const KPTab = ({
  data,
  fullData,
}) => {
  const apiRoot = useMemo(
    () =>
      getApiRoot(
        data,
        fullData
      ),
    [data, fullData]
  );

  const kp = useMemo(
    () =>
      getSection(
        apiRoot,
        [
          "9_kp_kundli",
          "kp_kundli",
          "kpKundli",
        ]
      ),
    [apiRoot]
  );

  const planets = useMemo(
    () =>
      getNormalizedPlanets(
        kp
      ),
    [kp]
  );

  const planetData = useMemo(
    () =>
      planets.map(
        (planet) => [
          getValue(
            planet.name
          ),
          getValue(
            planet.cusp
          ) !== "-"
            ? getValue(
                planet.cusp
              )
            : getValue(
                planet.house
              ),
          getValue(
            planet.sign
          ),
          getValue(
            planet.signLord
          ),
          getValue(
            planet.nakshatraLord
          ),
          getValue(
            planet.subLord ??
              planet.sub_lord
          ),
        ]
      ),
    [planets]
  );

  const rawCusps = firstArray(
    kp,
    [
      "cusps",
      "cusp",
      "cuspDetails",
      "cusp_details",
    ]
  );

  const cuspData =
    rawCusps.map(
      (cusp, index) => [
        getValue(
          cusp?.cusp ??
            cusp?.house ??
            index + 1
        ),

        getValue(
          cusp?.degree ??
            cusp?.normDegree ??
            cusp?.norm_degree
        ),

        getValue(
          cusp?.sign ??
            cusp?.rasi
        ),

        getValue(
          cusp?.signLord ??
            cusp?.sign_lord ??
            cusp?.lord
        ),

        getValue(
          cusp?.subLord ??
            cusp?.sub_lord ??
            cusp?.cuspSub
        ),

        getValue(
          cusp?.nakshatra ??
            cusp?.star
        ),

        getValue(
          cusp?.nakshatraLord ??
            cusp?.starLord ??
            cusp?.star_lord
        ),
      ]
    );

  return (
    <View>
      <Text style={styles.title}>
        Planets
      </Text>

      {planetData.length ? (
        <KPTable
          headers={[
            "Planets",
            "Cusp",
            "Sign",
            "Sign Lord",
            "Star Lord",
            "Sub Lord",
          ]}
          data={planetData}
        />
      ) : (
        <EmptyTable text="No KP planetary data available" />
      )}

      <Text style={styles.title}>
        Cusps
      </Text>

      {cuspData.length ? (
        <KPTable
          headers={[
            "Cusp",
            "Degree",
            "Sign",
            "Sign Lord",
            "Cusp Sub",
            "Nakshatra",
            "Naks Lord",
          ]}
          data={cuspData}
        />
      ) : (
        <EmptyTable text="No KP cusp data available" />
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

const EmptyTable = ({
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

const KPTable = ({
  headers,
  data,
}) => (
  <View
    style={
      styles.tableWrapper
    }
  >
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
                    {getValue(cell)}
                  </Text>
                )
              )}
            </View>
          )
        )}
      </View>
    </ScrollView>
  </View>
);

export default KPTab;

const styles = StyleSheet.create({
  title: {
    fontSize: RF(15),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1),
  },

  tableWrapper: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    overflow: "hidden",
    marginBottom: hp(2),
  },

  table: {
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
  },

  headerCell: {
    width: wp(16),
    minHeight: hp(5),
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  lightRow: {
    backgroundColor: LIGHT,
  },

  bodyCell: {
    width: wp(16),
    minHeight: hp(5),
    color: "#111",
    fontSize: RF(8.5),
    textAlign: "center",
    textAlignVertical: "center",
  },

  emptyContainer: {
    padding: hp(2.5),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    marginBottom: hp(2),
    alignItems: "center",
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
    justifyContent: "center",
    marginTop: hp(0.5),
  },

  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});