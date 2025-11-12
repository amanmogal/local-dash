import type { Experiment } from "../types/experiments";

export interface SuccessRateDataPoint {
  date: string;
  successRate: number;
  targetThreshold: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface TimeToLearningData {
  range: string;
  count: number;
}

export interface ROIData {
  category: string;
  totalCost: number;
  totalValue: number;
  roi: number;
  experimentCount: number;
}

export interface ExperimentsOverTimeData {
  date: string;
  total: number;
  completed: number;
  live: number;
  planning: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export const calculateSuccessRateTrend = (
  experiments: Experiment[],
  targetThreshold = 0.7,
): SuccessRateDataPoint[] => {
  const completed = experiments.filter((exp) => exp.status === "completed");
  if (completed.length === 0) {
    return [];
  }

  const sortedByDate = [...completed].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
    const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
    return dateA - dateB;
  });

  const dataPoints: SuccessRateDataPoint[] = [];
  let successCount = 0;
  let totalCount = 0;

  for (const experiment of sortedByDate) {
    totalCount += 1;
    if (experiment.outcome === "success") {
      successCount += 1;
    }

    const successRate = totalCount > 0 ? successCount / totalCount : 0;
    const date = experiment.endDate || experiment.updatedAt || experiment.createdAt;

    dataPoints.push({
      date,
      successRate,
      targetThreshold,
    });
  }

  return dataPoints;
};

export const calculateCategoryDistribution = (
  experiments: Experiment[],
): CategoryDistribution[] => {
  const categoryCounts: Record<string, number> = {};

  for (const experiment of experiments) {
    categoryCounts[experiment.category] =
      (categoryCounts[experiment.category] ?? 0) + 1;
  }

  const total = experiments.length;
  if (total === 0) {
    return [];
  }

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category.replace(/_/g, " "),
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateTimeToLearning = (
  experiments: Experiment[],
): TimeToLearningData[] => {
  const completed = experiments.filter(
    (exp) => exp.status === "completed" && exp.startDate && exp.endDate,
  );

  if (completed.length === 0) {
    return [
      { range: "0-7 days", count: 0 },
      { range: "8-14 days", count: 0 },
      { range: "15-30 days", count: 0 },
      { range: "31-60 days", count: 0 },
      { range: "60+ days", count: 0 },
    ];
  }

  const ranges: Record<string, number> = {
    "0-7 days": 0,
    "8-14 days": 0,
    "15-30 days": 0,
    "31-60 days": 0,
    "60+ days": 0,
  };

  for (const experiment of completed) {
    if (!experiment.startDate || !experiment.endDate) continue;

    const start = new Date(experiment.startDate);
    const end = new Date(experiment.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 7) {
      ranges["0-7 days"] += 1;
    } else if (days <= 14) {
      ranges["8-14 days"] += 1;
    } else if (days <= 30) {
      ranges["15-30 days"] += 1;
    } else if (days <= 60) {
      ranges["31-60 days"] += 1;
    } else {
      ranges["60+ days"] += 1;
    }
  }

  return Object.entries(ranges).map(([range, count]) => ({
    range,
    count,
  }));
};

export const calculateROIByCategory = (
  experiments: Experiment[],
): ROIData[] => {
  const categoryData: Record<
    string,
    { cost: number; value: number; count: number }
  > = {};

  for (const experiment of experiments) {
    if (experiment.status !== "completed") continue;

    const category = experiment.category.replace(/_/g, " ");
    const cost = experiment.costInInr ?? 0;
    const value = experiment.actualResult ?? 0;

    if (!categoryData[category]) {
      categoryData[category] = { cost: 0, value: 0, count: 0 };
    }

    categoryData[category].cost += cost;
    categoryData[category].value += value;
    categoryData[category].count += 1;
  }

  return Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      totalCost: data.cost,
      totalValue: data.value,
      roi: data.cost > 0 ? ((data.value - data.cost) / data.cost) * 100 : 0,
      experimentCount: data.count,
    }))
    .sort((a, b) => b.roi - a.roi);
};

export const calculateExperimentsOverTime = (
  experiments: Experiment[],
): ExperimentsOverTimeData[] => {
  if (experiments.length === 0) {
    return [];
  }

  const dateMap: Record<string, { total: number; completed: number; live: number; planning: number }> = {};

  for (const experiment of experiments) {
    const date = experiment.createdAt.split("T")[0];
    
    if (!dateMap[date]) {
      dateMap[date] = { total: 0, completed: 0, live: 0, planning: 0 };
    }

    dateMap[date].total += 1;

    if (experiment.status === "completed") {
      dateMap[date].completed += 1;
    } else if (experiment.status === "live") {
      dateMap[date].live += 1;
    } else if (experiment.status === "planning") {
      dateMap[date].planning += 1;
    }
  }

  return Object.entries(dateMap)
    .map(([date, counts]) => ({
      date,
      ...counts,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const calculateStatusDistribution = (
  experiments: Experiment[],
): StatusDistribution[] => {
  const statusCounts: Record<string, number> = {};

  for (const experiment of experiments) {
    statusCounts[experiment.status] = (statusCounts[experiment.status] ?? 0) + 1;
  }

  const total = experiments.length;
  if (total === 0) {
    return [];
  }

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
};

export interface ScoreDistributionData {
  range: string;
  iceCount: number;
  riceCount: number;
}

export const calculateScoreDistribution = (
  experiments: Experiment[],
): ScoreDistributionData[] => {
  const iceRanges: Record<string, number> = {
    "0-100": 0,
    "101-200": 0,
    "201-400": 0,
    "401-600": 0,
    "600+": 0,
  };

  const riceRanges: Record<string, number> = {
    "0-2": 0,
    "2.1-5": 0,
    "5.1-10": 0,
    "10.1-20": 0,
    "20+": 0,
  };

  for (const experiment of experiments) {
    const iceScore = experiment.iceScore;
    if (iceScore <= 100) {
      iceRanges["0-100"] += 1;
    } else if (iceScore <= 200) {
      iceRanges["101-200"] += 1;
    } else if (iceScore <= 400) {
      iceRanges["201-400"] += 1;
    } else if (iceScore <= 600) {
      iceRanges["401-600"] += 1;
    } else {
      iceRanges["600+"] += 1;
    }

    if (experiment.riceScore !== null && experiment.riceScore !== undefined) {
      const riceScore = experiment.riceScore;
      if (riceScore <= 2) {
        riceRanges["0-2"] += 1;
      } else if (riceScore <= 5) {
        riceRanges["2.1-5"] += 1;
      } else if (riceScore <= 10) {
        riceRanges["5.1-10"] += 1;
      } else if (riceScore <= 20) {
        riceRanges["10.1-20"] += 1;
      } else {
        riceRanges["20+"] += 1;
      }
    }
  }

  const iceRangeKeys = ["0-100", "101-200", "201-400", "401-600", "600+"];
  
  return iceRangeKeys.map((range) => ({
    range: `ICE ${range}`,
    iceCount: iceRanges[range] || 0,
    riceCount: 0,
  })).concat(
    ["0-2", "2.1-5", "5.1-10", "10.1-20", "20+"].map((range) => ({
      range: `RICE ${range}`,
      iceCount: 0,
      riceCount: riceRanges[range] || 0,
    }))
  );
};

export interface OutcomeDistributionData {
  outcome: string;
  count: number;
  percentage: number;
}

export const calculateOutcomeDistribution = (
  experiments: Experiment[],
): OutcomeDistributionData[] => {
  const completed = experiments.filter(
    (exp) => exp.status === "completed" && exp.outcome !== null,
  );

  if (completed.length === 0) {
    return [];
  }

  const outcomeCounts: Record<string, number> = {};

  for (const experiment of completed) {
    if (experiment.outcome) {
      outcomeCounts[experiment.outcome] = (outcomeCounts[experiment.outcome] ?? 0) + 1;
    }
  }

  const total = completed.length;

  return Object.entries(outcomeCounts)
    .map(([outcome, count]) => ({
      outcome: outcome.charAt(0).toUpperCase() + outcome.slice(1),
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
};

