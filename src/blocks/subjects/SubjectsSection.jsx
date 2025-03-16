'use client';

// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

// Subject data
const subjects = [
  {
    icon: 'tabler-math',
    title: 'Mathematics',
    description: 'Master algebra, calculus, geometry, and more with interactive lessons and practice problems.',
    topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    color: '#00447c' // primary blue
  },
  {
    icon: 'tabler-atom',
    title: 'Physics',
    description: 'Understand mechanics, electricity, waves, and modern physics through simulations and experiments.',
    topics: ['Mechanics', 'Electricity', 'Waves', 'Modern Physics'],
    color: '#00447c' // primary blue
  },
  {
    icon: 'tabler-flask',
    title: 'Chemistry',
    description: 'Learn organic, inorganic, and physical chemistry with virtual labs and molecular visualizations.',
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    color: '#00447c' // primary blue
  },
  {
    icon: 'tabler-dna',
    title: 'Biology',
    description: 'Explore cells, genetics, ecology, and human biology with detailed diagrams and case studies.',
    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology'],
    color: '#00447c' // primary blue
  },
  {
    icon: 'tabler-device-laptop-code',
    title: 'Computer Science',
    description: 'Develop programming skills, learn algorithms, and understand computer systems.',
    topics: ['Programming', 'Algorithms', 'Data Structures', 'Web Development'],
    color: '#00447c' // primary blue
  },
  {
    icon: 'tabler-building-bridge',
    title: 'Engineering',
    description: 'Introduction to various engineering disciplines with practical projects and design challenges.',
    topics: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    color: '#00447c' // primary blue
  }
];

export default function SubjectsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 10 },
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      {/* Background decorations */}
      <Box 
        sx={{
          position: 'absolute',
          top: '10%',
          right: -100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
          zIndex: 0,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: -80,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
          zIndex: 0,
        }}
      />
      
      <ContainerWrapper>
        <Stack spacing={4} sx={{ mb: 6, textAlign: 'center', maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
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
            STEM Subjects
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Comprehensive learning resources for all major STEM subjects, aligned with the Zambian curriculum
          </Typography>
        </Stack>
        
        <Grid container spacing={3}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                  },
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
                    height: 6,
                    bgcolor: 'primary.main'
                  }}
                />
                
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        mr: 2
                      }}
                    >
                      <SvgIcon name={subject.icon} size={24} color="inherit" />
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {subject.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {subject.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Key Topics:
                  </Typography>
                  
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                    {subject.topics.map((topic, idx) => (
                      <Box 
                        key={idx}
                        sx={{ 
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 10,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'text.secondary'
                        }}
                      >
                        {topic}
                      </Box>
                    ))}
                  </Stack>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    endIcon={<SvgIcon name="tabler-arrow-right" size={16} />}
                    sx={{ 
                      mt: 'auto',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Explore {subject.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ContainerWrapper>
    </Box>
  );
} 