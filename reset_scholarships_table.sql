-- Reset script for scholarships table
-- This script will drop the existing table and policies and create new ones

-- First, drop existing policies
DROP POLICY IF EXISTS "Anyone can view active scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Authenticated users can manage scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admins can manage scholarships" ON public.scholarships;

-- Drop the existing trigger
DROP TRIGGER IF EXISTS set_scholarships_updated_at ON public.scholarships;

-- Drop the existing table
DROP TABLE IF EXISTS public.scholarships;

-- Create the table with the new structure
CREATE TABLE public.scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  eligibility_criteria JSONB,
  application_url TEXT,
  provider TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add basic indexes for performance
CREATE INDEX idx_scholarships_provider ON public.scholarships(provider);
CREATE INDEX idx_scholarships_location ON public.scholarships(location);
CREATE INDEX idx_scholarships_is_active ON public.scholarships(is_active);
CREATE INDEX idx_scholarships_deadline ON public.scholarships(deadline);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create simple policies
-- Allow anyone to view active scholarships
CREATE POLICY "Anyone can view active scholarships" 
  ON public.scholarships FOR SELECT 
  USING (is_active = TRUE);

-- Allow authenticated users to manage scholarships
CREATE POLICY "Authenticated users can manage scholarships" 
  ON public.scholarships FOR ALL 
  TO authenticated;

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_scholarships_updated_at
BEFORE UPDATE ON public.scholarships
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add sample data
INSERT INTO public.scholarships (
  title, 
  description, 
  deadline, 
  eligibility_criteria, 
  application_url, 
  provider, 
  location, 
  image_url,
  is_active
) VALUES (
  'STEM Excellence Scholarship', 
  'This scholarship supports students pursuing degrees in Science, Technology, Engineering, or Mathematics fields.', 
  '2025-06-30', 
  '{"gpa": "3.5+", "field": "STEM", "year": "Undergraduate"}', 
  'https://example.com/apply', 
  'National Science Foundation', 
  'USA', 
  'https://eolwoicnfttfpwgweukl.supabase.co/storage/v1/object/public/public/scholarship-stem.jpg',
  TRUE
), (
  'Global Leadership Program', 
  'For students demonstrating exceptional leadership skills and community involvement.', 
  '2025-05-15', 
  '{"requirements": ["Leadership experience", "Community service", "Essay submission"]}', 
  'https://example.com/leadership', 
  'Global Education Initiative', 
  'International', 
  'https://eolwoicnfttfpwgweukl.supabase.co/storage/v1/object/public/public/scholarship-leadership.jpg',
  TRUE
), (
  'Arts and Humanities Grant', 
  'Supporting students in creative arts, literature, philosophy, and related fields.', 
  '2025-07-31', 
  '{"field": "Arts & Humanities", "portfolio": "Required"}', 
  'https://example.com/arts', 
  'Creative Futures Foundation', 
  'Europe', 
  'https://eolwoicnfttfpwgweukl.supabase.co/storage/v1/object/public/public/scholarship-arts.jpg',
  TRUE
);

-- Note: Remember to create a "scholarship_images" bucket in Supabase Storage
-- through the Supabase dashboard
