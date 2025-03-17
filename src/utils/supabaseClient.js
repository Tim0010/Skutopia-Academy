import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Functions
export const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password, metadata) => {
    return await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
    });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

// Course Functions
export const getCourses = async () => {
    return await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
};

export const getCourseById = async (courseId) => {
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

    if (courseError) return { error: courseError };

    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number');

    return {
        data: {
            ...course,
            lessons: lessons || []
        },
        error: lessonsError
    };
};

// Lesson Functions
export const getLessonById = async (lessonId) => {
    const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*, courses(*)')
        .eq('id', lessonId)
        .single();

    if (lessonError) return { error: lessonError };

    const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*, quiz_questions(*)')
        .eq('lesson_id', lessonId)
        .single();

    return {
        data: {
            ...lesson,
            quiz: quiz || null
        },
        error: quizError
    };
};

export const updateLessonProgress = async (userId, lessonId, completed) => {
    const { data: existing } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

    if (existing) {
        return await supabase
            .from('user_course_progress')
            .update({ completed, last_accessed: new Date() })
            .eq('id', existing.id);
    }

    return await supabase
        .from('user_course_progress')
        .insert([
            {
                user_id: userId,
                lesson_id: lessonId,
                completed,
                last_accessed: new Date()
            }
        ]);
};

// Quiz Functions
export const getQuizById = async (quizId) => {
    return await supabase
        .from('quizzes')
        .select('*, quiz_questions(*)')
        .eq('id', quizId)
        .single();
};

export const submitQuizAttempt = async (userId, quizId, answers, score, timeTaken) => {
    return await supabase
        .from('quiz_attempts')
        .insert([
            {
                user_id: userId,
                quiz_id: quizId,
                answers,
                score,
                time_taken: timeTaken,
                completed_at: new Date()
            }
        ]);
};

// Flashcard Functions
export const getFlashcardDecks = async (userId) => {
    return await supabase
        .from('flashcard_decks')
        .select('*')
        .or(`created_by.eq.${userId},is_public.eq.true`)
        .order('created_at', { ascending: false });
};

export const getFlashcardDeckById = async (deckId) => {
    const { data: deck, error: deckError } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('id', deckId)
        .single();

    if (deckError) return { error: deckError };

    const { data: flashcards, error: cardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId)
        .order('order_number');

    return {
        data: {
            deck,
            flashcards: flashcards || []
        },
        error: cardsError
    };
};

export const createFlashcardDeck = async (userId, title, description, subject, isPublic) => {
    return await supabase
        .from('flashcard_decks')
        .insert([
            {
                title,
                description,
                subject,
                is_public: isPublic,
                created_by: userId
            }
        ]);
};

export const addFlashcard = async (deckId, frontContent, backContent, orderNumber) => {
    return await supabase
        .from('flashcards')
        .insert([
            {
                deck_id: deckId,
                front_content: frontContent,
                back_content: backContent,
                order_number: orderNumber
            }
        ]);
};

export const updateFlashcardProgress = async (userId, flashcardId, confidenceLevel) => {
    const nextReview = calculateNextReview(confidenceLevel);

    const { data: existing } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('flashcard_id', flashcardId)
        .single();

    if (existing) {
        return await supabase
            .from('user_flashcard_progress')
            .update({
                confidence_level: confidenceLevel,
                last_reviewed: new Date(),
                next_review: nextReview
            })
            .eq('id', existing.id);
    }

    return await supabase
        .from('user_flashcard_progress')
        .insert([
            {
                user_id: userId,
                flashcard_id: flashcardId,
                confidence_level: confidenceLevel,
                last_reviewed: new Date(),
                next_review: nextReview
            }
        ]);
};

// Mentorship Functions
export const getUserMentorshipSessions = async (userId) => {
    return await supabase
        .from('mentorship_sessions')
        .select(`
            *,
            mentors:mentor_id(id, user_metadata),
            students:student_id(id, user_metadata)
        `)
        .or(`mentor_id.eq.${userId},student_id.eq.${userId}`)
        .gte('session_date', new Date().toISOString())
        .order('session_date');
};

export const createMentorshipSession = async (mentorId, studentId, sessionDate, sessionTopic) => {
    return await supabase
        .from('mentorship_sessions')
        .insert([
            {
                mentor_id: mentorId,
                student_id: studentId,
                session_date: sessionDate,
                session_topic: sessionTopic
            }
        ]);
};

// Scholarship Functions
export const getActiveScholarships = async () => {
    return await supabase
        .from('scholarships')
        .select('*')
        .gt('deadline', new Date().toISOString())
        .order('deadline');
};

export const applyForScholarship = async (userId, scholarshipId, applicationData) => {
    return await supabase
        .from('scholarship_applications')
        .insert([
            {
                user_id: userId,
                scholarship_id: scholarshipId,
                application_data: applicationData,
                status: 'pending'
            }
        ]);
};

// Helper Functions
const calculateNextReview = (confidenceLevel) => {
    const now = new Date();
    switch (confidenceLevel) {
        case 1: // Hard
            now.setHours(now.getHours() + 1);
            break;
        case 2: // Medium
            now.setDate(now.getDate() + 1);
            break;
        case 3: // Easy
            now.setDate(now.getDate() + 3);
            break;
        default:
            now.setDate(now.getDate() + 1);
    }
    return now.toISOString();
}; 