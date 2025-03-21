'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Stack, Divider, Button, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import dynamic from 'next/dynamic';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MainLayout = dynamic(() => import('@/views/landings/default/layout'));
const ScrollFab = dynamic(() => import('@/components/ScrollFab'));

const journeySteps = [
    {
        year: '2020',
        title: 'The Beginning',
        description: 'Skutopia was founded with a vision to transform education in Zambia. We started with just 50 students and a handful of passionate mentors.',
        icon: <SchoolIcon sx={{ fontSize: 30, color: 'primary.main' }} />
    },
    {
        year: '2021',
        title: 'Expanding Horizons',
        description: 'Our first cohort of students achieved remarkable results, with 90% securing university placements. We expanded our programs to include STEM education.',
        icon: <EmojiEventsIcon sx={{ fontSize: 30, color: 'primary.main' }} />
    },
    {
        year: '2022',
        title: 'Building Partnerships',
        description: 'We partnered with leading universities in Zambia and abroad, creating pathways for our students to access world-class education.',
        icon: <PublicIcon sx={{ fontSize: 30, color: 'primary.main' }} />
    },
    {
        year: '2023',
        title: 'Innovation & Growth',
        description: 'Launched our digital learning platform and mentorship program, reaching students across all provinces of Zambia.',
        icon: <GroupsIcon sx={{ fontSize: 30, color: 'primary.main' }} />
    }
];

const successStories = [
    {
        name: 'Chanda Mwale',
        image: '/assets/images/students/chanda.jpg',
        university: 'University of Zambia',
        program: 'Computer Science',
        story: 'Through Skutopia\'s mentorship program and practice tests, I improved my grade 12 results significantly. The personalized guidance helped me secure a place at UNZA.',
        achievement: 'Scored 6 points in grade 12',
        journey: [
            'Started with basic computer skills',
            'Excelled in mathematics through personalized tutoring',
            'Secured admission to UNZA Computer Science program'
        ]
    },
    {
        name: 'Natasha Banda',
        image: '/assets/images/students/natasha.jpg',
        university: 'University of Cape Town',
        program: 'Engineering',
        story: 'Skutopia\'s STEM curriculum and international university preparation program helped me achieve my dream of studying abroad. The scholarship guidance was invaluable.',
        achievement: 'Received UCT Merit Scholarship',
        journey: [
            'Joined STEM program',
            'Won regional science competition',
            'Secured UCT scholarship'
        ]
    },
    {
        name: 'Mulenga Kapwepwe',
        image: '/assets/images/students/mulenga.jpg',
        university: 'University of Oxford',
        program: 'Mathematics',
        story: 'The advanced mathematics resources and one-on-one mentoring at Skutopia prepared me for the rigorous Oxford entrance exams. I\'m now pursuing my passion for pure mathematics.',
        achievement: 'Oxford Rhodes Scholar',
        journey: [
            'Started advanced mathematics program',
            'Won national mathematics olympiad',
            'Secured Rhodes scholarship'
        ]
    }
];

const impactStats = [
    {
        icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        number: '500+',
        label: 'Students Enrolled'
    },
    {
        icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        number: '95%',
        label: 'Success Rate'
    },
    {
        icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        number: '50+',
        label: 'Expert Mentors'
    },
    {
        icon: <PublicIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        number: '15+',
        label: 'Partner Universities'
    }
];

const journeyMap = [
    {
        location: 'Lusaka',
        title: 'Our First Center',
        description: 'Started with a small center in Lusaka, serving 50 students',
        icon: <LocationOnIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
        coordinates: { x: 48, y: 68 }
    },
    {
        location: 'Copperbelt',
        title: 'Regional Expansion',
        description: 'Opened centers in Kitwe and Ndola, reaching 200+ students',
        icon: <MapIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
        coordinates: { x: 42, y: 32 }
    },
    {
        location: 'Southern Province',
        title: 'Digital Transformation',
        description: 'Launched online learning platform, reaching students nationwide',
        icon: <TrendingUpIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
        coordinates: { x: 48, y: 82 }
    },
    {
        location: 'Eastern Province',
        title: 'Innovation Hub',
        description: 'Established STEM innovation center in Chipata',
        icon: <LightbulbIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
        coordinates: { x: 70, y: 55 }
    }
];

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const OurStoryPage = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedStory, setSelectedStory] = React.useState(null);
    const [activeLocation, setActiveLocation] = React.useState(null);

    const handleStepClick = (step) => {
        setActiveStep(step);
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
    };

    const handleLocationClick = (location) => {
        setActiveLocation(location);
    };

    return (
        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hero Section */}
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography 
                            variant="overline" 
                            component="div" 
                            sx={{ 
                                color: 'primary.main', 
                                fontWeight: 600, 
                                letterSpacing: 1.2, 
                                mb: 2 
                            }}
                        >
                            OUR JOURNEY
                        </Typography>
                        
                        <Typography
                            variant="h2"
                            component="h1"
                            align="center"
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
                            Transforming Lives Through Education
                        </Typography>

                        <Divider sx={{ width: '80px', mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />

                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            paragraph
                            sx={{ 
                                mb: 5, 
                                maxWidth: '800px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1.1rem'
                            }}
                        >
                            Join us on a journey of educational transformation. From humble beginnings to becoming 
                            Zambia's leading educational platform, we're committed to empowering the next generation 
                            of leaders and innovators.
                        </Typography>
                    </Box>

                    {/* Journey Map Section */}
                    <Box sx={{ mb: 10 }}>
                        <Typography
                            variant="h3"
                            align="center"
                            gutterBottom
                            sx={{ 
                                mb: 5, 
                                fontWeight: 700,
                                color: 'text.primary'
                            }}
                        >
                            Our Impact Across Zambia
                        </Typography>

                        <MapContainer center={[-13.1339, 27.8493]} zoom={6} style={{ height: '500px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {journeyMap.map((location) => (
                                <Marker key={location.location} position={[location.coordinates.y, location.coordinates.x]}>
                                    <Popup>
                                        <Typography variant="h6">{location.title}</Typography>
                                        <Typography variant="body2">{location.description}</Typography>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Box>

                    {/* Journey Timeline */}
                    <Box sx={{ mb: 10 }}>
                        <Typography
                            variant="h3"
                            align="center"
                            gutterBottom
                            sx={{ 
                                mb: 5, 
                                fontWeight: 700,
                                color: 'text.primary'
                            }}
                        >
                            Our Journey
                        </Typography>

                        <Timeline position="alternate">
                            {journeySteps.map((step, index) => (
                                <TimelineItem key={step.year}>
                                    <TimelineSeparator>
                                        <TimelineDot color="primary">
                                            {step.icon}
                                        </TimelineDot>
                                        {index < journeySteps.length - 1 && <TimelineConnector />}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <motion.div
                                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Paper 
                                                elevation={3} 
                                                sx={{ 
                                                    p: 3, 
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                                onClick={() => handleStepClick(index)}
                                            >
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    {step.year}
                                                </Typography>
                                                <Typography variant="h5" gutterBottom>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {step.description}
                                                </Typography>
                                            </Paper>
                                        </motion.div>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Box>

                    {/* Enhanced Impact Stats */}
                    <Grid container spacing={4} sx={{ mb: 10 }}>
                        {impactStats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            textAlign: 'center', 
                                            p: 3,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: 'linear-gradient(90deg, #0062cc, #1976d2)',
                                            }
                                        }}
                                    >
                                        {stat.icon}
                                        <Typography 
                                            variant="h3" 
                                            sx={{ 
                                                my: 2, 
                                                fontWeight: 700, 
                                                color: 'primary.main',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Success Stories */}
                    <Box sx={{ mb: 10 }}>
                        <Typography
                            variant="h3"
                            align="center"
                            gutterBottom
                            sx={{ 
                                mb: 5, 
                                fontWeight: 700,
                                color: 'text.primary'
                            }}
                        >
                            Student Success Stories
                        </Typography>

                        <Grid container spacing={4}>
                            {successStories.map((story, index) => (
                                <Grid item xs={12} md={4} key={story.name}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                            onClick={() => handleStoryClick(story)}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={story.image}
                                                alt={story.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                                    {story.name}
                                                </Typography>
                                                <Typography variant="subtitle1" color="primary.main" gutterBottom>
                                                    {story.university}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {story.program}
                                                </Typography>
                                                <Typography variant="body2" paragraph>
                                                    {story.story}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block',
                                                        color: 'primary.main',
                                                        fontWeight: 600,
                                                        mb: 2
                                                    }}
                                                >
                                                    {story.achievement}
                                                </Typography>
                                                <Button 
                                                    variant="outlined" 
                                                    color="primary"
                                                    fullWidth
                                                    sx={{ mt: 'auto' }}
                                                >
                                                    View Journey
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Story Journey Modal */}
                    <AnimatePresence>
                        {selectedStory && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                }}
                                onClick={() => setSelectedStory(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '2rem',
                                        borderRadius: '1rem',
                                        maxWidth: '600px',
                                        width: '90%',
                                        maxHeight: '90vh',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Typography variant="h4" gutterBottom>
                                        {selectedStory.name}'s Journey
                                    </Typography>
                                    <Stepper activeStep={-1} orientation="vertical">
                                        {selectedStory.journey.map((step, index) => (
                                            <Step key={index}>
                                                <StepLabel>
                                                    <Typography variant="body1">{step}</Typography>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => setSelectedStory(null)}
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Location Modal */}
                    <AnimatePresence>
                        {activeLocation && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                }}
                                onClick={() => setActiveLocation(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '2rem',
                                        borderRadius: '1rem',
                                        maxWidth: '600px',
                                        width: '90%',
                                        maxHeight: '90vh',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        {activeLocation.icon}
                                        <Typography variant="h4" sx={{ ml: 2 }}>
                                            {activeLocation.location}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        {activeLocation.title}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {activeLocation.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => setActiveLocation(null)}
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Call to Action */}
                    <Box 
                        sx={{ 
                            textAlign: 'center',
                            p: 6,
                            borderRadius: 4,
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                            Be Part of Our Success Story
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Join Skutopia today and start your journey towards academic excellence
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button 
                                variant="contained" 
                                color="secondary"
                                size="large"
                                sx={{ 
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                    },
                                }}
                            >
                                Get Started
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="inherit"
                                size="large"
                            >
                                Learn More
                            </Button>
                        </Stack>
                    </Box>
                </motion.div>
            </Container>
            <ScrollFab />
        </Box>
    );
};

export default OurStoryPage; 