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
import { Box, SvgIcon, Typography, Container, Grid, Card, CardContent, Button, Avatar, Stack, Divider } from '@mui/material';
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
          label: 'Skutopia',
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
        captionLine="AI-powered online education platform for Zambian students in grades 8-12"
        primaryBtn={{ children: 'Get started', href: '/auth/register' }}
        image="/assets/images/hero/stem-education.jpg"
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

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Typography
                    variant="overline"
                    component="div"
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 600, 
                      letterSpacing: 1.2, 
                      mb: 1 
                    }}
                  >
                    WELCOME TO SKUTOPIA
                  </Typography>
                  
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      mb: 2,
                      background: 'linear-gradient(45deg, #095F52, #0E7C6B)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    Empower Your Academic Journey
                  </Typography>
                  
                  <Divider sx={{ width: '80px', mx: 'auto', my: 3, borderColor: 'primary.main', borderWidth: 2 }} />
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.7,
                      maxWidth: '800px',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    Our platform empowers Zambian students from grades 8 to 12 to excel academically
                    with curriculum-aligned resources and personalized learning.
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '900px', mx: 'auto' }}>
                      {[
                        {
                          icon: <SvgIcon name="tabler-book" size={24} />,
                          color: 'primary',
                          title: 'Curriculum-Aligned',
                          description: 'Study materials follow the ECZ curriculum'
                        },
                        {
                          icon: <SvgIcon name="tabler-bulb" size={24} />,
                          color: 'secondary',
                          title: 'Interactive Learning',
                          description: 'AI-powered tools for better understanding'
                        },
                        {
                          icon: <SvgIcon name="tabler-users" size={24} />,
                          color: 'info',
                          title: 'Expert Mentorship',
                          description: 'Guidance from university students and professionals'
                        },
                        {
                          icon: <SvgIcon name="tabler-certificate" size={24} />,
                          color: 'success',
                          title: 'Exam Preparation',
                          description: 'Ready for national exams and university entrance'
                        }
                      ].map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <Card
                              sx={{
                                textAlign: 'center',
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                                p: 3,
                                '&:hover': {
                                  transform: 'translateY(-8px)',
                                  boxShadow: 3
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: '50%',
                                  background: `${feature.color}.main`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  mb: 2,
                                  mx: 'auto',
                                  boxShadow: `0 6px 16px ${feature.color}.light`
                                }}
                              >
                                {feature.icon}
                              </Box>
                              <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: 600 }}
                              >
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SvgIcon name="tabler-rocket" size={20} />}
                      sx={{
                        mt: 4,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      Get Started for Free
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      
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
                    variant="overline"
                    component="div"
                    sx={{ 
                      color: 'info.main', 
                      fontWeight: 600, 
                      letterSpacing: 1.2, 
                      mb: 1
                    }}
                  >
                    OUR PLATFORM
                  </Typography>
                  
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    Learn with the Best Tools
                  </Typography>
                  
                  <Divider sx={{ width: '80px', my: 1, borderColor: 'info.main', borderWidth: 2 }} />

                  <Typography
                    variant="body1"
                    color="text.secondary" 
                    sx={{
                      fontSize: '1.1rem', 
                      lineHeight: 1.7,
                      mb: 2
                    }}
                  >
                    Learn, practice, and excel with our interactive platform. Access short courses, test your knowledge with quizzes, and use AI-generated flashcards. Get mentorship support to succeed in your studies and future career.
                  </Typography>
                  <Box sx={{ pt: 1 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="contained" 
                        color="info" 
                        endIcon={<ChevronRightIcon />}
                        size="large"
                        sx={{ px: 3, py: 1.2 }}
                      >
                        Explore Features
                      </Button>
                    </motion.div>
                  </Box>
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
                            boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible',
                            zIndex: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: `0 16px 32px ${option.color}30`,
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
                                boxShadow: `0 4px 12px ${option.color}20`,
                                border: '1px solid',
                                borderColor: `${option.color}30`
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
                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                    color: 'white',
                                    borderRadius: 5,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
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
                              fontWeight: 600,
                              color: option.color,
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {option.title}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
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

      {/* Interactive Learning Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.neutral' }}>
        <Container>
          <Grid container spacing={5} alignItems="center">
            {/* Left side content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{ 
                    color: 'secondary.main', 
                    fontWeight: 600, 
                    letterSpacing: 1.2, 
                    mb: 2 
                  }}
                >
                  INTERACTIVE EXPERIENCE
                </Typography>
                
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    mb: 3,
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  Interactive Learning<br />That Keeps You Engaged
                </Typography>
                
                <Divider sx={{ width: '80px', my: 3, borderColor: 'secondary.main', borderWidth: 2 }} />
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    mb: 4
                  }}
                >
                  Our interactive lessons simplify even the toughest topics with custom illustrations, 
                  visualizations, and instant feedback, helping you grasp complex concepts more easily and 
                  making learning both effective and enjoyable.
                </Typography>
                
                <Stack spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    'Interactive diagrams that respond to your input',
                    'Step-by-step problem-solving with guided feedback',
                    'Visual learning aids for complex STEM concepts',
                    'Practice exercises with instant corrections'
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2
                      }}
                    >
                      <Box
                        component={motion.div}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: 'secondary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 0.5,
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                        }}
                      >
                        <CheckIcon sx={{ color: 'white', fontSize: 14 }} />
                      </Box>
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Explore Courses
                </Button>
              </motion.div>
            </Grid>
            
            {/* Right side - Interactive diagram */}
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  p: 3,
                  boxShadow: 3,
                  overflow: 'hidden',
                  height: {xs: '400px', md: '500px'},
                  position: 'relative'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    textAlign: 'center',
                    color: 'secondary.main'
                  }}
                >
                  Coordinate Systems
                </Typography>
                
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Coordinate grid background */}
                  <motion.svg
                    width="100%"
                    height="85%"
                    viewBox="0 0 300 300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {/* Grid lines */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {[...Array(11)].map((_, i) => (
                        <line
                          key={`x-${i}`}
                          x1={0}
                          y1={i * 30}
                          x2={300}
                          y2={i * 30}
                          stroke="#999"
                          strokeWidth={i === 5 ? 2 : 1}
                        />
                      ))}
                      {[...Array(11)].map((_, i) => (
                        <line
                          key={`y-${i}`}
                          x1={i * 30}
                          y1={0}
                          x2={i * 30}
                          y2={300}
                          stroke="#999"
                          strokeWidth={i === 5 ? 2 : 1}
                        />
                      ))}
                    </motion.g>

                    {/* Axis labels */}
                    <motion.text
                      x="305"
                      y="150"
                      fontSize="14"
                      fill="#333"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      x
                    </motion.text>
                    <motion.text
                      x="150"
                      y="15"
                      fontSize="14"
                      fill="#333"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      y
                    </motion.text>

                    {/* Point plotting animation */}
                    <motion.circle
                      cx="210"
                      cy="90"
                      r="6"
                      fill="#1976d2"
                      initial={{ opacity: 0, r: 0 }}
                      animate={{ opacity: 1, r: 6 }}
                      transition={{ delay: 2, duration: 0.5 }}
                    />
                    <motion.line
                      x1="210"
                      y1="90"
                      x2="210"
                      y2="150"
                      stroke="#1976d2"
                      strokeWidth="2"
                      strokeDasharray="4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 2.2, duration: 0.5 }}
                    />
                    <motion.line
                      x1="210"
                      y1="90"
                      x2="150"
                      y2="90"
                      stroke="#1976d2"
                      strokeWidth="2"
                      strokeDasharray="4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 2.4, duration: 0.5 }}
                    />
                    <motion.text
                      x="215"
                      y="85"
                      fontSize="12"
                      fill="#1976d2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.6, duration: 0.5 }}
                    >
                      (2,2)
                    </motion.text>

                    {/* Second point */}
                    <motion.circle
                      cx="90"
                      cy="210"
                      r="6"
                      fill="#0E7C6B"
                      initial={{ opacity: 0, r: 0 }}
                      animate={{ opacity: 1, r: 6 }}
                      transition={{ delay: 3, duration: 0.5 }}
                    />
                    <motion.line
                      x1="90"
                      y1="210"
                      x2="90"
                      y2="150"
                      stroke="#0E7C6B"
                      strokeWidth="2"
                      strokeDasharray="4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 3.2, duration: 0.5 }}
                    />
                    <motion.line
                      x1="90"
                      y1="210"
                      x2="150"
                      y2="210"
                      stroke="#0E7C6B"
                      strokeWidth="2"
                      strokeDasharray="4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 3.4, duration: 0.5 }}
                    />
                    <motion.text
                      x="75"
                      y="225"
                      fontSize="12"
                      fill="#0E7C6B"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.6, duration: 0.5 }}
                    >
                      (-2,-2)
                    </motion.text>

                    {/* Triangle animation */}
                    <motion.line
                      x1="210"
                      y1="90"
                      x2="90"
                      y2="210"
                      stroke="#0288d1"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 4, duration: 1 }}
                    />
                    <motion.text
                      x="150"
                      y="150"
                      fontSize="12"
                      fill="#0288d1"
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5, duration: 0.5 }}
                    >
                      Distance Formula
                    </motion.text>
                  </motion.svg>

                  {/* Labels at bottom */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      textAlign: 'center',
                      p: 2
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 5.5, duration: 0.5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Try our interactive diagrams to better understand mathematical concepts
                      </Typography>
                    </motion.div>
                  </Box>
                </Box>
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
                  variant="overline"
                  component="div"
                  sx={{ 
                    color: 'secondary.main', 
                    fontWeight: 600, 
                    letterSpacing: 1.2, 
                    mb: 2 
                  }}
                >
                  EXPERT GUIDANCE
                </Typography>
                
                <Typography
                  component="h2"
                  variant="h2"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #9c27b0, #7b1fa2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                    lineHeight: 1.2
                  }}
                >
                  Find Your Mentor,<br />Shape Your Future
                </Typography>
                
                <Divider sx={{ width: '80px', my: 3, borderColor: 'secondary.main', borderWidth: 2 }} />
                
                <Box sx={{ mb: 6 }}>
                  <Stack spacing={2.5}>
                    {[
                      'Get guidance from university students and professionals in your dream career.',
                      'Learn from mentors studying at Michigan State, Whitman, WPI, Ashoka University, and more.',
                      'Ask questions, gain insights, and prepare for your future with expert advice.'
                    ].map((text, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                      >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                              width: 10,
                              height: 10,
                          borderRadius: '50%',
                              background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
                              flexShrink: 0,
                              boxShadow: '0 0 8px rgba(156, 39, 176, 0.6)'
                        }}
                      />
                          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            {text}
                      </Typography>
                    </Box>
                      </motion.div>
                    ))}
                  </Stack>
                </Box>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                <Button
                  variant="contained"
                    color="secondary"
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
                </motion.div>
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
                      borderRadius: 3,
                      boxShadow: 3,
                      p: 3,
                      zIndex: mentor.zIndex,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4,
                        zIndex: 5
                      },
                      overflow: 'hidden'
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
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${mentor.color}, ${mentor.color}80)`
                      }}
                    />
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Avatar
                        src={mentor.avatar}
                        alt={mentor.name}
                        sx={{
                          width: 70,
                          height: 70,
                          border: `3px solid ${mentor.color}`,
                          boxShadow: `0 4px 8px ${mentor.color}40`,
                        }}
                      />
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: mentor.color }}>
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
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', lineHeight: 1.7 }}>
                      "{mentor.quote}"
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Global Opportunities Section */}
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
                    variant="overline"
                    component="div"
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 600, 
                      letterSpacing: 1.2, 
                      mb: 1
                    }}
                  >
                    GLOBAL PATHWAYS
                  </Typography>
                  
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                      mb: 2
                    }}
                  >
                    Learn & Explore<br />
                    Global<br />
                    Opportunities
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Stack spacing={2.5}>
                      {[
                        'Discover exclusive programs for Zambian students.',
                        'Apply for leadership & academic opportunities like Model UN, Yale Young African Scholars, and more.',
                        'Gain exposure to top universities and career pathways.'
                      ].map((text, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            component={motion.div}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            sx={{
                              minWidth: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: 'warning.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5,
                              boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                            }}
                          >
                            <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              lineHeight: 1.7
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
                        fontWeight: 600
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
                    image: '/assets/images/Opportunities/MUN.jpg',
                    delay: 0.3,
                    top: '10%'
                  },
                  {
                    title: 'Yale Young African Scholars',
                    description: 'Academic & leadership program',
                    deadline: 'Deadline: March 2024',
                    color: '#2196F3',
                    image: '/assets/images/Opportunities/yyas.png',
                    delay: 0.5,
                    top: '30%',
                    highlight: true
                  },
                  {
                    title: 'African Leadership Academy',
                    description: 'Two-year pre-university program',
                    deadline: 'Next cohort: Sept 2024',
                    color: '#9C27B0',
                    image: '/assets/images/Opportunities/ALA.jpeg',
                    delay: 0.7,
                    top: '50%'
                  },
                  {
                    title: 'University Scholarships',
                    description: 'Full-ride opportunities worldwide',
                    deadline: 'Multiple deadlines',
                    color: '#FF9800',
                    image: '/assets/images/Opportunities/university-application.jpg',
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
                          ? `0 12px 28px ${opportunity.color}40`
                          : '0 6px 16px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: `0 16px 32px ${opportunity.color}40`
                        },
                        position: 'relative'
                      }}
                    >
                          <Box
                            sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '4px',
                          background: `linear-gradient(90deg, ${opportunity.color} 0%, ${opportunity.color}99 100%)`
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              bgcolor: `${opportunity.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              border: '1px solid',
                              borderColor: `${opportunity.color}30`
                            }}
                          >
                            <Box
                              component="img"
                              src={opportunity.image}
                              alt={opportunity.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600, 
                                mb: 0.5,
                                color: opportunity.highlight ? opportunity.color : 'text.primary'
                              }}
                            >
                              {opportunity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
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
                            component={motion.div}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
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
          <Grid container spacing={5} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{ 
                    color: 'success.main', 
                    fontWeight: 600, 
                    letterSpacing: 1.2, 
                    mb: 2 
                  }}
                >
                  OUR UNIQUE APPROACH
                </Typography>
                
                <Typography
                  variant="h2"
                  sx={{
                    mb: 4,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4caf50, #388e3c)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  Why Skutopia<br />Stands Out
                </Typography>

                <Divider sx={{ width: '80px', mb: 4, borderColor: 'success.main', borderWidth: 2 }} />

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
                      <Card
                        sx={{
                          p: 0,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            boxShadow: 3
                          },
                          position: 'relative'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            bgcolor: feature.color
                          }}
                        />
                        <CardContent sx={{ p: 3, pl: 3.5 }}>
                          <Stack direction="row" spacing={2.5} alignItems="flex-start">
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
                                flexShrink: 0,
                                boxShadow: `0 4px 12px ${feature.color}20`
                          }}
                        >
                          {feature.icon}
                        </Box>
                            <Box sx={{ flex: 1 }}>
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
                                  lineHeight: 1.7
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Stack>

                <Box sx={{ mt: 5 }}>
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
                      fontWeight: 600
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
                    boxShadow: 5,
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
                      overflow: 'hidden',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Screen content */}
                    <Box sx={{ p: 2, height: '100%' }}>
                      {/* Progress bar */}
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: '75%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                      >
                        <Box
                          sx={{
                            height: 8,
                            background: 'linear-gradient(90deg, #4caf50, #81c784)',
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
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                            width: 48,
                            height: 48,
                          borderRadius: '50%',
                          bgcolor: `${item.color}15`,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                            boxShadow: `0 6px 16px ${item.color}40`,
                            border: '2px solid',
                            borderColor: `${item.color}30`
                        }}
                      >
                        {item.icon}
                      </Box>
                      </motion.div>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <LearningPaths
        heading="Choose Your Learning Path"
        subheading={
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 2 }}>
              Our platform offers curriculum-aligned study materials for every subject:
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {['Comprehensive STEM resources aligned with ECZ curriculum', 
                'Expert mentorship from university students and professionals',
                'Interactive problem-solving and self-assessment tools',
                'Offline access for learning anytime, anywhere'].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box 
                    sx={{ 
                      minWidth: 22, 
                      height: 22, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mt: 0.5 
                    }}
                  >
                    <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<ChevronRightIcon />}
              sx={{ mt: 1 }}
            >
              Explore Features
            </Button>
          </Box>
        }
        staticFiles={{
          "data": {
            "Science": {
              "lessons": [
                {
                  "title": "Introduction to Physics",
                  "duration": "45 min",
                  "level": "Grade 8",
                  "rating": 4.9,
                  "reviews": 128,
                  "image": "/assets/images/hero/stem-education.jpg",
                  "color": "#0E7C6B"
                },
                {
                  "title": "Biology: Cell Structure",
                  "duration": "30 min",
                  "level": "Grade 9",
                  "rating": 4.8,
                  "reviews": 95,
                  "image": "/assets/images/hero/stem-education.jpg",
                  "color": "#0E7C6B"
                },
                {
                  "title": "Chemistry Fundamentals",
                  "duration": "40 min",
                  "level": "Grade 10",
                  "rating": 4.7,
                  "reviews": 112,
                  "image": "/assets/images/courses/chemistry.jpg",
                  "color": "#0E7C6B"
                }
              ]
            },
            "Technology": {
              "lessons": [
                {
                  "title": "Computer Basics",
                  "duration": "35 min",
                  "level": "Grade 8",
                  "rating": 4.9,
                  "reviews": 78,
                  "image": "/assets/images/courses/computer.jpg",
                  "color": "#1976d2"
                },
                {
                  "title": "Introduction to Programming",
                  "duration": "50 min",
                  "level": "Grade 11",
                  "rating": 4.8,
                  "reviews": 62,
                  "image": "/assets/images/courses/programming.jpg",
                  "color": "#1976d2"
                },
                {
                  "title": "Digital Literacy",
                  "duration": "25 min",
                  "level": "Grade 9",
                  "rating": 4.6,
                  "reviews": 84,
                  "image": "/assets/images/courses/digital.jpg",
                  "color": "#1976d2"
                }
              ]
            },
            "Engineering": {
              "lessons": [
                {
                  "title": "Engineering Principles",
                  "duration": "45 min",
                  "level": "Grade 10",
                  "rating": 4.7,
                  "reviews": 56,
                  "image": "/assets/images/courses/engineering.jpg",
                  "color": "#0E7C6B"
                },
                {
                  "title": "Mechanical Engineering Basics",
                  "duration": "40 min",
                  "level": "Grade 11",
                  "rating": 4.5,
                  "reviews": 42,
                  "image": "/assets/images/courses/mechanical.jpg",
                  "color": "#0E7C6B"
                },
                {
                  "title": "Electrical Circuits",
                  "duration": "35 min",
                  "level": "Grade 12",
                  "rating": 4.8,
                  "reviews": 38,
                  "image": "/assets/images/courses/electrical.jpg",
                  "color": "#0E7C6B"
                }
              ]
            },
            "Mathematics": {
              "lessons": [
                {
                  "title": "Algebra Fundamentals",
                  "duration": "40 min",
                  "level": "Grade 8",
                  "rating": 4.9,
                  "reviews": 145,
                  "image": "/assets/images/courses/algebra.jpg",
                  "color": "#1976d2"
                },
                {
                  "title": "Geometry Basics",
                  "duration": "35 min",
                  "level": "Grade 9",
                  "rating": 4.8,
                  "reviews": 112,
                  "image": "/assets/images/courses/geometry.jpg",
                  "color": "#1976d2"
                },
                {
                  "title": "Calculus Introduction",
                  "duration": "50 min",
                  "level": "Grade 12",
                  "rating": 4.7,
                  "reviews": 78,
                  "image": "/assets/images/courses/calculus.jpg",
                  "color": "#1976d2"
                }
              ]
            }
          }
        }}
      />

      <About1
        heading={{
          title: "Join the Success Academy",
          subtitle: "Our platform combines expert tutoring, adaptive learning, and comprehensive resources to empower Zambian students."
        }}
        btnProps={{
          label: "Join Now",
          href: "/auth/register",
          color: "primary"
        }}
        imageProps={{
          src: "/assets/images/curriculum/stem-learning.jpg",
          alt: "Skutopia Students"
        }}
        benefitHeading={{ title: "Why Students Love Skutopia" }}
        benefits={[
          {
            id: 1,
            title: "Curriculum-Aligned Content",
            description: "Our study materials align perfectly with the ECZ curriculum, ensuring you're prepared for your exams.",
            icon: <MenuBookIcon sx={{ color: "#0E7C6B" }} />
          },
          {
            id: 2,
            title: "Interactive Learning",
            description: "Engage with interactive content that makes complex concepts easier to understand.",
            icon: <ExtensionIcon sx={{ color: "#1976d2" }} />
          },
          {
            id: 3,
            title: "Expert Mentorship",
            description: "Connect with mentors who study at top universities locally and internationally.",
            icon: <SchoolIcon sx={{ color: "#0E7C6B" }} />
          },
          {
            id: 4,
            title: "Accessible Anywhere",
            description: "Study online or offline, with low data usage options for learning on the go.",
            icon: <WifiOffIcon sx={{ color: "#1976d2" }} />
          }
        ]}
      />

      <StatsCounter
        subtitle="Join thousands of successful students"
        title={
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #095F52, #0E7C6B)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            Our Impact in Numbers
          </Typography>
        }
        description="Skutopia is changing how Zambian students learn and prepare for their future."
        stats={[
          {
            id: 1,
            number: "5,000+",
            title: "Active Students",
            icon: <GroupsIcon sx={{ color: "#0E7C6B" }} />
          },
          {
            id: 2,
            number: "85%",
            title: "Pass Rate",
            icon: <EmojiEventsIcon sx={{ color: "#1976d2" }} />
          },
          {
            id: 3,
            number: "100+",
            title: "Expert Mentors",
            icon: <SchoolIcon sx={{ color: "#0E7C6B" }} />
          },
          {
            id: 4,
            number: "12",
            title: "Partner Universities",
            icon: <PublicIcon sx={{ color: "#1976d2" }} />
          }
        ]}
      />
    </>
  );
}
