"use client";

import { User } from "@/lib/auth/session";
import { Session } from "@prisma/client";
import { createContext, ReactNode, useContext, useMemo } from "react";

type SessionContextProps = {
  user: User | null;
  session: Session | null;
};

const SessionContext = createContext<SessionContextProps | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({
  children,
  session,
  user,
}: {
  children: ReactNode;
  session: Session | null;
  user: User | null;
}) {
  const contextValue = useMemo<SessionContextProps>(
    () => ({
      session,
      user,
    }),
    [session, user],
  );

  return <SessionContext value={contextValue}>{children}</SessionContext>;
}
