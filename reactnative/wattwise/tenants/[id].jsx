import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function TenantDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Tenant ${id}` }} />

      <Text style={styles.title}>Tenant Profile</Text>
      <Text style={styles.text}>Tenant ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  text: { marginTop: 10, fontSize: 16 },
});
