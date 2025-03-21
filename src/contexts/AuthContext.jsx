'use client';

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
    const [isAdmin, setIsAdmin] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkUserSession = async () => {
            setLoading(true);
            try {
                // Try to get status from API first which properly checks user roles
                const statusResponse = await fetch('/api/status');
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    
                    if (statusData.authenticated && statusData.user) {
                        setUser(statusData.user);
                        setIsAdmin(statusData.user.role === 'admin');
                        setAuthenticated(true);
                    } else {
                        setUser(null);
                        setIsAdmin(false);
                        setAuthenticated(false);
                    }
                    setLoading(false);
                    return;
                }
                
                // Fallback to Supabase client if API fails
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Session check error:', error);
                    setUser(null);
                    setIsAdmin(false);
                    setAuthenticated(false);
                } else if (session) {
                    const userData = session.user;
                    setUser(userData);
                    setIsAdmin(userData.user_metadata?.role === 'admin');
                    setAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Session check error:', error);
                setUser(null);
                setIsAdmin(false);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        // Immediately check session
        checkUserSession();

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session) {
                setUser(session.user);
                setIsAdmin(session.user.user_metadata?.role === 'admin');
                setAuthenticated(true);
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                setUser(null);
                setIsAdmin(false);
                setAuthenticated(false);
            } else if (event === 'TOKEN_REFRESHED' && session) {
                // Refresh user data when token is refreshed
                setUser(session.user);
                setIsAdmin(session.user.user_metadata?.role === 'admin');
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase]);

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
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Sign in error:', error);
                setError(error.message);
                return { success: false, error: error.message };
            }

            // Log detailed information about the authenticated user
            console.log('Sign-in successful, user session:', data.session);
            console.log('User details:', data.user);
            console.log('User metadata:', data.user.user_metadata);
            console.log('Is admin?', data.user.user_metadata?.role === 'admin');

            setUser(data.user);
            setError(null);
            return { success: true };
        } catch (error) {
            console.error('Unexpected sign in error:', error);
            setError('An unexpected error occurred');
            return { success: false, error: 'An unexpected error occurred' };
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
        updateProfile,
        isAdmin,
        authenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 