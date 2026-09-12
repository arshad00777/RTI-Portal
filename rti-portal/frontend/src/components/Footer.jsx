export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gazette-line bg-gazette-navy text-gazette-paper/80">
      <div className="container-gazette grid gap-10 py-14 md:grid-cols-3">
        <div>
          <span className="font-display text-xl text-white">RTI e-Filing Portal</span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gazette-paper/60">
            A single window to file, track and receive replies to Right to
            Information applications under the RTI Act, 2005.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Citizen services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-gazette-paper/60">
            <li>Apply for RTI</li>
            <li>Track application status</li>
            <li>Department &amp; PIO directory</li>
            <li>Pay application fee online</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Helpdesk</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-gazette-paper/60">
            <li>helpdesk@rtiportal.gov.in</li>
            <li>1800-11-0000 (toll free)</li>
            <li>Mon–Fri, 9:30 AM – 6:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gazette-paper/40">
        This is a demonstration portal built for illustrative purposes.
      </div>
    </footer>
  );
}
