import { Field, SF } from "./Field";
import { US_STATES, CA_PROVINCES, COUNTRIES } from "../constants";

export function LocationFields({ country, province, currentCity, onChange }) {
  const regionOptions =
    country === "United States"
      ? US_STATES.map((s) => ({ value: s, label: s }))
      : country === "Canada"
        ? CA_PROVINCES.map((p) => ({ value: p, label: p }))
        : null;

  return (
    <>
      <p className="section-label">Adoption location</p>
      <div className="form-grid">
        <Field label="Country of adoption">
          <select
            value={country}
            onChange={(e) => onChange("country", e.target.value)}
          >
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="State / Province of adoption">
          {regionOptions ? (
            <SF
              value={province}
              onChange={(v) => onChange("province", v)}
              options={regionOptions}
            />
          ) : (
            <input
              type="text"
              value={province}
              placeholder="e.g. Florida"
              onChange={(e) => onChange("province", e.target.value)}
            />
          )}
        </Field>
      </div>

      <p className="section-label" style={{ marginTop: "1rem" }}>Current residence</p>
      <div className="banner-warning" style={{ marginBottom: "0.75rem" }}>
        Dogs with treatment-resistant hookworm can introduce infective larvae into
        local environments through routine outdoor activity. Reporting your general
        location helps track where these parasites are present in the community.
        City or town level only — no address or personally identifying information
        is collected or stored.
      </div>
      <Field
        label="City / Town"
        hint="General location where the dog currently lives. City or town is sufficient."
      >
        <input
          type="text"
          value={currentCity}
          placeholder="e.g. Atlanta"
          onChange={(e) => onChange("current_city", e.target.value)}
        />
      </Field>
    </>
  );
}
