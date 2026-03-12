'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof personalSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

function Field({
  label,
  error,
  help,
  children,
}: {
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {help && <p className="text-xs text-gray-500 mb-1">{help}</p>}
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

export default function Step2PersonalDetails({ data, onNext, onBack }: Props) {
  const t = useTranslations('personal');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-8">{t('intro')}</p>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t('firstName')} error={errors.firstName?.message}>
          <input {...register('firstName')} className={inputClass(!!errors.firstName)} />
        </Field>
        <Field label={t('lastName')} error={errors.lastName?.message}>
          <input {...register('lastName')} className={inputClass(!!errors.lastName)} />
        </Field>
      </div>

      <Field label={t('dob')} error={errors.dobDay?.message || errors.dobMonth?.message || errors.dobYear?.message}>
        <div className="grid grid-cols-3 gap-2">
          <input {...register('dobDay')} placeholder={t('dobDay')} className={inputClass(!!errors.dobDay)} maxLength={2} />
          <input {...register('dobMonth')} placeholder={t('dobMonth')} className={inputClass(!!errors.dobMonth)} maxLength={2} />
          <input {...register('dobYear')} placeholder={t('dobYear')} className={inputClass(!!errors.dobYear)} maxLength={4} />
        </div>
      </Field>

      <Field label={t('niNumber')} help={t('niHelp')} error={errors.niNumber?.message}>
        <input {...register('niNumber')} className={inputClass(!!errors.niNumber)} placeholder="QQ 12 34 56 C" />
      </Field>

      <Field label={t('address1')} error={errors.address1?.message}>
        <input {...register('address1')} className={inputClass(!!errors.address1)} />
      </Field>

      <Field label={t('address2')}>
        <input {...register('address2')} className={inputClass(false)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t('town')} error={errors.town?.message}>
          <input {...register('town')} className={inputClass(!!errors.town)} />
        </Field>
        <Field label={t('postcode')} error={errors.postcode?.message}>
          <input {...register('postcode')} className={inputClass(!!errors.postcode)} />
        </Field>
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
