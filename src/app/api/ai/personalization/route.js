import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * API endpoint for AI-powered personalized learning
 * Handles requests for student performance analysis and personalized recommendations
 */
export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  
  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if a learning path already exists
    const { data: existingPath, error: fetchError } = await supabase
      .from('user_learning_paths')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching learning path:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch learning path' }, { status: 500 });
    }

    if (existingPath) {
      return NextResponse.json({ path: existingPath });
    }

    return NextResponse.json({ 
      message: 'No learning path found for this course. Use POST to generate one.'
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();
  const { courseId, gradeLevel } = body;
  
  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('title, description, subject')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
    }

    // Get user's progress data
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('quiz_id, score, max_score')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (quizError) {
      console.error('Error fetching quiz attempts:', quizError);
      // Continue without quiz data
    }

    // Get lessons for this course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, description')
      .eq('course_id', courseId);

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
    }

    // Get user's lesson progress
    const { data: lessonProgress, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lesson_id, is_completed, time_spent')
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (progressError) {
      console.error('Error fetching lesson progress:', progressError);
      // Continue without progress data
    }

    // Generate personalized learning path with OpenAI
    const prompt = `
    Create a personalized learning path for a student studying ${course.title} (${course.subject}).
    Student grade level: ${gradeLevel || 'Not specified'}
    
    Course description: ${course.description}
    
    Available lessons:
    ${lessons.map(l => `- ${l.title}: ${l.description}`).join('\n')}
    
    ${quizAttempts && quizAttempts.length > 0 ? 
      `Recent quiz performance: ${quizAttempts.map(q => `Score: ${q.score}/${q.max_score}`).join(', ')}` : 
      'No quiz data available.'}
    
    ${lessonProgress && lessonProgress.length > 0 ? 
      `Lesson progress: ${lessonProgress.filter(lp => lp.is_completed).length}/${lessons.length} completed` : 
      'No lesson progress data available.'}
    
    Format the learning path as a structured JSON with the following attributes:
    1. recommendedSequence: Array of lesson titles in recommended order
    2. focusAreas: Array of concepts needing more attention
    3. strengths: Array of concepts the student is strong in
    4. learningTips: Array of suggested study strategies
    5. estimatedCompletionTime: Expected time to master the material (in hours)
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational AI that creates personalized learning paths."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const pathData = JSON.parse(completion.data.choices[0].message.content);

    // Store the learning path in the database
    const { data: newPath, error: insertError } = await supabase
      .from('user_learning_paths')
      .insert({
        user_id: user.id,
        course_id: courseId,
        path_data: pathData,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating learning path:', insertError);
      return NextResponse.json({ error: 'Failed to save learning path' }, { status: 500 });
    }

    return NextResponse.json({ path: newPath });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 