import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildEmailHtml } from '@/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AA-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = generateReference();

    const toEmail = process.env.TO_EMAIL;
    if (!toEmail) {
      return NextResponse.json({ error: 'Server misconfiguration: TO_EMAIL not set' }, { status: 500 });
    }

    const applicantName = body.personal
      ? `${body.personal.firstName} ${body.personal.lastName}`
      : 'Unknown Applicant';

    const html = buildEmailHtml({ ...body, reference });

    const { error } = await resend.emails.send({
      from: 'Attendance Allowance App <noreply@allowme.app>',
      to: toEmail,
      subject: `New Application: ${applicantName} [${reference}]`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
