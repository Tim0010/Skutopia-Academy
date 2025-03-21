'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';

// @project
import branding from '@/branding.json';

/***************************  LOGO - ICON  ***************************/

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <Box
      className="icon-logo"
      sx={{
        width: { xs: 19.5, sm: 22, md: 24 },
        height: { xs: 19.5, sm: 22, md: 24 },
        position: 'relative',
        cursor: 'pointer',
        display: 'block',
        WebkitTapHighlightColor: 'transparent',
        '& svg': {
          display: 'block'
        }
      }}
    >
      <SchoolIcon sx={{ fontSize: '100%', color: 'primary.main' }} />
    </Box>
  );
}
