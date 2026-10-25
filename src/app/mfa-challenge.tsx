// src/app/mfa-challenge.tsx
import { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Colors, Spacing, Typography, Shadows} from "../theme/index";

export default function MFAChallenge() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [factorId, setFactorId] = useState<string | null>(null);
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        prepareChallenge();
    },[]);

    const prepareChallenge = async () => {
        try {
            // 1. Find if the user's has a MFA factor and check if has verified TOTP factor
            const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();

            if (listError || !factorsData?.totp?.length){
                throw new Error("No MFA factor found on this account.");
            }

            const verifiedFactor = factorsData.totp.find((f) => f.status === "verified");

            if (!verifiedFactor) throw new Error("No verified MFA factor found.");

            setFactorId(verifiedFactor.id)
            
            // 2. Create a challeng for that factor
            const {data, error} = await supabase.auth.mfa.challenge({
                factorId: verifiedFactor.id
            });

            if (error) throw error;
            setChallengeId(data.id);

        } catch(error: any){
            Alert.alert("MFA Error", error.message || "Failed to initailize MFA.");
            await signOut();
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if(!factorId || !challengeId) return;
        if (code.length !==6) {
            Alert.alert("Invalid code", "Please enter 6-digit code.");
            return;
        }

        setIsVerifying(true);
        // 3. Verify the code entered by the user
        const { error } = await supabase.auth.mfa.verify({
            factorId,
            challengeId,
            code,
        });
        setIsVerifying(false);

        if (error) {
            Alert.alert("Verifation Failed", error.message);
            setCode("") // Clear input for retry
        } else {
            // Success! Supabase session is now AAL2
            // The root _layout.tsx will automatically detect this and route to (app).
            router.replace("/(app)/HomeScreen");
        }
    };

    // Loading screen
    if (isloading) {
        return (
            <SafeAreaView style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    // Main MFA screen
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        {/* ICON LOGO */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-half" size={60} color={Colors.primary} />
                        </View>

                        {/* HEADER */}
                        <Text style={styles.title}>
                            Two-Factor Verification
                        </Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code from your authenticator app
                        </Text>

                        <TextInput 
                            style={styles.input}
                            placeholder="000000"
                            placeholderTextColor={Colors.silver}
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            maxLength={6}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[styles.button, isVerifying && styles.buttonDisabled]}
                            onPress={handleVerify}
                            disabled={isVerifying}
                        >

                            {isVerifying ? (
                                <ActivityIndicator color={Colors.white} />
                            ): (
                                <Text style={styles.buttonText}>Verify</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={signOut} style={styles.cancelButton}
                        >   
                            <Text style={styles.cancelText}>Cancel & Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.silverLight },
    content: { flex: 1, justifyContent: "center", padding: Spacing.lg, alignItems: "center" },
    iconContainer: {
        width: 120, height: 120, backgroundColor: Colors.primaryLight,
        borderRadius: 60, alignItems: "center", justifyContent: "center",
        marginBottom: Spacing.lg, ...Shadows.card,
    },
    title: { ...Typography.h1, textAlign: "center", marginBottom: Spacing.sm },
    subtitle: { ...Typography.body, textAlign: "center", marginBottom: Spacing.xl },
    input: {
        backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12,
        borderWidth: 1, borderColor: Colors.silver, fontSize: 32,
        textAlign: "center", letterSpacing: 10, color: Colors.text,
        marginBottom: Spacing.xl, fontWeight: "bold", width: "100%",
    },
    button: {
        backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12,
        alignItems: "center", width: "100%", ...Shadows.button,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
    cancelButton: { marginTop: Spacing.lg, padding: Spacing.sm },
    cancelText: { color: Colors.textMuted, fontSize: 14 },
});