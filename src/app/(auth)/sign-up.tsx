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
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

/**
 * Sign Up Screen component.
 * Allows new users to create an account using their email and password.
 */
export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signUp } = useAuth();

    const handleSignUp = async () => {
        // 1. Basic Validation
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

        // 2. Supabase Authentication
        setIsSubmitting(true);
        const { error } = await signUp(email, password);
        setIsSubmitting(false);

        if (error) {
            Alert.alert("Sign Up Failed", error.message);
        } else {
            // Note: By default, Supabase requires email confirmation.
            // The user will be redirected to sign in after confirming.
            Alert.alert(
                "Success",
                "Account created! Please check your email for a confirmation link before signing in.",
            );
        }
    };

    return (
        <View style={styles.container}>
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
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
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
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#F8FAFC",
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748B",
    },
    form: {
        width: "100%",
    },
    input: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        fontSize: 16,
        color: "#1E293B",
    },
    button: {
        backgroundColor: "#3B82F6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
    },
    footerText: {
        color: "#64748B",
        fontSize: 14,
    },
    linkText: {
        color: "#3B82F6",
        fontSize: 14,
        fontWeight: "bold",
    },
});
