import { View, Image, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 90 },
  social: { fontSize: 10 },
});

export default function Header() {
  return (
    <View style={styles.header}>
      <Image src="/oggy-logo.png" style={styles.logo} />
      <Text style={styles.social}>
        Facebook: @oggyholidays | Instagram: @oggyholidays
      </Text>
    </View>
  );
}
