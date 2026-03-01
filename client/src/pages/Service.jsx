import { useState } from "react";
import SectionLabel from "../components/ui/SectionLabel";
import TagPill from "../components/ui/TagPill";
const ServicesPage = ({ setPage }) => {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: "💻",
      title: "Full-Stack Development",
      accent: "#22d3ee",
      shortDesc: "End-to-end web apps for real clients.",
      desc: "Our full-stack teams handle everything from architecture to deployment. We've shipped LMS platforms, e-commerce portals, SaaS dashboards, and more — using modern, scalable tech stacks chosen to match client needs.",
      tags: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "Prisma"],
      deliverables: [
        "Web Applications",
        "REST & GraphQL APIs",
        "Admin Dashboards",
        "Database Architecture",
        "Performance Optimization",
      ],
    },
    {
      icon: "📱",
      title: "Mobile & App Dev",
      accent: "#a78bfa",
      shortDesc: "Cross-platform apps that ship.",
      desc: "From consumer apps to internal enterprise tools, our mobile team builds for real devices with real users. We prioritize UX, performance, and App Store-readiness from day one.",
      tags: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
      deliverables: [
        "iOS Apps",
        "Android Apps",
        "Cross-Platform Apps",
        "Push Notifications",
        "Offline-First Architecture",
      ],
    },
    {
      icon: "🤖",
      title: "AI / ML Integration",
      accent: "#34d399",
      shortDesc: "Intelligent systems that work in production.",
      desc: "Not just demos — we integrate AI that actually works at scale. From LLM-powered chatbots to computer vision pipelines, our ML students bring academic rigor to production systems.",
      tags: [
        "Python",
        "TensorFlow",
        "PyTorch",
        "OpenCV",
        "LangChain",
        "FastAPI",
      ],
      deliverables: [
        "Chatbots & Assistants",
        "Image Recognition",
        "Predictive Models",
        "NLP Pipelines",
        "AI API Integration",
      ],
    },
    {
      icon: "🔐",
      title: "Cybersecurity",
      accent: "#f472b6",
      shortDesc: "Security that's earned, not assumed.",
      desc: "Our security team conducts thorough audits, identifies vulnerabilities before attackers do, and helps clients build hardened architectures from the ground up.",
      tags: ["Kali Linux", "Burp Suite", "OWASP", "Nmap", "Metasploit"],
      deliverables: [
        "Pen Testing",
        "Security Audits",
        "Vulnerability Reports",
        "Hardening Guides",
        "OWASP Compliance",
      ],
    },
    {
      icon: "☁️",
      title: "Cloud & DevOps",
      accent: "#fb923c",
      shortDesc: "Infrastructure that scales.",
      desc: "We architect, deploy, and maintain cloud-native infrastructure. From zero to production with CI/CD, container orchestration, and monitoring built in from day one.",
      tags: [
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "GitHub Actions",
        "Prometheus",
      ],
      deliverables: [
        "CI/CD Pipelines",
        "Container Orchestration",
        "Cloud Migration",
        "IaC Setup",
        "Monitoring & Alerts",
      ],
    },
    {
      icon: "🎨",
      title: "UI/UX & Design Systems",
      accent: "#fbbf24",
      shortDesc: "Design that converts and delights.",
      desc: "Research-first design thinking meets pixel-perfect execution. We build design systems that scale and interfaces that users actually want to use.",
      tags: [
        "Figma",
        "Design Tokens",
        "Accessibility",
        "User Research",
        "Prototyping",
      ],
      deliverables: [
        "Design Systems",
        "High-Fidelity Prototypes",
        "UX Audit Reports",
        "Responsive UI",
        "Component Libraries",
      ],
    },
  ];

  const cur = services[activeService];

  return (
    <div className="page-enter pt-24">
      <section style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Our Services</SectionLabel>
            <h1
              className="section-h2 mb-4"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}
            >
              Student-grade talent.
              <br />
              <span className="grad-cyan-violet">
                Production-grade results.
              </span>
            </h1>
            <p
              className="text-slate-400 max-w-lg mx-auto text-sm"
              style={{ lineHeight: 1.8 }}
            >
              Six specialized domains. Each staffed by vetted, trained students
              and led by experienced peer mentors.
            </p>
          </div>

          {/* Service Explorer */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="flex flex-col gap-2">
              {services.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveService(i)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-200 cursor-pointer"
                  style={{
                    background:
                      activeService === i
                        ? s.accent + "12"
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeService === i ? s.accent + "40" : "rgba(255,255,255,0.06)"}`,
                    fontFamily: "inherit",
                  }}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{
                        color:
                          activeService === i
                            ? "#f1f5f9"
                            : "rgba(148,163,184,0.7)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {s.title}
                    </div>
                    <div className="text-xs text-slate-600">{s.shortDesc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <div
              className="lg:col-span-2 glass rounded-2xl p-8"
              style={{ borderColor: cur.accent + "25" }}
              key={activeService}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background: cur.accent + "18",
                    border: `1px solid ${cur.accent}30`,
                  }}
                >
                  {cur.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-xl text-slate-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cur.title}
                  </h3>
                  <div
                    className="w-12 h-0.5 rounded-full mt-1.5"
                    style={{ background: cur.accent }}
                  />
                </div>
              </div>
              <p
                className="text-slate-400 mb-7 text-sm"
                style={{ lineHeight: 1.8 }}
              >
                {cur.desc}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div
                    className="text-xs text-slate-500 uppercase tracking-widest mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cur.tags.map((t, i) => (
                      <TagPill key={i} label={t} color={cur.accent} />
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs text-slate-500 uppercase tracking-widest mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Deliverables
                  </div>
                  <ul className="space-y-1.5">
                    {cur.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-400"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: cur.accent }}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="mt-8 pt-6 border-t flex gap-3"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <button
                  onClick={() => go("join")}
                  className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Request This Service
                </button>
                <button
                  onClick={() => go("partner")}
                  className="btn-ghost rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process section */}
      <section
        className="border-t"
        style={{
          borderColor: "rgba(34,211,238,0.07)",
          padding: "80px clamp(1rem,5vw,3.5rem)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>How We Work</SectionLabel>
            <h2 className="section-h2">
              From brief to
              <span className="grad-cyan-violet"> production.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Submit Brief",
                desc: "Tell us what you need. We'll scope it with you in a free 30-min call.",
                icon: "📋",
              },
              {
                step: "02",
                title: "Team Match",
                desc: "We assign a domain team — vetted students with the right skill set.",
                icon: "🤝",
              },
              {
                step: "03",
                title: "Sprint Execution",
                desc: "2-week sprints, daily standups, real GitHub commits, peer-reviewed PRs.",
                icon: "⚡",
              },
              {
                step: "04",
                title: "Ship & Support",
                desc: "Project ships to production. We offer 30-day post-launch support.",
                icon: "🚀",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 anim-fadeup card-lift"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-mono text-slate-600">
                    {s.step}
                  </span>
                </div>
                <div
                  className="font-bold text-slate-200 mb-2 text-sm"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </div>
                <p
                  className="text-xs text-slate-500"
                  style={{ lineHeight: 1.7 }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
