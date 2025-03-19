'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        province: '',
        school: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSnackbar({
                open: true,
                message: 'Thank you for contacting Skutopia Zambia! Our team will respond to your message within 24-48 hours.',
                severity: 'success',
            });
            setFormData({ name: '', email: '', subject: '', message: '', province: '', school: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setSnackbar({
                open: true,
                message: 'Failed to send message. Please try again.',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box 
            component="main" 
            sx={{ 
                bgcolor: 'background.default',
                position: 'relative',
                minHeight: 'calc(100vh - 64px)', // Account for header height
                pt: { xs: 4, md: 8 },
                pb: { xs: 8, md: 12 },
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    opacity: 0.05,
                    backgroundImage: 'url("/assets/images/grid-pattern.svg")',
                    backgroundRepeat: 'repeat',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                        sx={{ mb: 1, fontWeight: 'bold' }}
                    >
                        Contact Us in Zambia
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
                    >
                        Have questions about our educational platform? We're here to help Zambian learners succeed.
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                                    Get in Touch
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                    We're here to support Zambian learners, educators, and parents. Whether you have questions about our educational platform, need technical assistance, or want to explore partnerships with local schools, we're ready to help.
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Province"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                select
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            >
                                                <option value=""></option>
                                                <option value="Central">Central Province</option>
                                                <option value="Copperbelt">Copperbelt Province</option>
                                                <option value="Eastern">Eastern Province</option>
                                                <option value="Luapula">Luapula Province</option>
                                                <option value="Lusaka">Lusaka Province</option>
                                                <option value="Muchinga">Muchinga Province</option>
                                                <option value="Northern">Northern Province</option>
                                                <option value="North-Western">North-Western Province</option>
                                                <option value="Southern">Southern Province</option>
                                                <option value="Western">Western Province</option>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="School Name (if applicable)"
                                                name="school"
                                                value={formData.school}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                sx={{ py: 1.5 }}
                                            >
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                                    Contact Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>zambia@skutopia.com</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>+260 97X XXX XXX</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>
                                                Skutopia Education Center<br />
                                                Cairo Road, Central Business District<br />
                                                Lusaka, Zambia
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
                                            Office Hours:<br />
                                            Monday - Friday: 8:00 AM - 5:00 PM CAT<br />
                                            Saturday: 9:00 AM - 1:00 PM CAT
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Paper 
                                            elevation={0} 
                                            sx={{ 
                                                mt: 3, 
                                                p: 3, 
                                                bgcolor: 'primary.lighter',
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'primary.light'
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.dark', fontWeight: 600 }}>
                                                Quick Response Guarantee
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                We aim to respond to all inquiries within 24-48 hours. For urgent matters, please call our support line during office hours.
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContactPage; 