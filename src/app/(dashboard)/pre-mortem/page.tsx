interface FailureScenario {
  id: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigationExperiments: string[];
  status: string;
}

const scenarios: FailureScenario[] = [
  {
    id: "FS-001",
    title: "Members join but do not stay active",
    category: "Engagement",
    probability: 8,
    impact: 10,
    riskScore: 80,
    mitigationExperiments: [
      "EXP-Activation-Onboarding",
      "EXP-Engagement-Loops",
      "EXP-Recognition-Systems",
    ],
    status: "In Progress",
  },
  {
    id: "FS-002",
    title: "Cannot find a profitable revenue model",
    category: "Monetization",
    probability: 7,
    impact: 10,
    riskScore: 70,
    mitigationExperiments: [
      "EXP-Monetization-Pricing",
      "EXP-B2B-Revenue",
      "EXP-Lean-Ops",
    ],
    status: "Planning",
  },
  {
    id: "FS-003",
    title: "Founder burnout derails execution",
    category: "Operational",
    probability: 7,
    impact: 9,
    riskScore: 63,
    mitigationExperiments: [
      "EXP-Delegation-Roadmap",
      "EXP-Automation-Assistants",
      "EXP-Community-Led-Programs",
    ],
    status: "In Progress",
  },
  {
    id: "FS-004",
    title: "Community grows but outcomes stall",
    category: "Value Delivery",
    probability: 7,
    impact: 8,
    riskScore: 56,
    mitigationExperiments: [
      "EXP-Outcome-Tracking",
      "EXP-Accountability-Loops",
      "EXP-Resource-Acceleration",
    ],
    status: "Planned",
  },
];

const riskLevel = (score: number) => {
  if (score >= 70) {
    return "critical";
  }
  if (score >= 50) {
    return "high";
  }
  if (score >= 30) {
    return "medium";
  }
  return "low";
};

export default function PreMortemPage() {
  return (
    <>
      <article className="panel">
        <h1>Pre-Mortem Analysis</h1>
        <p className="panel__muted">
          Explore failure scenarios before they materialise. Use these risk profiles to
          design mitigation experiments and prioritise defensive plays.
        </p>
      </article>

      <section className="panel">
        <header className="panel__header">
          <div>
            <h2>Risk Register</h2>
            <p className="panel__muted">
              Probability × impact scoring highlights areas requiring immediate focus.
            </p>
          </div>
        </header>
        <ul className="list">
          {scenarios.map((scenario) => (
            <li key={scenario.id}>
              <div>
                <strong>{scenario.title}</strong>
                <p className="panel__muted">
                  {scenario.category} • Probability {scenario.probability}/10 • Impact {scenario.impact}/10
                </p>
                <p className="panel__muted">
                  Mitigation experiments: {scenario.mitigationExperiments.join(", ")}
                </p>
              </div>
              <div className={`risk-badge risk-badge--${riskLevel(scenario.riskScore)}`}>
                <span>{scenario.riskScore}</span>
                <span>{scenario.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Monthly Review Checklist</h2>
        <p className="panel__muted">
          Re-score risks monthly, update mitigation status, and feed learnings back into
          the experiment backlog.
        </p>
        <ol className="ordered-list">
          <li>Refresh probability and impact scores based on latest metrics.</li>
          <li>Close the loop on mitigation experiments; capture learnings in the repository.</li>
          <li>Identify new failure scenarios surfaced by community feedback.</li>
          <li>Escalate critical risks to founders for budget and staffing decisions.</li>
        </ol>
      </section>
    </>
  );
}

