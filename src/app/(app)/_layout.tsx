// src/app/(app)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
// Import your theme
import { Colors } from "../../theme";

/**
 * Layout for the authenticated app.
 * Sets up the bottom tab navigation with platform-specific styling.
 */
export default function AppLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary, // Vaulty Blue
                tabBarInactiveTintColor: Colors.silverDark, // Silver/Gray
                headerShown: false,

                // Platform-aware Tab Bar Styling
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderTopColor: Colors.silver,

                    // iOS tab bars are naturally taller than Android.
                    // We adjust the height and padding based on the platform.
                    height: Platform.OS === "ios" ? 88 : 64,
                    paddingBottom: Platform.OS === "ios" ? 30 : 10,
                    paddingTop: 10,
                },

                // Optional: Adjusts the label font styling
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: Platform.OS === "ios" ? 0 : 5,
                },
            }}
        >
            {/* 
                Home Tab - maps to app/(app)/HomeScreen.tsx 
                Make sure your file is named exactly 'HomeScreen.tsx'
            */}
            <Tabs.Screen
                name="HomeScreen"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        // Using 'focused' state to switch between filled and outlined icons (Native feel)
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />
            {/* 
                Vaults Tab - map to app/(app)/Vault.tsx
            */}
            <Tabs.Screen
                name="Vaults"
                options={{
                    title: "Vaults",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "cube" : "cube-outline"}
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />

            {/* 
                Profile Tab - maps to app/(app)/Profile.tsx
            */}
            <Tabs.Screen
                name="Profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color as string}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
