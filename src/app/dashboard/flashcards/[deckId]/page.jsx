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
    Chip,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    AutoStories as StudyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function FlashcardDeckPage({ params }) {
    const { deckId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editDeckData, setEditDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false,
    });
    const [newCardData, setNewCardData] = useState({
        front: '',
        back: '',
        isStarred: false,
    });
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [cardMenuAnchorEl, setCardMenuAnchorEl] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState(null);
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
            setDeck(deckData);
            setEditDeckData({
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
                .order('created_at');

            if (cardError) throw cardError;
            setCards(cardData || []);
        } catch (error) {
            console.error('Error fetching deck and cards:', error);
            setError('Failed to load flashcard deck. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCard = async () => {
        try {
            if (!newCardData.front || !newCardData.back) {
                throw new Error('Front and back content are required');
            }

            const { data, error } = await supabase
                .from('flashcards')
                .insert([
                    {
                        deck_id: deckId,
                        front_content: newCardData.front,
                        back_content: newCardData.back,
                        is_starred: newCardData.isStarred,
                        created_by: user.id,
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
        }
    };

    const handleUpdateDeck = async () => {
        try {
            if (!editDeckData.title) {
                throw new Error('Title is required');
            }

            const { error } = await supabase
                .from('flashcard_decks')
                .update({
                    title: editDeckData.title,
                    description: editDeckData.description,
                    subject: editDeckData.subject,
                    is_public: editDeckData.isPublic,
                })
                .eq('id', deckId);

            if (error) throw error;

            setDeck({
                ...deck,
                title: editDeckData.title,
                description: editDeckData.description,
                subject: editDeckData.subject,
                is_public: editDeckData.isPublic,
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating deck:', error);
            setError(error.message);
        }
    };

    const handleUpdateCard = async () => {
        try {
            if (!editCardData.front || !editCardData.back) {
                throw new Error('Front and back content are required');
            }

            const { error } = await supabase
                .from('flashcards')
                .update({
                    front_content: editCardData.front,
                    back_content: editCardData.back,
                    is_starred: editCardData.isStarred,
                })
                .eq('id', editingCardId);

            if (error) throw error;

            // Update cards state
            setCards(cards.map(card =>
                card.id === editingCardId
                    ? {
                        ...card,
                        front_content: editCardData.front,
                        back_content: editCardData.back,
                        is_starred: editCardData.isStarred
                    }
                    : card
            ));

            setEditingCardId(null);
        } catch (error) {
            console.error('Error updating flashcard:', error);
            setError(error.message);
        }
    };

    const handleDeleteCard = async () => {
        try {
            const { error } = await supabase
                .from('flashcards')
                .delete()
                .eq('id', selectedCardId);

            if (error) throw error;

            setCards(cards.filter(card => card.id !== selectedCardId));
            setDeleteConfirmOpen(false);
            setSelectedCardId(null);
            setCardMenuAnchorEl(null);
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            setError('Failed to delete flashcard. Please try again later.');
        }
    };

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleCardMenuOpen = (event, cardId) => {
        event.stopPropagation();
        setSelectedCardId(cardId);
        setCardMenuAnchorEl(event.currentTarget);
    };

    const handleCardMenuClose = () => {
        setCardMenuAnchorEl(null);
    };

    const handleEditCard = (card) => {
        setEditingCardId(card.id);
        setEditCardData({
            front: card.front_content,
            back: card.back_content,
            isStarred: card.is_starred,
        });
        handleCardMenuClose();
    };

    const handleOpenDeleteConfirm = () => {
        handleCardMenuClose();
        setDeleteConfirmOpen(true);
    };

    const handleToggleStarCard = async (cardId) => {
        const cardToUpdate = cards.find(card => card.id === cardId);
        if (!cardToUpdate) return;

        try {
            const { error } = await supabase
                .from('flashcards')
                .update({
                    is_starred: !cardToUpdate.is_starred,
                })
                .eq('id', cardId);

            if (error) throw error;

            // Update cards state
            setCards(cards.map(card =>
                card.id === cardId
                    ? { ...card, is_starred: !card.is_starred }
                    : card
            ));
        } catch (error) {
            console.error('Error updating flashcard star status:', error);
        }
    };

    const handleStudyDeck = () => {
        router.push(`/dashboard/flashcards/study/${deckId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!deck) {
        return (
            <Box sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/dashboard/flashcards')}
                    sx={{ mb: 2 }}
                >
                    Back to Decks
                </Button>
                <Alert severity="error">
                    Flashcard deck not found. It may have been deleted or you don't have permission to view it.
                </Alert>
            </Box>
        );
    }

    const isOwner = deck.created_by === user.id;

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => router.push('/dashboard/flashcards')}
                        sx={{ mr: 1 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">{deck.title}</Typography>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<StudyIcon />}
                        onClick={handleStudyDeck}
                        sx={{ mr: 2, borderRadius: 2 }}
                    >
                        Study Deck
                    </Button>
                    {isOwner && (
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                {deck.subject && (
                                    <Chip
                                        label={deck.subject}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ borderRadius: 1, mr: 1 }}
                                    />
                                )}
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
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {deck.description || 'No description provided.'}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    Flashcards ({cards.length})
                </Typography>
                {isOwner && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreating(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Add Card
                    </Button>
                )}
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
                        px: 3,
                        borderRadius: 2,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No cards in this deck yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                        {isOwner
                            ? 'Start adding flashcards to begin learning and memorizing this material.'
                            : 'This deck has no flashcards yet. Check back later.'}
                    </Typography>
                    {isOwner && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreating(true)}
                        >
                            Add Your First Card
                        </Button>
                    )}
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={card.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        },
                                        position: 'relative',
                                        borderRadius: 2,
                                    }}
                                >
                                    {isOwner && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 1,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleCardMenuOpen(e, card.id)}
                                                sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            zIndex: 1,
                                        }}
                                    >
                                        {card.is_starred ? (
                                            <StarIcon color="warning" />
                                        ) : (
                                            isOwner && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleToggleStarCard(card.id)}
                                                >
                                                    <StarBorderIcon fontSize="small" />
                                                </IconButton>
                                            )
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 3, pt: 5 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            gutterBottom
                                            color="text.secondary"
                                        >
                                            Front
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                minHeight: 80,
                                                mb: 2,
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {card.front_content}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            gutterBottom
                                            color="text.secondary"
                                        >
                                            Back
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                minHeight: 80,
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {card.back_content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Deck Options Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    setIsEditing(true);
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Deck
                </MenuItem>
            </Menu>

            {/* Card Options Menu */}
            <Menu
                anchorEl={cardMenuAnchorEl}
                open={Boolean(cardMenuAnchorEl)}
                onClose={handleCardMenuClose}
            >
                <MenuItem onClick={() => {
                    const card = cards.find(c => c.id === selectedCardId);
                    if (card) handleEditCard(card);
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteConfirm}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
                <MenuItem onClick={() => {
                    handleToggleStarCard(selectedCardId);
                    handleCardMenuClose();
                }}>
                    {cards.find(c => c.id === selectedCardId)?.is_starred ? (
                        <>
                            <StarBorderIcon fontSize="small" sx={{ mr: 1 }} />
                            Remove Star
                        </>
                    ) : (
                        <>
                            <StarIcon fontSize="small" sx={{ mr: 1 }} />
                            Star Card
                        </>
                    )}
                </MenuItem>
            </Menu>

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
                        disabled={!newCardData.front || !newCardData.back}
                    >
                        Add Card
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Card Dialog */}
            <Dialog
                open={editingCardId !== null}
                onClose={() => setEditingCardId(null)}
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
                    <Button onClick={() => setEditingCardId(null)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateCard}
                        variant="contained"
                        disabled={!editCardData.front || !editCardData.back}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Deck Dialog */}
            <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Deck</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={editDeckData.title}
                        onChange={(e) => setEditDeckData({ ...editDeckData, title: e.target.value })}
                        required
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={editDeckData.description}
                        onChange={(e) => setEditDeckData({ ...editDeckData, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Subject"
                        fullWidth
                        value={editDeckData.subject}
                        onChange={(e) => setEditDeckData({ ...editDeckData, subject: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editDeckData.isPublic}
                                onChange={(e) => setEditDeckData({ ...editDeckData, isPublic: e.target.checked })}
                            />
                        }
                        label="Make deck public"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateDeck}
                        variant="contained"
                        disabled={!editDeckData.title}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Card Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Delete Flashcard?</DialogTitle>
                <DialogContent>
                    <Typography>
                        This action cannot be undone. The flashcard will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteCard}
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