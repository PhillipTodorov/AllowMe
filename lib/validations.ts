import { z } from 'zod';

export const eligibilitySchema = z.object({
  isOver66: z.enum(['yes', 'no']),
  isUKResident: z.enum(['yes', 'no']),
  hasConflictingBenefit: z.enum(['yes', 'no']),
  needsCare: z.enum(['yes', 'no']),
});

export const personalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dobDay: z.string().min(1).regex(/^\d{1,2}$/, 'Invalid day'),
  dobMonth: z.string().min(1).regex(/^\d{1,2}$/, 'Invalid month'),
  dobYear: z.string().min(4).regex(/^\d{4}$/, 'Invalid year'),
  niNumber: z.string().min(1).regex(
    /^[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i,
    'Invalid NI number'
  ),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  town: z.string().min(1, 'Town is required'),
  postcode: z.string().min(1).regex(
    /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
    'Invalid postcode'
  ),
});

export const contactSchema = z.object({
  phone: z.string().min(1, 'Phone is required').regex(
    /^(\+44\s?|0)[1-9][\d\s]{8,12}$/,
    'Invalid UK phone number'
  ),
  email: z.union([
    z.string().email('Invalid email address'),
    z.string().length(0),
  ]).optional(),
});

const conditionSchema = z.object({
  name: z.string().min(1, 'Condition name is required'),
  diagnosedDate: z.string().optional(),
  description: z.string().min(10, 'Please provide more detail about this condition'),
});

export const healthSchema = z.object({
  conditions: z.array(conditionSchema).min(1, 'Please add at least one health condition'),
});

const careItemSchema = z.object({
  needsHelp: z.boolean(),
  frequency: z.string().optional(),
  description: z.string().optional(),
});

export const daytimeSchema = z.object({
  washing: careItemSchema,
  dressing: careItemSchema,
  eating: careItemSchema,
  mobility: careItemSchema,
  medication: careItemSchema,
  toilet: careItemSchema,
  supervision: careItemSchema,
  communication: careItemSchema,
});

export const nighttimeSchema = z.object({
  needsNightHelp: z.boolean(),
  frequency: z.string().optional(),
  description: z.string().optional(),
  needsWatcher: z.boolean(),
  watcherDescription: z.string().optional(),
});

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  prescribedFor: z.string().optional(),
});

export const medicationsSchema = z.object({
  medications: z.array(medicationSchema),
});

const professionalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  practice: z.string().optional(),
  address: z.string().optional(),
  lastSeen: z.string().optional(),
  treatedFor: z.string().optional(),
});

export const professionalsSchema = z.object({
  professionals: z.array(professionalSchema).min(1, 'Please add at least one healthcare professional'),
});

export const reviewSchema = z.object({
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the declaration to submit' }),
  }),
});

// Full application data type
export type ApplicationData = {
  eligibility: z.infer<typeof eligibilitySchema>;
  personal: z.infer<typeof personalSchema>;
  contact: z.infer<typeof contactSchema>;
  health: z.infer<typeof healthSchema>;
  daytime: z.infer<typeof daytimeSchema>;
  nighttime: z.infer<typeof nighttimeSchema>;
  medications: z.infer<typeof medicationsSchema>;
  professionals: z.infer<typeof professionalsSchema>;
  declarationAccepted: boolean;
};
