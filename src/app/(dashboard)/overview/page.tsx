import Link from "next/link";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusSummary } from "@/components/dashboard/StatusSummary";
import { buildOverviewSummary, listExperiments } from "@/lib/experiments/queries";
import { buildMockExperiments } from "@/lib/experiments/mock";

import styles from "./page.module.css";

export default async function OverviewPage() {
  const mockData = buildMockExperiments();
  let experiments = mockData;
  let isLiveData = false;

  try {
    const records = await listExperiments();
    if (records.length > 0) {
      experiments = records;
      isLiveData = true;
    }
  } catch (error) {
    console.warn("Using mock experiment data for overview:", error);
  }

  const summary = buildOverviewSummary(experiments);
  const successRateDisplay = `${Math.round(summary.successRate * 100)}%`;

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <h1>LocalDev Experiment Command Center</h1>
        <p>
          Track experiments, monitor velocity, and align the team around data-driven
          learnings. This overview surfaces the North Star progress alongside
          operational health metrics for the experimentation program.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} href="/experiments">
            View Experiments
          </Link>
          <Link className={styles.secondaryLink} href="/sprint-planning">
            Plan Next Sprint
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          label="Active Experiments"
          value={String(summary.byStatus.live ?? 0)}
          helper={isLiveData ? "Live data" : "Sample data"}
        />
        <MetricCard
          label="Velocity (7d)"
          value={String(summary.velocity7d)}
          helper="Experiments launched or updated in the past 7 days"
        />
        <MetricCard
          label="Success Rate"
          value={successRateDisplay}
          helper="Completed experiments meeting success criteria"
        />
        <MetricCard
          label="Total Pipeline"
          value={String(summary.total)}
          helper="Across all lifecycle stages"
        />
      </section>

      <section className="panel">
        <h2>Status Distribution</h2>
        <p className="panel__muted">
          Snapshot of experiment volume in each lifecycle stage.
        </p>
        <StatusSummary statusCounts={summary.byStatus} />
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>What you can expect next</h2>
          <ul>
            <li>Live experiment tracker with ICE scoring and lifecycle stages.</li>
            <li>Overview dashboard summarizing velocity, outcomes, and NSM progress.</li>
            <li>Integrated sprint planning workspace to coordinate team capacity.</li>
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Current status</h2>
          <ul>
            <li>Next.js TypeScript foundation with shared layout and navigation.</li>
            <li>Supabase integration scaffolding ready for secure data access.</li>
            <li>Upcoming integrations: Notion, Google Drive, Motion automation.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

