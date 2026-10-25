// src/app/(auth)/sign-up.tsx
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
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

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        setIsSubmitting(true);
        const { error } = await signUp(email, password);
        setIsSubmitting(false);

        if (error) {
            Alert.alert("Sign Up Failed", error.message);
        } else {
            Alert.alert(
                "Success",
                "Account created! Please check your email for a confirmation link before signing in.",
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>
                                    Join Vaulty and secure your rentals
                                </Text>
                            </View>

                            <View style={styles.form}>
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
                                    placeholder="Password (min. 6 characters)"
                                    placeholderTextColor={Colors.silverDark}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor={Colors.silverDark}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isSubmitting && styles.buttonDisabled,
                                    ]}
                                    onPress={handleSignUp}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator
                                            color={Colors.white}
                                        />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            Sign Up
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Already have an account?{" "}
                                </Text>
                                <Link href="/(auth)/sign-in" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.linkText}>
                                            Sign In
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
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
    },
    form: {
        width: "100%",
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
