import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import prisma from '@/lib/prisma';
import { sha256 } from '@oslojs/crypto/sha2';
import { cookies } from 'next/headers';

const PASSWORD_RESET_TOKEN_TTL = 1000 * 60 * 30; // 30 minutes
// const PASSWORD_RESET_TOKEN_TTL = 3000; // 3 seconds

export function generatePasswordResetToken() {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes);
  return token;
}

export async function invalidatePasswordResetToken(userId: string) {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });
}

export async function createPasswordResetToken(userId: string, token: string) {
  const tokenHash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL),
    },
  });
}

export function sendPasswordResetEmail(email: string, token: string) {
  console.log(
    `Sending password reset email to ${email} with link: ${process.env.BASE_URL}/reset-password/${token}`
  );
}

export function setPasswordResetTokenCookie(token: string, expiresAt: Date) {
  cookies().set('pw-reset', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export function deletePasswordResetTokenCookie() {
  cookies().set('pw-reset', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function validatePasswordResetRequest(token: string) {
  const tokenHash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (passwordResetToken && passwordResetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { tokenHash } });
    return null;
  }

  return passwordResetToken;
}
