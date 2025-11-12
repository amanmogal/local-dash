import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "../env";
import type { Database } from "../types/database";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export const getBrowserSupabaseClient = () => {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });

  return browserClient;
};

