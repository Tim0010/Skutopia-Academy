'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, IconButton, Divider, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('@/views/landings/default/layout'));
const ScrollFab = dynamic(() => import('@/components/ScrollFab'));

const teamMembers = [
    {
        name: 'Dr. Sarah Johnson',
        role: 'Founder & CEO',
        bio: 'Former Harvard professor with 15+ years in education technology. Led multiple successful EdTech ventures and published extensively on digital learning innovations.',
        image: '/assets/images/mentors/sarah.jpg',
        social: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'sarah@skutopia.com'
        },
        achievements: '2x EdTech Innovator Award Winner'
    },
    {
        name: 'Michael Chen',
        role: 'Head of Technology',
        bio: 'Tech innovator with expertise in AI and educational platforms. Previously led engineering teams at Google and developed learning platforms used by millions worldwide.',
        image: '/assets/images/mentors/michael.jpg',
        social: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'michael@skutopia.com'
        },
        achievements: 'MIT Technology Review 35 Under 35'
    },
    {
        name: 'Dr. Priya Patel',
        role: 'Head of Content',
        bio: 'Curriculum specialist with a passion for making education accessible. PhD in Education from Stanford and former Director of Curriculum at Khan Academy.',
        image: '/assets/images/mentors/priya.jpg',
        social: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'priya@skutopia.com'
        },
        achievements: 'Author of "Future Learning: Education in the Digital Age"'
    },
    {
        name: 'James Wilson',
        role: 'Head of Operations',
        bio: 'Operations expert focused on scaling educational initiatives. Led operations at Coursera during their period of 300% growth, optimizing systems for 20M+ users.',
        image: '/assets/images/mentors/james.jpg',
        social: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'james@skutopia.com'
        },
        achievements: 'Forbes 30 Under 30 - Education Category'
    }
];

const TeamPage = () => {
    return (
        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                            LEADERSHIP
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
                            The Minds Behind Skutopia
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
                            Our team combines expertise from education, technology, and business to
                            create innovative learning experiences that empower students worldwide.
                            With decades of combined experience, we're committed to transforming education
                            through cutting-edge technology and research-backed methodologies.
                        </Typography>
                    </Box>

                    <Grid container spacing={5}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={member.name}>
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
                                            transition: 'all 0.3s ease',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="260"
                                                image={member.image}
                                                alt={member.name}
                                                sx={{ 
                                                    objectFit: 'cover',
                                                    filter: 'brightness(0.9)'
                                                }}
                                            />
                                            <Box 
                                                sx={{ 
                                                    position: 'absolute', 
                                                    bottom: 0, 
                                                    width: '100%',
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                                    p: 1.5,
                                                    pt: 3
                                                }}
                                            >
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'primary.light',
                                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                                        py: 0.5,
                                                        px: 1,
                                                        borderRadius: 1,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {member.achievements}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {member.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
                                                {member.role}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                                                {member.bio}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                                                <IconButton 
                                                    size="small" 
                                                    color="primary" 
                                                    aria-label="LinkedIn"
                                                    href={member.social.linkedin}
                                                    target="_blank"
                                                    sx={{ 
                                                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                                                    }}
                                                >
                                                    <LinkedInIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="info" 
                                                    aria-label="Twitter"
                                                    href={member.social.twitter}
                                                    target="_blank"
                                                    sx={{ 
                                                        '&:hover': { backgroundColor: 'rgba(29, 161, 242, 0.1)' }
                                                    }}
                                                >
                                                    <TwitterIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="error" 
                                                    aria-label="Email"
                                                    href={`mailto:${member.social.email}`}
                                                    sx={{ 
                                                        '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                                                    }}
                                                >
                                                    <EmailIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
            <ScrollFab />
        </Box>
    );
};

export default TeamPage; 