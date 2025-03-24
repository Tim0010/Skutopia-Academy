'use client';

import { Box, Breadcrumbs, Container, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';
import SvgIcon from '@/components/SvgIcon';
import { redirect } from 'next/navigation';

export default function SubjectsLayout({ children }) {
  // Redirect to the dashboard version of this page for consistent layout
  redirect('/dashboard/flashcards/subjects');
  
  // This code won't execute due to the redirect
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ pt: 2, pb: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink 
            component={Link} 
            href="/"
            underline="hover" 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <SvgIcon name="tabler-home" size={16} sx={{ mr: 0.5 }} />
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            href="/flashcards"
            underline="hover"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <SvgIcon name="tabler-cards" size={16} sx={{ mr: 0.5 }} />
            Flashcards
          </MuiLink>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <SvgIcon name="tabler-book" size={16} sx={{ mr: 0.5 }} />
            Subject Flashcards
          </Typography>
        </Breadcrumbs>
      </Container>
      {children}
    </Box>
  );
}
