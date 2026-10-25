// src/app/(auth)/_layout.tsx
import { Stack } from "expo-router";

/**
 * Layout for the Authentication group.
 * We hide the default header so our custom styled screens look clean.
 */
export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
