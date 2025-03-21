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
    IconButton,
    Pagination,
    Tooltip,
    LinearProgress,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Money as MoneyIcon,
    School as SchoolIcon,
    CalendarToday as CalendarIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { format, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

const ITEMS_PER_PAGE = 9;

export default function ScholarshipsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [educationLevel, setEducationLevel] = useState('all');
    const [amountRange, setAmountRange] = useState('all');
    const [deadlineFilter, setDeadlineFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [bookmarkedScholarships, setBookmarkedScholarships] = useState([]);
    const [showDetailsId, setShowDetailsId] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [applyData, setApplyData] = useState({
        email: '',
        contactName: '',
        phone: '',
        whyDeserve: '',
    });

    useEffect(() => {
        if (user) {
            fetchScholarships();
            fetchBookmarks();
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, educationLevel, amountRange, deadlineFilter, scholarships]);

    const fetchScholarships = async () => {
        try {
            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .order('deadline', { ascending: true });

            if (error) throw error;

            setScholarships(data || []);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            setError('Failed to load scholarships. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const { data, error } = await supabase
                .from('scholarship_bookmarks')
                .select('scholarship_id')
                .eq('user_id', user.id);

            if (error) throw error;

            setBookmarkedScholarships(data.map(item => item.scholarship_id));
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...scholarships];

        // Apply search term filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(scholarship =>
                scholarship.title.toLowerCase().includes(lowerSearch) ||
                scholarship.organization.toLowerCase().includes(lowerSearch) ||
                scholarship.description.toLowerCase().includes(lowerSearch)
            );
        }

        // Apply education level filter
        if (educationLevel !== 'all') {
            filtered = filtered.filter(scholarship => scholarship.education_level === educationLevel);
        }

        // Apply amount range filter
        if (amountRange !== 'all') {
            switch (amountRange) {
                case 'under1000':
                    filtered = filtered.filter(scholarship => scholarship.amount < 1000);
                    break;
                case '1000to5000':
                    filtered = filtered.filter(scholarship => scholarship.amount >= 1000 && scholarship.amount <= 5000);
                    break;
                case '5000to10000':
                    filtered = filtered.filter(scholarship => scholarship.amount > 5000 && scholarship.amount <= 10000);
                    break;
                case 'over10000':
                    filtered = filtered.filter(scholarship => scholarship.amount > 10000);
                    break;
            }
        }

        // Apply deadline filter
        if (deadlineFilter !== 'all') {
            const now = new Date();
            const oneMonth = new Date();
            oneMonth.setMonth(oneMonth.getMonth() + 1);

            switch (deadlineFilter) {
                case 'past':
                    filtered = filtered.filter(scholarship => isPast(new Date(scholarship.deadline)));
                    break;
                case 'upcoming':
                    filtered = filtered.filter(scholarship => !isPast(new Date(scholarship.deadline)));
                    break;
                case 'thisMonth':
                    filtered = filtered.filter(scholarship => {
                        const deadlineDate = new Date(scholarship.deadline);
                        return !isPast(deadlineDate) && deadlineDate <= oneMonth;
                    });
                    break;
            }
        }

        setFilteredScholarships(filtered);
        setPage(1); // Reset to first page when filters change
    };

    const toggleBookmark = async (e, scholarshipId) => {
        e.stopPropagation();
        try {
            const isBookmarked = bookmarkedScholarships.includes(scholarshipId);

            if (isBookmarked) {
                // Remove bookmark
                const { error } = await supabase
                    .from('scholarship_bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('scholarship_id', scholarshipId);

                if (error) throw error;

                setBookmarkedScholarships(bookmarkedScholarships.filter(id => id !== scholarshipId));
            } else {
                // Add bookmark
                const { error } = await supabase
                    .from('scholarship_bookmarks')
                    .insert([{ user_id: user.id, scholarship_id: scholarshipId }]);

                if (error) throw error;

                setBookmarkedScholarships([...bookmarkedScholarships, scholarshipId]);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleShowDetails = (scholarshipId) => {
        setShowDetailsId(scholarshipId === showDetailsId ? null : scholarshipId);
    };

    const handleApply = (scholarship) => {
        setSelectedScholarship(scholarship);
        setApplyDialogOpen(true);
        setSubmitSuccess(false);

        // Pre-populate with user data if available
        if (user) {
            setApplyData({
                ...applyData,
                email: user.email || '',
                contactName: user.user_metadata?.full_name || '',
            });
        }
    };

    const handleSubmitApplication = async () => {
        if (!applyData.email || !applyData.contactName || !applyData.whyDeserve) {
            return;
        }

        setSubmitLoading(true);

        try {
            const { error } = await supabase
                .from('scholarship_applications')
                .insert([
                    {
                        user_id: user.id,
                        scholarship_id: selectedScholarship.id,
                        email: applyData.email,
                        contact_name: applyData.contactName,
                        phone: applyData.phone,
                        why_deserve: applyData.whyDeserve,
                        status: 'pending',
                    },
                ]);

            if (error) throw error;

            setSubmitSuccess(true);

            // Reset form after successful submission
            setTimeout(() => {
                setApplyDialogOpen(false);
                setApplyData({
                    email: '',
                    contactName: '',
                    phone: '',
                    whyDeserve: '',
                });
            }, 2000);

        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application. Please try again later.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const paginatedScholarships = filteredScholarships.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Scholarships
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Find and apply for scholarships to help fund your education
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search scholarships..."
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
                        <InputLabel>Education Level</InputLabel>
                        <Select
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            label="Education Level"
                        >
                            <MenuItem value="all">All Levels</MenuItem>
                            <MenuItem value="high_school">High School</MenuItem>
                            <MenuItem value="undergraduate">Undergraduate</MenuItem>
                            <MenuItem value="graduate">Graduate</MenuItem>
                            <MenuItem value="postgraduate">Postgraduate</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                        <InputLabel>Amount</InputLabel>
                        <Select
                            value={amountRange}
                            onChange={(e) => setAmountRange(e.target.value)}
                            label="Amount"
                        >
                            <MenuItem value="all">Any Amount</MenuItem>
                            <MenuItem value="under1000">Under $1,000</MenuItem>
                            <MenuItem value="1000to5000">$1,000 - $5,000</MenuItem>
                            <MenuItem value="5000to10000">$5,000 - $10,000</MenuItem>
                            <MenuItem value="over10000">Over $10,000</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                        <InputLabel>Deadline</InputLabel>
                        <Select
                            value={deadlineFilter}
                            onChange={(e) => setDeadlineFilter(e.target.value)}
                            label="Deadline"
                        >
                            <MenuItem value="all">All Deadlines</MenuItem>
                            <MenuItem value="upcoming">Upcoming</MenuItem>
                            <MenuItem value="thisMonth">Within 30 Days</MenuItem>
                            <MenuItem value="past">Past Deadlines</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {filteredScholarships.length === 0 ? (
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
                        No scholarships found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                        {searchTerm || educationLevel !== 'all' || amountRange !== 'all' || deadlineFilter !== 'all'
                            ? 'No scholarships match your current filters. Try changing your search criteria.'
                            : 'Check back later for new scholarship opportunities.'}
                    </Typography>
                    {(searchTerm || educationLevel !== 'all' || amountRange !== 'all' || deadlineFilter !== 'all') && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setEducationLevel('all');
                                setAmountRange('all');
                                setDeadlineFilter('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {paginatedScholarships.map((scholarship, index) => {
                            const isBookmarked = bookmarkedScholarships.includes(scholarship.id);
                            const isDeadlinePassed = isPast(new Date(scholarship.deadline));
                            const isShowingDetails = showDetailsId === scholarship.id;

                            return (
                                <Grid item xs={12} md={6} lg={4} key={scholarship.id}>
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
                                                position: 'relative',
                                                opacity: isDeadlinePassed ? 0.8 : 1,
                                            }}
                                        >
                                            {isDeadlinePassed && (
                                                <Chip
                                                    label="Deadline Passed"
                                                    color="error"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        left: 12,
                                                        zIndex: 2,
                                                    }}
                                                />
                                            )}

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    zIndex: 2,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => toggleBookmark(e, scholarship.id)}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        '&:hover': { bgcolor: 'background.paper' },
                                                    }}
                                                >
                                                    {isBookmarked ? (
                                                        <BookmarkIcon color="primary" />
                                                    ) : (
                                                        <BookmarkBorderIcon />
                                                    )}
                                                </IconButton>
                                            </Box>

                                            <CardMedia
                                                component="div"
                                                sx={{
                                                    height: 120,
                                                    bgcolor: 'primary.main',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'white',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ textAlign: 'center', p: 2 }}>
                                                    {scholarship.title}
                                                </Typography>
                                            </CardMedia>

                                            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    {scholarship.organization}
                                                </Typography>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                                                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                                                            ${scholarship.amount.toLocaleString()}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: isDeadlinePassed ? 'error.main' : 'text.secondary' }} />
                                                        <Typography
                                                            variant="body2"
                                                            color={isDeadlinePassed ? 'error.main' : 'text.secondary'}
                                                            fontWeight={isDeadlinePassed ? 'bold' : 'normal'}
                                                        >
                                                            {format(new Date(scholarship.deadline), 'MMM d, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Chip
                                                    label={scholarship.education_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ mb: 2 }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: isShowingDetails ? 100 : 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {scholarship.description}
                                                </Typography>

                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={() => handleShowDetails(scholarship.id)}
                                                    sx={{ mb: 1 }}
                                                >
                                                    {isShowingDetails ? 'Show Less' : 'Show More'}
                                                </Button>

                                                {isShowingDetails && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Eligibility Requirements
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            {scholarship.eligibility_requirements || 'Not specified'}
                                                        </Typography>

                                                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                            Application Process
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {scholarship.application_process || 'Apply using the button below'}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>

                                            <CardActions sx={{ p: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    disabled={isDeadlinePassed}
                                                    onClick={() => handleApply(scholarship)}
                                                >
                                                    Apply Now
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Pagination */}
                    {filteredScholarships.length > ITEMS_PER_PAGE && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE)}
                                page={page}
                                onChange={handleChangePage}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Apply Dialog */}
            <Dialog
                open={applyDialogOpen}
                onClose={() => !submitLoading && setApplyDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ pb: 0 }}>
                    Apply for Scholarship
                </DialogTitle>
                <DialogContent>
                    {submitSuccess ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Your application has been submitted successfully! We will review your application and contact you soon.
                        </Alert>
                    ) : (
                        <>
                            {selectedScholarship && (
                                <Box sx={{ mb: 3, mt: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedScholarship.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Organization: {selectedScholarship.organization}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                                            <Typography variant="body1" fontWeight="medium" color="success.main">
                                                ${selectedScholarship.amount.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Deadline: {format(new Date(selectedScholarship.deadline), 'MMMM d, yyyy')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={applyData.contactName}
                                        onChange={(e) => setApplyData({ ...applyData, contactName: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={applyData.email}
                                        onChange={(e) => setApplyData({ ...applyData, email: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number (Optional)"
                                        value={applyData.phone}
                                        onChange={(e) => setApplyData({ ...applyData, phone: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Why do you deserve this scholarship?"
                                        placeholder="Describe your academic achievements, financial need, and how this scholarship will help you achieve your educational goals."
                                        multiline
                                        rows={6}
                                        value={applyData.whyDeserve}
                                        onChange={(e) => setApplyData({ ...applyData, whyDeserve: e.target.value })}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Alert severity="info" sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <InfoIcon sx={{ mr: 1, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            Application Process
                                        </Typography>
                                        <Typography variant="body2">
                                            After submitting this form, we will review your application and may request additional documents such as transcripts, letters of recommendation, or an essay. You'll be notified of the next steps via email.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Alert>
                        </>
                    )}
                </DialogContent>

                {!submitSuccess && (
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => setApplyDialogOpen(false)}
                            disabled={submitLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitApplication}
                            disabled={
                                submitLoading ||
                                !applyData.email ||
                                !applyData.contactName ||
                                !applyData.whyDeserve
                            }
                        >
                            {submitLoading ? (
                                <>
                                    Submitting...
                                    <LinearProgress
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: 2
                                        }}
                                    />
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </Box>
    );
}