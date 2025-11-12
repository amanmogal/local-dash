import type { Experiment } from "../types/experiments";
import { getGoogleDriveClient, isGoogleDriveConfigured } from "./client";
import { getServerEnv } from "../env";

export interface GoogleDriveSyncResult {
  success: boolean;
  googleDriveFileId?: string;
  googleDriveUrl?: string;
  error?: string;
}

const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error("Operation failed after retries");
};

const ensureFolderExists = async (
  drive: NonNullable<ReturnType<typeof getGoogleDriveClient>>,
  folderName: string,
  parentFolderId: string,
): Promise<string> => {
  const { googleDriveFolderId } = getServerEnv();
  if (!googleDriveFolderId) {
    throw new Error("Google Drive folder ID not configured");
  }

  const existingFolders = await drive.files.list({
    q: `name='${folderName}' and parents in '${parentFolderId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (existingFolders.data.files && existingFolders.data.files.length > 0) {
    return existingFolders.data.files[0].id!;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id, name, webViewLink",
  });

  return folder.data.id!;
};

const createExperimentScorecard = (experiment: Experiment): string => {
  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatScore = (score: number | null) => {
    if (score === null) return "N/A";
    return score.toFixed(2);
  };

  const getOutcomeBadge = (outcome: string | null) => {
    if (!outcome) return "Pending";
    return outcome.charAt(0).toUpperCase() + outcome.slice(1);
  };

  return `
# Experiment Scorecard: ${experiment.name}

**Experiment ID:** ${experiment.experimentId}  
**Status:** ${experiment.status}  
**Category:** ${experiment.category.replace(/_/g, " ")}  
**Owner:** ${experiment.owner}  
**Created:** ${formatDate(experiment.createdAt)}  
**Last Updated:** ${formatDate(experiment.updatedAt)}

---

## Scoring

### ICE Score
- **ICE Score:** ${experiment.iceScore}
- **Impact:** ${experiment.impactScore}/10
- **Confidence:** ${experiment.confidenceScore}/10
- **Ease:** ${experiment.easeScore}/10

### RICE Score
- **RICE Score:** ${formatScore(experiment.riceScore)}
- **Reach:** ${experiment.riceReach ?? "N/A"}
- **Impact:** ${experiment.riceImpact ?? "N/A"}
- **Confidence:** ${experiment.riceConfidence ? `${experiment.riceConfidence}%` : "N/A"}
- **Effort:** ${experiment.riceEffort ?? "N/A"} person-weeks

---

## Experiment Details

**Hypothesis:**  
${experiment.hypothesis}

**Success Criteria:**  
${experiment.successCriteria}

**Primary Metric:** ${experiment.primaryMetric}  
**Target Value:** ${experiment.targetValue ?? "N/A"}

**Secondary Metrics:**
${experiment.secondaryMetrics.length > 0 ? experiment.secondaryMetrics.map((m) => `- ${m}`).join("\n") : "None"}

---

## Timeline

**Start Date:** ${formatDate(experiment.startDate)}  
**End Date:** ${formatDate(experiment.endDate)}  
**Duration:** ${experiment.durationDays ?? "N/A"} days  
**Sprint Week:** ${experiment.sprintWeek ?? "N/A"}

---

## Results

**Outcome:** ${getOutcomeBadge(experiment.outcome)}

**Results Before:**  
${experiment.resultsBefore ?? "N/A"}

**Results After:**  
${experiment.resultsAfter ?? "N/A"}

**Actual Result:** ${formatScore(experiment.actualResult)}

---

## Learnings

${experiment.learnings ?? "No learnings documented yet."}

---

## Next Actions

${experiment.nextActions.length > 0 ? experiment.nextActions.map((action) => `- ${action}`).join("\n") : "None"}

---

## Resources

**Budget:** ₹${experiment.costInInr?.toLocaleString() ?? "N/A"}  
**Resources Needed:**
${experiment.resourcesNeeded.length > 0 ? experiment.resourcesNeeded.map((r) => `- ${r}`).join("\n") : "None"}

**Related Experiments:**
${experiment.relatedExperiments.length > 0 ? experiment.relatedExperiments.map((exp) => `- ${exp}`).join("\n") : "None"}

**Tags:** ${experiment.tags.join(", ") || "None"}

**Documentation:** ${experiment.documentationUrl ?? "N/A"}
`.trim();
};

export const exportExperimentToGoogleDrive = async (
  experiment: Experiment,
): Promise<GoogleDriveSyncResult> => {
  const client = getGoogleDriveClient();

  if (!client) {
    return {
      success: false,
      error: "Google Drive integration not configured. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID in .env.local",
    };
  }

  const { googleDriveFolderId } = getServerEnv();

  if (!googleDriveFolderId) {
    return {
      success: false,
      error: "Google Drive folder ID not configured. Set GOOGLE_DRIVE_FOLDER_ID in .env.local",
    };
  }

  if (!client) {
    return {
      success: false,
      error: "Google Drive client not initialized",
    };
  }

  try {
    const categoryFolderName = experiment.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const categoryFolderId = await retryOperation(() =>
      ensureFolderExists(client, categoryFolderName, googleDriveFolderId),
    );

    const scorecardContent = createExperimentScorecard(experiment);
    const fileName = `${experiment.experimentId} - ${experiment.name}.md`;

    const file = await retryOperation(() =>
      client.files.create({
        requestBody: {
          name: fileName,
          mimeType: "text/markdown",
          parents: [categoryFolderId],
        },
        media: {
          mimeType: "text/markdown",
          body: scorecardContent,
        },
        fields: "id, name, webViewLink",
      }),
    );

    return {
      success: true,
      googleDriveFileId: file.data.id!,
      googleDriveUrl: file.data.webViewLink || undefined,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error exporting to Google Drive";
    console.error("Google Drive export error:", errorMessage, error);

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const syncExperimentToGoogleDrive = async (
  experiment: Experiment,
): Promise<GoogleDriveSyncResult> => {
  if (!isGoogleDriveConfigured()) {
    return {
      success: false,
      error: "Google Drive integration not configured",
    };
  }

  return exportExperimentToGoogleDrive(experiment);
};

