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

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-8">{t('intro')}</p>

      {/* Needs night help */}
      <div className="mb-6 p-5 bg-white border border-gray-200 rounded-xl">
        <p className="font-medium text-gray-800 mb-3">{t('needsHelp')}</p>
        <Controller
          control={control}
          name="needsNightHelp"
          render={({ field }) => (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => field.onChange(v)}
                  className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
                    field.value === v
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {v ? bt('yes') : bt('no')}
                </button>
              ))}
            </div>
          )}
        />

        {needsNightHelp && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('frequency')}</label>
              <input
                {...register('frequency')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 3 nights a week"
              />
              {errors.frequency && <p className="text-sm text-red-600 mt-1">{errors.frequency.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
              <textarea
                {...register('description')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('descriptionPlaceholder')}
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Needs watcher */}
      <div className="mb-6 p-5 bg-white border border-gray-200 rounded-xl">
        <p className="font-medium text-gray-800 mb-3">{t('watcher')}</p>
        <Controller
          control={control}
          name="needsWatcher"
          render={({ field }) => (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => field.onChange(v)}
                  className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
                    field.value === v
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {v ? bt('yes') : bt('no')}
                </button>
              ))}
            </div>
          )}
        />

        {needsWatcher && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('watcherDescription')}</label>
            <textarea
              {...register('watcherDescription')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors">
          {bt('back')}
        </button>
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
          {bt('continue')}
        </button>
      </div>
    </form>
  );
}
