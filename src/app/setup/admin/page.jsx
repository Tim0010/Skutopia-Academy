'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  AlertTitle,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SetupAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email || !password || !adminKey) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          adminKey,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user');
      }
      
      setSuccess(true);
      // Clear form
      setEmail('');
      setPassword('');
      setAdminKey('');
      
    } catch (err) {
      setError(err.message || 'An error occurred during setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
        <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Skutopia Academy Admin Setup
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Use this page to create an administrator account. You'll need the setup key.
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Success!</AlertTitle>
            Admin user created successfully. Please check your email to confirm your account.
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/auth/login"
              >
                Go to Login
              </Button>
            </Box>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Admin Setup Key"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              margin="normal"
              required
              helperText="Enter the setup key provided by your system administrator"
            />
            
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading && <CircularProgress size={24} color="inherit" />}
              >
                {loading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
      
      <Box sx={{ textAlign: 'center', mt: 2, mb: 8 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account? <Link href="/auth/login" style={{ color: 'primary.main' }}>Sign in</Link>
        </Typography>
      </Box>
    </Container>
  );
} 