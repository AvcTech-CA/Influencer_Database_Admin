import React, { useEffect, useState } from "react";
import API_BASE_URL from "../apiconfig";

const formatValue = (v) => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
};

export default function HistoryModal({ open, onClose, influencerId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");

    fetch(
      `${API_BASE_URL}/admin/api/influencer/${influencerId}/audit?page=${page}&limit=20`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) {
          setLogs(res.data);
          setPages(res.pages || 1);
        } else {
          setError(res?.message || "Failed to load history");
        }
      })
      .catch(() => setError("Network error while loading history"))
      .finally(() => setLoading(false));
  }, [open, page, influencerId]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change History</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {loading ? (
          <div style={{ padding: 16 }}>Loading…</div>
        ) : error ? (
          <div style={{ padding: 16, color: "crimson" }}>{error}</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 16 }}>No changes recorded yet.</div>
        ) : (
          <div className="history-list">
            {logs.map((log) => (
              <div className="history-card" key={log._id}>
                <div className="history-card__header">
                  <div>
                    <div className="history-when">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                    <div className="history-by">
                      Edited by: <strong>{log.adminEmail || log.adminUserId}</strong>
                    </div>
                  </div>
                  {log.influencerName ? (
                    <div className="history-name">{log.influencerName}</div>
                  ) : null}
                </div>
                <div className="history-table-wrap">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th style={{ width: "18%" }}>Field</th>
                        <th style={{ width: "41%" }}>From</th>
                        <th style={{ width: "41%" }}>To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(log.changes || []).map((c, idx) => (
                        <tr key={`${log._id}-${idx}`}>
                          <td className="field">{c.field}</td>
                          <td className="mono">{formatValue(c.oldValue)}</td>
                          <td className="mono">{formatValue(c.newValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <button
            className="add-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span style={{ padding: "0 8px" }}>
            Page {page} / {pages}
          </span>
          <button
            className="add-btn"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
