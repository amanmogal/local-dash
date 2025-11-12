import { createClient } from "@supabase/supabase-js";

import { getPublicEnv, getServerEnv } from "@/lib/env";

const CLIENT_INFO_HEADER = "localdev-dashboard/initial";

export const createSupabaseServerClient = () => {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();
  return createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": CLIENT_INFO_HEADER,
      },
    },
  });
};

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

