'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import type { CategoryDistribution } from "@/lib/analytics/metrics";

interface CategoryDistributionChartProps {
  data: CategoryDistribution[];
  variant?: "pie" | "bar";
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const formatPieLabel = (props: PieLabelRenderProps): string => {
  const payload = props.payload as CategoryDistribution | undefined;
  const category = payload?.category ?? "";
  const percentage = payload ? Math.round(payload.percentage) : 0;
  return `${category}: ${percentage}%`;
};

const formatPieTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
  value,
  _name,
  tooltipProps,
) => {
  const payload = tooltipProps?.payload as CategoryDistribution | undefined;
  if (!payload) {
    return [value, "Category"];
  }
  const formattedValue = `${value} experiments (${Math.round(payload.percentage)}%)`;
  return [formattedValue, payload.category];
};

const formatBarTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
  value,
  _name,
  tooltipProps,
) => {
  const payload = tooltipProps?.payload as CategoryDistribution | undefined;
  if (!payload) {
    return [value, "Count"];
  }
  const formattedValue = `${value} experiments (${Math.round(payload.percentage)}%)`;
  return [formattedValue, "Count"];
};

export function CategoryDistributionChart({
  data,
  variant = "bar",
}: CategoryDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No experiments yet. Create experiments to see category distribution.</p>
      </div>
    );
  }

  if (variant === "pie") {
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              nameKey="category"
              labelLine={false}
              label={formatPieLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatPieTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={80}
            style={{ fontSize: "0.75rem" }}
          />
          <YAxis style={{ fontSize: "0.75rem" }} />
          <Tooltip formatter={formatBarTooltip} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

