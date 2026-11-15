// src/app/(app)/Vaults.tsx
import { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router"; // Import useFocusEffect
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";
import { Colors, Spacing, Typography, Shadows } from "../../theme";

type Vault = {
    id: string;
    name: string;
    status: string;
    location: string;
    price_per_hour: number;
};

export default function Vaults() {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState<
        string | null
    >(null);

    // Fetch vaults (can be called on mount or on pull-to-refresh)
    const fetchVaults = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setIsRefreshing(true);
        else setIsLoading(true);

        const { data, error } = await supabase
            .from("vaults")
            .select("*")
            .eq("status", "available");

        if (error) {
            Alert.alert("Error", "Failed to load vaults");
        } else {
            setVaults(data || []);
        }

        setIsLoading(false);
        setIsRefreshing(false);
    };

    // useFocusEffect runs every time the screen comes into view.
    // This means when you close the payment browser, this will auto-refresh!
    useFocusEffect(
        useCallback(() => {
            fetchVaults();
        }, []),
    );

    // Trigger PayMongo Checkout
    const handleRent = async (vault: Vault) => {
        setIsProcessingPayment(vault.id);
        try {
            // 1. Call Supabase Edge Function to create checkout session
            const { data, error } = await supabase.functions.invoke(
                "create-checkout",
                {
                    body: {
                        amount: vault.price_per_hour,
                        description: `Rental for ${vault.name}`,
                        vaultId: vault.id,
                    },
                },
            );

            if (error) throw error;

            // 2. Open PayMongo Checkout with openAuthSessionAsync.
            // This forces the browser to close when it detects the "vaulty://" scheme.
            const result = await WebBrowser.openAuthSessionAsync(
                data.checkout_url,
                "vaulty://",
            );

            // 3. Handle return to app
            if (result.type === "success") {
                // When the browser closes, useFocusEffect above automatically re-fetches the list.
                // The vault you just paid for will be gone (because it's now locked).
                Alert.alert(
                    "Payment Successful",
                    "Your vault has been locked and is ready to use.",
                );
            }
        } catch (error: any) {
            Alert.alert(
                "Payment Error",
                error.message || "Could not initiate payment.",
            );
        } finally {
            setIsProcessingPayment(null);
        }
    };

    const renderVaultItem = ({ item }: { item: Vault }) => (
        <View style={styles.vaultCard}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.locationText}>{item.location}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Available</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.priceLabel}>Rate</Text>
                    <Text style={styles.priceValue}>
                        ₱{(item.price_per_hour / 100).toFixed(2)}{" "}
                        <Text style={styles.priceUnit}>/ hr</Text>
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.rentButton,
                        isProcessingPayment === item.id && { opacity: 0.7 },
                    ]}
                    onPress={() => handleRent(item)}
                    disabled={!!isProcessingPayment}
                >
                    {isProcessingPayment === item.id ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                        <Text style={styles.rentButtonText}>Rent Now</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headTitle}>Available Vaults</Text>
                <Text style={styles.headSubTitle}>
                    Select a smart locker to rent
                </Text>
            </View>

            {isLoading && !isRefreshing ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary}
                    style={{ marginTop: 50 }}
                />
            ) : (
                <FlatList
                    data={vaults}
                    keyExtractor={(item) => item.id}
                    renderItem={renderVaultItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => fetchVaults(true)}
                            colors={[Colors.primary]} // Android
                            tintColor={Colors.primary} // iOS
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No vaults available right now.
                            </Text>
                            <Text style={styles.emptySubText}>
                                Pull down to refresh.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.silverLight },
    header: { padding: Spacing.lg, paddingBottom: 0 },
    headTitle: { ...Typography.h2, marginBottom: Spacing.xs },
    headSubTitle: { ...Typography.body },
    listContent: { padding: Spacing.lg },
    vaultCard: {
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.silver,
        marginBottom: Spacing.md,
        ...Shadows.card,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    cardTitle: { ...Typography.h3, marginBottom: 4 },
    locationText: { ...Typography.caption },
    statusBadge: {
        backgroundColor: "#ECFDF5", // Light green
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: { color: Colors.success, fontSize: 12, fontWeight: "bold" },
    divider: {
        height: 1,
        backgroundColor: Colors.silver,
        marginVertical: Spacing.md,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    priceLabel: { ...Typography.caption, marginBottom: 2 },
    priceValue: { fontSize: 20, fontWeight: "bold", color: Colors.text },
    priceUnit: { fontSize: 14, fontWeight: "normal", color: Colors.textMuted },
    rentButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: 10,
        ...Shadows.button,
    },
    rentButtonText: { color: Colors.white, fontWeight: "bold", fontSize: 14 },
    emptyContainer: { alignItems: "center", marginTop: 40 },
    emptyText: { ...Typography.h3, color: Colors.textMuted, marginBottom: 4 },
    emptySubText: { ...Typography.body, color: Colors.silverDark },
});
