import { z } from 'zod';

export const credentialsSchema = z
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

export type Credentials = z.infer<typeof credentialsSchema>;
