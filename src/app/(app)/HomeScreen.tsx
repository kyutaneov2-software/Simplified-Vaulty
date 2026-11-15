// src/app/(app)/HomeScreen.tsx
import { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router"; // Import useFocusEffect
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Colors, Spacing, Typography, Shadows } from "../../theme";

// Type definition for the joined query result
type ActiveRental = {
    id: string;
    start_time: string;
    vaults: {
        name: string;
        location: string;
    };
};

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const username = user?.email?.split("@")[0] || "User";

    const [activeRental, setActiveRental] = useState<ActiveRental | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the user's active rental
    const fetchActiveRental = async () => {
        if (!user) return;

        setIsLoading(true);

        // Use limit(1) instead of maybeSingle to prevent the PGRST116 error
        const { data, error } = await supabase
            .from("rentals")
            .select(
                `
                id,
                start_time,
                vaults (
                    name,
                    location
                )
            `,
            )
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("start_time", { ascending: false }) // Get the most recent first
            .limit(1); // Only fetch 1 row

        if (error) {
            console.error("Error fetching active rental:", error);
        } else if (data && data.length > 0) {
            // Set the first (and only) item in the array
            setActiveRental(data[0] as unknown as ActiveRental);
        } else {
            // No active rentals found
            setActiveRental(null);
        }

        setIsLoading(false);
    };

    // useFocusEffect runs every time you tap the "Home" tab.
    // When you finish paying and tap "Home", it will auto-fetch the new rental!
    useFocusEffect(
        useCallback(() => {
            fetchActiveRental();
        }, [user])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {username}</Text>
                    <Text style={styles.subGreeting}>
                        Welcome to your vault dashboard
                    </Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={{ marginTop: 50 }}
                    />
                ) : activeRental ? (
                    /* ACTIVE RENTAL CARD */
                    <View style={styles.vaultCard}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.cardTitle}>
                                    {activeRental.vaults.name}
                                </Text>
                                <Text style={styles.locationText}>
                                    {activeRental.vaults.location}
                                </Text>
                            </View>
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

                        <View style={styles.connectionRow}>
                            <Ionicons
                                name="wifi"
                                size={20}
                                color={Colors.warning}
                            />
                            <Text style={styles.cardSubtext}>
                                ESP32 Connection:{" "}
                                <Text style={{ fontWeight: "bold" }}>
                                    Pending
                                </Text>
                            </Text>
                        </View>
                    </View>
                ) : (
                    /* EMPTY STATE CARD */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconBox}>
                            <Ionicons
                                name="cube-outline"
                                size={40}
                                color={Colors.silver}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>No Active Rental</Text>
                        <Text style={styles.emptyText}>
                            You don't have any vaults rented right now. Find an
                            available vault to get started.
                        </Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push("/(app)/Vaults")}
                        >
                            <Text style={styles.browseButtonText}>
                                Browse Vaults
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.silverLight,
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
        borderColor: Colors.silver,
        ...Shadows.card,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    cardTitle: {
        ...Typography.h3,
        marginBottom: 4,
    },
    locationText: {
        ...Typography.caption,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2", // Light red
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
    emptyCard: {
        backgroundColor: Colors.white,
        padding: Spacing.xl,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.silver,
        borderStyle: "dashed",
        marginTop: Spacing.xl,
    },
    emptyIconBox: {
        width: 80,
        height: 80,
        backgroundColor: Colors.silverLight,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.md,
    },
    emptyTitle: {
        ...Typography.h3,
        marginBottom: Spacing.xs,
    },
    emptyText: {
        ...Typography.body,
        textAlign: "center",
        marginBottom: Spacing.lg,
    },
    browseButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 12,
        ...Shadows.button,
    },
    browseButtonText: {
        color: Colors.white,
        fontWeight: "bold",
        fontSize: 16,
    },
});