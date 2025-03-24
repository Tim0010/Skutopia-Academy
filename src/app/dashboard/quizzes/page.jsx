'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Chip,
    LinearProgress,
    CircularProgress,
    Alert,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
} from '@mui/material';
import {
    QuizOutlined as QuizIcon,
    AccessTime as TimeIcon,
    QueryStats as StatsIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function QuizzesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);
    const [userAttempts, setUserAttempts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subject, setSubject] = useState('all');
    const [difficulty, setDifficulty] = useState('all');
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (user) {
            fetchQuizzes();
            fetchUserAttempts();
        }
    }, [user, subject, difficulty]);

    const fetchQuizzes = async () => {
        try {
            let query = supabase
                .from('quizzes')
                .select('*, course:courses(title)')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (subject !== 'all') {
                query = query.eq('subject', subject);
            }

            if (difficulty !== 'all') {
                query = query.eq('difficulty', difficulty);
            }

            const { data, error } = await query;

            if (error) throw error;

            setQuizzes(data || []);

            // Extract unique subjects for filter
            const uniqueSubjects = [...new Set(data.map(quiz => quiz.subject).filter(Boolean))];
            setSubjects(uniqueSubjects);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            setError('Failed to load quizzes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserAttempts = async () => {
        try {
            const { data, error } = await supabase
                .from('quiz_attempts')
                .select('quiz_id, score, max_score, completed_at')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (error) throw error;

            // Create a lookup object with the best attempt for each quiz
            const attemptLookup = {};
            data.forEach(attempt => {
                if (!attemptLookup[attempt.quiz_id] ||
                    (attempt.score / attempt.max_score) > (attemptLookup[attempt.quiz_id].score / attemptLookup[attempt.quiz_id].max_score)) {
                    attemptLookup[attempt.quiz_id] = attempt;
                }
            });

            setUserAttempts(attemptLookup);
        } catch (error) {
            console.error('Error fetching quiz attempts:', error);
        }
    };

    const getQuizProgress = (quizId) => {
        if (!userAttempts[quizId]) return null;

        const attempt = userAttempts[quizId];
        const percentage = (attempt.score / attempt.max_score) * 100;

        return {
            percentage,
            score: attempt.score,
            maxScore: attempt.max_score,
            completed: true
        };
    };

    const handleStartQuiz = (quizId) => {
        router.push(`/dashboard/quizzes/${quizId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ mb: { xs: 2, md: 0 } }}>Quizzes</Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            label="Subject"
                        >
                            <MenuItem value="all">All Subjects</MenuItem>
                            {subjects.map((subj) => (
                                <MenuItem key={subj} value={subj}>{subj}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            label="Difficulty"
                        >
                            <MenuItem value="all">All Levels</MenuItem>
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">Intermediate</MenuItem>
                            <MenuItem value="advanced">Advanced</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {quizzes.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <QuizIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No quizzes available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                        {subject !== 'all' || difficulty !== 'all'
                            ? 'No quizzes match your current filters. Try changing your filter options.'
                            : 'Check back later for new quizzes to test your knowledge.'}
                    </Typography>
                    {(subject !== 'all' || difficulty !== 'all') && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSubject('all');
                                setDifficulty('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz, index) => {
                        const progress = getQuizProgress(quiz.id);

                        return (
                            <Grid item xs={12} md={6} lg={4} key={quiz.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                            },
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                height: 140,
                                                bgcolor: 'primary.main',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: 'white',
                                            }}
                                        >
                                            <QuizIcon sx={{ fontSize: 50, mb: 1 }} />
                                            <Typography variant="subtitle1">
                                                {quiz.title}
                                            </Typography>
                                        </CardMedia>

                                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {quiz.subject && (
                                                    <Chip
                                                        label={quiz.subject}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                )}
                                                <Chip
                                                    label={quiz.difficulty ? quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1) : 'All Levels'}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                                {quiz.course && (
                                                    <Chip
                                                        label={quiz.course.title}
                                                        size="small"
                                                        icon={<SchoolIcon fontSize="small" />}
                                                        variant="outlined"
                                                        color="default"
                                                    />
                                                )}
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    minHeight: 40,
                                                }}
                                            >
                                                {quiz.description || 'Test your knowledge with this quiz.'}
                                            </Typography>

                                            <Stack direction="row" spacing={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        {quiz.time_limit ? `${quiz.time_limit} min` : 'No time limit'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <QuizIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        {quiz.questions_count || '?'} questions
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {progress && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Your best score
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight="medium">
                                                            {progress.score}/{progress.maxScore} ({Math.round(progress.percentage)}%)
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(progress.percentage, 100)}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 1,
                                                            bgcolor: 'action.hover',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: progress.percentage >= 70 ? 'success.main' :
                                                                    progress.percentage >= 40 ? 'warning.main' : 'error.main',
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </CardContent>

                                        <Divider />

                                        <CardActions sx={{ p: 2 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => handleStartQuiz(quiz.id)}
                                                startIcon={progress ? <StatsIcon /> : <QuizIcon />}
                                            >
                                                {progress ? 'Retake Quiz' : 'Start Quiz'}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </motion.div>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
} 