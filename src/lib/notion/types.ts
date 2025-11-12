export interface NotionExperimentProperties {
  "Experiment Name": { title: Array<{ text: { content: string } }> };
  Category: { select: { name: string } };
  "ICE Score": { number: number };
  Status: { select: { name: string } };
  Owner: { rich_text: Array<{ text: { content: string } }> };
  "Start Date": { date: { start: string | null } };
  "End Date": { date: { start: string | null } };
  Hypothesis: { rich_text: Array<{ text: { content: string } }> };
  "Success Criteria": { rich_text: Array<{ text: { content: string } }> };
  Outcome: { select: { name: string | null } };
  Learnings: { rich_text: Array<{ text: { content: string } }> };
  "Dashboard Link": { url: string | null };
}

export interface NotionSyncResult {
  success: boolean;
  notionPageId?: string;
  error?: string;
}

export interface NotionPage {
  id: string;
  properties: NotionExperimentProperties;
  url: string;
}

