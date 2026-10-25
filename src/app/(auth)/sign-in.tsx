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
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

/**
 * Sign In Screen component.
 * Allows users to authenticate using email and password.
 */
export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        const { error } = await signIn(email, password);
        if (error) {
            Alert.alert("Login failed:", error.message);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Vaulty</Text>
            <Text style={styles.subtitle}>Secure your rentals</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <Link href="/(auth)/sign-up" style={styles.link}>
                <Text> Don't have an account? Sign Up</Text>
            </Link>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#F8FAFC",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 5,
    },
    subtitle: { fontSize: 16, color: "#64748B", marginBottom: 30 },
    input: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    button: {
        backgroundColor: "#3B82F6",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 20, alignItems: "center" },
});