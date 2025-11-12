import { ICECalculator } from "@/components/ice/ICECalculator";

export default function ICECalculatorPage() {
  return (
    <>
      <article className="panel">
        <h1>ICE Score Calculator</h1>
        <p className="panel__muted">
          Use this calculator to quickly score experiments before adding them to the
          tracker. Adjust Impact, Confidence, and Ease sliders to see the priority
          recommendation.
        </p>
      </article>
      <ICECalculator showLabels={true} />
    </>
  );
}

