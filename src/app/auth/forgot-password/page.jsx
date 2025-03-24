'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

// @mui
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';

// @project
import { useAuth } from '@/contexts/AuthContext';
import SvgIcon from '@/components/SvgIcon';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const { resetPassword, error } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccess(false);

        if (!email) {
            setFormError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email);
            setSuccess(true);
        } catch (error) {
            console.error('Reset password error:', error);
            setFormError(error.message || 'Failed to send reset password email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                bgcolor: 'background.neutral'
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    borderRadius: 3,
                                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                                        <Image
                                            src="/assets/images/logo.png"
                                            alt="Skutopia Logo"
                                            width={180}
                                            height={60}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Box>

                                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                                        Forgot Password
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                                        Enter your email address and we'll send you a link to reset your password
                                    </Typography>

                                    {success && (
                                        <Alert severity="success" sx={{ mb: 3 }}>
                                            Password reset link has been sent to your email address
                                        </Alert>
                                    )}

                                    {(formError || error) && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {formError || error}
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SvgIcon name="tabler-mail" size={20} color="text.secondary" />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                disabled={loading}
                                                sx={{
                                                    py: 1.5,
                                                    mt: 2,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    position: 'relative',
                                                    boxShadow: '0 8px 16px rgba(33, 150, 243, 0.2)',
                                                    '&:hover': {
                                                        boxShadow: '0 12px 20px rgba(33, 150, 243, 0.3)',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    'Send Reset Link'
                                                )}
                                            </Button>
                                        </Stack>
                                    </form>

                                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Remember your password?{' '}
                                            <Link
                                                component={NextLink}
                                                href="/auth/login"
                                                variant="subtitle2"
                                                color="primary"
                                                underline="hover"
                                            >
                                                Back to Sign In
                                            </Link>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 