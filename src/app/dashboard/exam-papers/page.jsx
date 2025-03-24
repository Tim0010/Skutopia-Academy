'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
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
    Tab,
    Tabs
} from '@mui/material';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

// Subject data with icons
const subjectsData = {
    Mathematics: {
        icon: 'tabler-math',
        color: 'primary',
        image: '/assets/images/subjects/mathematics.jpg',
    },
    English: {
        icon: 'tabler-book',
        color: 'secondary',
        image: '/assets/images/subjects/english.jpg',
    },
    Science: {
        icon: 'tabler-flask',
        color: 'success',
        image: '/assets/images/subjects/science.jpg',
    },
    Chemistry: {
        icon: 'tabler-atom-2',
        color: 'info',
        image: '/assets/images/subjects/chemistry.jpg',
    },
    Biology: {
        icon: 'tabler-plant-2',
        color: 'success',
        image: '/assets/images/subjects/biology.jpg',
    },
    Physics: {
        icon: 'tabler-atom-2',
        color: 'warning',
        image: '/assets/images/subjects/physics.jpg',
    }
};

export default function ExamPapersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [examPapers, setExamPapers] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    // Grades available
    const grades = ['8', '9', '10', '11', '12'];
    
    // Years available
    const years = ['2024', '2023', '2022', '2021', '2020'];

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            router.push('/login');
            return;
        }

        // Load exam papers data
        loadExamPapers();
    }, [user, router, selectedSubject, selectedGrade, selectedYear]);

    const loadExamPapers = async () => {
        setLoading(true);
        
        try {
            const filters = {};
            if (selectedSubject) filters.subject = selectedSubject;
            if (selectedGrade) filters.grade = selectedGrade;
            if (selectedYear) filters.year = selectedYear;
            
            // Build query with filters
            let query = supabase
                .from('exam_papers')
                .select('*');
            
            // Apply filters if provided
            if (selectedSubject) {
                query = query.eq('subject', selectedSubject);
            }
            
            if (selectedGrade) {
                query = query.eq('grade', selectedGrade);
            }
            
            if (selectedYear) {
                query = query.eq('year', selectedYear);
            }
            
            // Order by most recent
            query = query.order('created_at', { ascending: false });
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            setExamPapers(data || []);
        } catch (error) {
            console.error('Error loading exam papers:', error);
            setNotification({
                open: true,
                message: 'Error loading exam papers. Please try again later.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Filter exam papers based on search query
    const filteredPapers = examPapers.filter(paper => {
        const matchesSearch = !searchQuery || 
            paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.term.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    });

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

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Past Examination Papers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Access past examination papers to help you prepare for your exams. Filter by subject, grade, and year to find relevant papers.
                </Typography>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="subject-select-label">Subject</InputLabel>
                            <Select
                                labelId="subject-select-label"
                                id="subject-select"
                                value={selectedSubject}
                                label="Subject"
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <MenuItem value="">All Subjects</MenuItem>
                                {Object.keys(subjectsData).map((subject) => (
                                    <MenuItem key={subject} value={subject}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SvgIcon name={subjectsData[subject].icon} size={20} color={subjectsData[subject].color} sx={{ mr: 1 }} />
                                            {subject}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="grade-select-label">Grade</InputLabel>
                            <Select
                                labelId="grade-select-label"
                                id="grade-select"
                                value={selectedGrade}
                                label="Grade"
                                onChange={(e) => setSelectedGrade(e.target.value)}
                            >
                                <MenuItem value="">All Grades</MenuItem>
                                {grades.map((grade) => (
                                    <MenuItem key={grade} value={grade}>
                                        Grade {grade}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={selectedYear}
                                label="Year"
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <MenuItem value="">All Years</MenuItem>
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon name="tabler-search" size={20} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <Button size="small" onClick={() => setSearchQuery('')}>
                                            Clear
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Exam Papers List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredPapers.length > 0 ? (
                        filteredPapers.map((paper) => (
                            <Grid item xs={12} md={6} lg={4} key={paper.id}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: 3,
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip 
                                                label={paper.subject} 
                                                size="small" 
                                                color={subjectsData[paper.subject]?.color || 'default'}
                                                icon={<SvgIcon name={subjectsData[paper.subject]?.icon || 'tabler-file'} size={16} />}
                                                sx={{ borderRadius: 2 }}
                                            />
                                            <Chip 
                                                label={paper.term} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2 }}
                                            />
                                        </Box>
                                        
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {paper.title}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            <Chip 
                                                label={`Grade ${paper.grade}`} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2 }}
                                            />
                                            <Chip 
                                                label={paper.year} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2 }}
                                            />
                                        </Box>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Pages
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {paper.pages}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Questions
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {paper.questions}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Duration
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {paper.duration}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth
                                            color={subjectsData[paper.subject]?.color || 'primary'}
                                            startIcon={<SvgIcon name="tabler-download" size={20} />}
                                            sx={{ borderRadius: 2 }}
                                            href={paper.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Download PDF
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                <SvgIcon name="tabler-file-search" size={48} color="text.secondary" />
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                    No examination papers found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Try changing your search criteria or selecting a different subject, grade, or year
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
}
