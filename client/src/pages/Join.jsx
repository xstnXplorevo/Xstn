import { useState } from "react";
import SectionLabel from "../components/ui/SectionLabel";

const JoinPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    domain: "",
    github: "",
    why: "",
    portfolio: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const domains = [
    "Full-Stack Development",
    "Mobile & App Dev",
    "AI / ML Engineering",
    "Cybersecurity",
    "Cloud & DevOps",
    "UI/UX & Design",
    "Project Management",
    "Community & Events",
  ];

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div
        className="page-enter pt-24 min-h-screen flex items-center justify-center"
        style={{ padding: "0 clamp(1rem,5vw,3.5rem)" }}
      >
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6 anim-float">🚀</div>
          <h2 className="section-h2 mb-4 grad-shift">Application Submitted!</h2>
          <p
            className="text-slate-400 mb-8 text-sm"
            style={{ lineHeight: 1.8 }}
          >
            Welcome to the XSTN queue,{" "}
            <strong className="text-cyan-400">{form.name}</strong>! We review
            applications every Monday. You'll hear back within 5–7 business days
            at <strong className="text-cyan-400">{form.email}</strong>.
          </p>
          <div className="glass rounded-2xl p-6 mb-8 text-left space-y-3">
            {[
              ["Domain Applied", "📌 " + form.domain],
              ["Next Step", "📧 Check your email for confirmation"],
              ["Join Discord", "🎮 XSTN community while you wait"],
              ["Response Time", "⏱️ 5–7 business days"],
            ].map(([k, v], i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm({
                name: "",
                email: "",
                college: "",
                year: "",
                domain: "",
                github: "",
                why: "",
                portfolio: "",
              });
            }}
            className="btn-ghost rounded-xl px-6 py-2.5 text-sm cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Submit Another →
          </button>
        </div>
      </div>
    );

  return (
    <div className="page-enter pt-24">
      <section style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Apply Now</SectionLabel>
            <h1
              className="section-h2 mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              Join the network
              <br />
              <span className="grad-cyan-violet">that executes.</span>
            </h1>
            <p
              className="text-slate-400 text-sm max-w-md mx-auto"
              style={{ lineHeight: 1.8 }}
            >
              Applications take ~5 minutes. No coding test required — we care
              about attitude, not just aptitude.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 justify-center mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background:
                      step >= s
                        ? "linear-gradient(135deg, #0891b2, #7c3aed)"
                        : "rgba(255,255,255,0.05)",
                    color: step >= s ? "#fff" : "rgba(148,163,184,0.4)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className="w-16 h-0.5 mx-1 rounded-full transition-all duration-500"
                    style={{
                      background:
                        step > s
                          ? "linear-gradient(90deg, #0891b2, #7c3aed)"
                          : "rgba(255,255,255,0.07)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h3
                  className="font-bold text-slate-200 mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Basic Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Full Name *
                    </label>
                    <input
                      className="xstn-input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Email *
                    </label>
                    <input
                      className="xstn-input"
                      placeholder="you@college.edu"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      College / University *
                    </label>
                    <input
                      className="xstn-input"
                      placeholder="Your college name"
                      value={form.college}
                      onChange={(e) => update("college", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Current Year *
                    </label>
                    <select
                      className="xstn-select"
                      value={form.year}
                      onChange={(e) => update("year", e.target.value)}
                    >
                      <option value="">Select year</option>
                      {[
                        "1st Year",
                        "2nd Year",
                        "3rd Year",
                        "4th Year",
                        "Post-Graduate",
                      ].map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (form.name && form.email && form.college && form.year)
                      setStep(2);
                  }}
                  className="btn-primary w-full py-3.5 rounded-xl font-bold mt-2 cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3
                  className="font-bold text-slate-200 mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Domain & Experience
                </h3>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Preferred Domain *
                  </label>
                  <select
                    className="xstn-select"
                    value={form.domain}
                    onChange={(e) => update("domain", e.target.value)}
                  >
                    <option value="">Choose your domain</option>
                    {domains.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    GitHub Profile
                  </label>
                  <input
                    className="xstn-input"
                    placeholder="github.com/yourhandle"
                    value={form.github}
                    onChange={(e) => update("github", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Portfolio / LinkedIn (optional)
                  </label>
                  <input
                    className="xstn-input"
                    placeholder="your portfolio or LinkedIn URL"
                    value={form.portfolio}
                    onChange={(e) => update("portfolio", e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-ghost flex-1 py-3.5 rounded-xl font-semibold cursor-pointer"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      if (form.domain) setStep(3);
                    }}
                    className="btn-primary flex-1 py-3.5 rounded-xl font-bold cursor-pointer"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3
                  className="font-bold text-slate-200 mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tell Us About You
                </h3>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Why do you want to join XSTN? *
                  </label>
                  <textarea
                    className="xstn-input"
                    rows={5}
                    placeholder="Tell us what drives you, what you've built, and what you want to build with XSTN..."
                    value={form.why}
                    onChange={(e) => update("why", e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                  <p className="text-xs text-slate-600 mt-1.5">
                    Tip: Mention a project you've worked on, even if it's small.
                    We care about builders.
                  </p>
                </div>
                <div className="glass-cyan rounded-xl p-4 flex gap-3">
                  <span className="text-lg">💡</span>
                  <p
                    className="text-xs text-slate-400"
                    style={{ lineHeight: 1.7 }}
                  >
                    No coding test. No filter. We look for curiosity,
                    initiative, and willingness to ship — regardless of
                    experience level.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-ghost flex-1 py-3.5 rounded-xl font-semibold cursor-pointer"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary flex-1 py-3.5 rounded-xl font-bold cursor-pointer"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Submit Application 🚀
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              ["⚡", "Reviewed in 5–7 days"],
              ["🔒", "Your data stays private"],
              ["🆓", "100% free to join"],
            ].map(([i, l]) => (
              <div key={l} className="text-center glass rounded-xl p-4">
                <div className="text-xl mb-1.5">{i}</div>
                <div className="text-xs text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;
