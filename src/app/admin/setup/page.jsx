'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DatabaseIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';

export default function SetupPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setupStatus, setSetupStatus] = useState([]);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const supabase = createClientComponentClient();
  
  const requiredSetups = [
    { 
      id: 'lesson_progress', 
      name: 'Lesson Progress', 
      description: 'Tracks user progress through individual lessons',
      status: 'pending'
    },
    { 
      id: 'user_learning_paths', 
      name: 'User Learning Paths', 
      description: 'Stores AI-generated personalized learning paths',
      status: 'pending'
    },
    { 
      id: 'course_lesson_counts', 
      name: 'Course Lesson Counts Function', 
      description: 'Function to count lessons per course and track progress',
      status: 'pending'
    }
  ];

  // Check if user is admin
  useEffect(() => {
    if (user) {
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (isUserAdmin) {
        // Initialize setup status
        setSetupStatus(requiredSetups);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  // Run the database setup
  const runSetup = async () => {
    try {
      setSetupInProgress(true);
      setActiveStep(0);
      setCompleted(false);
      setError(null);
      
      // Run setup through API endpoint
      const response = await fetch('/api/admin/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'run_setup' })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to run setup');
      }
      
      if (result.success) {
        // Update status based on result
        const updatedSetupStatus = setupStatus.map(item => ({
          ...item,
          status: result.details[item.id] ? 'success' : 'error'
        }));
        
        setSetupStatus(updatedSetupStatus);
        setCompleted(true);
        setActiveStep(setupStatus.length);
      } else {
        throw new Error(result.error || 'Setup failed');
      }
    } catch (error) {
      console.error('Error running setup:', error);
      setError(error.message);
    } finally {
      setSetupInProgress(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            <Typography variant="h6">Access Denied</Typography>
            <Typography variant="body1">
              You don't have permission to access the database setup.
            </Typography>
          </Alert>
          <Button component={Link} href="/dashboard" variant="contained">
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Database Setup
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            This utility will create missing database tables and functions needed for the personalized learning features.
          </Typography>
        </Alert>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Setup Required Tables and Functions
          </Typography>
          
          <List>
            {setupStatus.map((item) => (
              <Box key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    {item.status === 'success' ? (
                      <CheckCircleIcon color="success" />
                    ) : item.status === 'error' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <DatabaseIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name}
                    secondary={item.description}
                  />
                  {item.status !== 'pending' && (
                    <Chip
                      size="small"
                      label={item.status === 'success' ? 'Success' : 'Failed'}
                      color={item.status === 'success' ? 'success' : 'error'}
                    />
                  )}
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={runSetup}
              disabled={setupInProgress}
              startIcon={setupInProgress ? <CircularProgress size={20} /> : <DatabaseIcon />}
            >
              {setupInProgress ? 'Running Setup...' : 'Run Setup'}
            </Button>
          </Box>
        </Paper>
        
        {completed && (
          <Alert severity="success" sx={{ mb: 4 }}>
            <Typography variant="body1">
              Database setup completed successfully.
            </Typography>
          </Alert>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            component={Link} 
            href="/admin/setup/database"
            variant="outlined"
          >
            Advanced Database Management
          </Button>
          
          <Button 
            component={Link} 
            href="/admin"
            startIcon={<InfoIcon />}
          >
            Return to Admin Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 