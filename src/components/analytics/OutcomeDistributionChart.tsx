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

interface OutcomeDistributionChartProps {
  data: Array<{ outcome: string; count: number; percentage: number }>;
}

const OUTCOME_COLORS: Record<string, string> = {
  Success: "#10b981",
  Fail: "#ef4444",
  Inconclusive: "#f59e0b",
};

type OutcomeDataPoint = OutcomeDistributionChartProps["data"][number];

const formatOutcomeLabel = (props: PieLabelRenderProps): string => {
  const payload = props.payload as OutcomeDataPoint | undefined;
  const outcome = payload?.outcome ?? "";
  const percentage = payload ? payload.percentage.toFixed(1) : "0.0";
  return `${outcome}: ${percentage}%`;
};

const formatOutcomeTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
  value,
  _name,
  tooltipProps,
) => {
  const payload = tooltipProps?.payload as OutcomeDataPoint | undefined;
  if (!payload) {
    return [value, "Outcome"];
  }
  const formattedValue = `${value} (${payload.percentage.toFixed(1)}%)`;
  return [formattedValue, payload.outcome];
};

export function OutcomeDistributionChart({ data }: OutcomeDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No completed experiments yet. Complete experiments to see outcome distribution.</p>
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
            nameKey="outcome"
            labelLine={false}
            label={formatOutcomeLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={OUTCOME_COLORS[entry.outcome] || "#6366f1"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
            }}
            formatter={formatOutcomeTooltip}
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

