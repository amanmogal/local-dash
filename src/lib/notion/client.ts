import { Client } from "@notionhq/client";

import { getServerEnv } from "../env";

let notionClient: Client | null = null;

export const getNotionClient = (): Client | null => {
  const { notionToken } = getServerEnv();

  if (!notionToken) {
    return null;
  }

  if (notionClient) {
    return notionClient;
  }

  notionClient = new Client({
    auth: notionToken,
  });

  return notionClient;
};

export const isNotionConfigured = (): boolean => {
  const { notionToken, notionDatabaseId } = getServerEnv();
  return notionToken !== null && notionDatabaseId !== null;
};

