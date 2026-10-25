// src/app/(auth)/sign-in.tsx
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Colors, Spacing, Typography, Shadows } from "../../theme";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        setIsSubmitting(true);
        const { error } = await signIn(email, password);
        setIsSubmitting(false);

        if (error) {
            Alert.alert("Login failed", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 
                KeyboardAvoidingView: Pushes content up when keyboard opens.
                - iOS uses 'padding', Android uses 'height' (Standard React Native practice)
            */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Dismisses keyboard when tapping outside inputs */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {/* ScrollView allows scrolling on small screens */}
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>
                                Sign in to secure your rentals
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Email address"
                                placeholderTextColor={Colors.silverDark}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={Colors.silverDark}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    isSubmitting && styles.buttonDisabled,
                                ]}
                                onPress={handleSignIn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Don't have an account?{" "}
                                </Text>
                                <Link href="/(auth)/sign-up" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.linkText}>
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        justifyContent: "center",
        padding: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        marginBottom: Spacing.xl,
    },
    input: {
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.silver,
        fontSize: 16,
        color: Colors.text,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: "center",
        marginTop: Spacing.sm,
        ...Shadows.button,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: Spacing.xl,
    },
    footerText: {
        color: Colors.textMuted,
        fontSize: 15,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: "bold",
    },
});
