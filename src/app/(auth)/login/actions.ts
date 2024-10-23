"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { getUserByEmailOrUsername, getUserPasswordHash } from "@/data/users";
import { verifyPassword } from "@/lib/auth/password";
import { isRedirectError } from "next/dist/client/components/redirect";
// import {
//   getUserEmailVerificationRequestByUserId,
//   setEmailVerificationRequestCookie,
// } from '@/lib/email-verification';
import { LoginSchema, LoginSchemaTypes } from "@/lib/auth/validation";

export async function loginAction(data: LoginSchemaTypes) {
  try {
    const { identifier, password } = LoginSchema.parse(data);

    const existingUser = await getUserByEmailOrUsername(identifier);
    if (!existingUser) {
      return { error: "Invalid email, username, or password" };
    }

    const passwordHash = await getUserPasswordHash(existingUser.id);
    if (!passwordHash) {
      return { error: "Invalid email, username, or password" };
    }

    const validPassword = await verifyPassword(passwordHash, password);
    if (!validPassword) {
      return { error: "Invalid email, username, or password" };
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id, {
      twoFactorVerified: false,
    });
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    // if (!existingUser.emailVerified) {
    //   const emailVerificationRequest =
    //     await getUserEmailVerificationRequestByUserId(existingUser.id);

    //   if (emailVerificationRequest) {
    //     setEmailVerificationRequestCookie(emailVerificationRequest);
    //   }

    //   redirect(`/verify-email`);
    // }

    // if (existingUser.twoFactorEnabled) {
    //   redirect(`/2fa`);
    // }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return { error: "Login failed. Please try again." };
  }

  redirect("/");
}
