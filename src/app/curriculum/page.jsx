'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CodeIcon from '@mui/icons-material/Code';
import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SchoolIcon from '@mui/icons-material/School';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import GroupsIcon from '@mui/icons-material/Groups';
import BuildIcon from '@mui/icons-material/Build';
import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('@/views/landings/default/layout'));
const ScrollFab = dynamic(() => import('@/components/ScrollFab'));

const subjects = [
  {
    title: 'Science',
    description: 'Explore physical sciences, life sciences, and earth sciences through hands-on experiments and projects.',
    icon: <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    bgColor: 'rgba(25, 118, 210, 0.1)'
  },
  {
    title: 'Technology',
    description: 'Learn coding, robotics, and digital literacy skills with age-appropriate activities and challenges.',
    icon: <CodeIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
    bgColor: 'rgba(76, 175, 80, 0.1)'
  },
  {
    title: 'Engineering',
    description: 'Develop problem-solving and design skills through building, testing, and improving solutions.',
    icon: <BuildIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    bgColor: 'rgba(255, 152, 0, 0.1)'
  },
  {
    title: 'Mathematics',
    description: 'Master mathematical concepts through practical applications, games, and real-world examples.',
    icon: <CalculateIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
    bgColor: 'rgba(156, 39, 176, 0.1)'
  }
];

const gradeModules = [
  {
    grade: 'Pre-K to K',
    modules: [
      'Early STEM Foundations',
      'Patterns and Shapes',
      'Simple Machines',
      'Natural World Exploration'
    ]
  },
  {
    grade: 'Grades 1-2',
    modules: [
      'Building and Design Basics',
      'Coding Fundamentals',
      'Math in Motion',
      'Life Cycle Investigations'
    ]
  },
  {
    grade: '3-5',
    modules: [
      'Robotics and Automation',
      'Environmental Engineering',
      'Data Collection and Analysis',
      'Physical Science Challenges'
    ]
  },
  {
    grade: '6-8',
    modules: [
      'Advanced Coding and App Development',
      'Engineering Design Process',
      'Scientific Method and Research',
      'Mathematics in Engineering'
    ]
  }
];

const CurriculumPage = () => {
  return (
    <Box sx={{ py: 0, bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Hero Section - Split layout similar to image */}
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: { xs: 'auto', md: '580px' },
        mt: { xs: 2, md: 8 }
      }}>
        <Container 
          maxWidth={false}
          sx={{ 
            width: { xs: '100%', md: '50%' },
            py: { xs: 5, md: 8 },
            px: { xs: 3, md: 8 }
          }}
        >
          <Box sx={{ maxWidth: '600px', ml: { xs: 'auto', md: 0 }, mr: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                color="primary.main"
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.2 
                }}
              >
                Curriculum
              </Typography>
              
              <Typography 
                variant="h5" 
                component="h2"
                color="text.primary"
                sx={{ 
                  fontWeight: 600,
                  mb: 3 
                }}
              >
                Skutopia's curriculum empowers educators to bring hands-on STEM learning to Pre-K to 8th grade students.
              </Typography>
              
              <Typography 
                variant="body1"
                color="text.secondary"
                sx={{ 
                  fontSize: '1.1rem',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                With engaging lessons and creative challenges, students build essential STEM skills, develop problem-solving abilities, and foster a lifelong love for learning. Perfect for both classrooms and informal programs, our curriculum is designed to inspire curiosity, critical thinking, and collaboration.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  mb: { xs: 4, md: 0 }
                }}
              >
                Explore our units and lessons below!
              </Button>
            </motion.div>
          </Box>
        </Container>
        
        <Box 
          sx={{ 
            width: { xs: '100%', md: '50%' },
            position: 'relative',
            bgcolor: '#1976d2', // Blue background for image area
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Image
            src="/assets/images/curriculum/stem-learning.jpg"
            alt="Children engaged in STEM learning activities"
            width={800}
            height={600}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Box>
      
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* STEM Subjects Section */}
          <Box sx={{ py: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                mb: 2,
                fontWeight: 700 
              }}
            >
              Our STEM Approach
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p" 
              align="center"
              color="text.secondary"
              sx={{ 
                mb: 6,
                maxWidth: '800px',
                mx: 'auto' 
              }}
            >
              Our curriculum integrates all four STEM disciplines through engaging, hands-on activities that promote critical thinking and problem-solving.
            </Typography>
            
            <Grid container spacing={4}>
              {subjects.map((subject, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 4
                        },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '4px', 
                          width: '100%', 
                          bgcolor: 'primary.main',
                          position: 'absolute',
                          top: 0
                        }} 
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: subject.bgColor,
                            mb: 2,
                            mx: 'auto'
                          }}
                        >
                          {subject.icon}
                        </Box>
                        <Typography variant="h5" component="h3" align="center" gutterBottom>
                          {subject.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {subject.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Grade-Level Content */}
          <Box sx={{ py: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                mb: 2,
                fontWeight: 700 
              }}
            >
              Grade-Level Modules
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p" 
              align="center"
              color="text.secondary"
              sx={{ 
                mb: 6,
                maxWidth: '800px',
                mx: 'auto' 
              }}
            >
              Our curriculum is designed to grow with your students, offering age-appropriate challenges at each level.
            </Typography>
            
            <Grid container spacing={4}>
              {gradeModules.map((grade, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{
                            pb: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            color: 'primary.main',
                            fontWeight: 600
                          }}
                        >
                          {grade.grade}
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {grade.modules.map((module, idx) => (
                            <Typography 
                              component="li" 
                              variant="body1" 
                              key={idx}
                              sx={{ 
                                py: 1,
                                display: 'flex',
                                alignItems: 'center',
                                '&::before': {
                                  content: '""',
                                  display: 'inline-block',
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  mr: 2
                                }
                              }}
                            >
                              {module}
                            </Typography>
                          ))}
                        </Box>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          View Detailed Syllabus
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Teacher Resources */}
          <Box 
            sx={{ 
              py: 8, 
              px: 4,
              bgcolor: 'primary.main',
              borderRadius: 4,
              color: 'white',
              mb: 8,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                background: 'url(/assets/images/patterns/pattern-1.png) repeat',
                zIndex: 0
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  mb: 3,
                  fontWeight: 700 
                }}
              >
                Teacher Resources
              </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                align="center"
                sx={{ 
                  mb: 5,
                  maxWidth: '800px',
                  mx: 'auto',
                  opacity: 0.9
                }}
              >
                Access everything you need to successfully implement our curriculum in your classroom.
              </Typography>
              
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    height: '100%',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <SchoolIcon sx={{ fontSize: 50, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Lesson Plans</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Detailed, ready-to-use lesson plans with clear objectives and assessment strategies.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    height: '100%',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <EmojiObjectsIcon sx={{ fontSize: 50, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Activity Guides</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Step-by-step instructions for hands-on activities, experiments, and projects.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    height: '100%',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <GroupsIcon sx={{ fontSize: 50, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Professional Development</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Training resources and workshops to support effective curriculum implementation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Access Teacher Portal
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Get Started */}
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3,
                fontWeight: 700 
              }}
            >
              Ready to Get Started?
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p"
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto' 
              }}
            >
              Join thousands of educators who are transforming STEM education with our comprehensive curriculum.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Request Free Demo
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                View Pricing
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
      <ScrollFab />
    </Box>
  );
};

export default CurriculumPage; 