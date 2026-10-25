// src/app/_layout.tsx
import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}

function RootLayoutNav() {
    const { session, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const firstSegment = segments[0] as string | undefined;

        // Check what group the user is currently in
        const inAppGroup = firstSegment === "(app)";
        const inAuthGroup = firstSegment === "(auth)";

        if (session) {
            // If user is logged in, and they are on the Welcome or Auth screens, send them to the App
            if (!inAppGroup) {
                router.replace("/(app)/HomeScreen");
            }
        } else {
            // If user is NOT logged in, and they try to access protected app screens, send to Sign In
            if (inAppGroup) {
                router.replace("/(auth)/sign-in");
            }
        }
    }, [session, loading, segments]);

    if (loading) {
        return null;
    }

    return (
        <>
            <StatusBar style="auto" />
            <Slot />
        </>
    );
}
