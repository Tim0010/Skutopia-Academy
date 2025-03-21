'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';

/***************************  TEST YOURSELF  ***************************/

export default function TestYourself({ heading, subheading, question }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedValue, setSelectedValue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const handleChange = (event) => {
    if (!hasSubmitted) {
      setSelectedValue(event.target.value);
    }
  };
  
  const handleSubmit = () => {
    setHasSubmitted(true);
  };
  
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
              {subheading}
            </Typography>
          </motion.div>
        </Stack>
        
        <Card 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            mx: 'auto',
            maxWidth: 800
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {question.text}
              </Typography>
              
              {question.image && (
                <Box
                  component="img"
                  src={question.image}
                  alt="Question illustration"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 2,
                    my: 2
                  }}
                />
              )}
              
              <FormControl>
                <RadioGroup
                  value={selectedValue}
                  onChange={handleChange}
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option.id}
                      control={<Radio />}
                      label={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: hasSubmitted ? 
                              (option.id === question.correctAnswer ? 'success.main' : 
                               option.id === selectedValue ? 'error.main' : 'text.primary') : 
                              'text.primary',
                            fontWeight: hasSubmitted && option.id === question.correctAnswer ? 600 : 400
                          }}
                        >
                          {option.text}
                        </Typography>
                      }
                      sx={{
                        py: 1,
                        px: 2,
                        my: 0.5,
                        borderRadius: 2,
                        transition: 'background-color 0.3s ease',
                        bgcolor: hasSubmitted ? 
                          (option.id === question.correctAnswer ? 'success.lighter' : 
                           option.id === selectedValue ? 'error.lighter' : 'transparent') : 
                          (option.id === selectedValue ? 'grey.100' : 'transparent'),
                        '&:hover': {
                          bgcolor: hasSubmitted ? 
                            (option.id === question.correctAnswer ? 'success.lighter' : 
                             option.id === selectedValue ? 'error.lighter' : 'grey.50') : 
                            'grey.50'
                        }
                      }}
                      disabled={hasSubmitted}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              {hasSubmitted && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Explanation:
                    </Typography>
                    <Typography variant="body1">
                      {question.explanation}
                    </Typography>
                  </Stack>
                </Box>
              )}
              
              <Button
                variant="contained"
                size="large"
                disabled={!selectedValue || hasSubmitted}
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                {hasSubmitted ? 'Submitted' : 'Check Answer'}
              </Button>
              
              {hasSubmitted && (
                <Button
                  variant="outlined"
                  href="/practice"
                  endIcon={<SvgIcon name="tabler-arrow-right" size={16} />}
                >
                  Try more questions
                </Button>
              )}
            </Stack>
          </Box>
        </Card>
      </Stack>
    </ContainerWrapper>
  );
}

TestYourself.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  question: PropTypes.object
}; 