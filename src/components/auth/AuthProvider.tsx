import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  roleLoading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  roleLoading: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    // Подписка на изменения сессии — ОБЯЗАТЕЛЬНО до getSession
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setRoleLoading(true);
        // Откладываем запрос к БД, чтобы не вложиться в коллбэк auth
        setTimeout(() => {
          checkAdmin(newSession.user.id).finally(() => setRoleLoading(false));
        }, 0);
      } else {
        setIsAdmin(false);
        setRoleLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        setRoleLoading(true);
        checkAdmin(s.user.id)
          .finally(() => {
            setRoleLoading(false);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) {
      console.error("role check error", error);
    }
    setIsAdmin(!!data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider
      value={{ session, user: session?.user ?? null, isAdmin, loading, roleLoading, signOut }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
