'use client';

import { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sqlTab, setSqlTab] = useState(0);

  const runSetup = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/setup');
      const data = await response.json();
      
      setResult(data);
      
      if (!data.success) {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error running setup:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSqlTab(newValue);
  };

  const SqlTabs = () => {
    if (!result || !result.manualSql) return null;
    
    return (
      <>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Manual SQL Setup
        </Typography>
        <Typography paragraph color="text.secondary">
          If automatic setup failed, you can run these SQL statements manually in the Supabase SQL editor:
        </Typography>
        
        <Tabs 
          value={sqlTab} 
          onChange={handleTabChange}
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="lesson_progress" />
          <Tab label="user_learning_paths" />
          <Tab label="get_course_lesson_counts" />
          <Tab label="mentorship tables" />
        </Tabs>
        
        {sqlTab === 0 && (
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {result.manualSql.lesson_progress}
            </pre>
          </Box>
        )}
        
        {sqlTab === 1 && (
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {result.manualSql.user_learning_paths}
            </pre>
          </Box>
        )}
        
        {sqlTab === 2 && (
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {result.manualSql.get_course_lesson_counts}
            </pre>
          </Box>
        )}
        
        {sqlTab === 3 && (
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {result.manualSql.mentorship_tables}
            </pre>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Database Setup Utility
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography paragraph>
          This utility will create or update the necessary database tables and functions for the application to work properly.
        </Typography>
        
        <Typography paragraph>
          The following will be created:
        </Typography>
        
        <ul>
          <li>lesson_progress table</li>
          <li>user_learning_paths table</li>
          <li>get_course_lesson_counts function</li>
          <li>mentorship tables (mentors, mentor_subjects, mentor_reviews, mentorship_sessions)</li>
          <li>user_bookmarks and scholarship_bookmarks tables</li>
        </ul>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {result && result.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Setup request processed. Check the results below to verify if all components were created successfully.
          </Alert>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={runSetup}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Running Setup...' : 'Run Database Setup'}
        </Button>
      </Paper>
      
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Setup Results
          </Typography>
          
          {result.responses && result.responses.finalCheckResult && (
            <Alert 
              severity={result.responses.finalCheckResult.includes("works") ? "success" : "warning"} 
              sx={{ mb: 2 }}
            >
              {result.responses.finalCheckResult}
            </Alert>
          )}
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>View Detailed Results</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ overflowX: 'auto', backgroundColor: '#f5f5f5', padding: '10px', fontSize: '0.8rem' }}>
                {JSON.stringify(result.responses, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          
          <SqlTabs />
        </Paper>
      )}
    </Box>
  );
} 