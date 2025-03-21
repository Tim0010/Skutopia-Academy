'use client';

import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('@/views/landings/default/layout'));

export default function CurriculumLayout({ children }) {
  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {children}
      </Box>
    </MainLayout>
  );
}

CurriculumLayout.propTypes = {
  children: PropTypes.node
}; 