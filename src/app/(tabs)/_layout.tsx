import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.inactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },

                tabBarStyle: {
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: 45,

                    backgroundColor: "rgb(243, 202, 227)",

                    borderRadius: 25,

                    height: 70,

                    paddingBottom: 8,
                    paddingTop: 8,

                    ...Platform.select({
                        ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                        },
                        android: {
                            elevation: 10,
                        },
                        web: {
                            boxShadow: "0px 6px 10px rgba(0,0,0,0.15)",
                        },
                    }),
                }, tabBarItemStyle: {
                    marginVertical: 5,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={focused ? 28 : 24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="BhajansScreen"
                options={{
                    title: "Bhajans",
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "music-box-multiple" : "music-box-multiple-outline"} size={focused ? 28 : 24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}