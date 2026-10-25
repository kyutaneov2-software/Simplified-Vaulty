// src/theme/index.ts

/**
 * Vaulty Global Theme
 * A central location for all colors, spacing, and typography.
 * Concept: Silver (Vault) + Blue (Tech) = Trust & Security
 */

export const Colors = {
    // Primary Blues (Tech & Trust)
    primary: "#2563EB",       // Strong, secure blue (Buttons, Active Tabs)
    primaryDark: "#1D4ED8",   // Pressed states
    primaryLight: "#DBEAFE",  // Backgrounds for icons/cards

    // Silvers & Grays (Vault & Metal)
    silver: "#CBD5E1",        // Borders, dividers, inactive states
    silverDark: "#94A3B8",    // Subtitles, muted text
    silverLight: "#F1F5F9",   // App background (Light Silver/Gray)

    // Neutrals
    white: "#FFFFFF",         // Cards, surfaces
    text: "#0F172A",          // Primary text (Dark Slate)
    textMuted: "#64748B",     // Secondary text

    // Status Colors
    success: "#10B981",       // Unlocked / Connected
    error: "#EF4444",         // Locked / Error
    warning: "#F59E0B",       // Pending connection
} as const;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const Typography = {
    h1: { fontSize: 32, fontWeight: "900" as const, color: Colors.text },
    h2: { fontSize: 24, fontWeight: "bold" as const, color: Colors.text },
    h3: { fontSize: 18, fontWeight: "bold" as const, color: Colors.text },
    body: { fontSize: 16, color: Colors.textMuted, lineHeight: 24 },
    caption: { fontSize: 14, color: Colors.silverDark },
} as const;

export const Shadows = {
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3, // Android
    },
    button: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
} as const;