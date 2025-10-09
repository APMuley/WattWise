import { Tabs } from "expo-router";

// first layer of tabs that will give view of
// tenants list as well as user profile
export default function RootLayout() {
  return (
    <Tabs
    screenOptions={{
      headerStyle: {
        backgroundColor: "#384959", // dark header
      },
      headerTintColor: "#bdddfc", // header text color
      tabBarActiveTintColor: "#88adf2", // active tab text
      tabBarInactiveTintColor: "#6a89a7", // inactive tab text
      tabBarStyle: {
        backgroundColor: "#384959", // tab bar background
        borderTopColor: "#6a89a7", // optional border top
      },
    }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="tenantdetails"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}

