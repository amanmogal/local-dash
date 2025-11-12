import { RICECalculator } from "@/components/rice/RICECalculator";

export default function RICECalculatorPage() {
  return (
    <>
      <article className="panel">
        <h1>RICE Score Calculator</h1>
        <p className="panel__muted">
          Use this calculator to score product features by Reach, Impact, Confidence,
          and Effort. Adjust the inputs to see the priority recommendation.
        </p>
      </article>
      <RICECalculator showLabels={true} />
    </>
  );
}

