import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Create lesson_progress table if it doesn't exist
    const lessonProgressSQL = `
      CREATE TABLE IF NOT EXISTS public.lesson_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT false,
        last_position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        UNIQUE(user_id, lesson_id)
      );
      
      ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
      
      -- Policy for lesson_progress
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policy 
          WHERE polname = 'Users can manage their own lesson progress'
        ) THEN
          CREATE POLICY "Users can manage their own lesson progress"
          ON public.lesson_progress
          USING (auth.uid() = user_id);
        END IF;
      END
      $$;
    `;
    
    // Create user_learning_paths table if it doesn't exist
    const userLearningPathsSQL = `
      CREATE TABLE IF NOT EXISTS public.user_learning_paths (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        courses JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      
      ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;
      
      -- Policy for user_learning_paths
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policy 
          WHERE polname = 'Users can manage their own learning paths'
        ) THEN
          CREATE POLICY "Users can manage their own learning paths"
          ON public.user_learning_paths
          USING (auth.uid() = user_id);
        END IF;
      END
      $$;
    `;
    
    // Fix mentorship tables relationships for nested selects
    const fixMentorshipTablesSQL = `
      -- Create junction table for mentors and users if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'mentor_user_fk_type'
        ) THEN
          -- Create the foreign key relationships for mentors
          CREATE VIEW mentor_user_view AS
          SELECT 
            m.id as mentor_id,
            m.user_id,
            u.user_metadata
          FROM public.mentors m
          JOIN auth.users u ON m.user_id = u.id;
          
          -- Grant necessary permissions
          GRANT SELECT ON mentor_user_view TO authenticated;
          GRANT SELECT ON mentor_user_view TO service_role;
          
          -- Create a custom mentor type that includes the user_metadata
          CREATE TYPE mentor_user_fk_type AS (
            id UUID,
            user_metadata JSONB
          );
          
          -- Create a function to get mentor with user data
          CREATE OR REPLACE FUNCTION get_mentor_with_user(mentor_id UUID)
          RETURNS mentor_user_fk_type
          LANGUAGE SQL
          SECURITY DEFINER
          AS $$
            SELECT 
              m.id,
              u.user_metadata
            FROM public.mentors m
            JOIN auth.users u ON m.user_id = u.id
            WHERE m.id = mentor_id
          $$;
          
          -- Grant execute permissions
          GRANT EXECUTE ON FUNCTION get_mentor_with_user TO authenticated;
          GRANT EXECUTE ON FUNCTION get_mentor_with_user TO service_role;
        END IF;
      END
      $$;
    `;
    
    // Create SQL function for counting lessons per course
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION get_course_lesson_counts()
      RETURNS TABLE (course_id UUID, count INTEGER) 
      LANGUAGE sql
      SECURITY DEFINER
      AS $$
        SELECT 
          c.id AS course_id,
          COUNT(l.id)::INTEGER AS count
        FROM 
          public.courses c
          LEFT JOIN public.units u ON u.course_id = c.id
          LEFT JOIN public.lessons l ON l.unit_id = u.id
        GROUP BY 
          c.id
      $$;
      
      GRANT EXECUTE ON FUNCTION get_course_lesson_counts TO authenticated;
      GRANT EXECUTE ON FUNCTION get_course_lesson_counts TO service_role;
    `;
    
    try {
      // Execute all SQL statements
      const results = await Promise.all([
        supabase.rpc('_sql_raw', { query: lessonProgressSQL }),
        supabase.rpc('_sql_raw', { query: userLearningPathsSQL }),
        supabase.rpc('_sql_raw', { query: fixMentorshipTablesSQL }),
        supabase.rpc('_sql_raw', { query: createFunctionSQL }),
      ]);
      
      // Check for any errors
      const errors = results
        .filter(result => result.error)
        .map(result => result.error.message);
      
      if (errors.length > 0) {
        console.error('Database setup errors:', errors);
        return NextResponse.json({ 
          success: false, 
          errors 
        });
      }
      
      // Create foreign key references that Supabase can use for nested selects
      await supabase.rpc('_sql_raw', { query: `
        ALTER TABLE public.mentorship_sessions 
          DROP CONSTRAINT IF EXISTS mentorship_sessions_mentor_id_fkey,
          ADD CONSTRAINT mentorship_sessions_mentor_id_fkey 
            FOREIGN KEY (mentor_id) REFERENCES public.mentors(id) 
            ON DELETE CASCADE;

        -- Create an RLS policy that allows access to the sessions
        CREATE POLICY IF NOT EXISTS "Allow mentors to view their own sessions"
          ON public.mentorship_sessions
          FOR SELECT
          USING (auth.uid() IN (
            SELECT user_id FROM public.mentors WHERE id = mentor_id
          ) OR auth.uid() = student_id);
      ` });
      
      return NextResponse.json({ 
        success: true,
        message: 'Database tables and functions created successfully',
        details: {
          lessonProgress: 'Created',
          userLearningPaths: 'Created',
          mentorshipRelationships: 'Fixed',
          courseLessonCounts: 'Function created'
        }
      });
      
    } catch (error) {
      console.error('Error executing SQL:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 