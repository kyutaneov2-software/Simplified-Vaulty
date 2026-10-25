// src/app/_layout.tsx
import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../lib/supabase";

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

    // State to track if we are stll checking the MFA level
    const [isCheckingAal, setIsCheckingAal] = useState(true);
    const [needsMfa, setNeedsMfa] = useState(false);

    // Check the AAL ( Assurance Level ) whenever the session changes
    useEffect(() => {
        const checkAAL = async () => {
            if(!session) {
                setNeedsMfa(false);
                setIsCheckingAal(false);
                return;
            }

            const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (!error && data ) {
                // If they are currently at AAL1 but their account supports AAL2, they need to verify.
                setNeedsMfa(data.currentLevel === "aal1" && data.nextLevel === "aal2");
            }
            
            setIsCheckingAal(false);
        }

        checkAAL();
    }, [session]);
    
    // Handle routing based on Auth && AAL state
    useEffect(() => {
        if (loading || isCheckingAal) return;

        const firstSegment = segments[0] as string | undefined;
        const inAppGroup = firstSegment === "(app)";
        const inAuthGroup = firstSegment === "(auth)";
        const onChallengeScreen = firstSegment === "mfa-challenge";
        const onMfaSetupScreen = firstSegment === "mfa-setup";

        if (session) {
            if (needsMfa && !onChallengeScreen) {
                router.replace("/mfa-challenge");
                return;
            }
            if (!needsMfa && !inAppGroup && !onMfaSetupScreen) {
                router.replace("/(app)/HomeScreen");
            }
        } else {
            if (inAppGroup || onChallengeScreen || onMfaSetupScreen) {
                router.replace("/(auth)/sign-in");
            }
        }
    }, [session, loading, segments, needsMfa, isCheckingAal]);

    // Show a blank screen while checking Auth & AAL
    if (loading || isCheckingAal) {
        return null;
    }

    return (
        <>
            <StatusBar style="auto" />
            <Slot />
        </>
    );
}
