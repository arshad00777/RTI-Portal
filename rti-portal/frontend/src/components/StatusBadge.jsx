const STATUS_STYLES = {
  draft: "bg-gazette-ink/5 text-gazette-ink/60 border-gazette-ink/20",
  payment_pending: "bg-gazette-saffron/10 text-gazette-saffronDark border-gazette-saffron/40",
  submitted: "bg-gazette-navy/5 text-gazette-navy border-gazette-navy/30",
  under_review: "bg-blue-50 text-blue-800 border-blue-200",
  info_provided: "bg-gazette-teal/10 text-gazette-teal border-gazette-teal/40",
  transferred: "bg-purple-50 text-purple-800 border-purple-200",
  rejected: "bg-gazette-maroon/10 text-gazette-maroon border-gazette-maroon/40",
  closed: "bg-gazette-ink/10 text-gazette-ink/70 border-gazette-ink/30",
};

const STATUS_LABELS = {
  draft: "Draft",
  payment_pending: "Payment pending",
  submitted: "Submitted",
  under_review: "Under review",
  info_provided: "Information provided",
  transferred: "Transferred",
  rejected: "Rejected",
  closed: "Closed",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${style}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
