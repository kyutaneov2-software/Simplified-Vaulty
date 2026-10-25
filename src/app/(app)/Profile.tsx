// src/app/(app)/profile.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

/**
 * Profile Screen component.
 * Displays user information and handles sign out.
 */
export default function Profile() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            Alert.alert("Error", "Failed to sign out");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{user?.email}</Text>

                <Text style={styles.label}>Account ID</Text>
                <Text style={styles.value}>{user?.id.substring(0, 8)}...</Text>
            </View>

            {/* Future: MFA Setup Button will go here */}

            <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
            >
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
    profileInfo: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: { fontSize: 14, color: "#64748B", marginBottom: 5 },
    value: {
        fontSize: 16,
        color: "#1E293B",
        fontWeight: "500",
        marginBottom: 20,
    },
    signOutButton: {
        backgroundColor: "#EF4444",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    signOutText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
