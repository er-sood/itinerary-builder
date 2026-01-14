import { View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
  },
});

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Image src="/Oggy-footer.png" />
    </View>
  );
}
