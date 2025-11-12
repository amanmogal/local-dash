'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TimeToLearningData } from "@/lib/analytics/metrics";

interface TimeToLearningChartProps {
  data: TimeToLearningData[];
}

export function TimeToLearningChart({ data }: TimeToLearningChartProps) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="chart-placeholder">
        <p>
          No completed experiments yet. Complete experiments with start and end dates to see
          time to learning distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="range"
            style={{ fontSize: "0.75rem" }}
          />
          <YAxis style={{ fontSize: "0.75rem" }} />
          <Tooltip
            formatter={(value: number) => [`${value} experiments`, "Count"]}
          />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

