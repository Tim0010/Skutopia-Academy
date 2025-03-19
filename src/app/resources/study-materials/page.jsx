'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookIcon from '@mui/icons-material/Book';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';

const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Business Studies'
];

const materials = [
    {
        title: 'Advanced Mathematics - Grade 12',
        type: 'Document',
        subject: 'Mathematics',
        description: 'Comprehensive study guide covering calculus, algebra, and trigonometry aligned with the Zambian curriculum.',
        image: '/assets/images/resources/math.jpg',
        icon: <BookIcon />,
        downloads: 1234,
        rating: 4.8
    },
    {
        title: 'Biology Video Series',
        type: 'Video',
        subject: 'Science',
        description: 'Video lectures on human anatomy, cell biology, and genetics with practical examples.',
        image: '/assets/images/resources/biology.jpg',
        icon: <VideoLibraryIcon />,
        views: 5678,
        rating: 4.7
    },
    {
        title: 'English Literature Notes',
        type: 'Document',
        subject: 'English',
        description: 'Study notes covering key literary works, grammar, and composition techniques.',
        image: '/assets/images/resources/english.jpg',
        icon: <ArticleIcon />,
        downloads: 3456,
        rating: 4.6
    },
    {
        title: 'Chemistry Practice Problems',
        type: 'Quiz',
        subject: 'Science',
        description: 'Collection of practice problems for organic and inorganic chemistry with detailed solutions.',
        image: '/assets/images/resources/chemistry.jpg',
        icon: <QuizIcon />,
        attempts: 2345,
        rating: 4.9
    }
];

export default function StudyMaterialsPage() {
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMaterials = materials.filter(material => {
        const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            material.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesSearch;
    });

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
                            STUDY MATERIALS
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
                            Quality Learning Resources
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
                            Access comprehensive study materials aligned with the Zambian curriculum,
                            designed to help you excel in your academic journey.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search study materials..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FilterListIcon color="primary" />
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label="All Subjects"
                                            onClick={() => setSelectedSubject('all')}
                                            color={selectedSubject === 'all' ? 'primary' : 'default'}
                                            sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                                        />
                                        {subjects.map((subject) => (
                                            <Chip
                                                key={subject}
                                                label={subject}
                                                onClick={() => setSelectedSubject(subject)}
                                                color={selectedSubject === subject ? 'primary' : 'default'}
                                                sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                                            />
                                        ))}
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={4}>
                        {filteredMaterials.map((material, index) => (
                            <Grid item xs={12} sm={6} md={3} key={material.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        elevation={2}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-8px)'
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={material.image}
                                            alt={material.title}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                {material.icon}
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ ml: 1 }}
                                                >
                                                    {material.type}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" gutterBottom>
                                                {material.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {material.description}
                                            </Typography>
                                            <Box sx={{ mt: 'auto' }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                >
                                                    Access Material
                                                </Button>
                                            </Box>
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