-- Function to get course lesson counts and user progress for dashboard
CREATE OR REPLACE FUNCTION public.get_course_lesson_counts()
RETURNS TABLE (
    course_id UUID,
    total_lessons INTEGER,
    completed_lessons INTEGER,
    user_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH course_totals AS (
        SELECT 
            c.id AS course_id,
            COUNT(l.id) AS total_lessons
        FROM 
            public.courses c
            LEFT JOIN public.lessons l ON l.course_id = c.id
        GROUP BY 
            c.id
    ),
    user_progress AS (
        SELECT 
            lp.course_id,
            lp.user_id,
            COUNT(lp.id) AS completed_lessons
        FROM 
            public.lesson_progress lp
        WHERE 
            lp.is_completed = true
        GROUP BY 
            lp.course_id, lp.user_id
    )
    SELECT 
        ct.course_id,
        ct.total_lessons,
        COALESCE(up.completed_lessons, 0) AS completed_lessons,
        up.user_id
    FROM 
        course_totals ct
        LEFT JOIN user_progress up ON ct.course_id = up.course_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_lesson_counts() TO service_role; 