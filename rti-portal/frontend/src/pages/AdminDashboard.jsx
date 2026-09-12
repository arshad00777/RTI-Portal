import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [statusFilter]);

  async function load() {
    setLoading(true);
    const [statsRes, appsRes] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/applications", { params: statusFilter ? { status: statusFilter } : {} }),
    ]);
    setStats(statsRes.data);
    setApplications(appsRes.data.applications);
    setLoading(false);
  }

  const cards = stats
    ? [
        { label: "Total applications", value: stats.totalApplications },
        { label: "Registered citizens", value: stats.totalUsers },
        { label: "Departments onboarded", value: stats.totalDepartments },
        { label: "Fees collected", value: `₹${stats.revenue}` },
      ]
    : [];

  return (
    <div className="container-gazette py-16">
      <p className="eyebrow">Admin Dashboard</p>
      <h1 className="mt-2 font-display text-3xl text-gazette-navy">Portal overview</h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl text-gazette-navy">{c.value}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="panel mt-8 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">
            Applications by status
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 rounded-sm border border-gazette-line px-3 py-1.5 text-sm">
                <StatusBadge status={status} />
                <span className="text-gazette-ink/60">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl text-gazette-navy">All applications</h2>
        <select
          className="field-input w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="payment_pending">Payment pending</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under review</option>
          <option value="info_provided">Information provided</option>
          <option value="rejected">Rejected</option>
          <option value="transferred">Transferred</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="mt-4 divide-y divide-gazette-line border-y border-gazette-line">
        {loading && <p className="py-6 text-sm text-gazette-ink/50">Loading…</p>}
        {!loading && applications.length === 0 && (
          <p className="py-6 text-sm text-gazette-ink/50">No applications match this filter.</p>
        )}
        {applications.map((a) => (
          <Link
            key={a.id}
            to={`/applications/${a.id}`}
            className="grid gap-2 py-5 transition-colors hover:bg-gazette-navy/[0.02] md:grid-cols-[1fr_auto_auto] md:items-center"
          >
            <div>
              <p className="font-display text-base text-gazette-navy">{a.subject}</p>
              <p className="mt-1 text-xs text-gazette-ink/50">
                {a.referenceNo} · {a.applicant?.fullName} · {a.department?.name}
              </p>
            </div>
            <StatusBadge status={a.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
