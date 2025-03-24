-- Drop existing tables if they exist
DROP TABLE IF EXISTS mentor_subjects;
DROP TABLE IF EXISTS mentor_reviews;
DROP TABLE IF EXISTS mentors;

-- Create mentors table with proper column types
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL,  -- Changed from ARRAY to TEXT
  bio TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentor_subjects table
CREATE TABLE mentor_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  proficiency_level INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentor_reviews table
CREATE TABLE mentor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  user_id UUID,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_mentor_subjects_mentor_id ON mentor_subjects(mentor_id);
CREATE INDEX idx_mentor_reviews_mentor_id ON mentor_reviews(mentor_id);

-- Add RLS policies
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Policy for mentors - anyone can view, only authenticated users can insert
CREATE POLICY "Anyone can view mentors" 
  ON mentors FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert mentors" 
  ON mentors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy for mentor_subjects - anyone can view, only authenticated users can insert
CREATE POLICY "Anyone can view mentor subjects" 
  ON mentor_subjects FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert mentor subjects" 
  ON mentor_subjects FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy for mentor_reviews - anyone can view, only authenticated users can insert
CREATE POLICY "Anyone can view mentor reviews" 
  ON mentor_reviews FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert mentor reviews" 
  ON mentor_reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
