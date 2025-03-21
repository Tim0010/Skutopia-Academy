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

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  STUDY MODES  ***************************/

export default function StudyModes({ heading, subheading, modes }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, sm: 8, md: 10 } }}>
      <ContainerWrapper>
        <Stack spacing={5}>
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
          
          <Grid container spacing={3}>
            {modes.map((mode, index) => (
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
                      borderRadius: 3, 
                      p: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${mode.color}.lighter`,
                          color: `${mode.color}.main`,
                          borderRadius: 2
                        }}
                      >
                        <SvgIcon name={mode.icon} size={32} />
                      </Box>
                      
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {mode.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {mode.description}
                      </Typography>
                      
                      <Box sx={{ flexGrow: 1 }} />
                      
                      <Button 
                        variant="outlined" 
                        fullWidth
                        sx={{ 
                          mt: 1,
                          color: `${mode.color}.main`,
                          borderColor: `${mode.color}.main`,
                          '&:hover': {
                            borderColor: `${mode.color}.dark`,
                            bgcolor: `${mode.color}.lighter`
                          }
                        }}
                        href={`/study/${mode.id}`}
                      >
                        Try {mode.title}
                      </Button>
                    </Stack>
                    
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 80,
                        height: 80,
                        background: `linear-gradient(45deg, transparent 50%, ${mode.color}.lighter 50%)`,
                        opacity: 0.7
                      }} 
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}

StudyModes.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  modes: PropTypes.array
}; 