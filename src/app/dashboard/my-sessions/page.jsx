'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Grid,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    Snackbar,
    Avatar,
    IconButton
} from '@mui/material';
import { format, parseISO, isBefore } from 'date-fns';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import CancelIcon from '@mui/icons-material/Cancel';

// Status chip colors
const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error'
};

export default function MySessionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [sessionToCancel, setSessionToCancel] = useState(null);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    
    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        loadSessions();
    }, [user, router]);
    
    const loadSessions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('mentorship_sessions')
                .select(`
                    *,
                    mentors:mentor_id (id, name, email, expertise, hourly_rate)
                `)
                .eq('student_id', user.id)
                .order('session_date', { ascending: true })
                .order('start_time', { ascending: true });
                
            if (error) throw error;
            
            setSessions(data || []);
        } catch (err) {
            console.error('Error loading sessions:', err);
            setError('Failed to load your mentorship sessions');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancelSession = (session) => {
        // Only allow cancellation of pending or confirmed sessions
        if (session.status !== 'pending' && session.status !== 'confirmed') {
            setNotification({
                open: true,
                message: `Cannot cancel a session that is ${session.status}`,
                severity: 'warning'
            });
            return;
        }
        
        // Check if session date is in the past
        const sessionDate = new Date(`${session.session_date}T${session.start_time}`);
        if (isBefore(sessionDate, new Date())) {
            setNotification({
                open: true,
                message: 'Cannot cancel a session that has already started or passed',
                severity: 'warning'
            });
            return;
        }
        
        setSessionToCancel(session);
        setCancelDialogOpen(true);
    };
    
    const confirmCancelSession = async () => {
        if (!sessionToCancel) return;
        
        try {
            const { error } = await supabase
                .from('mentorship_sessions')
                .update({ 
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('id', sessionToCancel.id);
                
            if (error) throw error;
            
            // Update local state
            setSessions(sessions.map(session => 
                session.id === sessionToCancel.id 
                    ? { ...session, status: 'cancelled' } 
                    : session
            ));
            
            setNotification({
                open: true,
                message: 'Session cancelled successfully',
                severity: 'success'
            });
        } catch (err) {
            console.error('Error cancelling session:', err);
            setNotification({
                open: true,
                message: 'Failed to cancel session',
                severity: 'error'
            });
        } finally {
            setCancelDialogOpen(false);
            setSessionToCancel(null);
        }
    };
    
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };
    
    const handleBookNewSession = () => {
        router.push('/dashboard/mentorship');
    };
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }
    
    // Group sessions by status
    const upcomingSessions = sessions.filter(s => 
        (s.status === 'pending' || s.status === 'confirmed') && 
        !isBefore(new Date(`${s.session_date}T${s.start_time}`), new Date())
    );
    
    const pastSessions = sessions.filter(s => 
        s.status === 'completed' || 
        isBefore(new Date(`${s.session_date}T${s.start_time}`), new Date())
    );
    
    const cancelledSessions = sessions.filter(s => s.status === 'cancelled');
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Mentorship Sessions
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleBookNewSession}
                >
                    Book New Session
                </Button>
            </Box>
            
            {sessions.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" paragraph>
                        You haven't booked any mentorship sessions yet.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={handleBookNewSession}
                    >
                        Browse Available Mentors
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Upcoming Sessions */}
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Upcoming Sessions ({upcomingSessions.length})
                        </Typography>
                        
                        {upcomingSessions.length === 0 ? (
                            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No upcoming sessions scheduled.
                                </Typography>
                            </Paper>
                        ) : (
                            <Grid container spacing={2}>
                                {upcomingSessions.map((session) => (
                                    <Grid item xs={12} md={6} lg={4} key={session.id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" component="div">
                                                        {session.topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={session.status} 
                                                        color={statusColors[session.status]}
                                                        size="small"
                                                    />
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {format(new Date(session.session_date), 'EEEE, MMMM d, yyyy')}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {`${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}`}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {session.mentors?.name || 'Unknown Mentor'}
                                                    </Typography>
                                                </Box>
                                                
                                                {session.message && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Your message:</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                            {session.message}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                            
                                            <CardActions>
                                                <Button 
                                                    size="small" 
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleCancelSession(session)}
                                                >
                                                    Cancel
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                    
                    {/* Past Sessions */}
                    {pastSessions.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                                Past Sessions ({pastSessions.length})
                            </Typography>
                            
                            <Grid container spacing={2}>
                                {pastSessions.map((session) => (
                                    <Grid item xs={12} md={6} lg={4} key={session.id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: 0.8 }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" component="div">
                                                        {session.topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={session.status} 
                                                        color={statusColors[session.status]}
                                                        size="small"
                                                    />
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {format(new Date(session.session_date), 'EEEE, MMMM d, yyyy')}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}`}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {session.mentors?.name || 'Unknown Mentor'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    
                    {/* Cancelled Sessions */}
                    {cancelledSessions.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                                Cancelled Sessions ({cancelledSessions.length})
                            </Typography>
                            
                            <Grid container spacing={2}>
                                {cancelledSessions.map((session) => (
                                    <Grid item xs={12} md={6} lg={4} key={session.id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: 0.7 }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
                                                        {session.topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={session.status} 
                                                        color={statusColors[session.status]}
                                                        size="small"
                                                    />
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Typography variant="body2" color="text.disabled">
                                                        {format(new Date(session.session_date), 'EEEE, MMMM d, yyyy')}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Typography variant="body2" color="text.disabled">
                                                        {`${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}`}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Typography variant="body2" color="text.disabled">
                                                        {session.mentors?.name || 'Unknown Mentor'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            )}
            
            {/* Cancel Session Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
            >
                <DialogTitle>Cancel Mentorship Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this mentorship session? This action cannot be undone.
                    </DialogContentText>
                    
                    {sessionToCancel && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                <strong>Topic:</strong> {sessionToCancel.topic}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Date:</strong> {format(new Date(sessionToCancel.session_date), 'MMMM d, yyyy')}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Time:</strong> {`${sessionToCancel.start_time.substring(0, 5)} - ${sessionToCancel.end_time.substring(0, 5)}`}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Mentor:</strong> {sessionToCancel.mentors?.name || 'Unknown Mentor'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Keep Session</Button>
                    <Button onClick={confirmCancelSession} color="error" variant="contained">
                        Cancel Session
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Notification Snackbar */}
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
