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
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addTenant"
        options={{title:"Add a tenant"}}
        />
      
    </Stack>
  );
}
