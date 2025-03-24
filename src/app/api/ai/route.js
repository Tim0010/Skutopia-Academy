import { NextResponse } from 'next/server';
import { 
  generateLessonContent, 
  answerStudentQuestion, 
  generateQuizQuestions,
  generateFlashcards 
} from '@/utils/aiService';

/**
 * Main AI API route handler
 * Handles different AI-related actions based on the request
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { action, ...params } = body;
    
    // Handle different AI actions
    switch (action) {
      case 'generate_lesson':
        const { topic, gradeLevel, subject } = params;
        if (!topic || !gradeLevel || !subject) {
          return NextResponse.json(
            { error: 'Missing required parameters: topic, gradeLevel, subject' },
            { status: 400 }
          );
        }
        
        const lessonContent = await generateLessonContent(topic, gradeLevel, subject);
        return NextResponse.json({ content: lessonContent });
      
      case 'answer_question':
        const { question, currentTopic, studentGradeLevel } = params;
        if (!question || !currentTopic || !studentGradeLevel) {
          return NextResponse.json(
            { error: 'Missing required parameters: question, currentTopic, studentGradeLevel' },
            { status: 400 }
          );
        }
        
        const answer = await answerStudentQuestion(question, currentTopic, studentGradeLevel);
        return NextResponse.json({ answer });
      
      case 'generate_quiz':
        const { quizTopic, quizGradeLevel, difficulty, count } = params;
        if (!quizTopic || !quizGradeLevel || !difficulty) {
          return NextResponse.json(
            { error: 'Missing required parameters: quizTopic, quizGradeLevel, difficulty' },
            { status: 400 }
          );
        }
        
        const questions = await generateQuizQuestions(
          quizTopic,
          quizGradeLevel,
          difficulty,
          count || 5 // Default to 5 questions if not specified
        );
        return NextResponse.json({ questions });
      
      case 'generate_flashcards':
        const { flashcardTopic, flashcardGradeLevel, flashcardSubject, flashcardCount } = params;
        if (!flashcardTopic || !flashcardGradeLevel || !flashcardSubject) {
          return NextResponse.json(
            { error: 'Missing required parameters: flashcardTopic, flashcardGradeLevel, flashcardSubject' },
            { status: 400 }
          );
        }
        
        const flashcards = await generateFlashcards(
          flashcardTopic,
          flashcardGradeLevel,
          flashcardSubject,
          flashcardCount || 10 // Default to 10 flashcards if not specified
        );
        return NextResponse.json({ flashcards });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: generate_lesson, answer_question, generate_quiz, generate_flashcards' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in AI API route:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request: ' + error.message },
      { status: 500 }
    );
  }
} 