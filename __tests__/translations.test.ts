import en from '../messages/en.json';
import bg from '../messages/bg.json';

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, val]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return typeof val === 'object' && val !== null
      ? getKeys(val as Record<string, unknown>, full)
      : [full];
  });
}

describe('Translations', () => {
  const enKeys = getKeys(en);
  const bgKeys = getKeys(bg);

  test('every English key exists in Bulgarian', () => {
    const missing = enKeys.filter((k) => !bgKeys.includes(k));
    expect(missing).toEqual([]);
  });

  test('every Bulgarian key exists in English', () => {
    const missing = bgKeys.filter((k) => !enKeys.includes(k));
    expect(missing).toEqual([]);
  });

  test('no translation values are empty strings', () => {
    const emptyEn = enKeys.filter((k) => {
      const parts = k.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = en;
      for (const p of parts) val = val[p];
      return val === '';
    });
    const emptyBg = bgKeys.filter((k) => {
      const parts = k.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = bg;
      for (const p of parts) val = val[p];
      return val === '';
    });
    expect(emptyEn).toEqual([]);
    expect(emptyBg).toEqual([]);
  });
});
