'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const runDatabaseSetup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/setup-database');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set up database');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error setting up database:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          <AlertTitle>Unauthorized</AlertTitle>
          You must be logged in to access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Database Setup
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Setup Required Tables and Functions
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This utility will create missing database tables and functions needed for the personalized learning features.
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <SvgIcon name="tabler-table" />
            </ListItemIcon>
            <ListItemText 
              primary="lesson_progress" 
              secondary="Tracks user progress through individual lessons" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SvgIcon name="tabler-table" />
            </ListItemIcon>
            <ListItemText 
              primary="user_learning_paths" 
              secondary="Stores AI-generated personalized learning paths" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SvgIcon name="tabler-code" />
            </ListItemIcon>
            <ListItemText 
              primary="get_course_lesson_counts()" 
              secondary="Function to count lessons per course and track progress" 
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Success</AlertTitle>
            Database setup completed successfully!
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={runDatabaseSetup}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SvgIcon name="tabler-database" />}
          >
            {loading ? 'Setting Up...' : 'Run Setup'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 