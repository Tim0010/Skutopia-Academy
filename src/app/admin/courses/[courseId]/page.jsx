'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';

// A reusable component for content blocks in the editor
const ContentBlock = ({ type, data, onEdit, onDelete, index, Draggable, provided }) => {
  // Early return if Draggable is not yet loaded
  if (!Draggable) return null;
  
  return (
    <Draggable draggableId={`block-${index}`} index={index}>
      {(provided) => (
        <Card 
          sx={{ 
            mb: 2,
            transition: 'box-shadow 0.3s',
            '&:hover': { boxShadow: 6 }
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
                <DragIndicatorIcon color="action" />
              </Box>
              <Typography variant="subtitle1" color="primary">
                {type === 'text' && 'Text Block'}
                {type === 'image' && 'Image'}
                {type === 'video' && 'Video'}
                {type === 'quiz' && 'Quiz'}
                {type === 'interactive' && 'Interactive Visualization'}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            
            {type === 'text' && (
              <Typography variant="body2">
                {data.content.substring(0, 100)}
                {data.content.length > 100 ? '...' : ''}
              </Typography>
            )}
            
            {type === 'image' && (
              <Box>
                <img 
                  src={data.url} 
                  alt={data.caption || 'Image'} 
                  style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }} 
                />
                {data.caption && (
                  <Typography variant="caption" display="block">
                    {data.caption}
                  </Typography>
                )}
              </Box>
            )}
            
            {type === 'video' && (
              <Box>
                <Typography variant="body2">
                  Video URL: {data.url}
                </Typography>
              </Box>
            )}
            
            {type === 'quiz' && (
              <Box>
                <Typography variant="body2">
                  {data.questions?.length || 0} question(s)
                </Typography>
              </Box>
            )}
            
            {type === 'interactive' && (
              <Box>
                <Typography variant="body2">
                  {data.type} visualization
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              startIcon={<EditIcon />} 
              onClick={() => onEdit(index)}
            >
              Edit
            </Button>
            <Button 
              size="small" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={() => onDelete(index)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      )}
    </Draggable>
  );
};

// Editor for different content types
const ContentEditor = ({ type, data, onChange, onCancel, onSave }) => {
  const [content, setContent] = useState(data || {});
  
  useEffect(() => {
    setContent(data || {});
  }, [data]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...content.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setContent(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleAddQuestion = () => {
    setContent(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        { question: '', options: ['', '', '', ''], answer: 0 }
      ]
    }));
  };
  
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...content.questions];
    updatedQuestions.splice(index, 1);
    setContent(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...content.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setContent(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleSave = () => {
    onSave(content);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      {type === 'text' && (
        <TextField
          name="content"
          label="Text Content"
          value={content.content || ''}
          onChange={handleChange}
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      )}
      
      {type === 'image' && (
        <>
          <TextField
            name="url"
            label="Image URL"
            value={content.url || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            name="caption"
            label="Caption (optional)"
            value={content.caption || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {content.url && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={content.url} 
                alt={content.caption || 'Preview'} 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
              />
            </Box>
          )}
        </>
      )}
      
      {type === 'video' && (
        <TextField
          name="url"
          label="Video URL (YouTube, Vimeo, etc.)"
          value={content.url || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      )}
      
      {type === 'quiz' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Quiz Questions
          </Typography>
          
          {(content.questions || []).map((question, qIndex) => (
            <Box key={qIndex} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Question {qIndex + 1}</Typography>
                <IconButton size="small" color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <TextField
                label="Question"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Options
              </Typography>
              
              {question.options.map((option, oIndex) => (
                <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormControl sx={{ width: 120, mr: 2 }}>
                    <InputLabel id={`correct-answer-${qIndex}-${oIndex}`}>Answer</InputLabel>
                    <Select
                      labelId={`correct-answer-${qIndex}-${oIndex}`}
                      value={question.answer === oIndex ? 'correct' : 'incorrect'}
                      onChange={() => handleQuestionChange(qIndex, 'answer', oIndex)}
                      label="Answer"
                    >
                      <MenuItem value="correct">Correct</MenuItem>
                      <MenuItem value="incorrect">Incorrect</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder={`Option ${oIndex + 1}`}
                  />
                </Box>
              ))}
            </Box>
          ))}
          
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />} 
            onClick={handleAddQuestion}
            sx={{ mt: 2 }}
          >
            Add Question
          </Button>
        </Box>
      )}
      
      {type === 'interactive' && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel id="visualization-type-label">Visualization Type</InputLabel>
            <Select
              labelId="visualization-type-label"
              name="type"
              value={content.type || 'graph'}
              onChange={handleChange}
              label="Visualization Type"
            >
              <MenuItem value="graph">Interactive Graph</MenuItem>
              <MenuItem value="3d">3D Model</MenuItem>
              <MenuItem value="simulation">Physics Simulation</MenuItem>
              <MenuItem value="chemistry">Chemistry Visualization</MenuItem>
              <MenuItem value="math">Math Formula Visualization</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            name="config"
            label="Configuration (JSON)"
            value={content.config || '{}'}
            onChange={handleChange}
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            margin="normal"
            helperText="Enter JSON configuration for the visualization"
          />
        </>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          onClick={onCancel} 
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

// Main course editor component
export default function CourseEditor({ params }) {
  const courseId = params.courseId;
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('text');
  const [editingBlock, setEditingBlock] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // State for react-beautiful-dnd components
  const [DragDropContext, setDragDropContext] = useState(null);
  const [Droppable, setDroppable] = useState(null);
  const [Draggable, setDraggable] = useState(null);
  
  // Fix for React 18 compatibility with react-beautiful-dnd - MOVED INSIDE COMPONENT
  useEffect(() => {
    const importDnd = async () => {
      try {
        // Properly handle dynamic import with error suppression
        const ReactBeautifulDnd = await import('react-beautiful-dnd');
        
        // Suppress specific errors from ResizeObserver and read only property
        window.addEventListener('error', (e) => {
          if (
            e.message === 'ResizeObserver loop limit exceeded' || 
            e.message.includes('read only property')
          ) {
            e.stopImmediatePropagation();
          }
        });
        
        // Safely assign the imported components to state
        setDragDropContext(ReactBeautifulDnd.DragDropContext);
        setDroppable(ReactBeautifulDnd.Droppable);
        setDraggable(ReactBeautifulDnd.Draggable);
      } catch (err) {
        console.error('Failed to load react-beautiful-dnd:', err);
        // Set components to null so the fallback UI is rendered
        setDragDropContext(null);
        setDroppable(null);
        setDraggable(null);
      }
    };
    
    importDnd();
  }, []);
  
  // Admin check
  useEffect(() => {
    if (user && !loading) {
      if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, router, isAdmin, loading]);
  
  // Fetch course data
  const fetchCourse = useCallback(async () => {
    if (!user || !isAdmin || !courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
        
      if (error) throw error;
      
      setCourse(data);
      
      // Fetch lessons for this course to get content blocks
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .eq('id', courseId) // This will serve as our main lesson for now
        .maybeSingle();
        
      if (lessonsError) throw lessonsError;
      
      if (lessonsData) {
        setContentBlocks(lessonsData.content || []);
      } else {
        // Create a default lesson for this course
        const { data: newLesson, error: createError } = await supabase
          .from('lessons')
          .insert({
            course_id: courseId,
            id: courseId, // Use same ID for simplicity in this prototype
            title: data.title,
            content_type: 'mixed',
            content: [],
            sequence_number: 1,
            order_number: 1
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        setContentBlocks([]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [supabase, courseId, user, isAdmin]);
  
  useEffect(() => {
    if (user && isAdmin && courseId) {
      fetchCourse();
    }
  }, [user, isAdmin, courseId, fetchCourse]);
  
  // Handlers for content blocks
  const handleAddBlock = (type) => {
    setDialogType(type);
    setEditingBlock(null);
    setOpenDialog(true);
  };
  
  const handleEditBlock = (index) => {
    setDialogType(contentBlocks[index].type);
    setEditingBlock(index);
    setOpenDialog(true);
  };
  
  const handleDeleteBlock = (index) => {
    if (window.confirm('Are you sure you want to delete this content block?')) {
      const updatedBlocks = [...contentBlocks];
      updatedBlocks.splice(index, 1);
      setContentBlocks(updatedBlocks);
      
      // Save changes to database
      saveContentBlocks(updatedBlocks);
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSaveContent = (content) => {
    let updatedBlocks;
    
    if (editingBlock !== null) {
      // Update existing block
      updatedBlocks = [...contentBlocks];
      updatedBlocks[editingBlock] = {
        ...updatedBlocks[editingBlock],
        data: content
      };
    } else {
      // Add new block
      updatedBlocks = [
        ...contentBlocks,
        {
          type: dialogType,
          data: content
        }
      ];
    }
    
    setContentBlocks(updatedBlocks);
    setOpenDialog(false);
    
    // Save changes to database
    saveContentBlocks(updatedBlocks);
  };
  
  const saveContentBlocks = async (blocks) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          content: blocks
        })
        .eq('id', courseId);
        
      if (error) throw error;
      
      setNotification({
        open: true,
        message: 'Content saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      setNotification({
        open: true,
        message: 'Failed to save content: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(contentBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setContentBlocks(items);
    saveContentBlocks(items);
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !course) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            {error || 'Course not found'}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/courses')}
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => router.push('/admin/courses')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {course.title}
          </Typography>
        </Box>
        
        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Content" />
            <Tab label="Details" />
            <Tab label="Settings" />
          </Tabs>
        </Paper>
        
        {activeTab === 0 && (
          <Box>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lesson Content
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Build your interactive lesson by adding and arranging content blocks. Drag blocks to reorder them.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddBlock('text')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Add Text
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddBlock('image')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Add Image
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddBlock('video')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Add Video
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddBlock('quiz')}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Add Quiz
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddBlock('interactive')}
                  sx={{ mb: 1 }}
                >
                  Add Interactive Visualization
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {DragDropContext && Droppable ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="content-blocks">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {contentBlocks.length === 0 ? (
                          <Paper sx={{ p: 3, textAlign: 'center', background: '#f9f9f9' }}>
                            <Typography color="text.secondary">
                              No content blocks yet. Use the buttons above to add content.
                            </Typography>
                          </Paper>
                        ) : (
                          contentBlocks.map((block, index) => (
                            <ContentBlock
                              key={index}
                              index={index}
                              type={block.type}
                              data={block.data}
                              onEdit={handleEditBlock}
                              onDelete={handleDeleteBlock}
                              Draggable={Draggable}
                              provided={provided}
                            />
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Box>
                  {contentBlocks.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', background: '#f9f9f9' }}>
                      <Typography color="text.secondary">
                        No content blocks yet. Use the buttons above to add content.
                      </Typography>
                    </Paper>
                  ) : (
                    contentBlocks.map((block, index) => (
                      <Card 
                        key={index}
                        sx={{ 
                          mb: 2,
                          transition: 'box-shadow 0.3s',
                          '&:hover': { boxShadow: 6 }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ mr: 1 }}>
                              <DragIndicatorIcon color="action" />
                            </Box>
                            <Typography variant="subtitle1" color="primary">
                              {block.type === 'text' && 'Text Block'}
                              {block.type === 'image' && 'Image'}
                              {block.type === 'video' && 'Video'}
                              {block.type === 'quiz' && 'Quiz'}
                              {block.type === 'interactive' && 'Interactive Visualization'}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          
                          {/* Simple content preview */}
                          <Typography variant="body2">
                            {block.type === 'text' && block.data.content?.substring(0, 100)}
                            {block.type === 'image' && 'Image: ' + (block.data.caption || block.data.url)}
                            {block.type === 'video' && 'Video: ' + block.data.url}
                            {block.type === 'quiz' && `Quiz with ${block.data.questions?.length || 0} questions`}
                            {block.type === 'interactive' && `${block.data.type} visualization`}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            startIcon={<EditIcon />} 
                            onClick={() => handleEditBlock(index)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            color="error" 
                            startIcon={<DeleteIcon />} 
                            onClick={() => handleDeleteBlock(index)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    ))
                  )}
                </Box>
              )}
            </Paper>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Course Title"
                  value={course.title}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Subject"
                  value={course.subject}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={course.description}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained"
                onClick={() => router.push(`/admin/courses`)}
              >
                Edit Course Details
              </Button>
            </Box>
          </Paper>
        )}
        
        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Settings
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="course-status-label">Status</InputLabel>
              <Select
                labelId="course-status-label"
                value={course.is_published ? "published" : "draft"}
                label="Status"
                disabled
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained"
                color="primary"
                disabled={!contentBlocks.length}
              >
                Publish Course
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
      
      {/* Content Editor Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBlock !== null ? 'Edit Content' : 'Add New Content'}
        </DialogTitle>
        <DialogContent dividers>
          <ContentEditor
            type={dialogType}
            data={editingBlock !== null ? contentBlocks[editingBlock].data : {}}
            onCancel={handleCloseDialog}
            onSave={handleSaveContent}
          />
        </DialogContent>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 