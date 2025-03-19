'use client';

// @project
import { Feature20 } from '@/blocks/feature';
import { Hero17 } from '@/blocks/hero';
import LazySection from '@/components/LazySection';
import useDataThemeMode from '@/hooks/useDataThemeMode';
import { About1 } from '@/blocks/about';
import { Features1 } from '@/blocks/features';
import { CoursePreview, LearningPaths } from '@/blocks/courses';
import { StatsCounter } from '@/blocks/stats';
import { Box, SvgIcon, Typography, Container, Grid, Card, CardContent, Button, Avatar, Stack } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExtensionIcon from '@mui/icons-material/Extension';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// @data
import {
  benefit,
  clientele,
  cta4,
  cta5,
  faq,
  feature20,
  feature21,
  feature18,
  hero,
  integration,
  other,
  pricing,
  testimonial
} from './data';

/***************************  PAGE - MAIN  ***************************/

export default function Main() {
  // Hardcoded subject data instead of XML parsing
  const subjectsData = {
    Mathematics: {
      topics: [
        { name: "Algebra", description: "Basic to advanced algebra concepts." },
        { name: "Geometry", description: "Shapes, sizes, and properties of figures." }
      ]
    },
    Science: {
      topics: [
        { name: "Physics", description: "Study of matter, motion, and energy." },
        { name: "Biology", description: "Life and living organisms." }
      ]
    },
    Technology: {
      topics: [
        { name: "Programming", description: "Introduction to coding and software development." },
        { name: "Networking", description: "Understanding computer networks and communication." }
      ]
    },
    Engineering: {
      topics: [
        { name: "Mechanical", description: "Principles of mechanics and energy." },
        { name: "Electrical", description: "Study of electricity and electronics." }
      ]
    }
  };

  useDataThemeMode();

  return (
    <>
      <Hero17
        chip={{
          label: 'Skutopia Academy',
          icon: (
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
              <SvgIcon name="tabler-school" color="success.main" size={18} />
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'success.main',
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.5, transform: 'scale(0.8)' },
                    '50%': { opacity: 1, transform: 'scale(1.1)' },
                    '100%': { opacity: 0.5, transform: 'scale(0.8)' }
                  }
                }}
              />
            </Box>
          )
        }}
        headLine="The Success Academy"
        captionLine="Master STEM through hands-on practice"
        primaryBtn={{ children: 'Get started', href: '/auth/register' }}
        image="/assets/images/hero/stem-education.png"
        imageAlt="STEM Education"
        listData={[
          {
            title: 'Science',
            image: '/assets/icons/laboratory_2387545.svg',
            icon: (
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <SvgIcon name="tabler-flask" color="success.main" size={20} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'success.main',
                    animation: 'lightning 1.8s infinite',
                    '@keyframes lightning': {
                      '0%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '20%': { opacity: 1, transform: 'scale(1.1)' },
                      '40%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '100%': { opacity: 0.2, transform: 'scale(0.8)' }
                    }
                  }}
                />
              </Box>
            )
          },
          {
            title: 'Technology',
            image: '/assets/icons/technology_3206042.svg',
            icon: (
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <SvgIcon name="tabler-device-laptop" color="info.main" size={20} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'info.main',
                    animation: 'lightning 1.8s infinite 0.3s',
                    '@keyframes lightning': {
                      '0%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '20%': { opacity: 1, transform: 'scale(1.1)' },
                      '40%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '100%': { opacity: 0.2, transform: 'scale(0.8)' }
                    }
                  }}
                />
              </Box>
            )
          },
          {
            title: 'Engineering',
            image: '/assets/icons/engineering_2861721.svg',
            icon: (
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <SvgIcon name="tabler-tool" color="warning.main" size={20} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'warning.main',
                    animation: 'lightning 1.8s infinite 0.6s',
                    '@keyframes lightning': {
                      '0%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '20%': { opacity: 1, transform: 'scale(1.1)' },
                      '40%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '100%': { opacity: 0.2, transform: 'scale(0.8)' }
                    }
                  }}
                />
              </Box>
            )
          },
          {
            title: 'Mathematics',
            image: '/assets/icons/math.svg',
            icon: (
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <SvgIcon name="tabler-math" color="primary.main" size={20} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    animation: 'lightning 1.8s infinite 0.9s',
                    '@keyframes lightning': {
                      '0%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '20%': { opacity: 1, transform: 'scale(1.1)' },
                      '40%': { opacity: 0.2, transform: 'scale(0.8)' },
                      '100%': { opacity: 0.2, transform: 'scale(0.8)' }
                    }
                  }}
                />
              </Box>
            )
          }
        ]}
      />

      <LearningPaths
        heading="Welcome to Skutopia Academy"
        subheading="Explore our interactive platform designed to enhance STEM learning in Zambia through engaging content and personalized paths."
        animation={true}
        sx={{ textAlign: 'center' }}
      />

      {/* Learn at your level section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.neutral' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <Stack spacing={3}>
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Learn with the Best Tools
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      lineHeight: 1.6,
                      mb: 2
                    }}
                  >
                    Review the basics or master new skills—designed for Zambian students from Grade 8 to 12.    </Typography>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right side - Learning options */}
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative' }}>
                {/* Connection lines that animate on hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                >
                  {/* Connection line 1: Short Courses to Flashcards */}
                  <motion.svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <motion.path
                      d="M150,80 C180,110 200,130 250,150"
                      stroke="#9c27b0"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.3, duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M150,80 C180,110 200,130 250,150"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  {/* Connection line 2: Flashcards to Quizzes */}
                  <motion.svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                  >
                    <motion.path
                      d="M250,150 C280,180 300,200 350,220"
                      stroke="#2196f3"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.7, duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M250,150 C280,180 300,200 350,220"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.9, duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  {/* Connection line 3: Quizzes to Mentorship */}
                  <motion.svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0, duration: 0.8 }}
                  >
                    <motion.path
                      d="M350,220 C380,250 400,270 450,290"
                      stroke="#ff9800"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 2.1, duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M350,220 C380,250 400,270 450,290"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 2.3, duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.svg>
                </Box>

                <Grid container spacing={3}>
                  {[
                    {
                      id: 'courses',
                      title: 'Short Courses',
                      icon: 'tabler-video',
                      color: '#9c27b0',
                      bgColor: '#f3e5f5',
                      description: 'Bite-sized video lessons',
                      href: '/courses',
                      position: { top: 0, left: '5%' }
                    },
                    {
                      id: 'flashcards',
                      title: 'Flashcards',
                      icon: 'tabler-cards',
                      color: '#2196f3',
                      bgColor: '#e3f2fd',
                      description: 'Quick concept review',
                      href: '/flashcards',
                      position: { top: '30%', left: '25%' }
                    },
                    {
                      id: 'quizzes',
                      title: 'Quizzes',
                      icon: 'tabler-checklist',
                      color: '#ff9800',
                      bgColor: '#fff3e0',
                      description: 'Test your knowledge',
                      href: '/quizzes',
                      position: { top: '60%', left: '45%' }
                    },
                    {
                      id: 'mentorship',
                      title: 'Mentorship',
                      icon: 'tabler-users',
                      color: '#4caf50',
                      bgColor: '#e8f5e9',
                      description: 'Learn from experts',
                      href: '/mentorship',
                      position: { top: '90%', left: '65%' }
                    }
                  ].map((option, index) => (
                    <Grid item xs={6} sm={6} md={6} key={option.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.2 * index,
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        }}
                      >
                        <Card
                          component={motion.div}
                          sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible',
                            zIndex: 1,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${option.bgColor} 0%, white 100%)`,
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              zIndex: -1
                            },
                            '&:hover': {
                              boxShadow: `0 16px 40px rgba(0,0,0,0.15), 0 0 15px ${option.color}40`,
                              '&::before': {
                                opacity: 1
                              }
                            }
                          }}
                          onClick={() => {
                            // This would navigate to the respective page in a real implementation
                            console.log(`Navigating to ${option.href}`);
                          }}
                        >
                          <motion.div
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              transition: { duration: 0.5 }
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: option.bgColor,
                                color: option.color,
                                borderRadius: 2,
                                mb: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1) rotate(5deg)',
                                  boxShadow: `0 5px 15px ${option.color}40`
                                }
                              }}
                            >
                              <SvgIcon name={option.icon} size={30} />
                            </Box>
                          </motion.div>

                          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                            {index === 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.5,
                                  duration: 0.5,
                                  type: "spring",
                                  stiffness: 300
                                }}
                              >
                                <Box
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: 5,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                  }}
                                >
                                  <SvgIcon name="tabler-star" size={14} sx={{ mr: 0.5 }} /> FOR YOU
                                </Box>
                              </motion.div>
                            )}
                          </Box>

                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              transition: 'color 0.3s ease',
                              '&:hover': {
                                color: option.color
                              }
                            }}
                          >
                            {option.title}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {option.description}
                          </Typography>

                          <Box
                            sx={{
                              mt: 'auto',
                              pt: 2,
                              display: 'flex',
                              alignItems: 'center',
                              color: option.color,
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              opacity: 0,
                              transform: 'translateY(10px)',
                              transition: 'all 0.3s ease',
                              '.MuiCard-root:hover &': {
                                opacity: 1,
                                transform: 'translateY(0)'
                              }
                            }}
                          >
                            Explore <SvgIcon name="tabler-arrow-right" size={16} sx={{ ml: 0.5 }} />
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stay motivated section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'rgba(212, 237, 152, 0.15)' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 6 }, pb: { xs: 4, md: 0 } }}>
                <Typography
                  component="h2"
                  variant="h2"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 700,
                    lineHeight: 1.2
                  }}
                >
                  Find Your Mentor,<br />Shape Your Future
                </Typography>
                <Box sx={{ mb: 6 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          flexShrink: 0
                        }}
                      />
                      <Typography variant="body1">
                        Get guidance from university students and professionals in your dream career.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          flexShrink: 0
                        }}
                      />
                      <Typography variant="body1">
                        Learn from mentors studying at Michigan State, Whitman, WPI, Ashoka University, and more.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          flexShrink: 0
                        }}
                      />
                      <Typography variant="body1">
                        Ask questions, gain insights, and prepare for your future with expert advice.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem'
                  }}
                >
                  Find a Mentor Now
                </Button>
              </Box>
            </Grid>

            {/* Right side - Mentor carousel */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: '500px', width: '100%' }}>
                {[
                  {
                    name: 'Sarah',
                    university: 'Harvard University',
                    field: 'Biology',
                    quote: "I love helping students discover their passion for science and guiding them through complex concepts.",
                    color: '#4CAF50',
                    avatar: '/assets/images/mentors/sarah.jpg',
                    top: '0px',
                    right: '5%',
                    zIndex: 4
                  },
                  {
                    name: 'Michael',
                    university: 'MIT',
                    field: 'Computer Science',
                    quote: "Technology is changing our world. I'm here to help you be part of that change.",
                    color: '#2196F3',
                    avatar: '/assets/images/mentors/micheal.jpg',
                    top: '120px',
                    right: '10%',
                    zIndex: 3
                  },
                  {
                    name: 'Priya Patel',
                    university: 'Stanford University',
                    field: 'Engineering',
                    quote: "Engineering is about solving real problems. Let me show you how to think like an engineer.",
                    color: '#FF9800',
                    avatar: '/assets/images/mentors/priya.jpg',
                    top: '240px',
                    right: '15%',
                    zIndex: 2
                  },
                  {
                    name: 'James Wilson',
                    university: 'Princeton University',
                    field: 'Mathematics',
                    quote: "Mathematics is the language of the universe. I'll help you become fluent in it.",
                    color: '#9C27B0',
                    avatar: '/assets/images/mentors/james.jpg',
                    top: '360px',
                    right: '20%',
                    zIndex: 1
                  }
                ].map((mentor, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    sx={{
                      position: 'absolute',
                      top: mentor.top,
                      right: mentor.right,
                      width: '90%',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 2,
                      p: 2.5,
                      zIndex: mentor.zIndex,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 4,
                        zIndex: 5
                      }
                    }}
                    onClick={() => {
                      const element = document.getElementById(`mentor-${index}`);
                      if (element) {
                        const cards = document.querySelectorAll('[id^="mentor-"]');
                        cards.forEach(card => {
                          card.style.zIndex = '1';
                        });
                        element.style.zIndex = '5';
                      }
                    }}
                    id={`mentor-${index}`}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={mentor.avatar}
                        alt={mentor.name}
                        sx={{
                          width: 70,
                          height: 70,
                          border: `3px solid ${mentor.color}`,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {mentor.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {mentor.university} | {mentor.field}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic' }}>
                      {mentor.quote}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Global Opportunities Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'rgba(255, 245, 235, 0.7)' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <Stack spacing={3}>
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Learn & Explore<br />
                    Global<br />
                    Opportunities
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Stack spacing={2.5}>
                      {[
                        'Discover exclusive programs for Zambian students.',
                        'Apply for leadership & academic opportunities like Model UN, Yale Young African Scholars, and more.',
                        'Gain exposure to top universities and career pathways.'
                      ].map((text, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              minWidth: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'warning.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5
                            }}
                          >
                            <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              lineHeight: 1.6
                            }}
                          >
                            {text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      color="warning"
                      startIcon={<SvgIcon name="tabler-world" size={20} />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        bgcolor: '#ff9800',
                        boxShadow: '0 8px 16px rgba(255, 152, 0, 0.3)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          bgcolor: '#f57c00',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 20px rgba(255, 152, 0, 0.4)'
                        }
                      }}
                    >
                      Explore Opportunities
                    </Button>
                  </Box>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right side - Interactive Timeline */}
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', height: 500, overflow: 'hidden' }}>
                {/* Timeline line */}
                <Box
                  component={motion.div}
                  initial={{ height: 0 }}
                  whileInView={{ height: '90%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  sx={{
                    position: 'absolute',
                    left: '15%',
                    top: '5%',
                    width: 4,
                    height: '90%',
                    background: 'linear-gradient(180deg, #FF9800 0%, #2196F3 100%)',
                    borderRadius: 4,
                    zIndex: 1
                  }}
                />

                {/* Opportunity Cards */}
                {[
                  {
                    title: 'Model United Nations',
                    description: 'Develop leadership and diplomacy skills',
                    deadline: 'Applications open',
                    color: '#4CAF50',
                    icon: <PublicIcon />,
                    delay: 0.3,
                    top: '10%'
                  },
                  {
                    title: 'Yale Young African Scholars',
                    description: 'Academic & leadership program',
                    deadline: 'Deadline: March 2024',
                    color: '#2196F3',
                    icon: <SchoolIcon />,
                    delay: 0.5,
                    top: '30%',
                    highlight: true
                  },
                  {
                    title: 'African Leadership Academy',
                    description: 'Two-year pre-university program',
                    deadline: 'Next cohort: Sept 2024',
                    color: '#9C27B0',
                    icon: <GroupsIcon />,
                    delay: 0.7,
                    top: '50%'
                  },
                  {
                    title: 'University Scholarships',
                    description: 'Full-ride opportunities worldwide',
                    deadline: 'Multiple deadlines',
                    color: '#FF9800',
                    icon: <EmojiEventsIcon />,
                    delay: 0.9,
                    top: '70%'
                  }
                ].map((opportunity, index) => (
                  <Box
                    component={motion.div}
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: opportunity.delay, duration: 0.5 }}
                    sx={{
                      position: 'absolute',
                      left: '25%',
                      top: opportunity.top,
                      width: '70%',
                      zIndex: 2
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: opportunity.highlight
                          ? `0 8px 24px ${opportunity.color}40`
                          : '0 4px 12px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.02)',
                          boxShadow: `0 12px 28px ${opportunity.color}40`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: `${opportunity.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: opportunity.color
                            }}
                          >
                            {opportunity.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {opportunity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {opportunity.description}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: opportunity.highlight ? opportunity.color : 'text.secondary'
                              }}
                            >
                              <AccessTimeIcon sx={{ fontSize: 16 }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: opportunity.highlight ? 600 : 400
                                }}
                              >
                                {opportunity.deadline}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: opportunity.color
                            }}
                          >
                            <ChevronRightIcon />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.neutral' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    mb: 4,
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Why Skutopia<br />Stands Out
                </Typography>

                <Stack spacing={3}>
                  {[
                    {
                      icon: <ExtensionIcon />,
                      color: '#4CAF50',
                      title: 'Interactive Learning',
                      description: 'Learn through hands-on problem-solving, not just lectures.'
                    },
                    {
                      icon: <MenuBookIcon />,
                      color: '#2196F3',
                      title: 'Zambia-Focused',
                      description: 'Tailored for Zambia – designed to match the ECZ curriculum.'
                    },
                    {
                      icon: <WifiOffIcon />,
                      color: '#FF9800',
                      title: 'Learn Anywhere',
                      description: 'Offline access & minimal data usage for learning anywhere.'
                    },
                    {
                      icon: <ShowChartIcon />,
                      color: '#9C27B0',
                      title: 'Adaptive Learning',
                      description: 'Personalized learning that adapts to your progress.'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'background.paper',
                            transform: 'translateX(8px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${feature.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: feature.color,
                            flexShrink: 0
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 0.5,
                              fontWeight: 600,
                              color: feature.color
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.6
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<RocketLaunchIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)'
                      }
                    }}
                  >
                    Start Learning for Free
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* Right side - Dynamic visuals */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: '600px' }}>
                {/* Background decoration */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  sx={{
                    position: 'absolute',
                    top: '5%',
                    right: '10%',
                    width: '80%',
                    height: '90%',
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Device frame */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      height: '70%',
                      borderRadius: 3,
                      border: '12px solid #333',
                      bgcolor: 'background.paper',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Screen content */}
                    <Box sx={{ p: 2, height: '100%' }}>
                      {/* Progress bar */}
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: '75%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                      >
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'success.main',
                            borderRadius: 4,
                            mb: 2
                          }}
                        />
                      </motion.div>

                      {/* Content blocks */}
                      {[...Array(3)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + index * 0.2 }}
                        >
                          <Box
                            sx={{
                              height: 40,
                              bgcolor: 'grey.100',
                              borderRadius: 1,
                              mb: 2
                            }}
                          />
                        </motion.div>
                      ))}

                      {/* Interactive elements */}
                      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        {[...Array(4)].map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                            style={{ flex: 1 }}
                          >
                            <Box
                              sx={{
                                height: 60,
                                bgcolor: index === 1 ? 'primary.main' : 'grey.100',
                                borderRadius: 2
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Floating elements */}
                  {[
                    { icon: <WifiOffIcon />, color: '#FF9800', top: '10%', left: '10%' },
                    { icon: <ShowChartIcon />, color: '#4CAF50', top: '20%', right: '15%' },
                    { icon: <ExtensionIcon />, color: '#2196F3', bottom: '15%', left: '15%' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.5 + index * 0.2 }}
                      style={{
                        position: 'absolute',
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        bottom: item.bottom
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: `${item.color}15`,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 4px 12px ${item.color}40`
                        }}
                      >
                        {item.icon}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
