'use client';

import { useMemo, useState } from "react";

import type { Experiment } from "@/lib/types/experiments";

interface ICERankingTableProps {
  experiments: Experiment[];
}

export function ICERankingTable({ experiments }: ICERankingTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(experiments.map((exp) => exp.category));
    return Array.from(uniqueCategories).sort();
  }, [experiments]);

  const filteredAndSorted = useMemo(() => {
    let filtered = experiments;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === selectedCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.iceScore - a.iceScore;
      }
      return a.iceScore - b.iceScore;
    });

    return sorted;
  }, [experiments, selectedCategory, sortOrder]);

  const getPriorityBadge = (score: number) => {
    if (score > 200) {
      return { label: "HIGH", className: "badge--high" };
    }
    if (score > 100) {
      return { label: "MEDIUM", className: "badge--medium" };
    }
    return { label: "LOW", className: "badge--low" };
  };

  const getRank = (index: number) => {
    return index + 1;
  };

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h2>Experiments Ranked by ICE Score</h2>
          <p className="panel__muted">
            Compare experiments by Impact × Confidence × Ease. Higher scores indicate
            higher priority.
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
              <th>Impact</th>
              <th>Conf</th>
              <th>Ease</th>
              <th>ICE</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "2rem" }}>
                  <p className="panel__muted">No experiments found matching filters.</p>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((experiment, index) => {
                const priority = getPriorityBadge(experiment.iceScore);
                return (
                  <tr key={experiment.id}>
                    <td>
                      <strong>#{getRank(index)}</strong>
                    </td>
                    <td>{experiment.name}</td>
                    <td>{experiment.impactScore}</td>
                    <td>{experiment.confidenceScore}</td>
                    <td>{experiment.easeScore}</td>
                    <td>
                      <strong>{experiment.iceScore}</strong>
                    </td>
                    <td>
                      <span className={`badge ${priority.className}`}>{priority.label}</span>
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
              })
            )}
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

