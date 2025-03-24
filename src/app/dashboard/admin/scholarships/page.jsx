'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid } from 'date-fns';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import SvgIcon from '@/components/SvgIcon';

export default function ScholarshipsManagementPage() {
    const { user } = useAuth();
    const { createBulkNotifications } = useNotifications();
    
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: null,
        eligibility_criteria: '',
        application_url: '',
        provider: '',
        location: '',
        is_active: true
    });
    
    const [formErrors, setFormErrors] = useState({});
    
    useEffect(() => {
        loadScholarships();
    }, []);
    
    const loadScholarships = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            setScholarships(data || []);
        } catch (err) {
            console.error('Error loading scholarships:', err);
            setNotification({
                open: true,
                message: 'Failed to load scholarships',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    
    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            deadline: date
        }));
        
        // Clear error for deadline
        if (formErrors.deadline) {
            setFormErrors(prev => ({
                ...prev,
                deadline: ''
            }));
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const validateForm = () => {
        const errors = {};
        
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }
        
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        
        if (!formData.provider.trim()) {
            errors.provider = 'Provider is required';
        }
        
        if (!formData.location.trim()) {
            errors.location = 'Location is required';
        }
        
        if (formData.deadline && !isValid(new Date(formData.deadline))) {
            errors.deadline = 'Invalid date';
        }
        
        if (formData.application_url && !formData.application_url.startsWith('http')) {
            errors.application_url = 'URL must start with http:// or https://';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const uploadImage = async (file) => {
        if (!file) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('scholarship_images')
            .upload(filePath, file);
            
        if (uploadError) {
            throw uploadError;
        }
        
        const { data } = supabase.storage
            .from('scholarship_images')
            .getPublicUrl(filePath);
            
        return data.publicUrl;
    };
    
    const handleAddScholarship = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            // Upload image if selected
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            
            // Parse eligibility criteria as JSON
            let eligibilityCriteria;
            try {
                eligibilityCriteria = formData.eligibility_criteria.trim() 
                    ? JSON.parse(formData.eligibility_criteria) 
                    : {};
            } catch (err) {
                // If not valid JSON, store as a string in an array
                eligibilityCriteria = formData.eligibility_criteria.trim()
                    ? [formData.eligibility_criteria]
                    : [];
            }
            
            const { data, error } = await supabase
                .from('scholarships')
                .insert([{
                    title: formData.title,
                    description: formData.description,
                    deadline: formData.deadline,
                    eligibility_criteria: eligibilityCriteria,
                    application_url: formData.application_url,
                    provider: formData.provider,
                    location: formData.location,
                    image_url: imageUrl,
                    is_active: formData.is_active
                }])
                .select();
                
            if (error) throw error;
            
            // Add the new scholarship to the list
            setScholarships([data[0], ...scholarships]);
            
            // Create notifications for all students
            if (formData.is_active) {
                // Get all student user IDs
                const { data: studentIds, error: studentError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('role', 'student');
                    
                if (!studentError && studentIds && studentIds.length > 0) {
                    // Create notifications for all students
                    await createBulkNotifications(
                        studentIds.map(student => student.id),
                        'New Scholarship Available',
                        `${formData.title} from ${formData.provider} is now available. Check it out!`,
                        'info'
                    );
                }
            }
            
            setNotification({
                open: true,
                message: 'Scholarship added successfully',
                severity: 'success'
            });
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                deadline: null,
                eligibility_criteria: '',
                application_url: '',
                provider: '',
                location: '',
                is_active: true
            });
            setImageFile(null);
            setImagePreview('');
            
            setIsAddDialogOpen(false);
        } catch (err) {
            console.error('Error adding scholarship:', err);
            setNotification({
                open: true,
                message: 'Failed to add scholarship: ' + err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditScholarship = async () => {
        if (!validateForm() || !selectedScholarship) return;
        
        setLoading(true);
        try {
            // Upload image if a new one was selected
            let imageUrl = selectedScholarship.image_url;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            
            // Parse eligibility criteria as JSON
            let eligibilityCriteria;
            try {
                eligibilityCriteria = formData.eligibility_criteria.trim() 
                    ? JSON.parse(formData.eligibility_criteria) 
                    : {};
            } catch (err) {
                // If not valid JSON, store as a string in an array
                eligibilityCriteria = formData.eligibility_criteria.trim()
                    ? [formData.eligibility_criteria]
                    : [];
            }
            
            const { error } = await supabase
                .from('scholarships')
                .update({
                    title: formData.title,
                    description: formData.description,
                    deadline: formData.deadline,
                    eligibility_criteria: eligibilityCriteria,
                    application_url: formData.application_url,
                    provider: formData.provider,
                    location: formData.location,
                    image_url: imageUrl,
                    is_active: formData.is_active
                })
                .eq('id', selectedScholarship.id);
                
            if (error) throw error;
            
            // Update the scholarship in the list
            setScholarships(scholarships.map(scholarship => 
                scholarship.id === selectedScholarship.id 
                    ? { 
                        ...scholarship, 
                        title: formData.title,
                        description: formData.description,
                        deadline: formData.deadline,
                        eligibility_criteria: eligibilityCriteria,
                        application_url: formData.application_url,
                        provider: formData.provider,
                        location: formData.location,
                        image_url: imageUrl,
                        is_active: formData.is_active
                    } 
                    : scholarship
            ));
            
            setNotification({
                open: true,
                message: 'Scholarship updated successfully',
                severity: 'success'
            });
            
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error('Error updating scholarship:', err);
            setNotification({
                open: true,
                message: 'Failed to update scholarship: ' + err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteScholarship = async () => {
        if (!selectedScholarship) return;
        
        setLoading(true);
        try {
            const { error } = await supabase
                .from('scholarships')
                .delete()
                .eq('id', selectedScholarship.id);
                
            if (error) throw error;
            
            // Remove the scholarship from the list
            setScholarships(scholarships.filter(scholarship => scholarship.id !== selectedScholarship.id));
            
            setNotification({
                open: true,
                message: 'Scholarship deleted successfully',
                severity: 'success'
            });
            
            setIsDeleteDialogOpen(false);
        } catch (err) {
            console.error('Error deleting scholarship:', err);
            setNotification({
                open: true,
                message: 'Failed to delete scholarship: ' + err.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenAddDialog = () => {
        setFormData({
            title: '',
            description: '',
            deadline: null,
            eligibility_criteria: '',
            application_url: '',
            provider: '',
            location: '',
            is_active: true
        });
        setImageFile(null);
        setImagePreview('');
        setFormErrors({});
        setIsAddDialogOpen(true);
    };
    
    const handleOpenEditDialog = (scholarship) => {
        setSelectedScholarship(scholarship);
        
        // Format eligibility criteria for display
        let eligibilityCriteriaStr = '';
        if (scholarship.eligibility_criteria) {
            if (Array.isArray(scholarship.eligibility_criteria)) {
                eligibilityCriteriaStr = scholarship.eligibility_criteria.join(', ');
            } else if (typeof scholarship.eligibility_criteria === 'object') {
                eligibilityCriteriaStr = JSON.stringify(scholarship.eligibility_criteria);
            } else {
                eligibilityCriteriaStr = scholarship.eligibility_criteria.toString();
            }
        }
        
        setFormData({
            title: scholarship.title || '',
            description: scholarship.description || '',
            deadline: scholarship.deadline ? new Date(scholarship.deadline) : null,
            eligibility_criteria: eligibilityCriteriaStr,
            application_url: scholarship.application_url || '',
            provider: scholarship.provider || '',
            location: scholarship.location || '',
            is_active: scholarship.is_active
        });
        
        setImagePreview(scholarship.image_url || '');
        setFormErrors({});
        setIsEditDialogOpen(true);
    };
    
    const handleOpenDeleteDialog = (scholarship) => {
        setSelectedScholarship(scholarship);
        setIsDeleteDialogOpen(true);
    };
    
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };
    
    const formatEligibilityCriteria = (criteria) => {
        if (!criteria) return 'None';
        
        if (Array.isArray(criteria)) {
            return criteria.join(', ');
        } else if (typeof criteria === 'object') {
            return Object.entries(criteria)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        
        return criteria.toString();
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Scholarship Management
            </Typography>
            
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenAddDialog}
                    startIcon={<SvgIcon icon="tabler-plus" />}
                >
                    Add New Scholarship
                </Button>
            </Box>
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {loading && !scholarships.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : scholarships.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1">No scholarships found</Typography>
                    </Box>
                ) : (
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Deadline</TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scholarships.map((scholarship) => (
                                    <TableRow key={scholarship.id}>
                                        <TableCell>{scholarship.title}</TableCell>
                                        <TableCell>{scholarship.provider}</TableCell>
                                        <TableCell>{scholarship.location}</TableCell>
                                        <TableCell>
                                            {scholarship.deadline 
                                                ? format(new Date(scholarship.deadline), 'MMM d, yyyy') 
                                                : 'No deadline'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={scholarship.is_active ? 'Active' : 'Inactive'} 
                                                color={scholarship.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleOpenEditDialog(scholarship)}
                                                title="Edit"
                                            >
                                                <SvgIcon icon="tabler-edit" />
                                            </IconButton>
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleOpenDeleteDialog(scholarship)}
                                                title="Delete"
                                            >
                                                <SvgIcon icon="tabler-trash" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            
            {/* Add Scholarship Dialog */}
            <Dialog 
                open={isAddDialogOpen} 
                onClose={() => setIsAddDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Scholarship</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Provider"
                                name="provider"
                                value={formData.provider}
                                onChange={handleInputChange}
                                error={!!formErrors.provider}
                                helperText={formErrors.provider}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                error={!!formErrors.location}
                                helperText={formErrors.location}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Deadline"
                                    value={formData.deadline}
                                    onChange={handleDateChange}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            fullWidth 
                                            error={!!formErrors.deadline}
                                            helperText={formErrors.deadline}
                                        />
                                    )}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!formErrors.deadline,
                                            helperText: formErrors.deadline
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Eligibility Criteria (comma separated or JSON)"
                                name="eligibility_criteria"
                                value={formData.eligibility_criteria}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                                error={!!formErrors.eligibility_criteria}
                                helperText={formErrors.eligibility_criteria}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Application URL"
                                name="application_url"
                                value={formData.application_url}
                                onChange={handleInputChange}
                                error={!!formErrors.application_url}
                                helperText={formErrors.application_url}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Scholarship Image
                                </Typography>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="scholarship-image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="scholarship-image-upload">
                                    <Button variant="outlined" component="span">
                                        Upload Image
                                    </Button>
                                </label>
                            </Box>
                            
                            {imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Scholarship preview" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '200px',
                                            objectFit: 'contain' 
                                        }} 
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                    checked={formData.is_active}
                                    onChange={handleSwitchChange}
                                    name="is_active"
                                    color="primary"
                                />
                                <Typography>
                                    {formData.is_active ? 'Active' : 'Inactive'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleAddScholarship} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add Scholarship'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Edit Scholarship Dialog */}
            <Dialog 
                open={isEditDialogOpen} 
                onClose={() => setIsEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Scholarship</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Provider"
                                name="provider"
                                value={formData.provider}
                                onChange={handleInputChange}
                                error={!!formErrors.provider}
                                helperText={formErrors.provider}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                error={!!formErrors.location}
                                helperText={formErrors.location}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Deadline"
                                    value={formData.deadline}
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!formErrors.deadline,
                                            helperText: formErrors.deadline
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Eligibility Criteria (comma separated or JSON)"
                                name="eligibility_criteria"
                                value={formData.eligibility_criteria}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                                error={!!formErrors.eligibility_criteria}
                                helperText={formErrors.eligibility_criteria}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Application URL"
                                name="application_url"
                                value={formData.application_url}
                                onChange={handleInputChange}
                                error={!!formErrors.application_url}
                                helperText={formErrors.application_url}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Scholarship Image
                                </Typography>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="scholarship-image-edit"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="scholarship-image-edit">
                                    <Button variant="outlined" component="span">
                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                    </Button>
                                </label>
                            </Box>
                            
                            {imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Scholarship preview" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '200px',
                                            objectFit: 'contain' 
                                        }} 
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                    checked={formData.is_active}
                                    onChange={handleSwitchChange}
                                    name="is_active"
                                    color="primary"
                                />
                                <Typography>
                                    {formData.is_active ? 'Active' : 'Inactive'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleEditScholarship} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Update Scholarship'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the scholarship "{selectedScholarship?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteScholarship} 
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
