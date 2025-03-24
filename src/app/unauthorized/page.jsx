'use client';

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

// @mui
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Stack
} from '@mui/material';

// @project
import SvgIcon from '@/components/SvgIcon';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
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
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    borderRadius: 3,
                                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                                    <Image
                                        src="/assets/images/logo.png"
                                        alt="Skutopia Logo"
                                        width={180}
                                        height={60}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        bgcolor: 'error.lighter',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <SvgIcon name="tabler-lock" size={50} color="error.main" />
                                </Box>

                                <Typography variant="h3" component="h1" gutterBottom>
                                    Access Denied
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                                </Typography>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                    <Button
                                        component={NextLink}
                                        href="/dashboard"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<SvgIcon name="tabler-dashboard" size={20} />}
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            boxShadow: '0 8px 16px rgba(33, 150, 243, 0.2)',
                                            '&:hover': {
                                                boxShadow: '0 12px 20px rgba(33, 150, 243, 0.3)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                    >
                                        Go to Dashboard
                                    </Button>

                                    <Button
                                        component={NextLink}
                                        href="/"
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        startIcon={<SvgIcon name="tabler-home" size={20} />}
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            borderRadius: 2,
                                            fontWeight: 600
                                        }}
                                    >
                                        Back to Home
                                    </Button>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 