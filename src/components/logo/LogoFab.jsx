'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';

// @project
import branding from '@/branding.json';

// @types

/***************************  LOGO - FAB  ***************************/

export default function LogoFab({ size = 24 }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <SchoolIcon sx={{ fontSize: size, color: 'primary.main' }} />
    </Box>
  );
}

LogoFab.propTypes = { size: PropTypes.number };
