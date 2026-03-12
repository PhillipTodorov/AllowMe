'use client';

import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nighttimeSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof nighttimeSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const yesNoBtn = (active: boolean) =>
  `px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
    active
      ? 'border-blue-500 bg-blue-900/40 text-blue-300'
      : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-blue-500'
  }`;

export default function Step6NighttimeCare({ data, onNext, onBack }: Props) {
  const t = useTranslations('nighttime');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(nighttimeSchema),
    defaultValues: {
      needsNightHelp: data.needsNightHelp ?? false,
      frequency: data.frequency || '',
      description: data.description || '',
      needsWatcher: data.needsWatcher ?? false,
      watcherDescription: data.watcherDescription || '',
    },
  });

  const needsNightHelp = watch('needsNightHelp');
  const needsWatcher = watch('needsWatcher');

  const inputCls = 'w-full border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {/* Needs night help */}
      <div className="mb-6 p-5 bg-slate-800 border border-slate-700 rounded-xl">
        <p className="font-medium text-slate-200 mb-3">{t('needsHelp')}</p>
        <Controller
          control={control}
          name="needsNightHelp"
          render={({ field }) => (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button key={String(v)} type="button" onClick={() => field.onChange(v)} className={yesNoBtn(field.value === v)}>
                  {v ? bt('yes') : bt('no')}
                </button>
              ))}
            </div>
          )}
        />

        {needsNightHelp && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('frequency')}</label>
              <input {...register('frequency')} className={inputCls} placeholder="e.g. 3 nights a week" />
              {errors.frequency && <p className="text-sm text-red-400 mt-1">{errors.frequency.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('description')}</label>
              <textarea {...register('description')} className={`${inputCls} min-h-[100px] resize-y`} placeholder={t('descriptionPlaceholder')} />
              {errors.description && <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Needs watcher */}
      <div className="mb-6 p-5 bg-slate-800 border border-slate-700 rounded-xl">
        <p className="font-medium text-slate-200 mb-3">{t('watcher')}</p>
        <Controller
          control={control}
          name="needsWatcher"
          render={({ field }) => (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button key={String(v)} type="button" onClick={() => field.onChange(v)} className={yesNoBtn(field.value === v)}>
                  {v ? bt('yes') : bt('no')}
                </button>
              ))}
            </div>
          )}
        />

        {needsWatcher && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('watcherDescription')}</label>
            <textarea {...register('watcherDescription')} className={`${inputCls} min-h-[80px] resize-y`} />
          </div>
        )}
      </div>

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
