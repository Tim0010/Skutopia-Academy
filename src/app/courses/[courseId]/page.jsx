'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    LinearProgress,
    Divider,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseById, getLessonById, submitQuizAttempt, updateLessonProgress } from '@/utils/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';
import AITutor from '@/components/AITutor';
import PersonalizedLearningPathCard from '@/components/PersonalizedLearningPathCard';

export default function CourseViewerPage() {
    const router = useRouter();
    const { courseId } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizTimer, setQuizTimer] = useState(0);
    const [quizStartTime, setQuizStartTime] = useState(null);

    useEffect(() => {
        if (user && courseId) {
            loadCourse();
        }
    }, [user, courseId]);

    useEffect(() => {
        let timer;
        if (isQuizMode && quizStartTime) {
            timer = setInterval(() => {
                setQuizTimer(Math.floor((Date.now() - quizStartTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isQuizMode, quizStartTime]);

    const loadCourse = async () => {
        const { data, error } = await getCourseById(courseId);
        if (!error && data) {
            setCourse(data);
            if (data.lessons?.length > 0) {
                loadLesson(data.lessons[0].id);
            }
        }
    };

    const loadLesson = async (lessonId) => {
        const { data, error } = await getLessonById(lessonId);
        if (!error && data) {
            setCurrentLesson(data);
            setIsQuizMode(false);
            setQuizAnswers({});
            setQuizTimer(0);
            setQuizStartTime(null);
        }
    };

    const handleStartQuiz = () => {
        setIsQuizMode(true);
        setQuizStartTime(Date.now());
    };

    const handleQuizAnswer = (questionId, answer) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const calculateQuizScore = () => {
        if (!currentLesson?.quiz?.quiz_questions) return 0;
        
        let correctAnswers = 0;
        currentLesson.quiz.quiz_questions.forEach(question => {
            if (quizAnswers[question.id] === question.correct_answer) {
                correctAnswers++;
            }
        });

        return (correctAnswers / currentLesson.quiz.quiz_questions.length) * 100;
    };

    const handleSubmitQuiz = async () => {
        const score = calculateQuizScore();
        const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

        await submitQuizAttempt(
            user.id,
            currentLesson.quiz.id,
            quizAnswers,
            score,
            timeTaken
        );

        if (score >= currentLesson.quiz.passing_score) {
            await updateLessonProgress(user.id, currentLesson.id, true);
            loadLesson(currentLesson.id);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <ProtectedRoute>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<SvgIcon name="tabler-arrow-left" />}
                        onClick={() => router.push('/courses')}
                        sx={{ mb: 2 }}
                    >
                        Back to Courses
                    </Button>
                    <Typography variant="h4">{course?.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {course?.description}
                    </Typography>
                </Box>

                {/* Personalized Learning Path */}
                {course && (
                    <PersonalizedLearningPathCard 
                        courseId={courseId} 
                        gradeLevel={course.grade_level}
                    />
                )}

                <Box sx={{ display: 'flex', gap: 4 }}>
                    {/* Lesson List */}
                    <Paper sx={{ width: 300, p: 2 }}>
                        <Typography variant="h6" gutterBottom>Lessons</Typography>
                        <List>
                            {course?.lessons?.map((lesson, index) => (
                                <ListItem
                                    key={lesson.id}
                                    button
                                    selected={currentLesson?.id === lesson.id}
                                    onClick={() => loadLesson(lesson.id)}
                                >
                                    <ListItemIcon>
                                        <SvgIcon 
                                            name={currentLesson?.id === lesson.id ? "tabler-player-play" : "tabler-circle"} 
                                            size={20}
                                        />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={lesson.title}
                                        secondary={`Lesson ${index + 1}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Lesson Content */}
                    <Box sx={{ flex: 1 }}>
                        {!isQuizMode ? (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom>{currentLesson?.title}</Typography>
                                
                                {currentLesson?.video_url && (
                                    <Box sx={{ mb: 3, position: 'relative', paddingTop: '56.25%' }}>
                                        <iframe
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 0
                                            }}
                                            src={currentLesson.video_url}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </Box>
                                )}

                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    {currentLesson?.content}
                                </Typography>

                                {currentLesson?.quiz && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleStartQuiz}
                                        startIcon={<SvgIcon name="tabler-writing" />}
                                    >
                                        Take Quiz
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5">Quiz: {currentLesson?.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Time: {formatTime(quizTimer)}
                                    </Typography>
                                </Box>

                                <Stack spacing={4}>
                                    {currentLesson?.quiz?.quiz_questions?.map((question, index) => (
                                        <Box key={question.id}>
                                            <Typography variant="h6" gutterBottom>
                                                Question {index + 1}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                {question.question}
                                            </Typography>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    value={quizAnswers[question.id] || ''}
                                                    onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                                                >
                                                    {JSON.parse(question.options).map((option, optionIndex) => (
                                                        <FormControlLabel
                                                            key={optionIndex}
                                                            value={option}
                                                            control={<Radio />}
                                                            label={option}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    ))}
                                </Stack>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsQuizMode(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(quizAnswers).length !== currentLesson?.quiz?.quiz_questions?.length}
                                    >
                                        Submit Quiz
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* AI Tutor component */}
            {currentLesson && (
                <AITutor 
                    courseId={courseId} 
                    topic={currentLesson.title} 
                    gradeLevel={course?.grade_level || 8}
                />
            )}
        </ProtectedRoute>
    );
} 