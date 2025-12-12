import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, sessionType, preferredDate, location, budget, referralSource, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Format email content
    const emailSubject = `New Contact Form Submission from ${name}`;
    const emailBody = `
New contact form submission from Photos by Zee website:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Session Type: ${sessionType || 'Not specified'}
Preferred Date: ${preferredDate || 'Not specified'}
Location: ${location || 'Not specified'}
Budget: ${budget || 'Not specified'}
Referral Source: ${referralSource || 'Not specified'}

Message:
${message || 'No message provided'}

---
This email was sent from the Photos by Zee contact form.
    `.trim();

    // Send email using nodemailer with Gmail SMTP
    // Note: You'll need to set up Gmail App Password in your .env file
    // See instructions in the README or set these environment variables:
    // GMAIL_USER=your-email@gmail.com
    // GMAIL_APP_PASSWORD=your-app-password
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'zeecox13@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD,
      },
    });

    // If no email credentials are configured, log and return success (for development)
    if (!process.env.GMAIL_APP_PASSWORD && !process.env.GMAIL_PASSWORD) {
      console.log('Email not configured. Form submission:', {
        to: 'zeecox13@gmail.com',
        subject: emailSubject,
        body: emailBody,
      });
      console.log('To enable email sending, set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file');
      
      return NextResponse.json(
        { success: true, message: 'Thank you for your message! I\'ll get back to you soon.' },
        { status: 200 }
      );
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'zeecox13@gmail.com',
      to: 'zeecox13@gmail.com',
      replyTo: email,
      subject: emailSubject,
      text: emailBody,
    });

    return NextResponse.json(
      { success: true, message: 'Thank you for your message! I\'ll get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

