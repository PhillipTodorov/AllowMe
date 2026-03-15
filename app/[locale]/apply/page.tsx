'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Step1Eligibility from '@/components/steps/Step1Eligibility';
import Step3ContactDetails from '@/components/steps/Step3ContactDetails';
import Step4HealthConditions from '@/components/steps/Step4HealthConditions';
import Step5Review from '@/components/steps/Step5Review';

const TOTAL_STEPS = 4;

type FormData = {
  eligibility?: Record<string, string>;
  contact?: Record<string, string>;
  health?: { conditions: string[]; other: string };
};

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const SESSION_KEY = 'allowme_form';

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<FormData>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
      if (saved.step) setStep(saved.step);
      if (saved.data) setData(saved.data);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ step, data }));
    }
  }, [step, data, hydrated]);

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const next = (stepData: any, key: keyof FormData) => {
    setData((prev) => ({ ...prev, [key]: stepData }));
    goTo(step + 1);
  };

  const back = () => goTo(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error('Submit failed');
      sessionStorage.removeItem(SESSION_KEY);
      router.push(`/${locale}/apply/confirmation`);
    } catch {
      alert('There was a problem submitting your application. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <Step1Eligibility
          data={(data.eligibility || {}) as Parameters<typeof Step1Eligibility>[0]['data']}
          onNext={(d) => next(d, 'eligibility')}
        />
      )}
      {step === 2 && (
        <Step4HealthConditions
          data={data.health || { conditions: [], other: '' }}
          onNext={(d) => next(d, 'health')}
          onBack={back}
        />
      )}
      {step === 3 && (
        <Step3ContactDetails
          data={data.contact || {}}
          onNext={(d) => next(d, 'contact')}
          onBack={back}
        />
      )}
      {step === 4 && (
        <Step5Review
          data={data}
          onSubmit={handleSubmit}
          onBack={back}
          onGoToStep={goTo}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
