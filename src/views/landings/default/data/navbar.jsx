// @project
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH } from '@/path';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  // Use an open book SVG icon as the logo
  logoComponent: (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SvgIcon name="tabler-school" size={32} color="primary.main" sx={{ mr: 1 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Skutopia
      </Typography>
    </Box>
  ),
  secondaryBtn: {
    children: <SvgIcon name="tabler-user-circle" color="primary.main" size={18} />,
    href: '/auth/login',
    sx: { minWidth: 40, width: 40, height: 40, p: 0 }
  },
  primaryBtn: {
    children: 'Sign up free',
    href: '/auth/register'
  },
  navItems: [
    { id: 'home', title: 'Explore', link: '/' },
    { id: 'courses', title: 'Courses', link: '/courses' },
    { id: 'flashcards', title: 'Flashcards', link: '/flashcards' },
    { id: 'quizzes', title: 'Practice', link: '/practice' },
    { id: 'mentorship', title: 'Mentorship', link: '/mentorship' }
  ]
};
