import { useState } from "react";
import GlowOrb from "../components/effects/GlowOrb";
import SectionLabel from "../components/ui/SectionLabel";
const PartnerPage = () => {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    type: "",
    budget: "",
    brief: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const benefits = [
    {
      icon: "💰",
      title: "Cost-Effective",
      desc: "Get production-quality work at a fraction of agency rates. Student teams are hungry to prove themselves.",
    },
    {
      icon: "🔄",
      title: "Agile & Fast",
      desc: "Two-week sprints. Weekly demos. No bloated processes — just focused execution.",
    },
    {
      icon: "🧠",
      title: "Fresh Perspectives",
      desc: "Students bring unfiltered creativity and the latest academic knowledge to your problems.",
    },
    {
      icon: "🌱",
      title: "Impact-Driven",
      desc: "Partner with XSTN and you're directly investing in India's next generation of tech talent.",
    },
    {
      icon: "🤝",
      title: "Dedicated POC",
      desc: "One point of contact handles communication while a trained team does the building.",
    },
    {
      icon: "📊",
      title: "Transparent Progress",
      desc: "Live project dashboards, weekly reports, and full GitHub access at all times.",
    },
  ];

  if (submitted)
    return (
      <div
        className="page-enter pt-24 min-h-screen flex items-center justify-center text-center"
        style={{ padding: "0 clamp(1rem,5vw,3.5rem)" }}
      >
        <div className="max-w-lg">
          <div className="text-6xl mb-6">🤝</div>
          <h2 className="section-h2 mb-4 grad-cyan-violet">
            Partnership Request Received!
          </h2>
          <p className="text-slate-400 text-sm" style={{ lineHeight: 1.8 }}>
            Thank you, <strong className="text-cyan-400">{form.name}</strong>{" "}
            from <strong className="text-cyan-400">{form.company}</strong>. Our
            partnerships team will reach out to{" "}
            <strong className="text-cyan-400">{form.email}</strong> within 48
            hours to schedule a discovery call.
          </p>
        </div>
      </div>
    );

  return (
    <div className="page-enter pt-24">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ padding: "80px clamp(1rem,5vw,3.5rem) 60px" }}
      >
        <GlowOrb
          color="#0891b2"
          size={500}
          top="-15%"
          left="-5%"
          opacity={0.06}
        />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Partner With Us</SectionLabel>
            <h1
              className="section-h2 mb-6"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}
            >
              Hire student talent.
              <br />
              <span className="grad-cyan-violet">Get company results.</span>
            </h1>
            <p
              className="text-slate-400 mb-8 text-sm"
              style={{ lineHeight: 1.8 }}
            >
              XSTN partners get access to 500+ skilled students across 8 tech
              domains — vetted, trained, and execution-ready. We've shipped
              production apps, APIs, and design systems for startups, NGOs, and
              growing businesses.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["⚡", "48hr Scoping Response"],
                ["🏆", "Production-Grade Work"],
                ["🔍", "Full Code Transparency"],
                ["📞", "Dedicated Liaison"],
              ].map(([i, l]) => (
                <div
                  key={l}
                  className="flex items-center gap-3 glass rounded-xl p-3.5"
                >
                  <span className="text-xl">{i}</span>
                  <span className="text-sm text-slate-300">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partner form */}
          <div className="glass rounded-2xl p-8">
            <h3
              className="font-bold text-slate-200 mb-6 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start a Conversation
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Company Name
                  </label>
                  <input
                    className="xstn-input"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Your Name
                  </label>
                  <input
                    className="xstn-input"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs text-slate-500 mb-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Work Email
                </label>
                <input
                  className="xstn-input"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Partnership Type
                  </label>
                  <select
                    className="xstn-select"
                    value={form.type}
                    onChange={(e) => update("type", e.target.value)}
                  >
                    <option value="">Select type</option>
                    {[
                      "Project Execution",
                      "Talent Hire",
                      "Mentorship/Talk",
                      "Sponsorship",
                      "Long-term Engagement",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Budget Range
                  </label>
                  <select
                    className="xstn-select"
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                  >
                    <option value="">Approx. budget</option>
                    {[
                      "< ₹50K",
                      "₹50K – ₹2L",
                      "₹2L – ₹10L",
                      "₹10L+",
                      "Discuss first",
                    ].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="block text-xs text-slate-500 mb-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Project Brief
                </label>
                <textarea
                  className="xstn-input"
                  rows={4}
                  placeholder="Tell us what you need built or how you'd like to partner..."
                  value={form.brief}
                  onChange={(e) => update("brief", e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>
              <button
                onClick={() => {
                  if (form.company && form.email) setSubmitted(true);
                }}
                className="btn-primary w-full py-3.5 rounded-xl font-bold cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Send Partnership Request →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "60px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Why Partner?</SectionLabel>
            <h2 className="section-h2">
              What you get
              <br />
              <span className="grad-cyan-violet">when you work with XSTN.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 card-lift anim-fadeup"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl block mb-4">{b.icon}</span>
                <h3
                  className="font-bold text-slate-200 mb-2 text-sm"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-xs text-slate-500"
                  style={{ lineHeight: 1.7 }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
