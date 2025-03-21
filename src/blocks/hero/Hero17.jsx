'use client';
import PropTypes from 'prop-types';

import { useEffect, useRef, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion, useScroll, useTransform } from 'framer-motion';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import StackedCards from '@/components/cards/StackedCards';

// @assets
import Wave from '@/images/graphics/Wave';

// threshold - adjust threshold as needed
const options = { root: null, rootMargin: '0px', threshold: 0.6 };

/***************************  HERO - 17  ***************************/

export default function Hero17({ chip, headLine, captionLine, primaryBtn, videoSrc, videoThumbnail, listData, image, imageAlt }) {
  const theme = useTheme();
  const boxRadius = { xs: 24, sm: 32, md: 40 };

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.4, 0.6], [0.9, 0.92, 0.94, 0.96, 1]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle video play/pause based on intersection with the viewport
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current && !isPlaying) {
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.error('Autoplay was prevented:', error);
              });
          }
        } else {
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const videoElement = videoRef.current;

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [isPlaying]);

  return (
    <>
      <Box
        sx={{
          height: { xs: 592, sm: 738, md: 878 },
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          zIndex: -1,
          borderBottomLeftRadius: boxRadius,
          borderBottomRightRadius: boxRadius,
          background: '#FFFFFF',
        }}
      />
      <ContainerWrapper sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Box ref={containerRef}>
          <Box sx={{ pb: { xs: 4, sm: 5, md: 6 } }}>
            <Stack sx={{ alignItems: 'center', gap: 2.5 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <Chip
                  variant="outlined"
                  label={
                    typeof chip.label === 'string' ? (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {chip.label}
                      </Typography>
                    ) : (
                      chip.label
                    )
                  }
                  sx={{
                    bgcolor: 'background.paper',
                    borderColor: 'divider',
                    '& .MuiChip-label': {
                      py: 0.75,
                      px: 2
                    },
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <Typography
                  variant="h1"
                  align="center"
                  sx={{
                    maxWidth: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    mb: 2
                  }}
                >
                  {headLine}
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  {captionLine}
                </Typography>
              </motion.div>
            </Stack>
            <Stack sx={{ alignItems: 'center', gap: 2, mt: { xs: 3, sm: 4, md: 5 } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <ButtonAnimationWrapper>
                  <Button
                    color="primary"
                    variant="contained"
                    {...primaryBtn}
                  />
                </ButtonAnimationWrapper>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {listData.map((item, index) => (
                    <Chip
                      key={index}
                      label={<Typography variant="caption2">{item.title}</Typography>}
                      variant="outlined"
                      icon={<GraphicsImage image={item.image} sx={{ width: 16, height: 16 }} />}
                      sx={{ height: 32, px: 1, bgcolor: 'grey.100', '& .MuiChip-label': { py: 0.75, px: 1 } }}
                    />
                  ))}
                </Stack>
              </motion.div>
            </Stack>
          </Box>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5
            }}
            style={{ scale }}
          >
            <GraphicsCard sx={{
              border: '5px solid',
              borderColor: 'grey.300',
              height: { xs: '280px', sm: '340px', md: '400px' },
              overflow: 'hidden',
              position: 'relative'
            }}>
              {image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      rotate: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 30,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                      times: [0, 0.5, 1]
                    }}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={imageAlt || 'Hero Image'}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    />
                  </motion.div>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
                      opacity: 0.5,
                      zIndex: 1
                    }}
                  />
                </motion.div>
              ) : (
                <StackedCards />
              )}
            </GraphicsCard>
          </motion.div>
        </Box>
      </ContainerWrapper>
    </>
  );
}

Hero17.propTypes = {
  chip: PropTypes.object,
  headLine: PropTypes.string,
  captionLine: PropTypes.string,
  primaryBtn: PropTypes.any,
  videoSrc: PropTypes.string,
  videoThumbnail: PropTypes.string,
  listData: PropTypes.array,
  image: PropTypes.string,
  imageAlt: PropTypes.string
};
