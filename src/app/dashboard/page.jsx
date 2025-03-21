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
import PersonalizedLearningPathCard from '@/components/PersonalizedLearningPathCard';

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
                    {/* Main Content Column - Full Width */}
                    <Grid item xs={12}>
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

                        {/* Personalized Learning Paths */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                Your Learning Paths
                            </Typography>
                            <Grid container spacing={2}>
                                {courses.map((course) => (
                                    <Grid item xs={12} md={6} key={course.id}>
                                        <PersonalizedLearningPathCard
                                            courseId={course.id}
                                            gradeLevel={course.grade_level}
                                        />
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="600">
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

                                {/* Activity items would go here */}
                            </Paper>
                        </motion.div>

                        {/* My Flashcards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="600">
                                        My Flashcards
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

                                {/* Flashcard deck list or empty state */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                    <Stack spacing={2} alignItems="center">
                                        <SvgIcon name="tabler-cards" size={48} color="#9E9E9E" />
                                        <Typography variant="body1" color="text.secondary">
                                            No flashcard decks yet
                                        </Typography>
                                    </Stack>
                                </Box>
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