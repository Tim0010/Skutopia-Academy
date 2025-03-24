const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyDatabaseChanges() {
  try {
    console.log('Starting database updates...');

    // Apply the user_learning_paths table creation SQL
    const tableSQL = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
    console.log('Applying database_setup.sql...');
    
    // Execute table creation SQL
    const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
      query: tableSQL
    });
    
    if (tableError) {
      console.error('Error applying table changes:', tableError);
    } else {
      console.log('Tables created successfully');
    }

    // Apply the database functions SQL
    const functionsSQL = fs.readFileSync(path.join(__dirname, 'database_functions.sql'), 'utf8');
    console.log('Applying database_functions.sql...');
    
    // Execute function creation SQL
    const { data: functionData, error: functionError } = await supabase.rpc('exec_sql', {
      query: functionsSQL
    });
    
    if (functionError) {
      console.error('Error applying function changes:', functionError);
    } else {
      console.log('Functions created successfully');
    }

    console.log('Database updates completed!');
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

applyDatabaseChanges(); 