'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';

// @project
import branding from '@/branding.json';

/***************************  LOGO - MAIN  ***************************/

export default function LogoMain() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
        {branding.brandName}
      </Typography>
    </Box>
  );
}
