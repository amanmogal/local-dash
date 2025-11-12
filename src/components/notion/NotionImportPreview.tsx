'use client';

import { useEffect, useState } from "react";

interface NotionExperiment {
  notionPageId: string;
  notionUrl: string;
  name: string;
  category: string;
  iceScore: number;
  status: string;
  owner: string;
  startDate: string | null;
  endDate: string | null;
  hypothesis: string;
  successCriteria: string;
  outcome: string | null;
  learnings: string | null;
  lastEdited: string;
}

export function NotionImportPreview() {
  const [experiments, setExperiments] = useState<NotionExperiment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotionExperiments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notion/import");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to import from Notion");
      }

      setExperiments(result.experiments ?? []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unexpected error importing from Notion";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotionExperiments();
  }, []);

  if (isLoading) {
    return (
      <div className="panel">
        <p className="panel__muted">Loading experiments from Notion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <p className="notion-sync__status notion-sync__status--error">{error}</p>
        <button type="button" className="btn" onClick={fetchNotionExperiments}>
          Retry
        </button>
      </div>
    );
  }

  if (experiments.length === 0) {
    return (
      <div className="panel">
        <h2>Notion Import Preview</h2>
        <p className="panel__muted">No experiments found in Notion database.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h2>Notion Import Preview</h2>
          <p className="panel__muted">
            Found {experiments.length} experiments in Notion. Review and import to
            dashboard.
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={fetchNotionExperiments}>
          Refresh
        </button>
      </header>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>ICE</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Last Edited</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((experiment) => (
              <tr key={experiment.notionPageId}>
                <td>{experiment.name}</td>
                <td>{experiment.category}</td>
                <td>{experiment.iceScore}</td>
                <td>
                  <span className={`badge badge--${experiment.status.toLowerCase()}`}>
                    {experiment.status}
                  </span>
                </td>
                <td>{experiment.owner}</td>
                <td>
                  {new Date(experiment.lastEdited).toLocaleDateString()}
                </td>
                <td>
                  <a
                    href={experiment.notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
                  >
                    View in Notion
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

