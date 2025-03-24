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
    CardActions,
    Button,
    Chip,
    Avatar,
    Rating,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    EventAvailable as EventIcon,
    AccessTime as TimeIcon,
    School as SchoolIcon,
    WorkOutline as ExperienceIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function MentorshipPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [subject, setSubject] = useState('all');
    const [experience, setExperience] = useState('all');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingData, setBookingData] = useState({
        date: addDays(new Date(), 1),
        time: new Date(),
        duration: 30,
        topic: '',
        message: '',
    });
    const [bookingStatus, setBookingStatus] = useState({ loading: false, error: null, success: false });
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMentors();
        } else {
            router.push('/auth/login');
        }
    }, [user, router]);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, subject, experience, mentors]);

    const fetchMentors = async () => {
        setLoading(true);
        try {
            // Get all mentors from the database
            const { data: mentorsData, error: mentorsError } = await supabase
                .from('mentors')
                .select('*')
                .eq('is_available', true);
                
            if (mentorsError) throw mentorsError;
            
            // For each mentor, get their subjects
            const mentorsWithSubjects = await Promise.all(mentorsData.map(async (mentor) => {
                // Get subjects
                const { data: subjectsData, error: subjectsError } = await supabase
                    .from('mentor_subjects')
                    .select('subject, proficiency_level')
                    .eq('mentor_id', mentor.id);
                    
                if (subjectsError) throw subjectsError;
                
                // Get reviews
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('mentor_reviews')
                    .select('rating, comment, created_at')
                    .eq('mentor_id', mentor.id);
                    
                if (reviewsError) throw reviewsError;
                
                // Calculate average rating
                const avgRating = reviewsData?.length 
                    ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
                    : 0;
                
                return {
                    ...mentor,
                    subjects: subjectsData || [],
                    reviews: reviewsData || [],
                    avgRating,
                    reviewCount: reviewsData?.length || 0
                };
            }));
            
            // Extract all unique subjects for the filter
            const allSubjects = new Set();
            mentorsWithSubjects.forEach(mentor => {
                mentor.subjects.forEach(subject => {
                    allSubjects.add(subject.subject);
                });
            });
            
            setSubjects(Array.from(allSubjects));
            setMentors(mentorsWithSubjects);
            setFilteredMentors(mentorsWithSubjects);
            setError(null);
        } catch (err) {
            console.error('Error fetching mentors:', err);
            setError('Failed to load mentors. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...mentors];

        // Apply search term filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(mentor =>
                mentor.full_name.toLowerCase().includes(lowerSearch) ||
                mentor.bio.toLowerCase().includes(lowerSearch) ||
                mentor.subjects.some(subject => subject.subject.toLowerCase().includes(lowerSearch))
            );
        }

        // Apply subject filter
        if (subject !== 'all') {
            filtered = filtered.filter(mentor =>
                mentor.subjects.some(s => s.subject === subject)
            );
        }

        // Apply experience filter
        if (experience !== 'all') {
            switch (experience) {
                case 'beginner':
                    filtered = filtered.filter(mentor => mentor.experience_years < 3);
                    break;
                case 'intermediate':
                    filtered = filtered.filter(mentor => mentor.experience_years >= 3 && mentor.experience_years < 7);
                    break;
                case 'expert':
                    filtered = filtered.filter(mentor => mentor.experience_years >= 7);
                    break;
            }
        }

        setFilteredMentors(filtered);
    };

    const handleBookMentor = (mentor) => {
        setSelectedMentor(mentor);
        setIsBookingOpen(true);
        setBookingStatus({ loading: false, error: null, success: false });
    };

    const handleBookingSubmit = async () => {
        setBookingStatus({ loading: true, error: null, success: false });
        
        if (!bookingData.topic) {
            setBookingStatus({ 
                loading: false, 
                error: 'Please enter a topic for the session', 
                success: false 
            });
            return;
        }
        
        try {
            // Format date and time for database
            const sessionDate = format(bookingData.date, 'yyyy-MM-dd');
            const startTime = format(bookingData.time, 'HH:mm:ss');
            
            // Calculate end time based on duration
            const endTimeDate = new Date(bookingData.time);
            endTimeDate.setMinutes(endTimeDate.getMinutes() + parseInt(bookingData.duration));
            const endTime = format(endTimeDate, 'HH:mm:ss');
            
            // Create session in database
            const { data, error } = await supabase
                .from('mentorship_sessions')
                .insert([{
                    mentor_id: selectedMentor.id,
                    student_id: user.id,
                    session_date: sessionDate,
                    start_time: startTime,
                    end_time: endTime,
                    topic: bookingData.topic,
                    message: bookingData.message || '',
                    status: 'pending'
                }]);
                
            if (error) throw error;
            
            // Success state
            setBookingStatus({ loading: false, error: null, success: true });
            
            // Reset form and close dialog after delay
            setTimeout(() => {
                setIsBookingOpen(false);
                setBookingData({
                    date: addDays(new Date(), 1),
                    time: new Date(),
                    duration: 30,
                    topic: '',
                    message: '',
                });
                setBookingStatus({ loading: false, error: null, success: false });
            }, 2000);
            
        } catch (error) {
            console.error('Error booking session:', error);
            setBookingStatus({ 
                loading: false, 
                error: 'Failed to book session. Please try again.', 
                success: false 
            });
        }
    };

    const handleViewProfile = (mentorId) => {
        router.push(`/dashboard/mentorship/${mentorId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Find a Mentor
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Connect with experienced mentors who can guide you through your educational journey
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name, subject, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />

                    <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            label="Subject"
                        >
                            <MenuItem value="all">All Subjects</MenuItem>
                            {subjects.map((subj) => (
                                <MenuItem key={subj} value={subj}>{subj}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                        <InputLabel>Experience</InputLabel>
                        <Select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            label="Experience"
                        >
                            <MenuItem value="all">All Levels</MenuItem>
                            <MenuItem value="beginner">Beginner (0-2 years)</MenuItem>
                            <MenuItem value="intermediate">Intermediate (3-7 years)</MenuItem>
                            <MenuItem value="expert">Expert (7+ years)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {filteredMentors.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No mentors found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                        {searchTerm || subject !== 'all' || experience !== 'all'
                            ? 'No mentors match your current filters. Try changing your search criteria.'
                            : 'Check back later for available mentors.'}
                    </Typography>
                    {(searchTerm || subject !== 'all' || experience !== 'all') && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setSubject('all');
                                setExperience('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredMentors.map((mentor, index) => (
                        <Grid item xs={12} md={6} lg={4} key={mentor.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                        },
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={mentor.avatar_url}
                                            alt={mentor.full_name}
                                            sx={{ width: 80, height: 80, mr: 2 }}
                                        />
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                {mentor.full_name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Rating
                                                    value={mentor.avgRating}
                                                    precision={0.5}
                                                    size="small"
                                                    readOnly
                                                    icon={<StarIcon fontSize="inherit" />}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                    ({mentor.reviewCount})
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ExperienceIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {mentor.experience_years} years experience
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider />

                                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: 60,
                                            }}
                                        >
                                            {mentor.bio}
                                        </Typography>

                                        <Typography variant="subtitle2" gutterBottom>
                                            Expertise
                                        </Typography>
                                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {mentor.subjects.slice(0, 3).map((subj) => (
                                                <Chip
                                                    key={subj.subject}
                                                    label={subj.subject}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                            {mentor.subjects.length > 3 && (
                                                <Chip
                                                    label={`+${mentor.subjects.length - 3} more`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2">
                                                ${mentor.hourly_rate}/hour
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {mentor.availability_hours || '20'} hrs/week
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleViewProfile(mentor.id)}
                                            sx={{ flexGrow: 1 }}
                                        >
                                            View Profile
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<EventIcon />}
                                            onClick={() => handleBookMentor(mentor)}
                                            sx={{ flexGrow: 1 }}
                                        >
                                            Book Session
                                        </Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Booking Dialog */}
            <Dialog
                open={isBookingOpen}
                onClose={() => !bookingStatus.loading && setIsBookingOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Book a Session with {selectedMentor?.full_name}
                </DialogTitle>
                <DialogContent dividers>
                    {bookingStatus.success ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Your booking request has been sent! The mentor will review your request and confirm soon.
                        </Alert>
                    ) : (
                        <>
                            {bookingStatus.error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {bookingStatus.error}
                                </Alert>
                            )}

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                    <DatePicker
                                        label="Session Date"
                                        value={bookingData.date}
                                        onChange={(newValue) => setBookingData({ ...bookingData, date: newValue })}
                                        disablePast
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />

                                    <TimePicker
                                        label="Session Time"
                                        value={bookingData.time}
                                        onChange={(newValue) => setBookingData({ ...bookingData, time: newValue })}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </Stack>
                            </LocalizationProvider>

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel>Session Duration</InputLabel>
                                <Select
                                    value={bookingData.duration}
                                    onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                                    label="Session Duration"
                                >
                                    <MenuItem value={30}>30 minutes</MenuItem>
                                    <MenuItem value={60}>1 hour</MenuItem>
                                    <MenuItem value={90}>1.5 hours</MenuItem>
                                    <MenuItem value={120}>2 hours</MenuItem>
                                </Select>
                            </FormControl>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Pricing
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>
                                        ${selectedMentor?.hourly_rate} × {bookingData.duration / 60} hour(s)
                                    </Typography>
                                    <Typography fontWeight="bold">
                                        ${selectedMentor ? (selectedMentor.hourly_rate * bookingData.duration / 60).toFixed(2) : '0.00'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <TextField
                                fullWidth
                                label="Session Topic"
                                placeholder="E.g., College application guidance, Calculus homework help, etc."
                                value={bookingData.topic}
                                onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Message to Mentor (Optional)"
                                placeholder="Introduce yourself and describe what you'd like to discuss in the session"
                                value={bookingData.message}
                                onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </>
                    )}
                </DialogContent>

                {!bookingStatus.success && (
                    <DialogActions>
                        <Button
                            onClick={() => setIsBookingOpen(false)}
                            disabled={bookingStatus.loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleBookingSubmit}
                            disabled={bookingStatus.loading || !bookingData.topic}
                        >
                            {bookingStatus.loading ? 'Booking...' : 'Book Session'}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </Box>
    );
}