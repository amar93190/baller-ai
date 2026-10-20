import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { auth, type Account, type Result } from '@/lib/auth';

type SessionCtx = {
  account: Account | null;
  ready: boolean;
  signUp: (name: string, email: string, password: string) => Promise<Result<Account | 'confirm-email'>>;
  signIn: (email: string, password: string) => Promise<Result<Account>>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<Result>;
};

const Ctx = createContext<SessionCtx | null>(null);

/** Qui est connecté. Les écrans de l'app ne sont accessibles qu'avec un compte. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    auth
      .current()
      .then(setAccount)
      .finally(() => setReady(true));
    return auth.onChange(setAccount);
  }, []);

  const value = useMemo<SessionCtx>(
    () => ({
      account,
      ready,
      signUp: async (name, email, password) => {
        const r = await auth.signUp(name, email, password);
        if (r.ok && r.value !== 'confirm-email') setAccount(r.value);
        return r;
      },
      signIn: async (email, password) => {
        const r = await auth.signIn(email, password);
        if (r.ok) setAccount(r.value);
        return r;
      },
      signOut: async () => {
        await auth.signOut();
        setAccount(null);
      },
      deleteAccount: async () => {
        if (!account) return { ok: false, error: 'Aucun compte connecté.' };
        const r = await auth.deleteAccount(account);
        if (r.ok) setAccount(null);
        return r;
      },
    }),
    [account, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSession doit être utilisé dans <SessionProvider>');
  return c;
}
