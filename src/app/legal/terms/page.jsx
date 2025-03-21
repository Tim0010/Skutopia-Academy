'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function TermsPage() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.neutral' }}>
      <Container>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
            Terms of Service
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 2 }}>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to Skutopia. By accessing and using our platform, you agree to be bound by these Terms of Service.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            2. Services
          </Typography>
          <Typography paragraph>
            Skutopia provides educational resources, mentorship opportunities, and learning tools for students in Zambia.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            3. User Responsibilities
          </Typography>
          <Typography paragraph>
            Users are responsible for maintaining the confidentiality of their account information and for all activities under their account.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            4. Content Usage
          </Typography>
          <Typography paragraph>
            All content provided on Skutopia is for educational purposes only. Users may not reproduce or distribute content without permission.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            5. Privacy
          </Typography>
          <Typography paragraph>
            Your use of Skutopia is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
} 