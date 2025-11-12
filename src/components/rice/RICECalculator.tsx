'use client';

import { useMemo, useState } from "react";

import type { RICEImpact } from "@/lib/types/experiments";

interface RICECalculatorProps {
  initialReach?: number;
  initialImpact?: RICEImpact;
  initialConfidence?: number;
  initialEffort?: number;
  onScoreChange?: (score: number, recommendation: string) => void;
  showLabels?: boolean;
}

const RICE_IMPACT_OPTIONS: Array<{ value: RICEImpact; label: string }> = [
  { value: 0.25, label: "0.25 - Minimal (nice-to-have)" },
  { value: 0.5, label: "0.5 - Low" },
  { value: 1, label: "1 - Medium (moderate improvement)" },
  { value: 2, label: "2 - High (significant improvement)" },
  { value: 3, label: "3 - Massive (revenue generator/prevents churn)" },
];

export function RICECalculator({
  initialReach = 50,
  initialImpact = 1,
  initialConfidence = 50,
  initialEffort = 10,
  onScoreChange,
  showLabels = true,
}: RICECalculatorProps) {
  const [reach, setReach] = useState(initialReach);
  const [impact, setImpact] = useState<RICEImpact>(initialImpact);
  const [confidence, setConfidence] = useState(initialConfidence);
  const [effort, setEffort] = useState(initialEffort);

  const riceScore = useMemo(() => {
    if (effort === 0) {
      return 0;
    }
    const confidenceDecimal = confidence / 100;
    return (reach * impact * confidenceDecimal) / effort;
  }, [reach, impact, confidence, effort]);

  const recommendation = useMemo(() => {
    if (riceScore > 5) {
      return "BUILD";
    }
    if (riceScore > 2) {
      return "VALIDATE MORE";
    }
    return "DONT BUILD";
  }, [riceScore]);

  const timeEstimate = useMemo(() => {
    return Math.ceil(effort / 2);
  }, [effort]);

  const getReachLabel = (value: number) => {
    if (value >= 90) {
      return "10,000+ users";
    }
    if (value >= 70) {
      return "5,000-10,000 users";
    }
    if (value >= 40) {
      return "1,000-5,000 users";
    }
    if (value >= 10) {
      return "100-1,000 users";
    }
    return "<100 users";
  };

  const getConfidenceLabel = (value: number) => {
    if (value >= 80) {
      return "Very high (strong data validation)";
    }
    if (value >= 60) {
      return "High (some supporting data)";
    }
    if (value >= 40) {
      return "Medium (educated guess)";
    }
    if (value >= 20) {
      return "Low (limited data)";
    }
    return "Very low (speculation)";
  };

  const getEffortLabel = (value: number) => {
    if (value <= 5) {
      return "<3 person-weeks";
    }
    if (value <= 10) {
      return "3-5 person-weeks";
    }
    if (value <= 20) {
      return "5-10 person-weeks";
    }
    if (value <= 40) {
      return "10-20 person-weeks";
    }
    return "20+ person-weeks";
  };

  const handleReachChange = (value: number) => {
    setReach(value);
    const newScore = value * impact * (confidence / 100) / (effort || 1);
    const newRecommendation = newScore > 5 ? "BUILD" : newScore > 2 ? "VALIDATE MORE" : "DONT BUILD";
    onScoreChange?.(newScore, newRecommendation);
  };

  const handleImpactChange = (value: RICEImpact) => {
    setImpact(value);
    const newScore = reach * value * (confidence / 100) / (effort || 1);
    const newRecommendation = newScore > 5 ? "BUILD" : newScore > 2 ? "VALIDATE MORE" : "DONT BUILD";
    onScoreChange?.(newScore, newRecommendation);
  };

  const handleConfidenceChange = (value: number) => {
    setConfidence(value);
    const newScore = reach * impact * (value / 100) / (effort || 1);
    const newRecommendation = newScore > 5 ? "BUILD" : newScore > 2 ? "VALIDATE MORE" : "DONT BUILD";
    onScoreChange?.(newScore, newRecommendation);
  };

  const handleEffortChange = (value: number) => {
    setEffort(value);
    const newScore = reach * impact * (confidence / 100) / (value || 1);
    const newRecommendation = newScore > 5 ? "BUILD" : newScore > 2 ? "VALIDATE MORE" : "DONT BUILD";
    onScoreChange?.(newScore, newRecommendation);
  };

  return (
    <div className="rice-calculator">
      {showLabels && (
        <header className="rice-calculator__header">
          <h3>RICE Score Calculator</h3>
          <p className="panel__muted">
            Score features by Reach, Impact, Confidence, and Effort. Higher scores
            indicate higher priority for building.
          </p>
        </header>
      )}

      <div className="rice-calculator__grid">
        <div className="rice-slider">
          <label className="rice-slider__label">
            <span>Reach (1-100 users)</span>
            <span className="rice-slider__value">{reach}</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={reach}
            onChange={(e) => handleReachChange(Number(e.target.value))}
            className="rice-slider__input"
            aria-label="Reach score"
          />
          <p className="rice-slider__helper">{getReachLabel(reach)}</p>
        </div>

        <div className="rice-impact">
          <label className="rice-impact__label">
            <span>Impact (0.25 | 0.5 | 1 | 2 | 3)</span>
          </label>
          <div className="rice-impact__options">
            {RICE_IMPACT_OPTIONS.map((option) => (
              <label key={option.value} className="rice-impact__option">
                <input
                  type="radio"
                  name="riceImpact"
                  value={option.value}
                  checked={impact === option.value}
                  onChange={() => handleImpactChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rice-slider">
          <label className="rice-slider__label">
            <span>Confidence (1-100%)</span>
            <span className="rice-slider__value">{confidence}%</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={confidence}
            onChange={(e) => handleConfidenceChange(Number(e.target.value))}
            className="rice-slider__input"
            aria-label="Confidence score"
          />
          <p className="rice-slider__helper">{getConfidenceLabel(confidence)}</p>
        </div>

        <div className="rice-slider">
          <label className="rice-slider__label">
            <span>Effort (1-100 person-weeks)</span>
            <span className="rice-slider__value">{effort}</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={effort}
            onChange={(e) => handleEffortChange(Number(e.target.value))}
            className="rice-slider__input"
            aria-label="Effort score"
          />
          <p className="rice-slider__helper">{getEffortLabel(effort)}</p>
          <p className="rice-slider__helper">
            Estimated timeline: {timeEstimate} weeks (assuming 2 people)
          </p>
        </div>
      </div>

      <div className={`rice-result rice-result--${recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="rice-result__score">
          <span className="rice-result__label">RICE Score</span>
          <span className="rice-result__value">
            ({reach} × {impact} × {confidence}%) / {effort} = {riceScore.toFixed(2)}
          </span>
        </div>
        <div className="rice-result__priority">
          <span className={`badge badge--${recommendation.toLowerCase().replace(/\s+/g, '-')}`}>
            {recommendation === "DONT BUILD" ? "DON'T BUILD" : recommendation}
          </span>
          <span className="rice-result__recommendation">
            {recommendation === "BUILD"
              ? "High priority - build this feature"
              : recommendation === "VALIDATE MORE"
                ? "Medium priority - validate assumptions first"
                : "Low priority - consider deprioritizing"}
          </span>
        </div>
      </div>

      <input type="hidden" name="riceReach" value={reach} />
      <input type="hidden" name="riceImpact" value={impact} />
      <input type="hidden" name="riceConfidence" value={confidence} />
      <input type="hidden" name="riceEffort" value={effort} />
      <input type="hidden" name="riceScore" value={riceScore.toFixed(2)} />
    </div>
  );
}

