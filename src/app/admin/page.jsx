'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Container,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    newMessages: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const supabase = createClientComponentClient();

  // Check if user is admin
  useEffect(() => {
    if (user) {
      const isUserAdmin = user?.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin && !loading) {
        router.push('/dashboard');
      }
    }
  }, [user, router, loading]);

  // Setup Supabase realtime subscriptions
  useEffect(() => {
    if (!user || !isAdmin) return;
    
    let contactsSubscription;
    let usersSubscription;
    
    try {
      // Subscribe to contact messages table for real-time updates
      contactsSubscription = supabase
        .channel('contact-messages-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'contact_messages' 
        }, (payload) => {
          console.log('Contact message change detected:', payload);
          fetchStats();
          setNotification({
            open: true,
            message: 'New contact message received!',
            severity: 'info'
          });
        })
        .subscribe();
        
      // Subscribe to users table for real-time updates
      usersSubscription = supabase
        .channel('users-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'auth', 
          table: 'users' 
        }, (payload) => {
          console.log('Users change detected:', payload);
          fetchStats();
        })
        .subscribe();
    } catch (err) {
      console.error('Error setting up subscriptions:', err);
    }
    
    return () => {
      if (contactsSubscription) contactsSubscription.unsubscribe();
      if (usersSubscription) usersSubscription.unsubscribe();
    };
  }, [user, isAdmin, supabase, fetchStats]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Attempt to fetch via API first
      let apiSuccess = false;
      try {
        const response = await fetch('/api/admin/page-data');
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.stats.totalUsers || 0,
            newMessages: data.stats.newMessages || 0,
            totalCourses: data.stats.totalCourses || 0
          });
          setError(null);
          apiSuccess = true;
        } else {
          console.warn('API returned error status:', response.status);
        }
      } catch (apiError) {
        console.error('Error fetching from API, falling back to direct Supabase calls:', apiError);
      }
      
      // If API succeeded, don't continue with direct calls
      if (apiSuccess) {
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // Fallback to direct Supabase calls if API fails
      console.log('Falling back to direct Supabase queries');
      try {
        // Create a single promise array for all queries to run concurrently
        const queries = await Promise.all([
          // Count users from profiles table
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),
          
          // Count unread messages
          supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),
          
          // Count courses
          supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
        ]);
        
        const [usersResult, messagesResult, coursesResult] = queries;
        
        // Check for any errors
        if (usersResult.error) console.error('Error fetching users:', usersResult.error);
        if (messagesResult.error) console.error('Error fetching messages:', messagesResult.error);
        if (coursesResult.error) console.error('Error fetching courses:', coursesResult.error);
        
        // Update stats with real data
        setStats({
          totalUsers: usersResult.count || 0,
          newMessages: messagesResult.count || 0,
          totalCourses: coursesResult.count || 0
        });
        
        // Only set error if all queries failed
        if (usersResult.error && messagesResult.error && coursesResult.error) {
          setError('Failed to load dashboard data. Please refresh and try again.');
        } else {
          setError(null);
        }
      } catch (directError) {
        console.error('Error with direct Supabase queries:', directError);
        setError('Failed to load dashboard data. Please refresh and try again.');
        
        // Use zeros for missing values rather than null
        setStats({
          totalUsers: 0,
          newMessages: 0,
          totalCourses: 0
        });
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Failed to load dashboard data. Please refresh and try again.');
      
      // Use zeros for missing values rather than null
      setStats({
        totalUsers: 0,
        newMessages: 0,
        totalCourses: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [supabase]);
  
  // Fetch stats on admin load
  useEffect(() => {
    let intervalId;
    
    if (user && isAdmin) {
      fetchStats();
      
      // Set up polling for fresh data every 60 seconds
      intervalId = setInterval(() => {
        fetchStats();
      }, 60000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, isAdmin, fetchStats]);

  const handleRefresh = () => {
    fetchStats();
    setNotification({
      open: true,
      message: 'Dashboard refreshed',
      severity: 'success'
    });
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const adminMenuItems = [
    { 
      title: 'User Management', 
      icon: <PeopleIcon color="primary" />, 
      description: 'Manage user accounts, roles, and permissions',
      link: '/admin/users', // Not implemented yet
      disabled: true
    },
    { 
      title: 'Course Management', 
      icon: <SchoolIcon color="primary" />, 
      description: 'Create and manage interactive courses with visual content',
      link: '/admin/courses',
      badge: null
    },
    { 
      title: 'Contact Messages', 
      icon: <EmailIcon color="primary" />, 
      description: 'View and respond to contact form submissions',
      link: '/admin/contacts',
      badge: stats.newMessages > 0 ? stats.newMessages : null
    },
    { 
      title: 'Database Setup', 
      icon: <SettingsIcon color="primary" />, 
      description: 'Initialize and configure database tables and functions',
      link: '/admin/setup'
    },
    { 
      title: 'Return to Dashboard', 
      icon: <DashboardIcon color="primary" />, 
      description: 'Go back to the main user dashboard',
      link: '/dashboard'
    }
  ];

  // Loading state
  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            <Typography variant="h6">Access Denied</Typography>
            <Typography variant="body1">
              You don't have permission to access the admin area.
            </Typography>
          </Alert>
          <Button 
            variant="contained" 
            component={Link} 
            href="/dashboard"
            size="large"
          >
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          
          <Tooltip title="Refresh dashboard data">
            <IconButton 
              color="primary" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              {refreshing ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Typography component="p" variant="h3" sx={{ flexGrow: 1 }}>
                  {stats.totalUsers !== null ? stats.totalUsers : '-'}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Registered accounts
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                New Messages
              </Typography>
              {refreshing ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Typography 
                  component="p" 
                  variant="h3" 
                  sx={{ 
                    flexGrow: 1,
                    color: stats.newMessages > 0 ? 'error.main' : 'inherit'
                  }}
                >
                  {stats.newMessages !== null ? stats.newMessages : '-'}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon color={stats.newMessages > 0 ? "error" : "primary"} sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Unread contact submissions
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Courses
              </Typography>
              {refreshing ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Typography component="p" variant="h3" sx={{ flexGrow: 1 }}>
                  {stats.totalCourses !== null ? stats.totalCourses : '-'}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Available courses
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Admin Functions
        </Typography>
        
        <Grid container spacing={3}>
          {adminMenuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {item.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {item.title}
                      {item.badge && (
                        <Box component="span" sx={{ 
                          ml: 1, 
                          bgcolor: 'error.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                        }}>
                          {item.badge}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    href={item.link}
                    disabled={item.disabled}
                    size="small" 
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    {item.disabled ? 'Coming Soon' : 'Access'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 