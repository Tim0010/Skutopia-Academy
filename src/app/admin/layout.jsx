'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Alert, Typography, Button, Container } from '@mui/material';

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6">Admin Access Required</Typography>
          <Typography variant="body1">
            You don't have permissions to access this area.
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => router.push('/dashboard')}
          fullWidth
        >
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return <>{children}</>;
} 