import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-gazette-navy" : "text-gazette-ink/60 hover:text-gazette-navy"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 bg-gazette-paper/95 backdrop-blur border-b border-gazette-line">
      <div className="tricolor-rule" />
      <div className="container-gazette flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gazette-navy text-gazette-navy font-display text-lg">
            RTI
          </span>
          <span className="font-display text-lg leading-tight text-gazette-navy">
            e-Filing Portal
            <span className="block text-[11px] font-body font-medium tracking-wide text-gazette-ink/50">
              Right to Information Act, 2005
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/apply" className={navLinkClass}>Apply for RTI</NavLink>
          <NavLink to="/track" className={navLinkClass}>Track Status</NavLink>
          <NavLink to="/departments" className={navLinkClass}>Department Directory</NavLink>
          {user?.role === "citizen" && (
            <NavLink to="/dashboard" className={navLinkClass}>My Applications</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>Admin Dashboard</NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gazette-ink/60">Hi, {user.fullName.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-ghost">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-accent">Register</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gazette-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gazette-line bg-gazette-paper">
          <div className="container-gazette flex flex-col gap-4 py-4">
            <NavLink to="/apply" className={navLinkClass} onClick={() => setOpen(false)}>Apply for RTI</NavLink>
            <NavLink to="/track" className={navLinkClass} onClick={() => setOpen(false)}>Track Status</NavLink>
            <NavLink to="/departments" className={navLinkClass} onClick={() => setOpen(false)}>Department Directory</NavLink>
            {user?.role === "citizen" && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>My Applications</NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin Dashboard</NavLink>
            )}
            <div className="flex gap-3 pt-2">
              {user ? (
                <button onClick={handleLogout} className="btn-ghost">Sign out</button>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost" onClick={() => setOpen(false)}>Sign in</Link>
                  <Link to="/register" className="btn-accent" onClick={() => setOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
