'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <ProtectedRoute>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    pt: 8,
                    pb: 6
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* Header */}
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper
                                    sx={{
                                        p: 4,
                                        borderRadius: 3,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        gap: 2
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h4" gutterBottom>
                                            Welcome, {user?.user_metadata?.first_name || 'User'}!
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {user?.user_metadata?.role === 'student'
                                                ? 'Continue your learning journey'
                                                : 'Manage your mentorship activities'}
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleSignOut}
                                        startIcon={<SvgIcon name="tabler-logout" size={20} />}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1,
                                            px: 2
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Stats */}
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                {[
                                    {
                                        title: 'Courses',
                                        value: '12',
                                        icon: 'tabler-book',
                                        color: '#2196F3',
                                        bgColor: 'rgba(33, 150, 243, 0.1)'
                                    },
                                    {
                                        title: 'Completed',
                                        value: '5',
                                        icon: 'tabler-check',
                                        color: '#4CAF50',
                                        bgColor: 'rgba(76, 175, 80, 0.1)'
                                    },
                                    {
                                        title: 'Hours Spent',
                                        value: '24',
                                        icon: 'tabler-clock',
                                        color: '#FF9800',
                                        bgColor: 'rgba(255, 152, 0, 0.1)'
                                    },
                                    {
                                        title: 'Achievements',
                                        value: '8',
                                        icon: 'tabler-trophy',
                                        color: '#9C27B0',
                                        bgColor: 'rgba(156, 39, 176, 0.1)'
                                    }
                                ].map((stat, index) => (
                                    <Grid item xs={6} md={3} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                    height: '100%',
                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: stat.bgColor,
                                                                color: stat.color
                                                            }}
                                                        >
                                                            <SvgIcon name={stat.icon} size={24} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h4" fontWeight="bold">
                                                                {stat.value}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {stat.title}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Recent Activity */}
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Paper
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        height: '100%'
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Recent Activity
                                    </Typography>

                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        {[
                                            {
                                                title: 'Completed Algebra Quiz',
                                                time: '2 hours ago',
                                                icon: 'tabler-writing',
                                                color: '#2196F3'
                                            },
                                            {
                                                title: 'Watched Physics Video Lesson',
                                                time: 'Yesterday',
                                                icon: 'tabler-video',
                                                color: '#FF9800'
                                            },
                                            {
                                                title: 'Joined Chemistry Study Group',
                                                time: '2 days ago',
                                                icon: 'tabler-users',
                                                color: '#4CAF50'
                                            },
                                            {
                                                title: 'Earned "Math Whiz" Badge',
                                                time: '3 days ago',
                                                icon: 'tabler-award',
                                                color: '#9C27B0'
                                            }
                                        ].map((activity, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'background.neutral',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: `${activity.color}20`,
                                                        color: activity.color
                                                    }}
                                                >
                                                    <SvgIcon name={activity.icon} size={20} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {activity.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {activity.time}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Profile */}
                        <Grid item xs={12} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Paper
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                bgcolor: 'primary.main',
                                                boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)'
                                            }}
                                        >
                                            {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </Avatar>
                                        <Typography variant="h6">
                                            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.email}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'inline-block',
                                                px: 1.5,
                                                py: 0.5,
                                                mt: 1,
                                                borderRadius: 10,
                                                bgcolor: user?.user_metadata?.role === 'student' ? 'primary.lighter' : 'success.lighter',
                                                color: user?.user_metadata?.role === 'student' ? 'primary.main' : 'success.main',
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            {user?.user_metadata?.role === 'student' ? 'Student' : 'Mentor'}
                                        </Typography>
                                    </Box>

                                    <Stack spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<SvgIcon name="tabler-user" size={20} />}
                                            sx={{ borderRadius: 2, py: 1 }}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<SvgIcon name="tabler-settings" size={20} />}
                                            sx={{ borderRadius: 2, py: 1 }}
                                        >
                                            Account Settings
                                        </Button>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ProtectedRoute>
    );
} 