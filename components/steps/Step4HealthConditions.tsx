'use client';

import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { healthSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof healthSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

export default function Step4HealthConditions({ data, onNext, onBack }: Props) {
  const t = useTranslations('health');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(healthSchema),
    defaultValues: data?.conditions?.length ? data : { conditions: [{ name: '', diagnosedDate: '', description: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'conditions' });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-8">{t('intro')}</p>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Condition {index + 1}</h3>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm hover:text-red-700">
                {t('removeCondition')}
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('conditionName')}</label>
            <input
              {...register(`conditions.${index}.name`)}
              className={inputClass(!!errors.conditions?.[index]?.name)}
              placeholder={t('conditionNamePlaceholder')}
            />
            {errors.conditions?.[index]?.name && (
              <p className="text-sm text-red-600 mt-1">{errors.conditions[index]?.name?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('diagnosedDate')}</label>
            <input
              {...register(`conditions.${index}.diagnosedDate`)}
              className={inputClass(false)}
              placeholder="e.g. 2018"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('conditionDescription')}</label>
            <textarea
              {...register(`conditions.${index}.description`)}
              className={`${inputClass(!!errors.conditions?.[index]?.description)} min-h-[100px] resize-y`}
              placeholder={t('conditionDescriptionPlaceholder')}
            />
            {errors.conditions?.[index]?.description && (
              <p className="text-sm text-red-600 mt-1">{errors.conditions[index]?.description?.message}</p>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', diagnosedDate: '', description: '' })}
        className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-medium py-3 rounded-xl hover:bg-blue-50 transition-colors mb-8"
      >
        + {t('addCondition')}
      </button>

      <div className="flex gap-3">
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
