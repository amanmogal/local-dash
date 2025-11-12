'use client';

import { useMemo, useState } from "react";

import type { Experiment } from "@/lib/types/experiments";

interface RICERankingTableProps {
  experiments: Experiment[];
}

export function RICERankingTable({ experiments }: RICERankingTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(experiments.map((exp) => exp.category));
    return Array.from(uniqueCategories).sort();
  }, [experiments]);

  const filteredAndSorted = useMemo(() => {
    let filtered = experiments.filter((exp) => exp.riceScore !== null);

    if (selectedCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === selectedCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      const scoreA = a.riceScore ?? 0;
      const scoreB = b.riceScore ?? 0;
      if (sortOrder === "desc") {
        return scoreB - scoreA;
      }
      return scoreA - scoreB;
    });

    return sorted;
  }, [experiments, selectedCategory, sortOrder]);

  const getRecommendationBadge = (score: number | null) => {
    if (score === null) {
      return { label: "N/A", className: "badge--low" };
    }
    if (score > 5) {
      return { label: "BUILD", className: "badge--build" };
    }
    if (score > 2) {
      return { label: "VALIDATE", className: "badge--validate-more" };
    }
    return { label: "DON'T BUILD", className: "badge--dont-build" };
  };

  const getRank = (index: number) => {
    return index + 1;
  };

  if (filteredAndSorted.length === 0) {
    return (
      <div className="panel">
        <h2>Experiments Ranked by RICE Score</h2>
        <p className="panel__muted">
          No experiments with RICE scores found. Add RICE scores to experiments to
          see rankings.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h2>Experiments Ranked by RICE Score</h2>
          <p className="panel__muted">
            Compare experiments by (Reach × Impact × Confidence) / Effort. Higher
            scores indicate higher priority for building.
          </p>
        </div>
        <div className="ice-ranking__controls">
          <select
            className="form__filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
          <select
            className="form__filter"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Experiment Name</th>
              <th>Reach</th>
              <th>Impact</th>
              <th>Conf</th>
              <th>Effort</th>
              <th>RICE</th>
              <th>Decision</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((experiment, index) => {
              const recommendation = getRecommendationBadge(experiment.riceScore);
              return (
                <tr key={experiment.id}>
                  <td>
                    <strong>#{getRank(index)}</strong>
                  </td>
                  <td>{experiment.name}</td>
                  <td>{experiment.riceReach ?? "—"}</td>
                  <td>{experiment.riceImpact ?? "—"}</td>
                  <td>{experiment.riceConfidence ? `${experiment.riceConfidence}%` : "—"}</td>
                  <td>{experiment.riceEffort ?? "—"}</td>
                  <td>
                    <strong>
                      {experiment.riceScore !== null
                        ? experiment.riceScore.toFixed(2)
                        : "—"}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${recommendation.className}`}>
                      {recommendation.label}
                    </span>
                  </td>
                  <td>
                    {experiment.category.replace(/_/g, " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase(),
                    )}
                  </td>
                  <td>{experiment.owner}</td>
                  <td>
                    <span className={`badge badge--${experiment.status}`}>
                      {experiment.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ice-ranking__summary">
        <p className="panel__muted">
          Showing {filteredAndSorted.length} of {experiments.length} experiments
          {selectedCategory !== "all" && ` in ${selectedCategory.replace(/_/g, " ")}`}
        </p>
      </div>
    </div>
  );
}

