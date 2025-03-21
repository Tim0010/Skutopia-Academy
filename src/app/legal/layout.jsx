'use client';

import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';

// @project
import MainLayout from '@/views/landings/default/layout';

export default function LegalLayout({ children }) {
  return (
    <MainLayout>
      <Box component="main" sx={{ minHeight: '100vh' }}>
        {children}
      </Box>
    </MainLayout>
  );
}

LegalLayout.propTypes = {
  children: PropTypes.node
}; 