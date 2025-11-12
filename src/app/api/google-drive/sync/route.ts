import { NextResponse } from "next/server";

import { listExperiments } from "@/lib/experiments/queries";
import { exportExperimentToGoogleDrive } from "@/lib/google/sync";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { experimentId } = await request.json();

    if (!experimentId) {
      return NextResponse.json(
        { error: "experimentId is required" },
        { status: 400 },
      );
    }

    const experiments = await listExperiments();
    const experiment = experiments.find((exp) => exp.id === experimentId || exp.experimentId === experimentId);

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    const result = await exportExperimentToGoogleDrive(experiment);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      googleDriveFileId: result.googleDriveFileId,
      googleDriveUrl: result.googleDriveUrl,
    });
  } catch (error) {
    console.error("Google Drive sync error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error syncing to Google Drive",
      },
      { status: 500 },
    );
  }
}

