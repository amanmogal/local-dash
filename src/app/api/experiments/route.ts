import { NextResponse } from "next/server";

import {
  buildOverviewSummary,
  createExperiment,
  listExperiments,
} from "@/lib/experiments/queries";
import { isNotionConfigured, syncExperimentToNotion } from "@/lib/notion/sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiments = await listExperiments();
    const summary = buildOverviewSummary(experiments);

    return NextResponse.json({ data: experiments, summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Unable to fetch experiments. Check server logs for details.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { syncToNotion, ...experimentData } = payload;
    const experiment = await createExperiment(experimentData);

    let notionSyncResult = null;
    if (syncToNotion && isNotionConfigured()) {
      try {
        notionSyncResult = await syncExperimentToNotion(experiment);
      } catch (syncError) {
        console.warn("Notion sync failed (non-blocking):", syncError);
      }
    }

    return NextResponse.json(
      {
        data: experiment,
        notionSync: notionSyncResult,
      },
      { status: 201 },
    );
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
      { error: "Unexpected error creating experiment." },
      { status: 500 },
    );
  }
}

