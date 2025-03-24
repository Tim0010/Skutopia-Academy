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
    IconButton,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, getFlashcardDecks, createFlashcardDeck, createFlashcards } from '@/utils/supabaseClient';
import AIFlashcardGenerator from '@/components/AIFlashcardGenerator';
import sampleFlashcards from '@/data/sampleFlashcards';

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
            { name: 'Literature', description: 'Analysis of literary works and themes' },
            { name: 'Vocabulary', description: 'Word meanings and usage' },
            { name: 'Writing', description: 'Essay structure and composition techniques' },
            { name: 'Comprehension', description: 'Understanding and analyzing texts' }
        ]
    },
    Science: {
        icon: 'tabler-flask',
        color: 'success',
        image: '/assets/images/subjects/science.jpg',
        topics: [
            { name: 'Scientific Method', description: 'Process of scientific inquiry and experimentation' },
            { name: 'Earth Science', description: 'Study of the Earth and its systems' },
            { name: 'Ecology', description: 'Relationships between organisms and their environment' },
            { name: 'Astronomy', description: 'Study of celestial objects and phenomena' },
            { name: 'Physics Basics', description: 'Fundamental principles of matter and energy' }
        ]
    },
    Chemistry: {
        icon: 'tabler-atom',
        color: 'error',
        image: '/assets/images/subjects/chemistry.jpg',
        topics: [
            { name: 'Periodic Table', description: 'Elements and their properties' },
            { name: 'Chemical Reactions', description: 'Types and balancing of chemical equations' },
            { name: 'Atomic Structure', description: 'Components and models of atoms' },
            { name: 'Acids and Bases', description: 'Properties and reactions of acids and bases' },
            { name: 'Organic Chemistry', description: 'Study of carbon-based compounds' }
        ]
    },
    Biology: {
        icon: 'tabler-dna',
        color: 'info',
        image: '/assets/images/subjects/biology.jpg',
        topics: [
            { name: 'Cell Biology', description: 'Structure and function of cells' },
            { name: 'Genetics', description: 'Inheritance and variation of traits' },
            { name: 'Human Anatomy', description: 'Structure and systems of the human body' },
            { name: 'Evolution', description: 'Changes in species over time' },
            { name: 'Ecology', description: 'Interactions between organisms and environment' }
        ]
    },
    Physics: {
        icon: 'tabler-atom-2',
        color: 'warning',
        image: '/assets/images/subjects/physics.jpg',
        topics: [
            { name: 'Mechanics', description: 'Motion, forces, and energy' },
            { name: 'Electricity', description: 'Electric charges, currents, and circuits' },
            { name: 'Waves', description: 'Properties and behavior of waves' },
            { name: 'Thermodynamics', description: 'Heat, energy, and work' },
            { name: 'Modern Physics', description: 'Relativity and quantum mechanics' }
        ]
    }
};

export default function SubjectFlashcardsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedGrade, setSelectedGrade] = useState('8');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [decks, setDecks] = useState([]);
    const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

    // Available grades
    const grades = ['8', '9', '10', '11', '12'];

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Load user's existing decks to avoid duplicates
        const loadDecks = async () => {
            const { data, error } = await getFlashcardDecks(user?.id);
            if (!error) {
                setDecks(data || []);
                setLoading(false);
            }
        };

        loadDecks();
    }, [user, router]);

    // Filter flashcards based on selected criteria
    const filteredFlashcards = [];
    
    // Check if the selected subject and grade exist in the data
    if (sampleFlashcards[selectedSubject] && sampleFlashcards[selectedSubject][selectedGrade]) {
        // Get all topic sets for the selected subject and grade
        const topicSets = sampleFlashcards[selectedSubject][selectedGrade];
        
        // Process each topic set
        topicSets.forEach(topicSet => {
            // Check if a specific topic is selected
            if (!selectedTopic || topicSet.topic === selectedTopic) {
                // Process each card in the topic
                topicSet.cards.forEach(card => {
                    // Check if the card matches the search query
                    const matchesSearch = !searchQuery || 
                        card.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        topicSet.topic.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    if (matchesSearch) {
                        // Add the card to filtered results with topic information
                        filteredFlashcards.push({
                            question: card.front,
                            answer: card.back,
                            hint: card.hint || '',
                            topic: topicSet.topic,
                            subject: selectedSubject,
                            grade: selectedGrade
                        });
                    }
                });
            }
        });
    }

    // Group flashcards by topic
    const flashcardsByTopic = filteredFlashcards.reduce((acc, card) => {
        if (!acc[card.topic]) {
            acc[card.topic] = [];
        }
        acc[card.topic].push(card);
        return acc;
    }, {});

    // Add flashcards to user's collection
    const addFlashcards = async (flashcards, topic) => {
        if (!user) {
            setNotification({
                open: true,
                message: 'Please log in to add flashcards',
                severity: 'error'
            });
            return;
        }

        try {
            // Check if deck already exists
            const existingDeck = decks.find(deck => 
                deck.title === `${selectedSubject} - ${topic} (Grade ${selectedGrade})` && 
                deck.subject === selectedSubject
            );

            let deckId;
            
            if (existingDeck) {
                deckId = existingDeck.id;
                
                // Add flashcards to existing deck
                await createFlashcards(deckId, flashcards.map(card => ({
                    question: card.question,
                    answer: card.answer,
                    hint: card.hint || ''
                })));
                
                setNotification({
                    open: true,
                    message: `Added ${flashcards.length} flashcards to existing deck: ${existingDeck.title}`,
                    severity: 'success'
                });
            } else {
                // Create new deck
                const { data: newDeck, error } = await createFlashcardDeck({
                    user_id: user.id,
                    title: `${selectedSubject} - ${topic} (Grade ${selectedGrade})`,
                    description: `Flashcards for ${topic} in ${selectedSubject} for Grade ${selectedGrade}`,
                    subject: selectedSubject,
                    is_public: false
                });
                
                if (error) throw error;
                deckId = newDeck.id;
                
                // Add flashcards to new deck
                await createFlashcards(deckId, flashcards.map(card => ({
                    question: card.question,
                    answer: card.answer,
                    hint: card.hint || ''
                })));
                
                // Update local decks state
                setDecks([...decks, newDeck]);
                
                setNotification({
                    open: true,
                    message: `Created new deck with ${flashcards.length} flashcards: ${newDeck.title}`,
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error adding flashcards:', error);
            setNotification({
                open: true,
                message: 'Error adding flashcards: ' + error.message,
                severity: 'error'
            });
        }
    };

    // Add all flashcards for the current subject and grade
    const addAllFlashcards = async () => {
        try {
            // Group all filtered flashcards by topic and add each group
            for (const [topic, cards] of Object.entries(flashcardsByTopic)) {
                await addFlashcards(cards, topic);
            }
            
            setNotification({
                open: true,
                message: `Added all ${selectedSubject} flashcards for Grade ${selectedGrade}`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding all flashcards:', error);
            setNotification({
                open: true,
                message: 'Error adding all flashcards: ' + error.message,
                severity: 'error'
            });
        }
    };

    // Handle notification close
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <MuiLink 
                    component={Link} 
                    href="/dashboard"
                    underline="hover" 
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <SvgIcon name="tabler-home" size={16} sx={{ mr: 0.5 }} />
                    Dashboard
                </MuiLink>
                <MuiLink
                    component={Link}
                    href="/dashboard/flashcards"
                    underline="hover"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <SvgIcon name="tabler-cards" size={16} sx={{ mr: 0.5 }} />
                    Flashcards
                </MuiLink>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <SvgIcon name="tabler-book" size={16} sx={{ mr: 0.5 }} />
                    Subject Flashcards
                </Typography>
            </Breadcrumbs>
            
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Subject Flashcards
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse pre-made flashcards by subject and grade level
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', py: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Subject Tabs */}
                    <Box sx={{ mb: 4, overflowX: 'auto' }}>
                        <Tabs
                            value={selectedSubject}
                            onChange={(e, newValue) => {
                                setSelectedSubject(newValue);
                                setSelectedTopic('');
                            }}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ mb: 2 }}
                        >
                            {Object.keys(subjectsData).map((subject) => (
                                <Tab
                                    key={subject}
                                    value={subject}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SvgIcon name={subjectsData[subject].icon} size={20} color={subjectsData[subject].color} sx={{ mr: 1 }} />
                                            {subject}
                                        </Box>
                                    }
                                    sx={{ 
                                        minHeight: 48,
                                        textTransform: 'none',
                                        fontWeight: selectedSubject === subject ? 600 : 400
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Filters and Search */}
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="grade-select-label">Grade Level</InputLabel>
                                    <Select
                                        labelId="grade-select-label"
                                        value={selectedGrade}
                                        label="Grade Level"
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                    >
                                        {grades.map((grade) => (
                                            <MenuItem key={grade} value={grade}>
                                                Grade {grade}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search flashcards..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SvgIcon name="tabler-search" size={20} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                    <SvgIcon name="tabler-x" size={16} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={addAllFlashcards}
                                    startIcon={<SvgIcon name="tabler-plus" size={20} />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add All Flashcards
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Subject Content */}
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <SvgIcon name={subjectsData[selectedSubject].icon} size={24} color={subjectsData[selectedSubject].color} sx={{ mr: 1 }} />
                            <Typography variant="h5" fontWeight={600}>
                                {selectedSubject} - Grade {selectedGrade}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body1" paragraph>
                            Master key concepts in {selectedSubject} with our comprehensive flashcard sets. Each set is aligned with the Zambian curriculum for Grade {selectedGrade}.
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Key Topics:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {sampleFlashcards[selectedSubject] && sampleFlashcards[selectedSubject][selectedGrade] ? 
                                    sampleFlashcards[selectedSubject][selectedGrade].map((topicSet) => (
                                        <Chip
                                            key={topicSet.topic}
                                            label={topicSet.topic}
                                            onClick={() => setSelectedTopic(topicSet.topic === selectedTopic ? '' : topicSet.topic)}
                                            color={topicSet.topic === selectedTopic ? subjectsData[selectedSubject].color : 'default'}
                                            variant={topicSet.topic === selectedTopic ? 'filled' : 'outlined'}
                                            sx={{ borderRadius: 2 }}
                                        />
                                    ))
                                : 
                                    subjectsData[selectedSubject].topics.map((topic) => (
                                        <Chip
                                            key={topic.name}
                                            label={topic.name}
                                            onClick={() => setSelectedTopic(topic.name === selectedTopic ? '' : topic.name)}
                                            color={topic.name === selectedTopic ? subjectsData[selectedSubject].color : 'default'}
                                            variant={topic.name === selectedTopic ? 'filled' : 'outlined'}
                                            sx={{ borderRadius: 2 }}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<SvgIcon name="tabler-robot" size={20} />}
                                onClick={() => setAiGeneratorOpen(true)}
                                sx={{ borderRadius: 2 }}
                            >
                                Generate Custom Flashcards
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Topic Cards */}
                        <Grid container spacing={3}>
                            {Object.keys(flashcardsByTopic).length > 0 ? (
                                Object.entries(flashcardsByTopic).map(([topic, cards]) => (
                                    <Grid item xs={12} md={6} key={topic}>
                                        <Card 
                                            variant="outlined" 
                                            sx={{ 
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: 3,
                                                    transform: 'translateY(-4px)'
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${cards.length} cards`} 
                                                        size="small" 
                                                        color={subjectsData[selectedSubject].color}
                                                        sx={{ borderRadius: 2 }}
                                                    />
                                                </Box>
                                                
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {subjectsData[selectedSubject].topics.find(t => t.name === topic)?.description || 
                                                    `Flashcards covering key concepts in ${topic}`}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => {
                                                            // Preview logic would go here
                                                            setNotification({
                                                                open: true,
                                                                message: `Preview for ${topic} flashcards`,
                                                                severity: 'info'
                                                            });
                                                        }}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        Preview
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color={subjectsData[selectedSubject].color}
                                                        size="small"
                                                        onClick={() => addFlashcards(cards, topic)}
                                                        startIcon={<SvgIcon name="tabler-plus" size={16} />}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        Add to My Flashcards
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        p: 4, 
                                        textAlign: 'center',
                                        border: '1px dashed',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}>
                                        <SvgIcon name="tabler-search-off" size={48} color="text.secondary" />
                                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                            No flashcards found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Try changing your search criteria or selecting a different subject or grade
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>

                    {/* AI Flashcard Generator Dialog */}
                    {aiGeneratorOpen && (
                        <AIFlashcardGenerator
                            open={aiGeneratorOpen}
                            onClose={() => setAiGeneratorOpen(false)}
                            defaultSubject={selectedSubject}
                            defaultGrade={selectedGrade}
                            onFlashcardsGenerated={(flashcards) => {
                                setNotification({
                                    open: true,
                                    message: `${flashcards.length} flashcards generated successfully!`,
                                    severity: 'success'
                                });
                            }}
                        />
                    )}

                    {/* Notification */}
                    <Snackbar
                        open={notification.open}
                        autoHideDuration={6000}
                        onClose={handleCloseNotification}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert 
                            onClose={handleCloseNotification} 
                            severity={notification.severity}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {notification.message}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </Container>
    );
}
