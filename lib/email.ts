import { ApplicationData } from './validations';

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

  const healthRows = h?.conditions.map((cond, i) =>
    `<tr><td colspan="2" style="padding:6px 0;"><strong>${i + 1}. ${cond.name}</strong>${cond.diagnosedDate ? ` (${cond.diagnosedDate})` : ''}<br><span style="color:#6b7280;">${cond.description}</span></td></tr>`
  ).join('') || '';
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
