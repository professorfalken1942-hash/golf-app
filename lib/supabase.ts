import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createSupabaseClient> | null = null;

export const getSupabase = () => {
  if (typeof window === "undefined") return null;
  
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error("Missing Supabase credentials");
      return null;
    }
    
    supabase = createSupabaseClient(url, key);
  }
  
  return supabase;
};

// For pages that need it at module level, export a placeholder
export const supabase = {
  auth: {
    getSession: async () => getSupabase()?.auth.getSession() || { data: {} },
    signInWithPassword: async (creds: any) => getSupabase()?.auth.signInWithPassword(creds) || { error: {} },
    signUp: async (creds: any) => getSupabase()?.auth.signUp(creds) || { error: {} },
    signOut: async () => getSupabase()?.auth.signOut() || { error: {} },
  },
  from: (table: string) => getSupabase()?.from(table) || { select: () => {} },
} as any;
