-- Create a simplified notifications table without complex relationships
CREATE TABLE simple_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_simple_notifications_user_id ON simple_notifications(user_id);
CREATE INDEX idx_simple_notifications_is_read ON simple_notifications(is_read);

-- Add RLS policies
ALTER TABLE simple_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for notifications - users can only view their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON simple_notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for notifications - only authenticated users can mark their notifications as read
CREATE POLICY "Users can update their own notifications" 
  ON simple_notifications FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for notifications - any authenticated user can create notifications
CREATE POLICY "Users can insert notifications" 
  ON simple_notifications FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
