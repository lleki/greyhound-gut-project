export const PROTOCOLS = [
  { value: "panacur_only", label: "Panacur (fenbendazole) only" },
  { value: "advantage_multi_only", label: "Advantage Multi (moxidectin) only — monthly" },
  { value: "prison_protocol", label: "Prison Greyhounds protocol (Drontal Plus + Advantage Multi q14d)" },
  { value: "triple_combo_monthly", label: "Triple combo monthly (Advantage Multi + Drontal Plus)" },
  { value: "triple_combo_q14", label: "Triple combo q14d (Advantage Multi + Drontal Plus)" },
  { value: "ng_midmonth", label: "Dr. Ng mid-month (Advantage Multi + mid-month Drontal)" },
  { value: "profender", label: "Profender (emodepside) off-label" },
  { value: "other", label: "Other / mixed" },
];

export const PROTOCOL_LABELS = Object.fromEntries(PROTOCOLS.map((p) => [p.value, p.label]));

export const GI_EFFECTS = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild — occasional loose stool" },
  { value: "moderate", label: "Moderate — frequent loose stool / nausea" },
  { value: "severe", label: "Severe — treatment-interrupting" },
];

export const FECAL_OPTIONS = [
  { value: "positive_heavy", label: "Positive — heavy egg count" },
  { value: "positive_moderate", label: "Positive — moderate egg count" },
  { value: "positive_light", label: "Positive — light egg count" },
  { value: "positive_unknown", label: "Positive — count not quantified" },
  { value: "negative", label: "Negative" },
  { value: "not_tested", label: "Not tested" },
];

export const MONTHS_ON = [
  { value: "lt3", label: "Under 3 months" },
  { value: "3to6", label: "3–6 months" },
  { value: "6to9", label: "6–9 months" },
  { value: "9to12", label: "9–12 months" },
  { value: "gt12", label: "Over 12 months" },
];

export const PROFENDER_OPTS = [
  { value: "no", label: "No" },
  { value: "yes_effective", label: "Yes — effective" },
  { value: "yes_ineffective", label: "Yes — not effective" },
  { value: "yes_ongoing", label: "Yes — ongoing" },
];

export const OUTCOMES = [
  { value: "cleared", label: "Cleared — 3+ consecutive negatives" },
  { value: "controlled", label: "Controlled — managed but not fully cleared" },
  { value: "reinfected", label: "Cleared then reinfected" },
];

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Washington DC","Puerto Rico","Other US Territory",
];

export const CA_PROVINCES = [
  "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador",
  "Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island",
  "Quebec","Saskatchewan","Yukon",
];

export const COUNTRIES = ["United States","Canada","Australia","Ireland","UK","Other"];

export const CHART_COLORS = [
  "#6D94C5","#4a6fa5","#CBDCEB","#9ab8d8","#3a5a8a","#8fb0d5","#2c4870",
];

export const OUTCOME_COLORS = {
  cleared: "#3d6b4f",
  controlled: "#e8a020",
  ongoing: "#6D94C5",
  reinfected: "#c0392b",
  unknown: "#a09d94",
};
