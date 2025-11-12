import { NextResponse } from "next/server";

import { updateExperiment } from "@/lib/experiments/queries";
import { exportExperimentToGoogleDrive } from "@/lib/google/sync";
import { isGoogleDriveConfigured } from "@/lib/google/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await request.json();
    const { id } = await params;
    const experiment = await updateExperiment({ ...payload, id });

    const googleDriveConfigured = isGoogleDriveConfigured();
    const statusChangedToCompleted = payload.status === "completed";
    
    if (googleDriveConfigured && statusChangedToCompleted) {
      try {
        await exportExperimentToGoogleDrive(experiment);
      } catch (error) {
        console.error(`Failed to auto-export ${experiment.experimentId} to Google Drive:`, error);
      }
    }

    return NextResponse.json({ data: experiment });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message.includes("Write operations are disabled")
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unexpected error updating experiment." },
      { status: 500 },
    );
  }
}
