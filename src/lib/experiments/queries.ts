import { ensureWriteAccess } from "../supabase/permissions";
import { getServiceSupabaseClient } from "../supabase/serverClient";
import type { Database } from "../types/database";
import type { Experiment } from "../types/experiments";
import {
  fromSupabaseRow,
  toSupabaseInsert,
  toSupabaseUpdate,
} from "./mappers";
import {
  experimentInsertSchema,
  experimentUpdateSchema,
} from "./schema";

const SUPABASE_TABLE = "experiments" satisfies keyof Database["public"]["Tables"];

export const listExperiments = async () => {
  const supabase = getServiceSupabaseClient();

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load experiments: ${error.message}`);
  }

  return (data ?? []).map(fromSupabaseRow);
};

export const createExperiment = async (payload: unknown) => {
  ensureWriteAccess();

  const parsed = experimentInsertSchema.parse(payload);
  const supabase = getServiceSupabaseClient();

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .insert([toSupabaseInsert(parsed)] as never)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create experiment: ${error.message}`);
  }

  return fromSupabaseRow(data);
};

export const updateExperiment = async (payload: unknown) => {
  ensureWriteAccess();

  const parsed = experimentUpdateSchema.parse(payload);
  const supabase = getServiceSupabaseClient();

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .update(toSupabaseUpdate(parsed) as never)
    .eq("id", parsed.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update experiment: ${error.message}`);
  }

  return fromSupabaseRow(data);
};

export interface ExperimentOverviewSummary {
  total: number;
  byStatus: Record<string, number>;
  successRate: number;
  velocity7d: number;
}

export const buildOverviewSummary = (
  experiments: Experiment[],
): ExperimentOverviewSummary => {
  const total = experiments.length;
  const statusCounts: Record<string, number> = {};
  let successCount = 0;
  let velocity7d = 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const experiment of experiments) {
    statusCounts[experiment.status] = (statusCounts[experiment.status] ?? 0) + 1;

    if (experiment.outcome === "success") {
      successCount += 1;
    }

    if (experiment.updatedAt) {
      const updatedAt = new Date(experiment.updatedAt);
      if (updatedAt >= sevenDaysAgo) {
        velocity7d += 1;
      }
    }
  }

  const successRate = total === 0 ? 0 : successCount / total;

  return {
    total,
    byStatus: statusCounts,
    successRate,
    velocity7d,
  };
};

