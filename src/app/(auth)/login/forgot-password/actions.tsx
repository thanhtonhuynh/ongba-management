"use server";

import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import { getUserByEmail } from "@/data/users";
import {
  createPasswordResetToken,
  generatePasswordResetToken,
  invalidatePasswordResetToken,
} from "@/lib/auth/password-reset";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaTypes,
} from "@/lib/auth/validation";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/components";

export async function forgotPasswordAction(data: ForgotPasswordSchemaTypes) {
  try {
    const { email } = ForgotPasswordSchema.parse(data);

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
