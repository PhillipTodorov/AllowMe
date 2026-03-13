'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

const CONDITIONS = [
  'highBloodPressure',
  'arthritis',
  'backSpine',
  'hearingImpairment',
  'visualImpairment',
  'mentalHealth',
  'mobilityProblems',
  'diabetes',
  'copd',
  'epilepsy',
  'kidneyDisease',
  'heartCondition',
  'stroke',
  'parkinsons',
  'cancer',
  'dementia',
] as const;

type ConditionKey = typeof CONDITIONS[number];

interface HealthData {
  conditions: string[];
  other: string;
}

interface Props {
  data: HealthData;
  onNext: (data: HealthData) => void;
  onBack: () => void;
}

const CONDITION_LABELS: Record<ConditionKey, string> = {
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

const CONDITION_LABELS_BG: Record<ConditionKey, string> = {
  arthritis: 'Артрит / Ставни проблеми',
  dementia: 'Деменция / Проблеми с паметта',
  diabetes: 'Диабет',
  heartCondition: 'Сърдечно заболяване',
  stroke: 'Инсулт / Неврологично заболяване',
  copd: 'ХОББ / Проблеми с дишането',
  parkinsons: 'Болест на Паркинсон',
  cancer: 'Рак',
  epilepsy: 'Епилепсия',
  mentalHealth: 'Проблеми с психичното здраве',
  visualImpairment: 'Зрително увреждане',
  hearingImpairment: 'Слухово увреждане',
  mobilityProblems: 'Проблеми с придвижването',
  backSpine: 'Проблеми с гърба / гръбначния стълб',
  kidneyDisease: 'Бъбречно заболяване',
  highBloodPressure: 'Високо кръвно налягане',
};

export default function Step4HealthConditions({ data, onNext, onBack }: Props) {
  const t = useTranslations('health');
  const bt = useTranslations('buttons');
  const locale = useLocale();
  const labels = locale === 'bg' ? CONDITION_LABELS_BG : CONDITION_LABELS;

  const [selected, setSelected] = useState<Set<string>>(new Set(data.conditions || []));
  const [other, setOther] = useState(data.other || '');
  const [error, setError] = useState('');

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setError('');
  };

  const handleNext = () => {
    if (selected.size === 0 && !other.trim()) {
      setError('Please select at least one condition or describe your health situation below.');
      return;
    }
    onNext({ conditions: Array.from(selected), other });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-6">{t('checklistIntro')}</p>

      <div className="grid grid-cols-1 gap-2 mb-6">
        {CONDITIONS.map((key) => {
          const active = selected.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                active
                  ? 'border-blue-500 bg-blue-900/30 text-blue-200'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                active ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
              }`}>
                {active && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="font-medium">{labels[key]}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('otherLabel')}</label>
        <input
          type="text"
          value={other}
          onChange={(e) => { setOther(e.target.value); setError(''); }}
          placeholder={t('otherPlaceholder')}
          className="w-full border border-slate-600 bg-slate-800 text-white placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onBack} className="flex-1 border-2 border-slate-600 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
          {bt('back')}
        </button>
        <button type="button" onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
          {bt('continue')}
        </button>
      </div>
    </div>
  );
}
