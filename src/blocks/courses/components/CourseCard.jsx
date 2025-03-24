import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Stack, Typography, Rating, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GradeIcon from '@mui/icons-material/Grade';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';

const CourseCard = ({ lesson }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        ease: 'easeOut'
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
          },
          position: 'relative'
        }}
      >
        <Box
          sx={{
            height: 160,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            component="img"
            src={lesson.image || '/assets/images/hero/stem-education.jpg'}
            alt={lesson.title}
            onError={(e) => {
              e.target.src = '/assets/images/hero/stem-education.jpg';
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'background.paper',
              color: lesson.color,
              borderRadius: 1,
              py: 0.5,
              px: 1.5,
              fontWeight: 600,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {lesson.level}
          </Box>
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              mb: 1.5,
              lineHeight: 1.3,
              minHeight: 42
            }}
          >
            {lesson.title}
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                {lesson.duration}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Rating
                value={lesson.rating}
                precision={0.1}
                size="small"
                readOnly
                sx={{ fontSize: 14 }}
              />
              <Typography variant="caption" color="text.secondary">
                ({lesson.reviews})
              </Typography>
            </Box>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            color={lesson.color === '#0E7C6B' ? 'primary' : 'secondary'}
            size="small"
            endIcon={<ChevronRightIcon />}
            sx={{ mt: 1, py: 0.75 }}
          >
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

CourseCard.propTypes = {
  lesson: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    image: PropTypes.string,
    color: PropTypes.string
  }).isRequired
};

export default CourseCard; 