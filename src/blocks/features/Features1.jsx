'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import { IconCard } from '@/components/cards';
import SvgIcon from '@/components/SvgIcon';

/***************************  FEATURES - 1  ***************************/

export default function Features1({ heading, subheading, features }) {
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
          {features.map((feature, index) => (
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
                <IconCard
                  icon={
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${feature.color}.lighter`,
                        color: `${feature.color}.main`,
                        mb: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <SvgIcon name={feature.icon} size={32} />
                    </Box>
                  }
                  title={
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  }
                  content={
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  }
                  sx={{ 
                    height: '100%', 
                    p: 2.5, 
                    borderRadius: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                    },
                  }}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </ContainerWrapper>
  );
}

Features1.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  features: PropTypes.array
}; 