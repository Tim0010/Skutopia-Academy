'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Divider,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Check as CheckIcon,
    Lock as LockIcon,
    Book as BookIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    AccessTime as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function LessonsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [lessons, setLessons] = useState([]);
    const [bookmarkedLessons, setBookmarkedLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (user) {
            fetchLessons();
            fetchUserProgress();
            fetchBookmarks();
        }
    }, [user]);

    const fetchLessons = async () => {
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select(`
                    *,
                    course:courses(id, title)
                `)
                .order('course_id', { ascending: true })
                .order('order_number', { ascending: true });

            if (error) throw error;
            setLessons(data || []);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            setError('Failed to load lessons. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProgress = async () => {
        try {
            const { data, error } = await supabase
                .from('user_course_progress')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('completed', true);

            if (error) throw error;
            setCompletedLessons(data.map(item => item.lesson_id) || []);
        } catch (error) {
            console.error('Error fetching user progress:', error);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const { data, error } = await supabase
                .from('user_bookmarks')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('bookmark_type', 'lesson');

            if (error) throw error;
            setBookmarkedLessons(data.map(item => item.lesson_id) || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const toggleBookmark = async (lessonId) => {
        const isBookmarked = bookmarkedLessons.includes(lessonId);

        try {
            if (isBookmarked) {
                // Remove bookmark
                await supabase
                    .from('user_bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('lesson_id', lessonId)
                    .eq('bookmark_type', 'lesson');

                setBookmarkedLessons(prev => prev.filter(id => id !== lessonId));
            } else {
                // Add bookmark
                await supabase
                    .from('user_bookmarks')
                    .insert([{
                        user_id: user.id,
                        lesson_id: lessonId,
                        bookmark_type: 'lesson',
                        created_at: new Date().toISOString()
                    }]);

                setBookmarkedLessons(prev => [...prev, lessonId]);
            }
        } catch (error) {
            console.error('Error updating bookmark:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLessonClick = (lessonId) => {
        router.push(`/dashboard/lessons/${lessonId}`);
    };

    const getFilteredLessons = () => {
        if (tabValue === 0) return lessons;
        if (tabValue === 1) return lessons.filter(lesson => bookmarkedLessons.includes(lesson.id));
        if (tabValue === 2) return lessons.filter(lesson => completedLessons.includes(lesson.id));
        return lessons;
    };

    const sortedLessons = getFilteredLessons();
    const groupedLessons = sortedLessons.reduce((acc, lesson) => {
        const courseId = lesson.course_id;
        if (!acc[courseId]) {
            acc[courseId] = {
                courseTitle: lesson.courses?.title || 'Uncategorized',
                lessons: []
            };
        }
        acc[courseId].lessons.push(lesson);
        return acc;
    }, {});

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Lessons
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Lessons
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="All Lessons" />
                    <Tab label="Bookmarked" />
                    <Tab label="Completed" />
                </Tabs>
            </Box>

            {Object.keys(groupedLessons).length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8, p: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {tabValue === 0 && 'No lessons available'}
                        {tabValue === 1 && 'No bookmarked lessons'}
                        {tabValue === 2 && 'No completed lessons'}
                    </Typography>
                </Box>
            ) : (
                Object.values(groupedLessons).map((courseGroup, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {courseGroup.courseTitle}
                            </Typography>

                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                <List disablePadding>
                                    {courseGroup.lessons.map((lesson, index) => (
                                        <React.Fragment key={lesson.id}>
                                            {index > 0 && <Divider component="li" />}
                                            <ListItem
                                                disablePadding
                                                secondaryAction={
                                                    <Tooltip title={bookmarkedLessons.includes(lesson.id) ? "Remove bookmark" : "Bookmark lesson"}>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleBookmark(lesson.id);
                                                            }}
                                                        >
                                                            {bookmarkedLessons.includes(lesson.id) ? (
                                                                <BookmarkIcon color="primary" />
                                                            ) : (
                                                                <BookmarkBorderIcon />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            >
                                                <ListItemButton
                                                    onClick={() => handleLessonClick(lesson.id)}
                                                    sx={{ py: 2 }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: completedLessons.includes(lesson.id) ? 'success.light' : 'primary.light',
                                                            }}
                                                        >
                                                            {completedLessons.includes(lesson.id) ? (
                                                                <CheckIcon />
                                                            ) : (
                                                                <BookIcon />
                                                            )}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="subtitle1" fontWeight={500}>
                                                                {lesson.title}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                <TimeIcon fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {lesson.duration || '15'} min
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Card>
                        </Box>
                    </motion.div>
                ))
            )}
        </Box>
    );
} 