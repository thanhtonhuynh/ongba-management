import { z } from 'zod';

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, 'Required');

// Sign up
export const SignupSchema = z.object({
  name: trimmedString.min(2, 'Name must be at least 2 characters'),
  username: trimmedString.min(4, 'Username must be at least 4 characters'),
  email: requiredString.email('Invalid email address'),
  password: trimmedString.min(8, 'Password must be at least 8 characters'),
});
export type SignupSchemaTypes = z.infer<typeof SignupSchema>;

// Login
export const LoginSchema = z.object({
  // email: requiredString.email('Invalid email address'),
  identifier: requiredString,
  password: requiredString,
});
export type LoginSchemaTypes = z.infer<typeof LoginSchema>;

// Update profile
export const UpdateProfileSchema = z.object({
  name: requiredString,
});
export type UpdateProfileSchemaTypes = z.infer<typeof UpdateProfileSchema>;

// Verification code
export const VerificationCodeSchema = z.object({
  code: trimmedString.min(6, 'Your verification code must be 6 characters.'),
});
export type VerificationCodeSchemaTypes = z.infer<
  typeof VerificationCodeSchema
>;

// Forgot password
export const ForgotPasswordSchema = z.object({
  email: requiredString.email('Invalid email address'),
});
export type ForgotPasswordSchemaTypes = z.infer<typeof ForgotPasswordSchema>;

// Reset password
export const ResetPasswordSchema = z
  .object({
    password: trimmedString.min(8, 'Password must be at least 8 characters'),
    confirmPassword: trimmedString.min(
      8,
      'Password must be at least 8 characters'
    ),
    logOutOtherDevices: z.boolean().default(false).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordSchemaTypes = z.infer<typeof ResetPasswordSchema>;

// Set up two-factor authentication
export const TwoFactorSetupSchema = z.object({
  code: trimmedString.min(6, 'Your code must be 6 characters.'),
  encodedTOTPKey: trimmedString.length(28),
});
export type TwoFactorSetupSchemaTypes = z.infer<typeof TwoFactorSetupSchema>;

// Verify two-factor authentication
export const TwoFactorVerificationSchema = z.object({
  code: trimmedString.min(6, 'Your code must be 6 characters.'),
});
export type TwoFactorVerificationSchemaTypes = z.infer<
  typeof TwoFactorVerificationSchema
>;
