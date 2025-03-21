import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, adminKey } = await request.json();
    
    // Check if the admin key is valid (this should be a strong secret)
    // In a real application, you'd use an environment variable for this
    const expectedAdminKey = process.env.SETUP_ADMIN_KEY || 'skutopia-setup-admin-2023';
    
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: 'Invalid admin setup key' },
        { status: 401 }
      );
    }

    // Validate email and password
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Please provide a valid email and password (minimum 6 characters)' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Create admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          is_setup_admin: true,
          setup_date: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create admin user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully. Please check your email to confirm your account.',
      userId: data.user.id
    });
  } catch (error) {
    console.error('Error in admin setup:', error);
    return NextResponse.json(
      { error: 'Server error creating admin user' },
      { status: 500 }
    );
  }
} 