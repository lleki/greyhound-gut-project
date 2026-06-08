import { useState } from "react";
import "./App.css";
import { SubmitTab } from "./components/SubmitTab";
import { UpdateTab } from "./components/UpdateTab";
import { DashboardTab } from "./components/DashboardTab";
import { AboutTab } from "./components/AboutTab";
import { MaintainerTab } from "./components/MaintainerTab";

const TABS = ["Submit", "Update record", "Dashboard", "About", "Maintainer"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Submit");
  const [localData, setLocalData] = useState([]);

  const handleLocalSubmit = (payload) =>
    setLocalData((prev) => [payload, ...prev]);

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1 className="app-wordmark">Greyhound Gut Project</h1>
        <p className="app-tagline">
          NGA greyhounds · community-sourced treatment outcomes · open data
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
      {activeTab === "Update record" && <UpdateTab />}
      {activeTab === "Dashboard" && <DashboardTab localData={localData} />}
      {activeTab === "About" && <AboutTab />}
      {activeTab === "Maintainer" && <MaintainerTab />}
    </div>
  );
}

/*
SQL — run in Supabase SQL Editor
=================================

create table hookworm_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  earmark text not null,
  litter_number text,
  birth_month integer,
  birth_year integer,
  tattoo_order text,
  kennel_name text,
  adopter_country text,
  adopter_province text,
  current_city text,
  fecal_before text,
  protocol_used text,
  gi_side_effects text,
  months_on_protocol text,
  fecal_after text,
  escalated_profender text,
  outcome text,
  notes text,
  submission_type text default 'completed',
  flagged boolean default false,
  flag_reason text
);

-- If adding current_city to an existing table:
-- alter table hookworm_reports add column current_city text;

alter table hookworm_reports enable row level security;

create policy "allow_public_insert" on hookworm_reports
  for insert with check (true);

create policy "allow_public_select" on hookworm_reports
  for select using (true);

create policy "allow_public_update" on hookworm_reports
  for update using (true) with check (true);

create policy "allow_public_delete" on hookworm_reports
  for delete using (true);
*/
