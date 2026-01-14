import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import path from "path";


/* ---------- IMAGE HELPER ---------- */
const img = (file) =>
  path.resolve(process.cwd(), "public", file);

/* ---------- ICONS ---------- */
const ICONS = {
  flight: img("images/pdf-icons/flight.png"),
  hotel: img("images/pdf-icons/hotel.png"),
  transport: img("images/pdf-icons/transport.png"),
  sightseeing: img("images/pdf-icons/sightseeing.png"),
  meal: img("images/pdf-icons/meal.png"),
  highlight: img("images/pdf-icons/highlight.png"),
  inclusion: img("images/pdf-icons/inclusion.png"),
  exclusion: img("images/pdf-icons/exclusion.png"),
  facebook: img("images/pdf-icons/facebook.png"),
  instagram: img("images/pdf-icons/instagram.png"),
};

/* ---------- COLORS ---------- */
const BG = "#F7F9FC";
const BLUE = "#1F4FD8";
const TEXT = "#222";
const BORDER = "#E5EAF2";

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  

  /* HEADER */
  header: {
  position: "absolute",
  top: 18,
  left: 40,
  right: 40,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
},

socialBlock: {
  alignItems: "flex-end",
  marginTop: 25,
},



logo: {
  width: 180,
  alignSelf: "flex-start",
  marginTop: -18,   // 👈 ADD THIS
},

divider: {
  position: "absolute",
  top: 120,
  left: 40,
  right: 40,
  height: 1,
  backgroundColor: BORDER,
},
/* TRIP HEADER */
tripHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 20,
},

tripLeft: {
  flex: 1,
},

destinationText: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#1526c7",
},

preparedFor: {
  fontSize: 13,
  color: "#555",
  marginTop: 6,
},

tripRight: {
  flexDirection: "column",
  alignItems: "flex-end",
},

tripInfoBox: {
  backgroundColor: "#FFF6EC",
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginBottom: 8,
  minWidth: 160,
},

tripInfoLabel: {
  fontSize: 8,
  color: "#777",
  marginBottom: 2,
},

tripInfoValue: {
  fontSize: 11,
  fontWeight: "bold",
  color: "#333",
},



socialRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},

socialIcon: {
  width: 14,
  height: 14,
  marginRight: 6,
},

socialText: {
  fontSize: 9,
  color: "#444",
},




page: {
  backgroundColor: BG,
  paddingTop: 140,   // 🔑 content starts cleanly below header
  paddingBottom: 110,
  paddingHorizontal: 40,
  fontFamily: "Helvetica",
  fontSize: 11,
  color: TEXT,
},


  /* TITLES */
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: BLUE,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 11,
    color: "#555",
    marginBottom: 16,
  },

  /* DAY CARD */
  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    border: `1 solid ${BORDER}`,
    padding: 14,
    marginBottom: 14,
  },

  dayRow: {
    flexDirection: "row",
  },

  dayLeft: {
    width: 36,
    alignItems: "center",
  },

  dayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumber: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  dayRight: {
    flex: 1,
    paddingLeft: 10,
  },
  activityBlock: {
  marginTop: 8,
  backgroundColor: "#F7F9FC",
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
  border: `1 solid ${BORDER}`,
},

mealBlock: {
  backgroundColor: "#EEF3FF",
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 4,
},
mealText: {
  fontSize: 9,
  color: BLUE,
},


  dayTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },


 dayTitleRow: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",          // 🔑 REQUIRED
},


dayTitle: {
  fontSize: 13,
  fontWeight: "bold",
  flexGrow: 1,   
  flex: 1,         // 🔑 pushes meal to extreme right
},


mealPill: {
  backgroundColor: "#EEF3FF",
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
},

mealText: {
  fontSize: 9,
  color: "#1F4FD8",
},

 bullet: {
  fontSize: 10.5,
  marginBottom: 1,
  lineHeight: 1.25,
},


  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  icon: {
    width: 14,
    height: 14,
    marginRight: 8,
  },

  

  activityBlock: {
  backgroundColor: "#F8FAFF",
  borderRadius: 10,
  padding: 10,
  marginTop: 8,
},

activityRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},

activityText: {
  fontSize: 10.5,
  color: "#333",
},

highlightsBlock: {
  marginTop: 10,
  paddingTop: 8,
  borderTop: `1 solid ${BORDER}`,   // subtle separator like sample
},

highlightsTitle: {
  fontSize: 11,
  fontWeight: "bold",
  color: "#090909",
  marginBottom: 6,
},

highlightRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F8FAFF",
  borderRadius: 10,
  paddingVertical: 6,
  paddingHorizontal: 10,
  marginBottom: 6,
},

highlightStar: {
  width: 12,
  height: 12,
  marginRight: 8,
},




highlightIndex: {
  width: 14,
  fontSize: 10,
  fontWeight: "bold",
},


  highlightWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },

  highlightText: {
  fontSize: 10.5,
  color: "#333",
  flexShrink: 1,        // 🔑 prevents broken words
},
  

  /* SECTION CARD */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    border: `1 solid ${BORDER}`,
    padding: 14,
    marginTop: 14,
  },

  sectionTitle: {
  fontSize: 13,
  fontWeight: "bold",
  color: BLUE,
  marginBottom: 6,
},

  /* PRICING */
  priceCard: {
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  priceLabel: {
    color: "#444",
  },

  priceValue: {
    fontWeight: "bold",
  },

  total: {
    marginTop: 10,
    paddingTop: 8,
    borderTop: `1 solid ${BORDER}`,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
    color: BLUE,
  },

  termsText: {
  fontSize: 10,
  marginBottom: 4,
  color: "#444",
},

  /* TRIP SUMMARY */
  tripCard: {
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },

  tripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tripItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },

  tripIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
  },

  tripLabel: {
    fontSize: 9,
    color: "#666",
  },

  tripValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#222",
  },


  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  footerImg: {
    width: "100%",
  },
});

/* ---------- COMPONENT ---------- */

export default function ItineraryPDF({ data = {} }) {
  const pricing = data.pricing || {};
  const adultTotal = (pricing.adults || 0) * (pricing.adultCost || 0);
  const childTotal = (pricing.children || 0) * (pricing.childCost || 0);
  const grandTotal = adultTotal + childTotal;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        {/* HEADER */}
{/* HEADER */}
<View fixed style={styles.header}>
  <Image src={img("Oggy-logo.png")} style={styles.logo} />

  <View style={styles.socialBlock}>
    <View style={styles.socialRow}>
      <Image src={ICONS.facebook} style={styles.socialIcon} />
      <Text style={styles.socialText}>@oggyholidays</Text>
    </View>

    <View style={styles.socialRow}>
      <Image src={ICONS.instagram} style={styles.socialIcon} />
      <Text style={styles.socialText}>@oggyholidays</Text>
    </View>
  </View>
</View>

<View style={styles.divider} fixed />


{/* TRIP SUMMARY */}
{/* TRIP HEADER */}
{data.trip && (
  <View style={styles.tripHeader}>
    {/* LEFT : Destination */}
    <View style={styles.tripLeft}>
  {/* Destination */}
  <Text style={styles.destinationText}>
    {data.trip.destination}
  </Text>

  {/* Prepared for client */}
  {data.client?.name && (
    <Text style={styles.preparedFor}>
      Prepared for {data.client.name} by Oggy Holidays
    </Text>
  )}
</View>


    

    {/* RIGHT : Meta info */}
    <View style={styles.tripRight}>
      <View style={styles.tripInfoBox}>
        <Text style={styles.tripInfoLabel}>TRAVEL DATES</Text>
        <Text style={styles.tripInfoValue}>
          {data.trip.startDate} – {data.trip.endDate}
        </Text>
      </View>

      <View style={styles.tripInfoBox}>
        <Text style={styles.tripInfoLabel}>GUESTS</Text>
        <Text style={styles.tripInfoValue}>
          {data.trip.guests}
        </Text>
      </View>
    </View>
  </View>
)}




        {/* TITLE */}
       

  




        {/* DAYS */}
        
{/* DAYS */}
/* DAYS */
{(data.days || []).map((day, i) => {
  const meals = (day.activities || [])
    .filter((a) => a.type === "meal" && a.title)
    .map((a) => a.title.trim())
    .filter(Boolean);

  const nonMealActivities = (day.activities || []).filter(
    (a) => a.type !== "meal"
  );

  return (
    <View key={i} style={styles.dayCard}>
      <View style={styles.dayRow}>
        <View style={styles.dayLeft}>
          <View style={styles.dayCircle}>
            <Text style={styles.dayNumber}>{i + 1}</Text>
          </View>
        </View>

        <View style={styles.dayRight}>
          {/* Title + meal pill */}
          <View style={{ marginBottom: 6 }}>
            <View style={styles.dayTitleRow}>
              <Text style={styles.dayTitle}>{day.title}</Text>

              {meals.length > 0 && (
                <View style={styles.mealPill}>
                  <Text style={styles.mealText}>{meals.join(", ")}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description bullets */}
          {day.description && (
  <Text
    style={{
      marginTop: 6,
      fontSize: 10.5,
      lineHeight: 1.4,
      whiteSpace: "pre-wrap", // 🔑 preserves user formatting
    }}
  >
    {day.description}
  </Text>
)}


          {/* Non-meal activities */}
          {nonMealActivities.length > 0 && (
            <View style={styles.activityBlock}>
              {nonMealActivities.map((a, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
                >
                  <Image src={ICONS[a.type]} style={styles.icon} />
                  <Text style={{ marginLeft: 8 }}>{a.title}</Text>
                </View>
              ))}
            </View>
          )}

     {(day.highlights || []).length > 0 && (
  <View style={styles.highlightsBlock}>
    <Text style={styles.highlightsTitle}>HIGHLIGHTS</Text>

    {day.highlights.map((h, idx) => (
      <View key={idx} style={styles.highlightRow}>
        <Image
          src={ICONS.highlight}
          style={styles.highlightStar}
        />
        <Text style={styles.highlightText}>{h}</Text>
      </View>
    ))}
  </View>
)}




        </View>
      </View>
    </View>
  );
})}


        {/* INCLUSIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Inclusions</Text>
          {(data.inclusions || []).map((i, idx) => (
            <View key={idx} style={styles.iconRow}>
              <Image src={ICONS.inclusion} style={styles.icon} />
              <Text>{i}</Text>
            </View>
          ))}
        </View>

        {/* EXCLUSIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Exclusions</Text>
          {(data.exclusions || []).map((e, idx) => (
            <View key={idx} style={styles.iconRow}>
              <Image src={ICONS.exclusion} style={styles.icon} />
              <Text>{e}</Text>
            </View>
          ))}
        </View>

        {/* PRICING */}
        <View style={styles.priceCard}>
  <View style={styles.priceRow}>
    <Text style={styles.priceLabel}>
      Adults ({pricing.adults || 0}) × ₹{pricing.adultCost || 0}
    </Text>
    <Text style={styles.priceValue}>
      ₹ {adultTotal.toLocaleString()}
    </Text>
  </View>

  <View style={styles.priceRow}>
    <Text style={styles.priceLabel}>
      Children ({pricing.children || 0}) × ₹{pricing.childCost || 0}
    </Text>
    <Text style={styles.priceValue}>
      ₹ {childTotal.toLocaleString()}
    </Text>
  </View>

  <View
    style={{
      borderTop: `1 solid ${BORDER}`,
      marginTop: 8,
      paddingTop: 8,
    }}
  >
    <Text style={styles.total}>
      Grand Total: ₹ {grandTotal.toLocaleString()}
    </Text>
  </View>
</View>
{/* TERMS & CONDITIONS */}
<View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Terms & Conditions</Text>

  <Text style={styles.termsText}>
    • Prices are subject to availability at the time of booking.
  </Text>
  <Text style={styles.termsText}>
    • Hotel check-in and check-out as per hotel policy.
  </Text>
  <Text style={styles.termsText}>
    • Transportation timings are subject to local conditions.
  </Text>
  <Text style={styles.termsText}>
    • Any personal expenses are not included.
  </Text>
  <Text style={styles.termsText}>
    • Cancellation charges apply as per policy.
  </Text>
</View>



        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Image src={img("Oggy-footer.png")} style={styles.footerImg} />
        </View>

      </Page>
    </Document>
  );
}
