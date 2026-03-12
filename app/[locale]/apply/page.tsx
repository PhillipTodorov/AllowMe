'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Step1Eligibility from '@/components/steps/Step1Eligibility';
import Step2PersonalDetails from '@/components/steps/Step2PersonalDetails';
import Step3ContactDetails from '@/components/steps/Step3ContactDetails';
import Step4HealthConditions from '@/components/steps/Step4HealthConditions';
import Step5DaytimeCare from '@/components/steps/Step5DaytimeCare';
import Step6NighttimeCare from '@/components/steps/Step6NighttimeCare';
import Step7Medications from '@/components/steps/Step7Medications';
import Step8HealthcareProfessionals from '@/components/steps/Step8HealthcareProfessionals';
import Step9Review from '@/components/steps/Step9Review';
import { ApplicationData } from '@/lib/validations';

const TOTAL_STEPS = 9;

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Partial<ApplicationData>>({});

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const next = (stepData: any, key: keyof ApplicationData) => {
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
        <Step2PersonalDetails
          data={data.personal || {}}
          onNext={(d) => next(d, 'personal')}
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
        <Step4HealthConditions
          data={data.health || {}}
          onNext={(d) => next(d, 'health')}
          onBack={back}
        />
      )}
      {step === 5 && (
        <Step5DaytimeCare
          data={data.daytime || {}}
          onNext={(d) => next(d, 'daytime')}
          onBack={back}
        />
      )}
      {step === 6 && (
        <Step6NighttimeCare
          data={data.nighttime || {}}
          onNext={(d) => next(d, 'nighttime')}
          onBack={back}
        />
      )}
      {step === 7 && (
        <Step7Medications
          data={data.medications || {}}
          onNext={(d) => next(d, 'medications')}
          onBack={back}
        />
      )}
      {step === 8 && (
        <Step8HealthcareProfessionals
          data={data.professionals || {}}
          onNext={(d) => next(d, 'professionals')}
          onBack={back}
        />
      )}
      {step === 9 && (
        <Step9Review
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
