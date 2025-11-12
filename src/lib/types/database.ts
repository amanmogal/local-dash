import type {
  ExperimentCategory,
  ExperimentOutcome,
  ExperimentStatus,
  RICEImpact,
} from "./experiments";

export interface SupabaseExperimentRow {
  id: string;
  experiment_id: string;
  name: string;
  category: ExperimentCategory;
  owner: string;
  status: ExperimentStatus;
  ice_score: number;
  impact_score: number;
  confidence_score: number;
  ease_score: number;
  rice_score: number | null;
  rice_reach: number | null;
  rice_impact: RICEImpact | null;
  rice_confidence: number | null;
  rice_effort: number | null;
  hypothesis: string;
  success_criteria: string;
  primary_metric: string;
  secondary_metrics: string[];
  target_value: number | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  sprint_week: number | null;
  cost_in_inr: number | null;
  resources_needed: string[];
  results_before: string | null;
  results_after: string | null;
  actual_result: number | null;
  outcome: ExperimentOutcome | null;
  learnings: string | null;
  next_actions: string[];
  related_experiments: string[];
  documentation_url: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface SupabaseExperimentInsert
  extends Omit<
    SupabaseExperimentRow,
    "id" | "created_at" | "updated_at" | "ice_score"
  > {
  id?: string;
  ice_score?: number;
}

export interface SupabaseExperimentUpdate
  extends Partial<SupabaseExperimentInsert> {
  id: string;
}

export interface Database {
  public: {
    Tables: {
      experiments: {
        Row: SupabaseExperimentRow;
        Insert: SupabaseExperimentInsert;
        Update: SupabaseExperimentUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

