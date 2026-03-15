import { ApplicationData } from './validations';

export function buildConfirmationEmailHtml(locale?: string) {
  const isBg = locale === 'bg';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;">
  <div style="background:#1d4ed8;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="margin:0;font-size:20px;">${isBg ? 'Получихме Вашето Запитване' : 'We Have Received Your Enquiry'}</h1>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <p style="margin:0 0 16px;">${isBg
      ? 'Благодарим ви за изпратеното запитване относно Здравни Добавки.'
      : 'Thank you for submitting your enquiry regarding Attendance Allowance.'}</p>
    <p style="margin:0 0 16px;">${isBg
      ? 'Един от нашите консултанти ще прегледа информацията ви и ще се свърже с вас по телефона в рамките на 2 работни дни.'
      : 'One of our advisors will review your details and call you on the number you provided within 2 working days.'}</p>
    <p style="margin:0;">${isBg ? 'С уважение,<br>Екипът на AllowMe' : 'Kind regards,<br>The AllowMe Team'}</p>
  </div>
  <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
    ${isBg
      ? 'Това е автоматично потвърждение. Моля, не отговаряйте на този имейл.'
      : 'This is an automated confirmation. Please do not reply to this email.'}
  </p>
</body>
</html>
  `.trim();
}

function row(label: string, value?: string | null) {
  if (!value) return '';
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:4px 0;color:#111827;">${value}</td></tr>`;
}

function section(title: string, content: string) {
  return `
    <h3 style="font-size:16px;font-weight:600;color:#1d4ed8;border-bottom:2px solid #dbeafe;padding-bottom:6px;margin:24px 0 12px;">${title}</h3>
    <table style="border-collapse:collapse;width:100%;">${content}</table>
  `;
}

export function buildEmailHtml(data: Partial<ApplicationData> & { locale?: string; reference?: string }) {
  const p = data.personal;
  const c = data.contact;
  const h = data.health;
  const day = data.daytime;
  const night = data.nighttime;
  const meds = data.medications;
  const profs = data.professionals;

  const personalSection = p ? section('Personal Details', `
    ${row('Name', `${p.firstName} ${p.lastName}`)}
    ${row('Date of Birth', `${p.dobDay}/${p.dobMonth}/${p.dobYear}`)}
    ${row('NI Number', p.niNumber)}
    ${row('Address', [p.address1, p.address2, p.town, p.postcode].filter(Boolean).join(', '))}
  `) : '';

  const contactSection = c ? section('Contact Details', `
    ${row('Phone', c.phone)}
    ${row('Email', c.email)}
  `) : '';

  const referredBy = (data.eligibility as Record<string, string> | undefined)?.referredBy;
  const referralSection = referredBy ? section('Referral', row('Referred by', referredBy)) : '';

  const CONDITION_LABELS: Record<string, string> = {
    highBloodPressure: 'High blood pressure', arthritis: 'Arthritis / Joint problems',
    backSpine: 'Back / Spine problems', hearingImpairment: 'Hearing impairment',
    visualImpairment: 'Visual impairment', mentalHealth: 'Mental health condition',
    mobilityProblems: 'Mobility problems', diabetes: 'Diabetes',
    copd: 'COPD / Breathing problems', epilepsy: 'Epilepsy',
    kidneyDisease: 'Kidney disease', heartCondition: 'Heart condition',
    stroke: 'Stroke / Neurological condition', parkinsons: "Parkinson's disease",
    cancer: 'Cancer', dementia: 'Dementia / Memory problems',
  };
  const healthRows = h?.conditions?.length
    ? h.conditions.map((key, i) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${i + 1}.</td><td style="padding:4px 0;">${CONDITION_LABELS[key] || key}</td></tr>`
      ).join('') + (h.other ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Other</td><td style="padding:4px 0;">${h.other}</td></tr>` : '')
    : (h?.other ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Other</td><td style="padding:4px 0;">${h.other}</td></tr>` : '<tr><td>None listed</td></tr>');
  const healthSection = h ? section('Health Conditions', healthRows) : '';

  const daytimeRows = day
    ? Object.entries(day)
        .filter(([, v]) => v.needsHelp)
        .map(([key, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;text-transform:capitalize;">${key}</td><td style="padding:4px 0;">${v.frequency ? `${v.frequency} — ` : ''}${v.description || 'Yes'}</td></tr>`)
        .join('')
    : '';
  const daytimeSection = day ? section('Daytime Care Needs', daytimeRows || '<tr><td>None indicated</td></tr>') : '';

  const nighttimeSection = night ? section('Nighttime Care Needs', `
    ${row('Needs night help', night.needsNightHelp ? 'Yes' : 'No')}
    ${night.needsNightHelp ? row('Frequency', night.frequency) : ''}
    ${night.needsNightHelp ? row('Description', night.description) : ''}
    ${row('Needs overnight watcher', night.needsWatcher ? 'Yes' : 'No')}
    ${night.needsWatcher ? row('Watcher reason', night.watcherDescription) : ''}
  `) : '';

  const medRows = meds?.medications.map((m, i) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${i + 1}. ${m.name}</td><td style="padding:4px 0;">${m.dosage}${m.prescribedFor ? ` (for ${m.prescribedFor})` : ''}</td></tr>`
  ).join('') || '<tr><td>None listed</td></tr>';
  const medicationsSection = meds ? section('Medications & Treatments', medRows) : '';

  const profRows = profs?.professionals.map((p, i) =>
    `<tr><td colspan="2" style="padding:6px 0;"><strong>${i + 1}. ${p.name}</strong> — ${p.role}${p.practice ? `, ${p.practice}` : ''}${p.address ? `<br><span style="color:#6b7280;">${p.address}</span>` : ''}${p.treatedFor ? `<br><span style="color:#6b7280;">Treating for: ${p.treatedFor}</span>` : ''}</td></tr>`
  ).join('') || '';
  const professionalsSection = profs ? section('Healthcare Professionals', profRows) : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
  <div style="background:#1d4ed8;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h1 style="margin:0;font-size:20px;">New Attendance Allowance Application</h1>
    <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Reference: ${data.reference || 'N/A'} · Language: ${data.locale === 'bg' ? 'Bulgarian' : 'English'}</p>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    ${referralSection}
    ${personalSection}
    ${contactSection}
    ${healthSection}
    ${daytimeSection}
    ${nighttimeSection}
    ${medicationsSection}
    ${professionalsSection}
  </div>
  <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
    This application was submitted via the Attendance Allowance online form.
  </p>
</body>
</html>
  `.trim();
}
