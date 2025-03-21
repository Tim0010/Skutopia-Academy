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

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';

/***************************  LEARNING PATHS  ***************************/

export default function LearningPaths({ heading, subheading, paths, animation }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ContainerWrapper>
      <Stack spacing={5} sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Stack spacing={1} sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 700 }}>{heading}</Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: 'easeInOut'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {subheading}
            </Typography>
          </motion.div>
        </Stack>

        {animation ? (
          <VideoCoursesAnimation />
        ) : (
          <Grid container spacing={2}>
            {paths && paths.map((path, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * (index % 3) + 0.2,
                    ease: 'easeInOut'
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 4,
                        width: '100%',
                        bgcolor: `${path.color}.main`,
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />

                    <Box sx={{ p: 2.5 }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${path.color}.lighter`,
                            color: `${path.color}.main`,
                            borderRadius: 1.5
                          }}
                        >
                          <SvgIcon name={path.icon} size={24} />
                        </Box>

                        <Typography
                          variant="h5"
                          component="div"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem'
                          }}
                        >
                          {path.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.875rem',
                            minHeight: 40,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {path.description}
                        </Typography>

                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {path.completed} of {path.total} completed
                            </Typography>
                            <Typography variant="caption" fontWeight={600} color={`${path.color}.main`}>
                              {Math.round((path.completed / path.total) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(path.completed / path.total) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              bgcolor: `${path.color}.lighter`,
                              '& .MuiLinearProgress-bar': {
                                bgcolor: `${path.color}.main`
                              }
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              bgcolor: `${path.color}.main`,
                              '&:hover': {
                                bgcolor: `${path.color}.dark`
                              }
                            }}
                            href={`/learn/${path.id}`}
                          >
                            Continue
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              width: 40,
                              color: `${path.color}.main`,
                              borderColor: `${path.color}.main`,
                              '&:hover': {
                                borderColor: `${path.color}.main`,
                                bgcolor: `${path.color}.lighter`
                              }
                            }}
                            href={`/learn/${path.id}/overview`}
                          >
                            <SvgIcon name="tabler-info-circle" size={16} />
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </ContainerWrapper>
  );
}

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

LearningPaths.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  paths: PropTypes.array,
  animation: PropTypes.bool
}; 