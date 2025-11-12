import { NextResponse } from "next/server";

import { listExperiments } from "@/lib/experiments/queries";
import { exportExperimentToGoogleDrive } from "@/lib/google/sync";
import { isGoogleDriveConfigured } from "@/lib/google/client";
import { isNotionConfigured, syncExperimentToNotion } from "@/lib/notion/sync";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isNotionConfigured()) {
      return NextResponse.json(
        {
          error:
            "Notion integration not configured. Set NOTION_API_TOKEN and NOTION_DATABASE_ID in .env.local",
        },
        { status: 400 },
      );
    }

    const { experimentId, syncAll } = await request.json().catch(() => ({}));

    if (syncAll) {
      const experiments = await listExperiments();
      const results = [];

      const googleDriveConfigured = isGoogleDriveConfigured();

      for (const experiment of experiments) {
        const notionResult = await syncExperimentToNotion(experiment);
        
        let googleDriveResult = null;
        if (googleDriveConfigured) {
          try {
            googleDriveResult = await exportExperimentToGoogleDrive(experiment);
          } catch (error) {
            console.error(`Failed to export ${experiment.experimentId} to Google Drive:`, error);
          }
        }

        results.push({
          experimentId: experiment.id,
          experimentName: experiment.name,
          ...notionResult,
          googleDriveSuccess: googleDriveResult?.success ?? false,
          googleDriveUrl: googleDriveResult?.googleDriveUrl,
        });
      }

      const successCount = results.filter((r) => r.success).length;

      return NextResponse.json({
        success: true,
        synced: successCount,
        total: results.length,
        results,
      });
    }

    if (!experimentId) {
      return NextResponse.json(
        { error: "experimentId is required when syncAll is false" },
        { status: 400 },
      );
    }

    const experiments = await listExperiments();
    const experiment = experiments.find((exp) => exp.id === experimentId);

    if (!experiment) {
      return NextResponse.json(
        { error: `Experiment with id ${experimentId} not found` },
        { status: 404 },
      );
    }

    const notionResult = await syncExperimentToNotion(experiment);

    if (!notionResult.success) {
      return NextResponse.json(
        { error: notionResult.error ?? "Failed to sync experiment to Notion" },
        { status: 500 },
      );
    }

    const googleDriveConfigured = isGoogleDriveConfigured();
    let googleDriveResult = null;
    if (googleDriveConfigured) {
      try {
        googleDriveResult = await exportExperimentToGoogleDrive(experiment);
      } catch (error) {
        console.error(`Failed to export ${experiment.experimentId} to Google Drive:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      notionPageId: notionResult.notionPageId,
      googleDriveSuccess: googleDriveResult?.success ?? false,
      googleDriveUrl: googleDriveResult?.googleDriveUrl,
    });
  } catch (error) {
    console.error("Notion sync error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error syncing to Notion",
      },
      { status: 500 },
    );
  }
}

