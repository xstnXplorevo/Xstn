import { useState } from "react";
import SectionLabel from "../components/ui/SectionLabel";
import TagPill from "../components/ui/TagPill";
const ProjectsPage = ({ setPage }) => {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [filter, setFilter] = useState("All");

  const allProjects = [
    {
      icon: "📚",
      name: "EduTrack LMS",
      domain: "Full-Stack",
      status: "LIVE",
      progress: 100,
      color: "#34d399",
      delay: "0.05s",
      desc: "A complete learning management system for 3 partner colleges with 2000+ active users, featuring live quizzes, progress tracking, and admin analytics.",
      tags: ["React", "Node.js", "PostgreSQL"],
    },
    {
      icon: "🗺️",
      name: "CampusMap AI",
      domain: "AI / ML",
      status: "IN SPRINT 3",
      progress: 68,
      color: "#22d3ee",
      delay: "0.1s",
      desc: "Indoor navigation + AI scheduling assistant deployed across 2 campuses. Uses computer vision for real-time occupancy detection.",
      tags: ["Python", "TensorFlow", "React Native"],
    },
    {
      icon: "🔐",
      name: "SecureVault",
      domain: "Cybersecurity",
      status: "REVIEW",
      progress: 88,
      color: "#f472b6",
      delay: "0.15s",
      desc: "End-to-end encrypted document vault with role-based access for SME clients. Passed OWASP Top 10 audit.",
      tags: ["Node.js", "AES-256", "React"],
    },
    {
      icon: "🌱",
      name: "AgriSense IoT",
      domain: "Cloud + ML",
      status: "PLANNING",
      progress: 22,
      color: "#fb923c",
      delay: "0.2s",
      desc: "Smart agriculture monitoring with IoT sensors and predictive ML models for crop yield forecasting.",
      tags: ["Python", "AWS IoT", "Flutter"],
    },
    {
      icon: "🛒",
      name: "LocalMart",
      domain: "Full-Stack",
      status: "LIVE",
      progress: 100,
      color: "#34d399",
      delay: "0.25s",
      desc: "Hyperlocal e-commerce platform connecting 50+ local vendors with 3000+ users in a tier-2 city.",
      tags: ["Next.js", "Stripe", "PostgreSQL"],
    },
    {
      icon: "🧘",
      name: "MindSpace App",
      domain: "Mobile",
      status: "IN SPRINT 1",
      progress: 40,
      color: "#a78bfa",
      delay: "0.3s",
      desc: "Mental wellness app for students with mood tracking, guided meditation, and peer support chat rooms.",
      tags: ["Flutter", "Firebase", "Python"],
    },
    {
      icon: "🏥",
      name: "HealthQueue",
      domain: "Full-Stack",
      status: "LIVE",
      progress: 100,
      color: "#34d399",
      delay: "0.35s",
      desc: "Hospital queue management system reducing patient wait times by 40% across 3 clinics.",
      tags: ["React", "Express", "MySQL"],
    },
    {
      icon: "🎓",
      name: "XSTN Portal",
      domain: "Full-Stack",
      status: "IN SPRINT 2",
      progress: 60,
      color: "#22d3ee",
      delay: "0.4s",
      desc: "XSTN's own internal project management and member portal — built by students, for students.",
      tags: ["Next.js", "Prisma", "Tailwind"],
    },
  ];

  const domains = ["All", ...new Set(allProjects.map((p) => p.domain))];
  const filtered =
    filter === "All"
      ? allProjects
      : allProjects.filter((p) => p.domain === filter);

  return (
    <div className="page-enter pt-24">
      <section style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <SectionLabel>Portfolio</SectionLabel>
            <h1
              className="section-h2 mb-4"
              style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}
            >
              Real projects.
              <br />
              <span className="grad-green-cyan">Real users. Real impact.</span>
            </h1>
            <p className="text-slate-400 text-sm" style={{ lineHeight: 1.8 }}>
              Every project here was scoped, built, and shipped by XSTN student
              teams — not demos, not mockups. Live, in production.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                style={{
                  background:
                    filter === d
                      ? "linear-gradient(135deg, #0891b2, #7c3aed)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    filter === d ? "none" : "1px solid rgba(255,255,255,0.09)",
                  color: filter === d ? "#fff" : "rgba(148,163,184,0.7)",
                  fontFamily: "inherit",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <div
                key={p.name}
                className="glass rounded-2xl p-6 card-lift anim-fadeup flex flex-col"
                style={{ animationDelay: `${i * 0.06}s` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p.color + "40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div
                        className="font-bold text-slate-100 text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {p.name}
                      </div>
                      <div
                        className="text-xs text-slate-500"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {p.domain}
                      </div>
                    </div>
                  </div>
                  <span
                    className="tag-pill shrink-0 ml-2"
                    style={{
                      background:
                        (p.status === "LIVE" ? "#34d399" : "#22d3ee") + "18",
                      border: `1px solid ${p.status === "LIVE" ? "#34d399" : "#22d3ee"}35`,
                      color: p.status === "LIVE" ? "#34d399" : "#22d3ee",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <p
                  className="text-xs text-slate-500 mb-4 flex-1"
                  style={{ lineHeight: 1.7 }}
                >
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t, i) => (
                    <TagPill key={i} label={t} color={p.color} />
                  ))}
                </div>
                <div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{
                        "--target-width": `${p.progress}%`,
                        background: `linear-gradient(90deg, ${p.color}, ${p.color}77)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-600">Completion</span>
                    <span
                      className="text-xs"
                      style={{ color: p.color, fontFamily: "var(--font-mono)" }}
                    >
                      {p.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit idea CTA */}
          <div
            className="mt-12 glass rounded-2xl p-8 text-center"
            style={{
              borderColor: "rgba(34,211,238,0.15)",
              background: "rgba(34,211,238,0.03)",
            }}
          >
            <div className="text-3xl mb-3">💡</div>
            <h3
              className="font-bold text-slate-200 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Have a project idea?
            </h3>
            <p
              className="text-sm text-slate-500 mb-6 max-w-sm mx-auto"
              style={{ lineHeight: 1.7 }}
            >
              Submit your idea and XSTN teams will evaluate, scope, and
              potentially execute it — student entrepreneurship in action.
            </p>
            <button
              onClick={() => go("join")}
              className="btn-primary rounded-xl px-8 py-3 text-sm font-bold cursor-pointer"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Submit a Project Idea →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
