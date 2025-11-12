interface ChartPlaceholderProps {
  title: string;
  description?: string;
}

export function ChartPlaceholder({ title, description }: ChartPlaceholderProps) {
  return (
    <div className="chart-placeholder">
      <p className="chart-placeholder__title">{title}</p>
      {description ? (
        <p className="chart-placeholder__description">{description}</p>
      ) : null}
    </div>
  );
}

