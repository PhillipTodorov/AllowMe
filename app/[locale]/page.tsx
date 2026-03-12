'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const t = useTranslations('home');
  const router = useRouter();

  const handleLanguageSelect = (locale: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
    router.push(`/${locale}/apply`);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {t('headline')}
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-md">
        {t('subheadline')}
      </p>

      <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide font-medium">
        {t('chooseLanguage')}
      </p>

      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={() => handleLanguageSelect('en')}
          className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all w-44"
        >
          <span className="text-6xl">🇬🇧</span>
          <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
            {t('english')}
          </span>
        </button>

        <button
          onClick={() => handleLanguageSelect('bg')}
          className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all w-44"
        >
          <span className="text-6xl">🇧🇬</span>
          <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
            {t('bulgarian')}
          </span>
        </button>
      </div>
    </div>
  );
}
