import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/src/lib/supabase';
import type { UserRole } from '@/src/types/database';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signInAsAdmin: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; reason: 'invalid_credentials' | 'not_admin' | 'not_configured' | 'error'; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchUserRole(userId: string): Promise<UserRole | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.role === 'admin' ? 'admin' : 'customer';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  const syncSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!nextSession?.user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchedRole = await fetchUserRole(nextSession.user.id);
    setRole(fetchedRole);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        syncSession(data.session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (mounted) {
          syncSession(nextSession);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [syncSession]);

  const signInAsAdmin = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false as const, reason: 'not_configured' as const };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return {
        ok: false as const,
        reason: 'invalid_credentials' as const,
        message: error?.message,
      };
    }

    const fetchedRole = await fetchUserRole(data.user.id);
    if (fetchedRole !== 'admin') {
      await supabase.auth.signOut();
      setSession(null);
      setRole(null);
      return { ok: false as const, reason: 'not_admin' as const };
    }

    setSession(data.session);
    setRole('admin');
    return { ok: true as const };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        role,
        isAdmin: Boolean(session?.user && role === 'admin'),
        loading,
        signInAsAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
