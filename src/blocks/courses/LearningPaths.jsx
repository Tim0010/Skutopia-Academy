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
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';

/***************************  LEARNING PATHS  ***************************/

export default function LearningPaths({ heading, subheading, paths }) {
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
        
        <Grid container spacing={2}>
          {paths.map((path, index) => (
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
      </Stack>
    </ContainerWrapper>
  );
}

LearningPaths.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  paths: PropTypes.array
}; 