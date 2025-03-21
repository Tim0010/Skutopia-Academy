-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can view all mentors" ON public.mentors;
DROP POLICY IF EXISTS "Users can only update their own mentor profile" ON public.mentors;

DROP POLICY IF EXISTS "Users can see their own sessions" ON public.mentorship_sessions;

DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for mentors
CREATE POLICY "Users can view all mentors"
    ON public.mentors FOR SELECT
    USING (true);

CREATE POLICY "Users can only update their own mentor profile"
    ON public.mentors FOR UPDATE
    USING (auth.uid() = id);

-- Create policy for mentorship_sessions
CREATE POLICY "Users can see their own sessions"
    ON public.mentorship_sessions FOR SELECT
    USING (auth.uid() = student_id OR auth.uid() IN (
      SELECT id FROM public.mentors WHERE id = mentor_id
    ));

-- Create policies for courses
CREATE POLICY "Anyone can view published courses"
ON public.courses FOR SELECT
USING (is_published = true OR auth.uid() = created_by);

CREATE POLICY "Users can create courses"
ON public.courses FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own courses"
ON public.courses FOR UPDATE
USING (auth.uid() = created_by);

-- Create function for updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Create settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop existing function first
DROP FUNCTION IF EXISTS public.get_course_lesson_counts();

-- Function to get course lesson counts
CREATE OR REPLACE FUNCTION public.get_course_lesson_counts()
RETURNS TABLE (
    course_id UUID,
    total_lessons BIGINT,
    completed_lessons BIGINT,
    user_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH course_totals AS (
        SELECT 
            c.id AS course_id,
            COUNT(l.id)::BIGINT AS total_lessons
        FROM 
            public.courses c
            LEFT JOIN public.units u ON u.course_id = c.id
            LEFT JOIN public.lessons l ON l.unit_id = u.id
        GROUP BY 
            c.id
    ),
    user_progress AS (
        SELECT 
            c.id AS course_id,
            lp.user_id,
            COUNT(lp.id)::BIGINT AS completed_lessons
        FROM 
            public.courses c
            JOIN public.units u ON u.course_id = c.id
            JOIN public.lessons l ON l.unit_id = u.id
            JOIN public.lesson_progress lp ON lp.lesson_id = l.id
        WHERE 
            lp.is_completed = true
        GROUP BY 
            c.id, lp.user_id
    )
    SELECT 
        ct.course_id,
        ct.total_lessons,
        COALESCE(up.completed_lessons, 0::BIGINT) AS completed_lessons,
        up.user_id
    FROM 
        course_totals ct
        LEFT JOIN user_progress up ON ct.course_id = up.course_id;
END;
$$;

-- Grant execute permissions for functions
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role; 