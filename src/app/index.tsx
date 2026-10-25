// src/app/index.tsx
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Link } from "expo-router";

/**
 * Welcome Screen (Landing Page).
 * Displayed to users who are not logged in. Introduces the app and routes them to Auth.
 */
export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.logoIcon}>🔒</Text>
                    <Text style={styles.title}>Vaulty</Text>
                    <Text style={styles.subtitle}>Secure Smart Rentals</Text>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.description}>
                        Welcome to your ultimate rental companion. Vaulty
                        connects directly to your physical ESP32 smart vaults,
                        giving you real-time status, secure access, and peace of
                        mind right from your phone.
                    </Text>
                </View>

                {/* Action Section */}
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
        backgroundColor: "#F8FAFC",
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between", // Spreads the content evenly vertically
    },
    heroSection: {
        alignItems: "center",
        marginTop: 60,
    },
    logoIcon: {
        fontSize: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: "900",
        color: "#1E293B",
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: "#3B82F6",
        fontWeight: "600",
        marginTop: 5,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    infoSection: {
        paddingHorizontal: 10,
    },
    description: {
        fontSize: 16,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 24,
    },
    actionSection: {
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: "#3B82F6",
        padding: 18,
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    primaryButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        color: "#64748B",
        fontSize: 15,
    },
    linkText: {
        color: "#1E293B",
        fontSize: 15,
        fontWeight: "bold",
    },
});
