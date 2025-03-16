'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';

/***************************  COURSE PREVIEW  ***************************/

export default function CoursePreview({ heading, subheading, courses, viewAllBtn }) {
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
            <Typography variant="h2">{heading}</Typography>
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
        
        <Grid container spacing={3}>
          {courses.map((course, index) => (
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
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    },
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      height: 180,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${course.color}.lighter`,
                    }}
                  >
                    <SvgIcon name={course.icon} size={80} color={`${course.color}.main`} />
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={course.subject} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${course.color}.lighter`, 
                            color: `${course.color}.main`, 
                            fontWeight: 500 
                          }} 
                        />
                        <Chip 
                          label={`${course.lessons} Lessons`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Stack>
                      
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>{course.title}</Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <SvgIcon name="tabler-3d-cube-sphere" size={16} color="primary.main" />
                          <Typography variant="caption">{course.models} 3D Models</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <SvgIcon name="tabler-cards" size={16} color="primary.main" />
                          <Typography variant="caption">{course.flashcards} Flashcards</Typography>
                        </Stack>
                      </Stack>
                      
                      <Button 
                        variant="contained" 
                        fullWidth 
                        href={`/courses/${course.id}`}
                        endIcon={<SvgIcon name="tabler-arrow-right" size={16} color="background.paper" />}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Explore
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <ButtonAnimationWrapper>
            <Button
              variant="contained"
              size="large"
              endIcon={<SvgIcon name="tabler-arrow-right" size={16} color="background.default" />}
              {...viewAllBtn}
            />
          </ButtonAnimationWrapper>
        </Box>
      </Stack>
    </ContainerWrapper>
  );
}

CoursePreview.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  courses: PropTypes.array,
  viewAllBtn: PropTypes.object
}; 