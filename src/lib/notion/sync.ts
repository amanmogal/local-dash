import type { Experiment } from "../types/experiments";
import { getServerEnv } from "../env";
import { getNotionClient, isNotionConfigured } from "./client";
import { experimentToNotionProperties } from "./mappers";
import type { NotionSyncResult } from "./types";

export { isNotionConfigured };

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(RETRY_DELAY_MS);
    return retryOperation(operation, retries - 1);
  }
};

const toNotionProperties = (
  properties: ReturnType<typeof experimentToNotionProperties>,
): Record<string, unknown> => properties as unknown as Record<string, unknown>;

export const syncExperimentToNotion = async (
  experiment: Experiment,
  dashboardUrl?: string,
): Promise<NotionSyncResult> => {
  const client = getNotionClient();

  if (!client) {
    return {
      success: false,
      error: "Notion client not configured. Set NOTION_API_TOKEN in .env.local",
    };
  }

  const { notionDatabaseId } = getServerEnv();

  if (!notionDatabaseId) {
    return {
      success: false,
      error: "Notion database ID not configured. Set NOTION_DATABASE_ID in .env.local",
    };
  }

  try {
    const properties = toNotionProperties(
      experimentToNotionProperties(experiment, dashboardUrl),
    );

    const page = await retryOperation(() =>
      client.pages.create({
        parent: {
          database_id: notionDatabaseId,
        },
        properties,
      }),
    );

    return {
      success: true,
      notionPageId: page.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error syncing to Notion";
    console.error("Notion sync error:", errorMessage, error);

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const updateExperimentInNotion = async (
  notionPageId: string,
  experiment: Experiment,
  dashboardUrl?: string,
): Promise<NotionSyncResult> => {
  const client = getNotionClient();

  if (!client) {
    return {
      success: false,
      error: "Notion client not configured. Set NOTION_API_TOKEN in .env.local",
    };
  }

  try {
    const properties = toNotionProperties(
      experimentToNotionProperties(experiment, dashboardUrl),
    );

    await retryOperation(() =>
      client.pages.update({
        page_id: notionPageId,
        properties,
      }),
    );

    return {
      success: true,
      notionPageId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error updating Notion page";
    console.error("Notion update error:", errorMessage, error);

    return {
      success: false,
      error: errorMessage,
    };
  }
};

