'use server';

import { getUserByEmail } from '@/data/users';
import { RateLimitError } from '@/lib/errors';
import { rateLimitByKey } from '@/lib/limiter';
import {
  createPasswordResetToken,
  generatePasswordResetToken,
  invalidatePasswordResetToken,
  sendPasswordResetEmail,
} from '@/lib/password-reset';
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaTypes,
} from '@/lib/validation';

export async function forgotPasswordAction(data: ForgotPasswordSchemaTypes) {
  try {
    const { email } = ForgotPasswordSchema.parse(data);

    await rateLimitByKey({
      key: `forgot-password:${email}`,
      limit: 1,
      window: 60000,
    });

    const user = await getUserByEmail(email);
    if (!user) return { success: true };

    await invalidatePasswordResetToken(user.id);

    const token = generatePasswordResetToken();

    await createPasswordResetToken(user.id, token);

    sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    if (error instanceof RateLimitError) {
      return {
        error: 'You can only request a password reset link once per minute.',
      };
    }
    console.error(error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
