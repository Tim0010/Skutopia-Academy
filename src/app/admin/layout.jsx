'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        // Check if user is admin
        const userRole = user?.user_metadata?.role;
        if (userRole === 'admin') {
          setIsAdmin(true);
        }
        setLoading(false);
      }
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body1">
            You don't have permission to access the admin area. Please contact an administrator if you believe this is an error.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {children}
    </Container>
  );
} 