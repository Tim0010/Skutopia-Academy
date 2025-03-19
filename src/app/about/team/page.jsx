'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: 'Dr. Sarah Johnson',
        role: 'Founder & CEO',
        bio: 'Former Harvard professor with 15+ years in education technology.',
        image: '/assets/images/mentors/sarah.jpg'
    },
    {
        name: 'Michael Chen',
        role: 'Head of Technology',
        bio: 'Tech innovator with expertise in AI and educational platforms.',
        image: '/assets/images/mentors/michael.jpg'
    },
    {
        name: 'Dr. Priya Patel',
        role: 'Head of Content',
        bio: 'Curriculum specialist with a passion for making education accessible.',
        image: '/assets/images/mentors/priya.jpg'
    },
    {
        name: 'James Wilson',
        role: 'Head of Operations',
        bio: 'Operations expert focused on scaling educational initiatives.',
        image: '/assets/images/mentors/james.jpg'
    }
];

const TeamPage = () => {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 'bold' }}
                    >
                        Our Team
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        color="text.secondary"
                        paragraph
                        sx={{ mb: 8 }}
                    >
                        Meet the passionate individuals behind Skutopia Academy
                    </Typography>

                    <Grid container spacing={4}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={member.name}>
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
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={member.image}
                                            alt={member.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                                {member.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="primary" gutterBottom>
                                                {member.role}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {member.bio}
                                            </Typography>
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
};

export default TeamPage; 