'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { motion } from 'framer-motion';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  CTA - 1  ***************************/

export default function Cta1({ heading, description, primaryBtn, secondaryBtn, bgColor = 'primary.lighter' }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <ContainerWrapper>
      <Box
        sx={{
          bgcolor: bgColor,
          borderRadius: 4,
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 5 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 30px rgba(0,0,0,0.05)'
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.05
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: '35%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            opacity: 0.07
          }}
        />
        
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{
            alignItems: { xs: 'start', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Stack spacing={1.5} sx={{ maxWidth: 500 }}>
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
                {description}
              </Typography>
            </motion.div>
          </Stack>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: 'easeInOut'
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                mt: { xs: 2, md: 0 },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <ButtonAnimationWrapper>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={downSM}
                  startIcon={primaryBtn.icon && <SvgIcon name={primaryBtn.icon} size={16} color="background.default" />}
                  {...primaryBtn}
                />
              </ButtonAnimationWrapper>
              
              {secondaryBtn && (
                <ButtonAnimationWrapper>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth={downSM}
                    {...secondaryBtn}
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                  />
                </ButtonAnimationWrapper>
              )}
            </Stack>
          </motion.div>
        </Stack>
      </Box>
    </ContainerWrapper>
  );
}

Cta1.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  primaryBtn: PropTypes.object,
  secondaryBtn: PropTypes.object,
  bgColor: PropTypes.string
}; 