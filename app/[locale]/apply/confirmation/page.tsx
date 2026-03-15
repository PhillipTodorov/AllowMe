'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

function ConfirmationContent() {
  const t = useTranslations('confirmation');

  return (
    <div className="text-center py-8">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-900/40 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">{t('title')}</h1>
      <p className="text-slate-400 mb-10 max-w-md mx-auto">{t('thankYou')}</p>

      {/* Next steps */}
      <div className="text-left max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">{t('nextSteps')}</h2>
        <ol className="space-y-3">
          {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-slate-400 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
