import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for active session on initial load
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user || null);
            } catch (error) {
                console.error('Error checking session:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign up with email and password
    const signUp = async (email, password, userData = {}) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        ...userData,
                        role: userData.role || 'student' // Default role is student
                    }
                }
            });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password
    const signIn = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.signOut();
            if (error) throw error;

        } catch (error) {
            console.error('Error signing out:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

        } catch (error) {
            console.error('Error resetting password:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update password
    const updatePassword = async (newPassword) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

        } catch (error) {
            console.error('Error updating password:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.updateUser({
                data: userData
            });

            if (error) throw error;

        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 