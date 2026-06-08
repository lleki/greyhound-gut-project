import { useState } from "react";
import { EarmarkInput } from "./EarmarkInput";
import { LocationFields } from "./LocationFields";
import { TreatmentFields } from "./TreatmentFields";
import { Field } from "./Field";
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
  escalated_profender: "",
  notes: "",
};

export function ActiveForm({ onLocalSubmit }) {
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
    if (!parsed || !form.protocol_used) {
      setStatus("error");
      setErrorMsg(!parsed ? "Please enter a valid NGA earmark." : "Protocol is required.");
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
      escalated_profender: form.escalated_profender,
      notes: form.notes,
      submission_type: "active",
      outcome: "ongoing",
      fecal_after: null,
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
          ✓ Active treatment report submitted. Thank you.
          <br />
          <span style={{ fontSize: "0.8rem", marginTop: 4, display: "block" }}>
            To update this record later, go to the <strong>Update record</strong> tab
            and enter earmark <strong>{parsed?.raw}</strong>.
          </span>
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
        Use this form if your greyhound is <strong>currently undergoing treatment</strong>.
        You can return later to update the outcome once treatment is complete using the{" "}
        <strong>Update record</strong> tab.
      </div>

      <EarmarkInput value={form.earmark} onChange={onEarmark} parsed={parsed} />

      <LocationFields
        country={form.country}
        province={form.province}
        currentCity={form.current_city}
        onChange={(k, v) => set(k)(v)}
      />

      <hr className="divider" />
      <p className="section-label">Current treatment</p>

      <TreatmentFields form={form} set={set} />

      <Field label="Notes (optional)">
        <textarea
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder="Anything else that might be useful — vet notes, test methods, etc."
        />
      </Field>

      <button className="btn-primary" onClick={handleSubmit} disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit active treatment report"}
      </button>
      {status === "error" && <div className="banner-error">Error: {errorMsg}</div>}
    </div>
  );
}
