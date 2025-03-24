'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export default function DebugNotificationsPage() {
    const { user } = useAuth();
    const { notifications, unreadCount, refreshNotifications, createNotification } = useNotifications();
    
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'info',
        related_to: 'general'
    });
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);
    
    const loadUserProfile = async () => {
        try {
            setUserProfile({
                id: user.id,
                full_name: user.user_metadata?.full_name || 'User',
                email: user.email,
                role: user.user_metadata?.role || 'student'
            });
        } catch (err) {
            console.error('Error loading profile:', err);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotificationData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleCreateTestNotification = async () => {
        setLoading(true);
        try {
            // Create a notification for the current user
            const result = await createNotification(
                user.id,
                notificationData.title,
                notificationData.message,
                notificationData.type,
                notificationData.related_to
            );
            
            if (!result.success) throw new Error(result.error);
            
            setNotification({
                open: true,
                message: 'Test notification created successfully',
                severity: 'success'
            });
            
            // Refresh notifications
            await refreshNotifications();
            
            // Reset form
            setNotificationData({
                title: '',
                message: '',
                type: 'info',
                related_to: 'general'
            });
        } catch (err) {
            console.error('Error creating test notification:', err);
            setNotification({
                open: true,
                message: `Failed to create notification: ${err.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCreateDirectNotification = async () => {
        setLoading(true);
        try {
            // Insert directly into the database
            const { error } = await supabase
                .from('notifications')
                .insert([{
                    user_id: user.id,
                    title: notificationData.title || 'Test Notification',
                    message: notificationData.message || 'This is a test notification',
                    type: notificationData.type || 'info',
                    related_to: notificationData.related_to || 'general',
                    is_read: false,
                    created_at: new Date().toISOString()
                }]);
                
            if (error) throw error;
            
            setNotification({
                open: true,
                message: 'Direct notification created successfully',
                severity: 'success'
            });
            
            // Refresh notifications
            await refreshNotifications();
            
            // Reset form
            setNotificationData({
                title: '',
                message: '',
                type: 'info',
                related_to: 'general'
            });
        } catch (err) {
            console.error('Error creating direct notification:', err);
            setNotification({
                open: true,
                message: `Failed to create notification: ${err.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Debug Notifications
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Current User Information
                        </Typography>
                        
                        {userProfile ? (
                            <Box>
                                <Typography><strong>ID:</strong> {user.id}</Typography>
                                <Typography><strong>Name:</strong> {userProfile.full_name}</Typography>
                                <Typography><strong>Email:</strong> {user.email}</Typography>
                                <Typography><strong>Role:</strong> {userProfile.role}</Typography>
                            </Box>
                        ) : (
                            <Typography>Loading user profile...</Typography>
                        )}
                    </Paper>
                    
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notification Status
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography><strong>Unread Count:</strong> {unreadCount}</Typography>
                            <Typography><strong>Total Notifications:</strong> {notifications.length}</Typography>
                        </Box>
                        
                        <Button 
                            variant="outlined" 
                            onClick={refreshNotifications}
                            sx={{ mr: 2 }}
                        >
                            Refresh Notifications
                        </Button>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Create Test Notification
                        </Typography>
                        
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={notificationData.title}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            
                            <TextField
                                fullWidth
                                label="Message"
                                name="message"
                                value={notificationData.message}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                                rows={3}
                                required
                            />
                            
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="type"
                                    value={notificationData.type}
                                    onChange={handleInputChange}
                                    label="Type"
                                >
                                    <MenuItem value="info">Info</MenuItem>
                                    <MenuItem value="success">Success</MenuItem>
                                    <MenuItem value="warning">Warning</MenuItem>
                                    <MenuItem value="error">Error</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Related To</InputLabel>
                                <Select
                                    name="related_to"
                                    value={notificationData.related_to}
                                    onChange={handleInputChange}
                                    label="Related To"
                                >
                                    <MenuItem value="general">General</MenuItem>
                                    <MenuItem value="mentorship">Mentorship</MenuItem>
                                    <MenuItem value="exam_papers">Exam Papers</MenuItem>
                                    <MenuItem value="courses">Courses</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleCreateTestNotification}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create via Context'}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    onClick={handleCreateDirectNotification}
                                    disabled={loading}
                                >
                                    Create Direct DB Insert
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Notifications ({notifications.length})
                        </Typography>
                        
                        {notifications.length === 0 ? (
                            <Typography color="text.secondary">No notifications found</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {notifications.map((notif) => (
                                    <Grid item xs={12} md={6} lg={4} key={notif.id}>
                                        <Card sx={{ 
                                            bgcolor: notif.is_read ? 'background.paper' : 'action.hover',
                                            height: '100%'
                                        }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {notif.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {notif.message}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Type: {notif.type}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(notif.created_at).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
