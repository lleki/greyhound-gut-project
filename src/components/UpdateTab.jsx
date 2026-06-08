import { useState } from "react";
import { Field, SF } from "./Field";
import {
  FECAL_OPTIONS,
  OUTCOMES,
  MONTHS_ON,
  PROFENDER_OPTS,
  PROTOCOL_LABELS,
} from "../constants";
import { parseEarmark } from "../utils/earmark";
import { dbFetchByEarmark, dbUpdate } from "../utils/db";
import { generateDogName } from "../utils/dogName";

export function UpdateTab() {
  const [earmarkInput, setEarmarkInput] = useState("");
  const [records, setRecords] = useState(null);
  const [lookupStatus, setLookupStatus] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState("");

  const handleLookup = async () => {
    const parsed = parseEarmark(earmarkInput);
    if (!parsed) {
      setLookupError("Invalid earmark format.");
      return;
    }
    setLookupStatus("loading");
    setLookupError("");
    try {
      const rows = await dbFetchByEarmark(parsed.raw);
      setRecords(rows);
      setLookupStatus("done");
    } catch (e) {
      setLookupError(e.message);
      setLookupStatus(null);
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setUpdateForm({
      fecal_after: record.fecal_after || "",
      outcome: record.outcome || "",
      months_on_protocol: record.months_on_protocol || "",
      escalated_profender: record.escalated_profender || "",
      gi_side_effects: record.gi_side_effects || "",
      notes: record.notes || "",
      submission_type: "completed",
    });
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setSaveStatus("loading");
    try {
      await dbUpdate(editingId, updateForm);
      const updated = await dbFetchByEarmark(parseEarmark(earmarkInput).raw);
      setRecords(updated);
      setEditingId(null);
      setSaveStatus("success");
    } catch (e) {
      setSaveError(e.message);
      setSaveStatus("error");
    }
  };

  const setU = (key) => (val) => setUpdateForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="banner-info">
        Enter your greyhound's NGA earmark to look up existing submissions and
        update the outcome. Note: The quality of this database depends on
        participants providing accurate and honest submissions. We operate on an
        honor system to help the needlenose family.
      </div>

      <div className="lookup-box">
        <p className="section-label">Look up by earmark</p>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={earmarkInput}
              onChange={(e) => {
                setEarmarkInput(e.target.value);
                setRecords(null);
              }}
              placeholder="e.g. 01A-12345"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 0, whiteSpace: "nowrap" }}
            onClick={handleLookup}
            disabled={lookupStatus === "loading"}
          >
            {lookupStatus === "loading" ? "Searching…" : "Look up"}
          </button>
        </div>
        {lookupError && (
          <div className="banner-error" style={{ marginTop: 8 }}>
            {lookupError}
          </div>
        )}
      </div>

      {lookupStatus === "done" &&
        records !== null &&
        (records.length === 0 ? (
          <p className="empty">No submissions found for that earmark.</p>
        ) : (
          records.map((r) => (
            <div className="report-card" key={r.id}>
              <div className="report-card-header">
                <span className="report-earmark">{generateDogName(r.earmark)}</span>
                <span
                  className={`badge ${r.submission_type === "completed" ? "badge-completed" : "badge-active"}`}
                >
                  {r.submission_type === "completed" ? "Completed" : "Active"}
                </span>
              </div>
              <div className="report-meta">
                <div>
                  Protocol:{" "}
                  {PROTOCOL_LABELS[r.protocol_used] || r.protocol_used || "—"}
                </div>
                <div>Outcome: {r.outcome || "pending"}</div>
                <div>
                  Submitted: {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>

              {editingId === r.id ? (
                <div style={{ marginTop: 12 }}>
                  <p className="section-label">Update outcome</p>
                  <div className="form-grid">
                    <Field label="Most recent fecal result">
                      <SF
                        value={updateForm.fecal_after}
                        onChange={setU("fecal_after")}
                        options={FECAL_OPTIONS}
                      />
                    </Field>
                    <Field label="Outcome">
                      <SF
                        value={updateForm.outcome}
                        onChange={setU("outcome")}
                        options={[
                          ...OUTCOMES,
                          { value: "ongoing", label: "Still ongoing" },
                        ]}
                      />
                    </Field>
                  </div>
                  <div className="form-grid">
                    <Field label="Time on protocol">
                      <SF
                        value={updateForm.months_on_protocol}
                        onChange={setU("months_on_protocol")}
                        options={MONTHS_ON}
                      />
                    </Field>
                    <Field label="Profender escalation">
                      <SF
                        value={updateForm.escalated_profender}
                        onChange={setU("escalated_profender")}
                        options={PROFENDER_OPTS}
                      />
                    </Field>
                  </div>
                  <Field label="Updated notes">
                    <textarea
                      value={updateForm.notes}
                      onChange={(e) => setU("notes")(e.target.value)}
                    />
                  </Field>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-primary"
                      onClick={handleSave}
                      disabled={saveStatus === "loading"}
                    >
                      {saveStatus === "loading" ? "Saving…" : "Save update"}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                  {saveStatus === "error" && (
                    <div className="banner-error">{saveError}</div>
                  )}
                </div>
              ) : (
                <div className="report-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => startEdit(r)}
                  >
                    Update outcome
                  </button>
                </div>
              )}
              {saveStatus === "success" && !editingId && (
                <div className="banner-success" style={{ marginTop: 8 }}>
                  ✓ Updated successfully.
                </div>
              )}
            </div>
          ))
        ))}
    </div>
  );
}
