'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  data: {
    eligibility?: Record<string, string>;
    contact?: Record<string, string>;
    health?: { conditions: string[]; other: string };
  };
  onSubmit: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
}

function Section({ title, step, onEdit, children }: { title: string; step: number; onEdit: (s: number) => void; children: React.ReactNode }) {
  const t = useTranslations('review');
  return (
    <div className="mb-4 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-5 py-3 border-b border-slate-700">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <button onClick={() => onEdit(step)} className="text-blue-400 text-sm hover:underline">{t('edit')}</button>
      </div>
      <div className="px-5 py-4 text-sm space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-slate-500 min-w-[130px]">{label}:</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

const CONDITION_LABELS: Record<string, string> = {
  arthritis: 'Arthritis / Joint problems',
  dementia: 'Dementia / Memory problems',
  diabetes: 'Diabetes',
  heartCondition: 'Heart condition',
  stroke: 'Stroke / Neurological condition',
  copd: 'COPD / Breathing problems',
  parkinsons: "Parkinson's disease",
  cancer: 'Cancer',
  epilepsy: 'Epilepsy',
  mentalHealth: 'Mental health condition',
  visualImpairment: 'Visual impairment',
  hearingImpairment: 'Hearing impairment',
  mobilityProblems: 'Mobility problems',
  backSpine: 'Back / Spine problems',
  kidneyDisease: 'Kidney disease',
  highBloodPressure: 'High blood pressure',
};

export default function Step5Review({ data, onSubmit, onBack, onGoToStep, isSubmitting }: Props) {
  const t = useTranslations('review');
  const et = useTranslations('eligibility');
  const bt = useTranslations('buttons');
  const [accepted, setAccepted] = useState(false);

  const { eligibility, contact, health } = data;

  const yesNo = (v?: string) => v === 'yes' ? bt('yes') : v === 'no' ? bt('no') : '—';

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {eligibility && (
        <Section title={t('eligibilitySection')} step={1} onEdit={onGoToStep}>
          <Row label={et('ageQuestion')} value={yesNo(eligibility.isOver66)} />
          <Row label={et('residencyQuestion')} value={yesNo(eligibility.isUKResident)} />
          <Row label={et('settlementQuestion')} value={yesNo(eligibility.hasSettledStatus)} />
          <Row label={et('benefitQuestion')} value={yesNo(eligibility.hasConflictingBenefit)} />
          <Row label={et('careQuestion')} value={yesNo(eligibility.needsCare)} />
          <Row label={et('pensionCreditQuestion')} value={yesNo(eligibility.hasPensionCredit)} />
          {eligibility.referredBy && <Row label={et('referredByLabel')} value={eligibility.referredBy} />}
        </Section>
      )}

      {contact && (
        <Section title={t('contactSection')} step={3} onEdit={onGoToStep}>
          <Row label="Телефон" value={contact.phone} />
          {contact.email && <Row label="Имейл" value={contact.email} />}
        </Section>
      )}

      {health && (
        <Section title={t('healthSection')} step={2} onEdit={onGoToStep}>
          {health.conditions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {health.conditions.map((c) => (
                <span key={c} className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                  {CONDITION_LABELS[c] || c}
                </span>
              ))}
            </div>
          )}
          {health.other && <Row label="Other" value={health.other} />}
          {health.conditions.length === 0 && !health.other && (
            <span className="text-slate-500">No conditions listed</span>
          )}
        </Section>
      )}

      <div className="mt-6 p-4 bg-blue-950/40 border border-blue-800 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 accent-blue-500"
          />
          <span className="text-sm text-slate-300">{t('declaration')}</span>
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack} className="flex-1 border-2 border-slate-600 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
          {bt('back')}
        </button>
        <button
          onClick={onSubmit}
          disabled={!accepted || isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </div>
  );
}
