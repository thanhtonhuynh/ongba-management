"use server";

// import { deleteEmailVerificationRequestCookie } from '@/lib/email-verification';
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const { session } = await getCurrentSession();
  if (!session) throw new Error("No session found");

  invalidateSession(session.id);
  await deleteSessionTokenCookie();

  // Delete email verification request cookie
  // deleteEmailVerificationRequestCookie();

  redirect("/login");
}
