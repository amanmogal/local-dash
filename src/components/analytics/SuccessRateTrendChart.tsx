'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SuccessRateDataPoint } from "@/lib/analytics/metrics";

interface SuccessRateTrendChartProps {
  data: SuccessRateDataPoint[];
}

export function SuccessRateTrendChart({ data }: SuccessRateTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No completed experiments yet. Complete experiments to see success rate trends.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            style={{ fontSize: "0.75rem" }}
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
            domain={[0, 1]}
            style={{ fontSize: "0.75rem" }}
          />
          <Tooltip
            formatter={(value: number) => `${Math.round(value * 100)}%`}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }}
          />
          <Line
            type="monotone"
            dataKey="successRate"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Success Rate"
          />
          <Line
            type="monotone"
            dataKey="targetThreshold"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target Threshold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

