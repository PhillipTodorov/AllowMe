'use client';

import { useState } from 'react';
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

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<FormData>({});

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
      const { reference } = await res.json();
      router.push(`/${locale}/apply/confirmation?ref=${reference}`);
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
        <Step3ContactDetails
          data={data.contact || {}}
          onNext={(d) => next(d, 'contact')}
          onBack={back}
        />
      )}
      {step === 3 && (
        <Step4HealthConditions
          data={data.health || { conditions: [], other: '' }}
          onNext={(d) => next(d, 'health')}
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
