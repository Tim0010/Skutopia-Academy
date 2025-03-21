'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function PrivacyPage() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.neutral' }}>
      <Container>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
            Privacy Policy
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 2 }}>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information that you provide directly to us, including your name, email address, school information, and academic interests.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            2. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use the information we collect to provide and improve our educational services, personalize your experience, and communicate with you about our programs.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            3. Information Sharing
          </Typography>
          <Typography paragraph>
            We do not sell or rent your personal information to third parties. We may share your information with educational partners and mentors only with your consent.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            4. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            5. Your Rights
          </Typography>
          <Typography paragraph>
            You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
} 