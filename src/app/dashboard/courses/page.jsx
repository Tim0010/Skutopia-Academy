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
    Button,
    Chip,
    Avatar,
    CircularProgress,
    Alert,
    Skeleton,
    Rating,
    Stack,
    LinearProgress,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function CoursesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCourses();
            fetchUserProgress();
        }
    }, [user]);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProgress = async () => {
        try {
            // Create an empty progress map as fallback
            const progressMap = {};
            
            // First try the course lesson count function
            try {
                const { data: courseLessons, error: courseLessonsError } = await supabase
                    .rpc('get_course_lesson_counts');

                if (courseLessonsError) {
                    console.error('Error fetching course lesson counts:', courseLessonsError);
                    
                    // Check if the error is due to the function not existing
                    if (courseLessonsError.message.includes('function') && courseLessonsError.message.includes('does not exist')) {
                        console.log('Redirecting to database setup page due to missing function...');
                        // Optionally redirect to the setup page
                        window.location.href = '/setup';
                        return; // Stop processing
                    }
                    
                    // Continue with fallback calculation
                    // Fallback: Get all courses and all lessons to count manually
                    try {
                        const { data: courses } = await supabase.from('courses').select('id');
                        const { data: units } = await supabase.from('units').select('id, course_id');
                        const { data: lessons } = await supabase.from('lessons').select('id, unit_id');
                        
                        if (courses && units && lessons) {
                            // Create a map of units to courses
                            const unitToCourse = {};
                            units.forEach(unit => {
                                unitToCourse[unit.id] = unit.course_id;
                            });
                            
                            // Count lessons per course
                            const lessonCounts = {};
                            lessons.forEach(lesson => {
                                const courseId = unitToCourse[lesson.unit_id];
                                if (courseId) {
                                    if (!lessonCounts[courseId]) {
                                        lessonCounts[courseId] = 0;
                                    }
                                    lessonCounts[courseId]++;
                                }
                            });
                            
                            // Initialize progress map
                            courses.forEach(course => {
                                progressMap[course.id] = {
                                    totalLessons: lessonCounts[course.id] || 0,
                                    completedLessons: 0
                                };
                            });
                        }
                    } catch (fallbackError) {
                        console.error('Fallback counting failed:', fallbackError);
                    }
                } else if (courseLessons) {
                    // Initialize with total lessons per course
                    courseLessons.forEach(item => {
                        progressMap[item.course_id] = {
                            totalLessons: parseInt(item.count || 0),
                            completedLessons: 0
                        };
                    });
                }
            } catch (error) {
                console.error('Error in get_course_lesson_counts:', error);
                // Continue with empty progress data
            }

            // Try to get completed lessons from lesson_progress table
            try {
                const { data: lessonProgress, error: lessonProgressError } = await supabase
                    .from('lesson_progress')
                    .select('course_id, lesson_id')
                    .eq('user_id', user.id)
                    .eq('is_completed', true);
                
                if (!lessonProgressError && lessonProgress) {
                    // Count completed lessons per course
                    lessonProgress.forEach(item => {
                        if (!progressMap[item.course_id]) {
                            progressMap[item.course_id] = {
                                totalLessons: 0,
                                completedLessons: 0
                            };
                        }
                        progressMap[item.course_id].completedLessons += 1;
                    });
                }
            } catch (innerError) {
                console.error('Error fetching lesson progress:', innerError);
                // Continue without lesson progress data
            }

            // Fallback to user_progress if previous query failed
            try {
                const { data: userProgress, error: userProgressError } = await supabase
                    .from('user_progress')
                    .select('lesson_id')
                    .eq('user_id', user.id)
                    .eq('completed', true);

                if (!userProgressError && userProgress && userProgress.length > 0) {
                    // Try to get lesson -> course mapping
                    const lessonIds = userProgress.map(p => p.lesson_id);
                    
                    const { data: lessonInfo } = await supabase
                        .from('lessons')
                        .select('id, unit_id')
                        .in('id', lessonIds);
                    
                    if (lessonInfo && lessonInfo.length > 0) {
                        const unitIds = lessonInfo.map(l => l.unit_id);
                        
                        const { data: unitInfo } = await supabase
                            .from('units')
                            .select('id, course_id')
                            .in('id', unitIds);
                        
                        if (unitInfo && unitInfo.length > 0) {
                            // Create maps for faster lookups
                            const lessonToUnit = {};
                            lessonInfo.forEach(l => lessonToUnit[l.id] = l.unit_id);
                            
                            const unitToCourse = {};
                            unitInfo.forEach(u => unitToCourse[u.id] = u.course_id);
                            
                            // Count completed lessons by course
                            userProgress.forEach(p => {
                                const unitId = lessonToUnit[p.lesson_id];
                                const courseId = unitId ? unitToCourse[unitId] : null;
                                
                                if (courseId && progressMap[courseId]) {
                                    progressMap[courseId].completedLessons += 1;
                                }
                            });
                        }
                    }
                }
            } catch (innerError) {
                console.error('Error fetching user progress fallback:', innerError);
                // Continue with whatever data we have
            }

            setUserProgress(progressMap);
        } catch (error) {
            console.error('Error fetching user progress:', error);
            // Don't set error state, just use an empty progress object
            setUserProgress({});
        }
    };

    const getProgressPercentage = (courseId) => {
        const progress = userProgress[courseId];
        if (!progress || progress.totalLessons === 0) return 0;
        return Math.round((progress.completedLessons / progress.totalLessons) * 100);
    };

    const handleCourseClick = (courseId) => {
        router.push(`/dashboard/courses/${courseId}`);
    };

    if (loading) {
        return (
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Courses
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Skeleton variant="rectangular" height={160} />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Skeleton variant="text" height={32} width="80%" />
                                    <Skeleton variant="text" height={20} width="60%" />
                                    <Skeleton variant="text" height={20} width="40%" sx={{ mt: 1 }} />
                                    <Box sx={{ mt: 2 }}>
                                        <Skeleton variant="rectangular" height={10} width="100%" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Courses
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
                Courses
            </Typography>

            {courses.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8, p: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        No courses available at the moment.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Check back later for new learning opportunities.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                                        },
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={course.cover_image || '/assets/images/course-placeholder.jpg'}
                                        alt={course.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {course.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                size="small"
                                                label={course.subject || 'General'}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ borderRadius: 1 }}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                {course.level || 'Beginner'}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {course.description}
                                        </Typography>

                                        {userProgress[course.id] && (
                                            <Box sx={{ mt: 2, mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Progress
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {getProgressPercentage(course.id)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={getProgressPercentage(course.id)}
                                                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                                                />
                                            </Box>
                                        )}

                                        <Box sx={{ mt: 'auto', pt: 2 }}>
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                fullWidth
                                                onClick={() => handleCourseClick(course.id)}
                                                sx={{ borderRadius: 1.5 }}
                                            >
                                                {userProgress[course.id] ? 'Continue Learning' : 'Start Course'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
} 