'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsCard from '@/components/cards/GraphicsCard';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  ABOUT - 1  ***************************/

export default function About1({ heading, btnProps, imageProps, benefitHeading, benefits }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Container component="section" sx={{ py: 8 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack spacing={4}>
            <Box>
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
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(45deg, #095F52, #0E7C6B)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {heading?.title}
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: 'easeInOut'
                }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                  {heading?.subtitle}
                </Typography>
              </motion.div>
            </Box>
            
            {btnProps && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: 'easeInOut'
                }}
              >
                <ButtonAnimationWrapper>
                  <Button
                    variant="contained"
                    color={btnProps?.color || "primary"}
                    href={btnProps?.href}
                    endIcon={<SvgIcon name="tabler-arrow-right" size={16} color="background.default" />}
                  >
                    {btnProps?.label}
                  </Button>
                </ButtonAnimationWrapper>
              </motion.div>
            )}
            
            {benefitHeading && benefits && benefits.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    color: 'text.primary' 
                  }}
                >
                  {benefitHeading.title}
                </Typography>
                
                <Grid container spacing={2}>
                  {benefits.map((benefit) => (
                    <Grid item xs={12} sm={6} key={benefit.id}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          height: '100%', 
                          borderRadius: 2,
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                          }
                        }}
                      >
                        <Box sx={{ mb: 1.5 }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <GraphicsCard
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.08)',
                  height: { xs: 300, md: 460 }
                }}
              >
                <Box 
                  component="img" 
                  src={imageProps?.src} 
                  alt={imageProps?.alt || "About Us"} 
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }} 
                />
              </GraphicsCard>
              
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  opacity: 0.1,
                  zIndex: -1
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  opacity: 0.1,
                  zIndex: -1
                }}
              />
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}

About1.propTypes = {
  heading: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string
  }),
  btnProps: PropTypes.shape({
    label: PropTypes.string,
    href: PropTypes.string,
    color: PropTypes.string
  }),
  imageProps: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string
  }),
  benefitHeading: PropTypes.shape({
    title: PropTypes.string
  }),
  benefits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      icon: PropTypes.node
    })
  )
}; 