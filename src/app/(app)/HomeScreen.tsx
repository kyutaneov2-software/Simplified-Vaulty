// src/app/(app)/index.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter} from "expo-router";
// Import SafeAreaView for platform awareness (notches/status bars)
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
// Import Theme
import { Colors, Spacing, Typography, Shadows } from "../../theme";

/**
 * Home Screen component.
 * Placeholder for ESP32 connection and Vault management.
 */
export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    // Extract the username from the email (e.g., "jeremy" from "jeremy@example.com")
    const username = user?.email?.split("@")[0] || "User";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {username}</Text>
                    <Text style={styles.subGreeting}>
                        Welcome to your vault dashboard
                    </Text>
                </View>

                {/* Main Vault Card */}
                <View style={styles.vaultCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Main Vault</Text>
                        <View style={styles.statusBadge}>
                            <Ionicons
                                name="lock-closed"
                                size={16}
                                color={Colors.error}
                            />
                            <Text style={styles.statusText}>Locked</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* ESP32 Connection Status */}
                    <View style={styles.connectionRow}>
                        <Ionicons
                            name="wifi"
                            size={20}
                            color={Colors.warning}
                        />
                        <Text style={styles.cardSubtext}>
                            ESP32 Connection:{" "}
                            <Text style={{ fontWeight: "bold" }}>Pending</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.silverLight, // Silver theme background

    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    header: {
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    greeting: {
        ...Typography.h2,
        marginBottom: Spacing.xs,
    },
    subGreeting: {
        ...Typography.body,
    },
    vaultCard: {
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.silver, // Silver border
        ...Shadows.card, // Use theme shadow
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        ...Typography.h3,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2", // Light red background for 'Locked'
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        color: Colors.error,
        fontWeight: "bold",
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.silver,
        marginVertical: Spacing.md,
    },
    connectionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    cardSubtext: {
        ...Typography.body,
        fontSize: 14,
    },
});
