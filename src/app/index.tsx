// src/app/index.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// NEW: Import the theme
import { Colors, Spacing, Typography, Shadows } from "../theme";

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.heroSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="shield-checkmark"
                            size={64}
                            color={Colors.primary}
                        />
                    </View>
                    <Text style={styles.title}>Vaulty</Text>
                    <Text style={styles.subtitle}>Secure Smart Rentals</Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.description}>
                        Welcome to your ultimate rental companion. Vaulty
                        connects directly to your physical ESP32 smart vaults,
                        giving you real-time status, secure access, and peace of
                        mind right from your phone.
                    </Text>
                </View>

                <View style={styles.actionSection}>
                    <Link href="/(auth)/sign-up" asChild>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>
                                Get Started
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>
                            Already have an account?{" "}
                        </Text>
                        <Link href="/(auth)/sign-in" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.silverLight, // Using Theme
    },
    content: {
        flex: 1,
        padding: Spacing.lg, // Using Theme
        justifyContent: "space-between",
    },
    heroSection: {
        alignItems: "center",
        marginTop: 60,
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: Colors.primaryLight, // Using Theme
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.md,
        ...Shadows.card, // Using Theme Spread
    },
    title: {
        ...Typography.h1, // Using Theme Spread
        fontSize: 48, // Overriding just the font size
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: Colors.primary, // Using Theme
        fontWeight: "600",
        marginTop: Spacing.xs,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    infoSection: {
        paddingHorizontal: Spacing.sm,
    },
    description: {
        ...Typography.body, // Using Theme Spread
        textAlign: "center",
    },
    actionSection: {
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: Colors.primary, // Using Theme
        padding: Spacing.md,
        borderRadius: 15,
        alignItems: "center",
        ...Shadows.button, // Using Theme Spread
    },
    primaryButtonText: {
        color: Colors.white, // Using Theme
        fontSize: 18,
        fontWeight: "bold",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: Spacing.lg,
    },
    footerText: {
        color: Colors.textMuted, // Using Theme
        fontSize: 15,
    },
    linkText: {
        color: Colors.text, // Using Theme
        fontSize: 15,
        fontWeight: "bold",
    },
});
