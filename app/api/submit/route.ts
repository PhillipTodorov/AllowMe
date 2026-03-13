import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildEmailHtml, buildConfirmationEmailHtml } from '@/lib/email';

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

    const phone = body.contact?.phone || 'Unknown';
    const referredBy = body.eligibility?.referredBy;

    const html = buildEmailHtml({ ...body, reference });

    const { error } = await resend.emails.send({
      from: 'Attendance Allowance App <onboarding@resend.dev>',
      to: toEmail,
      subject: referredBy
        ? `New Enquiry: ${phone} · Ref: ${referredBy} [${reference}]`
        : `New Enquiry: ${phone} [${reference}]`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    const userEmail = body.contact?.email;
    if (userEmail) {
      await resend.emails.send({
        from: 'Attendance Allowance App <onboarding@resend.dev>',
        to: userEmail,
        subject: body.locale === 'bg' ? 'Получихме Вашето Запитване' : 'We Have Received Your Enquiry',
        html: buildConfirmationEmailHtml(body.locale),
      });
    }

    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
