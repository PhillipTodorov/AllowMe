'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Answers = {
  isOver66: 'yes' | 'no' | '';
  isUKResident: 'yes' | 'no' | '';
  hasSettledStatus: 'yes' | 'no' | '';
  hasConflictingBenefit: 'yes' | 'no' | '';
  needsCare: 'yes' | 'no' | '';
  hasPensionCredit: 'yes' | 'no' | '';
  referredBy: string;
};

interface Props {
  data: Partial<Answers>;
  onNext: (data: Answers) => void;
}

type IneligibleReason = 'age' | 'residency' | 'settlement' | 'benefit' | 'care' | null;

function YesNoQuestion({
  question,
  value,
  help,
  onChange,
}: {
  question: string;
  value: string;
  help?: string;
  onChange: (v: 'yes' | 'no') => void;
}) {
  const t = useTranslations('buttons');
  return (
    <div className="mb-6">
      <p className="font-medium text-slate-200 mb-1">{question}</p>
      {help && <p className="text-sm text-slate-400 mb-3">{help}</p>}
      <div className="flex gap-3">
        {(['yes', 'no'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            suppressHydrationWarning
            className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
              value === v
                ? 'border-blue-500 bg-blue-900/40 text-blue-300'
                : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-blue-500'
            }`}
          >
            {t(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Step1Eligibility({ data, onNext }: Props) {
  const t = useTranslations('eligibility');

  const [answers, setAnswers] = useState<Answers>({
    isOver66: data.isOver66 || '',
    isUKResident: data.isUKResident || '',
    hasSettledStatus: data.hasSettledStatus || '',
    hasConflictingBenefit: data.hasConflictingBenefit || '',
    needsCare: data.needsCare || '',
    hasPensionCredit: data.hasPensionCredit || '',
    referredBy: data.referredBy || '',
  });

  const ineligibleReason: IneligibleReason =
    answers.isOver66 === 'no' ? 'age' :
    answers.isUKResident === 'no' ? 'residency' :
    answers.hasSettledStatus === 'no' ? 'settlement' :
    answers.hasConflictingBenefit === 'yes' ? 'benefit' :
    answers.needsCare === 'no' ? 'care' : null;

  const allAnswered =
    answers.isOver66 !== '' &&
    answers.isUKResident !== '' &&
    answers.hasSettledStatus !== '' &&
    answers.hasConflictingBenefit !== '' &&
    answers.needsCare !== '' &&
    answers.hasPensionCredit !== '';

  const isEligible = allAnswered && ineligibleReason === null;

  const set = (key: keyof Answers) => (v: 'yes' | 'no') =>
    setAnswers((prev) => ({ ...prev, [key]: v }));

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      <YesNoQuestion question={t('ageQuestion')} value={answers.isOver66} onChange={set('isOver66')} />
      <YesNoQuestion question={t('residencyQuestion')} value={answers.isUKResident} onChange={set('isUKResident')} />
      <YesNoQuestion
        question={t('settlementQuestion')}
        help={t('settlementHelp')}
        value={answers.hasSettledStatus}
        onChange={set('hasSettledStatus')}
      />
      <YesNoQuestion question={t('benefitQuestion')} value={answers.hasConflictingBenefit} onChange={set('hasConflictingBenefit')} />
      <YesNoQuestion
        question={t('careQuestion')}
        help={t('careHelp')}
        value={answers.needsCare}
        onChange={set('needsCare')}
      />
      <YesNoQuestion
        question={t('pensionCreditQuestion')}
        help={t('pensionCreditHelp')}
        value={answers.hasPensionCredit}
        onChange={set('hasPensionCredit')}
      />

      <div className="mb-6">
        <label className="block font-medium text-slate-200 mb-1">{t('referredByLabel')}</label>
        <input
          type="text"
          value={answers.referredBy}
          onChange={(e) => setAnswers((prev) => ({ ...prev, referredBy: e.target.value }))}
          placeholder={t('referredByPlaceholder')}
          className="w-full max-w-sm bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {allAnswered && ineligibleReason && (
        <div className="mt-6 p-4 bg-amber-900/30 border border-amber-700 rounded-xl">
          <h3 className="font-semibold text-amber-300 mb-2">{t('ineligibleTitle')}</h3>
          <p className="text-amber-400 mb-2">{t(`ineligible${ineligibleReason.charAt(0).toUpperCase() + ineligibleReason.slice(1)}` as 'ineligibleAge')}</p>
          <p className="text-sm text-amber-500">{t('alternativeHelp')}</p>
        </div>
      )}

      {isEligible && (
        <button
          onClick={() => onNext(answers as Answers)}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {t('continue')}
        </button>
      )}
    </div>
  );
}
