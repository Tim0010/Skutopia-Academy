import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Admin email addresses that should receive notifications
const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    // Store the message in the database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          province: body.province,
          school: body.school,
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

    // Send auto-response email to the user
    await transporter.sendMail({
      from: `"Skutopia Academy" <${process.env.SMTP_USER}>`,
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
        from: `"Skutopia Contact Form" <${process.env.SMTP_USER}>`,
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
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/contacts" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </p>
          </div>
        `,
      });
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