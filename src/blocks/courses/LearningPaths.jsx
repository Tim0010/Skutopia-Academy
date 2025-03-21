'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';

// @components
import CourseCard from './components/CourseCard';

/***************************  LEARNING PATHS  ***************************/

const LearningPaths = (props) => {
  const { heading, subheading, staticFiles } = props;
  const { data } = staticFiles;

  return (
    <Container component="section" sx={{ py: 8 }}>
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: { xs: 5, md: 0 } }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 1.2,
                mb: 2
              }}
            >
              LEARNING PATHS
            </Typography>
            
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #095F52, #0E7C6B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              {heading}
            </Typography>
            
            <Box>
              {subheading}
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Box sx={{ position: 'relative' }}>
            <Stack spacing={3}>
              {Object.keys(data).slice(0, 2).map((category, index) => (
                <Box key={category}>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: index % 2 === 0 ? 'primary.main' : 'secondary.main'
                    }}
                  >
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {data[category].lessons.map((lesson) => (
                      <Grid item xs={12} sm={6} md={4} key={`${category}-${lesson.title}`}>
                        <CourseCard lesson={lesson} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

LearningPaths.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.node,
  staticFiles: PropTypes.object.isRequired
};

export default LearningPaths;

// Video Courses Animation Component
function VideoCoursesAnimation() {
  const theme = useTheme();

  // Animation variants for text content
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for images
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: i => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2 * i,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Concept illustrations
  const concepts = [
    {
      id: 1,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3C!-- Grid lines --%3E%3Cpath d='M30,100 L270,100' stroke='%23E0E0E0' stroke-width='1'/%3E%3Cpath d='M150,30 L150,170' stroke='%23E0E0E0' stroke-width='1'/%3E%3C!-- Grid marks --%3E%3Cpath d='M90,98 L90,102' stroke='%23BDBDBD' stroke-width='1'/%3E%3Cpath d='M210,98 L210,102' stroke='%23BDBDBD' stroke-width='1'/%3E%3Cpath d='M148,60 L152,60' stroke='%23BDBDBD' stroke-width='1'/%3E%3Cpath d='M148,140 L152,140' stroke='%23BDBDBD' stroke-width='1'/%3E%3C!-- Axes --%3E%3Cpath d='M30,100 L270,100' stroke='%23333' stroke-width='2' marker-end='url(%23arrowhead)'/%3E%3Cpath d='M150,170 L150,30' stroke='%23333' stroke-width='2' marker-end='url(%23arrowhead)'/%3E%3C!-- Arrowheads --%3E%3Cdefs%3E%3Cmarker id='arrowhead' markerWidth='10' markerHeight='7' refX='9' refY='3.5' orient='auto'%3E%3Cpolygon points='0 0, 10 3.5, 0 7' fill='%23333'/%3E%3C/marker%3E%3C/defs%3E%3C!-- Axis labels --%3E%3Ctext x='265' y='90' font-family='Arial' font-size='14' fill='%23333'%3Ex%3C/text%3E%3Ctext x='155' y='40' font-family='Arial' font-size='14' fill='%23333'%3Ey%3C/text%3E%3Ctext x='90' y='95' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3E-2%3C/text%3E%3Ctext x='210' y='95' font-family='Arial' font-size='10' fill='%23666' text-anchor='middle'%3E2%3C/text%3E%3Ctext x='140' y='63' font-family='Arial' font-size='10' fill='%23666' text-anchor='end'%3E2%3C/text%3E%3Ctext x='140' y='143' font-family='Arial' font-size='10' fill='%23666' text-anchor='end'%3E-2%3C/text%3E%3Ctext x='155' y='115' font-family='Arial' font-size='10' fill='%23666'%3EO%3C/text%3E%3C!-- Point and radius --%3E%3Ccircle cx='150' cy='100' r='3' fill='%23333'/%3E%3Ccircle cx='210' cy='60' r='5' fill='%234285F4'/%3E%3Cline x1='150' y1='100' x2='210' y2='60' stroke='%234285F4' stroke-width='2' stroke-dasharray='4,2'/%3E%3Ctext x='175' y='75' font-family='Arial' font-size='12' fill='%234285F4' font-weight='bold'%3Er%3C/text%3E%3Ctext x='215' y='55' font-family='Arial' font-size='12' fill='%234285F4'%3EP(2,2)%3C/text%3E%3C!-- Circle --%3E%3Ccircle cx='150' cy='100' r='60' fill='none' stroke='%234285F4' stroke-width='2' stroke-dasharray='5,3'/%3E%3C!-- Title --%3E%3Ctext x='150' y='25' font-family='Arial' font-size='16' font-weight='bold' fill='%23333' text-anchor='middle'%3ECoordinate System%3C/text%3E%3C/svg%3E",
      alt: "Coordinate system with axes, grid, point and radius"
    },
    {
      id: 2,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Cpath d='M50,150 L150,50 L250,150 Z' fill='%23FBBC05' stroke='%23333' stroke-width='2'/%3E%3Cline x1='150' y1='50' x2='150' y2='150' stroke='%23333' stroke-width='2' stroke-dasharray='5,5'/%3E%3Ctext x='155' y='110' font-family='Arial' font-size='12' fill='%23333'%3Eh%3C/text%3E%3Ctext x='190' y='160' font-family='Arial' font-size='12' fill='%23333'%3Eb%3C/text%3E%3Ctext x='100' y='160' font-family='Arial' font-size='12' fill='%23333'%3Eb%3C/text%3E%3Ctext x='140' y='180' font-family='Arial' font-size='14' font-weight='bold' fill='%23333'%3ETriangle Area%3C/text%3E%3C/svg%3E",
      alt: "Triangle with height and base labeled"
    },
    {
      id: 3,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ccircle cx='100' cy='100' r='40' fill='%23EA4335' opacity='0.7'/%3E%3Ccircle cx='150' cy='100' r='40' fill='%2334A853' opacity='0.7'/%3E%3Ccircle cx='200' cy='100' r='40' fill='%234285F4' opacity='0.7'/%3E%3Ctext x='80' y='90' font-family='Arial' font-size='10' fill='white'%3EA%3C/text%3E%3Ctext x='150' y='90' font-family='Arial' font-size='10' fill='white'%3EB%3C/text%3E%3Ctext x='200' y='90' font-family='Arial' font-size='10' fill='white'%3EC%3C/text%3E%3Ctext x='115' y='105' font-family='Arial' font-size='10' fill='white'%3EA∩B%3C/text%3E%3Ctext x='165' y='105' font-family='Arial' font-size='10' fill='white'%3EB∩C%3C/text%3E%3Ctext x='140' y='120' font-family='Arial' font-size='10' fill='white'%3EA∩B∩C%3C/text%3E%3Ctext x='150' y='180' font-family='Arial' font-size='14' font-weight='bold' fill='%23333'%3ESets%3C/text%3E%3C/svg%3E",
      alt: "Venn diagram showing set intersections"
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left side - Text content */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Stack spacing={3} sx={{ pr: { md: 4 } }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Interactive Learning
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.6
                }}
              >
                Our interactive lessons simplify even the toughest topics, with instant feedback to boost your learning.
              </Typography>

              <Box sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SvgIcon name="tabler-player-play" size={18} />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Explore Courses
                </Button>
              </Box>
            </Stack>
          </motion.div>
        </Grid>

        {/* Right side - Concept illustrations */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 400, md: 450 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.id}
                custom={index}
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3 }
                }}
                style={{
                  position: 'absolute',
                  top: `${index * 12 + 15}%`,
                  left: `${index * 8 + 10}%`,
                  zIndex: 3 - index,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                <Box
                  component="img"
                  src={concept.image}
                  alt={concept.alt}
                  sx={{
                    width: { xs: 260, md: 300 },
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </motion.div>
            ))}

            {/* Background grid pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.3,
                zIndex: 0
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
} 