'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';

// @project
import branding from '@/branding.json';

/***************************  LOGO - WATERMARK  ***************************/

export default function LogoWatermark() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', opacity: 0.08 }}>
      <SchoolIcon sx={{ fontSize: '28rem', color: 'primary.main' }} />
    </Box>
  );
}
