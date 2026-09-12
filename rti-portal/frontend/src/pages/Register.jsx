import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-gazette flex justify-center py-20">
      <div className="w-full max-w-lg">
        <p className="eyebrow text-center">Register / Login</p>
        <h1 className="mt-2 text-center font-display text-3xl text-gazette-navy">
          Create your citizen account
        </h1>

        <form onSubmit={handleSubmit} className="panel mt-8 p-8 space-y-5">
          {error && (
            <p className="rounded-sm border border-gazette-maroon/30 bg-gazette-maroon/5 px-3 py-2 text-sm text-gazette-maroon">
              {error}
            </p>
          )}
          <div>
            <label className="field-label">Full name</label>
            <input
              required
              className="field-input"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Email address</label>
              <input
                type="email"
                required
                className="field-input"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Phone number</label>
              <input
                required
                className="field-input"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Address</label>
            <textarea
              rows={2}
              className="field-input"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="field-input"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-sm text-gazette-ink/60">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-gazette-navy underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
