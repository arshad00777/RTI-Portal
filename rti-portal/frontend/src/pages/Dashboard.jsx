import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/mine").then((res) => {
      setApplications(res.data.applications);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-gazette py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My Applications</p>
          <h1 className="mt-2 font-display text-3xl text-gazette-navy">
            Your RTI application history
          </h1>
        </div>
        <Link to="/apply" className="btn-accent">File a new application</Link>
      </div>

      <div className="mt-10 divide-y divide-gazette-line border-y border-gazette-line">
        {loading && <p className="py-6 text-sm text-gazette-ink/50">Loading…</p>}
        {!loading && applications.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-gazette-ink/60">You haven't filed any applications yet.</p>
            <Link to="/apply" className="btn-outline mt-4 inline-flex">
              File your first RTI application
            </Link>
          </div>
        )}
        {applications.map((a) => (
          <Link
            key={a.id}
            to={`/applications/${a.id}`}
            className="grid gap-3 py-6 transition-colors hover:bg-gazette-navy/[0.02] md:grid-cols-[1fr_auto] md:items-center"
          >
            <div>
              <p className="font-display text-lg text-gazette-navy">{a.subject}</p>
              <p className="mt-1 text-sm text-gazette-ink/50">
                {a.referenceNo} · {a.department?.name}
              </p>
            </div>
            <StatusBadge status={a.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
