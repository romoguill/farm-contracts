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

// ========= CONTACTS =========
export const createContractSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  soyKgs: z.coerce
    .number({ message: 'Must be a positive number' })
    .positive('Kilograms of soy must be greater than 1')
    .gt(0, 'Kilograms of soy must be greater than 1'),
  parcelIds: z.array(z.string()).nonempty('At least 1 parcel is required'),
  fileIds: z.array(z.string()).min(1, 'At least 1 file is required'),
});

export type CreateContract = z.infer<typeof createContractSchema>;

export const contractPDFSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_CONTRACT_PDF_SIZE, 'Max pdf size is 1.5MB')
  .refine(
    (file) => file.type === 'application/pdf',
    'Only pdf files are supported'
  );

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
