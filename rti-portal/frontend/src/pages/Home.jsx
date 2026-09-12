import { Link } from "react-router-dom";

const steps = [
  {
    n: "1",
    title: "Apply online",
    body: "Pick the department, describe the information you need, and attach any supporting document.",
  },
  {
    n: "2",
    title: "Pay the fee",
    body: "A ₹10 statutory fee is collected instantly online. It's waived for applicants below the poverty line.",
  },
  {
    n: "3",
    title: "Track the reply",
    body: "Follow your application by its reference number until the Public Information Officer responds.",
  },
];

const guarantees = [
  {
    title: "30-day statutory reply",
    body: "Public authorities must respond within 30 days, or 48 hours for matters of life and liberty.",
  },
  {
    title: "First appeal, built in",
    body: "If you're unsatisfied with a reply, the same reference number carries into an appeal.",
  },
  {
    title: "Fee waived for BPL",
    body: "No application fee is charged to applicants who hold a Below Poverty Line card.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="container-gazette pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Right to Information Act, 2005</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] text-gazette-navy md:text-5xl">
              Ask your government.
              <br />
              Get it in writing.
            </h1>
            <p className="mt-6 max-w-md text-gazette-ink/70 leading-relaxed">
              Every citizen has the right to request information from a public
              authority. File your application in minutes, pay the fee online,
              and track the reply — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/apply" className="btn-accent">File an RTI application</Link>
              <Link to="/track" className="btn-outline">Track an existing application</Link>
            </div>
          </div>

          <div className="panel p-8">
            <p className="eyebrow">Sample acknowledgement</p>
            <div className="mt-4 space-y-3 font-display text-sm text-gazette-ink/80">
              <div className="flex justify-between border-b border-dashed border-gazette-line pb-3">
                <span>Reference No.</span>
                <span className="text-gazette-navy">RTI-2026-483210</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gazette-line pb-3">
                <span>Department</span>
                <span>Rural Development</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-gazette-line pb-3">
                <span>Filed on</span>
                <span>12 Sep 2026</span>
              </div>
              <div className="flex justify-between">
                <span>Reply due by</span>
                <span className="text-gazette-teal">12 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gazette-line bg-white/60">
        <div className="container-gazette py-16">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 font-display text-2xl text-gazette-navy md:text-3xl">
            Three steps, start to finish
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="border-l-2 border-gazette-saffron pl-5">
                <span className="font-display text-3xl text-gazette-saffron">{s.n}</span>
                <h3 className="mt-2 font-display text-lg text-gazette-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gazette-ink/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-gazette py-16">
        <p className="eyebrow">Why it matters</p>
        <h2 className="mt-2 font-display text-2xl text-gazette-navy md:text-3xl">
          What the Act guarantees you
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {guarantees.map((g) => (
            <div key={g.title} className="panel p-6">
              <h3 className="font-display text-lg text-gazette-navy">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gazette-ink/65">{g.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
