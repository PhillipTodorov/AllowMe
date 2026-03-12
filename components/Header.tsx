'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const otherLocale = locale === 'en' ? 'bg' : 'en';
  const flag = locale === 'en' ? '🇬🇧' : '🇧🇬';
  const otherFlag = locale === 'en' ? '🇧🇬' : '🇬🇧';

  // Build the same path but with the other locale
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="bg-slate-900 border-b border-slate-700 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-semibold text-base md:text-lg hover:text-blue-200 transition-colors">
          <span className="mr-2">{flag}</span>
          {t('title')}
        </Link>
        <Link
          href={switchPath}
          className="text-sm bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5"
        >
          <span>{otherFlag}</span>
          <span>{t('switchLang')}</span>
        </Link>
      </div>
    </header>
  );
}
