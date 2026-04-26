import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

type QueryResult<T> = { data: T; error: null };
type QueryBuilder = {
  select: (_columns?: string) => QueryBuilder;
  eq: (_column: string, _value: unknown) => QueryBuilder;
  order: (_column: string) => Promise<QueryResult<unknown[]>>;
  maybeSingle: () => Promise<QueryResult<null>>;
  update: (_payload: Record<string, unknown>) => QueryBuilder;
  insert: (_payload: Record<string, unknown>) => Promise<QueryResult<null>>;
  delete: () => QueryBuilder;
  then: <TResult1 = QueryResult<null>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<null>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>;
};

const createMockBuilder = (): QueryBuilder => {
  const emptyList: QueryResult<unknown[]> = { data: [], error: null };
  const ok: QueryResult<null> = { data: null, error: null };

  const builder: QueryBuilder = {
    select: () => builder,
    eq: () => builder,
    order: async () => emptyList,
    maybeSingle: async () => ok,
    update: () => builder,
    insert: async () => ok,
    delete: () => builder,
    then: (onfulfilled, onrejected) => Promise.resolve(ok).then(onfulfilled, onrejected),
  };
  return builder;
};

const mockSupabase = {
  from: () => createMockBuilder(),
  auth: {
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => undefined } },
    }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({
      data: { session: null, user: null },
      error: { message: "Авторизация отключена в демо-режиме" },
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
};

export const supabase: SupabaseClient<Database> = isSupabaseEnabled
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (mockSupabase as unknown as SupabaseClient<Database>);