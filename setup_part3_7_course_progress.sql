-- Create user course progress table
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own course progress" ON public.user_course_progress;
DROP POLICY IF EXISTS "Users can insert their own course progress" ON public.user_course_progress;
DROP POLICY IF EXISTS "Users can update their own course progress" ON public.user_course_progress;

-- Create policies with unique names
CREATE POLICY "Users can view their own course progress"
ON public.user_course_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress"
ON public.user_course_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress"
ON public.user_course_progress FOR UPDATE
USING (auth.uid() = user_id); 