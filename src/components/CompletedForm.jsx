import { useState } from "react";
import { EarmarkInput } from "./EarmarkInput";
import { LocationFields } from "./LocationFields";
import { TreatmentFields } from "./TreatmentFields";
import { Field, SF } from "./Field";
import { FECAL_OPTIONS, OUTCOMES } from "../constants";
import { parseEarmark } from "../utils/earmark";
import { dbInsert, configured } from "../utils/db";

const EMPTY = {
  earmark: "",
  country: "",
  province: "",
  current_city: "",
  kennel_name: "",
  fecal_before: "",
  protocol_used: "",
  gi_side_effects: "",
  months_on_protocol: "",
  fecal_after: "",
  escalated_profender: "",
  outcome: "",
  notes: "",
};

export function CompletedForm({ onLocalSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [parsed, setParsed] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const onEarmark = (val) => {
    set("earmark")(val);
    setParsed(parseEarmark(val));
  };

  const handleSubmit = async () => {
    if (!parsed || !form.protocol_used || !form.outcome) {
      setStatus("error");
      setErrorMsg(
        !parsed ? "Please enter a valid NGA earmark." : "Protocol and outcome are required."
      );
      return;
    }
    setStatus("loading");

    const payload = {
      earmark: parsed.raw,
      litter_number: parsed.litter,
      birth_month: parsed.month,
      birth_year: parsed.year,
      tattoo_order: parsed.orderLetter,
      kennel_name: form.kennel_name || null,
      adopter_country: form.country,
      adopter_province: form.province,
      current_city: form.current_city || null,
      fecal_before: form.fecal_before,
      protocol_used: form.protocol_used,
      gi_side_effects: form.gi_side_effects,
      months_on_protocol: form.months_on_protocol,
      fecal_after: form.fecal_after,
      escalated_profender: form.escalated_profender,
      outcome: form.outcome,
      notes: form.notes,
      submission_type: "completed",
      flagged: false,
    };

    if (!configured) {
      setTimeout(() => {
        onLocalSubmit(payload);
        setStatus("success");
      }, 400);
      return;
    }
    try {
      await dbInsert(payload);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message);
    }
  };

  if (status === "success") {
    return (
      <div>
        <div className="banner-success">
          ✓ Completed treatment report submitted. Thank you — this data is invaluable.
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => { setStatus(null); setForm(EMPTY); setParsed(null); }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="banner-info">
        Use this form if treatment is <strong>complete</strong> and you have a final outcome to report.
      </div>

      <EarmarkInput value={form.earmark} onChange={onEarmark} parsed={parsed} />

      <LocationFields
        country={form.country}
        province={form.province}
        currentCity={form.current_city}
        onChange={(k, v) => set(k)(v)}
      />

      <hr className="divider" />
      <p className="section-label">Treatment summary</p>

      <TreatmentFields form={form} set={set} />

      <div className="form-grid">
        <Field label="Most recent fecal result">
          <SF value={form.fecal_after} onChange={set("fecal_after")} options={FECAL_OPTIONS} />
        </Field>
        <Field label="Final outcome" required>
          <SF value={form.outcome} onChange={set("outcome")} options={OUTCOMES} />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder="Anything else — vet notes, test methods, resistance testing, etc."
        />
      </Field>

      <button className="btn-primary" onClick={handleSubmit} disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit completed treatment report"}
      </button>
      {status === "error" && <div className="banner-error">Error: {errorMsg}</div>}
    </div>
  );
}
