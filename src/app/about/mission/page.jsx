'use client';

import { Box, Container, Typography, Grid, Paper, Divider, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const MissionPage = () => {
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
                            OUR COMMITMENT TO ZAMBIA
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
                            Empowering Zambian Youth Through Education
                        </Typography>

                        <Divider sx={{ width: '80px', mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />

                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            paragraph
                            sx={{ 
                                mb: 8, 
                                maxWidth: '800px', 
                                mx: 'auto', 
                                lineHeight: 1.8,
                                fontSize: '1.1rem'
                            }}
                        >
                            At Skutopia Academy, we're dedicated to transforming education in Zambia through 
                            innovative learning solutions. Our platform bridges the digital divide, making quality 
                            education accessible to students across all provinces, from urban centers to rural communities.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 100,
                                            height: 100,
                                            background: 'linear-gradient(45deg, transparent 50%, rgba(25, 118, 210, 0.1) 50%)',
                                        }}
                                    />
                                    
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                        <AutoGraphIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            Our Mission
                                        </Typography>
                                    </Stack>

                                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                                        We are committed to empowering Zambian students with the knowledge and skills needed 
                                        to excel in both local and global contexts. Our platform is designed to complement 
                                        the Zambian curriculum while incorporating international best practices in education.
                                    </Typography>

                                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                                        Through partnerships with local schools, educators, and communities, we provide 
                                        personalized learning experiences that respect Zambian culture and values while 
                                        preparing students for the opportunities of tomorrow.
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 100,
                                            height: 100,
                                            background: 'linear-gradient(45deg, transparent 50%, rgba(25, 118, 210, 0.1) 50%)',
                                        }}
                                    />
                                    
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                        <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            Our Vision
                                        </Typography>
                                    </Stack>

                                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                                        We envision a Zambia where every student, regardless of their location or 
                                        economic background, has access to quality education. Our platform serves as 
                                        a bridge between traditional learning methods and modern digital opportunities.
                                    </Typography>

                                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                                        By 2030, we aim to contribute significantly to Zambia's educational landscape, 
                                        helping create a generation of innovative thinkers and leaders who will drive 
                                        the nation's development and prosperity.
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 8 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 6,
                                    borderRadius: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: 200,
                                        height: 200,
                                        background: 'linear-gradient(45deg, transparent 50%, rgba(25, 118, 210, 0.1) 50%)',
                                    }}
                                />

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                    <EmojiObjectsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        Our Core Values
                                    </Typography>
                                </Stack>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                        >
                                            <Stack spacing={2}>
                                                <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    Excellence
                                                </Typography>
                                                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                                    We uphold the highest standards in educational content, aligning with 
                                                    both Zambian educational requirements and international benchmarks to 
                                                    ensure our students receive world-class education.
                                                </Typography>
                                            </Stack>
                                        </motion.div>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                            <Stack spacing={2}>
                                                <PsychologyIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    Innovation
                                                </Typography>
                                                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                                    We develop solutions that work for Zambian learners, combining modern 
                                                    technology with local context to create accessible, engaging, and 
                                                    effective learning experiences, even in areas with limited connectivity.
                                                </Typography>
                                            </Stack>
                                        </motion.div>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.7 }}
                                        >
                                            <Stack spacing={2}>
                                                <GroupsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    Community
                                                </Typography>
                                                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                                    We celebrate Zambian values and culture while fostering a collaborative 
                                                    learning environment. We work closely with local communities, teachers, 
                                                    and educational institutions to create lasting positive impact.
                                                </Typography>
                                            </Stack>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MissionPage; 