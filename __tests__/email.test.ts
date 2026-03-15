import { buildConfirmationEmailHtml, buildEmailHtml } from '../lib/email';

describe('buildConfirmationEmailHtml', () => {
  test('renders English confirmation email', () => {
    const html = buildConfirmationEmailHtml('en');
    expect(html).toContain('We Have Received Your Enquiry');
    expect(html).toContain('Attendance Allowance');
    expect(html).toContain('The AllowMe Team');
  });

  test('renders Bulgarian confirmation email', () => {
    const html = buildConfirmationEmailHtml('bg');
    expect(html).toContain('Получихме Вашето Запитване');
    expect(html).toContain('Здравни Добавки');
    expect(html).toContain('Екипът на AllowMe');
  });

  test('does not include contact us line', () => {
    const en = buildConfirmationEmailHtml('en');
    const bg = buildConfirmationEmailHtml('bg');
    expect(en).not.toContain('helpline');
    expect(bg).not.toContain('helpline');
  });
});

describe('buildEmailHtml', () => {
  const baseData = {
    contact: { phone: '07700900000', email: 'test@example.com' },
    health: { conditions: ['diabetes', 'heartCondition'], other: '' },
    eligibility: { referredBy: 'John Smith' },
    locale: 'en',
    reference: 'REF-001',
  };

  test('includes contact details', () => {
    const html = buildEmailHtml(baseData);
    expect(html).toContain('07700900000');
    expect(html).toContain('test@example.com');
  });

  test('renders health conditions by label', () => {
    const html = buildEmailHtml(baseData);
    expect(html).toContain('Diabetes');
    expect(html).toContain('Heart condition');
  });

  test('includes referral if present', () => {
    const html = buildEmailHtml(baseData);
    expect(html).toContain('John Smith');
  });

  test('omits referral section when not provided', () => {
    const html = buildEmailHtml({ ...baseData, eligibility: {} });
    expect(html).not.toContain('Referred by');
  });

  test('handles no health conditions gracefully', () => {
    const html = buildEmailHtml({ ...baseData, health: { conditions: [], other: '' } });
    expect(html).toContain('None listed');
  });

  test('includes other health condition when set', () => {
    const html = buildEmailHtml({ ...baseData, health: { conditions: [], other: 'Fibromyalgia' } });
    expect(html).toContain('Fibromyalgia');
  });
});
