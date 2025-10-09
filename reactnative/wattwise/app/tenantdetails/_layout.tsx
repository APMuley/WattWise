import { Stack } from "expo-router";

// stack so user can go into details for a tenant
// and take a picture to go for further process
export default function TenantsLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: { backgroundColor: "#384959" },
      headerTintColor: "#bdddfc",
    }}
    >
      <Stack.Screen
        name="tenants"
        options={{ title: "Tenants" }}
      />
      <Stack.Screen
        name="[id]" 
        options={{ title: "Tenant Details" }}
      />
    </Stack>
  );
}
