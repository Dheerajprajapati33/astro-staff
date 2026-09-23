import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const LIGHT = "#fff8ef";

const dashaTabs = ["Major dasha", "Yogini"];

const VIMSHOTTARI_CYCLE = [
  { name: "Ketu", years: 7 },
  { name: "Venus", years: 20 },
  { name: "Sun", years: 6 },
  { name: "Moon", years: 10 },
  { name: "Mars", years: 7 },
  { name: "Rahu", years: 18 },
  { name: "Jupiter", years: 16 },
  { name: "Saturn", years: 19 },
  { name: "Mercury", years: 17 },
];

const majorFallbackData = [
  { name: "Ketu", startDate: "15-06-1973", endDate: "15-06-1980" },
  { name: "Venus", startDate: "15-06-1980", endDate: "15-06-2000" },
  { name: "Sun", startDate: "15-06-2000", endDate: "15-06-2006" },
  { name: "Moon", startDate: "15-06-2006", endDate: "15-06-2016" },
  { name: "Mars", startDate: "15-06-2016", endDate: "16-06-2023" },
  { name: "Rahu", startDate: "16-06-2023", endDate: "15-06-2041" },
  { name: "Jupiter", startDate: "15-06-2041", endDate: "15-06-2057" },
  { name: "Saturn", startDate: "15-06-2057", endDate: "15-06-2076" },
  { name: "Mercury", startDate: "15-06-2076", endDate: "15-06-2093" },
];

const yoginiFallbackData = [
  { name: "Bhadrika", startDate: "Birth", endDate: "23-07-1981" },
  { name: "Ulka", startDate: "23-07-1981", endDate: "23-07-1987" },
  { name: "Siddha", startDate: "23-07-1987", endDate: "23-07-1994" },
  { name: "Sankata", startDate: "23-07-1994", endDate: "23-07-2002" },
  { name: "Mangala", startDate: "23-07-2002", endDate: "23-07-2003" },
  { name: "Pingala", startDate: "23-07-2003", endDate: "23-07-2005" },
  { name: "Dhanya", startDate: "23-07-2005", endDate: "23-07-2008" },
  { name: "Bhramari", startDate: "23-07-2008", endDate: "23-07-2012" },
];

const formatDashaDate = (str) => {
  if (!str) return "-";
  if (typeof str !== "string") return String(str);
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return str.split("T")[0];
  }
  return str;
};

// Generate Pratyantardasha fallback periods proportionally if not provided
const generatePratyantardashaFallback = (
  antarLord,
  antarStartStr,
  antarEndStr,
) => {
  const sDate = new Date(antarStartStr);
  const eDate = new Date(antarEndStr);
  if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
    return VIMSHOTTARI_CYCLE.map((p) => ({
      name: p.name,
      startDate: antarStartStr,
      endDate: antarEndStr,
    }));
  }

  const totalMs = eDate.getTime() - sDate.getTime();
  const startIdx = VIMSHOTTARI_CYCLE.findIndex(
    (p) => p.name.toLowerCase() === (antarLord || "").toLowerCase(),
  );
  const offset = startIdx !== -1 ? startIdx : 0;

  let currentMs = sDate.getTime();
  return Array.from({ length: 9 }, (_, i) => {
    const planet = VIMSHOTTARI_CYCLE[(offset + i) % 9];
    const durationMs = totalMs * (planet.years / 120);
    const startObj = new Date(currentMs);
    currentMs += durationMs;
    const endObj = new Date(currentMs);

    return {
      name: planet.name,
      startDate: `${String(startObj.getDate()).padStart(2, "0")}-${String(
        startObj.getMonth() + 1,
      ).padStart(2, "0")}-${startObj.getFullYear()}`,
      endDate: `${String(endObj.getDate()).padStart(2, "0")}-${String(
        endObj.getMonth() + 1,
      ).padStart(2, "0")}-${endObj.getFullYear()}`,
    };
  });
};

const DashaTab = ({ data, fullData }) => {
  const [activeTab, setActiveTab] = useState("Major dasha");
  const [selectedMahadasha, setSelectedMahadasha] = useState(null);
  const [selectedAntardasha, setSelectedAntardasha] = useState(null);

  const isYogini = activeTab === "Yogini";

  // Comprehensive Mahadasha List (Level 1)
  const mahadashaList = useMemo(() => {
    // 1. Check dasha_periods (Prokerala full tree with pratyantardasha)
    const periods = fullData?.dasha_periods || fullData?.dasha?.dasha_periods;
    if (Array.isArray(periods) && periods.length > 0) {
      return periods.map((p) => ({
        id: p.id,
        name: p.name || p.planet || "Planet",
        startDate: formatDashaDate(p.start || p.startDate),
        endDate: formatDashaDate(p.end || p.endDate),
        rawStart: p.start || p.startDate,
        rawEnd: p.end || p.endDate,
        antardasha: p.antardasha || [],
      }));
    }

    // 2. Check dasha.mahadasha
    const maha =
      fullData?.dasha?.mahadasha ||
      data?.mahadasha ||
      fullData?.vimshottari_dasha;
    if (Array.isArray(maha) && maha.length > 0) {
      return maha.map((p) => ({
        id: p.id,
        name: p.name || p.planet?.split("/")?.[0] || "Planet",
        startDate: formatDashaDate(p.startDate || p.start),
        endDate: formatDashaDate(p.endDate || p.end),
        rawStart: p.startDate || p.start,
        rawEnd: p.endDate || p.end,
        antardasha: p.antardasha || [],
      }));
    }

    return majorFallbackData;
  }, [data, fullData]);

  // Yogini Dasha List
  const yoginiList = useMemo(() => {
    const raw =
      fullData?.dasha?.yogini ||
      data?.yogini ||
      fullData?.yogini_dasha ||
      fullData?.yogini;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((d) => ({
        name: d.planet || d.name || "Dasha",
        ruler: d.ruler || "-",
        startDate: formatDashaDate(d.startDate || d.start),
        endDate: formatDashaDate(d.endDate || d.end),
      }));
    }
    return yoginiFallbackData;
  }, [data, fullData]);

  // Active Antardasha List (Level 2)
  const antardashaList = useMemo(() => {
    if (!selectedMahadasha) return [];

    // Find rich entry in dasha_periods if available
    const periods =
      fullData?.dasha_periods || fullData?.dasha?.dasha_periods || [];
    const richMaha = periods.find(
      (p) =>
        (p.name || "").toLowerCase() === selectedMahadasha.name.toLowerCase() ||
        p.id === selectedMahadasha.id,
    );

    const sourceAntar =
      richMaha?.antardasha || selectedMahadasha.antardasha || [];

    if (Array.isArray(sourceAntar) && sourceAntar.length > 0) {
      return sourceAntar.map((a) => {
        const pName =
          a.name || (a.planet ? a.planet.split("/").pop() : null) || "Planet";
        return {
          id: a.id,
          name: pName,
          startDate: formatDashaDate(a.start || a.startDate),
          endDate: formatDashaDate(a.end || a.endDate),
          rawStart: a.start || a.startDate,
          rawEnd: a.end || a.endDate,
          pratyantardasha: a.pratyantardasha || [],
        };
      });
    }

    // Fallback Antardasha calculation
    const startIdx = VIMSHOTTARI_CYCLE.findIndex(
      (p) => p.name.toLowerCase() === selectedMahadasha.name.toLowerCase(),
    );
    const offset = startIdx !== -1 ? startIdx : 0;
    return Array.from({ length: 9 }, (_, i) => {
      const p = VIMSHOTTARI_CYCLE[(offset + i) % 9];
      return {
        name: p.name,
        startDate: selectedMahadasha.startDate,
        endDate: selectedMahadasha.endDate,
        pratyantardasha: [],
      };
    });
  }, [selectedMahadasha, fullData]);

  // Active Pratyantardasha List (Level 3)
  const pratyantardashaList = useMemo(() => {
    if (!selectedAntardasha) return [];

    // 1. Direct from selectedAntardasha
    if (
      Array.isArray(selectedAntardasha.pratyantardasha) &&
      selectedAntardasha.pratyantardasha.length > 0
    ) {
      return selectedAntardasha.pratyantardasha.map((pr) => ({
        id: pr.id,
        name: pr.name || pr.planet || "Planet",
        startDate: formatDashaDate(pr.start || pr.startDate),
        endDate: formatDashaDate(pr.end || pr.endDate),
      }));
    }

    // 2. Search in dasha_periods
    const periods =
      fullData?.dasha_periods || fullData?.dasha?.dasha_periods || [];
    for (const m of periods) {
      if (m.antardasha && Array.isArray(m.antardasha)) {
        for (const a of m.antardasha) {
          if (
            ((a.name &&
              a.name.toLowerCase() === selectedAntardasha.name.toLowerCase()) ||
              a.id === selectedAntardasha.id) &&
            Array.isArray(a.pratyantardasha) &&
            a.pratyantardasha.length > 0
          ) {
            return a.pratyantardasha.map((pr) => ({
              id: pr.id,
              name: pr.name || pr.planet || "Planet",
              startDate: formatDashaDate(pr.start || pr.startDate),
              endDate: formatDashaDate(pr.end || pr.endDate),
            }));
          }
        }
      }
    }

    // 3. Fallback proportional calculation
    return generatePratyantardashaFallback(
      selectedAntardasha.name,
      selectedAntardasha.rawStart || selectedAntardasha.startDate,
      selectedAntardasha.rawEnd || selectedAntardasha.endDate,
    );
  }, [selectedAntardasha, fullData]);

  // Switch tabs and reset drill-down
  const handleTabSwitch = (item) => {
    setActiveTab(item);
    setSelectedMahadasha(null);
    setSelectedAntardasha(null);
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher (Major dasha / Yogini) */}
      <View style={styles.switchRow}>
        {dashaTabs.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleTabSwitch(item)}
            activeOpacity={0.8}
            style={[
              styles.switchBtn,
              activeTab === item && styles.activeSwitchBtn,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                activeTab === item && styles.activeSwitchText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Breadcrumb Path & Drill-down Navigation */}
      {!isYogini && (
        <View style={styles.pathRow}>
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
                !selectedMahadasha && styles.breadcrumbActive,
              ]}
            >
              Mahadasha
            </Text>
          </TouchableOpacity>

          <Text style={styles.arrow}>›</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!selectedMahadasha}
            onPress={() => setSelectedAntardasha(null)}
          >
            <Text
              style={[
                styles.breadcrumbText,
                selectedMahadasha &&
                  !selectedAntardasha &&
                  styles.breadcrumbActive,
                !selectedMahadasha && styles.breadcrumbDisabled,
              ]}
            >
              {selectedMahadasha
                ? `Antardasha (${selectedMahadasha.name})`
                : "Antardasha"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.arrow}>›</Text>

          <Text
            style={[
              styles.breadcrumbText,
              selectedAntardasha && styles.breadcrumbActive,
              !selectedAntardasha && styles.breadcrumbDisabled,
            ]}
          >
            {selectedAntardasha
              ? `Pratyantar (${selectedAntardasha.name})`
              : "PratyantarDasha"}
          </Text>
        </View>
      )}

      {/* Yogini Header */}
      {isYogini && (
        <View style={styles.pathRow}>
          <Text style={styles.breadcrumbActive}>Yogini Dasha</Text>
          <Text style={styles.arrow}>›</Text>
          <Text style={styles.breadcrumbText}>Cycle Periods</Text>
        </View>
      )}

      {/* Dynamic Table Content */}
      {isYogini ? (
        <DashaTable
          headers={["Dasha", "Ruler", "Start Date", "End Date"]}
          data={yoginiList.map((y) => [
            y.name,
            y.ruler,
            y.startDate,
            y.endDate,
          ])}
        />
      ) : selectedAntardasha ? (
        // Level 3: Pratyantardasha Table
        <View>
          <View style={styles.subHeaderBox}>
            <TouchableOpacity
              onPress={() => setSelectedAntardasha(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹ Back to Antardasha</Text>
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>
              {selectedMahadasha?.name} › {selectedAntardasha?.name}{" "}
              Pratyantardashas
            </Text>
          </View>
          <DashaTable
            headers={["Pratyantar Lord", "Start Date", "End Date"]}
            data={pratyantardashaList.map((pr) => [
              pr.name,
              pr.startDate,
              pr.endDate,
            ])}
          />
        </View>
      ) : selectedMahadasha ? (
        // Level 2: Antardasha Table
        <View>
          <View style={styles.subHeaderBox}>
            <TouchableOpacity
              onPress={() => setSelectedMahadasha(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹ Back to Mahadashas</Text>
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>
              {selectedMahadasha?.name} Mahadasha Antardashas
            </Text>
          </View>
          <DashaTable
            headers={["Antardasha Lord", "Start Date", "End Date"]}
            data={antardashaList.map((a) => [a.name, a.startDate, a.endDate])}
            showArrow
            onRowPress={(index) => {
              if (antardashaList[index]) {
                setSelectedAntardasha(antardashaList[index]);
              }
            }}
          />
        </View>
      ) : (
        // Level 1: Mahadasha Table
        <DashaTable
          headers={["Mahadasha Lord", "Start Date", "End Date"]}
          data={mahadashaList.map((m) => [m.name, m.startDate, m.endDate])}
          showArrow
          onRowPress={(index) => {
            if (mahadashaList[index]) {
              setSelectedMahadasha(mahadashaList[index]);
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const DashaTable = ({ headers, data, showArrow = false, onRowPress }) => {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {headers.map((h, i) => (
          <Text key={i} style={styles.headerCell}>
            {h}
          </Text>
        ))}
        {showArrow && <Text style={styles.iconHeader} />}
      </View>

      {data.map((row, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={onRowPress ? 0.7 : 1}
          onPress={() => onRowPress && onRowPress(index)}
          style={[styles.row, index % 2 === 0 && styles.lightRow]}
        >
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={styles.bodyCell}>
              {cell}
            </Text>
          ))}
          {showArrow && <Text style={styles.iconCell}>›</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DashaTab;

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
