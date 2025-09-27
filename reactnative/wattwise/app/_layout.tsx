import { Tabs } from "expo-router";

export default function RootLayout() {
  // Two tabs at the bottom to navigate
  return (
    <Tabs>
      <Tabs.Screen name="tenants" options={{ title: "Tenants" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile "}} />
    </Tabs>
  );
}
