'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Image from 'next/image';

// @mui
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
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

export default function LoginPage() {
    const router = useRouter();
    const { signIn, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email || !password) {
            setFormError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await signIn(email, password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setFormError(error.message || 'Failed to sign in');
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
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    {/* Left side - Login form */}
                    <Grid item xs={12} md={6} lg={5}>
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
                                            src="/assets/images/logo.svg"
                                            alt="Skutopia Logo"
                                            width={180}
                                            height={60}
                                            priority
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Box>

                                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                                        Welcome Back
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                                        Sign in to continue your learning journey
                                    </Typography>

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

                                            <TextField
                                                fullWidth
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SvgIcon name="tabler-lock" size={20} color="text.secondary" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                <SvgIcon
                                                                    name={showPassword ? 'tabler-eye-off' : 'tabler-eye'}
                                                                    size={20}
                                                                    color="text.secondary"
                                                                />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Link
                                                    component={NextLink}
                                                    href="/auth/forgot-password"
                                                    variant="body2"
                                                    color="primary"
                                                    underline="hover"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </Box>

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
                                                    'Sign In'
                                                )}
                                            </Button>
                                        </Stack>
                                    </form>

                                    <Divider sx={{ my: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            OR
                                        </Typography>
                                    </Divider>

                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                px: 2,
                                                flex: 1,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'primary.lighter'
                                                }
                                            }}
                                            startIcon={<SvgIcon name="tabler-brand-google" size={20} />}
                                        >
                                            Google
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                px: 2,
                                                flex: 1,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'primary.lighter'
                                                }
                                            }}
                                            startIcon={<SvgIcon name="tabler-brand-facebook" size={20} />}
                                        >
                                            Facebook
                                        </Button>
                                    </Stack>

                                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Don't have an account?{' '}
                                            <Link
                                                component={NextLink}
                                                href="/auth/register"
                                                variant="subtitle2"
                                                color="primary"
                                                underline="hover"
                                            >
                                                Sign Up
                                            </Link>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Right side - Illustration */}
                    <Grid
                        item
                        md={6}
                        lg={7}
                        sx={{
                            display: { xs: 'none', md: 'block' }
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '500px'
                                    }}
                                >
                                    <Image
                                        src="/assets/images/auth/login-illustration.svg"
                                        alt="Login Illustration"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                </Box>

                                {/* Decorative elements */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '10%',
                                        right: '5%',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.lighter',
                                        opacity: 0.6
                                    }}
                                    component={motion.div}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: '15%',
                                        left: '10%',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'success.lighter',
                                        opacity: 0.6
                                    }}
                                    component={motion.div}
                                    animate={{
                                        y: [0, 10, 0],
                                        opacity: [0.6, 0.8, 0.6]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: 1
                                    }}
                                />

                                {/* Feature highlights */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: '30%',
                                        right: '15%',
                                        maxWidth: 280
                                    }}
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    <Card
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <Stack spacing={1.5}>
                                            <Typography variant="h6" color="primary.main">
                                                Why Skutopia Academy?
                                            </Typography>

                                            <Stack spacing={1}>
                                                {[
                                                    'Interactive STEM learning designed for Zambian students',
                                                    'Personalized learning paths that adapt to your progress',
                                                    'Learn offline with minimal data usage'
                                                ].map((feature, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                bgcolor: 'success.lighter',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'success.main'
                                                            }}
                                                        >
                                                            <SvgIcon name="tabler-check" size={16} />
                                                        </Box>
                                                        <Typography variant="body2">{feature}</Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </Card>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 