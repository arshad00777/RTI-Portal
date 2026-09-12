import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const dest = location.state?.from || (user.role === "admin" ? "/admin" : "/dashboard");
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-gazette flex justify-center py-20">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">Welcome back</p>
        <h1 className="mt-2 text-center font-display text-3xl text-gazette-navy">Sign in</h1>

        <form onSubmit={handleSubmit} className="panel mt-8 p-8 space-y-5">
          {error && (
            <p className="rounded-sm border border-gazette-maroon/30 bg-gazette-maroon/5 px-3 py-2 text-sm text-gazette-maroon">
              {error}
            </p>
          )}
          <div>
            <label className="field-label">Email address</label>
            <input
              type="email"
              required
              className="field-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              className="field-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-center text-sm text-gazette-ink/60">
            New here?{" "}
            <Link to="/register" className="font-medium text-gazette-navy underline">
              Create an account
            </Link>
          </p>
          <div className="rounded-sm bg-gazette-navy/5 px-3 py-2 text-xs text-gazette-ink/60">
            Demo citizen: asha.verma@example.com / Citizen@123 <br />
            Demo admin: admin@rtiportal.gov.in / Admin@123
          </div>
        </form>
      </div>
    </div>
  );
}
