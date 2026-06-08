import { useState } from "react";
import { dbFlag } from "../utils/db";

export function FlagButton({ recordId, onFlagged }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);

  const submit = async () => {
    setStatus("loading");
    try {
      await dbFlag(recordId, reason);
      setStatus("done");
      onFlagged();
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return <span style={{ fontSize: "0.75rem", color: "#7a7870" }}>Flagged — thank you.</span>;

  return (
    <div>
      <button className="btn-flag" onClick={() => setOpen(!open)}>
        {open ? "Cancel" : "⚑ Flag entry"}
      </button>
      {open && (
        <div className="flag-inline">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe the issue (wrong data, duplicate, etc.)"
          />
          <button className="btn-flag" onClick={submit} disabled={status === "loading"}>
            {status === "loading" ? "Flagging…" : "Submit flag"}
          </button>
        </div>
      )}
    </div>
  );
}
