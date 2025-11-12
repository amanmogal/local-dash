import { NotionImportPreview } from "@/components/notion/NotionImportPreview";
import { NotionSyncButton } from "@/components/notion/NotionSyncButton";
import { isNotionConfigured } from "@/lib/notion/sync";

export default function NotionPage() {
  const notionConfigured = isNotionConfigured();

  if (!notionConfigured) {
    return (
      <>
        <article className="panel">
          <h1>Notion Integration</h1>
          <p className="panel__muted">
            Notion integration is not configured. To enable:
          </p>
          <ol className="ordered-list">
            <li>Create a Notion integration at https://www.notion.so/my-integrations</li>
            <li>Copy your integration token</li>
            <li>Share your Notion database with the integration</li>
            <li>Copy your database ID from the database URL</li>
            <li>
              Add NOTION_API_TOKEN and NOTION_DATABASE_ID to your .env.local file
            </li>
          </ol>
        </article>
      </>
    );
  }

  return (
    <>
      <article className="panel">
        <div className="panel__header">
          <div>
            <h1>Notion Integration</h1>
            <p className="panel__muted">
              Sync experiments between the dashboard and Notion. Changes in Notion can
              be imported back to the dashboard.
            </p>
          </div>
          <NotionSyncButton syncAll={true} />
        </div>
      </article>
      <NotionImportPreview />
    </>
  );
}

