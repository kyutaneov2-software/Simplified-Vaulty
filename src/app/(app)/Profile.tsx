// src/app/(app)/Profile.tsx
import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// ✅ FIX 1: Import useRouter
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
// ✅ FIX 2: Import supabase client
import { supabase } from "../../lib/supabase";
import { Colors, Spacing, Typography, Shadows } from "../../theme";

export default function Profile() {
    const { user, signOut } = useAuth();
    // ✅ Now useRouter will work
    const router = useRouter();

    const [isMfaEnabled, setIsMfaEnabled] = useState(false);
    const [isCheckingMfa, setIsCheckingMfa] = useState(true);

    useEffect(() => {
        const checkMfaStatus = async () => {
            // ✅ Now supabase will work
            const { data, error } = await supabase.auth.mfa.listFactors();

            if (!error && data?.totp) {
                const hasVerifiedFactor = data.totp.some(
                    (factor) => factor.status === "verified",
                );
                setIsMfaEnabled(hasVerifiedFactor);
            }
            setIsCheckingMfa(false);
        };

        checkMfaStatus();
    }, []);

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out of Vaulty?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            Alert.alert("Error", "Failed to sign out");
                        }
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons
                            name="person"
                            size={50}
                            color={Colors.primary}
                        />
                    </View>
                    <Text style={styles.emailText}>{user?.email}</Text>
                    <View style={styles.badge}>
                        <Ionicons
                            name="shield-checkmark"
                            size={14}
                            color={Colors.primary}
                        />
                        <Text style={styles.badgeText}>Verified User</Text>
                    </View>
                </View>

                {/* Account Information Card */}
                <Text style={styles.sectionTitle}>Account Details</Text>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={Colors.silverDark}
                            />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <Text style={styles.value}>{user?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color={Colors.silverDark}
                            />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Account ID</Text>
                            <Text style={styles.value}>
                                {user?.id
                                    ? `${user.id.substring(0, 8)}...`
                                    : "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Security Card */}
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.actionRow}
                        onPress={() => router.push("/mfa-setup")}
                        disabled={isCheckingMfa}
                    >
                        <View style={styles.infoRow}>
                            <View style={styles.iconBox}>
                                <Ionicons
                                    name={
                                        isMfaEnabled
                                            ? "shield-checkmark"
                                            : "lock-closed-outline"
                                    }
                                    size={20}
                                    color={
                                        isMfaEnabled
                                            ? Colors.success
                                            : Colors.primary
                                    }
                                />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text
                                    style={[styles.value, { marginBottom: 0 }]}
                                >
                                    Two-Factor Auth
                                </Text>

                                {isCheckingMfa ? (
                                    <Text style={styles.label}>
                                        Checking status...
                                    </Text>
                                ) : isMfaEnabled ? (
                                    <Text
                                        style={[
                                            styles.label,
                                            { color: Colors.success },
                                        ]}
                                    >
                                        Enabled (TOTP)
                                    </Text>
                                ) : (
                                    <Text style={styles.label}>
                                        Setup TOTP Authenticator
                                    </Text>
                                )}
                            </View>
                        </View>

                        {isCheckingMfa ? (
                            <ActivityIndicator
                                size="small"
                                color={Colors.silver}
                            />
                        ) : (
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={Colors.silver}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={Colors.error}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.silverLight,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        backgroundColor: Colors.primaryLight,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.md,
        borderWidth: 3,
        borderColor: Colors.white,
        ...Shadows.card,
    },
    emailText: {
        ...Typography.h3,
        marginBottom: Spacing.xs,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: "bold",
    },
    sectionTitle: {
        ...Typography.caption,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.silver,
        ...Shadows.card,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.silverLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Spacing.md,
    },
    infoTextContainer: {
        flex: 1,
    },
    label: {
        ...Typography.caption,
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: "600",
        marginBottom: Spacing.xs,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.silver,
        marginVertical: Spacing.md,
        marginLeft: 56,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    signOutButton: {
        flexDirection: "row",
        backgroundColor: "#FEE2E2",
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: Spacing.md,
        borderWidth: 1,
        borderColor: "#FECACA",
    },
    signOutText: {
        color: Colors.error,
        fontWeight: "bold",
        fontSize: 16,
    },
});
