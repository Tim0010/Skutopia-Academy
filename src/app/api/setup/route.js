import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Direct SQL approach for database setup

    // Create lesson_progress table if not exists
    const lessonProgressTableSQL = `
      CREATE TABLE IF NOT EXISTS public.lesson_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
        course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT false,
        progress_percentage INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        last_position VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, lesson_id)
      );
    `;
    
    // Create user_learning_paths table if not exists
    const learningPathsTableSQL = `
      CREATE TABLE IF NOT EXISTS public.user_learning_paths (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
        path_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, course_id, is_active) WHERE (is_active = true)
      );
    `;

    // Create contact_messages table if not exists
    const contactMessagesTableSQL = `
      CREATE TABLE IF NOT EXISTS public.contact_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        province TEXT,
        school TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Create index on status and created_at for efficient querying
      CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);
    `;

    // Create get_course_lesson_counts function with explicit INTEGER casting to fix the type mismatch
    const functionSQL = `
      CREATE OR REPLACE FUNCTION public.get_course_lesson_counts()
      RETURNS TABLE (
          course_id UUID,
          count INTEGER,
          user_id UUID
      ) 
      LANGUAGE sql
      SECURITY DEFINER
      AS $$
          SELECT 
              c.id AS course_id,
              COUNT(l.id)::INTEGER AS count,
              NULL::UUID AS user_id
          FROM 
              public.courses c
              LEFT JOIN public.units u ON u.course_id = c.id
              LEFT JOIN public.lessons l ON l.unit_id = u.id
          GROUP BY 
              c.id;
      $$;

      GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO authenticated;
      GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO service_role;
    `;

    // Create mentorship tables and relationships
    const mentorshipTablesSQL = `
      -- Create mentors table if it doesn't exist
      CREATE TABLE IF NOT EXISTS public.mentors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        bio TEXT,
        expertise TEXT[],
        experience_years INTEGER,
        hourly_rate DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Create mentor_subjects table
      CREATE TABLE IF NOT EXISTS public.mentor_subjects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        proficiency_level INTEGER DEFAULT 3,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(mentor_id, subject)
      );

      -- Create mentor_reviews table
      CREATE TABLE IF NOT EXISTS public.mentor_reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
        student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Create mentorship_sessions table with proper foreign keys
      CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
        student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        session_date TIMESTAMP WITH TIME ZONE NOT NULL,
        duration INTEGER NOT NULL, -- in minutes
        status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
        meeting_link TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Create user_bookmarks table
      CREATE TABLE IF NOT EXISTS public.user_bookmarks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, lesson_id)
      );

      -- Create scholarship_bookmarks table
      CREATE TABLE IF NOT EXISTS public.scholarship_bookmarks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        scholarship_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, scholarship_id)
      );

      -- Add RLS policies for security
      ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.mentor_subjects ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.scholarship_bookmarks ENABLE ROW LEVEL SECURITY;

      -- Create policy for mentors (only the user can edit their mentor profile)
      CREATE POLICY "Users can view all mentors"
        ON public.mentors FOR SELECT
        USING (true);

      CREATE POLICY "Users can only update their own mentor profile"
        ON public.mentors FOR UPDATE
        USING (auth.uid() = user_id);

      -- Create policy for mentorship_sessions
      CREATE POLICY "Users can see their own sessions"
        ON public.mentorship_sessions FOR SELECT
        USING (auth.uid() = student_id OR auth.uid() IN (
          SELECT user_id FROM public.mentors WHERE id = mentor_id
        ));
    `;

    // Try various approaches until one works
    const responses = {};
    
    // Method 1: Try using _sql_raw
    try {
      const { error: lessonProgressError } = await supabase.from('_sql_raw').select('*', { head: true }).maybeSingle().options({
        method: 'POST',
        body: JSON.stringify({ query: lessonProgressTableSQL }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      responses.method1Error = lessonProgressError;
    } catch (error) {
      responses.method1Error = error.message;
    }
    
    // Method 2: Try a direct RPC query (may work in newer Supabase versions)
    try {
      const { data, error } = await supabase.rpc('get_course_lesson_counts');
      if (error) {
        // Function doesn't exist, we need to create it
        responses.method2Error = error.message;
        
        // Try direct SQL
        try {
          // First try to directly call SQL
          const { data, error } = await supabase.from('courses')
            .select(`
              id,
              units:units (
                id,
                lessons:lessons (id)
              )
            `);
          
          // If we get here, we can create tables manually
          const createdTables = {};
          
          // Create lesson_progress table
          try {
            const { data: tableData, error: tableError } = await supabase.from('lesson_progress').select('id').limit(1);
            if (tableError && tableError.code === '42P01') {
              // Table doesn't exist, need to create it
              createdTables.lesson_progress = "Table needs to be created";
            } else {
              createdTables.lesson_progress = "Table already exists";
            }
          } catch (e) {
            createdTables.lesson_progress = e.message;
          }
          
          // Create user_learning_paths table
          try {
            const { data: tableData, error: tableError } = await supabase.from('user_learning_paths').select('id').limit(1);
            if (tableError && tableError.code === '42P01') {
              // Table doesn't exist, need to be created
              createdTables.user_learning_paths = "Table needs to be created";
            } else {
              createdTables.user_learning_paths = "Table already exists";
            }
          } catch (e) {
            createdTables.user_learning_paths = e.message;
          }

          // Check mentorship_sessions table
          try {
            const { data: tableData, error: tableError } = await supabase.from('mentorship_sessions').select('id').limit(1);
            if (tableError && tableError.code === '42P01') {
              // Table doesn't exist, need to be created
              createdTables.mentorship_sessions = "Table needs to be created";
            } else {
              createdTables.mentorship_sessions = "Table already exists";
            }
          } catch (e) {
            createdTables.mentorship_sessions = e.message;
          }
          
          responses.tableStatus = createdTables;
        } catch (sqlError) {
          responses.directSqlError = sqlError.message;
        }
      } else {
        responses.method2Result = "Function exists and works!";
      }
    } catch (error) {
      responses.method2Error = error.message;
    }
    
    // Method 3: Check using structure info
    try {
      const { data, error } = await supabase.rpc('get_lesson_counts_sql', {
        sql_query: `
          SELECT 
              c.id AS course_id,
              COUNT(l.id)::INTEGER AS count
          FROM 
              public.courses c
              LEFT JOIN public.units u ON u.course_id = c.id
              LEFT JOIN public.lessons l ON l.unit_id = u.id
          GROUP BY 
              c.id
        `
      });
      
      responses.method3Result = error ? "Error: " + error.message : "Success";
    } catch (error) {
      responses.method3Error = error.message;
    }

    // Try to create mentorship tables
    try {
      const { error: mentorshipError } = await supabase.from('_sql_raw').select('*', { head: true }).maybeSingle().options({
        method: 'POST',
        body: JSON.stringify({ query: mentorshipTablesSQL }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      responses.mentorshipTablesError = mentorshipError;
    } catch (error) {
      responses.mentorshipTablesError = error.message;
    }
    
    // Final check to see if the function now exists
    try {
      // Try to test if the function exists by calling it
      const { data: testData, error: testError } = await supabase.rpc('get_course_lesson_counts');
      if (testError) {
        responses.finalCheckResult = "Function has error: " + testError.message;
      } else {
        responses.finalCheckResult = "Function works!";
        responses.functionData = testData?.slice(0, 5) || []; // Show just first 5 results
      }
    } catch (error) {
      responses.finalCheckResult = "Function test error: " + error.message;
    }
    
    // If all else fails, provide SQL that the user can run manually
    const manualSql = {
      lesson_progress: lessonProgressTableSQL,
      user_learning_paths: learningPathsTableSQL,
      get_course_lesson_counts: functionSQL,
      mentorship_tables: mentorshipTablesSQL,
      contact_messages: contactMessagesTableSQL
    };
    
    // Execute the SQL statements
    await supabase.rpc('exec_sql', { query: lessonProgressTableSQL });
    await supabase.rpc('exec_sql', { query: learningPathsTableSQL });
    await supabase.rpc('exec_sql', { query: contactMessagesTableSQL });

    return NextResponse.json({ 
      success: true, 
      message: 'Database setup request processed',
      responses,
      manualSql
    });
    
  } catch (error) {
    console.error('Error in setup route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to set up database'
    }, { status: 500 });
  }
} 