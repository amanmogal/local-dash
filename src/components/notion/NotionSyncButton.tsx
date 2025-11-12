'use client';

import { useState } from "react";

interface NotionSyncButtonProps {
  experimentId?: string;
  syncAll?: boolean;
  onSyncComplete?: (result: { success: boolean; error?: string }) => void;
}

export function NotionSyncButton({
  experimentId,
  syncAll = false,
  onSyncComplete,
}: NotionSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus({ success: false, message: null });

    try {
      const response = await fetch("/api/notion/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId,
          syncAll,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to sync to Notion");
      }

      const successMessage = syncAll
        ? `Synced ${result.synced} of ${result.total} experiments to Notion`
        : "Experiment synced to Notion successfully";

      setSyncStatus({ success: true, message: successMessage });
      onSyncComplete?.({ success: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unexpected error syncing to Notion";
      setSyncStatus({ success: false, message: errorMessage });
      onSyncComplete?.({ success: false, error: errorMessage });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="notion-sync">
      <button
        type="button"
        className="btn btn--ghost"
        onClick={handleSync}
        disabled={isSyncing}
      >
        {isSyncing ? "Syncing..." : syncAll ? "Sync All to Notion" : "Sync to Notion"}
      </button>
      {syncStatus.message && (
        <p
          className={`notion-sync__status ${
            syncStatus.success ? "notion-sync__status--success" : "notion-sync__status--error"
          }`}
        >
          {syncStatus.message}
        </p>
      )}
    </div>
  );
}

