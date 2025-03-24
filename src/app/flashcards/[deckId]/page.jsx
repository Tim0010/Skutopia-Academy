'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Fab,
    Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getFlashcardDeckById, addFlashcard, updateFlashcardProgress } from '@/utils/supabaseClient';

export default function FlashcardDeckPage() {
    const router = useRouter();
    const { deckId } = useParams();
    const { user } = useAuth();
    const [deck, setDeck] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [newCardData, setNewCardData] = useState({
        frontContent: '',
        backContent: '',
    });

    useEffect(() => {
        if (user && deckId) {
            loadDeck();
        }
    }, [user, deckId]);

    const loadDeck = async () => {
        const { data, error } = await getFlashcardDeckById(deckId);
        if (!error && data) {
            setDeck(data.deck);
            setFlashcards(data.flashcards || []);
        }
    };

    const handleCreateCard = async () => {
        const { data, error } = await addFlashcard(
            deckId,
            newCardData.frontContent,
            newCardData.backContent,
            flashcards.length + 1
        );

        if (!error) {
            setIsCreating(false);
            loadDeck();
            setNewCardData({ frontContent: '', backContent: '' });
        }
    };

    const handleNextCard = async () => {
        if (currentCardIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev + 1);
        } else {
            setIsStudyMode(false);
            setCurrentCardIndex(0);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setIsFlipped(false);
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    const handleConfidenceLevel = async (level) => {
        await updateFlashcardProgress(user.id, flashcards[currentCardIndex].id, level);
        handleNextCard();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {!isStudyMode ? (
                <>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Button
                                startIcon={<SvgIcon name="tabler-arrow-left" />}
                                onClick={() => router.push('/flashcards')}
                                sx={{ mb: 2 }}
                            >
                                Back to Decks
                            </Button>
                            <Typography variant="h4">{deck?.title}</Typography>
                            <Typography variant="body1" color="text.secondary">
                                {deck?.description}
                            </Typography>
                            <Chip 
                                label={deck?.subject}
                                size="small"
                                color="primary"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={<SvgIcon name="tabler-plus" />}
                                onClick={() => setIsCreating(true)}
                            >
                                Add Card
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<SvgIcon name="tabler-player-play" />}
                                onClick={() => setIsStudyMode(true)}
                                disabled={flashcards.length === 0}
                            >
                                Study Mode
                            </Button>
                        </Stack>
                    </Box>

                    <Stack spacing={2}>
                        {flashcards.map((card, index) => (
                            <Paper
                                key={card.id}
                                sx={{
                                    p: 3,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                onClick={() => {
                                    setCurrentCardIndex(index);
                                    setIsStudyMode(true);
                                }}
                            >
                                <Typography variant="h6">{card.front_content}</Typography>
                            </Paper>
                        ))}
                    </Stack>
                </>
            ) : (
                <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
                        <IconButton onClick={() => setIsStudyMode(false)}>
                            <SvgIcon name="tabler-x" />
                        </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Card {currentCardIndex + 1} of {flashcards.length}
                    </Typography>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCardIndex + (isFlipped ? '-flipped' : '')}
                            initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
                            animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ 
                                width: '100%',
                                maxWidth: 600,
                                perspective: 1000
                            }}
                        >
                            <Card
                                sx={{
                                    height: 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    p: 4,
                                    textAlign: 'center'
                                }}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <Typography variant="h5">
                                    {isFlipped 
                                        ? flashcards[currentCardIndex]?.back_content
                                        : flashcards[currentCardIndex]?.front_content
                                    }
                                </Typography>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <IconButton 
                            onClick={handlePrevCard}
                            disabled={currentCardIndex === 0}
                        >
                            <SvgIcon name="tabler-chevron-left" />
                        </IconButton>

                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleConfidenceLevel(1)}
                            >
                                Hard
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => handleConfidenceLevel(2)}
                            >
                                Medium
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={() => handleConfidenceLevel(3)}
                            >
                                Easy
                            </Button>
                        </Stack>

                        <IconButton 
                            onClick={handleNextCard}
                            disabled={currentCardIndex === flashcards.length - 1}
                        >
                            <SvgIcon name="tabler-chevron-right" />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* Create Card Dialog */}
            <Dialog 
                open={isCreating} 
                onClose={() => setIsCreating(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Flashcard</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Front Content"
                            fullWidth
                            multiline
                            rows={3}
                            value={newCardData.frontContent}
                            onChange={(e) => setNewCardData({ ...newCardData, frontContent: e.target.value })}
                        />
                        <TextField
                            label="Back Content"
                            fullWidth
                            multiline
                            rows={3}
                            value={newCardData.backContent}
                            onChange={(e) => setNewCardData({ ...newCardData, backContent: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateCard}
                        disabled={!newCardData.frontContent || !newCardData.backContent}
                    >
                        Add Card
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 