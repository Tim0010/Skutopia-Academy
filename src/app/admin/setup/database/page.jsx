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
import TableIcon from '@mui/icons-material/TableChart';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';

export default function DatabaseSetupPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [setupResults, setSetupResults] = useState({});
  const supabase = createClientComponentClient();

  // Check if user is admin
  useEffect(() => {
    if (user) {
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      if (isUserAdmin) {
        checkDatabaseTables();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  // Check which tables exist in the database
  const checkDatabaseTables = async () => {
    try {
      setLoading(true);
      
      // Get list of tables from the public schema
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      // Define required tables
      const requiredTables = [
        { name: 'profiles', description: 'User profile information', exists: false },
        { name: 'courses', description: 'Available courses and content', exists: false },
        { name: 'contact_messages', description: 'Contact form submissions', exists: false },
        { name: 'lessons', description: 'Course lessons content', exists: false },
        { name: 'enrollments', description: 'User course enrollments', exists: false }
      ];
      
      // Mark tables that exist
      const existingTableNames = data.map(t => t.table_name);
      const tablesWithStatus = requiredTables.map(table => ({
        ...table,
        exists: existingTableNames.includes(table.name)
      }));
      
      setTables(tablesWithStatus);
    } catch (error) {
      console.error('Error checking database tables:', error);
      setError('Failed to check database tables: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize the database with required tables
  const initializeDatabase = async () => {
    try {
      setSetupInProgress(true);
      setActiveStep(0);
      setSetupResults({});
      
      // Create tables that don't exist
      for (let i = 0; i < tables.length; i++) {
        setActiveStep(i);
        const table = tables[i];
        
        if (!table.exists) {
          // Simulate setup delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          try {
            // Execute SQL to create the table based on table name
            let result;
            
            switch (table.name) {
              case 'profiles':
                result = await createProfilesTable();
                break;
              case 'courses':
                result = await createCoursesTable();
                break;
              case 'contact_messages':
                result = await createContactMessagesTable();
                break;
              case 'lessons':
                result = await createLessonsTable();
                break;
              case 'enrollments':
                result = await createEnrollmentsTable();
                break;
              default:
                result = { success: false, message: 'Unknown table' };
            }
            
            setSetupResults(prev => ({
              ...prev,
              [table.name]: result
            }));
            
          } catch (err) {
            console.error(`Error creating ${table.name} table:`, err);
            setSetupResults(prev => ({
              ...prev,
              [table.name]: { success: false, message: err.message }
            }));
          }
        } else {
          setSetupResults(prev => ({
            ...prev,
            [table.name]: { success: true, message: 'Table already exists' }
          }));
        }
      }
      
      // Refresh table status
      await checkDatabaseTables();
      
      // Set step to completed
      setActiveStep(tables.length);
    } catch (error) {
      console.error('Error initializing database:', error);
      setError('Failed to initialize database: ' + error.message);
    } finally {
      setSetupInProgress(false);
    }
  };

  // Create individual tables
  const createProfilesTable = async () => {
    const { error } = await supabase.rpc('create_profiles_table');
    if (error) throw error;
    return { success: true, message: 'Profiles table created successfully' };
  };
  
  const createCoursesTable = async () => {
    const { error } = await supabase.rpc('create_courses_table');
    if (error) throw error;
    return { success: true, message: 'Courses table created successfully' };
  };
  
  const createContactMessagesTable = async () => {
    const { error } = await supabase.rpc('create_contact_messages_table');
    if (error) throw error;
    return { success: true, message: 'Contact messages table created successfully' };
  };
  
  const createLessonsTable = async () => {
    const { error } = await supabase.rpc('create_lessons_table');
    if (error) throw error;
    return { success: true, message: 'Lessons table created successfully' };
  };
  
  const createEnrollmentsTable = async () => {
    const { error } = await supabase.rpc('create_enrollments_table');
    if (error) throw error;
    return { success: true, message: 'Enrollments table created successfully' };
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
            This page helps you initialize and manage the database tables required for Skutopia Academy.
            Existing tables will not be modified.
          </Typography>
        </Alert>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Database Tables Status
          </Typography>
          
          <List>
            {tables.map((table) => (
              <Box key={table.name}>
                <ListItem>
                  <ListItemIcon>
                    {table.exists ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {table.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={table.exists ? "Ready" : "Missing"}
                          color={table.exists ? "success" : "error"}
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={table.description}
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={initializeDatabase}
              disabled={setupInProgress || tables.every(t => t.exists)}
              startIcon={<DatabaseIcon />}
            >
              {tables.every(t => t.exists) ? 'All Tables Ready' : 'Setup Missing Tables'}
            </Button>
          </Box>
        </Paper>
        
        {setupInProgress && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Setup Progress
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {tables.map((table, index) => (
                <Step key={table.name}>
                  <StepLabel>
                    {table.name}
                    {setupResults[table.name] && (
                      <Chip
                        size="small"
                        label={setupResults[table.name].success ? "Success" : "Failed"}
                        color={setupResults[table.name].success ? "success" : "error"}
                        sx={{ ml: 2 }}
                      />
                    )}
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ my: 2 }}>
                      {table.exists ? (
                        <Typography>Table already exists - skipping</Typography>
                      ) : activeStep === index ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={20} sx={{ mr: 2 }} />
                          <Typography>Creating table...</Typography>
                        </Box>
                      ) : setupResults[table.name] ? (
                        <Typography>{setupResults[table.name].message}</Typography>
                      ) : (
                        <Typography>Waiting...</Typography>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
              <Step>
                <StepLabel>Completed</StepLabel>
                <StepContent>
                  <Typography>All required tables have been set up.</Typography>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
        )}
        
        <Button 
          component={Link} 
          href="/admin"
          startIcon={<InfoIcon />}
          sx={{ mt: 2 }}
        >
          Return to Admin Dashboard
        </Button>
      </Box>
    </Container>
  );
} 