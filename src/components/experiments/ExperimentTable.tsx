'use client';

import { useMemo, useState } from "react";

import { ICECalculator } from "@/components/ice/ICECalculator";
import { RICECalculator } from "@/components/rice/RICECalculator";
import type { Experiment } from "@/lib/types/experiments";

interface ExperimentTableProps {
  experiments: Experiment[];
  allowWrites: boolean;
}

interface SubmissionState {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
}

const initialSubmissionState: SubmissionState = {
  status: "idle",
  message: null,
};

const splitListField = (value: FormDataEntryValue | null) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseNullableNumber = (value: FormDataEntryValue | null) => {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseNullableString = (value: FormDataEntryValue | null) => {
  if (!value) {
    return null;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : null;
};

export function ExperimentTable({ experiments, allowWrites }: ExperimentTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(
    null,
  );
  const [createState, setCreateState] = useState<SubmissionState>(
    initialSubmissionState,
  );
  const [updateState, setUpdateState] = useState<SubmissionState>(
    initialSubmissionState,
  );

  const selectedExperiment = useMemo(
    () => experiments.find((experiment) => experiment.id === selectedExperimentId) ?? null,
    [experiments, selectedExperimentId],
  );

  const submitCreate = async (formData: FormData) => {
    setCreateState({ status: "loading", message: "Submitting" });

    const payload = {
      experimentId: String(formData.get("experimentId") ?? ""),
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? "content"),
      owner: String(formData.get("owner") ?? ""),
      status: String(formData.get("status") ?? "backlog"),
      impactScore: Number(formData.get("impactScore") ?? 1),
      confidenceScore: Number(formData.get("confidenceScore") ?? 1),
      easeScore: Number(formData.get("easeScore") ?? 1),
      riceReach: parseNullableNumber(formData.get("riceReach")),
      riceImpact: (() => {
        const value = parseNullableNumber(formData.get("riceImpact"));
        if (value === null) return null;
        const validValues: (0.25 | 0.5 | 1 | 2 | 3)[] = [0.25, 0.5, 1, 2, 3];
        return validValues.includes(value as 0.25 | 0.5 | 1 | 2 | 3) ? (value as 0.25 | 0.5 | 1 | 2 | 3) : null;
      })(),
      riceConfidence: parseNullableNumber(formData.get("riceConfidence")),
      riceEffort: parseNullableNumber(formData.get("riceEffort")),
      riceScore: parseNullableNumber(formData.get("riceScore")),
      hypothesis: String(formData.get("hypothesis") ?? ""),
      successCriteria: String(formData.get("successCriteria") ?? ""),
      primaryMetric: String(formData.get("primaryMetric") ?? ""),
      secondaryMetrics: splitListField(formData.get("secondaryMetrics")),
      targetValue: parseNullableNumber(formData.get("targetValue")),
      startDate: parseNullableString(formData.get("startDate")),
      endDate: parseNullableString(formData.get("endDate")),
      durationDays: parseNullableNumber(formData.get("durationDays")),
      sprintWeek: parseNullableNumber(formData.get("sprintWeek")),
      costInInr: parseNullableNumber(formData.get("costInInr")),
      resourcesNeeded: splitListField(formData.get("resourcesNeeded")),
      resultsBefore: parseNullableString(formData.get("resultsBefore")),
      resultsAfter: parseNullableString(formData.get("resultsAfter")),
      actualResult: parseNullableNumber(formData.get("actualResult")),
      outcome: parseNullableString(formData.get("outcome")),
      learnings: parseNullableString(formData.get("learnings")),
      nextActions: splitListField(formData.get("nextActions")),
      relatedExperiments: splitListField(formData.get("relatedExperiments")),
      documentationUrl: parseNullableString(formData.get("documentationUrl")),
      tags: splitListField(formData.get("tags")),
    } as const;

    try {
      const response = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to create experiment");
      }

      setCreateState({ status: "success", message: "Experiment captured." });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error submitting experiment.";
      setCreateState({ status: "error", message });
    }
  };

  const submitUpdate = async (formData: FormData) => {
    if (!selectedExperiment) {
      return;
    }

    setUpdateState({ status: "loading", message: "Updating" });

    const payload = {
      id: selectedExperiment.id,
      status: String(formData.get("status") ?? selectedExperiment.status),
      outcome: parseNullableString(formData.get("outcome")) ?? selectedExperiment.outcome,
      learnings:
        parseNullableString(formData.get("learnings")) ?? selectedExperiment.learnings,
      nextActions: splitListField(formData.get("nextActions")),
      tags: splitListField(formData.get("tags")),
    } as const;

    try {
      const response = await fetch(`/api/experiments/${selectedExperiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update experiment");
      }

      setUpdateState({ status: "success", message: "Experiment updated." });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error updating experiment.";
      setUpdateState({ status: "error", message });
    }
  };

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h2>Experiment Tracker</h2>
          <p className="panel__muted">
            View ICE scores, owners, timelines, and outcomes for every experiment.
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => setIsCreateOpen((value) => !value)}
        >
          {isCreateOpen ? "Close" : "New Experiment"}
        </button>
      </header>

      {isCreateOpen ? (
        <form
          className="form"
          onSubmit={async (event) => {
            event.preventDefault();
            await submitCreate(new FormData(event.currentTarget));
          }}
        >
          <div className="form__grid">
            <label>
              <span>Experiment ID</span>
              <input name="experimentId" required placeholder="EXP-123" />
            </label>
            <label>
              <span>Name</span>
              <input name="name" required placeholder="Member onboarding revamp" />
            </label>
            <label>
              <span>Category</span>
              <select name="category" defaultValue="content">
                <option value="content">Content</option>
                <option value="events">Events</option>
                <option value="monetization">Monetization</option>
                <option value="product">Product</option>
                <option value="community_growth">Community Growth</option>
                <option value="engagement">Engagement</option>
              </select>
            </label>
            <label>
              <span>Owner</span>
              <input name="owner" required placeholder="owner@localdev" />
            </label>
            <label>
              <span>Status</span>
              <select name="status" defaultValue="backlog">
                <option value="backlog">Backlog</option>
                <option value="planning">Planning</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="analyzing">Analyzing</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <ICECalculator showLabels={true} />

          <RICECalculator showLabels={true} />

          <label className="form__field">
            <span>Hypothesis</span>
            <textarea
              name="hypothesis"
              required
              placeholder="We believe that..."
              rows={3}
            />
          </label>
          <label className="form__field">
            <span>Success Criteria</span>
            <textarea
              name="successCriteria"
              required
              placeholder="Success is measured by..."
              rows={3}
            />
          </label>
          <label className="form__field">
            <span>Primary Metric</span>
            <input name="primaryMetric" required placeholder="engagement_rate" />
          </label>

          <div className="form__grid">
            <label>
              <span>Secondary Metrics</span>
              <textarea
                name="secondaryMetrics"
                placeholder="metric_one\nmetric_two"
                rows={2}
              />
            </label>
            <label>
              <span>Target Value</span>
              <input name="targetValue" type="number" step="0.01" />
            </label>
            <label>
              <span>Start Date</span>
              <input name="startDate" type="date" />
            </label>
            <label>
              <span>End Date</span>
              <input name="endDate" type="date" />
            </label>
            <label>
              <span>Duration (days)</span>
              <input name="durationDays" type="number" min={1} />
            </label>
            <label>
              <span>Sprint Week</span>
              <input name="sprintWeek" type="number" min={1} />
            </label>
            <label>
              <span>Budget (INR)</span>
              <input name="costInInr" type="number" min={0} />
            </label>
            <label>
              <span>Resources Needed</span>
              <textarea name="resourcesNeeded" placeholder="role one\nrole two" rows={2} />
            </label>
          </div>

          <div className="form__grid">
            <label>
              <span>Results Before</span>
              <textarea name="resultsBefore" rows={2} />
            </label>
            <label>
              <span>Results After</span>
              <textarea name="resultsAfter" rows={2} />
            </label>
            <label>
              <span>Actual Result</span>
              <input name="actualResult" type="number" step="0.01" />
            </label>
            <label>
              <span>Outcome</span>
              <select name="outcome" defaultValue="">
                <option value="">Pending</option>
                <option value="success">Success</option>
                <option value="fail">Fail</option>
                <option value="inconclusive">Inconclusive</option>
              </select>
            </label>
          </div>

          <label className="form__field">
            <span>Learnings</span>
            <textarea name="learnings" rows={3} />
          </label>
          <div className="form__grid">
            <label>
              <span>Next Actions</span>
              <textarea name="nextActions" rows={2} placeholder="EXP-010\nEXP-011" />
            </label>
            <label>
              <span>Related Experiments</span>
              <textarea
                name="relatedExperiments"
                rows={2}
                placeholder="EXP-002\nEXP-004"
              />
            </label>
            <label>
              <span>Documentation URL</span>
              <input name="documentationUrl" type="url" placeholder="https://" />
            </label>
            <label>
              <span>Tags</span>
              <textarea name="tags" rows={2} placeholder="growth\nretention" />
            </label>
          </div>

          <div className="form__actions">
            <button className="btn" type="submit" disabled={!allowWrites || createState.status === "loading"}>
              {allowWrites ? "Submit" : "Writes disabled"}
            </button>
            <p className="form__status" data-status={createState.status}>
              {createState.message ??
                (allowWrites
                  ? "All fields are required unless noted."
                  : "Enable ENABLE_SUPABASE_WRITES to allow submissions.")}
            </p>
          </div>
        </form>
      ) : null}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>ICE</th>
              <th>RICE</th>
              <th>Start</th>
              <th>End</th>
              <th>Outcome</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((experiment) => (
              <tr key={experiment.id}>
                <td>{experiment.experimentId}</td>
                <td>{experiment.name}</td>
                <td>{experiment.owner}</td>
                <td className={`badge badge--${experiment.status}`}>{experiment.status}</td>
                <td>{experiment.iceScore}</td>
                <td>{experiment.riceScore !== null ? experiment.riceScore.toFixed(2) : "—"}</td>
                <td>{experiment.startDate ?? "—"}</td>
                <td>{experiment.endDate ?? "—"}</td>
                <td>{experiment.outcome ?? "—"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setSelectedExperimentId(experiment.id)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedExperiment ? (
        <form
          className="form"
          onSubmit={async (event) => {
            event.preventDefault();
            await submitUpdate(new FormData(event.currentTarget));
          }}
        >
          <header className="form__header">
            <div>
              <h3>{selectedExperiment.name}</h3>
              <p className="panel__muted">
                Update the lifecycle, outcome, and documented learnings.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setSelectedExperimentId(null)}
            >
              Close
            </button>
          </header>
          <div className="form__grid">
            <label>
              <span>Status</span>
              <select name="status" defaultValue={selectedExperiment.status}>
                <option value="backlog">Backlog</option>
                <option value="planning">Planning</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="analyzing">Analyzing</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label>
              <span>Outcome</span>
              <select name="outcome" defaultValue={selectedExperiment.outcome ?? ""}>
                <option value="">Pending</option>
                <option value="success">Success</option>
                <option value="fail">Fail</option>
                <option value="inconclusive">Inconclusive</option>
              </select>
            </label>
          </div>
          <label className="form__field">
            <span>Learnings</span>
            <textarea
              name="learnings"
              rows={3}
              defaultValue={selectedExperiment.learnings ?? ""}
            />
          </label>
          <div className="form__grid">
            <label>
              <span>Next Actions</span>
              <textarea
                name="nextActions"
                rows={2}
                defaultValue={selectedExperiment.nextActions.join("\n")}
              />
            </label>
            <label>
              <span>Tags</span>
              <textarea
                name="tags"
                rows={2}
                defaultValue={selectedExperiment.tags.join("\n")}
              />
            </label>
          </div>
          <div className="form__actions">
            <button className="btn" type="submit" disabled={!allowWrites || updateState.status === "loading"}>
              {allowWrites ? "Save" : "Writes disabled"}
            </button>
            <p className="form__status" data-status={updateState.status}>
              {updateState.message ??
                (allowWrites
                  ? "Adjust status and outcome as experiments conclude."
                  : "Enable ENABLE_SUPABASE_WRITES to allow updates.")}
            </p>
          </div>
        </form>
      ) : null}
    </div>
  );
}

