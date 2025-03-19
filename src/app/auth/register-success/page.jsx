'use client';

import React, { useEffect, useState } from 'react';
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
    Grid,
    Link,
    Stack,
    Typography,
    CircularProgress
} from '@mui/material';

// @project
import SvgIcon from '@/components/SvgIcon';
import { motion } from 'framer-motion';

export default function RegisterSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Redirect when countdown reaches zero
        if (countdown === 0) {
            router.push('/auth/login');
        }
    }, [countdown, router]);

    useEffect(() => {
        // Separate timer logic from navigation
        const timer = setInterval(() => {
            setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                                    textAlign: 'center'
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

                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'success.lighter',
                                            color: 'success.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3
                                        }}
                                    >
                                        <SvgIcon name="tabler-check" size={40} />
                                    </Box>

                                    <Typography variant="h4" component="h1" gutterBottom>
                                        Registration Successful!
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                        Your account has been created successfully. Please check your email to verify your account.
                                    </Typography>

                                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={(countdown / 5) * 100}
                                            size={60}
                                            thickness={4}
                                            sx={{ color: 'primary.main' }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Typography variant="h6" component="div" color="text.primary">
                                                {countdown}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                        You will be redirected to the login page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Button
                                            component={NextLink}
                                            href="/auth/login"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                boxShadow: '0 8px 16px rgba(33, 150, 243, 0.2)',
                                                '&:hover': {
                                                    boxShadow: '0 12px 20px rgba(33, 150, 243, 0.3)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'transform 0.2s, box-shadow 0.2s'
                                            }}
                                            startIcon={<SvgIcon name="tabler-login" size={20} />}
                                        >
                                            Go to Login
                                        </Button>

                                        <Button
                                            component={NextLink}
                                            href="/"
                                            variant="outlined"
                                            color="inherit"
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'primary.lighter'
                                                }
                                            }}
                                            startIcon={<SvgIcon name="tabler-home" size={20} />}
                                        >
                                            Back to Home
                                        </Button>
                                    </Stack>

                                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Need help?{' '}
                                            <Link
                                                component={NextLink}
                                                href="/contact"
                                                variant="subtitle2"
                                                color="primary"
                                                underline="hover"
                                            >
                                                Contact Support
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