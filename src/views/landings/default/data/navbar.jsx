// @project
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH } from '@/path';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  // Use graduation cap icon as the logo
  logoComponent: (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
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
    { id: 'home', title: 'Home', link: '/' },
    { id: 'explore', title: 'Explore', link: '/explore' },
    { id: 'story', title: 'Our Story', link: '/about' }
  ]
};
