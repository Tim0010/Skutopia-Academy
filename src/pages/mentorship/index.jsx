'use client';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { motion } from 'framer-motion';

// Components
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

const benefits = [
  {
    icon: 'tabler-users-group',
    title: 'Personalized Matching',
    description: 'Get matched with mentors who align with your academic interests and career goals',
    color: 'primary'
  },
  {
    icon: 'tabler-target-arrow',
    title: 'Career Guidance',
    description: 'Receive expert guidance on career paths and opportunities in your field of interest',
    color: 'info'
  },
  {
    icon: 'tabler-school',
    title: 'Academic Support',
    description: 'Get advice on university applications, course selection, and study strategies',
    color: 'success'
  },
  {
    icon: 'tabler-bulb',
    title: 'Skills Development',
    description: 'Learn essential skills and get practical insights from experienced professionals',
    color: 'warning'
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "My mentor helped me discover my passion for engineering and guided me through university applications.",
    name: "Chanda M.",
    role: "First-year Engineering Student",
    avatar: null
  },
  {
    quote: "The mentorship program connected me with a professional who helped shape my career path in medicine.",
    name: "Mulenga K.",
    role: "Medical School Applicant",
    avatar: null
  },
  {
    quote: "Having a mentor who understands the challenges I face as a student has been invaluable for my growth.",
    name: "Thandiwe N.",
    role: "Secondary School Student",
    avatar: null
  }
];

export default function MentorshipPage() {
  const theme = useTheme();

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.primary.darker} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.lighter} 100%)`,
          color: 'white',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 10 },
          overflow: 'hidden',
        }}
      >
        {/* Abstract shapes in background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0.7, scale: 0.8 }}
              animate={{ 
                opacity: [0.7, 0.4, 0.7], 
                scale: [0.8, 1.2, 0.8],
                x: [0, index % 2 ? 20 : -20, 0],
                y: [0, index % 3 ? 30 : -30, 0],
              }}
              transition={{ 
                duration: 15 + index * 2, 
                ease: "easeInOut", 
                repeat: Infinity,
                delay: index * 2
              }}
              sx={{
                position: 'absolute',
                width: { xs: 200, md: 300 + index * 50 },
                height: { xs: 200, md: 300 + index * 50 },
                borderRadius: '50%',
                background: `rgba(255,255,255,0.1)`,
                filter: 'blur(40px)',
                top: `${(index * 15) % 80}%`,
                left: `${(index * 20) % 80}%`,
              }}
            />
          ))}
        </Box>

        <ContainerWrapper sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.8) 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Connect with Mentors Who Shape Your Future
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    sx={{ 
                      mb: 3, 
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      maxWidth: '90%'
                    }}
                  >
                    Get personalized guidance from experienced university students and professionals who understand your journey. Our mentorship program connects Zambian secondary school students with mentors who share your interests and aspirations.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      href="/mentorship/match"
                      sx={{ 
                        py: 1.5, 
                        px: 3,
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      startIcon={<SvgIcon name="tabler-user-search" size={20} />}
                    >
                      Find Your Mentor
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      href="/mentorship/become-mentor"
                      sx={{ 
                        py: 1.5, 
                        px: 3,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                      startIcon={<SvgIcon name="tabler-user-plus" size={20} />}
                    >
                      Become a Mentor
                    </Button>
                  </Stack>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <AvatarGroup max={4} sx={{ mr: 2 }}>
                      {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                        <Avatar 
                          key={i} 
                          sx={{ 
                            bgcolor: `${['primary', 'info', 'success', 'warning', 'error'][i]}.main`,
                            border: '2px solid white'
                          }}
                        >
                          {letter}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Join 200+ students already matched with mentors
                    </Typography>
                  </Box>
                </motion.div>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 400 },
                    width: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4,
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Grid container spacing={3}>
                      {[
                        { icon: 'tabler-user-circle', label: 'Create Profile' },
                        { icon: 'tabler-arrows-right-left', label: 'Get Matched' },
                        { icon: 'tabler-message-circle', label: 'Connect & Learn' }
                      ].map((step, index) => (
                        <Grid item xs={4} key={index}>
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                          >
                            <Stack 
                              spacing={2} 
                              alignItems="center" 
                              sx={{ 
                                p: 2, 
                                height: '100%',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  transform: 'translateY(-5px)'
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  color: 'white',
                                  fontSize: '1.5rem',
                                  fontWeight: 'bold',
                                  mb: 1,
                                }}
                              >
                                <SvgIcon name={step.icon} size={30} />
                              </Box>
                              <Typography 
                                variant="body1" 
                                component="div"
                                sx={{ 
                                  fontWeight: 600, 
                                  textAlign: 'center',
                                  color: 'white'
                                }}
                              >
                                {step.label}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                component="div"
                                sx={{ 
                                  fontSize: '0.8rem', 
                                  textAlign: 'center',
                                  color: 'rgba(255,255,255,0.7)'
                                }}
                              >
                                Step {index + 1}
                              </Typography>
                            </Stack>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </ContainerWrapper>
      </Box>

      {/* Benefits Section with Cards */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={3} sx={{ mb: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h2" 
              component="h2"
              sx={{ 
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                fontWeight: 700,
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'primary.main'
                }
              }}
            >
              Why Join Our Mentorship Program?
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="body1" component="div" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', mt: 4 }}>
              Our program is designed to help you navigate your academic and career journey with confidence, supported by experienced mentors who understand your goals.
            </Typography>
          </motion.div>
        </Stack>

        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    p: 2.5,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    overflow: 'visible',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      bgcolor: `${benefit.color}.main`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      mx: 'auto',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: 1.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${benefit.color}.lighter`,
                      color: `${benefit.color}.main`,
                    }}
                  >
                    <SvgIcon name={benefit.icon} size={24} />
                  </Box>
                  <Typography variant="h6" component="div" sx={{ mb: 0.75, fontWeight: 600, fontSize: '1rem' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.neutral', py: { xs: 6, md: 10 } }}>
        <ContainerWrapper>
          <Stack spacing={3} sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h2" 
                component="h2"
                sx={{ 
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                  fontWeight: 700,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'primary.main'
                  }
                }}
              >
                Student Success Stories
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography variant="body1" component="div" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', mt: 4 }}>
                Hear from students who have transformed their academic and career journeys through our mentorship program.
              </Typography>
            </motion.div>
          </Stack>

          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid key={index} item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      },
                    }}
                  >
                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                      <SvgIcon name="tabler-quote" size={32} />
                    </Box>
                    <Typography 
                      variant="body2" 
                      component="div"
                      sx={{ 
                        mb: 2, 
                        fontStyle: 'italic',
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        lineHeight: 1.5
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: `${['primary', 'info', 'success'][index]}.main`,
                          width: 40,
                          height: 40
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </ContainerWrapper>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <ContainerWrapper>
          <Stack spacing={3} sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h2" 
                component="h2"
                sx={{ 
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                  fontWeight: 700,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'primary.main'
                  }
                }}
              >
                How Our Matching System Works
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography variant="body1" component="div" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', mt: 4 }}>
                Our intelligent matching system connects you with mentors based on your interests, academic goals, and career aspirations.
              </Typography>
            </motion.div>
          </Stack>

          <Grid container spacing={3}>
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Tell us about your interests, academic goals, and career aspirations',
                icon: 'tabler-user-circle',
                color: 'primary'
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our system finds mentors who align with your goals and interests',
                icon: 'tabler-arrows-right-left',
                color: 'info'
              },
              {
                step: '03',
                title: 'Connect & Learn',
                description: 'Start your mentorship journey with scheduled sessions and guidance',
                icon: 'tabler-message-circle',
                color: 'success'
              }
            ].map((step, index) => (
              <Grid key={index} item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'visible',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -16,
                        left: -16,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${step.color}.main`,
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {step.step}
                    </Box>
                    <Box
                      sx={{
                        mb: 2,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${step.color}.lighter`,
                        color: `${step.color}.main`,
                      }}
                    >
                      <SvgIcon name={step.icon} size={24} />
                    </Box>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {step.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              sx={{
                mt: 6,
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h4" component="div" sx={{ mb: 1.5, fontWeight: 700 }}>
                Ready to Start Your Mentorship Journey?
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 3, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
                Join our community of students and mentors today and take the first step toward achieving your academic and career goals.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="medium"
                  href="/mentorship/match"
                  sx={{ 
                    py: 1, 
                    px: 3,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  startIcon={<SvgIcon name="tabler-user-search" size={18} />}
                >
                  Find Your Mentor
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  href="/mentorship/become-mentor"
                  sx={{ 
                    py: 1, 
                    px: 3,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                  startIcon={<SvgIcon name="tabler-user-plus" size={18} />}
                >
                  Become a Mentor
                </Button>
              </Stack>
            </Card>
          </motion.div>
        </ContainerWrapper>
      </Box>
    </>
  );
} 