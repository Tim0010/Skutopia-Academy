'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  CircularProgress,
  IconButton
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AI Tutor component for answering student questions
 * @param {Object} props - Component props
 * @param {string} props.courseId - Current course ID
 * @param {string} props.topic - Current topic being studied
 * @param {number} props.gradeLevel - Student grade level
 */
export default function AITutor({ courseId, topic, gradeLevel }) {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Send student question to the AI tutor and get a response
   */
  const askQuestion = async () => {
    if (!question.trim()) return;
    
    // Add user question to conversation
    const newMessage = { role: 'user', content: question };
    setConversation(prev => [...prev, newMessage]);
    
    try {
      setIsLoading(true);
      // Call AI API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer_question',
          question,
          currentTopic: topic,
          studentGradeLevel: gradeLevel,
          userId: user?.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add AI response to conversation
        setConversation(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        // Handle error
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: `Sorry, I'm having trouble answering your question. Please try again later. (Error: ${data.error})` 
        }]);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your question. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  /**
   * Handle Enter key press to submit question
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  /**
   * Toggle expanded state of the tutor
   */
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        width: isExpanded ? 350 : 60,
        height: isExpanded ? 500 : 60,
        borderRadius: isExpanded ? 2 : '50%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: isExpanded ? 2 : 0,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          cursor: 'pointer',
          height: isExpanded ? 'auto' : 60,
          width: '100%'
        }}
        onClick={toggleExpanded}
      >
        {isExpanded ? (
          <>
            <Typography variant="h6">AI Study Assistant</Typography>
            <IconButton size="small" sx={{ color: 'white' }}>
              <SvgIcon name="tabler-x" />
            </IconButton>
          </>
        ) : (
          <SvgIcon name="tabler-robot" size={30} />
        )}
      </Box>
      
      {isExpanded && (
        <>
          {/* Conversation Area */}
          <Box 
            sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: 'background.default'
            }}
          >
            {conversation.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <SvgIcon name="tabler-message-circle-question" size={40} sx={{ color: 'primary.main', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Ask me any questions about {topic || 'your lessons'}!
                </Typography>
              </Box>
            ) : (
              conversation.map((msg, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                      mr: msg.role === 'user' ? 0 : 1,
                      ml: msg.role === 'user' ? 1 : 0
                    }}
                  >
                    {msg.role === 'user' ? (
                      <SvgIcon name="tabler-user" size={20} />
                    ) : (
                      <SvgIcon name="tabler-robot" size={20} />
                    )}
                  </Avatar>
                  <Paper 
                    variant="outlined"
                    sx={{ 
                      p: 1.5, 
                      maxWidth: '75%',
                      bgcolor: msg.role === 'user' ? 'primary.lighter' : 'grey.100',
                      borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0'
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))
            )}
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography variant="body2" color="text.secondary">Thinking...</Typography>
              </Box>
            )}
          </Box>
          
          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              InputProps={{
                endAdornment: (
                  <Button 
                    disabled={!question.trim() || isLoading}
                    onClick={askQuestion}
                    color="primary"
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <SvgIcon name="tabler-send" />
                  </Button>
                )
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
} 