'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // In a real application, you would check if the user has admin privileges
    // For now, we'll just allow all authenticated users to access the admin area
    // Example:
    // if (!user.user_metadata?.is_admin) {
    //   router.push('/dashboard');
    //   return;
    // }
  }, [user, router]);

  return (
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  );
}
