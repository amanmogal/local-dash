import { createClient } from "@supabase/supabase-js";

import { getPublicEnv, getServerEnv } from "../env";
import type { Database } from "../types/database";

let serviceClient: ReturnType<typeof createClient<Database>> | null = null;

export const getServiceSupabaseClient = () => {
  if (serviceClient) {
    return serviceClient;
  }

  const { supabaseUrl } = getPublicEnv();
  const { supabaseServiceRoleKey } = getServerEnv();

  serviceClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  return serviceClient;
};

