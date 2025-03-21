'use client';

import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
    Stack,
    Divider,
    Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';

const learningPaths = [
    {
        title: 'Mathematics Excellence',
        description: 'Master advanced mathematics concepts with our structured learning path.',
        duration: '12 weeks',
        level: 'Advanced',
        enrolled: 1234,
        progress: 0,
        image: '🎯',
        steps: [
            'Foundations of Calculus',
            'Advanced Algebra',
            'Complex Trigonometry',
            'Statistical Analysis'
        ]
    },
    {
        title: 'Science Explorer',
        description: 'Comprehensive journey through biology, chemistry, and physics.',
        duration: '16 weeks',
        level: 'Intermediate',
        enrolled: 987,
        progress: 25,
        image: '🔬',
        steps: [
            'Basic Scientific Principles',
            'Laboratory Techniques',
            'Research Methods',
            'Applied Sciences'
        ]
    },
    {
        title: 'English Mastery',
        description: 'Enhance your English language skills from grammar to advanced composition.',
        duration: '10 weeks',
        level: 'All Levels',
        enrolled: 2156,
        progress: 75,
        image: '📝',
        steps: [
            'Grammar Fundamentals',
            'Writing Skills',
            'Literature Analysis',
            'Advanced Composition'
        ]
    },
    {
        title: 'Computer Science Fundamentals',
        description: 'Learn programming and computer science basics for the digital age.',
        duration: '14 weeks',
        level: 'Beginner',
        enrolled: 1567,
        progress: 50,
        image: '💻',
        steps: [
            'Programming Basics',
            'Data Structures',
            'Algorithms',
            'Web Development'
        ]
    }
];

export default function LearningPathsPage() {
    return (
        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                letterSpacing: 1.2,
                                mb: 2,
                                display: 'block'
                            }}
                        >
                            LEARNING PATHS
                        </Typography>

                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #0062cc, #1976d2)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                            }}
                        >
                            Your Journey to Success
                        </Typography>

                        <Divider sx={{ width: '80px', mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.8
                            }}
                        >
                            Follow our structured learning paths designed specifically for Zambian students.
                            Each path is carefully crafted to help you achieve your academic goals.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {learningPaths.map((path, index) => (
                            <Grid item xs={12} key={path.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        elevation={2}
                                        sx={{
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-8px)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={3}>
                                                    <Stack spacing={2} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                width: 100,
                                                                height: 100,
                                                                fontSize: '3rem',
                                                                bgcolor: 'primary.light'
                                                            }}
                                                        >
                                                            {path.image}
                                                        </Avatar>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h5" gutterBottom>
                                                                {path.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {path.description}
                                                            </Typography>
                                                        </Box>
                                                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <TimelineIcon color="primary" />
                                                                <Typography variant="caption" display="block">
                                                                    {path.duration}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <StarIcon color="primary" />
                                                                <Typography variant="caption" display="block">
                                                                    {path.level}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <GroupIcon color="primary" />
                                                                <Typography variant="caption" display="block">
                                                                    {path.enrolled}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Progress
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={path.progress}
                                                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {path.progress}% Complete
                                                        </Typography>
                                                    </Box>

                                                    <Stepper orientation="vertical">
                                                        {path.steps.map((step, index) => (
                                                            <Step key={step} active={index <= path.progress / 25}>
                                                                <StepLabel>
                                                                    <Typography variant="subtitle1">
                                                                        {step}
                                                                    </Typography>
                                                                </StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<SchoolIcon />}
                                                        sx={{ mt: 3 }}
                                                        fullWidth
                                                    >
                                                        {path.progress === 0 ? 'Start Learning Path' : 'Continue Learning'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
} 