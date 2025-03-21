import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generatePersonalizedRecommendations } from '@/utils/aiLearningPath';

export async function POST(request) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get session to verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { action, userId, courseId, learningPath } = body;
    
    // Ensure we're dealing with the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Handle different actions
    switch (action) {
      case 'get_recommendations':
        // Generate new personalized recommendations
        const recommendations = await generatePersonalizedRecommendations(userId, courseId);
        return NextResponse.json({ recommendations });
        
      case 'save_learning_path':
        // Validate input
        if (!learningPath) {
          return NextResponse.json({ error: 'Missing learning path data' }, { status: 400 });
        }
        
        // First, mark any existing active paths as inactive
        await supabase
          .from('user_learning_paths')
          .update({ is_active: false })
          .match({ user_id: userId, course_id: courseId, is_active: true });
        
        // Then insert the new learning path
        const { data, error } = await supabase
          .from('user_learning_paths')
          .insert({
            user_id: userId,
            course_id: courseId,
            path_data: learningPath,
            is_active: true
          });
        
        if (error) {
          console.error('Error saving learning path:', error);
          return NextResponse.json({ error: 'Failed to save learning path' }, { status: 500 });
        }
        
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Personalization API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 