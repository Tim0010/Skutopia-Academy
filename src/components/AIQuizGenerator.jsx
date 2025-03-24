'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Slider
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';

/**
 * AI Quiz Generator Component
 * Allows instructors to generate quizzes using AI based on STEM topics
 * @param {Object} props - Component props
 * @param {Function} props.onQuizGenerated - Callback function when quiz is generated
 * @param {string} props.courseTopic - Current course topic (optional)
 * @param {number} props.courseGradeLevel - Current grade level (optional)
 */
export default function AIQuizGenerator({ onQuizGenerated, courseTopic = '', courseGradeLevel = '' }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    topic: courseTopic,
    gradeLevel: courseGradeLevel,
    difficulty: 'medium',
    questionCount: 5
  });

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const gradeLevelOptions = [
    { value: 8, label: 'Grade 8' },
    { value: 9, label: 'Grade 9' },
    { value: 10, label: 'Grade 10' },
    { value: 11, label: 'Grade 11' },
    { value: 12, label: 'Grade 12' }
  ];

  /**
   * Handle dialog open
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle slider change for question count
   */
  const handleSliderChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      questionCount: newValue
    }));
  };

  /**
   * Generate quiz using AI
   */
  const handleGenerateQuiz = async () => {
    // Validate form data
    if (!formData.topic || !formData.gradeLevel || !formData.difficulty) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call AI API to generate quiz questions
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_quiz',
          quizTopic: formData.topic,
          quizGradeLevel: formData.gradeLevel,
          difficulty: formData.difficulty,
          count: formData.questionCount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      // Call the callback function with generated quiz questions
      if (onQuizGenerated && Array.isArray(data.questions)) {
        const formattedQuiz = {
          title: `${formData.topic} - ${formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)} Quiz`,
          description: `AI-generated quiz on ${formData.topic} for grade ${formData.gradeLevel} students`,
          difficulty: formData.difficulty,
          time_limit: formData.questionCount * 60, // 60 seconds per question
          passing_score: 70,
          questions: data.questions
        };
        
        onQuizGenerated(formattedQuiz);
        handleClose();
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<SvgIcon name="tabler-brain" />}
        onClick={handleOpen}
      >
        Generate AI Quiz
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Generate AI Quiz</DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Our AI will generate a custom quiz based on your specifications, 
              tailored for Zambian STEM curriculum.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              name="topic"
              label="Topic"
              fullWidth
              required
              value={formData.topic}
              onChange={handleChange}
              placeholder="E.g., Chemical Reactions"
              disabled={loading}
              helperText="Be specific for better questions"
            />

            <FormControl fullWidth required>
              <InputLabel id="grade-level-label">Grade Level</InputLabel>
              <Select
                labelId="grade-level-label"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                label="Grade Level"
                disabled={loading}
              >
                {gradeLevelOptions.map((grade) => (
                  <MenuItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                label="Difficulty"
                disabled={loading}
              >
                {difficultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>
                Number of Questions: {formData.questionCount}
              </Typography>
              <Slider
                value={formData.questionCount}
                onChange={handleSliderChange}
                min={3}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                disabled={loading}
              />
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateQuiz} 
            variant="contained" 
            color="primary"
            disabled={loading || !formData.topic || !formData.gradeLevel || !formData.difficulty}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 