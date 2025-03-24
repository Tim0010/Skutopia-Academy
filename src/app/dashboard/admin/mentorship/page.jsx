'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

// Subject options for mentors
const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Economics'
];

export default function MentorshipManagement() {
    const { user } = useAuth();
    const router = useRouter();
    const { createBulkNotifications } = useNotifications();
    
    // States for mentor data
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [mentorToDelete, setMentorToDelete] = useState(null);
    
    // States for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [expertise, setExpertise] = useState('');
    const [bio, setBio] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    
    // State for notifications
    const [notification, setNotification] = useState({ 
        open: false, 
        message: '', 
        severity: 'info' 
    });

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        loadMentors();
    }, [user, router]);

    const loadMentors = async () => {
        setLoading(true);
        try {
            // Get mentors with their subjects
            const { data: mentorsData, error: mentorsError } = await supabase
                .from('mentors')
                .select('*');
                
            if (mentorsError) throw mentorsError;
            
            // For each mentor, get their subjects
            const mentorsWithSubjects = await Promise.all(mentorsData.map(async (mentor) => {
                const { data: subjectsData } = await supabase
                    .from('mentor_subjects')
                    .select('subject, proficiency_level')
                    .eq('mentor_id', mentor.id);
                    
                return {
                    ...mentor,
                    subjects: subjectsData || []
                };
            }));
            
            setMentors(mentorsWithSubjects);
        } catch (error) {
            console.error('Error loading mentors:', error);
            setNotification({
                open: true,
                message: 'Error loading mentors. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddMentor = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!name || !email || !expertise || !bio || !hourlyRate || selectedSubjects.length === 0) {
            setNotification({
                open: true,
                message: 'Please fill all required fields and select at least one subject',
                severity: 'error'
            });
            return;
        }
        
        try {
            // Create a new mentor object with explicit types
            const mentorToInsert = { 
                name: String(name).trim(), 
                email: String(email).trim(),
                bio: String(bio).trim(),
                hourly_rate: parseFloat(hourlyRate),
                is_available: Boolean(isAvailable)
            };
            
            // Handle expertise separately since it seems to be the problematic field
            // Try with a different approach to ensure it's treated as a plain string
            const expertiseValue = String(expertise).trim();
            
            console.log("Inserting mentor with data:", {
                ...mentorToInsert,
                expertise: expertiseValue
            });
            
            // 1. Insert mentor into mentors table - without the expertise field first
            const { data: mentorData, error: mentorError } = await supabase
                .from('mentors')
                .insert([mentorToInsert])
                .select();
                
            if (mentorError) {
                console.error('Error inserting mentor:', mentorError);
                throw new Error(`Error inserting mentor: ${mentorError.message}`);
            }
            
            if (!mentorData || mentorData.length === 0) {
                throw new Error('No mentor data returned after insertion');
            }
            
            // 2. Update the mentor with the expertise field
            const mentorId = mentorData[0].id;
            const { error: expertiseError } = await supabase
                .from('mentors')
                .update({ expertise: expertiseValue })
                .eq('id', mentorId);
                
            if (expertiseError) {
                console.error('Error updating expertise:', expertiseError);
                throw new Error(`Error updating expertise: ${expertiseError.message}`);
            }
            
            // 2. Insert subjects for the mentor
            const subjectsToInsert = Array.isArray(selectedSubjects) ? selectedSubjects : [selectedSubjects];
            
            const subjectInserts = subjectsToInsert.map(subject => ({
                mentor_id: mentorId,
                subject: String(subject),
                proficiency_level: 5 // Default proficiency level
            }));
            
            console.log("Inserting subjects:", subjectInserts);
            
            const { error: subjectsError } = await supabase
                .from('mentor_subjects')
                .insert(subjectInserts);
                
            if (subjectsError) {
                console.error('Error inserting subjects:', subjectsError);
                throw new Error(`Error inserting subjects: ${subjectsError.message}`);
            }
            
            // Create notification for all users
            // First, get all student user IDs
            const { data: studentIds, error: studentError } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student');
                
            if (!studentError && studentIds && studentIds.length > 0) {
                // Create notifications for all students
                await createBulkNotifications(
                    studentIds.map(student => student.id),
                    'New Mentor Available',
                    `${name} has joined as a mentor specializing in ${expertise}. Book a session now!`,
                    'info'
                );
            }
            
            // Success notification
            setNotification({
                open: true,
                message: 'Mentor added successfully!',
                severity: 'success'
            });
            
            // Reset form
            resetForm();
            
            // Reload mentors
            loadMentors();
            
        } catch (error) {
            console.error('Error adding mentor:', error);
            setNotification({
                open: true,
                message: `Error adding mentor: ${error.message}`,
                severity: 'error'
            });
        }
    };
    
    const handleDeleteClick = (mentor) => {
        setMentorToDelete(mentor);
        setDeleteConfirmOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        if (!mentorToDelete) return;
        
        try {
            // 1. Delete mentor subjects
            const { error: subjectsError } = await supabase
                .from('mentor_subjects')
                .delete()
                .eq('mentor_id', mentorToDelete.id);
                
            if (subjectsError) throw subjectsError;
            
            // 2. Delete mentor
            const { error: mentorError } = await supabase
                .from('mentors')
                .delete()
                .eq('id', mentorToDelete.id);
                
            if (mentorError) throw mentorError;
            
            // Success notification
            setNotification({
                open: true,
                message: 'Mentor deleted successfully!',
                severity: 'success'
            });
            
            // Close dialog and reset state
            setDeleteConfirmOpen(false);
            setMentorToDelete(null);
            
            // Reload mentors
            loadMentors();
            
        } catch (error) {
            console.error('Error deleting mentor:', error);
            setNotification({
                open: true,
                message: `Error deleting mentor: ${error.message}`,
                severity: 'error'
            });
        }
    };
    
    const resetForm = () => {
        setName('');
        setEmail('');
        setExpertise('');
        setBio('');
        setHourlyRate('');
        setIsAvailable(true);
        setSelectedSubjects([]);
    };
    
    const handleSubjectChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedSubjects(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Mentorship Management
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" component="h2">
                    Add New Mentor
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => router.push('/dashboard/admin/mentorship/sessions')}
                >
                    Manage Sessions
                </Button>
            </Box>
            
            <Grid container spacing={3}>
                {/* Add Mentor Form */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Add New Mentor
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Expertise"
                                        value={expertise}
                                        onChange={(e) => setExpertise(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        placeholder="e.g., Mathematics Teacher, Physics Tutor"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        multiline
                                        rows={3}
                                        placeholder="Brief description of the mentor's background and experience"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Hourly Rate ($)"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        type="number"
                                        inputProps={{ min: 0, step: 5 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isAvailable}
                                                onChange={(e) => setIsAvailable(e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Available for Booking"
                                        sx={{ mt: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="subjects-label">Subjects</InputLabel>
                                        <Select
                                            labelId="subjects-label"
                                            multiple
                                            value={selectedSubjects}
                                            onChange={handleSubjectChange}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {subjectOptions.map((subject) => (
                                                <MenuItem key={subject} value={subject}>
                                                    {subject}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleAddMentor}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Add Mentor
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Mentors List */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Current Mentors
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : mentors.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ p: 3 }}>
                                    No mentors found. Add your first mentor using the form.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Expertise</TableCell>
                                                <TableCell>Subjects</TableCell>
                                                <TableCell>Rate</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mentors.map((mentor) => (
                                                <TableRow key={mentor.id}>
                                                    <TableCell>{mentor.name}</TableCell>
                                                    <TableCell>{mentor.expertise}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            {mentor.subjects.map((subj, idx) => (
                                                                <Chip 
                                                                    key={idx} 
                                                                    label={subj.subject} 
                                                                    size="small" 
                                                                    color="primary" 
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>${mentor.hourly_rate}/hr</TableCell>
                                                    <TableCell>
                                                        <IconButton 
                                                            color="error" 
                                                            onClick={() => handleDeleteClick(mentor)}
                                                            size="small"
                                                        >
                                                            <SvgIcon name="tabler-trash" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {mentorToDelete?.name}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Notification Snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
