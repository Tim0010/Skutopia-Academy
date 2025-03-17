'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not loading and no user, redirect to login
        if (!loading && !user) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }

        // If user exists but doesn't have the required role
        if (
            !loading &&
            user &&
            allowedRoles.length > 0 &&
            !allowedRoles.includes(user.user_metadata?.role)
        ) {
            router.push('/unauthorized');
        }
    }, [user, loading, router, pathname, allowedRoles]);

    // Show loading state
    if (loading || !user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    // If user is authenticated and has the required role (or no role is required)
    return children;
} 