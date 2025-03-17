'use client';

import React, { useEffect, useState } from 'react';
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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    Divider,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getUserMentorshipSessions, getActiveScholarships, getFlashcardDecks, createFlashcardDeck, getCourses } from '@/utils/supabaseClient';

export default function DashboardPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [decks, setDecks] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newDeckData, setNewDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false
    });
    const [courses, setCourses] = useState([]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const { data: sessions } = await getUserMentorshipSessions(user.id);
                setUpcomingSessions(sessions || []);

                const { data: scholarshipData } = await getActiveScholarships();
                setScholarships(scholarshipData || []);

                loadDecks();
            };

            fetchData();
        }
    }, [user]);

    useEffect(() => {
        async function fetchCourses() {
            const { data, error } = await getCourses();
            if (error) {
                console.error('Error fetching courses:', error);
            } else {
                setCourses(data || []);
            }
        }
        
        fetchCourses();
    }, []);

    const loadDecks = async () => {
        const { data, error } = await getFlashcardDecks(user.id);
        if (!error) {
            setDecks(data || []);
        }
    };

    const handleCreateDeck = async () => {
        const { data, error } = await createFlashcardDeck(
            user.id,
            newDeckData.title,
            newDeckData.description,
            newDeckData.subject,
            newDeckData.isPublic
        );

        if (!error) {
            setIsCreating(false);
            loadDecks();
            setNewDeckData({ title: '', description: '', subject: '', isPublic: false });
        }
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                        {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper
                        elevation={0}
                                    sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        gap: 2
                                    }}
                                >
                                    <Box>
                            <Typography variant="h4" fontWeight="500" gutterBottom>
                                            Welcome, {user?.user_metadata?.first_name || 'User'}!
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {user?.user_metadata?.role === 'student'
                                                ? 'Continue your learning journey'
                                                : 'Manage your mentorship activities'}
                                        </Typography>
                                    </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleSignOut}
                                        startIcon={<SvgIcon name="tabler-logout" size={20} />}
                                        sx={{
                                    borderRadius: 1.5,
                                    py: 1
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                        </Box>
                                </Paper>
                            </motion.div>

                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} md={8}>
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {[
                                    {
                                        title: 'Courses',
                                        value: '12',
                                        icon: 'tabler-book',
                                        color: '#2196F3',
                                        bgColor: 'rgba(33, 150, 243, 0.08)'
                                    },
                                    {
                                        title: 'Completed',
                                        value: '5',
                                        icon: 'tabler-check',
                                        color: '#4CAF50',
                                        bgColor: 'rgba(76, 175, 80, 0.08)'
                                    },
                                    {
                                        title: 'Hours Spent',
                                        value: '24',
                                        icon: 'tabler-clock',
                                        color: '#FF9800',
                                        bgColor: 'rgba(255, 152, 0, 0.08)'
                                    },
                                    {
                                        title: 'Achievements',
                                        value: '8',
                                        icon: 'tabler-trophy',
                                        color: '#9C27B0',
                                        bgColor: 'rgba(156, 39, 176, 0.08)'
                                    }
                                ].map((stat, index) => (
                                    <Grid item xs={6} sm={3} key={index}>
                                            <Card
                                            elevation={0}
                                                sx={{
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                    height: '100%',
                                                transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                                                    }
                                                }}
                                            >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Stack spacing={1}>
                                                        <Box
                                                            sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 1.5,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: stat.bgColor,
                                                                color: stat.color
                                                            }}
                                                        >
                                                        <SvgIcon name={stat.icon} size={20} />
                                                        </Box>
                                                    <Typography variant="h5" fontWeight="600">
                                                                {stat.value}
                                                            </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                                {stat.title}
                                                            </Typography>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Paper
                                elevation={0}
                                    sx={{
                                        p: 3,
                                    mb: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500">
                                        Recent Activity
                                    </Typography>
                                    <Button 
                                        variant="text" 
                                        color="primary" 
                                        size="small"
                                        endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={2}>
                                        {[
                                            {
                                                title: 'Completed Algebra Quiz',
                                                time: '2 hours ago',
                                                icon: 'tabler-writing',
                                                color: '#2196F3'
                                            },
                                            {
                                                title: 'Watched Physics Video Lesson',
                                                time: 'Yesterday',
                                                icon: 'tabler-video',
                                                color: '#FF9800'
                                            },
                                            {
                                                title: 'Joined Chemistry Study Group',
                                                time: '2 days ago',
                                                icon: 'tabler-users',
                                                color: '#4CAF50'
                                            },
                                            {
                                                title: 'Earned "Math Whiz" Badge',
                                                time: '3 days ago',
                                                icon: 'tabler-award',
                                                color: '#9C27B0'
                                            }
                                        ].map((activity, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 2,
                                                borderRadius: 1.5,
                                                    bgcolor: 'background.neutral',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                gap: 2,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: 'action.hover'
                                                }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                    width: 36,
                                                    height: 36,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    bgcolor: `${activity.color}15`,
                                                        color: activity.color
                                                    }}
                                                >
                                                <SvgIcon name={activity.icon} size={18} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight="500">
                                                        {activity.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {activity.time}
                                                    </Typography>
                                                </Box>
                                            <IconButton size="small">
                                                <SvgIcon name="tabler-dots-vertical" size={16} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </motion.div>

                        {/* Upcoming Mentorship */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500">
                                        Upcoming Mentorship Sessions
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        size="small"
                                        startIcon={<SvgIcon name="tabler-plus" size={16} />}
                                        sx={{ borderRadius: 1.5 }}
                                    >
                                        New Session
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {upcomingSessions.length > 0 ? (
                                    <Stack spacing={2}>
                                        {upcomingSessions.map(session => (
                                            <Box 
                                                key={session.id} 
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 1.5, 
                                                    bgcolor: 'background.neutral',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        Session with {session.mentor_id}
                                                    </Typography>
                                                    <Chip 
                                                        label="Upcoming" 
                                                        size="small" 
                                                        color="primary" 
                                                        variant="outlined"
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(session.scheduled_at).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <SvgIcon name="tabler-calendar" size={48} sx={{ color: 'text.disabled', mb: 2 }} />
                                        <Typography color="text.secondary">No upcoming sessions</Typography>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 2, borderRadius: 1.5 }}
                                        >
                                            Schedule a Session
                                        </Button>
                                    </Box>
                                )}
                                </Paper>
                            </motion.div>
                        </Grid>

                    {/* Right Column */}
                        <Grid item xs={12} md={4}>
                        {/* Profile Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Paper
                                elevation={0}
                                    sx={{
                                        p: 3,
                                    mb: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                bgcolor: 'primary.main',
                                            }}
                                        >
                                            {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </Avatar>
                                    <Typography variant="h6" fontWeight="500">
                                            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                                        </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {user?.email}
                                        </Typography>
                                    <Chip
                                        label={user?.user_metadata?.role === 'student' ? 'Student' : 'Mentor'}
                                        color={user?.user_metadata?.role === 'student' ? 'primary' : 'success'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderRadius: 1 }}
                                    />
                                    </Box>

                                <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                        startIcon={<SvgIcon name="tabler-user" size={18} />}
                                        sx={{ borderRadius: 1.5, py: 1 }}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                        startIcon={<SvgIcon name="tabler-settings" size={18} />}
                                        sx={{ borderRadius: 1.5, py: 1 }}
                                        >
                                            Account Settings
                                        </Button>
                                    </Stack>
                                </Paper>
                            </motion.div>

                        {/* Flashcards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500">
                                        My Flashcards
                                    </Typography>
                                    <Button 
                                        variant="text" 
                                        size="small"
                                        endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                        onClick={() => router.push('/flashcards')}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {decks.length > 0 ? (
                                    <Stack spacing={2}>
                                        {decks.slice(0, 3).map((deck) => (
                                            <Box 
                                                key={deck.id} 
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 1.5, 
                                                    bgcolor: 'background.neutral',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                                onClick={() => router.push(`/flashcards/${deck.id}`)}
                                            >
                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                    {deck.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                    {deck.description}
                                                </Typography>
                                                <Chip 
                                                    label={deck.subject}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <SvgIcon name="tabler-cards" size={48} sx={{ color: 'text.disabled', mb: 2 }} />
                                        <Typography color="text.secondary">No flashcard decks yet</Typography>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 2, borderRadius: 1.5 }}
                                            onClick={() => setIsCreating(true)}
                                        >
                                            Create a Deck
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>

                        {/* Scholarships */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500">
                                        Available Scholarships
                                    </Typography>
                                    <Button 
                                        variant="text" 
                                        size="small"
                                        endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                        onClick={() => router.push('/scholarships')}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {scholarships.length > 0 ? (
                                    <Stack spacing={2}>
                                        {scholarships.slice(0, 2).map(scholarship => (
                                            <Box 
                                                key={scholarship.id} 
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 1.5, 
                                                    bgcolor: 'background.neutral',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                    {scholarship.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" color="success.main" fontWeight="500">
                                                        ${scholarship.amount}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small" 
                                                    fullWidth
                                                    sx={{ mt: 1, borderRadius: 1.5 }}
                                                >
                                                    Apply Now
                                                </Button>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <SvgIcon name="tabler-award" size={48} sx={{ color: 'text.disabled', mb: 2 }} />
                                        <Typography color="text.secondary">No scholarships available</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>
                    </Grid>
                </Container>

            {/* Create Deck Dialog */}
            <Dialog 
                open={isCreating} 
                onClose={() => setIsCreating(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }
                }}
            >
                <DialogTitle>Create New Flashcard Deck</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={newDeckData.title}
                            onChange={(e) => setNewDeckData({ ...newDeckData, title: e.target.value })}
                            size="small"
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newDeckData.description}
                            onChange={(e) => setNewDeckData({ ...newDeckData, description: e.target.value })}
                            size="small"
                        />
                        <TextField
                            label="Subject"
                            fullWidth
                            value={newDeckData.subject}
                            onChange={(e) => setNewDeckData({ ...newDeckData, subject: e.target.value })}
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newDeckData.isPublic}
                                    onChange={(e) => setNewDeckData({ ...newDeckData, isPublic: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Make deck public"
                        />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={() => setIsCreating(false)} 
                        sx={{ borderRadius: 1.5 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateDeck}
                        disabled={!newDeckData.title || !newDeckData.subject}
                        sx={{ borderRadius: 1.5 }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
} 