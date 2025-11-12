import type { Experiment } from "../types/experiments";
import type { NotionExperimentProperties } from "./types";

export const experimentToNotionProperties = (
  experiment: Experiment,
  dashboardUrl?: string,
): NotionExperimentProperties => {
  const formatDate = (date: string | null) => {
    if (!date) {
      return null;
    }
    return date;
  };

  const formatRichText = (text: string | null) => {
    if (!text) {
      return [];
    }
    return [{ text: { content: text } }];
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) {
      return null;
    }
    return outcome.charAt(0).toUpperCase() + outcome.slice(1);
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return {
    "Experiment Name": {
      title: [{ text: { content: experiment.name } }],
    },
    Category: {
      select: { name: formatCategory(experiment.category) },
    },
    "ICE Score": {
      number: experiment.iceScore,
    },
    Status: {
      select: { name: formatStatus(experiment.status) },
    },
    Owner: {
      rich_text: formatRichText(experiment.owner),
    },
    "Start Date": {
      date: { start: formatDate(experiment.startDate) },
    },
    "End Date": {
      date: { start: formatDate(experiment.endDate) },
    },
    Hypothesis: {
      rich_text: formatRichText(experiment.hypothesis),
    },
    "Success Criteria": {
      rich_text: formatRichText(experiment.successCriteria),
    },
    Outcome: {
      select: { name: formatOutcome(experiment.outcome) },
    },
    Learnings: {
      rich_text: formatRichText(experiment.learnings),
    },
    "Dashboard Link": {
      url: dashboardUrl
        ? `${dashboardUrl}/experiments?exp=${experiment.id}`
        : null,
    },
  };
};

