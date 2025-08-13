import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../apiconfig";
import "./influencerHistory.css";

const formatValue = (v) => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
};

export default function InfluencerHistory() {
  const { id } = useParams(); // influencerId from route
  const navigate = useNavigate();
  const { state } = useLocation(); // optional: { influencerName }
  const influencerName = state?.influencerName;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/admin/api/influencer/${id}/audit?page=${page}&limit=20`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
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
  }, [id, page]);

  const flattened = useMemo(() => {
    // convert logs -> array of { when, admin, field, from, to }
    const rows = [];
    for (const log of logs) {
      for (const ch of log.changes || []) {
        rows.push({
          id: `${log._id}-${ch.field}-${rows.length}`,
          when: new Date(log.createdAt),
          admin: log.adminEmail || log.adminUserId,
          field: ch.field,
          from: ch.oldValue,
          to: ch.newValue,
        });
      }
    }
    return rows;
  }, [logs]);

  const filtered = useMemo(() => {
    const a = adminFilter.trim().toLowerCase();
    const f = fieldFilter.trim().toLowerCase();
    return flattened.filter((r) => {
      const adminOk = a ? String(r.admin).toLowerCase().includes(a) : true;
      const fieldOk = f ? String(r.field).toLowerCase().includes(f) : true;
      return adminOk && fieldOk;
    });
  }, [flattened, adminFilter, fieldFilter]);

  const exportCSV = () => {
    const header = ["When", "Admin", "Field", "From", "To"];
    const lines = [header.join(",")];
    filtered.forEach((r) => {
      const row = [
        r.when.toISOString(),
        `"${String(r.admin).replace(/"/g, '""')}"`,
        `"${String(r.field).replace(/"/g, '""')}"`,
        `"${formatValue(r.from).replace(/"/g, '""')}"`,
        `"${formatValue(r.to).replace(/"/g, '""')}"`,
      ];
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${influencerName || id}-history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="history-page container">
      <div className="history-page__topbar">
        <button className="add-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="history-page__title">
          <h2>Change History</h2>
          <div className="history-page__subtitle">
            {influencerName ? <>Influencer: <strong>{influencerName}</strong></> : "Influencer History"}
          </div>
        </div>
        <div className="history-page__actions">
          <button className="add-btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="history-page__filters">
        <input
          className="filter-input"
          placeholder="Filter by admin email"
          value={adminFilter}
          onChange={(e) => setAdminFilter(e.target.value)}
        />
        <input
          className="filter-input"
          placeholder="Filter by field name"
          value={fieldFilter}
          onChange={(e) => setFieldFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="history-page__status">Loading…</div>
      ) : error ? (
        <div className="history-page__status error">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="history-page__status">No changes found.</div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th style={{ width: "18%" }}>When</th>
                <th style={{ width: "18%" }}>Admin</th>
                <th style={{ width: "16%" }}>Field</th>
                <th style={{ width: "24%" }}>From</th>
                <th style={{ width: "24%" }}>To</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td title={r.when.toISOString()}>{r.when.toLocaleString()}</td>
                  <td>{r.admin}</td>
                  <td className="field">{r.field}</td>
                  <td className="mono">{formatValue(r.from)}</td>
                  <td className="mono">{formatValue(r.to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="history-page__pager">
        <button
          className="add-btn"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>Page {page} / {pages}</span>
        <button
          className="add-btn"
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
