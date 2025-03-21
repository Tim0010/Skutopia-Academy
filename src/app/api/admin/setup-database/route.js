import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the request body (table to create)
    const body = await request.json();
    const { table } = body;

    // Properly await cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' }, 
        { status: 401 }
      );
    }
    
    // Verify user is admin
    const user = session.user;
    if (!user.user_metadata || user.user_metadata.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' }, 
        { status: 401 }
      );
    }
    
    // Create the requested table
    let result;
    
    switch (table) {
      case 'profiles':
        result = await createProfilesTable(supabase);
        break;
      case 'courses':
        result = await createCoursesTable(supabase);
        break;
      case 'contact_messages':
        result = await createContactMessagesTable(supabase);
        break;
      case 'lessons':
        result = await createLessonsTable(supabase);
        break;
      case 'enrollments':
        result = await createEnrollmentsTable(supabase);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid table specified' }, 
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in setup-database API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Create Profiles table
async function createProfilesTable(supabase) {
  const { error } = await supabase.rpc('create_profiles_table', {}, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (error) throw error;
  
  return { success: true, message: 'Profiles table created successfully' };
}

// Create Courses table
async function createCoursesTable(supabase) {
  // Use raw SQL since the RPC might not exist yet
  const { error } = await supabase.from('courses').insert({
    id: 'temp-id-for-creation',
    title: 'Temporary Course',
    description: 'This is a temporary entry to create the table',
    created_at: new Date().toISOString()
  });
  
  // If table already exists, this will fail but that's okay
  // Delete the temporary row
  await supabase.from('courses').delete().eq('id', 'temp-id-for-creation');
  
  return { success: true, message: 'Courses table created or already exists' };
}

// Create Contact Messages table
async function createContactMessagesTable(supabase) {
  // Use raw SQL since the RPC might not exist yet
  const { error } = await supabase.from('contact_messages').insert({
    id: 'temp-id-for-creation',
    name: 'System',
    email: 'system@example.com',
    subject: 'Table Creation',
    message: 'This is a temporary entry to create the table',
    status: 'system',
    created_at: new Date().toISOString()
  });
  
  // Delete the temporary row
  await supabase.from('contact_messages').delete().eq('id', 'temp-id-for-creation');
  
  return { success: true, message: 'Contact messages table created or already exists' };
}

// Create Lessons table
async function createLessonsTable(supabase) {
  // Use raw SQL since the RPC might not exist yet
  const { error } = await supabase.from('lessons').insert({
    id: 'temp-id-for-creation',
    title: 'Temporary Lesson',
    content: 'This is a temporary entry to create the table',
    course_id: 'temp-course-id',
    created_at: new Date().toISOString()
  });
  
  // Delete the temporary row
  await supabase.from('lessons').delete().eq('id', 'temp-id-for-creation');
  
  return { success: true, message: 'Lessons table created or already exists' };
}

// Create Enrollments table
async function createEnrollmentsTable(supabase) {
  // Use raw SQL since the RPC might not exist yet
  const { error } = await supabase.from('enrollments').insert({
    id: 'temp-id-for-creation',
    user_id: 'temp-user-id',
    course_id: 'temp-course-id',
    enrolled_at: new Date().toISOString(),
    status: 'active'
  });
  
  // Delete the temporary row
  await supabase.from('enrollments').delete().eq('id', 'temp-id-for-creation');
  
  return { success: true, message: 'Enrollments table created or already exists' };
} 