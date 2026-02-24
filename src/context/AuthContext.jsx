import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email, password) => supabase.auth.signUp({
        email,
        password,
        options: {
            data: { plan: 'free' } // Default plan
        }
    });

    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

    const signOut = () => supabase.auth.signOut();

    const resetPasswordForEmail = (email) => supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    const updatePassword = (newPassword) => supabase.auth.updateUser({ password: newPassword });

    const updateProfile = (data) => supabase.auth.updateUser({ data });

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
