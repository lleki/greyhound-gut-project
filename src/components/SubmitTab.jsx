import { useState } from "react";
import { ActiveForm } from "./ActiveForm";
import { CompletedForm } from "./CompletedForm";

export function SubmitTab({ onLocalSubmit }) {
  const [flow, setFlow] = useState(null);

  if (flow === "active")
    return (
      <div>
        <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setFlow(null)}>
          ← Back
        </button>
        <ActiveForm onLocalSubmit={onLocalSubmit} />
      </div>
    );

  if (flow === "completed")
    return (
      <div>
        <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setFlow(null)}>
          ← Back
        </button>
        <CompletedForm onLocalSubmit={onLocalSubmit} />
      </div>
    );

  return (
    <div>
      <p style={{ fontSize: "0.9rem", color: "#5a5854", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Help build the first community dataset on NGA greyhound hookworm treatment outcomes.
        Select the option that describes your situation.
      </p>
      <div className="flow-selector">
        <button className="flow-card" onClick={() => setFlow("active")}>
          <div className="flow-card-icon">🔬</div>
          <div className="flow-card-title">Currently treating</div>
          <div className="flow-card-desc">
            Your greyhound has hookworms and is in active treatment. Submit now and update
            the outcome later once treatment is complete.
          </div>
        </button>
        <button className="flow-card" onClick={() => setFlow("completed")}>
          <div className="flow-card-icon">✓</div>
          <div className="flow-card-title">Treatment complete</div>
          <div className="flow-card-desc">
            Treatment is finished and you have a final outcome to report — cleared,
            controlled, reinfected, or other.
          </div>
        </button>
      </div>
    </div>
  );
}
