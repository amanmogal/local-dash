'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ScoreDistributionChartProps {
  data: Array<{ range: string; iceCount: number; riceCount: number }>;
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No experiments with scores yet. Create experiments to see score distribution.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="range"
            style={{ fontSize: "0.75rem", fill: "#cbd5f5" }}
          />
          <YAxis style={{ fontSize: "0.75rem", fill: "#cbd5f5" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#cbd5f5" }}
            iconType="circle"
          />
          <Bar dataKey="iceCount" fill="#3b82f6" name="ICE Score" radius={[8, 8, 0, 0]} />
          <Bar dataKey="riceCount" fill="#8b5cf6" name="RICE Score" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

