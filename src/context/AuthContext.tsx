// src/context/AuthContext.tsx
import React, { Children, createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Define the shape of our Context
type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any}>
    signUp: (email: string, password: string) => Promise<{ error: any}>
    signOut: () => Promise<void>
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
    AuthProvider wraps the app and manages the Supabase authentication state.
*/

export const AuthProvider = ({ children }: {children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes ( sign in, sign out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);

    // Sign In Function
    const signIn = async (email: string, password: string) => {
        const {error} = await supabase.auth.signInWithPassword({email, password});
        return {error};
    }

    // Sign Up Function
    const signUp = async (email: string, password: string) => {
        const {error} = await supabase.auth.signUp({email, password});
        return {error}
    }

    // Sign Out Function
    const signOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{user, session, loading, signIn, signUp, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}
// Custom hook to easily access the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within the AuthProvider')
    }
    return context
}