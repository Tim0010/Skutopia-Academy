/**
 * AI-powered personalized learning path utilities
 * Analyzes student performance and recommends optimized learning paths
 */

import { supabase } from './supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For client-side use
});

/**
 * Analyzes student performance data to generate insights
 * @param {string} userId - The user ID to analyze
 * @param {string} courseId - The course ID (optional)
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeStudentPerformance(userId, courseId = null) {
  try {
    // Get quiz attempts
    const quizQuery = supabase
      .from('quiz_attempts')
      .select(`
        id,
        quiz_id,
        score,
        answers,
        time_taken,
        completed_at,
        quizzes:quiz_id (
          id,
          title,
          lesson_id,
          passing_score,
          time_limit,
          quiz_questions(id, question, question_type, correct_answer)
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    // Get learning progress
    const progressQuery = supabase
      .from('user_progress')
      .select(`
        id,
        lesson_id,
        completed,
        score,
        last_accessed,
        lessons:lesson_id (
          id,
          title,
          content_type,
          unit_id,
          units:unit_id (
            id,
            course_id,
            title
          )
        )
      `)
      .eq('user_id', userId);

    // Fetch flashcard progress
    const flashcardQuery = supabase
      .from('flashcard_progress')
      .select(`
        id,
        flashcard_id,
        confidence_level,
        review_count,
        next_review_date,
        flashcards:flashcard_id (
          id,
          deck_id,
          front_content,
          back_content,
          difficulty_level,
          flashcard_decks:deck_id (
            id,
            title,
            subject,
            grade_level
          )
        )
      `)
      .eq('user_id', userId);

    // If courseId is provided, filter by course
    if (courseId) {
      progressQuery.filter('lessons.units.course_id', 'eq', courseId);
    }

    // Execute all queries in parallel
    const [quizResult, progressResult, flashcardResult] = await Promise.all([
      quizQuery,
      progressQuery,
      flashcardQuery
    ]);

    // Process and format the results
    const quizData = quizResult.data || [];
    const progressData = progressResult.data || [];
    const flashcardData = flashcardResult.data || [];

    // Calculate statistics
    const quizStats = calculateQuizStats(quizData);
    const learningStats = calculateLearningStats(progressData);
    const flashcardStats = calculateFlashcardStats(flashcardData);

    // Identify strengths and weaknesses
    const strengthsAndWeaknesses = identifyStrengthsAndWeaknesses(
      quizData,
      progressData,
      flashcardData
    );

    return {
      quizStats,
      learningStats,
      flashcardStats,
      strengthsAndWeaknesses,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing student performance:', error);
    throw new Error('Failed to analyze student performance');
  }
}

/**
 * Generate personalized learning recommendations based on performance
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID
 * @returns {Promise<Object>} - Personalized recommendations
 */
export async function generatePersonalizedRecommendations(userId, courseId) {
  try {
    // First analyze student performance
    const performanceData = await analyzeStudentPerformance(userId, courseId);

    // Get course structure and content
    const { data: courseData } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        subject,
        grade_level,
        units (
          id,
          title,
          sequence_number,
          lessons (
            id,
            title,
            content_type,
            sequence_number
          )
        )
      `)
      .eq('id', courseId)
      .single();

    if (!courseData) {
      throw new Error('Course not found');
    }

    // Use AI to generate recommendations based on performance and course structure
    const recommendations = await generateAIRecommendations(
      performanceData,
      courseData,
      userId
    );

    return recommendations;
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    throw new Error('Failed to generate personalized recommendations');
  }
}

/**
 * Use OpenAI to generate personalized learning recommendations
 * @param {Object} performanceData - Student performance analysis
 * @param {Object} courseData - Course structure and content
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - AI-generated recommendations
 */
async function generateAIRecommendations(performanceData, courseData, userId) {
  try {
    // Get user profile for personalization
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Format data for AI analysis
    const contextData = {
      performance: performanceData,
      course: courseData,
      userProfile: userProfile || {}
    };

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert educational advisor specializing in STEM education for Zambian curriculum.
                   Your task is to analyze student performance data and provide personalized learning recommendations.
                   Format your response as a structured JSON object containing:
                   1. A list of recommended next lessons to study
                   2. Concepts that need more review
                   3. Specific practice exercises to reinforce understanding
                   4. Learning strategies tailored to the student's performance patterns`
        },
        {
          role: "user",
          content: JSON.stringify(contextData)
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse AI recommendations
    const recommendations = JSON.parse(response.choices[0].message.content);

    return {
      ...recommendations,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw new Error('Failed to generate AI recommendations');
  }
}

/**
 * Calculate quiz performance statistics
 * @param {Array} quizData - Quiz attempt data
 * @returns {Object} - Quiz statistics
 */
function calculateQuizStats(quizData) {
  if (!quizData || quizData.length === 0) {
    return {
      averageScore: 0,
      quizzesTaken: 0,
      passingRate: 0,
      averageTimePerQuestion: 0
    };
  }

  let totalScore = 0;
  let passedQuizzes = 0;
  let totalQuestionTime = 0;
  let totalQuestions = 0;

  quizData.forEach(attempt => {
    totalScore += attempt.score;
    
    if (attempt.quizzes && attempt.score >= attempt.quizzes.passing_score) {
      passedQuizzes++;
    }
    
    if (attempt.time_taken && attempt.quizzes?.quiz_questions) {
      const questionCount = attempt.quizzes.quiz_questions.length;
      totalQuestions += questionCount;
      totalQuestionTime += attempt.time_taken;
    }
  });

  return {
    averageScore: totalScore / quizData.length,
    quizzesTaken: quizData.length,
    passingRate: (passedQuizzes / quizData.length) * 100,
    averageTimePerQuestion: totalQuestions > 0 ? totalQuestionTime / totalQuestions : 0
  };
}

/**
 * Calculate learning progress statistics
 * @param {Array} progressData - Learning progress data
 * @returns {Object} - Learning statistics
 */
function calculateLearningStats(progressData) {
  if (!progressData || progressData.length === 0) {
    return {
      completedLessons: 0,
      totalLessons: 0,
      completionRate: 0,
      averageScore: 0
    };
  }

  const completedLessons = progressData.filter(progress => progress.completed).length;
  const lessonsWithScores = progressData.filter(progress => progress.score !== null && progress.score !== undefined);
  
  let totalScore = 0;
  lessonsWithScores.forEach(lesson => {
    totalScore += lesson.score;
  });

  return {
    completedLessons,
    totalLessons: progressData.length,
    completionRate: (completedLessons / progressData.length) * 100,
    averageScore: lessonsWithScores.length > 0 ? totalScore / lessonsWithScores.length : 0
  };
}

/**
 * Calculate flashcard study statistics
 * @param {Array} flashcardData - Flashcard progress data
 * @returns {Object} - Flashcard statistics
 */
function calculateFlashcardStats(flashcardData) {
  if (!flashcardData || flashcardData.length === 0) {
    return {
      totalFlashcards: 0,
      averageConfidence: 0,
      masteredFlashcards: 0,
      reviewsDue: 0
    };
  }

  let totalConfidence = 0;
  const masteredFlashcards = flashcardData.filter(card => card.confidence_level >= 3).length;
  const now = new Date();
  const reviewsDue = flashcardData.filter(card => {
    const reviewDate = new Date(card.next_review_date);
    return reviewDate <= now;
  }).length;

  flashcardData.forEach(card => {
    totalConfidence += card.confidence_level;
  });

  return {
    totalFlashcards: flashcardData.length,
    averageConfidence: totalConfidence / flashcardData.length,
    masteredFlashcards,
    masteredPercentage: (masteredFlashcards / flashcardData.length) * 100,
    reviewsDue
  };
}

/**
 * Identify student strengths and weaknesses from performance data
 * @param {Array} quizData - Quiz attempt data
 * @param {Array} progressData - Learning progress data
 * @param {Array} flashcardData - Flashcard progress data
 * @returns {Object} - Strengths and weaknesses analysis
 */
function identifyStrengthsAndWeaknesses(quizData, progressData, flashcardData) {
  // This would contain more complex analysis in a real implementation
  // For now, simplified to basic identification
  const strengths = [];
  const weaknesses = [];

  // Analyze quiz performance by topic
  const topicPerformance = {};

  // Process quiz data to identify topic strengths/weaknesses
  quizData.forEach(attempt => {
    if (attempt.quizzes?.title) {
      const topic = attempt.quizzes.title.split('-')[0].trim();
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = {
          totalScore: 0,
          attempts: 0
        };
      }
      
      topicPerformance[topic].totalScore += attempt.score;
      topicPerformance[topic].attempts += 1;
    }
  });

  // Determine strengths and weaknesses based on average scores
  Object.entries(topicPerformance).forEach(([topic, data]) => {
    const averageScore = data.totalScore / data.attempts;
    
    if (averageScore >= 80) {
      strengths.push({
        topic,
        averageScore,
        type: 'quiz_performance'
      });
    } else if (averageScore < 60) {
      weaknesses.push({
        topic,
        averageScore,
        type: 'quiz_performance'
      });
    }
  });

  return {
    strengths,
    weaknesses,
    analysisDetails: {
      topicPerformance
    }
  };
} 