'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';
import SvgIcon from '@/components/SvgIcon';

/***************************  LOGO - MAIN  ***************************/

export default function LogoMain() {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SvgIcon name="tabler-book" size={32} color="primary.main" sx={{ mr: 1 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Skutopia
      </Typography>
    </Box>
  );
}
