'use client';

import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicationsSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof medicationsSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-slate-600'
  }`;

export default function Step7Medications({ data, onNext, onBack }: Props) {
  const t = useTranslations('medications');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(medicationsSchema),
    defaultValues: data?.medications?.length ? data : { medications: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {fields.length === 0 && (
        <p className="text-slate-500 text-center py-8 border-2 border-dashed border-slate-700 rounded-xl mb-4">
          No medications added yet
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="mb-4 p-5 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-300">Medication {index + 1}</h3>
            <button type="button" onClick={() => remove(index)} className="text-red-400 text-sm hover:text-red-300">
              {t('removeMedication')}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('medicationName')}</label>
              <input
                {...register(`medications.${index}.name`)}
                className={inputClass(!!errors.medications?.[index]?.name)}
                placeholder={t('medicationNamePlaceholder')}
              />
              {errors.medications?.[index]?.name && (
                <p className="text-sm text-red-400 mt-1">{errors.medications[index]?.name?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('dosage')}</label>
              <input
                {...register(`medications.${index}.dosage`)}
                className={inputClass(!!errors.medications?.[index]?.dosage)}
                placeholder={t('dosagePlaceholder')}
              />
              {errors.medications?.[index]?.dosage && (
                <p className="text-sm text-red-400 mt-1">{errors.medications[index]?.dosage?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('prescribedFor')}</label>
              <input
                {...register(`medications.${index}.prescribedFor`)}
                className={inputClass(false)}
                placeholder={t('prescribedForPlaceholder')}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', dosage: '', prescribedFor: '' })}
        className="w-full border-2 border-dashed border-blue-700 text-blue-400 font-medium py-3 rounded-xl hover:bg-blue-900/20 transition-colors mb-8"
      >
        + {t('addMedication')}
      </button>

      <div className="flex gap-3">
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
