'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  STATS COUNTER  ***************************/

export default function StatsCounter({ heading, stats }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        bgcolor: 'primary.lighter', 
        py: { xs: 5, sm: 6, md: 7 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          opacity: 0.05
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: '20%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          opacity: 0.05
        }}
      />
      
      <ContainerWrapper>
        <Stack spacing={5}>
          {heading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut'
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700, 
                  textAlign: 'center',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                {heading}
              </Typography>
            </motion.div>
          )}
          
          <Grid 
            container 
            spacing={3}
            sx={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {stats.map((stat, index) => (
              <Grid 
                item 
                xs={6} 
                md={3} 
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: 'easeInOut'
                  }}
                >
                  <Stack 
                    spacing={1} 
                    sx={{ 
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <SvgIcon 
                      name={stat.icon} 
                      size={32} 
                      color="primary.main" 
                    />
                    
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'primary.main'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ maxWidth: 150 }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </motion.div>
                
                {index < stats.length - 1 && !downSM && (
                  <Divider
                    orientation="vertical"
                    sx={{
                      position: 'absolute',
                      right: -16,
                      height: '70%',
                      display: { xs: 'none', md: 'block' }
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}

StatsCounter.propTypes = {
  heading: PropTypes.string,
  stats: PropTypes.array
}; 