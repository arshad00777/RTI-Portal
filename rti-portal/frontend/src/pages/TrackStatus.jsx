import { useState } from "react";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function TrackStatus() {
  const [referenceNo, setReferenceNo] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setApplication(null);
    setLoading(true);
    try {
      const res = await api.get(`/applications/track/${referenceNo.trim()}`);
      setApplication(res.data.application);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-gazette flex justify-center py-20">
      <div className="w-full max-w-lg">
        <p className="eyebrow text-center">RTI Status Tracking</p>
        <h1 className="mt-2 text-center font-display text-3xl text-gazette-navy">
          Track your application
        </h1>
        <p className="mt-3 text-center text-gazette-ink/65">
          Enter the reference number you received at the time of filing.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <input
            required
            className="field-input"
            placeholder="e.g. RTI-2026-483210"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
          <button disabled={loading} className="btn-accent whitespace-nowrap">
            {loading ? "Searching…" : "Track"}
          </button>
        </form>

        {error && (
          <p className="mt-6 rounded-sm border border-gazette-maroon/30 bg-gazette-maroon/5 px-3 py-2 text-sm text-gazette-maroon">
            {error}
          </p>
        )}

        {application && (
          <div className="panel mt-8 p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg text-gazette-navy">{application.subject}</p>
                <p className="mt-1 text-sm text-gazette-ink/50">{application.referenceNo}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <div className="mt-6 space-y-2 border-t border-dashed border-gazette-line pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gazette-ink/60">Department</span>
                <span className="text-right">{application.department?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gazette-ink/60">Filed on</span>
                <span>
                  {application.submittedAt
                    ? new Date(application.submittedAt).toLocaleDateString()
                    : "Not yet submitted"}
                </span>
              </div>
              {application.remarks && (
                <div className="pt-2">
                  <span className="text-gazette-ink/60">Remarks:</span>
                  <p className="mt-1 text-gazette-ink/80">{application.remarks}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
