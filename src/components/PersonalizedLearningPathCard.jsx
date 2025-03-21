'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { useRouter } from 'next/navigation';

/**
 * Personalized Learning Path Card
 * Displays AI-recommended learning paths based on student performance
 * 
 * @param {Object} props - Component properties
 * @param {string} props.courseId - The course ID to get recommendations for
 * @param {number} props.gradeLevel - The student's grade level
 */
export default function PersonalizedLearningPathCard({ courseId, gradeLevel }) {
    const theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [learningPath, setLearningPath] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (courseId) {
            fetchLearningPath();
        }
    }, [courseId]);

    const fetchLearningPath = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/ai/personalization?courseId=${courseId}`);
            const data = await response.json();

            if (response.ok && data.path) {
                setLearningPath(data.path);
            } else {
                // No path exists yet
                setLearningPath(null);
            }
        } catch (err) {
            console.error('Error fetching learning path:', err);
            setError('Failed to load your learning path');
        } finally {
            setLoading(false);
        }
    };

    const generateLearningPath = async () => {
        try {
            setGenerating(true);
            const response = await fetch('/api/ai/personalization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    gradeLevel
                }),
            });

            const data = await response.json();

            if (response.ok && data.path) {
                setLearningPath(data.path);
            } else {
                setError(data.error || 'Failed to generate learning path');
            }
        } catch (err) {
            console.error('Error generating learning path:', err);
            setError('Failed to generate your learning path');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <Card
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress size={36} />
                    <Typography variant="body2" color="text.secondary">
                        Loading your learning path...
                    </Typography>
                </Stack>
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%'
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Personalized Learning Path
                    </Typography>
                    <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <SvgIcon name="tabler-alert-triangle" size={36} color={theme.palette.warning.main} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            {error}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={fetchLearningPath}
                        >
                            Try Again
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (!learningPath) {
        return (
            <Card
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%'
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Personalized Learning Path
                    </Typography>
                    <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <SvgIcon name="tabler-bulb" size={48} color="#FFC107" />
                        <Typography variant="body1" sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
                            No learning path available yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                            Generate a personalized learning path based on your progress and performance
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateLearningPath}
                            disabled={generating}
                            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <SvgIcon name="tabler-sparkles" />}
                        >
                            {generating ? 'Generating...' : 'Generate Learning Path'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Learning path data is available
    const pathData = learningPath.path_data;

    return (
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
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Your Learning Path
                        </Typography>
                        <Chip 
                            label="AI Generated" 
                            size="small" 
                            icon={<SvgIcon name="tabler-sparkles" size={14} />} 
                            sx={{ 
                                bgcolor: theme.palette.primary.lighter, 
                                color: theme.palette.primary.main,
                                '.MuiChip-icon': { color: theme.palette.primary.main }
                            }} 
                        />
                    </Box>

                    {/* Recommended sequence */}
                    {pathData.recommendedSequence && pathData.recommendedSequence.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Recommended Learning Sequence
                            </Typography>
                            <Stack spacing={1}>
                                {pathData.recommendedSequence.slice(0, 3).map((lesson, index) => (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: index === 0 ? 'primary.lighter' : 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Box 
                                            sx={{ 
                                                width: 24, 
                                                height: 24, 
                                                borderRadius: '50%', 
                                                bgcolor: index === 0 ? 'primary.main' : 'action.disabled',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 1.5,
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Typography 
                                            variant="body2"
                                            sx={{ 
                                                fontWeight: index === 0 ? 'medium' : 'normal',
                                                color: index === 0 ? 'text.primary' : 'text.secondary'
                                            }}
                                        >
                                            {lesson}
                                        </Typography>
                                    </Box>
                                ))}
                                {pathData.recommendedSequence.length > 3 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                                        +{pathData.recommendedSequence.length - 3} more steps
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    )}

                    <Divider />

                    {/* Focus areas */}
                    {pathData.focusAreas && pathData.focusAreas.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Areas to Focus On
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {pathData.focusAreas.map((area, index) => (
                                    <Chip
                                        key={index}
                                        label={area}
                                        size="small"
                                        sx={{ 
                                            bgcolor: theme.palette.warning.lighter,
                                            color: theme.palette.warning.dark,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Learning tips */}
                    {pathData.learningTips && pathData.learningTips.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Learning Tips
                            </Typography>
                            <List dense disablePadding>
                                {pathData.learningTips.slice(0, 2).map((tip, index) => (
                                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                            <SvgIcon name="tabler-bulb" size={16} color={theme.palette.info.main} />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={tip} 
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Est. completion: {pathData.estimatedCompletionTime || '~'} hours
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            endIcon={<SvgIcon name="tabler-chevron-right" size={16} />}
                            onClick={() => router.push(`/courses/${courseId}/learning-path`)}
                        >
                            View Full Path
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
} 