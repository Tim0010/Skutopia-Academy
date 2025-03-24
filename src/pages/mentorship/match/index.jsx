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
import { motion } from 'framer-motion';

// Components
import ContainerWrapper from '@/components/ContainerWrapper';

const academicFields = [
  'Science',
  'Technology',
  'Engineering',
  'Mathematics',
  'Arts',
  'Humanities',
  'Business',
  'Social Sciences',
  'Medicine',
  'Other'
];

const careerInterests = [
  'Software Development',
  'Data Science',
  'Medicine',
  'Engineering',
  'Business',
  'Research',
  'Teaching',
  'Arts',
  'Law',
  'Other'
];

const steps = ['Personal Information', 'Academic Interests', 'Career Goals'];

export default function MatchingPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    grade: '',
    academicInterests: [],
    careerGoals: '',
    additionalInfo: ''
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
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
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
              label="School"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Grade/Form"
              name="grade"
              value={formData.grade}
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
              select
              label="Academic Interests"
              name="academicInterests"
              value={formData.academicInterests}
              onChange={handleChange}
              SelectProps={{
                multiple: true
              }}
              helperText="Select all that apply"
              required
            >
              {academicFields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What subjects are you most passionate about?"
              name="academicPassion"
              value={formData.academicPassion}
              onChange={handleChange}
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              select
              label="Career Interests"
              name="careerInterests"
              value={formData.careerInterests}
              onChange={handleChange}
              SelectProps={{
                multiple: true
              }}
              helperText="Select all that apply"
              required
            >
              {careerInterests.map((career) => (
                <MenuItem key={career} value={career}>
                  {career}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What are your career goals?"
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              helperText="Share anything else that might help us match you with the right mentor"
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
              Find Your Perfect Mentor
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Tell us about yourself so we can match you with mentors who can best support your journey
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
                  >
                    Find Mentor
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