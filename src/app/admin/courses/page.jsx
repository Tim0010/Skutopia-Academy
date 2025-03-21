'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseManagement() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Course dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('create'); // 'create' or 'edit'
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    title: '',
    description: '',
    subject: '',
    grade_level: 9,
    thumbnail_url: '',
    is_published: false
  });
  
  // Admin check
  useEffect(() => {
    if (user && !loading) {
      if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, router, isAdmin, loading]);
  
  // Load courses
  const fetchCourses = useCallback(async () => {
    if (!user || !isAdmin) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [supabase, user, isAdmin]);
  
  useEffect(() => {
    if (user && isAdmin) {
      fetchCourses();
    }
  }, [user, isAdmin, fetchCourses]);
  
  // Dialog handlers
  const handleOpenDialog = (action, course = null) => {
    setDialogAction(action);
    if (course) {
      setCurrentCourse(course);
    } else {
      setCurrentCourse({
        id: null,
        title: '',
        description: '',
        subject: '',
        grade_level: 9,
        thumbnail_url: '',
        is_published: false
      });
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveCourse = async () => {
    try {
      if (!currentCourse.title || !currentCourse.subject) {
        setNotification({
          open: true,
          message: 'Please fill all required fields',
          severity: 'error'
        });
        return;
      }
      
      // Prepare the course data
      const courseData = {
        title: currentCourse.title,
        description: currentCourse.description,
        subject: currentCourse.subject,
        grade_level: parseInt(currentCourse.grade_level),
        thumbnail_url: currentCourse.thumbnail_url,
        is_published: false
      };
      
      let result;
      
      if (dialogAction === 'create') {
        // Create new course
        result = await supabase
          .from('courses')
          .insert(courseData)
          .select()
          .single();
      } else {
        // Update existing course
        result = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', currentCourse.id)
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      setNotification({
        open: true,
        message: `Course ${dialogAction === 'create' ? 'created' : 'updated'} successfully`,
        severity: 'success'
      });
      
      setOpenDialog(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      setNotification({
        open: true,
        message: `Failed to ${dialogAction} course: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
        
      if (error) throw error;
      
      setNotification({
        open: true,
        message: 'Course deleted successfully',
        severity: 'success'
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setNotification({
        open: true,
        message: `Failed to delete course: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  const handleEditCourse = (courseId) => {
    router.push(`/admin/courses/${courseId}`);
  };
  
  // Loading state
  if (loading && !courses.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" component="h1">
            Course Management
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create New Course
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {courses.length === 0 && !loading ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create your first course to get started
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('create')}
                >
                  Create New Course
                </Button>
              </Paper>
            </Grid>
          ) : (
            courses.map(course => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.thumbnail_url || '/assets/images/hero/stem-education.jpg'}
                    alt={course.title}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: 'grey.200'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description?.substring(0, 120)}{course.description?.length > 120 ? '...' : ''}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2 
                    }}>
                      <Typography variant="body2" color="primary">
                        {course.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Grade {course.grade_level}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button 
                      size="small" 
                      onClick={() => handleEditCourse(course.id)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Box>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteCourse(course.id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      
      {/* Course Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogAction === 'create' ? 'Create New Course' : 'Edit Course'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Course Title"
                value={currentCourse.title}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={currentCourse.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="subject"
                label="Subject"
                value={currentCourse.subject}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="grade-level-label">Grade Level</InputLabel>
                <Select
                  labelId="grade-level-label"
                  name="grade_level"
                  value={currentCourse.grade_level}
                  onChange={handleInputChange}
                  label="Grade Level"
                >
                  {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="thumbnail_url"
                label="Thumbnail URL"
                value={currentCourse.thumbnail_url}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                helperText="Enter URL for course thumbnail image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveCourse} 
            variant="contained" 
            color="primary"
          >
            {dialogAction === 'create' ? 'Create Course' : 'Save Changes'}
          </Button>
        </DialogActions>
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