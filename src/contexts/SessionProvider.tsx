'use client';

import { Session } from '@prisma/client';
import { User } from '@/lib/session';
import { createContext, ReactNode, useContext } from 'react';

interface SessionContext {
  user: User | null;
  session: Session | null;
}

const SessionContext = createContext({} as SessionContext);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

interface SessionProviderProps {
  children: ReactNode;
  value: SessionContext;
}

export function SessionProvider({ children, value }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
