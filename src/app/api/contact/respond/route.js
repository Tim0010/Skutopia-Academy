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

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const { messageId, recipientEmail, recipientName, subject, responseText } = body;

    // Send email response
    await transporter.sendMail({
      from: `"Skutopia Academy" <${process.env.SMTP_USER}>`,
      to: `"${recipientName}" <${recipientEmail}>`,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${recipientName},</h2>
          <p>Thank you for contacting Skutopia Academy. Here is our response to your inquiry:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${responseText.replace(/\n/g, '<br>')}
          </div>
          <p>If you have any further questions, please don't hesitate to contact us again.</p>
          <p>Best regards,<br>The Skutopia Academy Team</p>
        </div>
      `,
    });

    // Update message status in database
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ 
        status: 'responded',
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (updateError) {
      throw new Error('Failed to update message status');
    }

    return NextResponse.json({ message: 'Response sent successfully' });
  } catch (error) {
    console.error('Error sending response:', error);
    return NextResponse.json(
      { error: 'Failed to send response' },
      { status: 500 }
    );
  }
} 