import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FlagButton } from "./FlagButton";
import { PROTOCOL_LABELS, CHART_COLORS, OUTCOME_COLORS } from "../constants";
import { dbFetch, configured } from "../utils/db";
import { generateDogName } from "../utils/dogName";

export function DashboardTab({ localData }) {
  const [data, setData] = useState(localData);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState(null);

  const load = () => {
    if (!configured) {
      setData(localData);
      return;
    }
    setLoading(true);
    dbFetch()
      .then((rows) => {
        setData(rows);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(load, []);

  if (loading) return <p className="loading">Loading reports…</p>;
  if (error) return <div className="banner-error">Failed to load: {error}</div>;

  const total = data.length;
  if (!total)
    return <p className="empty">No submissions yet. Be the first to submit.</p>;

  const cleared = data.filter((d) => d.outcome === "cleared").length;
  const active = data.filter((d) => d.submission_type === "active").length;

  const protocolCounts = {};
  data.forEach((d) => {
    if (d.protocol_used) {
      const lbl = PROTOCOL_LABELS[d.protocol_used] || d.protocol_used;
      const short = lbl
        .replace("Advantage Multi", "Adv. Multi")
        .replace("Drontal Plus", "Drontal")
        .replace(" (moxidectin)", "")
        .replace(" off-label", "");
      protocolCounts[short] = (protocolCounts[short] || 0) + 1;
    }
  });
  const protocolData = Object.entries(protocolCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const outcomeCounts = {};
  data.forEach((d) => {
    if (d.outcome)
      outcomeCounts[d.outcome] = (outcomeCounts[d.outcome] || 0) + 1;
  });
  const outcomeData = Object.entries(outcomeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const geoCounts = {};
  data.forEach((d) => {
    if (d.adopter_province)
      geoCounts[d.adopter_province] = (geoCounts[d.adopter_province] || 0) + 1;
  });
  const geoData = Object.entries(geoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, count]) => ({ name, count }));

  const giCounts = {};
  data.forEach((d) => {
    if (d.gi_side_effects)
      giCounts[d.gi_side_effects] = (giCounts[d.gi_side_effects] || 0) + 1;
  });
  const giData = Object.entries(giCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const tooltipStyle = {
    background: "#fff",
    border: "1px solid #E8DFCA",
    borderRadius: 6,
    fontSize: "0.78rem",
    fontFamily: "DM Sans, sans-serif",
  };

  return (
    <div>
      <p className="section-label">Summary</p>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{total}</div>
          <div className="stat-lbl">Total reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{active}</div>
          <div className="stat-lbl">Active treatment</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">
            {total ? Math.round((cleared / total) * 100) : 0}%
          </div>
          <div className="stat-lbl">Cleared</div>
        </div>
      </div>

      {protocolData.length > 0 && (
        <div className="chart-section">
          <hr className="divider" />
          <p className="chart-title">Reports by protocol</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={protocolData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 8, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={200}
                tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#F5EFE6" }}
              />
              <Bar dataKey="count" fill="#6D94C5" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {outcomeData.length > 0 && (
        <div className="chart-section">
          <hr className="divider" />
          <p className="chart-title">Outcomes</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={outcomeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${Math.round(percent * 100)}%`
                }
                labelLine={true}
              >
                {outcomeData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      OUTCOME_COLORS[entry.name] ||
                      CHART_COLORS[i % CHART_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {geoData.length > 0 && (
        <div className="chart-section">
          <hr className="divider" />
          <p className="chart-title">Reports by state / province</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={geoData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 8, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#F5EFE6" }}
              />
              <Bar dataKey="count" fill="#6D94C5" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {giData.length > 0 && (
        <div className="chart-section">
          <hr className="divider" />
          <p className="chart-title">GI side effects reported</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={giData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name} ${Math.round(percent * 100)}%`
                }
              >
                {giData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <hr className="divider" />
      <p className="section-label">Recent submissions</p>
      {data.slice(0, 10).map((r) => (
        <div className="report-card" key={r.id}>
          <div className="report-card-header">
            <span className="report-earmark">{generateDogName(r.earmark)}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span
                className={`badge ${r.submission_type === "completed" ? "badge-completed" : "badge-active"}`}
              >
                {r.submission_type === "completed" ? "Completed" : "Active"}
              </span>
              {r.flagged && (
                <span className="badge badge-flagged">Flagged</span>
              )}
            </div>
          </div>
          <div className="report-meta">
            <div>Submitted: {new Date(r.created_at).toLocaleDateString()}</div>
            <div>
              Protocol:{" "}
              {PROTOCOL_LABELS[r.protocol_used] || r.protocol_used || "—"}
            </div>
            <div>Outcome: {r.outcome || "pending"} · </div>
          </div>
          {!r.flagged && (
            <div className="report-actions">
              <FlagButton recordId={r.id} onFlagged={load} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
