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

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsCard from '@/components/cards/GraphicsCard';
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  ABOUT - 1  ***************************/

export default function About1({ image, imageComponent, primaryBtn, headingLine, textLines }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <ContainerWrapper>
      <Grid container spacing={5} sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack spacing={2.5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut'
              }}
            >
              <Typography variant="h2" component="div" sx={{ fontWeight: 700 }}>{headingLine}</Typography>
            </motion.div>
            <Stack spacing={1.5}>
              {textLines.map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * (index + 1),
                    ease: 'easeInOut'
                  }}
                >
                  <Typography variant="body1" component="div" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ 
                      display: 'inline-block', 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main',
                      flexShrink: 0
                    }}/>
                    {text}
                  </Typography>
                </motion.div>
              ))}
            </Stack>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: 'easeInOut'
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 2, pt: 1 }}>
                <ButtonAnimationWrapper>
                  <Button
                    variant="contained"
                    endIcon={<SvgIcon name="tabler-arrow-right" size={16} color="background.default" />}
                    {...primaryBtn}
                  />
                </ButtonAnimationWrapper>
              </Stack>
            </motion.div>
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
                  ...(downMD && { height: 300 }),
                  ...(!downMD && { height: 460 })
                }}
              >
                {imageComponent ? (
                  imageComponent
                ) : (
                  <Box 
                    component="img" 
                    src={image} 
                    alt="About Us" 
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
                )}
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
    </ContainerWrapper>
  );
}

About1.propTypes = {
  image: PropTypes.string,
  imageComponent: PropTypes.node,
  primaryBtn: PropTypes.object,
  headingLine: PropTypes.string,
  textLines: PropTypes.array
}; 