'use client';

import { useMemo, useState } from "react";

interface ICECalculatorProps {
  initialImpact?: number;
  initialConfidence?: number;
  initialEase?: number;
  onScoreChange?: (score: number, priority: string) => void;
  showLabels?: boolean;
}

export function ICECalculator({
  initialImpact = 5,
  initialConfidence = 5,
  initialEase = 5,
  onScoreChange,
  showLabels = true,
}: ICECalculatorProps) {
  const [impact, setImpact] = useState(initialImpact);
  const [confidence, setConfidence] = useState(initialConfidence);
  const [ease, setEase] = useState(initialEase);

  const iceScore = useMemo(() => impact * confidence * ease, [impact, confidence, ease]);

  const priority = useMemo(() => {
    if (iceScore > 200) {
      return "HIGH";
    }
    if (iceScore > 100) {
      return "MEDIUM";
    }
    return "LOW";
  }, [iceScore]);

  const recommendation = useMemo(() => {
    if (iceScore > 200) {
      return "RUN THIS WEEK";
    }
    if (iceScore > 100) {
      return "QUEUE FOR NEXT WEEK";
    }
    return "DEPRIORITIZE";
  }, [iceScore]);

  const getImpactLabel = (value: number) => {
    if (value >= 9) {
      return "Massive impact (>20% improvement)";
    }
    if (value >= 7) {
      return "Good impact (10-20% improvement)";
    }
    if (value >= 5) {
      return "Moderate impact (5-10% improvement)";
    }
    if (value >= 3) {
      return "Small impact (1-5% improvement)";
    }
    return "Negligible impact (<1% improvement)";
  };

  const getConfidenceLabel = (value: number) => {
    if (value >= 9) {
      return "Proven approach, high certainty";
    }
    if (value >= 7) {
      return "Strong data from past experiments";
    }
    if (value >= 5) {
      return "Moderate evidence from similar cases";
    }
    if (value >= 3) {
      return "Weak hypothesis, minimal evidence";
    }
    return "Pure speculation, no data";
  };

  const getEaseLabel = (value: number) => {
    if (value >= 9) {
      return "Very easy (<1 week, minimal resources)";
    }
    if (value >= 7) {
      return "Easy (1-2 weeks, low resources)";
    }
    if (value >= 5) {
      return "Moderate (2-3 weeks, medium resources)";
    }
    if (value >= 3) {
      return "Difficult (3-4 weeks, significant resources)";
    }
    return "Very difficult (>1 month, high resources)";
  };

  const handleImpactChange = (value: number) => {
    setImpact(value);
    const newScore = value * confidence * ease;
    const newPriority = newScore > 200 ? "HIGH" : newScore > 100 ? "MEDIUM" : "LOW";
    onScoreChange?.(newScore, newPriority);
  };

  const handleConfidenceChange = (value: number) => {
    setConfidence(value);
    const newScore = impact * value * ease;
    const newPriority = newScore > 200 ? "HIGH" : newScore > 100 ? "MEDIUM" : "LOW";
    onScoreChange?.(newScore, newPriority);
  };

  const handleEaseChange = (value: number) => {
    setEase(value);
    const newScore = impact * confidence * value;
    const newPriority = newScore > 200 ? "HIGH" : newScore > 100 ? "MEDIUM" : "LOW";
    onScoreChange?.(newScore, newPriority);
  };

  return (
    <div className="ice-calculator">
      {showLabels && (
        <header className="ice-calculator__header">
          <h3>ICE Score Calculator</h3>
          <p className="panel__muted">
            Rate Impact, Confidence, and Ease to automatically calculate priority
          </p>
        </header>
      )}

      <div className="ice-calculator__grid">
        <div className="ice-slider">
          <label className="ice-slider__label">
            <span>Impact (1-10)</span>
            <span className="ice-slider__value">{impact}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={impact}
            onChange={(e) => handleImpactChange(Number(e.target.value))}
            className="ice-slider__input"
            aria-label="Impact score"
          />
          <p className="ice-slider__helper">{getImpactLabel(impact)}</p>
        </div>

        <div className="ice-slider">
          <label className="ice-slider__label">
            <span>Confidence (1-10)</span>
            <span className="ice-slider__value">{confidence}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={confidence}
            onChange={(e) => handleConfidenceChange(Number(e.target.value))}
            className="ice-slider__input"
            aria-label="Confidence score"
          />
          <p className="ice-slider__helper">{getConfidenceLabel(confidence)}</p>
        </div>

        <div className="ice-slider">
          <label className="ice-slider__label">
            <span>Ease (1-10)</span>
            <span className="ice-slider__value">{ease}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={ease}
            onChange={(e) => handleEaseChange(Number(e.target.value))}
            className="ice-slider__input"
            aria-label="Ease score"
          />
          <p className="ice-slider__helper">{getEaseLabel(ease)}</p>
        </div>
      </div>

      <div className={`ice-result ice-result--${priority.toLowerCase()}`}>
        <div className="ice-result__score">
          <span className="ice-result__label">ICE Score</span>
          <span className="ice-result__value">
            {impact} × {confidence} × {ease} = {iceScore}
          </span>
        </div>
        <div className="ice-result__priority">
          <span className={`badge badge--${priority.toLowerCase()}`}>{priority} PRIORITY</span>
          <span className="ice-result__recommendation">{recommendation}</span>
        </div>
      </div>

      <input type="hidden" name="impactScore" value={impact} />
      <input type="hidden" name="confidenceScore" value={confidence} />
      <input type="hidden" name="easeScore" value={ease} />
      <input type="hidden" name="iceScore" value={iceScore} />
    </div>
  );
}

