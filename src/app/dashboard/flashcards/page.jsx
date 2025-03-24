'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Divider,
    Fab,
    Stack,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    School as SchoolIcon,
    AutoStories as StudyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function FlashcardsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [newDeckData, setNewDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false,
    });

    useEffect(() => {
        if (user) {
            fetchDecks();
        }
    }, [user]);

    const fetchDecks = async () => {
        try {
            const { data, error } = await supabase
                .from('flashcard_decks')
                .select('*, flashcards:flashcards(count)')
                .or(`created_by.eq.${user.id},is_public.eq.true`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDecks(data || []);
        } catch (error) {
            console.error('Error fetching flashcard decks:', error);
            setError('Failed to load flashcard decks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDeck = async () => {
        try {
            if (!newDeckData.title) {
                throw new Error('Title is required');
            }

            const { data, error } = await supabase
                .from('flashcard_decks')
                .insert([
                    {
                        title: newDeckData.title,
                        description: newDeckData.description,
                        subject: newDeckData.subject,
                        is_public: newDeckData.isPublic,
                        created_by: user.id,
                    },
                ])
                .select();

            if (error) throw error;

            setDecks([data[0], ...decks]);
            setIsCreating(false);
            setNewDeckData({
                title: '',
                description: '',
                subject: '',
                isPublic: false,
            });
        } catch (error) {
            console.error('Error creating deck:', error);
            setError(error.message);
        }
    };

    const handleDeleteDeck = async () => {
        try {
            const { error } = await supabase
                .from('flashcard_decks')
                .delete()
                .eq('id', selectedDeckId);

            if (error) throw error;

            setDecks(decks.filter((deck) => deck.id !== selectedDeckId));
            setDeleteConfirmOpen(false);
            setSelectedDeckId(null);
        } catch (error) {
            console.error('Error deleting deck:', error);
            setError('Failed to delete deck. Please try again later.');
        }
    };

    const handleMenuOpen = (event, deckId) => {
        event.stopPropagation();
        setSelectedDeckId(deckId);
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOpenDeleteConfirm = () => {
        handleMenuClose();
        setDeleteConfirmOpen(true);
    };

    const handleOpenDeck = (deckId) => {
        router.push(`/dashboard/flashcards/${deckId}`);
    };

    const handleStudyDeck = (e, deckId) => {
        e.stopPropagation();
        router.push(`/dashboard/flashcards/study/${deckId}`);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Flashcards</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => router.push('/flashcards/subjects')}
                        startIcon={<SchoolIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        Subject Flashcards
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreating(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Create Deck
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {decks.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 6,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No flashcard decks yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                        Create your first flashcard deck to improve your learning and memorization.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreating(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Create Your First Deck
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {decks.map((deck, index) => (
                        <Grid item xs={12} sm={6} md={4} key={deck.id}>
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
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                        },
                                        position: 'relative',
                                        borderRadius: 2,
                                    }}
                                    onClick={() => handleOpenDeck(deck.id)}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                        }}
                                    >
                                        {deck.created_by === user.id && (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, deck.id)}
                                                sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>

                                    <CardContent sx={{ pt: 4, pb: 2, px: 3, flexGrow: 1 }}>
                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                            <Chip
                                                label={deck.subject || 'General'}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ borderRadius: 1, mr: 1 }}
                                            />
                                            {deck.is_public && (
                                                <Chip
                                                    label="Public"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="h6" gutterBottom>
                                            {deck.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: 40,
                                            }}
                                        >
                                            {deck.description || 'No description provided.'}
                                        </Typography>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" fontWeight="500">
                                                {deck.flashcards ? deck.flashcards.length : 0} Cards
                                            </Typography>

                                            {deck.created_by !== user.id && (
                                                <Typography variant="caption" color="text.secondary">
                                                    • Shared
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>

                                    <CardActions sx={{ px: 3, pb: 3 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<StudyIcon />}
                                            onClick={(e) => handleStudyDeck(e, deck.id)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Study Now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Deck Dialog */}
            <Dialog open={isCreating} onClose={() => setIsCreating(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Flashcard Deck</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newDeckData.title}
                        onChange={(e) => setNewDeckData({ ...newDeckData, title: e.target.value })}
                        required
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newDeckData.description}
                        onChange={(e) => setNewDeckData({ ...newDeckData, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Subject"
                        fullWidth
                        value={newDeckData.subject}
                        onChange={(e) => setNewDeckData({ ...newDeckData, subject: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newDeckData.isPublic}
                                onChange={(e) => setNewDeckData({ ...newDeckData, isPublic: e.target.checked })}
                            />
                        }
                        label="Make deck public"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateDeck}
                        variant="contained"
                        disabled={!newDeckData.title}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deck Options Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    router.push(`/dashboard/flashcards/edit/${selectedDeckId}`);
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteConfirm}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Delete Flashcard Deck?</DialogTitle>
                <DialogContent>
                    <Typography>
                        This action cannot be undone. All cards in this deck will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteDeck}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 