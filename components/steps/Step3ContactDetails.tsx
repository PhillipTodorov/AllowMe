'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations';
import { z } from 'zod';

type FormData = z.infer<typeof contactSchema>;

interface Props {
  data: Partial<FormData>;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

export default function Step3ContactDetails({ data, onNext, onBack }: Props) {
  const t = useTranslations('contact');
  const bt = useTranslations('buttons');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-8">{t('intro')}</p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('phone')} <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-1">{t('phoneHelp')}</p>
        <input
          {...register('phone')}
          type="tel"
          className={inputClass(!!errors.phone)}
          placeholder="+44 7700 900000"
        />
        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')}
        </label>
        <p className="text-xs text-gray-500 mb-1">{t('emailHelp')}</p>
        <input
          {...register('email')}
          type="email"
          className={inputClass(!!errors.email)}
          placeholder="example@email.com"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
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
