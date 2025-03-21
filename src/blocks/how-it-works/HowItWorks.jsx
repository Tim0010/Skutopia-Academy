'use client';

// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

// Process steps
const steps = [
  {
    number: '01',
    title: 'Personalized Learning Path',
    description: 'Take a diagnostic assessment to identify your strengths and areas for improvement. We create a customized learning path based on your goals and current knowledge level.',
    icon: 'tabler-route'
  },
  {
    number: '02',
    title: 'Interactive Learning',
    description: 'Engage with interactive lessons, videos, and simulations designed to make complex STEM concepts easy to understand. Practice with quizzes and flashcards to reinforce your learning.',
    icon: 'tabler-device-laptop'
  },
  {
    number: '03',
    title: 'Track Your Progress',
    description: 'Monitor your improvement with detailed analytics and progress tracking. See your mastery level for each topic and identify areas that need more attention.',
    icon: 'tabler-chart-line'
  },
  {
    number: '04',
    title: 'Get Expert Support',
    description: 'Connect with Zambian STEM mentors and tutors who can answer your questions, provide guidance, and help you overcome learning challenges.',
    icon: 'tabler-users'
  }
];

export default function HowItWorks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 10 },
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        position: 'relative'
      }}
    >
      <ContainerWrapper>
        <Stack spacing={4} sx={{ mb: 8, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              mx: 'auto',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                backgroundColor: 'secondary.main',
                borderRadius: 2,
              }
            }}
          >
            How It Works
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Our platform makes STEM learning effective, engaging, and tailored to Zambian students
          </Typography>
        </Stack>
        
        <Box 
          sx={{ 
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              height: '100%',
              width: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: { xs: 'none', md: 'block' }
            }
          }}
        >
          {steps.map((step, index) => (
            <Grid 
              container 
              key={index} 
              spacing={4} 
              alignItems="center"
              sx={{ 
                mb: index < steps.length - 1 ? 6 : 0,
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
              }}
            >
              <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 4,
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      [index % 2 === 0 ? 'right' : 'left']: -15,
                      width: 0,
                      height: 0,
                      borderTop: '15px solid transparent',
                      borderBottom: '15px solid transparent',
                      [index % 2 === 0 ? 'borderLeft' : 'borderRight']: `15px solid ${theme.palette.background.paper}`,
                      display: { xs: 'none', md: 'block' }
                    }
                  }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      position: 'absolute',
                      top: -30,
                      [index % 2 === 0 ? 'left' : 'right']: -20,
                      fontSize: '5rem',
                      fontWeight: 800,
                      color: alpha(theme.palette.primary.main, 0.1),
                      zIndex: -1
                    }}
                  >
                    {step.number}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box 
                      sx={{ 
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        flexShrink: 0
                      }}
                    >
                      <SvgIcon name={step.icon} size={28} color="inherit" />
                    </Box>
                    
                    <Box>
                      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  sx={{ 
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mx: 'auto',
                    boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {step.number}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box 
                  sx={{ 
                    width: '100%',
                    height: 300,
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <Box 
                    component="img"
                    src={`/assets/images/how-it-works/step-${index + 1}.png`}
                    alt={step.title}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      </ContainerWrapper>
    </Box>
  );
} 