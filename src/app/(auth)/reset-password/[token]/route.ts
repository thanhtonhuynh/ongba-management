import {
  setPasswordResetTokenCookie,
  validatePasswordResetRequest,
} from '@/lib/auth/password-reset';
import { redirect } from 'next/navigation';

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  const passwordResetToken = await validatePasswordResetRequest(token);

  if (!passwordResetToken)
    redirect('/login/forgot-password?resetLinkExpired=true');

  setPasswordResetTokenCookie(token, passwordResetToken.expiresAt);

  redirect('/reset-password');
}
