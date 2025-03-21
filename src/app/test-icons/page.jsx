'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Container,
  Divider
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { IconType } from '@/enum';
// Sample Material UI icons
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Quiz as QuizIcon,
  FlashOn as FlashcardIcon,
  People as MentorshipIcon,
  EmojiEvents as ScholarshipIcon
} from '@mui/icons-material';

// List of Tabler icons to test from the sprite file
const tablerIcons = [
  'tabler-dashboard',
  'tabler-book',
  'tabler-user',
  'tabler-settings',
  'tabler-logout',
  'tabler-award',
  'tabler-cards',
  'tabler-users',
  'tabler-menu-2'
];

export default function TestIcons() {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    // Check if SVG sprites are loaded
    const checkIconsLoaded = () => {
      const svgElements = document.querySelectorAll('svg use');
      let allLoaded = true;
      
      svgElements.forEach(element => {
        // If the href doesn't resolve, it's likely the icon isn't loaded
        if (!element.href || !element.href.baseVal) {
          allLoaded = false;
        }
      });
      
      setIconsLoaded(allLoaded);
    };

    // Check after a short delay to allow icons to load
    const timer = setTimeout(checkIconsLoaded, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Icon Testing Page
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page tests if all icons are displaying correctly.
      </Typography>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h4" gutterBottom>
        Material UI Icons
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="Dashboard">
            <DashboardIcon />
          </IconCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="Person">
            <PersonIcon />
          </IconCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="Settings">
            <SettingsIcon />
          </IconCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="Logout">
            <LogoutIcon />
          </IconCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="School">
            <SchoolIcon />
          </IconCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <IconCard title="Book">
            <BookIcon />
          </IconCard>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h4" gutterBottom>
        Tabler SVG Icons (Outline)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {tablerIcons.map((icon) => (
          <Grid item xs={6} sm={4} md={2} key={icon}>
            <IconCard title={icon.replace('tabler-', '')}>
              <SvgIcon name={icon} type={IconType.STROKE} />
            </IconCard>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h4" gutterBottom>
        Tabler SVG Icons (Fill)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {tablerIcons.slice(0, 4).map((icon) => (
          <Grid item xs={6} sm={4} md={2} key={icon}>
            <IconCard title={icon.replace('tabler-', '')}>
              <SvgIcon name={icon} type={IconType.FILL} />
            </IconCard>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h4" gutterBottom>
        Status: {iconsLoaded ? '✅ Icons Loaded' : '❌ Some Icons Failed'}
      </Typography>
      {!iconsLoaded && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography variant="body1">
            Some icons failed to load. Possible issues:
          </Typography>
          <ul>
            <li>SVG sprite files might be missing or have incorrect paths</li>
            <li>Icon names might be incorrect in the sprite file</li>
            <li>Check browser console for network errors</li>
          </ul>
        </Box>
      )}
    </Container>
  );
}

function IconCard({ title, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Box sx={{ fontSize: 40, mb: 2 }}>
            {children}
          </Box>
          <Typography variant="subtitle2">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 