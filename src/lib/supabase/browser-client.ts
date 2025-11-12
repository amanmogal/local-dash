"use client";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env";

const CLIENT_INFO_HEADER = "localdev-dashboard/browser";

export const createSupabaseBrowserClient = () => {
  const env = getPublicEnv();
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        "X-Client-Info": CLIENT_INFO_HEADER,
      },
    },
  });
};

export type SupabaseBrowserClient = ReturnType<
  typeof createSupabaseBrowserClient
>;

