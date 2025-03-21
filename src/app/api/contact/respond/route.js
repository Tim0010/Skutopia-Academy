import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Get current user session to verify admin access
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' }, 
        { status: 401 }
      );
    }
    
    // Verify user is admin
    const user = session.user;
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' }, 
        { status: 403 }
      );
    }
    
    // Parse request body
    const { 
      messageId, 
      recipientEmail, 
      recipientName, 
      subject, 
      responseText 
    } = await request.json();
    
    // Validate required fields
    if (!messageId || !recipientEmail || !responseText) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@skutopia-academy.com';
    const fromName = process.env.FROM_NAME || 'Skutopia Academy';
    
    // Check if SMTP is configured
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.warn('SMTP not configured. Email would have been sent to:', recipientEmail);
      
      // For development environment, just log and update database without sending
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ 
          status: 'responded',
          admin_response: responseText,
          admin_response_date: new Date().toISOString(),
          admin_user_id: user.id
        })
        .eq('id', messageId);
      
      if (updateError) {
        console.error('Error updating message:', updateError);
        return NextResponse.json(
          { error: 'Failed to update message status' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Response recorded (email not sent - SMTP not configured)'
      });
    }
    
    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    
    // Prepare email content
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientEmail,
      subject: subject || 'Re: Your message to Skutopia Academy',
      replyTo: fromEmail,
      text: responseText,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-skutopia-logo-url.com/logo.png" alt="Skutopia Academy" style="max-width: 200px;" />
          </div>
          <p>Dear ${recipientName || 'Valued Student'},</p>
          <div style="padding: 20px; background-color: #f5f5f5; border-left: 4px solid #3f51b5; margin: 15px 0;">
            ${responseText.replace(/\n/g, '<br/>')}
          </div>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br/>Skutopia Academy Team</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was sent in response to your inquiry at Skutopia Academy.</p>
          </div>
        </div>
      `,
    };
    
    try {
      // Send email
      await transporter.sendMail(mailOptions);
      
      // Update message status in database
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ 
          status: 'responded',
          admin_response: responseText,
          admin_response_date: new Date().toISOString(),
          admin_user_id: user.id
        })
        .eq('id', messageId);
      
      if (updateError) {
        console.error('Error updating message:', updateError);
        return NextResponse.json(
          { 
            error: 'Email sent but failed to update message status',
            details: updateError.message 
          }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Response sent successfully'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: emailError.message 
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in respond API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 