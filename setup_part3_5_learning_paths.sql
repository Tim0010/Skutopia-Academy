-- Create user learning paths table
CREATE TABLE IF NOT EXISTS public.user_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    path_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create partial index for active learning paths
CREATE UNIQUE INDEX IF NOT EXISTS user_learning_paths_unique_active 
ON public.user_learning_paths (user_id, course_id) 
WHERE (is_active = true);

-- Add RLS policies for user_learning_paths
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own learning paths" ON public.user_learning_paths;
DROP POLICY IF EXISTS "Users can create their own learning paths" ON public.user_learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON public.user_learning_paths;

-- Create new policies
CREATE POLICY "Users can view their own learning paths"
ON public.user_learning_paths FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning paths"
ON public.user_learning_paths FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths"
ON public.user_learning_paths FOR UPDATE
USING (auth.uid() = user_id); 