"use server";

import { getUserByEmail } from "@/data/users";
import {
  createPasswordResetToken,
  generatePasswordResetToken,
  invalidatePasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/auth/password-reset";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaTypes,
} from "@/lib/auth/validation";

export async function forgotPasswordAction(data: ForgotPasswordSchemaTypes) {
  try {
    const { email } = ForgotPasswordSchema.parse(data);

    const user = await getUserByEmail(email);
    if (!user) return { success: true };

    await invalidatePasswordResetToken(user.id);

    const token = generatePasswordResetToken();

    await createPasswordResetToken(user.id, token);

    sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
