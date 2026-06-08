import { Field } from "./Field";

export function EarmarkInput({ value, onChange, parsed }) {
  return (
    <Field
      label="NGA earmark"
      required
      hint="Enter the earmark as it appears on the dog: right ear (birth month + last digit of birth year + tattoo order letter) on the left, left ear (5-digit litter registration number) on the right. Format: MYO-LLLLL."
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 01A-12345"
        style={{ textTransform: "uppercase" }}
      />
      {value && !parsed && (
        <p style={{ fontSize: "0.75rem", color: "#a02f22", marginTop: 4 }}>
          Could not parse — check format (e.g. 01A-12345, right ear first)
        </p>
      )}
      {parsed && (
        <div className="earmark-parsed">
          <span>
            Litter: <strong>{parsed.litter}</strong>
          </span>
          <span>
            Born:{" "}
            <strong>
              {parsed.monthName} {parsed.year}
            </strong>
          </span>
          <span>
            Tattoo order: <strong>{parsed.orderLetter}</strong>
          </span>
        </div>
      )}
    </Field>
  );
}
