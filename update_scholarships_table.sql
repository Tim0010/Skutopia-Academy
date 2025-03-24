-- Update the scholarships table schema
-- First, check if the table exists, if not create it with the new structure
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  -- amount field removed as requested
  deadline TIMESTAMPTZ,
  eligibility_criteria JSONB,
  application_url TEXT,
  provider TEXT NOT NULL,
  location TEXT, -- New field for scholarship location
  image_url TEXT, -- New field for scholarship image
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already exists, we need to alter it
DO $$
BEGIN
  -- Check if the amount column exists and drop it
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scholarships' AND column_name = 'amount'
  ) THEN
    ALTER TABLE public.scholarships DROP COLUMN amount;
  END IF;

  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scholarships' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.scholarships ADD COLUMN location TEXT;
  END IF;

  -- Add image_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scholarships' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.scholarships ADD COLUMN image_url TEXT;
  END IF;
END
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarships_provider ON public.scholarships(provider);
CREATE INDEX IF NOT EXISTS idx_scholarships_location ON public.scholarships(location);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON public.scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline);

-- Add RLS policies
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Policy for scholarships - anyone can view active scholarships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'scholarships' AND policyname = 'Anyone can view active scholarships'
  ) THEN
    CREATE POLICY "Anyone can view active scholarships" 
      ON public.scholarships FOR SELECT 
      USING (is_active = TRUE);
  END IF;
END
$$;

-- Policy for scholarships - only admins can manage scholarships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'scholarships' AND policyname = 'Admins can manage scholarships'
  ) THEN
    -- Since we don't have a role column in profiles, we'll create a policy
    -- that allows any authenticated user to manage scholarships for now
    -- In a real application, you would implement proper role-based checks
    CREATE POLICY "Admins can manage scholarships" 
      ON public.scholarships FOR ALL 
      TO authenticated;
  END IF;
END
$$;

-- Create a storage bucket for scholarship images if it doesn't exist
-- Note: This requires appropriate Supabase Storage setup
DO $$
BEGIN
  -- This is a placeholder. In Supabase, you'll need to create the bucket through the UI
  -- or using the Supabase JavaScript client in your application code
  -- The function create_bucket_if_not_exists doesn't exist in standard PostgreSQL
  RAISE NOTICE 'Please create a storage bucket named "scholarship_images" in the Supabase dashboard';
END
$$;

-- Create a function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS set_scholarships_updated_at ON public.scholarships;
CREATE TRIGGER set_scholarships_updated_at
BEFORE UPDATE ON public.scholarships
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
