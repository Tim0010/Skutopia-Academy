'use client';

import PropTypes from 'prop-types';
import Script from 'next/script';
import { Inter } from 'next/font/google';

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
import branding from '@/branding.json';

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// @types

const gaId = process.env.NEXT_PUBLIC_ANALYTICS_ID || '';

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>{`${branding?.brandName || 'Skutopia'} ${branding?.title || 'Academy'}`}</title>
        <meta name="description" content="Skutopia Academy - Learn STEM subjects with personalized mentorship" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2196F3" />
        <meta name="application-name" content={`${branding?.brandName || 'Skutopia'} ${branding?.title || 'Academy'}`} />
        
        {/* PWA Support */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link 
          rel="icon" 
          href="/favicon.svg" 
          type="image/svg+xml" 
        />
        <link 
          rel="icon" 
          href="/favicon.ico" 
          sizes="32x32" 
        />
        <link 
          rel="apple-touch-icon" 
          href="/apple-touch-icon.png" 
        />
        
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
        {gaId && (
          <>
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          </>
        )}
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
