import { Field, SF } from "./Field";
import { FECAL_OPTIONS, PROTOCOLS, GI_EFFECTS, MONTHS_ON, PROFENDER_OPTS } from "../constants";

export function TreatmentFields({ form, set }) {
  return (
    <>
      <Field
        label="Kennel of origin (if known)"
        hint="The racing kennel your dog came from. Not encoded in the earmark; enter if you know it."
      >
        <input
          type="text"
          value={form.kennel_name}
          onChange={(e) => set("kennel_name")(e.target.value)}
          placeholder="e.g. Wayne Ward"
        />
      </Field>

      <Field label="Fecal result before starting treatment">
        <SF value={form.fecal_before} onChange={set("fecal_before")} options={FECAL_OPTIONS} />
      </Field>

      <Field label="Protocol currently being used" required>
        <SF value={form.protocol_used} onChange={set("protocol_used")} options={PROTOCOLS} />
      </Field>

      <div className="form-grid">
        <Field label="GI side effects">
          <SF value={form.gi_side_effects} onChange={set("gi_side_effects")} options={GI_EFFECTS} />
        </Field>
        <Field label="Time on this protocol">
          <SF value={form.months_on_protocol} onChange={set("months_on_protocol")} options={MONTHS_ON} />
        </Field>
      </div>

      <Field label="Escalated to Profender (emodepside)?">
        <SF value={form.escalated_profender} onChange={set("escalated_profender")} options={PROFENDER_OPTS} />
      </Field>
    </>
  );
}
