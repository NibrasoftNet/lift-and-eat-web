import * as z from 'zod';

export const passwordSchema = z
  .string()
  .min(5, 'Le mot de passe doit contenir au moins 5 caractères');
/*  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$/,
    'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
  ); */

export const userRegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: 'Utilisateur a au moins 3 caractères' }),
  lastName: z
    .string()
    .min(3, { message: 'Utilisateur a au moins 3 caractères' }),
  password: passwordSchema,
  email: z.string().email('Email invalide!'),
});