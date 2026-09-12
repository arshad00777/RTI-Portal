import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_OPTIONS = [
  "submitted",
  "under_review",
  "info_provided",
  "rejected",
  "transferred",
  "closed",
];

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const res = await api.get(`/applications/${id}`);
    setApplication(res.data.application);
    setStatus(res.data.application.status);
    setRemarks(res.data.application.remarks || "");
    setLoading(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/applications/${id}/status`, { status, remarks });
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container-gazette py-20 text-gazette-ink/50">Loading…</div>;
  if (!application) return <div className="container-gazette py-20">Application not found.</div>;

  const isOfficial = user?.role === "admin" || user?.role === "pio";

  return (
    <div className="container-gazette max-w-3xl py-16">
      <p className="eyebrow">{application.referenceNo}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-gazette-navy">{application.subject}</h1>
        <StatusBadge status={application.status} />
      </div>

      <div className="panel mt-8 p-8 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">
            Information sought
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gazette-ink/80">{application.queryText}</p>
        </div>
        <div className="grid gap-5 border-t border-dashed border-gazette-line pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">Department</p>
            <p className="mt-1 text-sm">{application.department?.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">Applicant category</p>
            <p className="mt-1 text-sm capitalize">{application.applicantCategory}</p>
          </div>
          {isOfficial && application.applicant && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">Applicant</p>
              <p className="mt-1 text-sm">{application.applicant.fullName} · {application.applicant.email}</p>
            </div>
          )}
          {application.payment && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">Payment</p>
              <p className="mt-1 text-sm">
                ₹{application.payment.amount} · {application.payment.status} · {application.payment.receiptNo}
              </p>
            </div>
          )}
          {application.documentPath && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">Attachment</p>
              <a
                href={application.documentPath}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-gazette-navy underline"
              >
                View document
              </a>
            </div>
          )}
        </div>

        {application.status === "payment_pending" && !isOfficial && (
          <Link to={`/applications/${application.id}/pay`} className="btn-accent inline-flex">
            Complete payment to submit
          </Link>
        )}

        {application.remarks && !isOfficial && (
          <div className="border-t border-dashed border-gazette-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gazette-ink/40">
              Remarks from the department
            </p>
            <p className="mt-2 text-sm text-gazette-ink/80">{application.remarks}</p>
          </div>
        )}
      </div>

      {isOfficial && (
        <form onSubmit={handleUpdate} className="panel mt-8 p-8 space-y-5">
          <p className="eyebrow">Update status (PIO / Admin)</p>
          <div>
            <label className="field-label">Status</label>
            <select className="field-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Remarks / reply to the applicant</label>
            <textarea
              rows={4}
              className="field-input"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <button disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save update"}
          </button>
        </form>
      )}
    </div>
  );
}
