'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

// Status chip colors
const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error'
};

export default function MentorshipSessionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { createNotification } = useNotifications();
    
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSession, setSelectedSession] = useState(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState('');
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
    }, [user, router, statusFilter]);
    
    const loadSessions = async () => {
        setLoading(true);
        try {
            // Get all mentors managed by this admin
            const { data: mentorsData, error: mentorsError } = await supabase
                .from('mentors')
                .select('id');
                
            if (mentorsError) throw mentorsError;
            
            if (!mentorsData || mentorsData.length === 0) {
                setSessions([]);
                setLoading(false);
                return;
            }
            
            const mentorIds = mentorsData.map(mentor => mentor.id);
            
            // Query for sessions with these mentors
            let query = supabase
                .from('mentorship_sessions')
                .select(`
                    *,
                    mentors:mentor_id (id, name, email)
                `)
                .in('mentor_id', mentorIds);
                
            // Apply status filter if not 'all'
            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }
            
            // Order by date and time
            query = query.order('session_date', { ascending: true })
                         .order('start_time', { ascending: true });
            
            const { data: sessionsData, error: sessionsError } = await query;
            
            if (sessionsError) throw sessionsError;
            
            // Get student information for each session
            const sessionsWithStudents = await Promise.all(sessionsData.map(async (session) => {
                // Get student info from auth.users or your users table
                // This is a simplified example - adjust based on your actual user data storage
                const { data: userData, error: userError } = await supabase
                    .from('profiles')  // Assuming you have a profiles table
                    .select('full_name, email')
                    .eq('id', session.student_id)
                    .single();
                    
                return {
                    ...session,
                    student: userData || { full_name: 'Unknown Student', email: 'unknown@example.com' }
                };
            }));
            
            setSessions(sessionsWithStudents);
        } catch (err) {
            console.error('Error loading sessions:', err);
            setError('Failed to load mentorship sessions');
        } finally {
            setLoading(false);
        }
    };
    
    const handleStatusChange = (session) => {
        setSelectedSession(session);
        setUpdatedStatus(session.status);
        setIsUpdateDialogOpen(true);
    };
    
    const handleUpdateStatus = async () => {
        if (!selectedSession || !updatedStatus) return;
        
        try {
            const { error } = await supabase
                .from('mentorship_sessions')
                .update({ 
                    status: updatedStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedSession.id);
                
            if (error) throw error;
            
            // Update local state
            setSessions(sessions.map(session => 
                session.id === selectedSession.id 
                    ? { ...session, status: updatedStatus } 
                    : session
            ));
            
            // Create notification for the student
            const statusMessages = {
                pending: 'Your session is now pending review.',
                confirmed: 'Your mentorship session has been confirmed!',
                completed: 'Your mentorship session has been marked as completed.',
                cancelled: 'Your mentorship session has been cancelled.'
            };
            
            const notificationTitle = `Mentorship Session ${updatedStatus.charAt(0).toUpperCase() + updatedStatus.slice(1)}`;
            const notificationMessage = `${statusMessages[updatedStatus]} Session with ${selectedSession.mentors?.name} on ${format(new Date(selectedSession.session_date), 'MMM d, yyyy')} at ${selectedSession.start_time.substring(0, 5)}.`;
            
            // Create notification for the student
            await createNotification(
                selectedSession.student_id,
                notificationTitle,
                notificationMessage,
                updatedStatus === 'cancelled' ? 'error' : 
                updatedStatus === 'confirmed' ? 'success' : 
                updatedStatus === 'completed' ? 'info' : 'warning'
            );
            
            setNotification({
                open: true,
                message: 'Session status updated successfully',
                severity: 'success'
            });
            
            setIsUpdateDialogOpen(false);
        } catch (err) {
            console.error('Error updating session status:', err);
            setNotification({
                open: true,
                message: 'Failed to update session status',
                severity: 'error'
            });
        }
    };
    
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
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
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Mentorship Sessions
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Filter by Status"
                    >
                        <MenuItem value="all">All Sessions</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
                
                <Button 
                    variant="outlined" 
                    sx={{ ml: 2 }}
                    onClick={loadSessions}
                >
                    Refresh
                </Button>
            </Box>
            
            {sessions.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                        No mentorship sessions found with the selected filter.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Mentor</TableCell>
                                <TableCell>Student</TableCell>
                                <TableCell>Topic</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>
                                        {format(new Date(session.session_date), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {`${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}`}
                                    </TableCell>
                                    <TableCell>
                                        {session.mentors?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        {session.student?.full_name || 'Unknown Student'}
                                    </TableCell>
                                    <TableCell>
                                        {session.topic}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={session.status} 
                                            color={statusColors[session.status] || 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => handleStatusChange(session)}
                                        >
                                            Update Status
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            
            {/* Status Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onClose={() => setIsUpdateDialogOpen(false)}>
                <DialogTitle>Update Session Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, minWidth: 300 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={updatedStatus}
                                onChange={(e) => setUpdatedStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
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
