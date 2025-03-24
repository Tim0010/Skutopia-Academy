-- Create mentorship_sessions table
CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  topic TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_mentorship_sessions_mentor_id ON mentorship_sessions(mentor_id);
CREATE INDEX idx_mentorship_sessions_student_id ON mentorship_sessions(student_id);

-- Add RLS policies
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for mentorship_sessions - mentors and students can view their own sessions
CREATE POLICY "Users can view their own mentorship sessions" 
  ON mentorship_sessions FOR SELECT 
  USING (
    auth.uid() = student_id OR 
    auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id)
  );

-- Policy for students to book sessions
CREATE POLICY "Students can book mentorship sessions" 
  ON mentorship_sessions FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = student_id);

-- Policy for mentors to update their sessions
CREATE POLICY "Mentors can update their sessions" 
  ON mentorship_sessions FOR UPDATE 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id));
