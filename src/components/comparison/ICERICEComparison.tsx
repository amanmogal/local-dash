'use client';

import { useMemo, useState } from "react";

import type { Experiment } from "@/lib/types/experiments";

interface ICERICEComparisonProps {
  experiments: Experiment[];
}

export function ICERICEComparison({ experiments }: ICERICEComparisonProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"ice" | "rice" | "combined">("combined");

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
      if (sortBy === "ice") {
        return b.iceScore - a.iceScore;
      }
      if (sortBy === "rice") {
        const riceA = a.riceScore ?? 0;
        const riceB = b.riceScore ?? 0;
        return riceB - riceA;
      }
      const combinedA = a.iceScore + (a.riceScore ?? 0) * 10;
      const combinedB = b.iceScore + (b.riceScore ?? 0) * 10;
      return combinedB - combinedA;
    });

    return sorted;
  }, [experiments, selectedCategory, sortBy]);

  const getICEPriority = (score: number) => {
    if (score > 200) {
      return { label: "HIGH", className: "badge--high" };
    }
    if (score > 100) {
      return { label: "MEDIUM", className: "badge--medium" };
    }
    return { label: "LOW", className: "badge--low" };
  };

  const getRICERecommendation = (score: number | null) => {
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

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h2>ICE vs RICE Comparison</h2>
          <p className="panel__muted">
            Compare experiments using both ICE and RICE scoring methods. Use ICE for
            quick experiments, RICE for product features.
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "ice" | "rice" | "combined")}
          >
            <option value="combined">Combined Score</option>
            <option value="ice">ICE Score</option>
            <option value="rice">RICE Score</option>
          </select>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Experiment Name</th>
              <th>ICE Score</th>
              <th>ICE Priority</th>
              <th>RICE Score</th>
              <th>RICE Decision</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                  <p className="panel__muted">No experiments found matching filters.</p>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((experiment) => {
                const icePriority = getICEPriority(experiment.iceScore);
                const riceRecommendation = getRICERecommendation(experiment.riceScore);
                return (
                  <tr key={experiment.id}>
                    <td>{experiment.name}</td>
                    <td>
                      <strong>{experiment.iceScore}</strong>
                    </td>
                    <td>
                      <span className={`badge ${icePriority.className}`}>
                        {icePriority.label}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {experiment.riceScore !== null
                          ? experiment.riceScore.toFixed(2)
                          : "—"}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${riceRecommendation.className}`}>
                        {riceRecommendation.label}
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

