'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import {
    Box,
    Container,
    Paper,
    Typography,
    Avatar,
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    margin: '0 auto',
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        avatar_url: '',
        bio: '',
        school: '',
        grade: '',
        interests: '',
    });

    useEffect(() => {
        if (user?.id) {
            getProfile();
        } else {
            console.log('No user ID available');
            setLoading(false);
        }
    }, [user]);

    async function getProfile() {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching profile for user:', user.id);

            // First check if profile exists
            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle(); // Use maybeSingle instead of single to prevent error if no row exists

            console.log('Profile fetch response:', { existingProfile, fetchError });

            if (fetchError) {
                console.error('Error fetching profile:', fetchError);
                throw new Error(`Failed to fetch profile: ${fetchError.message}`);
            }

            if (!existingProfile) {
                console.log('Profile not found, creating new profile');
                // Create a new profile if it doesn't exist
                const profileData = {
                    id: user.id,
                    full_name: user.user_metadata?.full_name || '',
                    avatar_url: '',
                    bio: '',
                    school: '',
                    grade: '',
                    interests: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                console.log('Attempting to create profile with data:', profileData);

                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert([profileData])
                    .select()
                    .maybeSingle();

                console.log('Profile creation response:', { newProfile, insertError });

                if (insertError) {
                    console.error('Error creating profile:', {
                        message: insertError.message,
                        code: insertError.code,
                        details: insertError.details,
                        hint: insertError.hint
                    });
                    throw new Error(`Failed to create profile: ${insertError.message || 'Unknown error'}`);
                }

                setProfile({
                    full_name: newProfile?.full_name || user.user_metadata?.full_name || '',
                    avatar_url: newProfile?.avatar_url || '',
                    bio: newProfile?.bio || '',
                    school: newProfile?.school || '',
                    grade: newProfile?.grade || '',
                    interests: newProfile?.interests || '',
                });
            } else {
                console.log('Profile found:', existingProfile);
                setProfile({
                    full_name: existingProfile.full_name || '',
                    avatar_url: existingProfile.avatar_url || '',
                    bio: existingProfile.bio || '',
                    school: existingProfile.school || '',
                    grade: existingProfile.grade || '',
                    interests: existingProfile.interests || '',
                });
            }
        } catch (error) {
            console.error('Error in getProfile:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(e) {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            console.log('Updating profile:', profile);

            const updates = {
                id: user.id,
                ...profile,
                updated_at: new Date().toISOString(),
            };

            const { error: updateError } = await supabase
                .from('profiles')
                .upsert(updates);

            if (updateError) {
                console.error('Error updating profile:', updateError);
                throw new Error(`Failed to update profile: ${updateError.message}`);
            }

            setSuccess('Profile updated successfully!');
        } catch (error) {
            console.error('Error in updateProfile:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    }

    async function uploadAvatar(event) {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Only image files are allowed.');
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB.');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = fileName;

            console.log('File path for upload:', filePath);

            // First try to get the user's current avatar if it exists
            if (profile.avatar_url) {
                try {
                    console.log('Attempting to delete old avatar before upload');
                    const oldPath = profile.avatar_url.split('/').pop();

                    if (oldPath) {
                        const { error: deleteError } = await supabase.storage
                            .from('avatars')
                            .remove([oldPath]);

                        if (deleteError) {
                            console.warn('Error deleting old avatar:', deleteError);
                            // Continue with upload even if delete fails
                        } else {
                            console.log('Successfully deleted old avatar');
                        }
                    }
                } catch (deleteErr) {
                    console.warn('Error in delete operation:', deleteErr);
                    // Continue with upload even if delete fails
                }
            }

            // Upload the new avatar
            console.log('Starting upload to Supabase storage');
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true // Use upsert to replace existing file
                });

            if (uploadError) {
                console.error('Error uploading avatar:', uploadError);
                throw new Error(`Failed to upload avatar: ${uploadError.message || 'Upload failed'}`);
            }

            console.log('Upload successful:', uploadData);

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Avatar uploaded successfully, public URL:', publicUrl);

            // Update the profile with the new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('Error updating profile with new avatar:', updateError);
                throw new Error(`Profile update failed: ${updateError.message}`);
            }

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setSuccess('Avatar uploaded and profile updated successfully!');
        } catch (error) {
            console.error('Error in uploadAvatar:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to upload avatar');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Profile Settings
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={updateProfile}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} textAlign="center">
                            <Box position="relative" display="inline-block">
                                <ProfileAvatar
                                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}`}
                                    alt={profile.full_name}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    type="file"
                                    onChange={uploadAvatar}
                                />
                                <label htmlFor="avatar-upload">
                                    <Button
                                        component="span"
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                        disabled={loading}
                                    >
                                        Change Avatar
                                    </Button>
                                </label>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={profile.full_name}
                                onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="School"
                                value={profile.school}
                                onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Grade"
                                value={profile.grade}
                                onChange={(e) => setProfile(prev => ({ ...prev, grade: e.target.value }))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Interests"
                                value={profile.interests}
                                onChange={(e) => setProfile(prev => ({ ...prev, interests: e.target.value }))}
                                helperText="Separate interests with commas"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bio"
                                value={profile.bio}
                                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="center">
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={saving}
                                sx={{ minWidth: 200 }}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
} 