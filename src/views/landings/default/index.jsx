'use client';

// @project
import { Feature20 } from '@/blocks/feature';
import { Hero17 } from '@/blocks/hero';
import LazySection from '@/components/LazySection';
import useDataThemeMode from '@/hooks/useDataThemeMode';
import { About1 } from '@/blocks/about';
import { Features1 } from '@/blocks/features';
import { Cta1 } from '@/blocks/cta';
import { CoursePreview, LearningPaths } from '@/blocks/courses';
import { StudyModes } from '@/blocks/study';
import { StatsCounter } from '@/blocks/stats';
import { Box, SvgIcon, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import React, { useState } from 'react';

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
        captionLine="INTERACTIVE STEM LEARNING - Learn by solving problems and master concepts through practice"
        primaryBtn={{ children: 'Get started', href: '/auth/register' }}
        listData={[
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
        heading="Master STEM topics step-by-step"
        subheading="Follow structured learning paths designed by educators from top Zambian universities"
        paths={[
          {
            id: 'algebra',
            title: 'Algebra Essentials',
            description: 'From basic equations to quadratics and beyond, build fundamental math skills with interactive problems.',
            icon: 'tabler-math',
            color: 'primary',
            completed: 3,
            total: 12
          },
          {
            id: 'physics-mechanics',
            title: 'Physics Mechanics',
            description: 'Understand the principles of motion, forces, and energy through interactive 3D simulations.',
            icon: 'tabler-atom',
            color: 'info',
            completed: 2,
            total: 10
          },
          {
            id: 'programming',
            title: 'Intro to Programming',
            description: 'Learn coding fundamentals with Python through bite-sized interactive lessons and challenges.',
            icon: 'tabler-code',
            color: 'success',
            completed: 5,
            total: 15
          }
        ]}
      />
      
      <StudyModes
        heading="Multiple ways to learn"
        subheading="Choose the study mode that works best for you"
        modes={[
          {
            id: 'flashcards',
            title: 'Flashcards',
            description: 'Review concepts with digital flashcards that adapt to your learning speed.',
            icon: 'tabler-cards',
            color: 'primary'
          },
          {
            id: 'learn',
            title: 'Learn',
            description: 'Interactive lessons that combine theory with practical exercises.',
            icon: 'tabler-bulb',
            color: 'success'
          },
          {
            id: 'practice',
            title: 'Practice',
            description: 'Solve problems with instant feedback to master concepts.',
            icon: 'tabler-writing',
            color: 'info'
          },
          {
            id: 'quiz',
            title: 'Quiz',
            description: 'Test your knowledge with adaptive quizzes for national exam preparation.',
            icon: 'tabler-checklist',
            color: 'warning'
          },
          {
            id: 'match',
            title: 'Match',
            description: 'Race against the clock to match terms with definitions in this game.',
            icon: 'tabler-puzzle',
            color: 'secondary'
          },
          {
            id: 'challenge',
            title: 'Challenge',
            description: 'Compete with friends or classmates in timed STEM challenges.',
            icon: 'tabler-trophy',
            color: 'error'
          }
        ]}
      />
      
      <StatsCounter
        heading="Empowering Zambian students through interactive STEM learning"
        stats={[
          {
            icon: 'tabler-users',
            value: '25K+',
            label: 'Active students'
          },
          {
            icon: 'tabler-book',
            value: '125+',
            label: 'Interactive lessons'
          },
          {
            icon: 'tabler-cards',
            value: '8.5K+',
            label: 'Flashcards created'
          },
          {
            icon: 'tabler-certificate',
            value: '92%',
            label: 'Exam pass rate'
          }
        ]}
      />
      
      <About1
        image={null}
        imageComponent={
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.lighter',
              borderRadius: 4,
              p: 4
            }}
          >
            <SvgIcon name="tabler-school" size={120} color="primary.main" />
          </Box>
        }
        headingLine="What makes us different?"
        textLines={[
          "Learn through interactive problem-solving, not passive lectures.",
          "Content designed specifically for the Zambian curriculum and context.",
          "Works offline and uses minimal data for reliable access everywhere.",
          "Personalized learning paths that adapt to your progress and needs."
        ]}
        primaryBtn={{ children: 'Get started free', href: '/auth/register' }}
      />
      
      <CoursePreview
        heading="Popular Courses"
        subheading="Interactive STEM learning aligned with Zambian curriculum"
        courses={[
          {
            id: 'math-101',
            title: 'Algebra Fundamentals',
            description: 'Interactive 3D models with real-world Zambian examples.',
            subject: 'Mathematics',
            color: 'primary',
            icon: 'tabler-math',
            lessons: 12,
            models: 8,
            flashcards: 45
          },
          {
            id: 'science-101',
            title: 'Ecology of Zambia',
            description: 'Explore local biodiversity through interactive models.',
            subject: 'Biology',
            color: 'success',
            icon: 'tabler-dna',
            lessons: 10,
            models: 15,
            flashcards: 38
          },
          {
            id: 'physics-101',
            title: 'Mechanics & Motion',
            description: 'Physics concepts applied to Zambian industrial contexts.',
            subject: 'Physics',
            color: 'warning',
            icon: 'tabler-atom',
            lessons: 14,
            models: 12,
            flashcards: 50
          }
        ]}
        viewAllBtn={{ 
          children: 'All Courses', 
          href: '/courses' 
        }}
      />
      
      <Features1
        heading="Key Features"
        subheading="Tailored for Zambian students' unique educational needs"
        features={[
          {
            title: "Curriculum Aligned",
            description: "Content matched to Zambian national curriculum standards.",
            icon: "tabler-book",
            color: "primary"
          },
          {
            title: "Low Data Usage",
            description: "Optimized for areas with limited connectivity.",
            icon: "tabler-wifi",
            color: "success"
          },
          {
            title: "Local Context",
            description: "Examples based on Zambian scenarios and applications.",
            icon: "tabler-map-pin",
            color: "warning"
          },
          {
            title: "Offline Access",
            description: "Download lessons for learning without internet.",
            icon: "tabler-download",
            color: "info"
          },
          {
            title: "Expert Mentors",
            description: "Connect with Zambian STEM professionals.",
            icon: "tabler-users",
            color: "secondary"
          },
          {
            title: "Multi-language",
            description: "Available in English and major Zambian languages.",
            icon: "tabler-language",
            color: "error"
          }
        ]}
      />
      
      <Cta1
        heading="Join the STEM Revolution"
        description="Access personalized learning tools designed for Zambian students"
        primaryBtn={{ 
          children: 'Student Access', 
          href: '/auth/register', 
          icon: 'tabler-user-plus' 
        }}
        secondaryBtn={{ 
          children: 'Educator Portal', 
          href: '/auth/register?role=educator' 
        }}
        bgColor="primary.lighter"
      />

      {/* Subject Topics Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Explore STEM Topics
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Discover our comprehensive curriculum across all STEM disciplines
        </Typography>
        
        <Grid container spacing={4}>
          {Object.entries(subjectsData).map(([subject, data]) => {
            // Define icon and color based on subject
            let icon, color;
            switch(subject) {
              case 'Mathematics':
                icon = 'tabler-math';
                color = 'primary';
                break;
              case 'Science':
                icon = 'tabler-flask';
                color = 'success';
                break;
              case 'Technology':
                icon = 'tabler-device-laptop';
                color = 'info';
                break;
              case 'Engineering':
                icon = 'tabler-tool';
                color = 'warning';
                break;
              default:
                icon = 'tabler-book';
                color = 'secondary';
            }
            
            return (
              <Grid item xs={12} md={6} key={subject}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${color}.lighter`,
                          color: `${color}.main`,
                          borderRadius: 2,
                          mr: 2
                        }}
                      >
                        <SvgIcon name={icon} size={28} />
                      </Box>
                      <Typography variant="h4" color={`${color}.main`}>
                        {subject}
                      </Typography>
                    </Box>
                    
                    {data.topics.map((topic, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="h6">
                          {topic.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {topic.description}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/cta').then((module) => ({ default: module.Cta5 })), props: cta5 },
          { importFunc: () => import('@/blocks/faq').then((module) => ({ default: module.Faq6 })), props: faq }
        ]}
        offset="200px"
      />
    </>
  );
}
