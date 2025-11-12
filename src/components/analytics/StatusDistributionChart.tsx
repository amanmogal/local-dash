'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import type { StatusDistribution } from "@/lib/analytics/metrics";

interface StatusDistributionChartProps {
  data: StatusDistribution[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#6366f1", "#ec4899"];

type StatusDistributionPoint = StatusDistribution;

const formatStatusLabel = (props: PieLabelRenderProps): string => {
  const payload = props.payload as StatusDistributionPoint | undefined;
  const status = payload?.status ?? "";
  const percentage = payload ? payload.percentage.toFixed(1) : "0.0";
  return `${status}: ${percentage}%`;
};

const formatStatusTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
  value,
  _name,
  tooltipProps,
) => {
  const payload = tooltipProps?.payload as StatusDistributionPoint | undefined;
  if (!payload) {
    return [value, "Status"];
  }
  const formattedValue = `${value} (${payload.percentage.toFixed(1)}%)`;
  return [formattedValue, payload.status];
};

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No experiments yet. Create experiments to see status distribution.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            nameKey="status"
            labelLine={false}
            label={formatStatusLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
            }}
            formatter={formatStatusTooltip}
          />
          <Legend
            wrapperStyle={{ color: "#cbd5f5" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

