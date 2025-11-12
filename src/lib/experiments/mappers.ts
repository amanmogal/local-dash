import type {
  SupabaseExperimentInsert,
  SupabaseExperimentRow,
  SupabaseExperimentUpdate,
} from "../types/database";
import type {
  Experiment,
  ExperimentInsert,
  ExperimentUpdate,
} from "../types/experiments";

export const fromSupabaseRow = (row: SupabaseExperimentRow): Experiment => ({
  id: row.id,
  experimentId: row.experiment_id,
  name: row.name,
  category: row.category,
  owner: row.owner,
  status: row.status,
  iceScore: row.ice_score,
  impactScore: row.impact_score,
  confidenceScore: row.confidence_score,
  easeScore: row.ease_score,
  riceScore: row.rice_score ?? null,
  riceReach: row.rice_reach ?? null,
  riceImpact: row.rice_impact ?? null,
  riceConfidence: row.rice_confidence ?? null,
  riceEffort: row.rice_effort ?? null,
  hypothesis: row.hypothesis,
  successCriteria: row.success_criteria,
  primaryMetric: row.primary_metric,
  secondaryMetrics: row.secondary_metrics ?? [],
  targetValue: row.target_value,
  startDate: row.start_date,
  endDate: row.end_date,
  durationDays: row.duration_days,
  sprintWeek: row.sprint_week,
  costInInr: row.cost_in_inr,
  resourcesNeeded: row.resources_needed ?? [],
  resultsBefore: row.results_before,
  resultsAfter: row.results_after,
  actualResult: row.actual_result,
  outcome: row.outcome,
  learnings: row.learnings,
  nextActions: row.next_actions ?? [],
  relatedExperiments: row.related_experiments ?? [],
  documentationUrl: row.documentation_url,
  tags: row.tags ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const toSupabaseInsert = (
  experiment: ExperimentInsert,
): SupabaseExperimentInsert => ({
  experiment_id: experiment.experimentId,
  name: experiment.name,
  category: experiment.category,
  owner: experiment.owner,
  status: experiment.status,
  ice_score:
    experiment.iceScore ??
    experiment.impactScore * experiment.confidenceScore * experiment.easeScore,
  impact_score: experiment.impactScore,
  confidence_score: experiment.confidenceScore,
  ease_score: experiment.easeScore,
  rice_score: experiment.riceScore ?? null,
  rice_reach: experiment.riceReach ?? null,
  rice_impact: experiment.riceImpact ?? null,
  rice_confidence: experiment.riceConfidence ?? null,
  rice_effort: experiment.riceEffort ?? null,
  hypothesis: experiment.hypothesis,
  success_criteria: experiment.successCriteria,
  primary_metric: experiment.primaryMetric,
  secondary_metrics: experiment.secondaryMetrics,
  target_value: experiment.targetValue ?? null,
  start_date: experiment.startDate ?? null,
  end_date: experiment.endDate ?? null,
  duration_days: experiment.durationDays ?? null,
  sprint_week: experiment.sprintWeek ?? null,
  cost_in_inr: experiment.costInInr ?? null,
  resources_needed: experiment.resourcesNeeded,
  results_before: experiment.resultsBefore ?? null,
  results_after: experiment.resultsAfter ?? null,
  actual_result: experiment.actualResult ?? null,
  outcome: experiment.outcome ?? null,
  learnings: experiment.learnings ?? null,
  next_actions: experiment.nextActions,
  related_experiments: experiment.relatedExperiments,
  documentation_url: experiment.documentationUrl ?? null,
  tags: experiment.tags,
});

export const toSupabaseUpdate = (
  experiment: ExperimentUpdate,
): SupabaseExperimentUpdate => {
  const derivedIceScore =
    typeof experiment.impactScore === "number" &&
    typeof experiment.confidenceScore === "number" &&
    typeof experiment.easeScore === "number"
      ? experiment.impactScore *
        experiment.confidenceScore *
        experiment.easeScore
      : undefined;

  return {
    id: experiment.id,
    experiment_id: experiment.experimentId,
    name: experiment.name,
    category: experiment.category,
    owner: experiment.owner,
    status: experiment.status,
    ice_score: experiment.iceScore ?? derivedIceScore,
    impact_score: experiment.impactScore,
    confidence_score: experiment.confidenceScore,
    ease_score: experiment.easeScore,
    rice_score: experiment.riceScore,
    rice_reach: experiment.riceReach,
    rice_impact: experiment.riceImpact,
    rice_confidence: experiment.riceConfidence,
    rice_effort: experiment.riceEffort,
    hypothesis: experiment.hypothesis,
    success_criteria: experiment.successCriteria,
    primary_metric: experiment.primaryMetric,
    secondary_metrics: experiment.secondaryMetrics,
    target_value: experiment.targetValue,
    start_date: experiment.startDate,
    end_date: experiment.endDate,
    duration_days: experiment.durationDays,
    sprint_week: experiment.sprintWeek,
    cost_in_inr: experiment.costInInr,
    resources_needed: experiment.resourcesNeeded,
    results_before: experiment.resultsBefore,
    results_after: experiment.resultsAfter,
    actual_result: experiment.actualResult,
    outcome: experiment.outcome,
    learnings: experiment.learnings,
    next_actions: experiment.nextActions,
    related_experiments: experiment.relatedExperiments,
    documentation_url: experiment.documentationUrl,
    tags: experiment.tags,
  };
};

