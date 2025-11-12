import { z } from "zod";

import type {
  ExperimentCategory,
  ExperimentOutcome,
  ExperimentStatus,
} from "../types/experiments";

export const statusSchema = z.enum([
  "backlog",
  "planning",
  "scheduled",
  "live",
  "analyzing",
  "completed",
  "archived",
]) satisfies z.ZodType<ExperimentStatus>;

export const categorySchema = z.enum([
  "content",
  "events",
  "monetization",
  "product",
  "community_growth",
  "engagement",
]) satisfies z.ZodType<ExperimentCategory>;

export const outcomeSchema = z.enum([
  "success",
  "fail",
  "inconclusive",
]) satisfies z.ZodType<ExperimentOutcome>;

const nullableString = z
  .string()
  .min(1)
  .trim()
  .nullish()
  .transform((value) => value ?? null);

const score = z.number().min(1).max(10);

const riceImpactSchema = z.number().refine(
  (val) => [0.25, 0.5, 1, 2, 3].includes(val),
  { message: "RICE impact must be 0.25, 0.5, 1, 2, or 3" }
).transform((val) => val as 0.25 | 0.5 | 1 | 2 | 3);

const baseExperimentSchema = z.object({
  experimentId: z.string().min(1),
  name: z.string().min(1),
  category: categorySchema,
  owner: z.string().min(1),
  status: statusSchema,
  impactScore: score,
  confidenceScore: score,
  easeScore: score,
  hypothesis: z.string().min(1),
  successCriteria: z.string().min(1),
  primaryMetric: z.string().min(1),
  secondaryMetrics: z.array(z.string().min(1)).optional(),
  targetValue: z.number().nullable().optional(),
  startDate: nullableString,
  endDate: nullableString,
  durationDays: z.number().int().positive().nullable().optional(),
  sprintWeek: z.number().int().positive().nullable().optional(),
  costInInr: z.number().nonnegative().nullable().optional(),
  resourcesNeeded: z.array(z.string().min(1)).optional(),
  resultsBefore: nullableString,
  resultsAfter: nullableString,
  actualResult: z.number().nullable().optional(),
  outcome: outcomeSchema.nullable().optional(),
  learnings: nullableString,
  nextActions: z.array(z.string().min(1)).optional(),
  relatedExperiments: z.array(z.string().min(1)).optional(),
  documentationUrl: nullableString,
  tags: z.array(z.string().min(1)).optional(),
  riceReach: z.number().int().min(1).max(100).nullable().optional(),
  riceImpact: riceImpactSchema.nullable().optional(),
  riceConfidence: z.number().int().min(1).max(100).nullable().optional(),
  riceEffort: z.number().int().min(1).max(100).nullable().optional(),
  riceScore: z.number().nullable().optional(),
});

export const experimentInsertSchema = baseExperimentSchema.transform((value) => {
  const iceScore = value.impactScore * value.confidenceScore * value.easeScore;
  
  let riceScore: number | null = null;
  if (
    value.riceReach !== null &&
    value.riceReach !== undefined &&
    value.riceImpact !== null &&
    value.riceImpact !== undefined &&
    value.riceConfidence !== null &&
    value.riceConfidence !== undefined &&
    value.riceEffort !== null &&
    value.riceEffort !== undefined &&
    value.riceEffort > 0
  ) {
    const confidenceDecimal = value.riceConfidence / 100;
    riceScore = (value.riceReach * value.riceImpact * confidenceDecimal) / value.riceEffort;
  }
  
  return {
    ...value,
    secondaryMetrics: value.secondaryMetrics ?? [],
    targetValue: value.targetValue ?? null,
    durationDays: value.durationDays ?? null,
    sprintWeek: value.sprintWeek ?? null,
    costInInr: value.costInInr ?? null,
    resourcesNeeded: value.resourcesNeeded ?? [],
    actualResult: value.actualResult ?? null,
    outcome: value.outcome ?? null,
    learnings: value.learnings ?? null,
    nextActions: value.nextActions ?? [],
    relatedExperiments: value.relatedExperiments ?? [],
    documentationUrl: value.documentationUrl ?? null,
    tags: value.tags ?? [],
    iceScore,
    riceScore: value.riceScore ?? riceScore,
    riceReach: value.riceReach ?? null,
    riceImpact: value.riceImpact ?? null,
    riceConfidence: value.riceConfidence ?? null,
    riceEffort: value.riceEffort ?? null,
  };
});

export const experimentUpdateSchema = baseExperimentSchema
  .partial()
  .extend({
    id: z.string().uuid(),
    iceScore: z.number().optional(),
  });

