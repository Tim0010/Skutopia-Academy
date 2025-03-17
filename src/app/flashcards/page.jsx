'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Grid,
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
    FormControlLabel,
    Switch,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getFlashcardDecks, createFlashcardDeck } from '@/utils/supabaseClient';

export default function FlashcardsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [decks, setDecks] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newDeckData, setNewDeckData] = useState({
        title: '',
        description: '',
        subject: '',
        isPublic: false
    });

    useEffect(() => {
        if (user) {
            loadDecks();
        }
    }, [user]);

    const loadDecks = async () => {
        const { data, error } = await getFlashcardDecks(user.id);
        if (!error) {
            setDecks(data || []);
        }
    };

    const handleCreateDeck = async () => {
        const { data, error } = await createFlashcardDeck(
            user.id,
            newDeckData.title,
            newDeckData.description,
            newDeckData.subject,
            newDeckData.isPublic
        );

        if (!error) {
            setIsCreating(false);
            loadDecks();
            setNewDeckData({ title: '', description: '', subject: '', isPublic: false });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">My Flashcards</Typography>
                <Button
                    variant="contained"
                    startIcon={<SvgIcon name="tabler-plus" />}
                    onClick={() => setIsCreating(true)}
                >
                    Create New Deck
                </Button>
            </Box>

            <Grid container spacing={3}>
                {decks.map((deck) => (
                    <Grid item xs={12} sm={6} md={4} key={deck.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    cursor: 'pointer',
                                    '&:hover': { 
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => router.push(`/flashcards/${deck.id}`)}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{deck.title}</Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        {deck.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Chip 
                                            label={deck.subject}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        {deck.is_public && (
                                            <Chip 
                                                label="Public"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Create Deck Dialog */}
            <Dialog 
                open={isCreating} 
                onClose={() => setIsCreating(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Flashcard Deck</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={newDeckData.title}
                            onChange={(e) => setNewDeckData({ ...newDeckData, title: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newDeckData.description}
                            onChange={(e) => setNewDeckData({ ...newDeckData, description: e.target.value })}
                        />
                        <TextField
                            label="Subject"
                            fullWidth
                            value={newDeckData.subject}
                            onChange={(e) => setNewDeckData({ ...newDeckData, subject: e.target.value })}
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateDeck}
                        disabled={!newDeckData.title || !newDeckData.subject}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 