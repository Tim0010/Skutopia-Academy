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
  Stack
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';

/**
 * AI Flashcard Generator Component
 * Allows users to generate flashcards using AI based on a topic
 * @param {Object} props - Component props
 * @param {Function} props.onFlashcardsGenerated - Callback function when flashcards are generated
 * @param {Array} props.subjects - Available subjects for selection
 * @param {Array} props.gradeLevels - Available grade levels for selection
 */
export default function AIFlashcardGenerator({ onFlashcardsGenerated, subjects = [], gradeLevels = [] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    subject: '',
    gradeLevel: '',
    count: 10
  });

  // Define default options if none provided
  const defaultSubjects = subjects.length > 0 ? subjects : [
    'Physics', 
    'Chemistry', 
    'Biology', 
    'Mathematics'
  ];

  const defaultGradeLevels = gradeLevels.length > 0 ? gradeLevels : [
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
   * Generate flashcards using AI
   */
  const handleGenerate = async () => {
    // Validate form data
    if (!formData.topic || !formData.subject || !formData.gradeLevel) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call AI API to generate flashcards
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_flashcards',
          flashcardTopic: formData.topic,
          flashcardSubject: formData.subject,
          flashcardGradeLevel: formData.gradeLevel,
          flashcardCount: formData.count
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      // Call the callback function with generated flashcards
      if (onFlashcardsGenerated && Array.isArray(data.flashcards)) {
        onFlashcardsGenerated(data.flashcards);
        handleClose();
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SvgIcon name="tabler-brain" />}
        onClick={handleOpen}
      >
        Generate AI Flashcards
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Generate AI Flashcards</DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Our AI will generate custom flashcards based on your specifications, 
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
              placeholder="E.g., Newton's Laws of Motion"
              disabled={loading}
            />

            <FormControl fullWidth required>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Subject"
                disabled={loading}
              >
                {defaultSubjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                {defaultGradeLevels.map((grade) => (
                  <MenuItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="count-label">Number of Flashcards</InputLabel>
              <Select
                labelId="count-label"
                name="count"
                value={formData.count}
                onChange={handleChange}
                label="Number of Flashcards"
                disabled={loading}
              >
                <MenuItem value={5}>5 flashcards</MenuItem>
                <MenuItem value={10}>10 flashcards</MenuItem>
                <MenuItem value={15}>15 flashcards</MenuItem>
                <MenuItem value={20}>20 flashcards</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            variant="contained" 
            color="primary"
            disabled={loading || !formData.topic || !formData.subject || !formData.gradeLevel}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 