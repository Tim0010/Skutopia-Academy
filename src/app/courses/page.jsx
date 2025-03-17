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
    CardMedia,
    Stack,
    Chip,
    LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getCourses } from '@/utils/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CoursesPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (user) {
            loadCourses();
        }
    }, [user]);

    const loadCourses = async () => {
        const { data, error } = await getCourses();
        if (!error) {
            setCourses(data || []);
        }
    };

    return (
        <ProtectedRoute>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>Available Courses</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Explore our comprehensive collection of courses designed to help you succeed.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {courses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => router.push(`/courses/${course.id}`)}
                                >
                                    {course.thumbnail_url && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={course.thumbnail_url}
                                            alt={course.title}
                                        />
                                    )}
                                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {course.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ mb: 2, flex: 1 }}
                                        >
                                            {course.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                            <Chip 
                                                label={course.subject}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip 
                                                label={`Grade ${course.grade_level}`}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        {course.progress_percentage !== undefined && (
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Progress
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {course.progress_percentage}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={course.progress_percentage} 
                                                    sx={{ height: 6, borderRadius: 1 }}
                                                />
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ProtectedRoute>
    );
} 