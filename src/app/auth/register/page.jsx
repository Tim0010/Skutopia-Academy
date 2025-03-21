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
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormHelperText
} from '@mui/material';

// @project
import { useAuth } from '@/contexts/AuthContext';
import SvgIcon from '@/components/SvgIcon';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, error } = useAuth();

    // Form state
    const [activeStep, setActiveStep] = useState(0);
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Account details
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Step 2: Personal information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('student');

    // Step 3: Additional information (optional fields)
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [interests, setInterests] = useState('');

    const steps = ['Account Details', 'Personal Information', 'Additional Information'];

    const handleNext = (e) => {
        e.preventDefault();
        if (activeStep === 0) {
            // Validate step 1
            if (!email || !password || !confirmPassword) {
                setFormError('Please fill in all required fields');
                return;
            }

            if (password !== confirmPassword) {
                setFormError('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                setFormError('Password must be at least 6 characters long');
                return;
            }
        } else if (activeStep === 1) {
            // Validate step 2
            if (!firstName || !lastName) {
                setFormError('Please fill in all required fields');
                return;
            }
        }

        setFormError('');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setFormError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            setLoading(true);

            // Prepare user data
            const userData = {
                first_name: firstName,
                last_name: lastName,
                role: role,
                school: school,
                grade: grade,
                interests: interests
            };

            await signUp(email, password, userData);
            router.push('/auth/register-success');
        } catch (error) {
            console.error('Registration error:', error);
            setFormError(error.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            required
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

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon name="tabler-lock" size={20} color="text.secondary" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon name="tabler-user" size={20} color="text.secondary" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon name="tabler-user" size={20} color="text.secondary" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <FormControl component="fieldset">
                            <Typography variant="subtitle2" gutterBottom>
                                I am a:
                            </Typography>
                            <RadioGroup
                                row
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <FormControlLabel
                                    value="student"
                                    control={<Radio color="primary" />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SvgIcon name="tabler-book" size={20} color="primary.main" />
                                            <Typography>Student</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="mentor"
                                    control={<Radio color="primary" />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SvgIcon name="tabler-users" size={20} color="primary.main" />
                                            <Typography>Mentor</Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                            <FormHelperText>
                                {role === 'student'
                                    ? 'As a student, you will have access to all learning materials and mentorship opportunities.'
                                    : 'As a mentor, you will be able to guide students and share your knowledge.'}
                            </FormHelperText>
                        </FormControl>
                    </Stack>
                );
            case 2:
                return (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="School/University"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon name="tabler-building" size={20} color="text.secondary" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label={role === 'student' ? 'Grade/Year' : 'Field of Expertise'}
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            name={role === 'student' ? 'tabler-school' : 'tabler-certificate'}
                                            size={20}
                                            color="text.secondary"
                                        />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Interests (e.g., Math, Physics, Chemistry)"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                        <SvgIcon name="tabler-star" size={20} color="text.secondary" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                );
            default:
                return null;
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
                    {/* Left side - Registration form */}
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
                                        Create an Account
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                                        Join Skutopia Academy to start your learning journey
                                    </Typography>

                                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    {(formError || error) && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {formError || error}
                                        </Alert>
                                    )}

                                    <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
                                        {renderStepContent(activeStep)}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                variant="outlined"
                                                color="inherit"
                                                sx={{
                                                    borderRadius: 2,
                                                    py: 1.5,
                                                    px: 3,
                                                    visibility: activeStep === 0 ? 'hidden' : 'visible'
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={loading}
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
                                                {loading ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : activeStep === steps.length - 1 ? (
                                                    'Register'
                                                ) : (
                                                    'Next'
                                                )}
                                            </Button>
                                        </Box>
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
                                            Already have an account?{' '}
                                            <Link
                                                component={NextLink}
                                                href="/auth/login"
                                                variant="subtitle2"
                                                color="primary"
                                                underline="hover"
                                            >
                                                Sign In
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
                                        src="/assets/images/auth/register-illustration.svg"
                                        alt="Register Illustration"
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
                                                Benefits of Joining
                                            </Typography>

                                            <Stack spacing={1}>
                                                {[
                                                    'Access to personalized STEM learning resources',
                                                    'Connect with mentors from top universities',
                                                    'Track your progress and earn achievements',
                                                    'Join a community of like-minded learners'
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