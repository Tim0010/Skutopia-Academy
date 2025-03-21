import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get user session with proper error handling
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ 
        authenticated: false, 
        user: null,
        error: sessionError.message
      });
    }
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null
      });
    }
    
    // If we have a session, return user data including metadata
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'user',
        name: session.user.user_metadata?.name,
        ...session.user.user_metadata
      }
    });
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error.message
    }, { status: 500 });
  }
} 