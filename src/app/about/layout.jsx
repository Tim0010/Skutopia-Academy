'use client';

import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import useDataThemeMode from '@/hooks/useDataThemeMode';

const ScrollFab = dynamic(() => import('@/components/ScrollFab'));
const ThemeAI = dynamic(() => import('@/views/landings/ai/theme'));
const MainLayout = dynamic(() => import('@/views/landings/default/layout'));

export default function AboutLayout({ children }) {
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

AboutLayout.propTypes = { children: PropTypes.any }; 