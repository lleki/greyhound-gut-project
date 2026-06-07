// ============================================================
// GREYHOUND HOOKWORM REGISTRY
// ============================================================
// SETUP:
//   1. Create a Supabase project at supabase.com
//   2. Run the SQL in the Setup tab of the app (or see bottom of this file)
//   3. Replace SUPABASE_URL and SUPABASE_KEY below with your values
//   4. Deploy with: npx create-react-app my-app, replace App.js with this file
//      OR use Vite: npm create vite@latest my-app -- --template react
// ============================================================

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const configured = SUPABASE_URL !== "YOUR_SUPABASE_URL";

// ── Earmark reference data ──────────────────────────────────

const KENNEL_CODES = {
  WW: "Wayne Ward (Abilene, KS)",
  SL: "Sanford-Orlando",
  SH: "Southland",
  FL: "Florida (unspecified)",
  IR: "Irish import",
  TS: "Tri-State",
  PH: "Palm Beach",
  JK: "Jacksonville",
  DR: "Daytona",
  TM: "Tampa",
  DU: "Dubuque",
  GN: "Geneva Lakes",
  BR: "Bluffs Run",
  CT: "Cloverleaf",
  DP: "Derby Lane",
  EB: "Ebro",
  HC: "Hinsdale",
  LN: "Lincoln Park",
  MP: "Mile High",
  NL: "Naples-Fort Myers",
  OT: "Orange Park",
  PB: "Palm Beach Kennel Club",
  PM: "Pensacola",
  RH: "Raynham",
  SC: "Seabrook",
  SF: "Sarasota",
  SN: "Seminole",
  SR: "St. Pete",
  SW: "Southwest Florida",
  TF: "Taunton",
  WD: "Wheeling",
  WH: "Wonderland",
};

const BIRTH_YEARS = {
  1: "2011",
  2: "2012",
  3: "2013",
  4: "2014",
  5: "2015",
  6: "2016",
  7: "2017",
  8: "2018",
  9: "2019",
  0: "2020",
  A: "2021",
  B: "2022",
  C: "2023",
  D: "2024",
  E: "2025",
};

function parseEarmark(raw) {
  const em = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  const parts = em.split("-");
  if (parts.length !== 2) return null;
  const [left, right] = parts;
  if (left.length < 2 || right.length < 3) return null;
  const yearCode = left[0];
  const litter = left[1];
  const kennelCode = right.slice(-2);
  const dogNum = right.slice(0, -2);
  const year = BIRTH_YEARS[yearCode];
  const kennel = KENNEL_CODES[kennelCode] || `Unknown kennel (${kennelCode})`;
  if (!year) return null;
  return { year, litter, dogNum, kennelCode, kennel, raw: em };
}

// ── Supabase helpers ────────────────────────────────────────

async function supabaseInsert(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/hookworm_reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function supabaseFetch() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/hookworm_reports?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Styles ──────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    background: #f5f3ef;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a18;
    min-height: 100vh;
  }

  .app-shell {
    max-width: 820px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .app-header {
    border-bottom: 1px solid #d6d3cc;
    padding-bottom: 1.25rem;
    margin-bottom: 0;
  }

  .app-wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.3px;
    margin: 0 0 4px;
    color: #1a1a18;
  }

  .app-tagline {
    font-size: 0.8rem;
    color: #7a7870;
    margin: 0;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .tab-bar {
    display: flex;
    border-bottom: 1px solid #d6d3cc;
    margin-bottom: 2rem;
    overflow-x: auto;
  }

  .tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.85rem 1.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: #7a7870;
    cursor: pointer;
    white-space: nowrap;
    margin-bottom: -1px;
    transition: color 0.15s;
  }

  .tab:hover { color: #1a1a18; }
  .tab.active { color: #1a1a18; border-bottom-color: #1a1a18; font-weight: 500; }

  .section-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a09d94;
    margin: 0 0 0.75rem;
  }

  .divider {
    border: none;
    border-top: 1px solid #e4e1da;
    margin: 1.75rem 0;
  }

  /* Form elements */
  .field { margin-bottom: 1.1rem; }

  .field label {
    display: block;
    font-size: 0.82rem;
    color: #5a5854;
    margin-bottom: 5px;
  }

  .field label .req { color: #c0392b; margin-left: 2px; }

  .field .hint {
    font-size: 0.72rem;
    color: #a09d94;
    margin: 5px 0 0;
  }

  input[type="text"], select, textarea {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: #1a1a18;
    background: #fff;
    border: 1px solid #d6d3cc;
    border-radius: 6px;
    padding: 0.55rem 0.75rem;
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
  }

  input[type="text"]:focus, select:focus, textarea:focus {
    border-color: #8a8780;
  }

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1.25rem;
  }

  @media (max-width: 560px) {
    .form-grid { grid-template-columns: 1fr; }
  }

  .earmark-parsed {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    background: #eef4fb;
    border: 1px solid #c5d8ef;
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 6px;
    font-size: 0.78rem;
    color: #2c5f9e;
  }

  .earmark-parsed strong { font-weight: 500; }

  /* Buttons */
  .btn-primary {
    background: #1a1a18;
    color: #f5f3ef;
    border: none;
    border-radius: 6px;
    padding: 0.65rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 0.5rem;
  }

  .btn-primary:hover { opacity: 0.82; }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Feedback banners */
  .banner-success {
    background: #eaf6ee;
    border: 1px solid #b2ddbf;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: #256636;
    margin-top: 1rem;
  }

  .banner-error {
    background: #fdf0ee;
    border: 1px solid #e8bdb7;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: #a02f22;
    margin-top: 1rem;
  }

  .banner-warning {
    background: #fdf6e8;
    border: 1px solid #e8d3a0;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: #7a5a10;
    margin-top: 0;
    margin-bottom: 1.25rem;
  }

  /* Dashboard */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    margin-bottom: 1.75rem;
  }

  .stat-card {
    background: #fff;
    border: 1px solid #e4e1da;
    border-radius: 8px;
    padding: 1rem 1.1rem;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    margin-bottom: 5px;
    color: #1a1a18;
  }

  .stat-lbl {
    font-size: 0.72rem;
    color: #7a7870;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid #eee;
    font-size: 0.82rem;
  }

  .bar-row:last-child { border-bottom: none; }

  .bar-label { min-width: 180px; color: #1a1a18; }
  .bar-count { min-width: 55px; color: #7a7870; font-size: 0.75rem; }
  .bar-track { flex: 1; background: #e8e5de; border-radius: 2px; height: 5px; }
  .bar-fill { height: 5px; border-radius: 2px; background: #3d6b4f; }

  /* About */
  .about-body {
    font-size: 0.9rem;
    line-height: 1.75;
    color: #4a4844;
    max-width: 640px;
  }

  .about-body p { margin: 0 0 1rem; }
  .about-body strong { color: #1a1a18; font-weight: 500; }

  /* Setup */
  .setup-block {
    background: #fff;
    border: 1px solid #e4e1da;
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.25rem;
  }

  .setup-block h3 {
    font-size: 0.85rem;
    font-weight: 500;
    margin: 0 0 0.6rem;
    color: #1a1a18;
  }

  .setup-block p {
    font-size: 0.82rem;
    color: #5a5854;
    margin: 0 0 0.75rem;
    line-height: 1.6;
  }

  .code-block {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    background: #f0ede8;
    border: 1px solid #d6d3cc;
    border-radius: 6px;
    padding: 0.9rem 1rem;
    white-space: pre;
    overflow-x: auto;
    line-height: 1.6;
    color: #3a3835;
  }

  .loading { color: #7a7870; font-size: 0.85rem; padding: 1rem 0; }
  .empty { color: #a09d94; font-size: 0.85rem; font-style: italic; }
`;

// ── Form options ────────────────────────────────────────────

const PROTOCOLS = [
  { value: "panacur_only", label: "Panacur (fenbendazole) only" },
  {
    value: "advantage_multi_only",
    label: "Advantage Multi (moxidectin) only — monthly",
  },
  {
    value: "prison_protocol",
    label: "Prison Greyhounds protocol (Drontal Plus + Advantage Multi q14d)",
  },
  {
    value: "triple_combo_monthly",
    label: "Triple combo monthly (Advantage Multi + Drontal Plus)",
  },
  {
    value: "triple_combo_q14",
    label: "Triple combo q14d (Advantage Multi + Drontal Plus)",
  },
  {
    value: "ng_midmonth",
    label: "Dr. Ng mid-month (Advantage Multi + mid-month Drontal)",
  },
  { value: "profender", label: "Profender (emodepside) off-label" },
  { value: "other", label: "Other / mixed" },
];

const PROTOCOL_LABELS = Object.fromEntries(
  PROTOCOLS.map((p) => [p.value, p.label]),
);

const GI_EFFECTS = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild — occasional loose stool" },
  { value: "moderate", label: "Moderate — frequent loose stool / nausea" },
  { value: "severe", label: "Severe — treatment-interrupting" },
];

const FECAL_BEFORE = [
  { value: "positive_heavy", label: "Positive — heavy egg count" },
  { value: "positive_moderate", label: "Positive — moderate egg count" },
  { value: "positive_light", label: "Positive — light egg count" },
  { value: "positive_unknown", label: "Positive — count not quantified" },
  { value: "negative", label: "Negative" },
  { value: "not_tested", label: "Not tested before starting" },
];

const FECAL_AFTER = [
  { value: "negative_3plus", label: "Negative — 3+ consecutive negatives" },
  { value: "negative_1_2", label: "Negative — 1–2 negatives" },
  { value: "still_positive", label: "Still positive" },
  { value: "not_retested", label: "Not retested yet" },
];

const MONTHS = [
  { value: "lt3", label: "Under 3 months" },
  { value: "3to6", label: "3–6 months" },
  { value: "6to9", label: "6–9 months" },
  { value: "9to12", label: "9–12 months" },
  { value: "gt12", label: "Over 12 months" },
  { value: "ongoing", label: "Still ongoing" },
];

const PROFENDER_OPTS = [
  { value: "no", label: "No" },
  { value: "yes_effective", label: "Yes — effective" },
  { value: "yes_ineffective", label: "Yes — not effective" },
  { value: "yes_ongoing", label: "Yes — ongoing" },
];

const OUTCOMES = [
  { value: "cleared", label: "Cleared — dog is hookworm-free" },
  { value: "controlled", label: "Controlled — managed but not fully cleared" },
  { value: "ongoing", label: "Ongoing — still in active treatment" },
  { value: "reinfected", label: "Cleared then reinfected" },
  { value: "unknown", label: "Unknown / lost to follow-up" },
];

const COUNTRIES = [
  "Canada",
  "United States",
  "Australia",
  "Ireland",
  "UK",
  "Other",
];

// ── Reusable Field component ────────────────────────────────

function Field({ label, required, hint, children }) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="req">*</span>}
      </label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function Select({ id, value, onChange, options, placeholder = "Select…" }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Submit tab ──────────────────────────────────────────────

function SubmitTab({ onLocalSubmit }) {
  const [form, setForm] = useState({
    earmark: "",
    country: "",
    province: "",
    fecal_before: "",
    protocol_used: "",
    gi_side_effects: "",
    months_on_protocol: "",
    fecal_after: "",
    escalated_profender: "",
    outcome: "",
  });
  const [parsed, setParsed] = useState(null);
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const onEarmark = (val) => {
    set("earmark")(val);
    setParsed(parseEarmark(val));
  };

  const handleSubmit = async () => {
    if (!form.earmark || !form.protocol_used) {
      setStatus("error");
      setErrorMsg("Earmark and protocol are required.");
      return;
    }
    setStatus("loading");

    const payload = {
      earmark: parsed ? parsed.raw : form.earmark.toUpperCase(),
      kennel_code: parsed?.kennelCode || null,
      kennel_name: parsed?.kennel || null,
      birth_year: parsed?.year || null,
      adopter_country: form.country,
      adopter_province: form.province,
      fecal_before: form.fecal_before,
      protocol_used: form.protocol_used,
      gi_side_effects: form.gi_side_effects,
      months_on_protocol: form.months_on_protocol,
      fecal_after: form.fecal_after,
      escalated_profender: form.escalated_profender,
      outcome: form.outcome,
    };

    if (!configured) {
      setTimeout(() => {
        onLocalSubmit(payload);
        setStatus("success");
      }, 500);
      return;
    }

    try {
      await supabaseInsert(payload);
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
          ✓ Report submitted. Thank you — every data point helps.
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => {
            setStatus(null);
            setForm({
              earmark: "",
              country: "",
              province: "",
              fecal_before: "",
              protocol_used: "",
              gi_side_effects: "",
              months_on_protocol: "",
              fecal_after: "",
              escalated_profender: "",
              outcome: "",
            });
            setParsed(null);
          }}
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <div>
      {!configured && (
        <div className="banner-warning">
          Supabase not configured — submissions will be stored in memory only.
          See the Setup tab.
        </div>
      )}

      <p className="section-label">Dog identity</p>

      <Field
        label="Earmark"
        required
        hint="Left ear dash right ear — e.g. 64A-76091"
      >
        <input
          type="text"
          value={form.earmark}
          onChange={(e) => onEarmark(e.target.value)}
          placeholder="64A-76091"
          style={{ textTransform: "uppercase" }}
        />
        {parsed && (
          <div className="earmark-parsed">
            <span>
              Birth year: <strong>{parsed.year}</strong>
            </span>
            <span>
              Litter: <strong>{parsed.litter}</strong>
            </span>
            <span>
              Kennel: <strong>{parsed.kennel}</strong>
            </span>
          </div>
        )}
      </Field>

      <hr className="divider" />
      <p className="section-label">Adopter location</p>

      <div className="form-grid">
        <Field label="Country">
          <select
            value={form.country}
            onChange={(e) => set("country")(e.target.value)}
          >
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Province / State">
          <input
            type="text"
            value={form.province}
            onChange={(e) => set("province")(e.target.value)}
            placeholder="e.g. Quebec"
          />
        </Field>
      </div>

      <hr className="divider" />
      <p className="section-label">Treatment history</p>

      <Field label="Fecal result before treatment">
        <Select
          value={form.fecal_before}
          onChange={set("fecal_before")}
          options={FECAL_BEFORE}
        />
      </Field>

      <Field label="Protocol used" required>
        <Select
          value={form.protocol_used}
          onChange={set("protocol_used")}
          options={PROTOCOLS}
        />
      </Field>

      <div className="form-grid">
        <Field label="GI side effects">
          <Select
            value={form.gi_side_effects}
            onChange={set("gi_side_effects")}
            options={GI_EFFECTS}
          />
        </Field>
        <Field label="Months on this protocol">
          <Select
            value={form.months_on_protocol}
            onChange={set("months_on_protocol")}
            options={MONTHS}
          />
        </Field>
      </div>

      <div className="form-grid">
        <Field label="Fecal result after treatment">
          <Select
            value={form.fecal_after}
            onChange={set("fecal_after")}
            options={FECAL_AFTER}
          />
        </Field>
        <Field label="Escalated to Profender?">
          <Select
            value={form.escalated_profender}
            onChange={set("escalated_profender")}
            options={PROFENDER_OPTS}
          />
        </Field>
      </div>

      <Field label="Overall outcome">
        <Select
          value={form.outcome}
          onChange={set("outcome")}
          options={OUTCOMES}
        />
      </Field>

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting…" : "Submit report"}
      </button>

      {status === "error" && (
        <div className="banner-error">Error: {errorMsg}</div>
      )}
    </div>
  );
}

// ── Dashboard tab ───────────────────────────────────────────

function DashboardTab({ localData }) {
  const [data, setData] = useState(localData);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!configured) {
      setData(localData);
      return;
    }
    setLoading(true);
    supabaseFetch()
      .then((rows) => {
        setData(rows);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading reports…</p>;
  if (error)
    return <div className="banner-error">Failed to load data: {error}</div>;

  const total = data.length;
  if (!total) return <p className="empty">No submissions yet.</p>;

  const cleared = data.filter((d) => d.outcome === "cleared").length;
  const profender = data.filter(
    (d) =>
      d.escalated_profender &&
      d.escalated_profender !== "no" &&
      d.escalated_profender !== "",
  ).length;
  const giSevere = data.filter((d) => d.gi_side_effects === "severe").length;

  const countBy = (key, labelMap) => {
    const counts = {};
    data.forEach((d) => {
      if (d[key]) {
        const lbl = labelMap ? labelMap[d[key]] || d[key] : d[key];
        counts[lbl] = (counts[lbl] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const kennels = countBy("kennel_name");
  const protocols = countBy("protocol_used", PROTOCOL_LABELS);
  const maxK = kennels[0]?.[1] || 1;
  const maxP = protocols[0]?.[1] || 1;

  return (
    <div>
      <p className="section-label">Summary</p>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{total}</div>
          <div className="stat-lbl">Total reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">
            {total ? Math.round((cleared / total) * 100) : 0}%
          </div>
          <div className="stat-lbl">Cleared</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{profender}</div>
          <div className="stat-lbl">Escalated to Profender</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{giSevere}</div>
          <div className="stat-lbl">Severe GI effects</div>
        </div>
      </div>

      <hr className="divider" />
      <p className="section-label">Reports by kennel of origin</p>
      {kennels.length ? (
        kennels.map(([k, c]) => (
          <div className="bar-row" key={k}>
            <span className="bar-label">{k}</span>
            <span className="bar-count">
              {c} report{c !== 1 ? "s" : ""}
            </span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.round((c / maxK) * 100)}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="empty">No kennel data yet.</p>
      )}

      <hr className="divider" />
      <p className="section-label">Reports by protocol</p>
      {protocols.length ? (
        protocols.map(([p, c]) => (
          <div className="bar-row" key={p}>
            <span className="bar-label">{p}</span>
            <span className="bar-count">
              {c} report{c !== 1 ? "s" : ""}
            </span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.round((c / maxP) * 100)}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="empty">No protocol data yet.</p>
      )}
    </div>
  );
}

// ── About tab ───────────────────────────────────────────────

function AboutTab() {
  return (
    <div className="about-body">
      <p>
        Racing greyhounds carry multi-drug resistant hookworms at very high
        rates. The resistance evolved from decades of aggressive deworming in
        high-density kennel environments. When these dogs retire and are
        adopted, their new owners — and vets unfamiliar with the problem — often
        cycle through ineffective treatments for months.
      </p>
      <p>
        Greyhound earmarks encode{" "}
        <strong>birth year, litter, individual ID, and kennel of origin</strong>{" "}
        in a standardised format. This registry links treatment outcomes to
        kennel of origin, so that over time we can identify whether certain
        kennels are associated with more resistant strains, and which protocols
        are most effective.
      </p>
      <p>
        This is <strong>community science, not clinical research</strong>. Data
        is self-reported by owners and should be treated as directional signal,
        not clinical evidence. If patterns emerge, the intent is to bring
        structured data to researchers at UGA and others working on this
        problem.
      </p>
      <p>
        Inspired by the work of <strong>Dr. Jennifer Ng, DVM</strong> and the{" "}
        <strong>Kaplan Lab at the University of Georgia</strong>. Built by a
        greyhound adopter.
      </p>
      <p style={{ fontSize: "0.78rem", color: "#a09d94" }}>
        Data collected is about dogs, not people. No personal health information
        is stored. Submissions are voluntary and publicly viewable in aggregate.
      </p>
    </div>
  );
}

// ── Setup tab ───────────────────────────────────────────────

const SQL_TABLE = `create table hookworm_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  earmark text not null,
  kennel_code text,
  kennel_name text,
  birth_year text,
  adopter_country text,
  adopter_province text,
  fecal_before text,
  protocol_used text,
  gi_side_effects text,
  months_on_protocol text,
  fecal_after text,
  escalated_profender text,
  outcome text,
  notes text
);`;

const SQL_RLS = `alter table hookworm_reports enable row level security;

create policy "allow_public_insert" on hookworm_reports
  for insert with check (true);

create policy "allow_public_select" on hookworm_reports
  for select using (true);`;

function SetupTab() {
  return (
    <div>
      <div className="setup-block">
        <h3>1. Create a Supabase project</h3>
        <p>
          Go to <strong>supabase.com</strong>, create a free account, and start
          a new project. Once it's ready, go to <strong>Settings → API</strong>{" "}
          and copy your Project URL and the <code>anon</code> public key.
        </p>
      </div>

      <div className="setup-block">
        <h3>2. Create the table</h3>
        <p>
          Open the <strong>SQL Editor</strong> in your Supabase project and run
          this:
        </p>
        <div className="code-block">{SQL_TABLE}</div>
      </div>

      <div className="setup-block">
        <h3>3. Enable public read/write</h3>
        <p>
          Run this in the same SQL editor to allow anonymous submissions and
          viewing:
        </p>
        <div className="code-block">{SQL_RLS}</div>
      </div>

      <div className="setup-block">
        <h3>4. Add your credentials to the app</h3>
        <p>
          At the top of <strong>GreyhoundHookwormRegistry.jsx</strong>, replace
          the two placeholder values:
        </p>
        <div className="code-block">{`const SUPABASE_URL = "https://qikndougyvvwwappitdq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpa25kb3VneXZ2d3dhcHBpdGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTY1MjIsImV4cCI6MjA5NDc5MjUyMn0.d5OGuIFVEDZMKOk_gFIbOl3plMwxtrjr5Rl32DSpvy8";`}</div>
      </div>

      <div className="setup-block">
        <h3>5. Deploy</h3>
        <p>
          Create a new Vite + React project, drop this file in as your main
          component, and deploy to <strong>Vercel</strong> or{" "}
          <strong>Netlify</strong> (both free). Commands to get started locally:
        </p>
        <div className="code-block">{`npm create vite@latest hookworm-registry -- --template react
cd hookworm-registry
npm install
# Replace src/App.jsx with GreyhoundHookwormRegistry.jsx
npm run dev`}</div>
      </div>
    </div>
  );
}

// ── Root app ────────────────────────────────────────────────

const TABS = ["Submit", "Dashboard", "About", "Setup"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Submit");
  const [localData, setLocalData] = useState([]);

  const handleLocalSubmit = (payload) => {
    setLocalData((prev) => [payload, ...prev]);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        <div className="app-header">
          <h1 className="app-wordmark">Greyhound Hookworm Registry</h1>
          <p className="app-tagline">
            Community-sourced treatment outcomes · earmark-linked · open data
          </p>
        </div>

        <div className="tab-bar">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Submit" && (
          <SubmitTab onLocalSubmit={handleLocalSubmit} />
        )}
        {activeTab === "Dashboard" && <DashboardTab localData={localData} />}
        {activeTab === "About" && <AboutTab />}
        {activeTab === "Setup" && <SetupTab />}
      </div>
    </>
  );
}

/*
SQL REFERENCE (also shown in the Setup tab of the app)
======================================================

-- Block 1: Create table
create table hookworm_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  earmark text not null,
  kennel_code text,
  kennel_name text,
  birth_year text,
  adopter_country text,
  adopter_province text,
  fecal_before text,
  protocol_used text,
  gi_side_effects text,
  months_on_protocol text,
  fecal_after text,
  escalated_profender text,
  outcome text,
  notes text
);

-- Block 2: Row level security
alter table hookworm_reports enable row level security;
create policy "allow_public_insert" on hookworm_reports
  for insert with check (true);
create policy "allow_public_select" on hookworm_reports
  for select using (true);
*/
