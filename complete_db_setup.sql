-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    school TEXT,
    grade TEXT,
    interests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_settings table if not exists
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create courses table for STEM subjects
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    thumbnail_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create units table for course chapters
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sequence_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content JSONB NOT NULL,
    sequence_number INTEGER NOT NULL,
    order_number INTEGER NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for course_id to improve join performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(course_id, order_number);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER,
    passing_score INTEGER NOT NULL DEFAULT 70,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    points INTEGER NOT NULL DEFAULT 1,
    order_number INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    time_taken INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flashcard decks table
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    grade_level INTEGER,
    is_public BOOLEAN DEFAULT false,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
    front_content JSONB NOT NULL,
    back_content JSONB NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    order_number INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    score INTEGER,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- Create flashcard progress table
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
    confidence_level INTEGER DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, flashcard_id)
);

-- Create lesson progress table to track user progress through lessons
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    last_position VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- Create user learning paths for personalized learning
CREATE TABLE IF NOT EXISTS public.user_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    path_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add a partial unique index for the active learning paths
CREATE UNIQUE INDEX IF NOT EXISTS user_learning_paths_unique_active 
ON public.user_learning_paths (user_id, course_id) 
WHERE (is_active = true);

-- Create mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    bio TEXT,
    expertise TEXT[],
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create mentor subjects table
CREATE TABLE IF NOT EXISTS public.mentor_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create mentor reviews table
CREATE TABLE IF NOT EXISTS public.mentor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
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
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Create scholarship_bookmarks table
CREATE TABLE IF NOT EXISTS public.scholarship_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scholarship_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, scholarship_id)
);

-- Create avatars storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the avatars bucket
DROP POLICY IF EXISTS "Avatar storage access policy" ON storage.objects;
CREATE POLICY "Avatar storage access policy"
ON storage.objects FOR ALL
USING (bucket_id = 'avatars' AND (auth.uid() = owner OR bucket_id = 'avatars'));

DROP POLICY IF EXISTS "Avatar insert policy" ON storage.objects;
CREATE POLICY "Avatar insert policy"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;
CREATE POLICY "Avatar update policy"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Avatar delete policy" ON storage.objects;
CREATE POLICY "Avatar delete policy"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Enable Row Level Security on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security (RLS)
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
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_bookmarks ENABLE ROW LEVEL SECURITY;

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

-- Create policy for mentors (only the user can edit their mentor profile)
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

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to user_settings table
DROP TRIGGER IF EXISTS handle_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER handle_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to courses table
DROP TRIGGER IF EXISTS handle_courses_updated_at ON public.courses;
CREATE TRIGGER handle_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to units table
DROP TRIGGER IF EXISTS handle_units_updated_at ON public.units;
CREATE TRIGGER handle_units_updated_at
BEFORE UPDATE ON public.units
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to lessons table
DROP TRIGGER IF EXISTS handle_lessons_updated_at ON public.lessons;
CREATE TRIGGER handle_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to other tables with updated_at columns
DROP TRIGGER IF EXISTS handle_mentors_updated_at ON public.mentors;
CREATE TRIGGER handle_mentors_updated_at
BEFORE UPDATE ON public.mentors
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_mentorship_sessions_updated_at ON public.mentorship_sessions;
CREATE TRIGGER handle_mentorship_sessions_updated_at
BEFORE UPDATE ON public.mentorship_sessions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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

-- Function to get course lesson counts and user progress for dashboard
CREATE OR REPLACE FUNCTION public.get_course_lesson_counts()
RETURNS TABLE (
    course_id UUID,
    total_lessons INTEGER,
    completed_lessons INTEGER,
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
            COUNT(l.id) AS total_lessons
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
            COUNT(lp.id) AS completed_lessons
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
        COALESCE(up.completed_lessons, 0) AS completed_lessons,
        up.user_id
    FROM 
        course_totals ct
        LEFT JOIN user_progress up ON ct.course_id = up.course_id;
END;
$$;

-- Create function to get mentor with user information
CREATE OR REPLACE FUNCTION get_mentor_with_user(mentor_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT
        json_build_object(
            'id', m.id,
            'is_active', m.is_active,
            'bio', m.bio,
            'expertise', m.expertise,
            'experience_years', m.experience_years,
            'hourly_rate', m.hourly_rate,
            'rating', m.rating,
            'is_verified', m.is_verified,
            'created_at', m.created_at,
            'user', json_build_object(
                'id', u.id,
                'email', u.email,
                'full_name', p.full_name,
                'avatar_url', p.avatar_url
            )
        ) INTO result
    FROM
        public.mentors m
    JOIN
        auth.users u ON m.id = u.id
    LEFT JOIN
        public.profiles p ON m.id = p.id
    WHERE
        m.id = mentor_id;
        
    RETURN result;
END;
$$;

-- Grant execute permissions for functions
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_mentor_with_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mentor_with_user(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Now, insert sample data

-- First create sample courses
INSERT INTO public.courses (id, title, description, subject, grade_level, thumbnail_url, is_published)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Web Development', 'Learn the fundamentals of web development including HTML, CSS, and JavaScript', 'Computer Science', 10, 'https://example.com/webdev.jpg', true),
  ('22222222-2222-2222-2222-222222222222', 'Data Science', 'Introduction to data science with Python, including data analysis and visualization', 'Mathematics', 11, 'https://example.com/datascience.jpg', true),
  ('33333333-3333-3333-3333-333333333333', 'Digital Marketing', 'Learn about social media marketing, SEO, and content marketing', 'Business', 9, 'https://example.com/marketing.jpg', true);

-- Create units for each course
INSERT INTO public.units (id, course_id, title, description, sequence_number)
VALUES
  -- Web Development Units
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Introduction to HTML', 'Learn the basics of HTML structure and elements', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'CSS Styling', 'Style your web pages with CSS', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'JavaScript Basics', 'Introduction to JavaScript programming', 3),
  
  -- Data Science Units
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Python Fundamentals', 'Learn the basics of Python programming', 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Data Analysis with Pandas', 'Learn to analyze data with Pandas library', 2),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Data Visualization', 'Create compelling visualizations with matplotlib', 3),
  
  -- Digital Marketing Units
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Social Media Strategy', 'Develop effective social media marketing strategies', 1),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'SEO Fundamentals', 'Learn search engine optimization techniques', 2),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Content Marketing', 'Create and distribute valuable content', 3);

-- Create sample lessons for each unit
INSERT INTO public.lessons (id, unit_id, course_id, title, content_type, content, sequence_number, order_number, video_url)
VALUES
  -- HTML Unit Lessons
  ('11aa1111-11aa-11aa-11aa-11aa11aa11aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'HTML Document Structure', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Document Structure"},{"type":"paragraph","text":"In this lesson, you will learn about the basic structure of an HTML document including DOCTYPE, html, head, and body tags."},{"type":"header-two","text":"The DOCTYPE Declaration"},{"type":"paragraph","text":"Every HTML document starts with a DOCTYPE declaration."}]}', 
   1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  ('22aa2222-22aa-22aa-22aa-22aa22aa22aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'HTML Text Elements', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Text Elements"},{"type":"paragraph","text":"This lesson covers basic text formatting elements in HTML."},{"type":"header-two","text":"Headings"},{"type":"paragraph","text":"HTML has six levels of headings, from h1 (most important) to h6 (least important)."}]}', 
   2, 2, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  ('33aa3333-33aa-33aa-33aa-33aa33aa33aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'HTML Links and Images', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Links and Images"},{"type":"paragraph","text":"Learn how to add links and images to your web pages."},{"type":"header-two","text":"Links"},{"type":"paragraph","text":"Links are created using the a tag."}]}', 
   3, 3, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- CSS Unit Lessons
  ('44bb4444-44bb-44bb-44bb-44bb44bb44bb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'CSS Selectors', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"CSS Selectors"},{"type":"paragraph","text":"Learn how to select HTML elements to apply styles."},{"type":"header-two","text":"Element Selectors"},{"type":"paragraph","text":"The most basic selector is the element selector."}]}', 
   1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- JavaScript Unit Lessons
  ('55cc5555-55cc-55cc-55cc-55cc55cc55cc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'JavaScript Variables', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"JavaScript Variables"},{"type":"paragraph","text":"Learn about variables in JavaScript."},{"type":"header-two","text":"Declaring Variables"},{"type":"paragraph","text":"Variables can be declared using let, const, or var."}]}', 
   1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Python Unit Lessons
  ('66dd6666-66dd-66dd-66dd-66dd66dd66dd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Python Basics', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Python Basics"},{"type":"paragraph","text":"Introduction to Python programming language."},{"type":"header-two","text":"Variables and Data Types"},{"type":"paragraph","text":"Python has several built-in data types."}]}', 
   1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Data Analysis Unit Lessons
  ('77ee7777-77ee-77ee-77ee-77ee77ee77ee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Data Analysis with Pandas', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Data Analysis with Pandas"},{"type":"paragraph","text":"Learn how to analyze data using the Pandas library."}]}', 
   1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Data Visualization Unit Lessons
  ('88ff8888-88ff-88ff-88ff-88ff88ff88ff', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Data Visualization', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Data Visualization"},{"type":"paragraph","text":"Learn to create compelling visualizations with matplotlib and seaborn."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Social Media Unit Lessons
  ('99991111-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Social Media Marketing', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Social Media Strategy"},{"type":"paragraph","text":"Learn how to develop an effective social media marketing strategy."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- SEO Unit Lessons
  ('aaaa1010-aaaa-aaaa-aaaa-aaaa10aaaa10', '55555555-5555-5555-5555-555555555555', 'SEO Fundamentals', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"SEO Fundamentals"},{"type":"paragraph","text":"Learn the basics of search engine optimization."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Content Marketing Unit Lessons
  ('bbbb1111-bbbb-bbbb-bbbb-bbbb11bbbb11', '66666666-6666-6666-6666-666666666666', 'Content Marketing', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Content Marketing"},{"type":"paragraph","text":"Create valuable content that attracts and engages your target audience."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ');

-- Create sample quizzes
INSERT INTO public.quizzes (id, lesson_id, title, description, passing_score, time_limit)
VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '11aa1111-11aa-11aa-11aa-11aa11aa11aa', 'HTML Structure Quiz', 'Test your knowledge of HTML document structure', 70, 300),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '22aa2222-22aa-22aa-22aa-22aa22aa22aa', 'HTML Text Elements Quiz', 'Test your understanding of HTML text formatting', 70, 300),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '66dd6666-66dd-66dd-66dd-66dd66dd66dd', 'Python Basics Quiz', 'Test your knowledge of Python fundamentals', 80, 600);

-- Create sample quiz questions
INSERT INTO public.quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, points, order_number)
VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Which tag is used to define the main content of an HTML document?', 'multiple_choice', 
   '["<content>", "<main>", "<body>", "<section>"]', 
   '"<body>"', 
   'The <body> element contains all the contents of an HTML document, such as headings, paragraphs, images, links, etc.', 
   1, 1),
   
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'What does DOCTYPE declaration do?', 'multiple_choice', 
   '["It defines the document type and version of HTML", "It specifies the document author", "It sets the document title", "It defines the main content"]', 
   '"It defines the document type and version of HTML"', 
   'The DOCTYPE declaration is not an HTML tag. It is an instruction to the web browser about what version of HTML the page is written in.', 
   1, 2),
   
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Which heading tag represents the highest level heading?', 'multiple_choice', 
   '["<h1>", "<h2>", "<h6>", "<heading>"]', 
   '"<h1>"', 
   'The <h1> tag defines the most important heading. <h6> defines the least important heading.', 
   1, 1),
   
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Which keyword is used to declare a constant variable in Python?', 'multiple_choice', 
   '["var", "let", "const", "None of these"]', 
   '"None of these"', 
   'Python does not have specific keywords for constant variables like JavaScript. By convention, constants are named with uppercase letters.', 
   1, 1);

-- Create sample mentor if not exists
-- First, create the user in auth.users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  'abcdef12-3456-7890-abcd-ef1234567890',
  'mentor@example.com',
  jsonb_build_object(
    'full_name', 'John Smith',
    'avatar_url', 'https://example.com/avatar.jpg'
  )
)
ON CONFLICT (id) DO NOTHING;

-- Then create the mentor record
INSERT INTO public.mentors (id, is_active, bio, expertise, experience_years, hourly_rate, rating, is_verified)
VALUES
  ('abcdef12-3456-7890-abcd-ef1234567890', true, 'Experienced web development instructor with a passion for teaching beginners.', ARRAY['HTML', 'CSS', 'JavaScript'], 5, 45.00, 4.8, true)
ON CONFLICT (id) DO NOTHING;

-- Add mentor subjects
INSERT INTO public.mentor_subjects (mentor_id, subject, proficiency_level)
VALUES
  ('abcdef12-3456-7890-abcd-ef1234567890', 'Web Development', 5),
  ('abcdef12-3456-7890-abcd-ef1234567890', 'JavaScript', 5),
  ('abcdef12-3456-7890-abcd-ef1234567890', 'HTML/CSS', 5)
ON CONFLICT DO NOTHING; 