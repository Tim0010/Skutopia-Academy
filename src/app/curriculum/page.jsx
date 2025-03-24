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
    grade: 'Grades 8-10',
    modules: [
      'STEM Foundations',
      'Programming Fundamentals',
      'Applied Mathematics',
      'Scientific Investigations'
    ]
  },
  {
    grade: 'Grades 11-12',
    modules: [
      'Advanced Coding and App Development',
      'Engineering Design Process',
      'Scientific Research Methods',
      'Applied Mathematics in STEM'
    ]
  }
];

const CurriculumPage = () => {
  return (
    <Box sx={{ py: 0, bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Hero Section - Split layout */}
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
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                STEM Curriculum
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                color="text.primary"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  lineHeight: 1.4
                }}
              >
                Skutopia's curriculum provides Zambian students in grades 8–12 with essential hands-on STEM skills.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '1.1rem',
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}
              >
                Through engaging lessons and practical challenges, our curriculum helps Zambian students build essential STEM skills, enhance problem-solving abilities, and develop a passion for learning. 
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '1.1rem',
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}
              >
                Designed specifically for grades 8-12, our program fosters curiosity, critical thinking, and collaboration while aligning with Zambian educational standards.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  mb: { xs: 4, md: 0 },
                  borderRadius: 2
                }}
              >
                Explore our curriculum
              </Button>
            </motion.div>
          </Box>
        </Container>

        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            position: 'relative',
            bgcolor: 'primary.light',
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

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 5, md: 8 },
          px: { xs: 2, md: 3 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* STEM Subjects Section */}
          <Box sx={{ py: { xs: 5, md: 8 }, mb: 4 }}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.3
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
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
                px: 2,
                lineHeight: 1.6
              }}
            >
              Aligned with Zambia's curriculum standards, our hands-on STEM program builds critical thinking and problem-solving skills tailored specifically for grades 8–12.
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
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          align="center" 
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          {subject.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          align="center"
                          sx={{ lineHeight: 1.6 }}
                        >
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
          <Box sx={{ py: { xs: 5, md: 8 } }}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.3
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
                mx: 'auto',
                px: 2,
                lineHeight: 1.6
              }}
            >
              Our curriculum is designed specifically for Zambian students, offering age-appropriate challenges aligned with the national education standards.
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
                        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                          {grade.modules.map((module, idx) => (
                            <Typography 
                              component="li" 
                              variant="body1" 
                              key={idx}
                              sx={{ 
                                py: 1,
                                display: 'flex',
                                alignItems: 'center',
                                lineHeight: 1.5,
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
          
          {/* Local Context Section */}
          <Box sx={{ py: { xs: 5, md: 8 } }}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.3
              }}
            >
              Zambian STEM Innovation
            </Typography>
            
            <Typography
              variant="h6"
              component="p"
              align="center"
              color="text.secondary"
              sx={{
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                px: 2,
                lineHeight: 1.6
              }}
            >
              Our curriculum incorporates local challenges and opportunities, connecting STEM education to real Zambian contexts and industries.
            </Typography>
            
            <Grid container spacing={4}>
              {zambianContexts.map((context, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: 2,
                        boxShadow: 2,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 4
                        },
                        transition: 'transform 0.3s, box-shadow 0.3s'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '100%', sm: '33%' },
                          minHeight: { xs: 200, sm: 'auto' }
                        }}
                      >
                        <Image
                          src={context.image}
                          alt={context.title}
                          fill
                          style={{
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flex: '1 1 auto', p: 3 }}>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}
                        >
                          {context.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ mb: 2, lineHeight: 1.6 }}
                        >
                          {context.description}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          <strong>Skills developed:</strong>
                          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                            {context.skills.map((skill, idx) => (
                              <Box component="li" key={idx} sx={{ mb: 0.5 }}>
                                {skill}
                              </Box>
                            ))}
                          </Box>
                        </Typography>
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
                  fontWeight: 700,
                  lineHeight: 1.3
                }}
              >
                Resources for Educators
              </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                align="center"
                sx={{ 
                  mb: 5,
                  maxWidth: '800px',
                  mx: 'auto',
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                Access everything you need to successfully implement our curriculum in your classroom, with resources specifically designed for the Zambian education context.
              </Typography>
              
              <Grid container spacing={3} justifyContent="center">
                {teacherResources.map((resource, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                    }}>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        {resource.icon}
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                          {resource.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
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
          <Box sx={{ textAlign: 'center', py: { xs: 5, md: 8 } }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.3
              }}
            >
              Ready to Transform STEM Education?
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p"
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Join hundreds of Zambian educators who are elevating STEM education with our comprehensive curriculum designed for local classrooms.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
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
                View Implementation Guide
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