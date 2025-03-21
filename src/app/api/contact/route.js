import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Admin email addresses that should receive notifications
const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }
    
    // Create Supabase client with proper cookie store
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Store the message in the database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          province: body.province || null,
          school: body.school || null,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error saving contact message:', error);
      return NextResponse.json(
        { error: 'Failed to save your message. Please try again.' },
        { status: 500 }
      );
    }

    // Skip email sending if SMTP is not configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: parseInt(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        
        // Send auto-response email to the user
        await transporter.sendMail({
          from: `"Skutopia Academy" <${smtpUser}>`,
          to: `"${body.name}" <${body.email}>`,
          subject: 'Thank you for contacting Skutopia Academy',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hello ${body.name},</h2>
              <p>Thank you for contacting Skutopia Academy. We have received your message and our team will get back to you within 24-48 hours.</p>
              <p>Here's a copy of your message:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <strong>Subject:</strong> ${body.subject}<br><br>
                ${body.message.replace(/\n/g, '<br>')}
              </div>
              <p>If you have any urgent concerns, you can reach us at:</p>
              <ul>
                <li>Phone: +260 97X XXX XXX</li>
                <li>Email: zambia@skutopia.com</li>
              </ul>
              <p>Best regards,<br>The Skutopia Academy Team</p>
            </div>
          `,
        });

        // Send notification to admin(s)
        if (ADMIN_EMAILS.length > 0) {
          await transporter.sendMail({
            from: `"Skutopia Contact Form" <${smtpUser}>`,
            to: ADMIN_EMAILS.join(', '),
            subject: `New Contact Form Submission: ${body.subject}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Contact Form Submission</h2>
                <p>A new message has been received through the contact form:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Province:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.province || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>School:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.school || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px;"><strong>Message:</strong></td>
                    <td style="padding: 10px;">${body.message.replace(/\n/g, '<br>')}</td>
                  </tr>
                </table>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/contacts" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    View in Admin Dashboard
                  </a>
                </p>
              </div>
            `,
          });
        }
      } catch (emailError) {
        // Log email error but don't fail the request - message is already saved in DB
        console.error('Error sending notification emails:', emailError);
      }
    } else {
      console.log('SMTP not configured - skipping email notifications');
    }

    return NextResponse.json(
      { message: 'Your message has been received successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 