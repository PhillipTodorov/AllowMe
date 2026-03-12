'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ApplicationData } from '@/lib/validations';

interface Props {
  data: Partial<ApplicationData>;
  onSubmit: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
}

function Section({ title, step, onEdit, children }: { title: string; step: number; onEdit: (s: number) => void; children: React.ReactNode }) {
  const t = useTranslations('review');
  return (
    <div className="mb-4 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-5 py-3 bg-slate-750 border-b border-slate-700">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <button onClick={() => onEdit(step)} className="text-blue-400 text-sm hover:underline">{t('edit')}</button>
      </div>
      <div className="px-5 py-4 text-sm text-slate-400 space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-slate-500 min-w-[140px]">{label}:</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

export default function Step9Review({ data, onSubmit, onBack, onGoToStep, isSubmitting }: Props) {
  const t = useTranslations('review');
  const bt = useTranslations('buttons');
  const [accepted, setAccepted] = useState(false);

  const personal = data.personal;
  const contact = data.contact;
  const health = data.health;
  const daytime = data.daytime;
  const nighttime = data.nighttime;
  const meds = data.medications;
  const profs = data.professionals;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-slate-400 mb-8">{t('intro')}</p>

      {personal && (
        <Section title={t('personalSection')} step={2} onEdit={onGoToStep}>
          <Row label="Name" value={`${personal.firstName} ${personal.lastName}`} />
          <Row label="Date of Birth" value={`${personal.dobDay}/${personal.dobMonth}/${personal.dobYear}`} />
          <Row label="NI Number" value={personal.niNumber} />
          <Row label="Address" value={[personal.address1, personal.address2, personal.town, personal.postcode].filter(Boolean).join(', ')} />
        </Section>
      )}

      {contact && (
        <Section title={t('contactSection')} step={3} onEdit={onGoToStep}>
          <Row label="Phone" value={contact.phone} />
          {contact.email && <Row label="Email" value={contact.email} />}
        </Section>
      )}

      {health && (
        <Section title={t('healthSection')} step={4} onEdit={onGoToStep}>
          {health.conditions.map((c, i) => (
            <div key={i} className="mb-2">
              <span className="font-medium text-slate-200">{i + 1}. {c.name}</span>
              {c.diagnosedDate && <span className="text-slate-500 ml-2">({c.diagnosedDate})</span>}
              <p className="text-slate-400 mt-0.5 pl-4">{c.description}</p>
            </div>
          ))}
        </Section>
      )}

      {daytime && (
        <Section title={t('daytimeSection')} step={5} onEdit={onGoToStep}>
          {Object.entries(daytime).filter(([, v]) => v.needsHelp).map(([key, v]) => (
            <div key={key} className="mb-1">
              <span className="font-medium text-slate-300 capitalize">{key}:</span> {v.description || 'Yes'}
            </div>
          ))}
          {!Object.values(daytime).some(v => v.needsHelp) && <span className="text-slate-500">No daytime care needs indicated</span>}
        </Section>
      )}

      {nighttime && (
        <Section title={t('nighttimeSection')} step={6} onEdit={onGoToStep}>
          <Row label="Needs night help" value={nighttime.needsNightHelp ? 'Yes' : 'No'} />
          {nighttime.needsNightHelp && <Row label="Frequency" value={nighttime.frequency} />}
          {nighttime.needsNightHelp && <Row label="Description" value={nighttime.description} />}
          <Row label="Needs overnight watcher" value={nighttime.needsWatcher ? 'Yes' : 'No'} />
        </Section>
      )}

      {meds && (
        <Section title={t('medicationsSection')} step={7} onEdit={onGoToStep}>
          {meds.medications.length === 0 && <span className="text-slate-500">None listed</span>}
          {meds.medications.map((m, i) => (
            <div key={i}>{i + 1}. <span className="font-medium text-slate-200">{m.name}</span> — {m.dosage}{m.prescribedFor ? ` (for ${m.prescribedFor})` : ''}</div>
          ))}
        </Section>
      )}

      {profs && (
        <Section title={t('professionalsSection')} step={8} onEdit={onGoToStep}>
          {profs.professionals.map((p, i) => (
            <div key={i} className="mb-2">
              <span className="font-medium text-slate-200">{p.name}</span> — {p.role}
              {p.practice && <span className="text-slate-500">, {p.practice}</span>}
            </div>
          ))}
        </Section>
      )}

      {/* Declaration */}
      <div className="mt-6 p-4 bg-blue-950/40 border border-blue-800 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 accent-blue-500"
          />
          <span className="text-sm text-slate-300">{t('declaration')}</span>
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button type="button" onClick={onBack} className="flex-1 border-2 border-slate-600 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
          {bt('back')}
        </button>
        <button
          onClick={onSubmit}
          disabled={!accepted || isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </div>
  );
}
