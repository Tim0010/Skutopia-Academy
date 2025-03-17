'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getUserMentorshipSessions, createMentorshipSession } from '@/utils/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MentorshipPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingData, setBookingData] = useState({
        sessionDate: '',
        sessionTime: '',
        sessionTopic: ''
    });

    useEffect(() => {
        if (user) {
            loadSessions();
        }
    }, [user]);

    const loadSessions = async () => {
        const { data, error } = await getUserMentorshipSessions(user.id);
        if (!error) {
            setSessions(data || []);
        }
    };

    const handleCreateSession = async () => {
        // Combine date and time to create a valid ISO string
        const dateTimeString = `${bookingData.sessionDate}T${bookingData.sessionTime}:00`;
        const combinedDateTime = new Date(dateTimeString);

        const { data, error } = await createMentorshipSession(
            selectedMentor.id,
            user.id,
            combinedDateTime.toISOString(),
            bookingData.sessionTopic
        );

        if (!error) {
            setIsBooking(false);
            setSelectedMentor(null);
            setBookingData({ sessionDate: '', sessionTime: '', sessionTopic: '' });
            loadSessions();
        }
    };

    // Get current date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    const mentors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            subjects: ['Mathematics', 'Physics'],
            experience: '10+ years',
            avatar: '/assets/images/mentors/sarah.jpg'
        },
        {
            id: 2,
            name: 'Prof. Michael Chen',
            subjects: ['Chemistry', 'Biology'],
            experience: '8 years',
            avatar: '/assets/images/mentors/michael.jpg'
        },
        {
            id: 3,
            name: 'Dr. Emily Brown',
            subjects: ['Literature', 'History'],
            experience: '12 years',
            avatar: '/assets/images/mentors/emily.jpg'
        }
    ];

    return (
        <ProtectedRoute>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>Mentorship Sessions</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Connect with experienced mentors and schedule one-on-one sessions.
                    </Typography>
                </Box>

                {/* Upcoming Sessions */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Upcoming Sessions</Typography>
                    <Stack spacing={2}>
                        {sessions.map(session => (
                            <Card key={session.id} sx={{ bgcolor: 'background.neutral' }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar
                                                src={session.mentors?.avatar}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="subtitle1">
                                                Session with {session.mentors?.user_metadata?.first_name} {session.mentors?.user_metadata?.last_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(session.session_date).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Topic: {session.session_topic}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                startIcon={<SvgIcon name="tabler-video" />}
                                            >
                                                Join Meeting
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        {sessions.length === 0 && (
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                No upcoming sessions. Book a session with one of our mentors below.
                            </Typography>
                        )}
                    </Stack>
                </Paper>

                {/* Available Mentors */}
                <Typography variant="h6" gutterBottom>Available Mentors</Typography>
                <Grid container spacing={3}>
                    {mentors.map((mentor, index) => (
                        <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Avatar
                                                src={mentor.avatar}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    mx: 'auto',
                                                    mb: 2
                                                }}
                                            />
                                            <Typography variant="h6">{mentor.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {mentor.experience} of experience
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                            {mentor.subjects.map(subject => (
                                                <Chip
                                                    key={subject}
                                                    label={subject}
                                                    size="small"
                                                    sx={{ mb: 1 }}
                                                />
                                            ))}
                                        </Stack>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedMentor(mentor);
                                                setIsBooking(true);
                                            }}
                                        >
                                            Book Session
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Booking Dialog */}
                <Dialog
                    open={isBooking}
                    onClose={() => setIsBooking(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Book Session with {selectedMentor?.name}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <TextField
                                label="Session Date"
                                type="date"
                                fullWidth
                                value={bookingData.sessionDate}
                                onChange={(e) => setBookingData(prev => ({ ...prev, sessionDate: e.target.value }))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: today
                                }}
                            />
                            <TextField
                                label="Session Time"
                                type="time"
                                fullWidth
                                value={bookingData.sessionTime}
                                onChange={(e) => setBookingData(prev => ({ ...prev, sessionTime: e.target.value }))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Session Topic"
                                fullWidth
                                multiline
                                rows={3}
                                value={bookingData.sessionTopic}
                                onChange={(e) => setBookingData(prev => ({ ...prev, sessionTopic: e.target.value }))}
                                placeholder="Describe what you'd like to discuss in this session"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsBooking(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateSession}
                            disabled={!bookingData.sessionDate || !bookingData.sessionTime || !bookingData.sessionTopic}
                        >
                            Book Session
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ProtectedRoute>
    );
} 