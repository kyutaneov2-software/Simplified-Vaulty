// src/app/(app)/index.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

/**
 * Home Screen component.
 * Placeholder for ESP32 connection and Vault management.
 */
export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Hello, {user?.email?.split("@")[0]}
            </Text>

            <View style={styles.vaultCard}>
                <Text style={styles.cardTitle}>Vault Status</Text>
                <Text style={styles.cardStatus}>Locked</Text>
                <Text style={styles.cardSubtext}>
                    ESP32 Connection: Pending
                </Text>
            </View>

            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/(app)/Profile")}
            >
                <Text style={styles.profileButtonText}>Go to Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
    welcome: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E293B",
        marginTop: 20,
        marginBottom: 20,
    },
    vaultCard: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
    cardStatus: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#EF4444",
        marginVertical: 10,
    }, // Red for locked
    cardSubtext: { fontSize: 14, color: "#64748B" },
    profileButton: {
        marginTop: "auto",
        backgroundColor: "#1E293B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    profileButtonText: { color: "#FFF", fontWeight: "bold" },
});
