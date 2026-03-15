// Tests for the eligibility logic mirrored from Step1Eligibility

type Answers = {
  isOver66: 'yes' | 'no' | '';
  isUKResident: 'yes' | 'no' | '';
  hasSettledStatus: 'yes' | 'no' | '';
  hasConflictingBenefit: 'yes' | 'no' | '';
  needsCare: 'yes' | 'no' | '';
  hasPensionCredit: 'yes' | 'no' | '';
  referredBy: string;
};

type IneligibleReason = 'age' | 'residency' | 'settlement' | 'benefit' | 'care' | null;

function getIneligibleReason(answers: Answers): IneligibleReason {
  if (answers.isOver66 === 'no') return 'age';
  if (answers.isUKResident === 'no') return 'residency';
  if (answers.hasSettledStatus === 'no') return 'settlement';
  if (answers.hasConflictingBenefit === 'yes') return 'benefit';
  if (answers.needsCare === 'no') return 'care';
  return null;
}

const eligible: Answers = {
  isOver66: 'yes',
  isUKResident: 'yes',
  hasSettledStatus: 'yes',
  hasConflictingBenefit: 'no',
  needsCare: 'yes',
  hasPensionCredit: 'no',
  referredBy: '',
};

describe('Eligibility logic', () => {
  test('eligible when all criteria met', () => {
    expect(getIneligibleReason(eligible)).toBeNull();
  });

  test('ineligible if under 66', () => {
    expect(getIneligibleReason({ ...eligible, isOver66: 'no' })).toBe('age');
  });

  test('ineligible if not UK resident', () => {
    expect(getIneligibleReason({ ...eligible, isUKResident: 'no' })).toBe('residency');
  });

  test('ineligible if no settled status', () => {
    expect(getIneligibleReason({ ...eligible, hasSettledStatus: 'no' })).toBe('settlement');
  });

  test('ineligible if receiving conflicting benefit', () => {
    expect(getIneligibleReason({ ...eligible, hasConflictingBenefit: 'yes' })).toBe('benefit');
  });

  test('ineligible if no care needs', () => {
    expect(getIneligibleReason({ ...eligible, needsCare: 'no' })).toBe('care');
  });

  test('age check takes priority over residency', () => {
    expect(getIneligibleReason({ ...eligible, isOver66: 'no', isUKResident: 'no' })).toBe('age');
  });

  test('pension credit does not affect eligibility', () => {
    expect(getIneligibleReason({ ...eligible, hasPensionCredit: 'yes' })).toBeNull();
  });
});
