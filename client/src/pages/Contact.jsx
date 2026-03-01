import { useState } from "react";
import SectionLabel from "../components/ui/SectionLabel";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (sent)
    return (
      <div
        className="page-enter pt-24 min-h-screen flex items-center justify-center text-center"
        style={{ padding: "0 clamp(1rem,5vw,3.5rem)" }}
      >
        <div className="max-w-md">
          <div className="text-6xl mb-6">✉️</div>
          <h2 className="section-h2 mb-4 grad-cyan-violet">Message Sent!</h2>
          <p className="text-slate-400 text-sm" style={{ lineHeight: 1.8 }}>
            We'll get back to you at{" "}
            <strong className="text-cyan-400">{form.email}</strong> within 24–48
            hours. If it's urgent, reach us on Discord.
          </p>
        </div>
      </div>
    );

  return (
    <div className="page-enter pt-24">
      <section style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionLabel>Get In Touch</SectionLabel>
              <h1
                className="section-h2 mb-6"
                style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)" }}
              >
                We're one message
                <br />
                <span className="grad-cyan-violet">away.</span>
              </h1>
              <p
                className="text-slate-400 mb-10 text-sm"
                style={{ lineHeight: 1.8 }}
              >
                Whether you're a student with questions, a company exploring
                partnerships, or just curious about what XSTN does — drop us a
                message.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: "📧",
                    label: "Email",
                    value: "hello@xstn.in",
                    color: "#22d3ee",
                  },
                  {
                    icon: "🎮",
                    label: "Discord",
                    value: "discord.gg/xstn",
                    color: "#a78bfa",
                  },
                  {
                    icon: "💼",
                    label: "LinkedIn",
                    value: "linkedin.com/company/xstn",
                    color: "#34d399",
                  },
                  {
                    icon: "🐙",
                    label: "GitHub",
                    value: "github.com/xstn-network",
                    color: "#f472b6",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="glass rounded-xl p-4 flex items-center gap-4 card-lift anim-fadeup"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{
                        background: c.color + "18",
                        border: `1px solid ${c.color}30`,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        className="text-xs text-slate-500 mb-0.5"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.label}
                      </div>
                      <div className="text-sm text-slate-300 font-medium">
                        {c.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-cyan rounded-2xl p-5 mt-8">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400"
                    style={{ boxShadow: "0 0 6px #34d399" }}
                  />
                  <span
                    className="text-xs text-green-400"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    RESPONSE TIME
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  We typically respond within{" "}
                  <strong className="text-cyan-400">24 hours</strong> on
                  weekdays. For urgent matters, Discord is fastest.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass rounded-2xl p-8">
              <h3
                className="font-bold text-slate-200 mb-6 text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Send a Message
              </h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Name
                    </label>
                    <input
                      className="xstn-input"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs text-slate-500 mb-1.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Email
                    </label>
                    <input
                      className="xstn-input"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Subject
                  </label>
                  <select
                    className="xstn-select"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                  >
                    <option value="">Select topic</option>
                    {[
                      "Joining XSTN",
                      "Partnering / Client Work",
                      "Press / Media",
                      "General Question",
                      "Other",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-xs text-slate-500 mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Message
                  </label>
                  <textarea
                    className="xstn-input"
                    rows={5}
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (form.name && form.email && form.message) setSent(true);
                  }}
                  className="btn-primary w-full py-3.5 rounded-xl font-bold cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Send Message →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
