'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SvgIcon from '@/components/SvgIcon';

const CardWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  perspective: '1500px',
}));

const StyledCard = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transformOrigin: 'center',
  backfaceVisibility: 'hidden',
  cursor: 'pointer',
  transition: 'box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 16px 32px -8px rgba(0,0,0,0.12)',
  },
}));

const cards = [
  { 
    id: 1, 
    title: 'Daily Challenge', 
    color: '#E3F2FD', 
    icon: 'tabler-brain', 
    description: 'A new STEM challenge every day to keep your skills sharp',
    question: 'Solve this algebra problem in 3 minutes or less'
  },
  { 
    id: 2, 
    title: 'Interactive Lessons', 
    color: '#E8F5E9', 
    icon: 'tabler-book', 
    description: 'Learn by doing with practical examples and immediate feedback',
    question: 'Use 3D models to understand complex concepts'
  },
  { 
    id: 3, 
    title: 'Exam Prep', 
    color: '#FFF3E0', 
    icon: 'tabler-certificate', 
    description: 'Prepare for Zambian national exams with targeted practice',
    question: 'Timed quizzes that match exam format and difficulty'
  },
  { 
    id: 4, 
    title: 'AI Tutor', 
    color: '#F3E5F5', 
    icon: 'tabler-robot', 
    description: "Get personalized help when you're stuck on a problem",
    question: 'Ask questions and receive step-by-step explanations'
  },
];

export default function StackedCards() {
  const [activeId, setActiveId] = useState(1);

  const handleCardClick = (id) => {
    setActiveId(id);
  };

  return (
    <CardWrapper>
      <AnimatePresence>
        {cards.map((card, index) => {
          const isActive = activeId === card.id;
          const cardIndex = cards.length - index;
          const zIndex = isActive ? 10 : cardIndex;
          
          // Calculate card's position in the stack
          const calcY = isActive 
            ? 0 
            : (cardIndex - (cards.length - activeId)) * 8;
          
          return (
            <StyledCard
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                backgroundColor: card.color,
                zIndex,
              }}
              animate={{
                rotateX: isActive ? '0deg' : '3deg',
                rotateZ: isActive ? '0deg' : `${(card.id - activeId) * 1.5}deg`,
                y: calcY,
                scale: isActive ? 1 : 0.97 - (Math.abs(card.id - activeId) * 0.02),
                filter: isActive ? 'brightness(1)' : 'brightness(0.97)',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 1.2,
              }}
              initial={false}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                  opacity: isActive ? 1 : 0.2,
                  transition: 'opacity 0.5s ease',
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1.5,
                transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                opacity: isActive ? 1 : 0.7,
                transition: 'all 0.3s ease',
                px: 2.5
              }}>
                <SvgIcon name={card.icon} size={isActive ? 48 : 32} color="primary.main" />
                
                <Typography
                  variant={isActive ? "h4" : "h5"}
                  sx={{
                    fontWeight: 600,
                    transition: 'font-size 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  {card.title}
                </Typography>
                
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        maxWidth: '90%',
                        mx: 'auto',
                      }}
                    >
                      {card.description}
                    </Typography>
                  </motion.div>
                )}
              </Box>
            </StyledCard>
          );
        })}
      </AnimatePresence>
    </CardWrapper>
  );
}

StackedCards.propTypes = {}; 