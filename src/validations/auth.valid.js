import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email().toLowerCase().trim(),  // <- poprawione
  password: z.string().min(1),
});