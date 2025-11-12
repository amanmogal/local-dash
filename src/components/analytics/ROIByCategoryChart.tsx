'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import type { ROIData } from "@/lib/analytics/metrics";

interface ROIByCategoryChartProps {
  data: ROIData[];
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

type ROIPayload = ROIData;

const formatRoiTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
  value,
  _name,
  tooltipProps,
) => {
  const payload = tooltipProps?.payload as ROIPayload | undefined;
  if (!payload) {
    return [value, "ROI"];
  }
  const formattedValue = `${Math.round(Number(value))}% ROI`;
  const experimentsLabel = `${payload.experimentCount} experiments`;
  return [formattedValue, experimentsLabel];
};

const formatRoiLabel: TooltipProps<ValueType, NameType>["labelFormatter"] = (
  label,
  payload,
) => {
  const firstPayload = payload && payload[0];
  const data = firstPayload?.payload as ROIPayload | undefined;
  if (!data) {
    return label;
  }
  const cost = data.totalCost.toLocaleString();
  const valueTotal = data.totalValue.toLocaleString();
  return `${label} (₹${cost} cost, ₹${valueTotal} value)`;
};

export function ROIByCategoryChart({ data }: ROIByCategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>
          No completed experiments with cost/value data yet. Complete experiments with cost
          and results to see ROI by category.
        </p>
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
          <YAxis
            tickFormatter={(value) => `${Math.round(value)}%`}
            style={{ fontSize: "0.75rem" }}
          />
          <Tooltip formatter={formatRoiTooltip} labelFormatter={formatRoiLabel} />
          <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.roi >= 0 ? COLORS[0] : COLORS[2]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

