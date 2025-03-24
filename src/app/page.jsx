'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Main from '@/views/landings/default';
import MainLayout from '@/views/landings/default/layout';
import { Box, CircularProgress } from '@mui/material';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      // Only redirect to dashboard if already logged in
      setShouldRedirect(true);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/dashboard');
    }
  }, [shouldRedirect, router]);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // If we're not redirecting (user not logged in), show the landing page
  if (!shouldRedirect) {
    return (
      <MainLayout>
        <Main />
      </MainLayout>
    );
  }

  return null;
} 