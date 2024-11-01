"use server";

import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import { getUserByEmail } from "@/data-access/user";
import {
  createPasswordResetToken,
  generatePasswordResetToken,
  invalidatePasswordResetToken,
} from "@/lib/auth/password-reset";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaTypes,
} from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/components";
import { rateLimitByKey, unauthenticatedRateLimit } from "@/utils/rate-limiter";

export async function forgotPasswordAction(data: ForgotPasswordSchemaTypes) {
  try {
    if (!(await unauthenticatedRateLimit())) {
      return { error: "Too many requests. Please try again later." };
    }

    const { email } = ForgotPasswordSchema.parse(data);

    if (!(await rateLimitByKey({ key: email, limit: 1, interval: 60000 }))) {
      return {
        error: "You can only request a password reset once per minute.",
      };
    }

    const user = await getUserByEmail(email);
    if (!user) return { success: true };

    await invalidatePasswordResetToken(user.id);

    const token = generatePasswordResetToken();

    await createPasswordResetToken(user.id, token);

    const emailHtml = await render(
      <ResetPasswordEmail user={user} token={token} />,
    );

    await sendEmail({
      to: email,
      subject: "Reset password request",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
