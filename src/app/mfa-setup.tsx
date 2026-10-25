// src/app/(app)/mfa-setup.tsx
import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { supabase } from "../lib/supabase";
import { Colors, Spacing, Typography, Shadows } from "../theme";

type Step = "loading" | "scan" | "verify" | "success";


export default function MFASetup() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("loading");
    const [factorId, setFactorId] = useState<string | null>(null);
    const [qrUri, setQrUri] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        enrollMFA();
    }, []);

    // fetch data from supabase.
    const enrollMFA = async () => {
        setStep("loading");
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: "totp",
            issuer: "Vaulty",
        });

        if (error) {
            Alert.alert("Enrollment Error", error.message);
            router.back();
            return;
        }

        setFactorId(data.id);
        setQrUri(data.totp.uri);
        setSecret(data.totp.secret);
        setStep("scan"); // next step
    }


    const handleProceedToVerify = async () => {
        // Fallback
        if(!factorId) return;
        setStep("loading")

        const { data, error } = await supabase.auth.mfa.challenge({ factorId});
        if (error) {
            Alert.alert("Challenge Error", error.message);
            setStep("scan");
            return;
        }

        setChallengeId(data.id);
        setStep("verify") // next step
    }

    const handleVerifyCode = async () => {
        // Fallback
        if (!factorId || !challengeId) return;
        if (verificationCode.length !== 6) {
            Alert.alert("Invalid Code", "Please enter a 6-digit code.");
            return;
        }

        setIsVerifying(true);
        const { error } = await supabase.auth.mfa.verify({
            factorId,
            challengeId,
            code: verificationCode,
        });
        setIsVerifying(false);

        if(error) {
            Alert.alert("Verification Failed.", error.message);
            setVerificationCode("");
        } else{
            setStep("success");
        }
    };


    if (step === "loading"){
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>
                    Setting up secure connection...
                </Text>
            </SafeAreaView>
        );
    }


    if (step == "success"){
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <View style={styles.successIcon}>
                    <Ionicons
                        name="shield-checkmark"
                        size={80}
                        color={Colors.success}
                    />
                </View>
                <Text style={styles.title}> 2FA Enabled!</Text>
                <Text style={styles.description}>Your account is now Secured.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/(app)/Profile")}>
                    <Text style={styles.buttonText}>Return to profile</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER SECTION */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setup 2FA</Text>
                <View style={{ width: 24 }} />
            </View>

            {/*  
                MAIN SECTION
                Dynamically change base on the steps
            */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === "scan" && (
                    <View>
                        <Text style={styles.title}>Scan QR Code</Text>
                        <Text style={styles.description}>
                            Open your authenticator app and scan the code below
                        </Text>

                        {/* QR CODE */}
                        <View style={styles.qrContainer}>
                            {qrUri && <QRCode value={qrUri} size={200} />}
                        </View>

                        <Text style={styles.manualText}>
                            Can't scan? Enter this code manually:
                        </Text>

                        {/* CODE TEXT */}
                        <View style={styles.secretBox}>
                            <Text style={styles.secretText}>{secret}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleProceedToVerify}
                        >
                            <Text style={styles.buttonText}>
                                I've Scanned the Code
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === "verify" && (
                    <View>
                        <Text style={styles.title}>Verify Code</Text>
                        <Text style={styles.description}>
                            Enter the 6-digit code generated by your app.
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="000000"
                            placeholderTextColor={Colors.silver}
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="number-pad"
                            maxLength={6}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                isVerifying && { opacity: 0.7 },
                            ]}
                            onPress={handleVerifyCode}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Verify & Enable
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.silverLight },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.silver,
    },
    backButton: { padding: Spacing.xs },
    headerTitle: { ...Typography.h3 },
    scrollContent: { padding: Spacing.lg },
    title: {
        ...Typography.h1,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    description: { ...Typography.body, marginBottom: Spacing.xl },
    qrContainer: {
        alignItems: "center",
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.silver,
        marginBottom: Spacing.xl,
        ...Shadows.card,
    },
    manualText: {
        ...Typography.caption,
        textAlign: "center",
        marginBottom: Spacing.sm,
    },
    secretBox: {
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.silver,
        alignItems: "center",
        marginBottom: Spacing.xl,
    },
    secretText: {
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 2,
        color: Colors.primary,
    },
    input: {
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.silver,
        fontSize: 32,
        textAlign: "center",
        letterSpacing: 10,
        color: Colors.text,
        marginBottom: Spacing.xl,
        fontWeight: "bold",
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: "center",
        ...Shadows.button,
    },
    buttonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
    loadingText: { ...Typography.body, marginTop: Spacing.md },
    successIcon: {
        width: 140,
        height: 140,
        backgroundColor: "#ECFDF5",
        borderRadius: 70,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.xl,
    },
});