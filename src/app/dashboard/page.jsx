'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
    CardActionArea,
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
    IconButton,
    LinearProgress,
    Skeleton,
    useTheme,
    useMediaQuery,
    Tooltip,
    Badge
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getUserMentorshipSessions, 
    getActiveScholarships, 
    getFlashcardDecks, 
    createFlashcardDeck, 
    getCourses 
} from '@/utils/supabaseClient';
import PersonalizedLearningPathCard from '@/components/PersonalizedLearningPathCard';

export default function DashboardPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const { user, signOut } = useAuth();
    
    // State management
    const [loading, setLoading] = useState(true);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [decks, setDecks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newDeckData, setNewDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false
    });
    
    // Stats for the dashboard
    const stats = useMemo(() => [
        {
            title: 'Courses',
            value: courses.length || '0',
            icon: 'tabler-book',
            color: '#2196F3',
            bgColor: 'rgba(33, 150, 243, 0.08)'
        },
        {
            title: 'Completed',
            value: courses.filter(c => c.completed).length || '0',
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
    ], [courses]);

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
                setLoading(true);
                try {
                    // Fetch all data in parallel
                    const [sessionsRes, scholarshipsRes, decksRes, coursesRes] = await Promise.all([
                        getUserMentorshipSessions(user.id),
                        getActiveScholarships(),
                        getFlashcardDecks(user.id),
                        getCourses()
                    ]);
                    
                    setUpcomingSessions(sessionsRes.data || []);
                    setScholarships(scholarshipsRes.data || []);
                    setDecks(decksRes.data || []);
                    setCourses(coursesRes.data || []);
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [user]);

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
            <Container maxWidth="lg" sx={{ py: 3 }}>
                {loading ? (
                    // Loading state
                    <Box sx={{ py: 2 }}>
                        <Grid container spacing={3}>
                            {/* Skeleton for welcome card */}
                            <Grid item xs={12}>
                                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                            </Grid>
                            
                            {/* Skeleton for stats */}
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    {[1, 2, 3, 4].map((item) => (
                                        <Grid item xs={6} sm={3} key={item}>
                                            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            
                            {/* Skeleton for learning paths */}
                            <Grid item xs={12}>
                                <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    {[1, 2].map((item) => (
                                        <Grid item xs={12} md={6} key={item}>
                                            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            
                            {/* Skeleton for other sections */}
                            <Grid item xs={12}>
                                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2 }} />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <>
                        {/* Welcome Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2, sm: 3 },
                                    mb: 3,
                                    borderRadius: 2,
                                    backgroundColor: 'primary.main',
                                    backgroundImage: 'linear-gradient(135deg, #0E7C6B 0%, #1976d2 100%)',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                                    <SvgIcon name="tabler-book" size={150} color="#ffffff" />
                                </Box>
                                
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="h4" fontWeight="700" gutterBottom>
                                            Welcome back, {user?.user_metadata?.first_name || 'User'}!
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                            {user?.user_metadata?.role === 'student'
                                                ? 'Continue your learning journey and explore new subjects.'
                                                : 'Manage your mentorship activities and track student progress.'}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="medium"
                                            sx={{
                                                bgcolor: 'white',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                },
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1
                                            }}
                                            onClick={() => router.push('/dashboard/courses')}
                                        >
                                            Continue Learning
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                height: '100%'
                                            }}
                                        >
                                            <Avatar
                                                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.first_name || 'User')}&background=ffffff&color=0E7C6B&size=128`}
                                                alt={user?.user_metadata?.first_name || 'User'}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    border: '4px solid',
                                                    borderColor: 'rgba(255,255,255,0.3)'
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {stats.map((stat, index) => (
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
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: stat.bgColor,
                                                            color: stat.color
                                                        }}
                                                    >
                                                        <SvgIcon name={stat.icon} size={22} />
                                                    </Box>
                                                    <Typography variant="h5" fontWeight="700">
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                                                        {stat.title}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {/* Main Dashboard Content */}
                        <Grid container spacing={3}>
                            {/* Left Column - 2/3 width */}
                            <Grid item xs={12} lg={8}>
                                {/* Personalized Learning Paths */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    style={{ marginBottom: 24 }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        mb: 2 
                                    }}>
                                        <Typography variant="h6" fontWeight="600">
                                            Your Learning Paths
                                        </Typography>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            size="small"
                                            endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                            onClick={() => router.push('/dashboard/courses')}
                                        >
                                            View All
                                        </Button>
                                    </Box>
                                    
                                    {courses.length > 0 ? (
                                        <Grid container spacing={2}>
                                            {courses.slice(0, 2).map((course) => (
                                                <Grid item xs={12} md={6} key={course.id}>
                                                    <PersonalizedLearningPathCard
                                                        courseId={course.id}
                                                        gradeLevel={course.grade_level}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Box sx={{ mb: 2 }}>
                                                <SvgIcon name="tabler-book" size={48} color="#9E9E9E" />
                                            </Box>
                                            <Typography variant="h6" gutterBottom>
                                                No Learning Paths Yet
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Start your learning journey by exploring our courses
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => router.push('/dashboard/courses')}
                                                startIcon={<SvgIcon name="tabler-plus" size={16} />}
                                            >
                                                Explore Courses
                                            </Button>
                                        </Paper>
                                    )}
                                </motion.div>

                                {/* Recent Activity */}
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

                                        <Stack spacing={2}>
                                            {[
                                                {
                                                    type: 'course',
                                                    title: 'Completed lesson in Advanced Mathematics',
                                                    time: '2 hours ago',
                                                    icon: 'tabler-book',
                                                    color: '#2196F3'
                                                },
                                                {
                                                    type: 'flashcard',
                                                    title: 'Created a new flashcard deck: Biology Terms',
                                                    time: 'Yesterday',
                                                    icon: 'tabler-cards',
                                                    color: '#4CAF50'
                                                },
                                                {
                                                    type: 'quiz',
                                                    title: 'Scored 95% on Physics Quiz',
                                                    time: '3 days ago',
                                                    icon: 'tabler-check',
                                                    color: '#FF9800'
                                                }
                                            ].map((activity, index) => (
                                                <Box 
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        p: 1.5,
                                                        borderRadius: 1.5,
                                                        '&:hover': {
                                                            bgcolor: 'background.neutral'
                                                        }
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            bgcolor: `${activity.color}15`,
                                                            color: activity.color,
                                                            mr: 2
                                                        }}
                                                    >
                                                        <SvgIcon name={activity.icon} size={20} />
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {activity.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {activity.time}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>
                                </motion.div>
                            </Grid>

                            {/* Right Column - 1/3 width */}
                            <Grid item xs={12} lg={4}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="600">
                                                My Flashcards
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<SvgIcon name="tabler-book" size={16} />}
                                                    onClick={() => router.push('/flashcards/subjects')}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Subject Cards
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    size="small"
                                                    endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                                    onClick={() => router.push('/flashcards')}
                                                >
                                                    View All
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Flashcard deck list or empty state */}
                                        {decks.length > 0 ? (
                                            <Stack spacing={2}>
                                                {decks.slice(0, 3).map((deck) => (
                                                    <Card 
                                                        key={deck.id}
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                                                            }
                                                        }}
                                                    >
                                                        <CardActionArea onClick={() => router.push(`/flashcards/${deck.id}`)}>
                                                            <CardContent sx={{ p: 2 }}>
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Chip 
                                                                        label={deck.subject || 'General'} 
                                                                        size="small" 
                                                                        sx={{ 
                                                                            bgcolor: getSubjectColor(deck.subject),
                                                                            color: '#fff',
                                                                            fontWeight: 500
                                                                        }} 
                                                                    />
                                                                </Box>
                                                                <Typography variant="subtitle1" fontWeight="600" gutterBottom noWrap>
                                                                    {deck.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                                                                    {deck.description || 'No description provided'}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {deck.card_count || 0} cards
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {formatDate(deck.created_at)}
                                                                    </Typography>
                                                                </Box>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                ))}
                                                
                                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<SvgIcon name="tabler-plus" size={16} />}
                                                        onClick={() => setIsCreating(true)}
                                                        fullWidth
                                                    >
                                                        Create New Deck
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                                                <Stack spacing={2} alignItems="center">
                                                    <SvgIcon name="tabler-cards" size={48} color="text.secondary" />
                                                    <Typography variant="body1" color="text.secondary">
                                                        No flashcard decks yet
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<SvgIcon name="tabler-plus" size={16} />}
                                                            onClick={() => setIsCreating(true)}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Create Deck
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            size="small"
                                                            startIcon={<SvgIcon name="tabler-book" size={16} />}
                                                            onClick={() => router.push('/flashcards/subjects')}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Browse Subjects
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        )}
                                    </Paper>
                                </motion.div>

                                {/* Upcoming Sessions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="600">
                                                Upcoming Sessions
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                size="small"
                                                endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                                                onClick={() => router.push('/dashboard/mentorship')}
                                            >
                                                View All
                                            </Button>
                                        </Box>
                                        <Box sx={{ mb: 2 }} />
                                        {upcomingSessions.length > 0 ? (
                                            <Stack spacing={2}>
                                                {upcomingSessions.slice(0, 3).map((session) => (
                                                    <Box
                                                        key={session.id}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            bgcolor: 'background.neutral',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={session.mentor_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentor_name)}&background=0E7C6B&color=fff`}
                                                            alt={session.mentor_name}
                                                        />
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle2" fontWeight="600">
                                                                {session.title || 'Mentorship Session'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                with {session.mentor_name}
                                                            </Typography>
                                                            <Typography variant="caption" color="primary" fontWeight="500">
                                                                {formatSessionDate(session.scheduled_at)}
                                                            </Typography>
                                                        </Box>
                                                        <Tooltip title="Join Session">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary"
                                                                sx={{ 
                                                                    bgcolor: 'primary.light', 
                                                                    color: 'white',
                                                                    '&:hover': { bgcolor: 'primary.main' }
                                                                }}
                                                            >
                                                                <SvgIcon name="tabler-video" size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                                                <Stack spacing={2} alignItems="center">
                                                    <SvgIcon name="tabler-calendar" size={40} color="text.secondary" />
                                                    <Typography variant="body1" color="text.secondary">
                                                        No upcoming sessions
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => router.push('/dashboard/mentorship')}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        Schedule a Session
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </>
                )}
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
                <DialogTitle>
                    <Typography variant="h6" fontWeight="600">Create New Flashcard Deck</Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={newDeckData.title}
                            onChange={(e) => setNewDeckData({ ...newDeckData, title: e.target.value })}
                            size="small"
                            placeholder="e.g., Biology Terms, Math Formulas"
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newDeckData.description}
                            onChange={(e) => setNewDeckData({ ...newDeckData, description: e.target.value })}
                            size="small"
                            placeholder="Briefly describe what this deck is about"
                        />
                        <TextField
                            label="Subject"
                            fullWidth
                            value={newDeckData.subject}
                            onChange={(e) => setNewDeckData({ ...newDeckData, subject: e.target.value })}
                            size="small"
                            placeholder="e.g., Mathematics, English, Science"
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

// Helper functions
function getSubjectColor(subject) {
    const subjectColors = {
        'Mathematics': '#2196F3', // Blue
        'English': '#9C27B0',     // Purple
        'Science': '#4CAF50',     // Green
        'Chemistry': '#FF9800',   // Orange
        'Biology': '#8BC34A',     // Light Green
        'Physics': '#F44336',     // Red
        'History': '#795548',     // Brown
        'Geography': '#009688',   // Teal
    };
    
    return subjectColors[subject] || '#757575'; // Default gray
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function formatSessionDate(dateString) {
    if (!dateString) return 'Date not set';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    if (isToday) {
        return `Today at ${timeString}`;
    } else if (isTomorrow) {
        return `Tomorrow at ${timeString}`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` at ${timeString}`;
    }
}