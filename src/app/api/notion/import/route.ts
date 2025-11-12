import { NextResponse } from "next/server";

import { getServerEnv } from "@/lib/env";
import { getNotionClient } from "@/lib/notion/client";

type DatabasesWithQuery = typeof getNotionClient extends () => infer Client
  ? Client extends { databases: infer Databases }
    ? Databases & { query: (args: { database_id: string }) => Promise<{ results: unknown[] }> }
    : never
  : never;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = getNotionClient();

    if (!client) {
      return NextResponse.json(
        {
          error:
            "Notion integration not configured. Set NOTION_API_TOKEN in .env.local",
        },
        { status: 400 },
      );
    }

    const { notionDatabaseId } = getServerEnv();

    if (!notionDatabaseId) {
      return NextResponse.json(
        {
          error:
            "Notion database ID not configured. Set NOTION_DATABASE_ID in .env.local",
        },
        { status: 400 },
      );
    }

    const databases = client.databases as DatabasesWithQuery;
    const response = await databases.query({
      database_id: notionDatabaseId,
    });

    const experiments = response.results.map((page: unknown) => {
      const pageObj = page as { id: string; url: string; properties: Record<string, unknown>; last_edited_time: string };
      const props = pageObj.properties as Record<string, unknown>;

      const getTitle = (prop: unknown) => {
        if (prop && typeof prop === "object" && "title" in prop) {
          const title = prop.title;
          if (Array.isArray(title) && title.length > 0 && typeof title[0] === "object" && title[0] !== null && "text" in title[0]) {
            const text = title[0].text;
            if (typeof text === "object" && text !== null && "content" in text && typeof text.content === "string") {
              return text.content;
            }
          }
        }
        return "";
      };

      const getRichText = (prop: unknown) => {
        if (prop && typeof prop === "object" && "rich_text" in prop) {
          const richText = prop.rich_text;
          if (Array.isArray(richText) && richText.length > 0 && typeof richText[0] === "object" && richText[0] !== null && "text" in richText[0]) {
            const text = richText[0].text;
            if (typeof text === "object" && text !== null && "content" in text && typeof text.content === "string") {
              return text.content;
            }
          }
        }
        return "";
      };

      const getSelect = (prop: unknown) => {
        if (prop && typeof prop === "object" && "select" in prop) {
          const select = prop.select;
          if (typeof select === "object" && select !== null && "name" in select && typeof select.name === "string") {
            return select.name;
          }
        }
        return null;
      };

      const getNumber = (prop: unknown) => {
        if (prop && typeof prop === "object" && "number" in prop) {
          const number = prop.number;
          if (typeof number === "number") {
            return number;
          }
        }
        return 0;
      };

      const getDate = (prop: unknown) => {
        if (prop && typeof prop === "object" && "date" in prop) {
          const date = prop.date;
          if (typeof date === "object" && date !== null && "start" in date && typeof date.start === "string") {
            return date.start;
          }
        }
        return null;
      };

      return {
        notionPageId: pageObj.id,
        notionUrl: pageObj.url,
        name: getTitle(props["Experiment Name"]),
        category: getSelect(props.Category) ?? "",
        iceScore: getNumber(props["ICE Score"]),
        status: getSelect(props.Status) ?? "",
        owner: getRichText(props.Owner),
        startDate: getDate(props["Start Date"]),
        endDate: getDate(props["End Date"]),
        hypothesis: getRichText(props.Hypothesis),
        successCriteria: getRichText(props["Success Criteria"]),
        outcome: getSelect(props.Outcome),
        learnings: getRichText(props.Learnings) || null,
        lastEdited: pageObj.last_edited_time,
      };
    });

    return NextResponse.json({
      success: true,
      count: experiments.length,
      experiments,
    });
  } catch (error) {
    console.error("Notion import error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error importing from Notion",
      },
      { status: 500 },
    );
  }
}

