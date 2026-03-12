'use client';

import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { daytimeSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof daytimeSchema>;

type CareKey = 'washing' | 'dressing' | 'eating' | 'mobility' | 'medication' | 'toilet' | 'supervision' | 'communication';

const CARE_ITEMS: CareKey[] = ['washing', 'dressing', 'eating', 'mobility', 'medication', 'toilet', 'supervision', 'communication'];

const defaultItem = { needsHelp: false, frequency: '', description: '' };

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

export default function Step5DaytimeCare({ data, onNext, onBack }: Props) {
  const t = useTranslations('daytime');
  const bt = useTranslations('buttons');

  const defaultValues: FormData = {
    washing: data.washing || defaultItem,
    dressing: data.dressing || defaultItem,
    eating: data.eating || defaultItem,
    mobility: data.mobility || defaultItem,
    medication: data.medication || defaultItem,
    toilet: data.toilet || defaultItem,
    supervision: data.supervision || defaultItem,
    communication: data.communication || defaultItem,
  };

  const { register, handleSubmit, watch, control } = useForm<FormData>({
    resolver: zodResolver(daytimeSchema),
    defaultValues,
  });

  const watched = watch();

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {CARE_ITEMS.map((key) => (
        <div key={key} className="mb-4 border border-slate-700 rounded-xl bg-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-medium text-slate-200">{t(key)}</span>
            <Controller
              control={control}
              name={`${key}.needsHelp`}
              render={({ field }) => (
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => field.onChange(v)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                        field.value === v
                          ? v
                            ? 'border-blue-500 bg-blue-900/40 text-blue-300'
                            : 'border-slate-500 bg-slate-700 text-slate-300'
                          : 'border-slate-600 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      {v ? bt('yes') : bt('no')}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {watched[key]?.needsHelp && (
            <div className="px-5 pb-5 border-t border-slate-700 pt-4 space-y-3 bg-blue-950/20">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('frequency')}</label>
                <input
                  {...register(`${key}.frequency`)}
                  className="w-full border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('frequencyPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('description')}</label>
                <textarea
                  {...register(`${key}.description`)}
                  className="w-full border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack} className="flex-1 border-2 border-slate-600 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
          {bt('back')}
        </button>
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
          {bt('continue')}
        </button>
      </div>
    </form>
  );
}
