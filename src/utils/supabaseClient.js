import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkdbcpyrtqkihaeuobxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZGJjcHlydHFraWhhZXVvYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDcxMDUsImV4cCI6MjA1Nzc4MzEwNX0.S07gU6X40bA3VKCknyoM38Hbbe0aQCn5YqivXCXhCgU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 