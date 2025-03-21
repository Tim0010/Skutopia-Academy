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
    TextField,
    InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const scholarships = [
    {
        title: 'Zambian Excellence Scholarship',
        provider: 'Ministry of Education',
        amount: 'Full Tuition',
        deadline: 'March 15, 2024',
        location: 'All Provinces',
        requirements: [
            'Minimum Grade 12 score of 85%',
            'Zambian citizen',
            'Under 25 years old'
        ],
        description: 'Full scholarship for outstanding Zambian students pursuing higher education in STEM fields.',
        category: 'Government',
        status: 'Open'
    },
    {
        title: 'Future Leaders Program',
        provider: 'Bank of Zambia',
        amount: 'K50,000 per year',
        deadline: 'April 30, 2024',
        location: 'Lusaka',
        requirements: [
            'Strong academic record',
            'Leadership experience',
            'Business or Economics focus'
        ],
        description: 'Scholarship program for aspiring business and economics students with leadership potential.',
        category: 'Corporate',
        status: 'Open'
    },
    {
        title: 'Digital Skills Scholarship',
        provider: 'Tech Foundation Zambia',
        amount: 'K35,000 per year',
        deadline: 'May 20, 2024',
        location: 'Multiple Locations',
        requirements: [
            'Interest in technology',
            'Basic programming knowledge',
            'Grade 12 completion'
        ],
        description: 'Supporting students pursuing careers in technology and digital innovation.',
        category: 'Private',
        status: 'Open'
    },
    {
        title: 'Rural Education Initiative',
        provider: 'Education Trust Fund',
        amount: 'K25,000 per year',
        deadline: 'June 1, 2024',
        location: 'Rural Provinces',
        requirements: [
            'Rural background',
            'Financial need',
            'Community involvement'
        ],
        description: 'Supporting talented students from rural areas to access quality education.',
        category: 'NGO',
        status: 'Coming Soon'
    }
];

const categories = ['All', 'Government', 'Corporate', 'Private', 'NGO'];

export default function ScholarshipsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredScholarships = scholarships.filter(scholarship => {
        const matchesCategory = selectedCategory === 'All' || scholarship.category === selectedCategory;
        const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
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
                            SCHOLARSHIP OPPORTUNITIES
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
                            Fund Your Education
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
                            Discover scholarship opportunities available for Zambian students.
                            Find financial support to help you achieve your educational goals.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search scholarships..."
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
                                <Stack direction="row" spacing={1} justifyContent="flex-start">
                                    {categories.map((category) => (
                                        <Chip
                                            key={category}
                                            label={category}
                                            onClick={() => setSelectedCategory(category)}
                                            color={selectedCategory === category ? 'primary' : 'default'}
                                            sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={4}>
                        {filteredScholarships.map((scholarship, index) => (
                            <Grid item xs={12} md={6} key={scholarship.title}>
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
                                            <Box sx={{ mb: 2 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h5" gutterBottom>
                                                        {scholarship.title}
                                                    </Typography>
                                                    <Chip
                                                        label={scholarship.status}
                                                        color={scholarship.status === 'Open' ? 'success' : 'warning'}
                                                        size="small"
                                                    />
                                                </Stack>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {scholarship.provider}
                                                </Typography>
                                            </Box>

                                            <Typography variant="body2" paragraph>
                                                {scholarship.description}
                                            </Typography>

                                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        {scholarship.amount}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        {scholarship.deadline}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        {scholarship.location}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Typography variant="subtitle2" gutterBottom>
                                                Requirements:
                                            </Typography>
                                            <Box sx={{ mb: 3 }}>
                                                {scholarship.requirements.map((req, index) => (
                                                    <Typography
                                                        key={index}
                                                        variant="body2"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        • {req}
                                                    </Typography>
                                                ))}
                                            </Box>

                                            <Button
                                                variant="contained"
                                                startIcon={<SchoolIcon />}
                                                fullWidth
                                            >
                                                Apply Now
                                            </Button>
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