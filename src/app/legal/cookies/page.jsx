'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function CookiePolicyPage() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.neutral' }}>
      <Container>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
            Cookie Policy
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 2 }}>
            1. What Are Cookies
          </Typography>
          <Typography paragraph>
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login status.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            2. How We Use Cookies
          </Typography>
          <Typography paragraph>
            We use cookies to understand how you interact with our website, remember your preferences, and provide personalized educational content and recommendations.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            3. Types of Cookies We Use
          </Typography>
          <Typography paragraph>
            - Essential cookies: Required for basic website functionality
            - Preference cookies: Remember your settings and preferences
            - Analytics cookies: Help us understand how you use our website
            - Authentication cookies: Keep you logged in during your session
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            4. Managing Cookies
          </Typography>
          <Typography paragraph>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and set most browsers to prevent them from being placed.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            5. Third-Party Cookies
          </Typography>
          <Typography paragraph>
            Some of our pages may contain content from other sites, like YouTube or Vimeo, which may set their own cookies. We do not control the settings of these cookies.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
} 