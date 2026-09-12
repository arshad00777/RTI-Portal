import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function ApplyRTI() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    departmentId: "",
    subject: "",
    queryText: "",
    applicantCategory: "general",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/departments").then((res) => setDepartments(res.data.departments));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("document", file);

      const res = await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/applications/${res.data.application.id}/pay`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-gazette max-w-3xl py-16">
      <p className="eyebrow">RTI Apply Form</p>
      <h1 className="mt-2 font-display text-3xl text-gazette-navy">
        File a new RTI application
      </h1>
      <p className="mt-3 text-gazette-ink/65">
        Describe the information you're seeking as specifically as possible —
        it helps the Public Information Officer respond faster.
      </p>

      <form onSubmit={handleSubmit} className="panel mt-10 p-8 space-y-6">
        {error && (
          <p className="rounded-sm border border-gazette-maroon/30 bg-gazette-maroon/5 px-3 py-2 text-sm text-gazette-maroon">
            {error}
          </p>
        )}

        <div>
          <label className="field-label">Department / Public Authority</label>
          <select
            required
            className="field-input"
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
          >
            <option value="">Select a department…</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.state} — {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Subject</label>
          <input
            required
            className="field-input"
            placeholder="e.g. Status of road repair sanctioned in Ward 12"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">Information sought</label>
          <textarea
            required
            rows={6}
            className="field-input"
            placeholder="Describe exactly what documents, data, or clarification you are requesting…"
            value={form.queryText}
            onChange={(e) => setForm({ ...form, queryText: e.target.value })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="field-label">Applicant category</label>
            <select
              className="field-input"
              value={form.applicantCategory}
              onChange={(e) => setForm({ ...form, applicantCategory: e.target.value })}
            >
              <option value="general">General</option>
              <option value="bpl">Below Poverty Line (fee waived)</option>
            </select>
          </div>
          <div>
            <label className="field-label">Supporting document (optional)</label>
            <input
              type="file"
              className="field-input file:mr-3 file:rounded-sm file:border-0 file:bg-gazette-navy file:px-3 file:py-1.5 file:text-xs file:text-white"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full sm:w-auto">
          {loading ? "Submitting…" : "Continue to payment"}
        </button>
      </form>
    </div>
  );
}
