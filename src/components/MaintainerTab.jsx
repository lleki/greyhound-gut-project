import { useState } from "react";
import { PROTOCOL_LABELS } from "../constants";
import { dbFetchFlagged, dbDelete, dbUpdate, MAINTAINER_KEY } from "../utils/db";

export function MaintainerTab() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = () => {
    if (pass === MAINTAINER_KEY) {
      setAuthed(true);
      loadFlagged();
    } else alert("Incorrect key.");
  };

  const loadFlagged = async () => {
    setLoading(true);
    try {
      const rows = await dbFetchFlagged();
      setData(rows);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record permanently?")) return;
    await dbDelete(id);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUnflag = async (id) => {
    await dbUpdate(id, { flagged: false, flag_reason: null });
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  if (!authed)
    return (
      <div>
        <p style={{ fontSize: "0.85rem", color: "#5a5854", marginBottom: "1rem" }}>
          Maintainer access. Enter your key to review flagged entries.
        </p>
        <div style={{ display: "flex", gap: 10, maxWidth: 360 }}>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Maintainer key"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={login}>
            Enter
          </button>
        </div>
      </div>
    );

  if (loading) return <p className="loading">Loading flagged entries…</p>;
  if (error) return <div className="banner-error">{error}</div>;

  return (
    <div>
      <p className="section-label">Flagged entries ({data.length})</p>
      {data.length === 0 && <p className="empty">No flagged entries.</p>}
      {data.map((r) => (
        <div className="report-card" key={r.id}>
          <div className="report-card-header">
            <span className="report-earmark">{r.earmark}</span>
            <span className="badge badge-flagged">Flagged</span>
          </div>
          <div className="report-meta">
            <div>Protocol: {PROTOCOL_LABELS[r.protocol_used] || r.protocol_used || "—"}</div>
            <div>Outcome: {r.outcome || "—"}</div>
            <div>Flag reason: {r.flag_reason || "none given"}</div>
            <div>Submitted: {new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <div className="report-actions">
            <button className="btn-secondary" onClick={() => handleUnflag(r.id)}>Unflag</button>
            <button className="btn-danger" onClick={() => handleDelete(r.id)}>Delete permanently</button>
          </div>
        </div>
      ))}
    </div>
  );
}
