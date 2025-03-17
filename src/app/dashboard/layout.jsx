'use client';

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: `240px` },
            minHeight: '100vh',
          }}
        >
          <Toolbar sx={{ mb: 2 }} />
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  );
} 