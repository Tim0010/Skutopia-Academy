import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Properly await cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Verify user is admin
    const user = session.user;
    if (!user.user_metadata?.role || user.user_metadata.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    // Fetch admin page data in parallel
    const [usersResult, messagesResult, coursesResult] = await Promise.all([
      // Count users from profiles table
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Count unread messages
      supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new'),
      
      // Count courses
      supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
    ]);
    
    // Check for errors in any of the queries
    if (usersResult.error || messagesResult.error || coursesResult.error) {
      const errors = {
        users: usersResult.error?.message,
        messages: messagesResult.error?.message,
        courses: coursesResult.error?.message
      };
      
      return NextResponse.json({ 
        error: 'Error fetching admin data', 
        details: errors 
      }, { status: 500 });
    }
    
    // Return statistics
    return NextResponse.json({
      stats: {
        totalUsers: usersResult.count || 0,
        newMessages: messagesResult.count || 0,
        totalCourses: coursesResult.count || 0
      }
    });
  } catch (error) {
    console.error('Admin page data error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      message: error.message 
    }, { status: 500 });
  }
} 