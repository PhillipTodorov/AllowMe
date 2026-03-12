'use client';

import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalsSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof professionalsSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
    hasError ? 'border-red-500' : 'border-slate-600'
  }`;

export default function Step8HealthcareProfessionals({ data, onNext, onBack }: Props) {
  const t = useTranslations('professionals');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(professionalsSchema),
    defaultValues: data?.professionals?.length
      ? data
      : { professionals: [{ name: '', role: '', practice: '', address: '', lastSeen: '', treatedFor: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'professionals' });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-4 p-5 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-300">Professional {index + 1}</h3>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="text-red-400 text-sm hover:text-red-300">
                {t('removeProfessional')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('name')}</label>
              <input {...register(`professionals.${index}.name`)} className={inputClass(!!errors.professionals?.[index]?.name)} placeholder={t('namePlaceholder')} />
              {errors.professionals?.[index]?.name && <p className="text-xs text-red-400 mt-1">{errors.professionals[index]?.name?.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('role')}</label>
              <input {...register(`professionals.${index}.role`)} className={inputClass(!!errors.professionals?.[index]?.role)} placeholder={t('rolePlaceholder')} />
              {errors.professionals?.[index]?.role && <p className="text-xs text-red-400 mt-1">{errors.professionals[index]?.role?.message}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('practice')}</label>
            <input {...register(`professionals.${index}.practice`)} className={inputClass(false)} placeholder={t('practicePlaceholder')} />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('address')}</label>
            <input {...register(`professionals.${index}.address`)} className={inputClass(false)} placeholder={t('addressPlaceholder')} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('lastSeen')}</label>
              <input {...register(`professionals.${index}.lastSeen`)} className={inputClass(false)} placeholder="e.g. January 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('treatedFor')}</label>
              <input {...register(`professionals.${index}.treatedFor`)} className={inputClass(false)} placeholder={t('treatedForPlaceholder')} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', role: '', practice: '', address: '', lastSeen: '', treatedFor: '' })}
        className="w-full border-2 border-dashed border-blue-700 text-blue-400 font-medium py-3 rounded-xl hover:bg-blue-900/20 transition-colors mb-8"
      >
        + {t('addProfessional')}
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
