interface StatusSummaryProps {
  statusCounts: Record<string, number>;
}

const order = [
  "backlog",
  "planning",
  "scheduled",
  "live",
  "analyzing",
  "completed",
  "archived",
];

export function StatusSummary({ statusCounts }: StatusSummaryProps) {
  const entries = order
    .map((status) => ({ status, count: statusCounts[status] ?? 0 }))
    .filter((item) => item.count > 0);

  if (entries.length === 0) {
    return <p className="panel__muted">No experiments logged yet.</p>;
  }

  return (
    <ul className="status-summary">
      {entries.map((item) => (
        <li key={item.status}>
          <span className={`badge badge--${item.status}`}>{item.status}</span>
          <span>{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

