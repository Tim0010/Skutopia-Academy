'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    Divider,
    LinearProgress,
    Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';

const practiceTests = [
    {
        title: 'Grade 12 Mathematics Mock Exam',
        subject: 'Mathematics',
        duration: '3 hours',
        questions: 50,
        difficulty: 'Advanced',
        completions: 1234,
        avgScore: 76,
        topics: ['Calculus', 'Algebra', 'Trigonometry'],
        image: '📐'
    },
    {
        title: 'Biology Final Prep Test',
        subject: 'Science',
        duration: '2 hours',
        questions: 40,
        difficulty: 'Intermediate',
        completions: 987,
        avgScore: 82,
        topics: ['Genetics', 'Ecology', 'Cell Biology'],
        image: '🧬'
    },
    {
        title: 'English Language Assessment',
        subject: 'English',
        duration: '2.5 hours',
        questions: 45,
        difficulty: 'Intermediate',
        completions: 1567,
        avgScore: 79,
        topics: ['Grammar', 'Comprehension', 'Essay Writing'],
        image: '📚'
    },
    {
        title: 'Chemistry Practice Exam',
        subject: 'Science',
        duration: '3 hours',
        questions: 55,
        difficulty: 'Advanced',
        completions: 856,
        avgScore: 71,
        topics: ['Organic Chemistry', 'Chemical Reactions', 'Atomic Structure'],
        image: '⚗️'
    }
];

const difficultyColors = {
    'Beginner': 'success',
    'Intermediate': 'warning',
    'Advanced': 'error'
};

export default function PracticeTestsPage() {
    const [selectedSubject, setSelectedSubject] = useState('all');

    const filteredTests = practiceTests.filter(test => 
        selectedSubject === 'all' || test.subject === selectedSubject
    );

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
                            PRACTICE TESTS
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
                            Test Your Knowledge
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
                            Prepare for your exams with our comprehensive practice tests aligned with
                            the Zambian curriculum. Track your progress and identify areas for improvement.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <Chip
                                label="All Subjects"
                                onClick={() => setSelectedSubject('all')}
                                color={selectedSubject === 'all' ? 'primary' : 'default'}
                                sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                            />
                            {Array.from(new Set(practiceTests.map(test => test.subject))).map((subject) => (
                                <Chip
                                    key={subject}
                                    label={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                    color={selectedSubject === subject ? 'primary' : 'default'}
                                    sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Grid container spacing={4}>
                        {filteredTests.map((test, index) => (
                            <Grid item xs={12} md={6} key={test.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        elevation={2}
                                        sx={{
                                            height: '100%',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-8px)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={3}>
                                                    <Avatar
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            fontSize: '2rem',
                                                            bgcolor: 'primary.light'
                                                        }}
                                                    >
                                                        {test.image}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs={12} sm={9}>
                                                    <Typography variant="h5" gutterBottom>
                                                        {test.title}
                                                    </Typography>
                                                    
                                                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                        <Chip
                                                            size="small"
                                                            icon={<TimerIcon />}
                                                            label={test.duration}
                                                        />
                                                        <Chip
                                                            size="small"
                                                            icon={<QuestionAnswerIcon />}
                                                            label={`${test.questions} Questions`}
                                                        />
                                                        <Chip
                                                            size="small"
                                                            icon={<StarIcon />}
                                                            label={test.difficulty}
                                                            color={difficultyColors[test.difficulty]}
                                                        />
                                                    </Stack>

                                                    <Box sx={{ mb: 2 }}>
                                                        {test.topics.map((topic) => (
                                                            <Chip
                                                                key={topic}
                                                                label={topic}
                                                                size="small"
                                                                sx={{ mr: 1, mb: 1 }}
                                                            />
                                                        ))}
                                                    </Box>

                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Average Score
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={test.avgScore}
                                                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                                            />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {test.avgScore}%
                                                            </Typography>
                                                        </Stack>
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<AssignmentIcon />}
                                                        fullWidth
                                                    >
                                                        Start Test
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