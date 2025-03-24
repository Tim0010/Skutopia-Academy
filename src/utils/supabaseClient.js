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
        .insert({
            user_id: userId,
            quiz_id: quizId,
            answers,
            score,
            time_taken: timeTaken
        });
};

/**
 * Create a new quiz
 * @param {string} lessonId - The lesson ID this quiz belongs to
 * @param {string} title - Quiz title
 * @param {string} description - Quiz description
 * @param {number} timeLimit - Time limit in seconds
 * @param {number} passingScore - Passing score percentage
 * @returns {Promise} - Supabase response
 */
export const createQuiz = async (lessonId, title, description, timeLimit, passingScore) => {
    return await supabase
        .from('quizzes')
        .insert({
            lesson_id: lessonId,
            title,
            description,
            time_limit: timeLimit,
            passing_score: passingScore
        })
        .select()
        .single();
};

/**
 * Create multiple quiz questions
 * @param {string} quizId - The quiz ID
 * @param {Array} questions - Array of question objects
 * @returns {Promise} - Supabase response
 */
export const createQuizQuestions = async (quizId, questions) => {
    if (!Array.isArray(questions) || questions.length === 0) {
        return { error: 'Invalid questions data' };
    }
    
    // Format questions for database
    const formattedQuestions = questions.map((question, index) => ({
        quiz_id: quizId,
        question: question.question,
        question_type: question.type || 'multiple_choice',
        options: JSON.stringify(question.options || []),
        correct_answer: JSON.stringify(question.correct_answer || question.answer),
        explanation: question.explanation || '',
        points: question.points || 1,
        order_number: index
    }));
    
    return await supabase
        .from('quiz_questions')
        .insert(formattedQuestions);
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
        .insert({
            deck_id: deckId,
            front_content: frontContent,
            back_content: backContent,
            order_number: orderNumber || 0
        });
};

/**
 * Create multiple flashcards at once
 * @param {Array} flashcards - Array of flashcard objects
 * @returns {Promise} - Supabase response
 */
export const createFlashcards = async (flashcards) => {
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
        return { error: 'Invalid flashcards data' };
    }
    
    return await supabase
        .from('flashcards')
        .insert(flashcards);
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
    try {
        // First try to fetch with the nested select
        const { data, error } = await supabase
            .from('mentorship_sessions')
            .select(`
                *,
                mentors:mentor_id(id, user_metadata),
                students:student_id(id, user_metadata)
            `)
            .or(`mentor_id.eq.${userId},student_id.eq.${userId}`)
            .gte('session_date', new Date().toISOString())
            .order('session_date');
        
        // If this works, return the data
        if (!error) {
            return { data, error: null };
        }
        
        console.warn('Nested select for mentorship sessions failed, using fallback approach:', error);
        
        // Fallback approach if the nested select fails
        const { data: sessionData, error: sessionError } = await supabase
            .from('mentorship_sessions')
            .select('*')
            .or(`mentor_id.eq.${userId},student_id.eq.${userId}`)
            .gte('session_date', new Date().toISOString())
            .order('session_date');
        
        if (sessionError) {
            return { data: null, error: sessionError };
        }
        
        // If we have sessions, get the related mentor and student data
        if (sessionData && sessionData.length > 0) {
            // Extract all mentor and student IDs
            const mentorIds = sessionData.map(s => s.mentor_id).filter(id => id);
            const studentIds = sessionData.map(s => s.student_id).filter(id => id);
            
            // Get mentor data
            const mentorPromise = mentorIds.length > 0 ? supabase
                .from('mentors')
                .select('id, user_id')
                .in('id', mentorIds) : Promise.resolve({ data: [] });
            
            // Get student data (from auth.users)
            const studentPromise = studentIds.length > 0 ? supabase.auth
                .admin.listUsers({ filter: studentIds.map(id => `id eq "${id}"`).join(' or ') })
                .catch(() => ({ data: { users: [] } })) : Promise.resolve({ data: { users: [] } });
            
            // Wait for both queries
            const [mentorResult, studentResult] = await Promise.all([mentorPromise, studentPromise]);
            
            // Get user data for mentors
            const mentorUserIds = mentorResult.data?.map(m => m.user_id).filter(id => id) || [];
            const mentorUserPromise = mentorUserIds.length > 0 ? supabase.auth
                .admin.listUsers({ filter: mentorUserIds.map(id => `id eq "${id}"`).join(' or ') })
                .catch(() => ({ data: { users: [] } })) : Promise.resolve({ data: { users: [] } });
            
            const mentorUserResult = await mentorUserPromise;
            
            // Create lookup maps
            const mentorMap = mentorResult.data?.reduce((map, mentor) => {
                map[mentor.id] = mentor;
                return map;
            }, {}) || {};
            
            const mentorUserMap = mentorUserResult.data?.users?.reduce((map, user) => {
                map[user.id] = user;
                return map;
            }, {}) || {};
            
            const studentMap = studentResult.data?.users?.reduce((map, user) => {
                map[user.id] = user;
                return map;
            }, {}) || {};
            
            // Combine the data
            const enrichedSessions = sessionData.map(session => {
                const mentor = mentorMap[session.mentor_id];
                const mentorUser = mentor ? mentorUserMap[mentor.user_id] : null;
                const student = studentMap[session.student_id];
                
                return {
                    ...session,
                    mentors: mentor ? {
                        id: mentor.id,
                        user_metadata: mentorUser?.user_metadata || {}
                    } : null,
                    students: student ? {
                        id: student.id,
                        user_metadata: student.user_metadata || {}
                    } : null
                };
            });
            
            return { data: enrichedSessions, error: null };
        }
        
        return { data: sessionData || [], error: null };
        
    } catch (error) {
        console.error('Error in getUserMentorshipSessions:', error);
        return { data: null, error };
    }
};

export const createMentorshipSession = async (mentorId, studentId, sessionDate, duration, notes) => {
    return await supabase
        .from('mentorship_sessions')
        .insert([
            {
                mentor_id: mentorId,
                student_id: studentId,
                session_date: sessionDate,
                duration: duration || 30, // Default 30 minutes
                status: 'scheduled',
                notes: notes || ''
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

// Exam Papers Functions
export const uploadExamPaper = async (file, metadata) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${metadata.subject}_Grade${metadata.grade}_${metadata.year}_${metadata.term}.${fileExt}`;
    const filePath = `exam-papers/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('exam-papers')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('exam-papers')
      .getPublicUrl(filePath);

    // Insert record in database
    const { data, error } = await supabase
      .from('exam_papers')
      .insert({
        title: metadata.title,
        subject: metadata.subject,
        grade: metadata.grade,
        year: metadata.year,
        term: metadata.term,
        file_path: filePath,
        file_url: urlData.publicUrl,
        pages: metadata.pages,
        questions: metadata.questions,
        duration: metadata.duration,
        created_by: metadata.userId
      })
      .select()
      .single();

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading exam paper:', error);
    return { data: null, error };
  }
};

export const getExamPapers = async (filters = {}) => {
  try {
    let query = supabase
      .from('exam_papers')
      .select('*');
    
    // Apply filters if provided
    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }
    
    if (filters.grade) {
      query = query.eq('grade', filters.grade);
    }
    
    if (filters.year) {
      query = query.eq('year', filters.year);
    }
    
    // Order by most recent
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching exam papers:', error);
    return { data: null, error };
  }
};

export const deleteExamPaper = async (id, filePath) => {
  try {
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('exam-papers')
      .remove([filePath]);
    
    if (storageError) throw storageError;
    
    // Delete record from database
    const { error: dbError } = await supabase
      .from('exam_papers')
      .delete()
      .eq('id', id);
    
    if (dbError) throw dbError;
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting exam paper:', error);
    return { error };
  }
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