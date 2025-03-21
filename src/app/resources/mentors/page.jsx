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
    Divider,
    Rating,
    Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SubjectIcon from '@mui/icons-material/Subject';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const mentors = [
    {
        name: 'Dr. Mulenga Banda',
        title: 'Mathematics & Physics Expert',
        subjects: ['Mathematics', 'Physics'],
        location: 'Lusaka',
        experience: '15 years',
        rating: 4.9,
        reviews: 128,
        availability: 'Weekdays & Weekends',
        image: '/assets/images/mentors/mentor1.jpg',
        bio: 'Former lecturer at UNZA with extensive experience in preparing students for university entrance exams.',
        achievements: ['Best Teacher Award 2022', 'PhD in Mathematics Education']
    },
    {
        name: 'Ms. Thandiwe Phiri',
        title: 'English & Literature Specialist',
        subjects: ['English', 'Literature'],
        location: 'Kitwe',
        experience: '10 years',
        rating: 4.8,
        reviews: 95,
        availability: 'Weekday Evenings',
        image: '/assets/images/mentors/mentor2.jpg',
        bio: 'Passionate about helping students master English language and literature. Cambridge certified teacher.',
        achievements: ['Published Author', 'Language Teaching Excellence Award']
    },
    {
        name: 'Mr. John Mutale',
        title: 'Chemistry & Biology Expert',
        subjects: ['Chemistry', 'Biology'],
        location: 'Ndola',
        experience: '12 years',
        rating: 4.7,
        reviews: 112,
        availability: 'Flexible Hours',
        image: '/assets/images/mentors/mentor3.jpg',
        bio: 'Specializes in practical science education with hands-on experiments and real-world applications.',
        achievements: ['Science Education Innovation Award', 'Master\'s in Chemistry']
    },
    {
        name: 'Mrs. Grace Tembo',
        title: 'Business Studies & Economics Mentor',
        subjects: ['Business Studies', 'Economics'],
        location: 'Livingstone',
        experience: '8 years',
        rating: 4.9,
        reviews: 87,
        availability: 'Weekends Only',
        image: '/assets/images/mentors/mentor4.jpg',
        bio: 'Former bank executive turned educator, bringing real-world business experience to teaching.',
        achievements: ['Entrepreneurship Mentor of the Year', 'MBA']
    }
];

const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Literature', 'Business Studies', 'Economics'];
const locations = ['All Locations', 'Lusaka', 'Kitwe', 'Ndola', 'Livingstone'];

export default function MentorsPage() {
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMentors = mentors.filter(mentor => {
        const matchesSubject = selectedSubject === 'All Subjects' || mentor.subjects.includes(selectedSubject);
        const matchesLocation = selectedLocation === 'All Locations' || mentor.location === selectedLocation;
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesLocation && matchesSearch;
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
                            FIND A MENTOR
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
                            Connect with Expert Mentors
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
                            Get personalized guidance from experienced Zambian educators.
                            Our mentors are here to help you succeed in your academic journey.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search mentors..."
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
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <SubjectIcon color="primary" />
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon color="primary" />
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {locations.map((location) => (
                                            <Chip
                                                key={location}
                                                label={location}
                                                onClick={() => setSelectedLocation(location)}
                                                color={selectedLocation === location ? 'primary' : 'default'}
                                                sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                                            />
                                        ))}
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={4}>
                        {filteredMentors.map((mentor, index) => (
                            <Grid item xs={12} md={6} key={mentor.name}>
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
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={4}>
                                                    <Avatar
                                                        src={mentor.image}
                                                        alt={mentor.name}
                                                        sx={{
                                                            width: 120,
                                                            height: 120,
                                                            mx: 'auto',
                                                            mb: 2
                                                        }}
                                                    />
                                                    <Stack spacing={1} alignItems="center">
                                                        <Rating
                                                            value={mentor.rating}
                                                            readOnly
                                                            precision={0.1}
                                                            size="small"
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {mentor.rating} ({mentor.reviews} reviews)
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} sm={8}>
                                                    <Typography variant="h5" gutterBottom>
                                                        {mentor.name}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                                        {mentor.title}
                                                    </Typography>
                                                    <Typography variant="body2" paragraph>
                                                        {mentor.bio}
                                                    </Typography>

                                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <SchoolIcon color="primary" sx={{ mr: 1 }} />
                                                            <Typography variant="body2">
                                                                {mentor.experience}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                                                            <Typography variant="body2">
                                                                {mentor.location}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                                            <Typography variant="body2">
                                                                {mentor.availability}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Box sx={{ mb: 2 }}>
                                                        {mentor.subjects.map((subject) => (
                                                            <Chip
                                                                key={subject}
                                                                label={subject}
                                                                size="small"
                                                                sx={{ mr: 1, mb: 1 }}
                                                            />
                                                        ))}
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Schedule Session
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