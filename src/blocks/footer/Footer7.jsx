'use client';

// @next
import NextLink from 'next/link';

// @mui
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// @third-party
import { motion } from 'framer-motion';

// @project
import branding from '@/branding.json';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import { Copyright, FollowUS, Sitemap } from '@/components/footer';
import LogoSection from '@/components/logo';
import SvgIcon from '@/components/SvgIcon';

import { CopyrightType } from '@/enum';
import { DOCS_URL, FREEBIES_URL } from '@/path';
import { SECTION_COMMON_PY } from '@/utils/constant';

// @types

/***************************  FOOTER - 7 DATA  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
const data = [
  {
    id: 'about',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'About',
    menu: [
      {
        icon: 'tabler-target',
        label: 'Our Mission',
        link: { href: '/about/mission' }
      },
      {
        icon: 'tabler-users',
        label: 'Our Team',
        link: { href: '/about/team' }
      },
      {
        icon: 'tabler-mail',
        label: 'Contact Us',
        link: { href: '/contact' }
      }
    ]
  },
  {
    id: 'resources',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Resources',
    menu: [
      {
        icon: 'tabler-book',
        label: 'Study Materials',
        link: { href: '/resources/study-materials' }
      },
      {
        icon: 'tabler-writing',
        label: 'Practice Tests',
        link: { href: '/resources/practice-tests' }
      },
      {
        icon: 'tabler-route',
        label: 'Learning Paths',
        link: { href: '/resources/learning-paths' }
      },
      {
        icon: 'tabler-award',
        label: 'Scholarship Opportunities',
        link: { href: '/resources/scholarships' }
      },
      {
        icon: 'tabler-user-search',
        label: 'Find a Mentor',
        link: { href: '/resources/mentors' }
      }
    ]
  },
  {
    id: 'legal',
    grid: { size: { xs: 12, sm: 'auto' } },
    title: 'Legal',
    menu: [
      {
        label: 'Terms of Service',
        link: { href: '/legal/terms' }
      },
      {
        label: 'Privacy Policy',
        link: { href: '/legal/privacy' }
      },
      {
        label: 'Cookie Policy',
        link: { href: '/legal/cookies' }
      }
    ]
  }
];

const iconProps = { color: 'text.secondary', size: 20 };

const usefullLinks = [
  {
    icon: <SvgIcon name="tabler-book" {...iconProps} />,
    title: 'STEM Curriculum',
    href: '/curriculum',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.1)'
  },
  {
    icon: <SvgIcon name="tabler-users" {...iconProps} />,
    title: 'Become a Mentor',
    href: '/auth/register?role=educator',
    color: '#2196F3',
    bgColor: 'rgba(33, 150, 243, 0.1)'
  },
  {
    icon: <SvgIcon name="tabler-school" {...iconProps} />,
    title: 'Student Portal',
    href: '/auth/register',
    color: '#FF9800',
    bgColor: 'rgba(255, 152, 0, 0.1)'
  }
];

const testimonials = [
  {
    quote: "Skutopia helped me prepare for university scholarships!",
    name: "Chanda M.",
    location: "Lusaka, Zambia"
  },
  {
    quote: "The mentorship program connected me with students from top universities worldwide.",
    name: "Mulenga K.",
    location: "Kitwe, Zambia"
  },
  {
    quote: "I improved my math scores significantly using the interactive lessons.",
    name: "Natasha C.",
    location: "Livingstone, Zambia"
  }
];

/***************************  FOOTER - 7  ***************************/

export default function Footer7() {
  const logoFollowContent = (
    <Stack sx={{ alignItems: 'flex-start', gap: { xs: 1.5, sm: 3 } }}>
      <LogoSection />
      <Typography variant="h6" sx={{ maxWidth: { sm: 320 }, mb: { xs: -1, sm: -2.5 } }}>
        Empowering Zambian Students
      </Typography>
      <Typography variant="body2" sx={{ maxWidth: { sm: 320 }, color: 'text.secondary', lineHeight: 1.6 }}>
        Empowering Zambian students through STEM education, mentorship, and career opportunities.
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', pt: 6 }}>
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Stack id="footer-7" role="contentinfo" rel="noopener noreferrer" aria-label="Footer 7" sx={{ gap: { xs: 3, sm: 4, md: 5 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.4
            }}
          >
            <Grid container spacing={{ xs: 4, md: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction={{ sm: 'row', md: 'column' }} sx={{ gap: 3, justifyContent: 'space-between', height: 1 }}>
                  {logoFollowContent}
                  <Stack sx={{ gap: { xs: 2, sm: 2.5, md: 3 }, mt: 3 }}>
                    {usefullLinks.map((item, index) => (
                      <Button
                        key={index}
                        component={NextLink}
                        href={item.href}
                        variant="outlined"
                        startIcon={
                          <Box
                            sx={{
                              bgcolor: item.bgColor,
                              color: item.color,
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {item.icon}
                          </Box>
                        }
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: 'divider',
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: item.color,
                            bgcolor: item.bgColor,
                            boxShadow: `0 4px 8px ${item.color}20`
                          },
                          px: 2,
                          py: 1
                        }}
                      >
                        {item.title}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Grid container spacing={2}>
                  {data.map((section) => (
                    <Grid key={section.id} {...section.grid}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {section.title}
                      </Typography>
                      <Stack spacing={1.5}>
                        {section.menu.map((item, idx) => (
                          <Stack key={idx} direction="row" spacing={1} alignItems="center">
                            {item.icon && (
                              <SvgIcon
                                name={item.icon}
                                size={16}
                                color={section.id === 'legal' ? 'text.disabled' : 'primary.main'}
                              />
                            )}
                            <Link
                              component={NextLink}
                              href={item.link.href}
                              variant="body2"
                              color={section.id === 'legal' ? 'text.disabled' : 'text.secondary'}
                              sx={{
                                '&:hover': {
                                  color: section.id === 'legal' ? 'text.primary' : 'primary.main',
                                  textDecoration: 'none'
                                }
                              }}
                            >
                              {item.label}
                            </Link>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Student Voices
                    </Typography>
                    <Box
                      component={motion.div}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [10, 0, 0, -10]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 10,
                        times: [0, 0.1, 0.9, 1]
                      }}
                      sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: 'italic',
                          mb: 2,
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        "{testimonials[0].quote}"
                      </Typography>
                      <Typography variant="subtitle2">
                        {testimonials[0].name}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {testimonials[0].location}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 3 }}
                      component={NextLink}
                      href="/auth/register"
                    >
                      Join Our Community
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.4
            }}
          >
            <Divider sx={{ my: 3 }} />
            <Stack
              direction={{ sm: 'row' }}
              sx={{
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'space-between' },
                gap: 1.5,
                py: { xs: 2, sm: 1.5 }
              }}
            >
              <Copyright type={CopyrightType.TYPE3} />
              <FollowUS heading={false} color="grey.100" />
            </Stack>
          </motion.div>
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}
