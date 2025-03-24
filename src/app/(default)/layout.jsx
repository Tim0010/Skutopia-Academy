'use client';

import PropTypes from 'prop-types';
// @next
import dynamic from 'next/dynamic';
import useDataThemeMode from '@/hooks/useDataThemeMode';

// @types

// @project
const ScrollFab = dynamic(() => import('@/components/ScrollFab'));
const ThemeAI = dynamic(() => import('@/views/landings/ai/theme'));
const MainLayout = dynamic(() => import('@/views/landings/default/layout'));

/***************************  LAYOUT - AI  ***************************/

export default function DefaultLayout({ children }) {
  useDataThemeMode();

  return (
    <ThemeAI>
      <MainLayout>
        <>
          {children}

          {/* scroll to top section */}
          <ScrollFab />
        </>
      </MainLayout>
    </ThemeAI>
  );
}

DefaultLayout.propTypes = { children: PropTypes.any };
