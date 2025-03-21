'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  MobileStepper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Image from 'next/image';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import InteractiveVisualization from './InteractiveVisualization';

/**
 * Component to render course content blocks
 * Supports: text, image, video, quiz, and interactive blocks
 */
const CourseContentRenderer = ({ blocks = [], title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const maxSteps = blocks.length;
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // Reset quiz state when moving to next step
    setQuizResults({});
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // Reset quiz state when moving to previous step
    setQuizResults({});
  };
  
  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };
  
  const handleQuizSubmit = (questions) => {
    const results = {};
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      const isCorrect = quizAnswers[index] === question.answer;
      results[index] = {
        isCorrect,
        correctAnswer: question.answer
      };
      
      if (isCorrect) correctCount++;
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    setQuizResults({
      details: results,
      score,
      total: questions.length,
      correct: correctCount
    });
  };
  
  // Render the content based on block type
  const renderContent = (block) => {
    if (!block) return null;
    
    switch (block.type) {
      case 'text':
        return (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2 
            }}
          >
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
              {block.data.content}
            </Typography>
          </Paper>
        );
        
      case 'image':
        return (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                maxWidth: 800,
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              <img
                src={block.data.url}
                alt={block.data.caption || "Course image"}
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
              {block.data.caption && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1,
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  {block.data.caption}
                </Typography>
              )}
            </Box>
          </Paper>
        );
        
      case 'video':
        return (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: 1
              }}
            >
              <iframe
                src={block.data.url}
                title="Video content"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              ></iframe>
            </Box>
          </Paper>
        );
        
      case 'quiz':
        return (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quiz
            </Typography>
            
            {(block.data.questions || []).map((question, qIndex) => (
              <Box key={qIndex} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {qIndex + 1}. {question.question}
                </Typography>
                
                <Box sx={{ ml: 2 }}>
                  {question.options.map((option, oIndex) => (
                    <Box 
                      key={oIndex} 
                      sx={{ 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant={quizAnswers[qIndex] === oIndex ? 'contained' : 'outlined'}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        disabled={Object.keys(quizResults).length > 0}
                        sx={{ 
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          width: '100%',
                          backgroundColor: 
                            quizResults.details && 
                            quizResults.details[qIndex] &&
                            quizResults.details[qIndex].correctAnswer === oIndex ? 
                            'success.light' : 
                            (quizResults.details && 
                             quizResults.details[qIndex] && 
                             quizAnswers[qIndex] === oIndex && 
                             !quizResults.details[qIndex].isCorrect ? 
                             'error.light' : undefined),
                        }}
                      >
                        {option}
                      </Button>
                    </Box>
                  ))}
                </Box>
                
                {quizResults.details && quizResults.details[qIndex] && (
                  <Box 
                    sx={{ 
                      mt: 1,
                      p: 1,
                      bgcolor: quizResults.details[qIndex].isCorrect ? 'success.light' : 'error.light',
                      borderRadius: 1,
                      color: quizResults.details[qIndex].isCorrect ? 'success.contrastText' : 'error.contrastText'
                    }}
                  >
                    <Typography variant="body2">
                      {quizResults.details[qIndex].isCorrect ? 
                        'Correct!' : 
                        `Incorrect. The correct answer is: ${question.options[question.answer]}`}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
            
            {Object.keys(quizResults).length > 0 ? (
              <Box 
                sx={{ 
                  mt: 3,
                  p: 2, 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6">
                  Your Score: {quizResults.score}%
                </Typography>
                <Typography variant="body2">
                  You got {quizResults.correct} out of {quizResults.total} questions correct.
                </Typography>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleQuizSubmit(block.data.questions || [])}
                disabled={Object.keys(quizAnswers).length !== (block.data.questions || []).length}
                sx={{ mt: 2 }}
              >
                Submit Answers
              </Button>
            )}
          </Paper>
        );
        
      case 'interactive':
        return (
          <Box sx={{ mt: 2, mb: 2 }}>
            <InteractiveVisualization 
              type={block.data.type || 'graph'}
              config={block.data.config ? JSON.parse(block.data.config) : {}}
              height={400}
            />
          </Box>
        );
        
      default:
        return (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography color="error">
              Unknown content type: {block.type}
            </Typography>
          </Paper>
        );
    }
  };
  
  if (!blocks || blocks.length === 0) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No content available
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {title && (
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}
      
      {!isMobile && (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {blocks.map((block, index) => (
            <Step key={index}>
              <StepLabel>{`Step ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {renderContent(blocks[activeStep])}
      </Box>
      
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ 
          maxWidth: 800, 
          mx: 'auto',
          mt: 3,
          bgcolor: 'transparent' 
        }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button 
            size="small" 
            onClick={handleBack} 
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default CourseContentRenderer; 