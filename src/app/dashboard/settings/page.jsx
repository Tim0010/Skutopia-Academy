'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Switch,
    FormControlLabel,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { SvgIcon } from '@mui/material';

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [settings, setSettings] = useState({
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false
    });
    const router = useRouter();

    useEffect(() => {
        if (user?.id) {
            setEmail(user.email || '');
            getSettings();
        } else {
            console.log('No user ID available');
            setLoading(false);
        }
    }, [user]);

    async function getSettings() {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching settings for user:', user.id);

            // Check if settings exist
            const { data: existingSettings, error: fetchError } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle(); // Use maybeSingle instead of single to prevent error if no row found

            console.log('Settings fetch response:', { existingSettings, fetchError });

            if (fetchError) {
                console.error('Error fetching settings:', fetchError);
                throw new Error(`Failed to fetch settings: ${fetchError.message}`);
            }

            if (!existingSettings) {
                console.log('Settings not found, creating default settings');
                // Create default settings
                const defaultSettings = {
                    user_id: user.id,
                    email_notifications: true,
                    push_notifications: true,
                    marketing_emails: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                console.log('Inserting default settings:', defaultSettings);

                const { data: newSettings, error: insertError } = await supabase
                    .from('user_settings')
                    .insert([defaultSettings])
                    .select()
                    .single();

                console.log('Settings creation response:', { newSettings, insertError });

                if (insertError) {
                    console.error('Error creating settings:', {
                        message: insertError.message,
                        code: insertError.code,
                        details: insertError.details,
                        hint: insertError.hint
                    });
                    throw new Error(`Failed to create settings: ${insertError.message || 'Unknown error'}`);
                }

                setSettings({
                    email_notifications: newSettings?.email_notifications ?? true,
                    push_notifications: newSettings?.push_notifications ?? true,
                    marketing_emails: newSettings?.marketing_emails ?? false
                });
            } else {
                console.log('Settings found:', existingSettings);
                setSettings({
                    email_notifications: existingSettings.email_notifications,
                    push_notifications: existingSettings.push_notifications,
                    marketing_emails: existingSettings.marketing_emails
                });
            }
        } catch (error) {
            console.error('Error in getSettings:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }

    async function updatePassword(e) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            console.log('Updating password');

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                console.error('Error updating password:', error);
                throw error;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess('Password updated successfully!');
        } catch (error) {
            console.error('Error in updatePassword:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    }

    async function updateSettings() {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            console.log('Updating settings:', settings);

            const { error: updateError } = await supabase
                .from('user_settings')
                .update({
                    email_notifications: settings.email_notifications,
                    push_notifications: settings.push_notifications,
                    marketing_emails: settings.marketing_emails,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (updateError) {
                console.error('Error updating settings:', updateError);
                throw new Error(`Failed to update settings: ${updateError.message}`);
            }

            setSuccess('Settings updated successfully!');
        } catch (error) {
            console.error('Error in updateSettings:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            setError(error.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" py={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Account Settings
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

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Account Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            disabled
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Change Password
                </Typography>

                <form onSubmit={updatePassword}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                error={newPassword !== confirmPassword && confirmPassword !== ''}
                                helperText={newPassword !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Update Password'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Notification Preferences
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.email_notifications}
                                    onChange={(e) => setSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                                    color="primary"
                                />
                            }
                            label="Email Notifications"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.push_notifications}
                                    onChange={(e) => setSettings(prev => ({ ...prev, push_notifications: e.target.checked }))}
                                    color="primary"
                                />
                            }
                            label="Push Notifications"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.marketing_emails}
                                    onChange={(e) => setSettings(prev => ({ ...prev, marketing_emails: e.target.checked }))}
                                    color="primary"
                                />
                            }
                            label="Marketing Emails"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={updateSettings}
                            disabled={saving}
                        >
                            {saving ? <CircularProgress size={24} /> : 'Save Preferences'}
                        </Button>
                    </Grid>
                </Grid>

                {/* Admin Settings (if admin) */}
                {user?.user_metadata?.role === 'admin' && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Admin Settings
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => router.push('/admin/setup')}
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ListItemIcon>
                                        <SvgIcon name="tabler-database" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Database Setup"
                                        secondary="Set up required database tables and functions"
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
} 