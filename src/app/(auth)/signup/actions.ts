"use server";

import { createUser, getUserByEmail, getUserByUsername } from "@/data/users";
import { redirect } from "next/navigation";
// import {
//   sendVerificationEmail,
//   setEmailVerificationRequestCookie,
//   upsertEmailVerificationRequest,
// } from '@/lib/email-verification';
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { SignupSchema, SignupSchemaTypes } from "@/lib/auth/validation";

export async function signUpAction(data: SignupSchemaTypes) {
  try {
    const { name, username, email, password } = SignupSchema.parse(data);

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return { error: "Email already in use" };
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return { error: "Username already in use" };
    }

    const user = await createUser(name, username, email, password);

    // const emailVerificationRequest = await upsertEmailVerificationRequest(
    //   user.id,
    //   user.email
    // );

    // sendVerificationEmail(user.email, emailVerificationRequest.code);

    // setEmailVerificationRequestCookie(emailVerificationRequest);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id, {
      twoFactorVerified: false,
    });
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    console.error(error);
    return { error: "Signup failed. Please try again." };
  }

  // redirect(`/verify-email`);
  redirect(`/`);
}
