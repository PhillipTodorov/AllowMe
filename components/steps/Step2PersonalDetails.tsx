'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dobDay: z.string().regex(/^\d{1,2}$/, 'Invalid day'),
  dobMonth: z.string().regex(/^\d{1,2}$/, 'Invalid month'),
  dobYear: z.string().regex(/^\d{4}$/, 'Invalid year'),
  postcode: z.string().min(1, 'Postcode is required').regex(
    /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, 'Invalid postcode'
  ),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-slate-600'
  }`;

export default function Step2PersonalDetails({ data, onNext, onBack }: Props) {
  const t = useTranslations('personal');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('firstName')}</label>
          <input {...register('firstName')} className={inputClass(!!errors.firstName)} />
          {errors.firstName && <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('lastName')}</label>
          <input {...register('lastName')} className={inputClass(!!errors.lastName)} />
          {errors.lastName && <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-300 mb-1">{t('dob')}</label>
        <div className="grid grid-cols-3 gap-2">
          <input {...register('dobDay')} placeholder={t('dobDay')} className={inputClass(!!errors.dobDay)} maxLength={2} />
          <input {...register('dobMonth')} placeholder={t('dobMonth')} className={inputClass(!!errors.dobMonth)} maxLength={2} />
          <input {...register('dobYear')} placeholder={t('dobYear')} className={inputClass(!!errors.dobYear)} maxLength={4} />
        </div>
        {(errors.dobDay || errors.dobMonth || errors.dobYear) && (
          <p className="text-sm text-red-400 mt-1">{t('dobInvalid')}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-300 mb-1">{t('postcode')}</label>
        <input {...register('postcode')} className={inputClass(!!errors.postcode)} placeholder="e.g. SW1A 1AA" />
        {errors.postcode && <p className="text-sm text-red-400 mt-1">{errors.postcode.message}</p>}
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
