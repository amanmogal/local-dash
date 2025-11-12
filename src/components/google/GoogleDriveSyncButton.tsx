'use client';

import { useState } from "react";

interface GoogleDriveSyncButtonProps {
  experimentId?: string;
  syncAll?: boolean;
}

export function GoogleDriveSyncButton({
  experimentId,
  syncAll = false,
}: GoogleDriveSyncButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string | null>(null);

  const handleSync = async () => {
    setStatus("loading");
    setMessage(null);
    setGoogleDriveUrl(null);

    try {
      const endpoint = syncAll
        ? "/api/google-drive/sync-all"
        : "/api/google-drive/sync";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: syncAll ? undefined : JSON.stringify({ experimentId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to sync to Google Drive");
      }

      if (syncAll) {
        setMessage(
          `Synced ${result.successCount} of ${result.total} experiments to Google Drive`,
        );
      } else {
        setMessage("Experiment exported to Google Drive successfully");
        if (result.googleDriveUrl) {
          setGoogleDriveUrl(result.googleDriveUrl);
        }
      }

      setStatus("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unexpected error syncing to Google Drive";
      setMessage(errorMessage);
      setStatus("error");
    }
  };


  return (
    <div className="google-drive-sync">
      <button
        type="button"
        className="btn"
        onClick={handleSync}
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Syncing..."
          : syncAll
            ? "Sync All to Google Drive"
            : "Export to Google Drive"}
      </button>
      {message && (
        <p
          className={`google-drive-sync__status google-drive-sync__status--${status}`}
        >
          {message}
        </p>
      )}
      {googleDriveUrl && (
        <p className="google-drive-sync__link">
          <a href={googleDriveUrl} target="_blank" rel="noopener noreferrer">
            View in Google Drive →
          </a>
        </p>
      )}
    </div>
  );
}

