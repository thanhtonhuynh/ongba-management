import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { Session } from "@prisma/client";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { cache } from "react";

const SESSION_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_TTL_SHORT = 1000 * 60 * 60 * 24 * 15; // 15 days

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  accountStatus: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionFlags = {
  twoFactorVerified: boolean;
};

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

/**
 * Validate a session token
 * @param token - The session token
 * @returns The session and user if the token is valid, otherwise null
 */
export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!result) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - SESSION_TTL_SHORT) {
    session.expiresAt = new Date(Date.now() + SESSION_TTL);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: session.expiresAt },
    });
  }

  return { session, user };
}

/**
 * Get the current session from the browser cookie and validate it
 */
export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = cookies().get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

/**
 * Generate a new session token
 * @returns A new session token
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes); //*
  return token;
}

/**
 * Create a new session in the database
 * @param token - The session token
 * @param userId - The user ID
 * @returns The created session
 */
export async function createSession(
  token: string,
  userId: string,
  flags: SessionFlags,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + SESSION_TTL),
      twoFactorVerified: flags.twoFactorVerified,
    },
  });
  return session;
}

/**
 * Set the session as two-factor verified
 * @param sessionId
 */
export async function setSessionAsTwoFactorVerified(sessionId: string) {
  await prisma.session.update({
    where: { id: sessionId },
    data: { twoFactorVerified: true },
  });
}

/**
 * Invalidate a session by ID, deleting it from the database
 * @param sessionId
 */
export async function invalidateSession(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } });
}

/**
 * Invalidate all sessions for a user, deleting them from the database
 * @param userId
 */
export async function invalidateUserSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Set the session token to browser cookie
 * @param token - The session token
 * @param expiresAt - The expiration date for the session token
 */
export function setSessionTokenCookie(token: string, expiresAt: Date) {
  cookies().set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Delete the session token from the browser cookie
 */
export function deleteSessionTokenCookie() {
  cookies().set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
