import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Debit / Credit Card" },
  { id: "netbanking", label: "Net Banking" },
];

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fee, setFee] = useState(null);
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/payments/fee/${id}`).then((res) => setFee(res.data));
  }, [id]);

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      await api.post("/payments/checkout", { applicationId: id, method });
      navigate(`/applications/${id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-gazette flex justify-center py-20">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">Payment Gateway</p>
        <h1 className="mt-2 text-center font-display text-3xl text-gazette-navy">
          Pay the application fee
        </h1>

        <div className="panel mt-8 p-8">
          {error && (
            <p className="mb-5 rounded-sm border border-gazette-maroon/30 bg-gazette-maroon/5 px-3 py-2 text-sm text-gazette-maroon">
              {error}
            </p>
          )}

          <div className="flex items-baseline justify-between border-b border-dashed border-gazette-line pb-4">
            <span className="text-sm text-gazette-ink/60">Statutory RTI fee</span>
            <span className="font-display text-2xl text-gazette-navy">
              {fee ? (fee.amount === 0 ? "Waived" : `₹${fee.amount}`) : "…"}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center justify-between rounded-sm border px-4 py-3 text-sm transition-colors ${
                  method === m.id
                    ? "border-gazette-navy bg-gazette-navy/5"
                    : "border-gazette-line hover:border-gazette-navy/40"
                }`}
              >
                <span>{m.label}</span>
                <input
                  type="radio"
                  name="method"
                  className="accent-gazette-navy"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                />
              </label>
            ))}
          </div>

          <button
            onClick={handlePay}
            disabled={loading || fee === null}
            className="btn-accent mt-8 w-full"
          >
            {loading
              ? "Processing…"
              : fee?.amount === 0
              ? "Confirm & submit application"
              : `Pay ₹${fee?.amount ?? ""} & submit`}
          </button>
          <p className="mt-3 text-center text-xs text-gazette-ink/40">
            This is a simulated payment for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
