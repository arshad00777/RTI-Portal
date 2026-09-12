import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load(q) {
    setLoading(true);
    const res = await api.get("/departments", { params: q ? { q } : {} });
    setDepartments(res.data.departments);
    setLoading(false);
  }

  return (
    <div className="container-gazette py-16">
      <p className="eyebrow">Department Directory</p>
      <h1 className="mt-2 font-display text-3xl text-gazette-navy">
        Find the right public authority
      </h1>
      <p className="mt-3 max-w-xl text-gazette-ink/65">
        Search by department name or Public Information Officer to see where
        to direct your application.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
        className="mt-8 flex max-w-md gap-3"
      >
        <input
          className="field-input"
          placeholder="Search departments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-outline whitespace-nowrap">Search</button>
      </form>

      <div className="mt-10 divide-y divide-gazette-line border-y border-gazette-line">
        {loading && <p className="py-6 text-sm text-gazette-ink/50">Loading…</p>}
        {!loading && departments.length === 0 && (
          <p className="py-6 text-sm text-gazette-ink/50">No departments found.</p>
        )}
        {departments.map((d) => (
          <div key={d.id} className="grid gap-2 py-6 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gazette-saffronDark">
                {d.state}
              </span>
              <h3 className="mt-1 font-display text-lg text-gazette-navy">{d.name}</h3>
              <p className="mt-1 text-sm text-gazette-ink/60">
                {d.pioName} — {d.pioDesignation}
              </p>
              <p className="mt-1 text-sm text-gazette-ink/50">{d.address}</p>
            </div>
            <div className="text-sm text-gazette-ink/60 md:text-right">
              <p>{d.email}</p>
              <p>{d.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
