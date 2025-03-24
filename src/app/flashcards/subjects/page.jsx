'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Tabs,
    Tab,
    Chip,
    Stack,
    Divider,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import AIFlashcardGenerator from '@/components/AIFlashcardGenerator';
import { getFlashcardDecks, createFlashcardDeck, createFlashcards } from '@/utils/supabaseClient';
import { sampleFlashcards } from '@/data/sampleFlashcards';

// Subject data with icons and sample topics
const subjectsData = {
    Mathematics: {
        icon: 'tabler-math',
        color: 'primary',
        image: '/assets/images/subjects/mathematics.jpg',
        topics: [
            { name: 'Algebra', description: 'Equations, expressions, and functions' },
            { name: 'Geometry', description: 'Shapes, angles, and spatial relationships' },
            { name: 'Calculus', description: 'Rates of change and accumulation' },
            { name: 'Trigonometry', description: 'Relationships between angles and sides of triangles' },
            { name: 'Statistics', description: 'Data collection, analysis, and interpretation' }
        ]
    },
    English: {
        icon: 'tabler-book',
        color: 'secondary',
        image: '/assets/images/subjects/english.jpg',
        topics: [
            { name: 'Grammar', description: 'Rules for language structure and usage' },
            { name: 'Literature', description: 'Analysis of texts and literary devices' },
            { name: 'Vocabulary', description: 'Word meanings and usage' },
            { name: 'Writing', description: 'Essay structure and composition' },
            { name: 'Comprehension', description: 'Understanding and interpreting texts' }
        ]
    },
    Science: {
        icon: 'tabler-flask',
        color: 'info',
        image: '/assets/images/subjects/science.jpg',
        topics: [
            { name: 'Scientific Method', description: 'Process of investigation and experimentation' },
            { name: 'Earth Science', description: 'Study of the Earth and its systems' },
            { name: 'Ecology', description: 'Relationships between organisms and environment' },
            { name: 'Energy', description: 'Forms, transformations, and conservation' },
            { name: 'Scientific Inquiry', description: 'Asking questions and finding answers through investigation' }
        ]
    },
    Chemistry: {
        icon: 'tabler-atom',
        color: 'success',
        image: '/assets/images/subjects/chemistry.jpg',
        topics: [
            { name: 'Periodic Table', description: 'Elements and their properties' },
            { name: 'Chemical Reactions', description: 'How substances combine and change' },
            { name: 'Acids and Bases', description: 'Properties and reactions of acids and bases' },
            { name: 'Organic Chemistry', description: 'Carbon-based compounds and their reactions' },
            { name: 'States of Matter', description: 'Solids, liquids, gases, and phase changes' }
        ]
    },
    Biology: {
        icon: 'tabler-dna',
        color: 'warning',
        image: '/assets/images/subjects/biology.jpg',
        topics: [
            { name: 'Cell Biology', description: 'Structure and function of cells' },
            { name: 'Genetics', description: 'Inheritance and variation of traits' },
            { name: 'Human Body Systems', description: 'Structure and function of body systems' },
            { name: 'Ecology', description: 'Interactions between organisms and environment' },
            { name: 'Evolution', description: 'Changes in species over time' }
        ]
    },
    Physics: {
        icon: 'tabler-atom-2',
        color: 'error',
        image: '/assets/images/subjects/physics.jpg',
        topics: [
            { name: 'Mechanics', description: 'Motion, forces, and energy' },
            { name: 'Electricity', description: 'Electric charges, currents, and circuits' },
            { name: 'Waves', description: 'Properties and behaviors of waves' },
            { name: 'Thermodynamics', description: 'Heat, energy, and work' },
            { name: 'Modern Physics', description: 'Relativity and quantum mechanics' }
        ]
    }
};

// Grade levels
const gradeLevels = [
    { value: 8, label: 'Grade 8' },
    { value: 9, label: 'Grade 9' },
    { value: 10, label: 'Grade 10' },
    { value: 11, label: 'Grade 11' },
    { value: 12, label: 'Grade 12' }
];

export default function SubjectFlashcardsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [decks, setDecks] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedGrade, setSelectedGrade] = useState(8);
    const [filteredDecks, setFilteredDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All Topics');

    useEffect(() => {
        if (user) {
            loadDecks();
        }
    }, [user]);

    useEffect(() => {
        // Filter decks based on selected subject and grade
        if (decks.length > 0) {
            const filtered = decks.filter(deck => {
                const deckSubject = deck.subject?.toLowerCase() || '';
                const deckGrade = deck.grade_level || 0;
                
                return (
                    deckSubject.includes(selectedSubject.toLowerCase()) && 
                    (deckGrade === selectedGrade || deckGrade === 0)
                );
            });
            setFilteredDecks(filtered);
        }
    }, [selectedSubject, selectedGrade, decks]);

    const loadDecks = async () => {
        const { data, error } = await getFlashcardDecks(user?.id);
        if (!error) {
            setDecks(data || []);
            setLoading(false);
        }
    };

    const handleSubjectChange = (event, newValue) => {
        setSelectedSubject(newValue);
    };

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const handleAIFlashcardsGenerated = async (flashcards) => {
        try {
            // First create a new deck to hold the flashcards
            const { data: deckData, error: deckError } = await createFlashcardDeck(
                user.id,
                `${selectedSubject} - ${flashcards[0]?.topic || 'Study Cards'} (Grade ${selectedGrade})`,
                `AI-generated flashcards on ${flashcards[0]?.topic || 'various topics'} for Grade ${selectedGrade}`,
                selectedSubject,
                false // Not public by default
            );
            
            if (deckError) {
                console.error('Error creating deck for AI flashcards:', deckError);
                return;
            }
            
            // Format flashcards for database
            const formattedFlashcards = flashcards.map(card => ({
                deck_id: deckData.id,
                front_content: JSON.stringify({
                    text: card.front || card.question || '',
                    visual_hint: card.visual_suggestion || ''
                }),
                back_content: JSON.stringify({
                    text: card.back || card.answer || '',
                    explanation: card.explanation || ''
                }),
                difficulty_level: card.difficulty_level || 1
            }));
            
            // Add flashcards to the deck
            const { error: cardsError } = await createFlashcards(formattedFlashcards);
            
            if (cardsError) {
                console.error('Error adding AI flashcards to deck:', cardsError);
                return;
            }
            
            // Reload decks to show the new one
            loadDecks();
            
        } catch (error) {
            console.error('Error handling AI-generated flashcards:', error);
        }
    };

    const navigateToDeck = (deckId) => {
        router.push(`/flashcards/${deckId}`);
    };

    const handleNotificationClose = () => {
        setNotification({ ...notification, open: false });
    };

    // Filter sample flashcards based on search term and selected topic
    const getFilteredSampleFlashcards = () => {
        if (!sampleFlashcards[selectedSubject] || !sampleFlashcards[selectedSubject][selectedGrade]) {
            return [];
        }

        let filtered = [...sampleFlashcards[selectedSubject][selectedGrade]];
        
        // Filter by topic if not "All Topics"
        if (selectedTopic !== 'All Topics') {
            filtered = filtered.filter(topicSet => topicSet.topic === selectedTopic);
        }
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.map(topicSet => {
                // Create a new object with filtered cards
                return {
                    ...topicSet,
                    cards: topicSet.cards.filter(card => 
                        card.front.toLowerCase().includes(term) || 
                        card.back.toLowerCase().includes(term)
                    )
                };
            }).filter(topicSet => topicSet.cards.length > 0); // Only keep topics with matching cards
        }
        
        return filtered;
    };

    // Get all available topics for the selected subject and grade
    const getAvailableTopics = () => {
        if (!sampleFlashcards[selectedSubject] || !sampleFlashcards[selectedSubject][selectedGrade]) {
            return [];
        }
        
        return ['All Topics', ...sampleFlashcards[selectedSubject][selectedGrade].map(topicSet => topicSet.topic)];
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Subject Flashcards
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Browse pre-made flashcards by subject and grade level
                </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Tabs
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    minWidth: 'auto',
                                    px: 2
                                }
                            }}
                        >
                            {Object.keys(subjectsData).map((subject) => (
                                <Tab 
                                    key={subject} 
                                    value={subject} 
                                    label={subject} 
                                    icon={<SvgIcon name={subjectsData[subject].icon} />}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="grade-select-label">Grade Level</InputLabel>
                            <Select
                                labelId="grade-select-label"
                                value={selectedGrade}
                                label="Grade Level"
                                onChange={handleGradeChange}
                            >
                                {gradeLevels.map((grade) => (
                                    <MenuItem key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Subject Information */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: `${subjectsData[selectedSubject].color}.lighter`,
                    border: 1,
                    borderColor: `${subjectsData[selectedSubject].color}.light`
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>
                            {selectedSubject} - Grade {selectedGrade}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Master key concepts in {selectedSubject} with our comprehensive flashcard sets.
                            Each set is aligned with the Zambian curriculum for Grade {selectedGrade}.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Key Topics:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {subjectsData[selectedSubject].topics.map((topic) => (
                                    <Chip
                                        key={topic.name}
                                        label={topic.name}
                                        color={subjectsData[selectedSubject].color}
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                        <AIFlashcardGenerator 
                            onFlashcardsGenerated={handleAIFlashcardsGenerated}
                            subjects={[selectedSubject]}
                            gradeLevels={[{ value: selectedGrade, label: `Grade ${selectedGrade}` }]}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={subjectsData[selectedSubject].image}
                            alt={selectedSubject}
                            sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 2,
                                boxShadow: 3
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Flashcard Decks */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Available Flashcard Decks
                </Typography>

                {/* Search field */}
                <TextField
                    fullWidth
                    placeholder="Search flashcards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon name="tabler-search" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredDecks.length > 0 ? (
                    filteredDecks.map((deck) => (
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
                                    onClick={() => navigateToDeck(deck.id)}
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
                                                color={subjectsData[selectedSubject].color}
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
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper 
                            sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                backgroundColor: 'background.paper',
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <SvgIcon 
                                name="tabler-cards" 
                                size={48} 
                                color="text.secondary" 
                                sx={{ mb: 2 }} 
                            />
                            <Typography variant="h6" gutterBottom>
                                No flashcard decks available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                There are no flashcard decks for {selectedSubject} (Grade {selectedGrade}) yet.
                            </Typography>
                            <AIFlashcardGenerator 
                                onFlashcardsGenerated={handleAIFlashcardsGenerated}
                                subjects={[selectedSubject]}
                                gradeLevels={[{ value: selectedGrade, label: `Grade ${selectedGrade}` }]}
                            />
                            {sampleFlashcards[selectedSubject] && sampleFlashcards[selectedSubject][selectedGrade] && (
                                <Box sx={{ mt: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">
                                            Sample Flashcards
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color={subjectsData[selectedSubject].color}
                                            startIcon={<SvgIcon name="tabler-download" />}
                                            onClick={() => {
                                                // Create all sample flashcard decks for this subject and grade
                                                if (user) {
                                                    sampleFlashcards[selectedSubject][selectedGrade].forEach((topicSet) => {
                                                        (async () => {
                                                            try {
                                                                // First create a new deck
                                                                const { data: deckData, error: deckError } = await createFlashcardDeck(
                                                                    user.id,
                                                                    `${selectedSubject} - ${topicSet.topic} (Grade ${selectedGrade})`,
                                                                    `Flashcards for ${topicSet.topic} in ${selectedSubject} for Grade ${selectedGrade}`,
                                                                    selectedSubject,
                                                                    false // Not public by default
                                                                );
                                                                
                                                                if (deckError) {
                                                                    console.error('Error creating deck:', deckError);
                                                                    return;
                                                                }
                                                                
                                                                // Format flashcards for database
                                                                const formattedFlashcards = topicSet.cards.map(card => ({
                                                                    deck_id: deckData.id,
                                                                    front_content: JSON.stringify({
                                                                        text: card.front || '',
                                                                        visual_hint: ''
                                                                    }),
                                                                    back_content: JSON.stringify({
                                                                        text: card.back || '',
                                                                        explanation: ''
                                                                    }),
                                                                    difficulty_level: 1
                                                                }));
                                                                
                                                                // Add flashcards to the deck
                                                                const { error: cardsError } = await createFlashcards(formattedFlashcards);
                                                                
                                                                if (cardsError) {
                                                                    console.error('Error adding flashcards to deck:', cardsError);
                                                                    return;
                                                                }
                                                                
                                                                // Reload decks to show the new one
                                                                loadDecks();
                                                                
                                                                // Show success notification
                                                                setNotification({
                                                                    open: true,
                                                                    message: `Added ${topicSet.topic} flashcards to your collection!`,
                                                                    severity: 'success'
                                                                });
                                                                
                                                            } catch (error) {
                                                                console.error('Error creating flashcard deck:', error);
                                                            }
                                                        })();
                                                    });
                                                }
                                            }}
                                        >
                                            Add All Sample Flashcards
                                        </Button>
                                    </Box>
                                    
                                    {/* Search and filter controls */}
                                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                                        <TextField
                                            label="Search Flashcards"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SvgIcon name="tabler-search" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: searchTerm && (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                                            <SvgIcon name="tabler-x" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                                            <InputLabel>Filter by Topic</InputLabel>
                                            <Select
                                                value={selectedTopic}
                                                onChange={(e) => setSelectedTopic(e.target.value)}
                                                label="Filter by Topic"
                                            >
                                                {getAvailableTopics().map((topic) => (
                                                    <MenuItem key={topic} value={topic}>
                                                        {topic}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        {getFilteredSampleFlashcards().map((topicSet, index) => (
                                            <Grid item xs={12} key={index}>
                                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                                    {topicSet.topic}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {topicSet.cards.length} flashcards
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color={subjectsData[selectedSubject].color}
                                                        startIcon={<SvgIcon name="tabler-plus" />}
                                                        onClick={() => {
                                                            // Create a new deck from the sample flashcards
                                                            if (user) {
                                                                (async () => {
                                                                    try {
                                                                        // First create a new deck
                                                                        const { data: deckData, error: deckError } = await createFlashcardDeck(
                                                                            user.id,
                                                                            `${selectedSubject} - ${topicSet.topic} (Grade ${selectedGrade})`,
                                                                            `Flashcards for ${topicSet.topic} in ${selectedSubject} for Grade ${selectedGrade}`,
                                                                            selectedSubject,
                                                                            false // Not public by default
                                                                        );
                                                                        
                                                                        if (deckError) {
                                                                            console.error('Error creating deck:', deckError);
                                                                            return;
                                                                        }
                                                                        
                                                                        // Format flashcards for database
                                                                        const formattedFlashcards = topicSet.cards.map(card => ({
                                                                            deck_id: deckData.id,
                                                                            front_content: JSON.stringify({
                                                                                text: card.front || '',
                                                                                visual_hint: ''
                                                                            }),
                                                                            back_content: JSON.stringify({
                                                                                text: card.back || '',
                                                                                explanation: ''
                                                                            }),
                                                                            difficulty_level: 1
                                                                        }));
                                                                        
                                                                        // Add flashcards to the deck
                                                                        const { error: cardsError } = await createFlashcards(formattedFlashcards);
                                                                        
                                                                        if (cardsError) {
                                                                            console.error('Error adding flashcards to deck:', cardsError);
                                                                            return;
                                                                        }
                                                                        
                                                                        // Reload decks to show the new one
                                                                        loadDecks();
                                                                        
                                                                        // Show success notification
                                                                        setNotification({
                                                                            open: true,
                                                                            message: `Added ${topicSet.topic} flashcards to your collection!`,
                                                                            severity: 'success'
                                                                        });
                                                                        
                                                                    } catch (error) {
                                                                        console.error('Error creating flashcard deck:', error);
                                                                    }
                                                                })();
                                                            }
                                                        }}
                                                    >
                                                        Add to My Flashcards
                                                    </Button>
                                                </Box>
                                                <Grid container spacing={2}>
                                                    {topicSet.cards.map((card, cardIndex) => (
                                                        <Grid item xs={12} sm={6} md={4} key={cardIndex}>
                                                            <Card sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                        {card.front}
                                                                    </Typography>
                                                                    <Divider sx={{ my: 1 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {card.back}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Topic-specific flashcard sets */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    {selectedSubject} Topics
                </Typography>
                <Grid container spacing={3}>
                    {subjectsData[selectedSubject].topics.map((topic) => (
                        <Grid item xs={12} sm={6} md={4} key={topic.name}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {topic.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {topic.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color={subjectsData[selectedSubject].color}
                                        startIcon={<SvgIcon name="tabler-brain" />}
                                        onClick={() => {
                                            // Pre-fill the AI generator with this topic
                                            const flashcards = [
                                                {
                                                    topic: topic.name,
                                                    subject: selectedSubject,
                                                    grade_level: selectedGrade
                                                }
                                            ];
                                            handleAIFlashcardsGenerated(flashcards);
                                        }}
                                    >
                                        Generate Flashcards
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
