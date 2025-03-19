'use client';

import PropTypes from 'prop-types';
import Script from 'next/script';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// @project
import ProviderWrapper from './ProviderWrapper';
import theme from '@/theme';

// @types

const gaId = process.env.NEXT_PUBLIC_ANALYTICS_ID || '';

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect and DNS Prefetch */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <AuthProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ProviderWrapper>
                {children}
              </ProviderWrapper>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
        {gaId && <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />}
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
