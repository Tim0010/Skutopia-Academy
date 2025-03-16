'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

// Sample flashcard decks
const sampleDecks = [
  {
    id: 1,
    title: 'Biology Essentials',
    description: 'Key concepts for biology exams',
    cardCount: 42,
    subject: 'Science',
    color: 'success',
    icon: 'tabler-dna',
    tags: ['Biology', 'Science', 'Exams']
  },
  {
    id: 2,
    title: 'Mathematics Formulas',
    description: 'Essential formulas for mathematics',
    cardCount: 35,
    subject: 'Mathematics',
    color: 'primary',
    icon: 'tabler-math',
    tags: ['Math', 'Formulas', 'Algebra']
  },
  {
    id: 3,
    title: 'Chemistry Elements',
    description: 'Periodic table and element properties',
    cardCount: 28,
    subject: 'Science',
    color: 'info',
    icon: 'tabler-flask',
    tags: ['Chemistry', 'Elements', 'Science']
  },
  {
    id: 4,
    title: 'English Literature',
    description: 'Key themes and characters from classic novels',
    cardCount: 50,
    subject: 'Literature',
    color: 'warning',
    icon: 'tabler-book',
    tags: ['English', 'Literature', 'Novels']
  },
  {
    id: 5,
    title: 'Computer Science',
    description: 'Programming concepts and algorithms',
    cardCount: 45,
    subject: 'Technology',
    color: 'error',
    icon: 'tabler-code',
    tags: ['Programming', 'Algorithms', 'CS']
  },
  {
    id: 6,
    title: 'Geography',
    description: 'Countries, capitals and landmarks',
    cardCount: 32,
    subject: 'Social Studies',
    color: 'secondary',
    icon: 'tabler-world',
    tags: ['Geography', 'Countries', 'Maps']
  }
];

// Sample featured flashcards
const featuredFlashcards = [
  {
    id: 1,
    question: 'What is photosynthesis?',
    answer: 'The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.',
    deck: 'Biology Essentials',
    color: 'success'
  },
  {
    id: 2,
    question: 'What is the quadratic formula?',
    answer: 'x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0',
    deck: 'Mathematics Formulas',
    color: 'primary'
  },
  {
    id: 3,
    question: 'What is the chemical symbol for gold?',
    answer: 'Au (from the Latin word "aurum")',
    deck: 'Chemistry Elements',
    color: 'info'
  }
];

export default function FlashcardsPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [flipped, setFlipped] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFlipCard = (id) => {
    setFlipped(flipped === id ? null : id);
  };

  const handleNextCard = () => {
    setFlipped(null);
    setCurrentCardIndex((prev) => (prev + 1) % featuredFlashcards.length);
  };

  const handlePrevCard = () => {
    setFlipped(null);
    setCurrentCardIndex((prev) => (prev - 1 + featuredFlashcards.length) % featuredFlashcards.length);
  };

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.primary.darker} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.lighter} 100%)`,
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 },
          overflow: 'hidden',
        }}
      >
        {/* Abstract shapes in background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0.7, scale: 0.8 }}
              animate={{ 
                opacity: [0.7, 0.4, 0.7], 
                scale: [0.8, 1.2, 0.8],
                x: [0, index % 2 ? 20 : -20, 0],
                y: [0, index % 3 ? 30 : -30, 0],
              }}
              transition={{ 
                duration: 15 + index * 2, 
                ease: "easeInOut", 
                repeat: Infinity,
                delay: index * 2
              }}
              sx={{
                position: 'absolute',
                width: { xs: 200, md: 300 + index * 50 },
                height: { xs: 200, md: 300 + index * 50 },
                borderRadius: '50%',
                background: `rgba(255,255,255,0.1)`,
                filter: 'blur(40px)',
                top: `${(index * 15) % 80}%`,
                left: `${(index * 20) % 80}%`,
              }}
            />
          ))}
        </Box>

        <ContainerWrapper sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '2.25rem', md: '3rem' },
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.8) 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Master Any Subject with Flashcards
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    sx={{ 
                      mb: 3, 
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      maxWidth: '90%'
                    }}
                  >
                    Create, study, and share flashcards to improve your learning. Our flashcard system helps you memorize information effectively and ace your exams.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      href="/flashcards/create"
                      sx={{ 
                        py: 1.25, 
                        px: 3,
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      startIcon={<SvgIcon name="tabler-plus" size={20} />}
                    >
                      Create Flashcards
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      href="/flashcards/browse"
                      sx={{ 
                        py: 1.25, 
                        px: 3,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                      startIcon={<SvgIcon name="tabler-search" size={20} />}
                    >
                      Browse Flashcards
                    </Button>
                  </Stack>
                </motion.div>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 280, md: 340 },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      style={{ 
                        position: 'absolute',
                        width: '100%',
                        maxWidth: 450,
                        margin: '0 auto'
                      }}
                    >
                      <Card
                        onClick={() => handleFlipCard(featuredFlashcards[currentCardIndex].id)}
                        sx={{
                          p: 4,
                          height: { xs: 220, md: 260 },
                          width: '100%',
                          borderRadius: 2,
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          transform: flipped === featuredFlashcards[currentCardIndex].id ? 'rotateY(180deg)' : 'rotateY(0)',
                          bgcolor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            zIndex: 1,
                            transform: flipped === featuredFlashcards[currentCardIndex].id ? 'rotateY(180deg)' : 'rotateY(0)',
                          }}
                        >
                          <Chip 
                            label={featuredFlashcards[currentCardIndex].deck} 
                            size="small" 
                            color={featuredFlashcards[currentCardIndex].color}
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                        
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                          }}
                        >
                          <Typography 
                            variant="h4" 
                            component="div" 
                            sx={{ 
                              color: 'text.primary',
                              fontWeight: 600,
                              textAlign: 'center',
                              mb: 2
                            }}
                          >
                            {featuredFlashcards[currentCardIndex].question}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            component="div" 
                            sx={{ 
                              color: 'text.secondary',
                              textAlign: 'center',
                              fontStyle: 'italic'
                            }}
                          >
                            (Click to reveal answer)
                          </Typography>
                        </Box>
                        
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                          }}
                        >
                          <Typography 
                            variant="body1" 
                            component="div" 
                            sx={{ 
                              color: 'text.primary',
                              textAlign: 'center',
                              fontWeight: 500
                            }}
                          >
                            {featuredFlashcards[currentCardIndex].answer}
                          </Typography>
                        </Box>
                      </Card>
                    </motion.div>
                  </AnimatePresence>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <IconButton
                      onClick={handlePrevCard}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'white',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <SvgIcon name="tabler-chevron-left" />
                    </IconButton>
                    <IconButton
                      onClick={handleNextCard}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'white',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <SvgIcon name="tabler-chevron-right" />
                    </IconButton>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </ContainerWrapper>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        {/* Search and Filter */}
        <Box sx={{ mb: 5 }}>
          <TextField
            fullWidth
            placeholder="Search for flashcards..."
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon name="tabler-search" size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 3,
                py: 1,
                borderRadius: 2,
                mr: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
              },
              '& .Mui-selected': {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              },
            }}
          >
            <Tab label="All Subjects" />
            <Tab label="Science" />
            <Tab label="Mathematics" />
            <Tab label="Literature" />
            <Tab label="Technology" />
            <Tab label="Social Studies" />
          </Tabs>
        </Box>

        {/* Flashcard Decks */}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3,
            fontWeight: 700,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              borderRadius: 1.5,
              bgcolor: 'primary.main'
            }
          }}
        >
          Popular Flashcard Decks
        </Typography>

        <Grid container spacing={3}>
          {sampleDecks.map((deck) => (
            <Grid key={deck.id} item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: deck.id * 0.05 }}
              >
                <Card
                  sx={{
                    p: 2.5,
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 4,
                      height: '100%',
                      bgcolor: `${deck.color}.main`,
                    }
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${deck.color}.lighter`,
                        color: `${deck.color}.main`,
                      }}
                    >
                      <SvgIcon name={deck.icon} size={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                        {deck.title}
                      </Typography>
                      <Typography variant="body2" component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1.5 }}>
                        {deck.description}
                      </Typography>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" component="div" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {deck.cardCount} cards
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ 
                            color: `${deck.color}.main`,
                            fontWeight: 600,
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              bgcolor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Study
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Create Your Own Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="div" sx={{ mb: 1.5, fontWeight: 700 }}>
                    Create Your Own Flashcards
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 3, opacity: 0.9 }}>
                    Customize your learning experience by creating your own flashcard decks. Add images, formulas, and organize them by subject to study more effectively.
                  </Typography>
                  <Button
                    variant="contained"
                    size="medium"
                    href="/flashcards/create"
                    sx={{ 
                      py: 1, 
                      px: 3,
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                    startIcon={<SvgIcon name="tabler-plus" size={18} />}
                  >
                    Create New Deck
                  </Button>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    <SvgIcon name="tabler-cards" size={120} sx={{ color: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ mt: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 40,
                height: 3,
                borderRadius: 1.5,
                bgcolor: 'primary.main'
              }
            }}
          >
            How to Use Flashcards
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                step: '01',
                title: 'Create or Choose a Deck',
                description: 'Create your own flashcards or select from our library of pre-made decks',
                icon: 'tabler-cards',
                color: 'primary'
              },
              {
                step: '02',
                title: 'Study and Review',
                description: 'Flip through cards, mark difficult ones, and track your progress',
                icon: 'tabler-book',
                color: 'info'
              },
              {
                step: '03',
                title: 'Test Your Knowledge',
                description: 'Take quizzes based on your flashcards to reinforce learning',
                icon: 'tabler-writing',
                color: 'success'
              }
            ].map((step, index) => (
              <Grid key={index} item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'visible',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -16,
                        left: -16,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${step.color}.main`,
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {step.step}
                    </Box>
                    <Box
                      sx={{
                        mb: 2,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${step.color}.lighter`,
                        color: `${step.color}.main`,
                      }}
                    >
                      <SvgIcon name={step.icon} size={24} />
                    </Box>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {step.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
} 