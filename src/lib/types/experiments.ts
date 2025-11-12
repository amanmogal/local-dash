export type ExperimentCategory =
  | "content"
  | "events"
  | "monetization"
  | "product"
  | "community_growth"
  | "engagement";

export type ExperimentStatus =
  | "backlog"
  | "planning"
  | "scheduled"
  | "live"
  | "analyzing"
  | "completed"
  | "archived";

export type ExperimentOutcome = "success" | "fail" | "inconclusive";

export type RICEImpact = 0.25 | 0.5 | 1 | 2 | 3;

export interface Experiment {
  id: string;
  experimentId: string;
  name: string;
  category: ExperimentCategory;
  owner: string;
  status: ExperimentStatus;
  iceScore: number;
  impactScore: number;
  confidenceScore: number;
  easeScore: number;
  riceScore: number | null;
  riceReach: number | null;
  riceImpact: RICEImpact | null;
  riceConfidence: number | null;
  riceEffort: number | null;
  hypothesis: string;
  successCriteria: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  targetValue: number | null;
  startDate: string | null;
  endDate: string | null;
  durationDays: number | null;
  sprintWeek: number | null;
  costInInr: number | null;
  resourcesNeeded: string[];
  resultsBefore: string | null;
  resultsAfter: string | null;
  actualResult: number | null;
  outcome: ExperimentOutcome | null;
  learnings: string | null;
  nextActions: string[];
  relatedExperiments: string[];
  documentationUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExperimentInsert = Omit<
  Experiment,
  "id" | "iceScore" | "createdAt" | "updatedAt"
> & {
  iceScore?: number;
};

export type ExperimentUpdate = Partial<ExperimentInsert> & {
  id: string;
};

