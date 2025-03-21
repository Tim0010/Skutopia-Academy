-- Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    deadline TIMESTAMP WITH TIME ZONE,
    eligibility_criteria JSONB,
    application_url TEXT,
    provider TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active scholarships"
ON public.scholarships FOR SELECT
USING (is_active = true);

-- Create index on deadline
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline 
ON public.scholarships (deadline)
WHERE is_active = true; 