import { z } from 'zod';
import { MAX_CONTRACT_PDF_SIZE } from './utils';

// ========= AUTH =========
export const signUpCredentialsSchema = z
  .object({
    email: z.string().email('Must be a valid email'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

export type SignUpCredentials = z.infer<typeof signUpCredentialsSchema>;

export const loginCredentialsSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

// ========= FILES =========
export const contractPDFSchema = z
  .array(z.instanceof(File))
  .min(1, 'At least must upload 1 contract file')
  .refine(
    (files) => files.every((file) => file.size <= MAX_CONTRACT_PDF_SIZE),
    'Files must be smaller than 1.5MG'
  )
  .refine(
    (files) => files.every((file) => file.type === 'application/pdf'),
    'Files must be smaller than 1.5MG'
  );

// ========= CONTACTS =========
export const createContractSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  soyKgs: z.coerce
    .number({ message: 'Must be a positive number' })
    .positive('Kilograms of soy must be greater than 1')
    .gt(0, 'Kilograms of soy must be greater than 1'),
  parcelIds: z.array(z.string()).nonempty('At least 1 parcel is required'),
  files: contractPDFSchema,
});

export type CreateContract = z.infer<typeof createContractSchema>;

// ========= PARCEL =========
export const createParcelSchema = z.object({
  label: z.string().length(2),
  coordinates: z.array(z.array(z.number()).length(2)),
  area: z.coerce
    .number({ message: 'Must be a positive number' })
    .positive()
    .gt(0),
});

export type CreateParcel = z.infer<typeof createParcelSchema>;

export const contractStatusSchema = z.enum(['ONGOING', 'FINISHED', 'PENDING']);

export type ContractStatus = z.infer<typeof contractStatusSchema>;

export const searchFiltersSchema = z.object({
  status: z.enum([...contractStatusSchema.options, 'ALL']).catch('ALL'),
  year: z.string().catch('ALL'),
  parcel: z.string().catch('ALL'),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
