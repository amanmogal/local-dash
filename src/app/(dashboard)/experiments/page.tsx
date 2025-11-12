import { ICERICEComparison } from "@/components/comparison/ICERICEComparison";
import { ExperimentTable } from "@/components/experiments/ExperimentTable";
import { GoogleDriveSyncButton } from "@/components/google/GoogleDriveSyncButton";
import { ICERankingTable } from "@/components/ice/ICERankingTable";
import { NotionSyncButton } from "@/components/notion/NotionSyncButton";
import { RICERankingTable } from "@/components/rice/RICERankingTable";
import { buildMockExperiments } from "@/lib/experiments/mock";
import { listExperiments } from "@/lib/experiments/queries";
import { isGoogleDriveConfigured } from "@/lib/google/client";
import { isNotionConfigured } from "@/lib/notion/sync";

export default async function ExperimentsPage() {
  const allowWrites = process.env.ENABLE_SUPABASE_WRITES === "true";

  const fallbackExperiments = buildMockExperiments();
  let experiments = fallbackExperiments;
  let dataSourceLabel = "Sample dataset";

  try {
    const records = await listExperiments();

    if (records.length > 0) {
      experiments = records;
      dataSourceLabel = "Supabase experiments";
    }
  } catch (error) {
    console.warn("Experiment fetch failed. Using mock dataset.", error);
  }

  const notionConfigured = isNotionConfigured();
  const googleDriveConfigured = isGoogleDriveConfigured();

  return (
    <>
      <article className="panel">
        <div className="panel__header">
          <div>
            <h1>Experiment Tracker</h1>
            <p className="panel__muted">
              {`Data source: ${dataSourceLabel}.`} Capture new experiments, score by
              impact-confidence-ease, and manage outcomes across the lifecycle.
            </p>
          </div>
          <div className="sync-buttons">
            {notionConfigured && <NotionSyncButton syncAll={true} />}
            {googleDriveConfigured && <GoogleDriveSyncButton syncAll={true} />}
          </div>
        </div>
      </article>
      <ICERICEComparison experiments={experiments} />
      <ICERankingTable experiments={experiments} />
      <RICERankingTable experiments={experiments} />
      <ExperimentTable experiments={experiments} allowWrites={allowWrites} />
    </>
  );
}

