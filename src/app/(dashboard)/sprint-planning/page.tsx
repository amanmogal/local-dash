import Link from "next/link";

import { buildMockExperiments } from "@/lib/experiments/mock";

const sprintStart = "Tuesday";

export default function SprintPlanningPage() {
  const experiments = buildMockExperiments();
  const scheduled = experiments.filter((experiment) =>
    ["scheduled", "live", "analyzing"].includes(experiment.status),
  );
  const backlog = experiments.filter((experiment) => experiment.status === "backlog");

  return (
    <>
      <article className="panel">
        <h1>Sprint Planning</h1>
        <p className="panel__muted">
          Prepare the weekly experimentation sprint. Sprint kickoff is scheduled for
          {` ${sprintStart}.`} Ensure capacity, align owners, and confirm launch checklists.
        </p>
      </article>

      <section className="panel">
        <header className="panel__header">
          <div>
            <h2>Current Sprint Lineup</h2>
            <p className="panel__muted">
              Experiments already scheduled or live. Confirm readiness and unblock owners.
            </p>
          </div>
          <Link className="btn btn--ghost" href="/experiments">
            Open tracker
          </Link>
        </header>
        <ul className="list">
          {scheduled.map((experiment) => (
            <li key={experiment.id}>
              <div>
                <strong>{experiment.name}</strong>
                <p className="panel__muted">
                  {experiment.status.toUpperCase()} • Owner: {experiment.owner}
                </p>
              </div>
              <div className="badge badge--scheduled">
                {experiment.startDate ?? "TBD"} → {experiment.endDate ?? "TBD"}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <header className="panel__header">
          <div>
            <h2>Backlog Candidates</h2>
            <p className="panel__muted">
              High ICE score experiments to review during sprint planning.
            </p>
          </div>
        </header>
        <ul className="list">
          {backlog.map((experiment) => (
            <li key={experiment.id}>
              <div>
                <strong>{experiment.name}</strong>
                <p className="panel__muted">
                  ICE Score: {experiment.iceScore} • Category: {experiment.category}
                </p>
              </div>
              <div>
                <p className="panel__muted">Success criteria</p>
                <p>{experiment.successCriteria}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

