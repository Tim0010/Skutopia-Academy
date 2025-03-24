-- Test script to add sample notifications
-- Replace 'YOUR_USER_ID' with the actual user ID you want to test with

-- Add some test notifications for the user
INSERT INTO simple_notifications (user_id, title, message, type, is_read, created_at)
VALUES 
('YOUR_USER_ID', 'Welcome to Skutopia Academy', 'Thank you for joining our platform. Explore our courses and mentorship opportunities.', 'info', false, NOW()),
('YOUR_USER_ID', 'New Exam Papers Available', 'We''ve added new past papers for Mathematics Grade 12. Check them out now!', 'success', false, NOW()),
('YOUR_USER_ID', 'Mentorship Session Confirmed', 'Your session with John Smith on April 2, 2025 at 15:00 has been confirmed.', 'success', false, NOW()),
('YOUR_USER_ID', 'Action Required: Complete Profile', 'Please complete your profile to get personalized recommendations.', 'warning', false, NOW());

-- You can run this SQL in the Supabase SQL Editor or via any SQL client connected to your database
