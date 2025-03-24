'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Paper,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Flip as FlipIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Star as StarIcon,
    StarOutline as StarOutlineIcon,
    Replay as ReplayIcon,
    Settings as SettingsIcon,
    Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function StudyDeckPage({ params }) {
    const { deckId } = params;
    const { user } = useAuth();
    const router = useRouter();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [studySession, setStudySession] = useState({
        correct: 0,
        incorrect: 0,
        reviewed: [],
        startTime: null,
        remainingCards: [],
    });
    const [isFinished, setIsFinished] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [studySettings, setStudySettings] = useState({
        shuffleCards: true,
        includeStarred: true,
        showStarredFirst: false,
    });
    const cardRef = useRef(null);

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

            // Fetch flashcards
            const { data: cardData, error: cardError } = await supabase
                .from('flashcards')
                .select('*')
                .eq('deck_id', deckId)
                .order('created_at');

            if (cardError) throw cardError;

            setDeck(deckData);

            // Initialize the study session
            const initialCards = [...cardData];
            if (studySettings.shuffleCards) {
                shuffleArray(initialCards);
            }

            if (initialCards.length > 0) {
                setCards(initialCards);
                setStudySession({
                    correct: 0,
                    incorrect: 0,
                    reviewed: [],
                    startTime: new Date(),
                    remainingCards: [...initialCards.map(card => card.id)],
                });
            } else {
                setError('This deck has no flashcards yet.');
            }
        } catch (error) {
            console.error('Error fetching deck and cards:', error);
            setError('Failed to load flashcards. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setFlipped(false);
            setCurrentIndex(currentIndex + 1);
        } else {
            finishSession();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setFlipped(false);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleMarkCard = async (correct) => {
        try {
            const currentCard = cards[currentIndex];

            // Update study session state
            setStudySession(prev => ({
                ...prev,
                correct: correct ? prev.correct + 1 : prev.correct,
                incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
                reviewed: [...prev.reviewed, currentCard.id],
                remainingCards: prev.remainingCards.filter(id => id !== currentCard.id)
            }));

            // Record study result in database
            await supabase
                .from('flashcard_study_results')
                .insert([
                    {
                        user_id: user.id,
                        card_id: currentCard.id,
                        deck_id: deckId,
                        result: correct ? 'correct' : 'incorrect',
                        study_date: new Date().toISOString(),
                    },
                ]);

            // Move to next card or finish
            handleNext();
        } catch (error) {
            console.error('Error recording study result:', error);
        }
    };

    const handleToggleStar = async () => {
        try {
            const currentCard = cards[currentIndex];
            const updatedCards = [...cards];
            updatedCards[currentIndex] = {
                ...currentCard,
                is_starred: !currentCard.is_starred
            };

            // Update UI state immediately
            setCards(updatedCards);

            // Update in database
            await supabase
                .from('flashcards')
                .update({ is_starred: !currentCard.is_starred })
                .eq('id', currentCard.id);
        } catch (error) {
            console.error('Error toggling star status:', error);
        }
    };

    const finishSession = () => {
        setIsFinished(true);
    };

    const handleRestartSession = () => {
        // Shuffle cards if enabled
        let newCards = [...cards];
        if (studySettings.shuffleCards) {
            newCards = shuffleArray([...cards]);
        }

        setCards(newCards);
        setCurrentIndex(0);
        setFlipped(false);
        setIsFinished(false);
        setStudySession({
            correct: 0,
            incorrect: 0,
            reviewed: [],
            startTime: new Date(),
            remainingCards: [...newCards.map(card => card.id)],
        });
    };

    const handleApplySettings = () => {
        setSettingsOpen(false);
        handleRestartSession();
    };

    const calculateAccuracy = () => {
        const total = studySession.correct + studySession.incorrect;
        if (total === 0) return 0;
        return Math.round((studySession.correct / total) * 100);
    };

    const calculateStudyTime = () => {
        if (!studySession.startTime) return '0:00';
        const now = new Date();
        const diffMs = now - studySession.startTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffMins}:${diffSecs < 10 ? '0' + diffSecs : diffSecs}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/dashboard/flashcards')}
                    sx={{ mb: 2 }}
                >
                    Back to Flashcards
                </Button>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <Box sx={{ py: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/dashboard/flashcards')}
                >
                    Back to Flashcards
                </Button>

                <Typography variant="h5" fontWeight="medium">
                    {deck?.title}
                </Typography>

                <IconButton onClick={() => setSettingsOpen(true)}>
                    <SettingsIcon />
                </IconButton>
            </Box>

            {!isFinished ? (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Card {currentIndex + 1} of {cards.length}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    icon={<CheckIcon fontSize="small" />}
                                    label={`Correct: ${studySession.correct}`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<CloseIcon fontSize="small" />}
                                    label={`Incorrect: ${studySession.incorrect}`}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
                    </Box>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                ref={cardRef}
                                onClick={handleFlip}
                                sx={{
                                    minHeight: 300,
                                    maxWidth: 700,
                                    mx: 'auto',
                                    cursor: 'pointer',
                                    perspective: '1000px',
                                    position: 'relative',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.6s',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 4,
                                            height: 300,
                                            backfaceVisibility: 'hidden',
                                            position: flipped ? 'absolute' : 'relative',
                                            width: '100%',
                                            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                            bgcolor: flipped ? 'grey.100' : 'white',
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
                                            {flipped ? currentCard.answer : currentCard.question}
                                        </Typography>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 2,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStar();
                                                }}
                                            >
                                                {currentCard.is_starred ? (
                                                    <StarIcon color="warning" />
                                                ) : (
                                                    <StarOutlineIcon />
                                                )}
                                            </IconButton>
                                        </Box>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                left: 0,
                                                right: 0,
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Chip
                                                icon={<FlipIcon fontSize="small" />}
                                                label="Tap to flip"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            startIcon={<ChevronLeftIcon />}
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<CloseIcon />}
                                onClick={() => handleMarkCard(false)}
                                sx={{ minWidth: 120 }}
                            >
                                Incorrect
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => handleMarkCard(true)}
                                sx={{ minWidth: 120 }}
                            >
                                Correct
                            </Button>
                        </Box>

                        <Button
                            endIcon={<ChevronRightIcon />}
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                        >
                            Next
                        </Button>
                    </Box>
                </>
            ) : (
                <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                        Study Session Complete!
                    </Typography>

                    <Box sx={{ mt: 4, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Your Results
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Total Cards:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {studySession.correct + studySession.incorrect}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Correct:</Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                    {studySession.correct}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Incorrect:</Typography>
                                <Typography variant="body1" fontWeight="bold" color="error.main">
                                    {studySession.incorrect}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Accuracy:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {calculateAccuracy()}%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Study Time:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {calculateStudyTime()}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push('/dashboard/flashcards')}
                        >
                            Back to Decks
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ReplayIcon />}
                            onClick={handleRestartSession}
                        >
                            Study Again
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Settings Dialog */}
            <Dialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Study Settings</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Shuffle Cards</Typography>
                            <Button
                                variant={studySettings.shuffleCards ? "contained" : "outlined"}
                                startIcon={<ShuffleIcon />}
                                onClick={() => setStudySettings({
                                    ...studySettings,
                                    shuffleCards: !studySettings.shuffleCards
                                })}
                                size="small"
                            >
                                {studySettings.shuffleCards ? "On" : "Off"}
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Include Starred Cards</Typography>
                            <Button
                                variant={studySettings.includeStarred ? "contained" : "outlined"}
                                startIcon={<StarIcon />}
                                onClick={() => setStudySettings({
                                    ...studySettings,
                                    includeStarred: !studySettings.includeStarred
                                })}
                                color="warning"
                                size="small"
                            >
                                {studySettings.includeStarred ? "On" : "Off"}
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Show Starred Cards First</Typography>
                            <Button
                                variant={studySettings.showStarredFirst ? "contained" : "outlined"}
                                startIcon={<StarOutlineIcon />}
                                onClick={() => setStudySettings({
                                    ...studySettings,
                                    showStarredFirst: !studySettings.showStarredFirst
                                })}
                                color="warning"
                                size="small"
                                disabled={!studySettings.includeStarred}
                            >
                                {studySettings.showStarredFirst ? "On" : "Off"}
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleApplySettings}>Apply Settings</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 