'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ExperimentsOverTimeData } from "@/lib/analytics/metrics";

interface ExperimentsOverTimeChartProps {
  data: ExperimentsOverTimeData[];
}

export function ExperimentsOverTimeChart({ data }: ExperimentsOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No experiments yet. Create experiments to see trends over time.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPlanning" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            style={{ fontSize: "0.75rem", fill: "#cbd5f5" }}
          />
          <YAxis style={{ fontSize: "0.75rem", fill: "#cbd5f5" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
            }}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }}
          />
          <Legend
            wrapperStyle={{ color: "#cbd5f5" }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="2"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            name="Completed"
          />
          <Area
            type="monotone"
            dataKey="live"
            stackId="3"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorLive)"
            name="Live"
          />
          <Area
            type="monotone"
            dataKey="planning"
            stackId="4"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorPlanning)"
            name="Planning"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

