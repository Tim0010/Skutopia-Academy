'use client';
import PropTypes from 'prop-types';

// @next
import dynamic from 'next/dynamic';

// @types

// @project
import useDataThemeMode from '@/hooks/useDataThemeMode';

const ScrollFab = dynamic(() => import('@/components/ScrollFab'));
const ThemeAI = dynamic(() => import('@/views/landings/ai/theme'));
const MainLayout = dynamic(() => import('@/views/landings/default/layout'));

/***************************  LAYOUT - SECTIONS  ***************************/

export default function SectionsLayout({ children }) {
  useDataThemeMode();

  return (
    <ThemeAI>
      <MainLayout>
        <>
          {children}
          <ScrollFab />
        </>
      </MainLayout>
    </ThemeAI>
  );
}

SectionsLayout.propTypes = { children: PropTypes.any };
