'use client';
import PropTypes from 'prop-types';

// @next
import NextLink from 'next/link';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// @project
import branding from '@/branding.json';
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';
import SvgIcon from '@/components/SvgIcon';

/***************************  SITEMAP - DATA  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
const menuItems = [
  {
    id: 'use-case',
    grid: { size: { xs: 12, sm: 'auto' } },
    title: 'Use Case',
    menu: [
      {
        label: 'Business Analytics',
        link: { href: '#' }
      },
      {
        label: 'Marketing Automation',
        link: { href: '#' }
      },
      {
        label: 'Collaboration Suites',
        link: { href: '#' }
      },
      {
        label: 'Project Management',
        link: { href: '#' }
      }
    ]
  },
  {
    id: 'support',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Support',
    menu: [
      {
        label: 'Pricing',
        link: { href: '/pricing', ...linkProps }
      },
      {
        label: 'FAQ',
        link: { href: '/faq', ...linkProps }
      },
      {
        label: 'Support',
        link: { href: branding.company.socialLink.support, ...linkProps }
      },
      {
        label: 'License Terms',
        link: { href: 'https://mui.com/store/license/', ...linkProps }
      }
    ]
  },
  {
    id: 'company',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Company',
    menu: [
      {
        label: 'Why Phoenixcoded?',
        link: {
          href: 'https://blog.saasable.io/a-decade-of-expertise-the-phoenixcoded-story-and-why-you-should-trust-us',
          ...linkProps
        }
      },
      {
        label: 'About',
        link: { href: '/about', ...linkProps }
      },
      {
        label: 'Contact Us',
        link: { href: '/contact', ...linkProps }
      }
    ]
  }
];

/***************************  FOOTER - SITEMAP  ***************************/

export default function Sitemap({ list, isMenuDesign = false }) {
  const theme = useTheme();

  const menuItemStyle = {
    color: 'text.secondary',
    justifyContent: 'flex-start',
    px: 0,
    minHeight: { xs: 36, sm: 40 },
    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
    '&.Mui-focusVisible': { bgcolor: 'transparent', ...generateFocusVisibleStyles(theme.palette.primary.main) }
  };

  return (
    <Grid container spacing={{ xs: 3, sm: 4 }}>
      {list.map((item) => (
        <Grid key={item.id} {...item.grid}>
          <Stack sx={{ gap: { xs: 1.5, sm: 2 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {item.title}
            </Typography>
            <Stack sx={{ gap: { xs: 1, sm: 1.5 } }}>
              {item.menu.map((menu, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  {menu.icon && (
                    <SvgIcon
                      name={menu.icon}
                      size={16}
                      color={item.id === 'legal' ? 'text.disabled' : 'primary.main'}
                    />
                  )}
                  <Link
                    component={NextLink}
                    href={menu.link.href}
                    variant="body2"
                    color={isMenuDesign ? 'text.primary' : 'text.secondary'}
                    sx={{
                      fontWeight: isMenuDesign ? 500 : 400,
                      '&:hover': { color: 'primary.main' }
                    }}
                    {...menu.link}
                  >
                    {menu.label}
                  </Link>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

Sitemap.propTypes = {
  list: PropTypes.array.isRequired,
  isMenuDesign: PropTypes.bool
};
