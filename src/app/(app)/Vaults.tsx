import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Import Theme
import { Colors, Spacing, Typography, Shadows } from "../../theme";

export default function Vaults() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.headTitle}>My Vaults</Text>
                    <Text style={styles.headSubTitle}>Current Rented vaults and status</Text>
                </View>

                {/* Main Vault list */}
                <View style={styles.vaultCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>[ LG01 ] Vault</Text>
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
    headTitle: {
        ...Typography.h2,
        marginBottom: Spacing.xs,
    },
    headSubTitle:{
        ...Typography.body
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
});