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
INSERT INTO public.lessons (id, unit_id, title, content_type, content, sequence_number, video_url)
VALUES
  -- HTML Unit Lessons
  ('11aa1111-11aa-11aa-11aa-11aa11aa11aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'HTML Document Structure', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Document Structure"},{"type":"paragraph","text":"In this lesson, you will learn about the basic structure of an HTML document including DOCTYPE, html, head, and body tags."},{"type":"header-two","text":"The DOCTYPE Declaration"},{"type":"paragraph","text":"Every HTML document starts with a DOCTYPE declaration."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  ('22aa2222-22aa-22aa-22aa-22aa22aa22aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'HTML Text Elements', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Text Elements"},{"type":"paragraph","text":"This lesson covers basic text formatting elements in HTML."},{"type":"header-two","text":"Headings"},{"type":"paragraph","text":"HTML has six levels of headings, from h1 (most important) to h6 (least important)."}]}', 
   2, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  ('33aa3333-33aa-33aa-33aa-33aa33aa33aa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'HTML Links and Images', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"HTML Links and Images"},{"type":"paragraph","text":"Learn how to add links and images to your web pages."},{"type":"header-two","text":"Links"},{"type":"paragraph","text":"Links are created using the a tag."}]}', 
   3, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- CSS Unit Lessons
  ('44bb4444-44bb-44bb-44bb-44bb44bb44bb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CSS Selectors', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"CSS Selectors"},{"type":"paragraph","text":"Learn how to select HTML elements to apply styles."},{"type":"header-two","text":"Element Selectors"},{"type":"paragraph","text":"The most basic selector is the element selector."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- JavaScript Unit Lessons
  ('55cc5555-55cc-55cc-55cc-55cc55cc55cc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'JavaScript Variables', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"JavaScript Variables"},{"type":"paragraph","text":"Learn about variables in JavaScript."},{"type":"header-two","text":"Declaring Variables"},{"type":"paragraph","text":"Variables can be declared using let, const, or var."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Python Unit Lessons
  ('66dd6666-66dd-66dd-66dd-66dd66dd66dd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Python Basics', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Python Basics"},{"type":"paragraph","text":"Introduction to Python programming language."},{"type":"header-two","text":"Variables and Data Types"},{"type":"paragraph","text":"Python has several built-in data types."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Data Analysis Unit Lessons
  ('77ee7777-77ee-77ee-77ee-77ee77ee77ee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Data Analysis with Pandas', 'rich_text', 
   '{"blocks":[{"type":"header-one","text":"Data Analysis with Pandas"},{"type":"paragraph","text":"Learn how to analyze data using the Pandas library."}]}', 
   1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  -- Data Visualization Unit Lessons
  ('88ff8888-88ff-88ff-88ff-88ff88ff88ff', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Data Visualization', 'rich_text', 
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

-- Create quizzes for some lessons
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit INTEGER, -- in seconds
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

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

-- Create lesson_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_position VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, lesson_id)
);

-- Create user_bookmarks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, course_id)
);

-- Create sample mentor for testing
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  expertise TEXT[],
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.mentors (id, is_active, bio, expertise, experience_years, hourly_rate, rating, is_verified)
VALUES
  ('abcdef12-3456-7890-abcd-ef1234567890', true, 'Experienced web development instructor with a passion for teaching beginners.', ARRAY['HTML', 'CSS', 'JavaScript'], 5, 45.00, 4.8, true); 