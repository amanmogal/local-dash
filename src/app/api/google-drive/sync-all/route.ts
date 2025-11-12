import { NextResponse } from "next/server";

import { listExperiments } from "@/lib/experiments/queries";
import { exportExperimentToGoogleDrive } from "@/lib/google/sync";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const experiments = await listExperiments();
    const results = [];

    for (const experiment of experiments) {
      try {
        const result = await exportExperimentToGoogleDrive(experiment);
        results.push({
          experimentId: experiment.experimentId,
          experimentName: experiment.name,
          success: result.success,
          googleDriveFileId: result.googleDriveFileId,
          googleDriveUrl: result.googleDriveUrl,
          error: result.error,
        });
      } catch (error) {
        results.push({
          experimentId: experiment.experimentId,
          experimentName: experiment.name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      total: results.length,
      successCount,
      failureCount,
      results,
    });
  } catch (error) {
    console.error("Google Drive sync all error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error syncing all experiments to Google Drive",
      },
      { status: 500 },
    );
  }
}

