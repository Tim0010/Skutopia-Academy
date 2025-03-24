'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

// Subject data with icons
const subjectsData = {
    Mathematics: {
        icon: 'tabler-math',
        color: 'primary',
    },
    English: {
        icon: 'tabler-book',
        color: 'secondary',
    },
    Science: {
        icon: 'tabler-flask',
        color: 'success',
    },
    Chemistry: {
        icon: 'tabler-atom-2',
        color: 'info',
    },
    Biology: {
        icon: 'tabler-plant-2',
        color: 'success',
    },
    Physics: {
        icon: 'tabler-atom-2',
        color: 'warning',
    }
};

export default function AdminExamPapersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [examPapers, setExamPapers] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [paperToDelete, setPaperToDelete] = useState(null);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Mathematics');
    const [grade, setGrade] = useState('10');
    const [year, setYear] = useState('2024');
    const [term, setTerm] = useState('Midterm');
    const [pages, setPages] = useState('');
    const [questions, setQuestions] = useState('');
    const [duration, setDuration] = useState('');
    
    // Grades available
    const grades = ['8', '9', '10', '11', '12'];
    
    // Years available
    const years = ['2024', '2023', '2022', '2021', '2020'];
    
    // Terms available
    const terms = ['Midterm', 'Final', 'Practice', 'Mock'];

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Load exam papers
        loadExamPapers();
    }, [user, router]);

    const loadExamPapers = async () => {
        setLoading(true);
        
        try {
            // Get exam papers from database
            const { data, error } = await supabase
                .from('exam_papers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setExamPapers(data || []);
        } catch (error) {
            console.error('Error loading exam papers:', error);
            setNotification({
                open: true,
                message: 'Error loading exam papers: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            setNotification({
                open: true,
                message: 'Please select a valid PDF file',
                severity: 'error'
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUpload = async () => {
        // Validate form
        if (!title || !subject || !grade || !year || !term || !pages || !questions || !duration || !selectedFile) {
            setNotification({
                open: true,
                message: 'Please fill all fields and select a PDF file',
                severity: 'error'
            });
            return;
        }

        setUploading(true);
        
        try {
            // 1. Upload file to storage
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${subject}_Grade${grade}_${year}_${term}_${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;
            
            // Skip bucket creation - this should be done in the Supabase dashboard
            // Instead, try to upload directly and handle any errors
            
            // Upload file
            const { error: uploadError } = await supabase.storage
                .from('exam-papers')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: 'application/pdf'
                });
            
            if (uploadError) {
                // If the error is about the bucket not existing, provide a clearer message
                if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
                    throw new Error('The exam-papers storage bucket does not exist. Please create it in the Supabase dashboard.');
                } else {
                    throw new Error(`Error uploading file: ${uploadError.message}`);
                }
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('exam-papers')
                .getPublicUrl(filePath);
            
            if (!urlData?.publicUrl) throw new Error('Error getting public URL');
            
            // 2. Insert record in database
            const { error: insertError } = await supabase
                .from('exam_papers')
                .insert({
                    title,
                    subject,
                    grade,
                    year,
                    term,
                    file_path: filePath,
                    file_url: urlData.publicUrl,
                    pages: parseInt(pages),
                    questions: parseInt(questions),
                    duration,
                    created_by: user.id
                });
            
            if (insertError) throw new Error(`Error inserting record: ${insertError.message}`);
            
            // Success
            setNotification({
                open: true,
                message: 'Exam paper uploaded successfully',
                severity: 'success'
            });
            
            // Reset form
            setTitle('');
            setSubject('Mathematics');
            setGrade('10');
            setYear('2024');
            setTerm('Midterm');
            setPages('');
            setQuestions('');
            setDuration('');
            setSelectedFile(null);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            // Reload exam papers
            loadExamPapers();
        } catch (error) {
            console.error('Error uploading exam paper:', error);
            setNotification({
                open: true,
                message: error.message || 'Error uploading exam paper',
                severity: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (paper) => {
        setPaperToDelete(paper);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!paperToDelete) return;
        
        try {
            // 1. Delete file from storage
            const { error: storageError } = await supabase.storage
                .from('exam-papers')
                .remove([paperToDelete.file_path]);
            
            if (storageError) throw new Error(`Error deleting file: ${storageError.message}`);
            
            // 2. Delete record from database
            const { error: dbError } = await supabase
                .from('exam_papers')
                .delete()
                .eq('id', paperToDelete.id);
            
            if (dbError) throw new Error(`Error deleting record: ${dbError.message}`);
            
            // Success
            setNotification({
                open: true,
                message: 'Exam paper deleted successfully',
                severity: 'success'
            });
            
            // Reload exam papers
            loadExamPapers();
        } catch (error) {
            console.error('Error deleting exam paper:', error);
            setNotification({
                open: true,
                message: error.message || 'Error deleting exam paper',
                severity: 'error'
            });
        } finally {
            setDeleteConfirmOpen(false);
            setPaperToDelete(null);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Box>
            {/* Notification */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the exam paper "{paperToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Manage Examination Papers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload and manage past examination papers for students to access.
                </Typography>
            </Box>

            {/* Upload Form */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Upload New Exam Paper
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Mathematics Grade 10 Midterm Examination 2024"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="subject-select-label">Subject</InputLabel>
                            <Select
                                labelId="subject-select-label"
                                id="subject-select"
                                value={subject}
                                label="Subject"
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                {Object.keys(subjectsData).map((subj) => (
                                    <MenuItem key={subj} value={subj}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SvgIcon name={subjectsData[subj].icon} size={20} color={subjectsData[subj].color} sx={{ mr: 1 }} />
                                            {subj}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="grade-select-label">Grade</InputLabel>
                            <Select
                                labelId="grade-select-label"
                                id="grade-select"
                                value={grade}
                                label="Grade"
                                onChange={(e) => setGrade(e.target.value)}
                            >
                                {grades.map((g) => (
                                    <MenuItem key={g} value={g}>
                                        Grade {g}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={year}
                                label="Year"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y} value={y}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="term-select-label">Term</InputLabel>
                            <Select
                                labelId="term-select-label"
                                id="term-select"
                                value={term}
                                label="Term"
                                onChange={(e) => setTerm(e.target.value)}
                            >
                                {terms.map((t) => (
                                    <MenuItem key={t} value={t}>
                                        {t}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Pages"
                            variant="outlined"
                            type="number"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            InputProps={{
                                inputProps: { min: 1 }
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Questions"
                            variant="outlined"
                            type="number"
                            value={questions}
                            onChange={(e) => setQuestions(e.target.value)}
                            InputProps={{
                                inputProps: { min: 1 }
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Duration"
                            variant="outlined"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 2 hours"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="pdf-file-input"
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <label htmlFor="pdf-file-input">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<SvgIcon name="tabler-upload" size={20} />}
                                sx={{ borderRadius: 2, mr: 2 }}
                            >
                                Select PDF File
                            </Button>
                        </label>
                        {selectedFile && (
                            <Typography variant="body2" component="span">
                                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                            </Typography>
                        )}
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SvgIcon name="tabler-upload" size={20} />}
                            onClick={handleUpload}
                            disabled={uploading}
                            sx={{ borderRadius: 2 }}
                        >
                            {uploading ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                                    Uploading...
                                </>
                            ) : (
                                'Upload Exam Paper'
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Exam Papers List */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Uploaded Exam Papers
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : examPapers.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Term</TableCell>
                                    <TableCell>Pages</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {examPapers.map((paper) => (
                                    <TableRow key={paper.id}>
                                        <TableCell>{paper.title}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <SvgIcon 
                                                    name={subjectsData[paper.subject]?.icon || 'tabler-file'} 
                                                    size={20} 
                                                    color={subjectsData[paper.subject]?.color || 'primary'} 
                                                    sx={{ mr: 1 }} 
                                                />
                                                {paper.subject}
                                            </Box>
                                        </TableCell>
                                        <TableCell>Grade {paper.grade}</TableCell>
                                        <TableCell>{paper.year}</TableCell>
                                        <TableCell>{paper.term}</TableCell>
                                        <TableCell>{paper.pages}</TableCell>
                                        <TableCell>
                                            <IconButton 
                                                color="error" 
                                                size="small"
                                                onClick={() => handleDeleteClick(paper)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                color="primary" 
                                                size="small"
                                                href={paper.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <SvgIcon name="tabler-eye" size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <SvgIcon name="tabler-file-upload" size={48} color="text.secondary" />
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                            No exam papers uploaded yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Use the form above to upload your first exam paper
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
