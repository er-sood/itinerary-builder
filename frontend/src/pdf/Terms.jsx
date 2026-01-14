import { View, Text } from "@react-pdf/renderer";

export default function Terms() {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Terms & Conditions
      </Text>
      <Text>• Prices subject to availability.</Text>
      <Text>• Check-in/out as per hotel policy.</Text>
      <Text>• Taxes as applicable.</Text>
      <Text>• Cancellation charges apply.</Text>
    </View>
  );
}
