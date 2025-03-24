'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { motion } from 'framer-motion';

// Components
import ContainerWrapper from '@/components/ContainerWrapper';

const experienceLevels = [
  'University Student',
  'Recent Graduate',
  '1-3 years',
  '4-6 years',
  '7+ years'
];

const availabilityOptions = [
  '1-2 hours/week',
  '3-4 hours/week',
  '5+ hours/week'
];

const steps = ['Personal Information', 'Professional Background', 'Mentoring Preferences'];

export default function BecomeMentorPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    experience: '',
    expertise: [],
    bio: '',
    availability: '',
    mentorshipGoals: '',
    agreeToTerms: false
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Current Organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              helperText="University or Company name"
            />
            <TextField
              fullWidth
              label="Current Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              select
              label="Years of Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              {experienceLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Professional Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              helperText="Share your background and what makes you a great mentor"
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              select
              label="Weekly Availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
            >
              {availabilityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What do you hope to achieve as a mentor?"
              name="mentorshipGoals"
              value={formData.mentorshipGoals}
              onChange={handleChange}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  name="agreeToTerms"
                  required
                />
              }
              label="I agree to the mentorship guidelines and code of conduct"
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <ContainerWrapper>
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={3} sx={{ mb: 5, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              Become a Mentor
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: 'auto' }}>
              Share your knowledge and experience to help shape the future of Zambian students. 
              As a mentor, you'll have the opportunity to make a real difference in a student's academic and professional journey.
            </Typography>
          </motion.div>
        </Stack>

        <Card sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!formData.agreeToTerms}
                  >
                    Submit Application
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Card>
      </Box>
    </ContainerWrapper>
  );
} 