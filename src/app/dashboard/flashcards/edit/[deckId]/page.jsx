'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    FormControlLabel,
    Switch,
    Tabs,
    Tab,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function EditDeckPage({ params }) {
    const { deckId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [deckData, setDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false,
    });
    const [cards, setCards] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newCardData, setNewCardData] = useState({
        front: '',
        back: '',
        isStarred: false,
    });
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editCardId, setEditCardId] = useState(null);
    const [editCardData, setEditCardData] = useState({
        front: '',
        back: '',
        isStarred: false,
    });

    useEffect(() => {
        if (user) {
            fetchDeckAndCards();
        }
    }, [user, deckId]);

    const fetchDeckAndCards = async () => {
        try {
            setLoading(true);

            // Fetch deck
            const { data: deckData, error: deckError } = await supabase
                .from('flashcard_decks')
                .select('*')
                .eq('id', deckId)
                .single();

            if (deckError) throw deckError;

            // Check permissions
            if (deckData.created_by !== user.id) {
                router.push('/dashboard/flashcards');
                return;
            }

            setDeckData({
                title: deckData.title,
                description: deckData.description || '',
                subject: deckData.subject || '',
                isPublic: deckData.is_public,
            });

            // Fetch flashcards
            const { data: cardData, error: cardError } = await supabase
                .from('flashcards')
                .select('*')
                .eq('deck_id', deckId)
                .order('order_number', { ascending: true });

            if (cardError) throw cardError;

            // If cards don't have an order_number, add one
            const cardsWithOrder = cardData.map((card, index) => ({
                ...card,
                order_number: card.order_number || index + 1
            }));

            setCards(cardsWithOrder || []);
        } catch (error) {
            console.error('Error fetching deck and cards:', error);
            setError('Failed to load flashcard deck. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSaveDeck = async () => {
        try {
            if (!deckData.title.trim()) {
                setError('Title is required');
                return;
            }

            setSaving(true);
            setError(null);
            setSuccess(null);

            const { error } = await supabase
                .from('flashcard_decks')
                .update({
                    title: deckData.title,
                    description: deckData.description,
                    subject: deckData.subject,
                    is_public: deckData.isPublic,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', deckId);

            if (error) throw error;

            // Save card order
            const orderPromises = cards.map((card, index) => {
                return supabase
                    .from('flashcards')
                    .update({ order_number: index + 1 })
                    .eq('id', card.id);
            });

            await Promise.all(orderPromises);

            setSuccess('Deck saved successfully!');

            // Automatically clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            console.error('Error saving deck:', error);
            setError('Failed to save deck. Please try again later.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateCard = async () => {
        try {
            if (!newCardData.front.trim() || !newCardData.back.trim()) {
                setError('Front and back content are required');
                return;
            }

            setSaving(true);
            setError(null);

            const newOrderNumber = cards.length > 0
                ? Math.max(...cards.map(c => c.order_number || 0)) + 1
                : 1;

            const { data, error } = await supabase
                .from('flashcards')
                .insert([
                    {
                        deck_id: deckId,
                        front_content: newCardData.front,
                        back_content: newCardData.back,
                        is_starred: newCardData.isStarred,
                        created_by: user.id,
                        order_number: newOrderNumber,
                    },
                ])
                .select();

            if (error) throw error;

            setCards([...cards, data[0]]);
            setIsCreating(false);
            setNewCardData({
                front: '',
                back: '',
                isStarred: false,
            });
        } catch (error) {
            console.error('Error creating flashcard:', error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateCard = async () => {
        try {
            if (!editCardData.front.trim() || !editCardData.back.trim()) {
                setError('Front and back content are required');
                return;
            }

            setSaving(true);
            setError(null);

            const { error } = await supabase
                .from('flashcards')
                .update({
                    front_content: editCardData.front,
                    back_content: editCardData.back,
                    is_starred: editCardData.isStarred,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editCardId);

            if (error) throw error;

            setCards(cards.map(card =>
                card.id === editCardId
                    ? {
                        ...card,
                        front_content: editCardData.front,
                        back_content: editCardData.back,
                        is_starred: editCardData.isStarred
                    }
                    : card
            ));

            setEditCardId(null);
        } catch (error) {
            console.error('Error updating flashcard:', error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            setSaving(true);
            setError(null);

            const { error } = await supabase
                .from('flashcards')
                .delete()
                .eq('id', cardId);

            if (error) throw error;

            setCards(cards.filter(card => card.id !== cardId));
            setConfirmDelete(null);
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            setError('Failed to delete flashcard. Please try again later.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditCard = (card) => {
        setEditCardId(card.id);
        setEditCardData({
            front: card.front_content,
            back: card.back_content,
            isStarred: card.is_starred,
        });
    };

    const handleToggleStarCard = async (cardId) => {
        const cardToUpdate = cards.find(card => card.id === cardId);
        if (!cardToUpdate) return;

        try {
            setSaving(true);
            setError(null);

            const { error } = await supabase
                .from('flashcards')
                .update({
                    is_starred: !cardToUpdate.is_starred,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', cardId);

            if (error) throw error;

            setCards(cards.map(card =>
                card.id === cardId
                    ? { ...card, is_starred: !card.is_starred }
                    : card
            ));
        } catch (error) {
            console.error('Error updating flashcard star status:', error);
            setError('Failed to update star status. Please try again later.');
        } finally {
            setSaving(false);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(cards);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCards(items.map((item, index) => ({
            ...item,
            order_number: index + 1
        })));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => router.push(`/dashboard/flashcards/${deckId}`)}
                        sx={{ mr: 1 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">Edit Deck</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDeck}
                    disabled={saving}
                    sx={{ borderRadius: 2 }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Deck Details" />
                <Tab label="Flashcards" />
            </Tabs>

            {tabValue === 0 && (
                <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Deck Title"
                                fullWidth
                                value={deckData.title}
                                onChange={(e) => setDeckData({ ...deckData, title: e.target.value })}
                                required
                                error={!deckData.title.trim()}
                                helperText={!deckData.title.trim() ? 'Title is required' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Subject"
                                fullWidth
                                value={deckData.subject}
                                onChange={(e) => setDeckData({ ...deckData, subject: e.target.value })}
                                placeholder="E.g., Math, Science, History"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={deckData.description}
                                onChange={(e) => setDeckData({ ...deckData, description: e.target.value })}
                                placeholder="Describe what this deck covers or how it should be used"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={deckData.isPublic}
                                        onChange={(e) => setDeckData({ ...deckData, isPublic: e.target.checked })}
                                    />
                                }
                                label="Make deck public (share with other users)"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            Manage Flashcards ({cards.length})
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreating(true)}
                            sx={{ borderRadius: 2 }}
                        >
                            Add Card
                        </Button>
                    </Box>

                    {cards.length === 0 ? (
                        <Paper
                            elevation={0}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 6,
                                borderRadius: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No cards in this deck yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                                Start adding flashcards to begin learning and memorizing this material.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setIsCreating(true)}
                            >
                                Add Your First Card
                            </Button>
                        </Paper>
                    ) : (
                        <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'background.subtle' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Drag cards to reorder them. The order will be saved when you click "Save Changes".
                                </Typography>
                            </Box>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="flashcards">
                                    {(provided) => (
                                        <List
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            disablePadding
                                        >
                                            {cards.map((card, index) => (
                                                <Draggable
                                                    key={card.id}
                                                    draggableId={card.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <ListItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            divider={index !== cards.length - 1}
                                                            sx={{
                                                                px: 3,
                                                                py: 2,
                                                                '&:hover': {
                                                                    bgcolor: 'action.hover',
                                                                },
                                                            }}
                                                        >
                                                            <Box
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    mr: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <DragIndicatorIcon color="action" />
                                                            </Box>
                                                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <Typography variant="subtitle1" fontWeight={500}>
                                                                        {index + 1}.
                                                                    </Typography>
                                                                    {card.is_starred && (
                                                                        <StarIcon color="warning" sx={{ ml: 1, fontSize: 18 }} />
                                                                    )}
                                                                </Box>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                Front:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                                {card.front_content.length > 100
                                                                                    ? `${card.front_content.substring(0, 100)}...`
                                                                                    : card.front_content}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                Back:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                                {card.back_content.length > 100
                                                                                    ? `${card.back_content.substring(0, 100)}...`
                                                                                    : card.back_content}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                            <Stack direction="row" spacing={1}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleToggleStarCard(card.id)}
                                                                    color={card.is_starred ? "warning" : "default"}
                                                                >
                                                                    {card.is_starred ? <StarIcon /> : <StarBorderIcon />}
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleEditCard(card)}
                                                                    color="primary"
                                                                >
                                                                    <SaveIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => setConfirmDelete(card.id)}
                                                                    color="error"
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Stack>
                                                        </ListItem>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </List>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Create Card Dialog */}
            <Dialog open={isCreating} onClose={() => setIsCreating(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Flashcard</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Front"
                        fullWidth
                        multiline
                        rows={3}
                        value={newCardData.front}
                        onChange={(e) => setNewCardData({ ...newCardData, front: e.target.value })}
                        required
                        error={!newCardData.front.trim()}
                        helperText={!newCardData.front.trim() ? 'Front content is required' : ''}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Back"
                        fullWidth
                        multiline
                        rows={3}
                        value={newCardData.back}
                        onChange={(e) => setNewCardData({ ...newCardData, back: e.target.value })}
                        required
                        error={!newCardData.back.trim()}
                        helperText={!newCardData.back.trim() ? 'Back content is required' : ''}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newCardData.isStarred}
                                onChange={(e) => setNewCardData({ ...newCardData, isStarred: e.target.checked })}
                            />
                        }
                        label="Mark as important"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateCard}
                        variant="contained"
                        disabled={!newCardData.front.trim() || !newCardData.back.trim() || saving}
                    >
                        {saving ? 'Adding...' : 'Add Card'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Card Dialog */}
            <Dialog
                open={editCardId !== null}
                onClose={() => setEditCardId(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Flashcard</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Front"
                        fullWidth
                        multiline
                        rows={3}
                        value={editCardData.front}
                        onChange={(e) => setEditCardData({ ...editCardData, front: e.target.value })}
                        required
                        error={!editCardData.front.trim()}
                        helperText={!editCardData.front.trim() ? 'Front content is required' : ''}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Back"
                        fullWidth
                        multiline
                        rows={3}
                        value={editCardData.back}
                        onChange={(e) => setEditCardData({ ...editCardData, back: e.target.value })}
                        required
                        error={!editCardData.back.trim()}
                        helperText={!editCardData.back.trim() ? 'Back content is required' : ''}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editCardData.isStarred}
                                onChange={(e) => setEditCardData({ ...editCardData, isStarred: e.target.checked })}
                            />
                        }
                        label="Mark as important"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditCardId(null)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateCard}
                        variant="contained"
                        disabled={!editCardData.front.trim() || !editCardData.back.trim() || saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Card Confirmation Dialog */}
            <Dialog
                open={confirmDelete !== null}
                onClose={() => setConfirmDelete(null)}
            >
                <DialogTitle>Delete Flashcard?</DialogTitle>
                <DialogContent>
                    <Typography>
                        This action cannot be undone. The flashcard will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button
                        onClick={() => handleDeleteCard(confirmDelete)}
                        color="error"
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 