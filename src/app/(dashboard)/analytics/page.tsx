import { CategoryDistributionChart } from "@/components/analytics/CategoryDistributionChart";
import { ExperimentsOverTimeChart } from "@/components/analytics/ExperimentsOverTimeChart";
import { OutcomeDistributionChart } from "@/components/analytics/OutcomeDistributionChart";
import { ROIByCategoryChart } from "@/components/analytics/ROIByCategoryChart";
import { ScoreDistributionChart } from "@/components/analytics/ScoreDistributionChart";
import { StatusDistributionChart } from "@/components/analytics/StatusDistributionChart";
import { SuccessRateTrendChart } from "@/components/analytics/SuccessRateTrendChart";
import { TimeToLearningChart } from "@/components/analytics/TimeToLearningChart";
import {
  calculateCategoryDistribution,
  calculateExperimentsOverTime,
  calculateOutcomeDistribution,
  calculateROIByCategory,
  calculateScoreDistribution,
  calculateStatusDistribution,
  calculateSuccessRateTrend,
  calculateTimeToLearning,
} from "@/lib/analytics/metrics";
import { buildMockExperiments } from "@/lib/experiments/mock";
import { buildOverviewSummary, listExperiments } from "@/lib/experiments/queries";

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default async function AnalyticsPage() {
  const mockData = buildMockExperiments();
  let experiments = mockData;
  let source = "Sample dataset";

  try {
    const records = await listExperiments();
    if (records.length > 0) {
      experiments = records;
      source = "Supabase experiments";
    }
  } catch (error) {
    console.warn("Analytics using mock dataset due to error", error);
  }

  const summary = buildOverviewSummary(experiments);

  const byCategory = experiments.reduce<Record<string, number>>((acc, experiment) => {
    acc[experiment.category] = (acc[experiment.category] ?? 0) + 1;
    return acc;
  }, {});

  const successRateTrend = calculateSuccessRateTrend(experiments);
  const categoryDistribution = calculateCategoryDistribution(experiments);
  const timeToLearning = calculateTimeToLearning(experiments);
  const roiByCategory = calculateROIByCategory(experiments);
  const experimentsOverTime = calculateExperimentsOverTime(experiments);
  const statusDistribution = calculateStatusDistribution(experiments);
  const scoreDistribution = calculateScoreDistribution(experiments);
  const outcomeDistribution = calculateOutcomeDistribution(experiments);

  const topIce = [...experiments]
    .sort((left, right) => right.iceScore - left.iceScore)
    .slice(0, 3);

  const highLearningFails = experiments
    .filter((experiment) => experiment.outcome === "fail")
    .slice(0, 3);

  return (
    <>
      <article className="panel">
        <h1>Analytics & Insights</h1>
        <p className="panel__muted">
          {`Data source: ${source}.`} Real-time analytics and visualizations tracking experiment performance, distribution, and outcomes.
        </p>
      </article>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-card__label">Success Rate</p>
          <p className="metric-card__value">{formatPercent(summary.successRate)}</p>
          <p className="metric-card__helper">Completed experiments meeting success criteria</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Velocity (7 days)</p>
          <p className="metric-card__value">{summary.velocity7d}</p>
          <p className="metric-card__helper">Experiments launched or updated this week</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Total Experiments</p>
          <p className="metric-card__value">{summary.total}</p>
          <p className="metric-card__helper">Across the full lifecycle</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Most Active Category</p>
          <p className="metric-card__value">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category]) => category.replace(/_/g, " "))[0] ?? "n/a"}
          </p>
          <p className="metric-card__helper">Based on experiment count</p>
        </article>
      </section>

      <section className="panel">
        <h2>Experiments Over Time</h2>
        <p className="panel__muted">
          Track experiment creation and status changes over time. Shows total, completed, live, and planning experiments.
        </p>
        <ExperimentsOverTimeChart data={experimentsOverTime} />
      </section>

      <section className="panel">
        <h2>Status Distribution</h2>
        <p className="panel__muted">
          Current distribution of experiments across all statuses. Understand where experiments are in the lifecycle.
        </p>
        <StatusDistributionChart data={statusDistribution} />
      </section>

      <section className="panel">
        <h2>Success Rate Trend</h2>
        <p className="panel__muted">
          Rolling success rate of completed experiments vs target threshold (70%).
        </p>
        <SuccessRateTrendChart data={successRateTrend} />
      </section>

      <section className="panel">
        <h2>Experiments by Category</h2>
        <p className="panel__muted">
          Distribution of experiments across categories, showing resource allocation.
        </p>
        <CategoryDistributionChart data={categoryDistribution} variant="bar" />
      </section>

      <section className="panel">
        <h2>ICE & RICE Score Distribution</h2>
        <p className="panel__muted">
          Distribution of ICE and RICE scores across all experiments. Understand prioritization patterns.
        </p>
        <ScoreDistributionChart data={scoreDistribution} />
      </section>

      <section className="panel">
        <h2>Outcome Distribution</h2>
        <p className="panel__muted">
          Distribution of outcomes for completed experiments. Track success, failure, and inconclusive rates.
        </p>
        <OutcomeDistributionChart data={outcomeDistribution} />
      </section>

      <section className="panel">
        <h2>Average Time to Learning</h2>
        <p className="panel__muted">
          Distribution of experiment cycle time from start to completion.
        </p>
        <TimeToLearningChart data={timeToLearning} />
      </section>

      <section className="panel">
        <h2>ROI by Category</h2>
        <p className="panel__muted">
          Return on investment by category, comparing value generated against costs.
        </p>
        <ROIByCategoryChart data={roiByCategory} />
      </section>

      <section className="panel">
        <h2>Top ICE Opportunities</h2>
        <p className="panel__muted">
          Focus on high-impact bets. Validate these quickly to compound learnings.
        </p>
        <ul className="list">
          {topIce.map((experiment) => (
            <li key={experiment.id}>
              <div>
                <strong>{experiment.name}</strong>
                <p className="panel__muted">
                  ICE Score: {experiment.iceScore} • Owner: {experiment.owner}
                </p>
              </div>
              <div>
                <p className="panel__muted">Status</p>
                <p>{experiment.status.toUpperCase()}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>High-Learning Failures</h2>
        <p className="panel__muted">
          Track failed experiments that delivered valuable insights. Iterate or pivot quickly.
        </p>
        {highLearningFails.length === 0 ? (
          <p>No failed experiments logged yet.</p>
        ) : (
          <ul className="list">
            {highLearningFails.map((experiment) => (
              <li key={experiment.id}>
                <div>
                  <strong>{experiment.name}</strong>
                  <p className="panel__muted">Owner: {experiment.owner}</p>
                </div>
                <div>
                  <p className="panel__muted">Learnings</p>
                  <p>{experiment.learnings ?? "Capture learnings after retrospective."}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

