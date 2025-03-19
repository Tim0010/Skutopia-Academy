'use client';

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const MissionPage = () => {
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
                        Our Mission
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Empowering Education
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    At Skutopia Academy, we believe in making quality education accessible to everyone.
                                    Our mission is to empower students with the knowledge and skills they need to succeed
                                    in an ever-evolving world.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    We combine cutting-edge technology with proven educational methods to create an
                                    engaging and effective learning experience for all our students.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Our Vision
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    We envision a world where education is personalized, engaging, and accessible to all.
                                    Through our platform, we're building a community of learners who support and inspire
                                    each other to reach their full potential.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Our commitment to excellence and innovation drives us to continuously improve and
                                    expand our educational offerings.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    mt: 4,
                                }}
                            >
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Our Values
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Excellence
                                        </Typography>
                                        <Typography variant="body1">
                                            We strive for excellence in everything we do, from content quality to user experience.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Innovation
                                        </Typography>
                                        <Typography variant="body1">
                                            We embrace new technologies and methods to enhance learning outcomes.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Community
                                        </Typography>
                                        <Typography variant="body1">
                                            We foster a supportive learning community where everyone can thrive.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MissionPage; 