'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            router.push('/auth/login');
            return;
        }
    }, [user, router]);

    const adminModules = [
        {
            title: 'Exam Papers Management',
            description: 'Upload and manage past examination papers for students',
            icon: 'tabler-file-upload',
            path: '/dashboard/admin/exam-papers',
            color: 'primary'
        },
        {
            title: 'Mentorship Management',
            description: 'Manage mentorship programs for students',
            icon: 'tabler-user-plus',
            path: '/dashboard/admin/mentorship',
            color: 'primary'
        },
        // Add more admin modules here as needed
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage content and settings for the Skutopia Academy platform
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {adminModules.map((module, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                height: '100%',
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: 3,
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Box 
                                        sx={{ 
                                            p: 1.5, 
                                            borderRadius: 2, 
                                            bgcolor: `${module.color}.light`,
                                            color: `${module.color}.main`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <SvgIcon name={module.icon} size={24} />
                                    </Box>
                                </Box>
                                
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {module.title}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                    {module.description}
                                </Typography>
                                
                                <Button 
                                    variant="contained" 
                                    color={module.color}
                                    fullWidth
                                    sx={{ borderRadius: 2, mt: 'auto' }}
                                    onClick={() => router.push(module.path)}
                                >
                                    Manage
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
