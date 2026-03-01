import { motion } from "framer-motion";
import NetworkCanvas from "../components/effects/NetworkCanvas";
import GlowOrb from "../components/effects/GlowOrb";
import TypingTerminal from "../components/effects/TypingTerminal";
import StatBadge from "../components/ui/StatBadge";
import SectionLabel from "../components/ui/SectionLabel";
import ServiceCard from "../components/cards/ServiceCard";
import ProjectCard from "../components/cards/ProjectCard";
import CommunityCard from "../components/cards/CommunityCard";

// ── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const tiltIn = {
  hidden: { opacity: 0, y: 32, rotateX: 8 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Reusable pulsing dot ────────────────────────────────────────────────────
const PulseDot = () => (
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
  </span>
);

// ── Ripple ring ─────────────────────────────────────────────────────────────
// animate-ping from Tailwind, size/delay via inline style (no custom class).
const RippleRing = ({ size, delay }) => (
  <span
    className="absolute top-1/2 left-1/2 rounded-full border border-cyan-400/20 -translate-x-1/2 -translate-y-1/2 animate-ping pointer-events-none"
    style={{
      width: size,
      height: size,
      animationDuration: "3s",
      animationDelay: delay,
    }}
  />
);

// ── Marquee keyframes injected once ─────────────────────────────────────────
const MARQUEE_CSS = `@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`;

// ── Component ───────────────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      icon: "💻",
      title: "Full-Stack Development",
      accent: "#22d3ee",
      delay: "0.1s",
      desc: "Student teams shipping production-grade web apps, APIs, and platforms for real clients — not classroom exercises.",
      tags: ["React", "Node.js", "Next.js", "PostgreSQL"],
    },
    {
      icon: "📱",
      title: "Mobile & App Dev",
      accent: "#a78bfa",
      delay: "0.2s",
      desc: "Cross-platform mobile solutions built by students who live on their phones — practical, user-first, deployed.",
      tags: ["Flutter", "React Native", "iOS", "Android"],
    },
    {
      icon: "🤖",
      title: "AI / ML Integration",
      accent: "#34d399",
      delay: "0.3s",
      desc: "From chatbots to computer vision — ML-focused students building intelligent systems that work in production.",
      tags: ["Python", "TensorFlow", "LLMs", "OpenCV"],
    },
    {
      icon: "🔐",
      title: "Cybersecurity",
      accent: "#f472b6",
      delay: "0.4s",
      desc: "Security audits, penetration testing, and hardened architectures by students trained in ethical hacking.",
      tags: ["Pen Testing", "OWASP", "CTF", "Linux"],
    },
    {
      icon: "☁️",
      title: "Cloud & DevOps",
      accent: "#fb923c",
      delay: "0.5s",
      desc: "CI/CD pipelines, containerization, and scalable infrastructure designed by execution-focused students.",
      tags: ["AWS", "Docker", "Kubernetes", "GH Actions"],
    },
    {
      icon: "🎨",
      title: "UI/UX & Design",
      accent: "#fbbf24",
      delay: "0.6s",
      desc: "Research-backed, pixel-perfect interfaces. Design students who prototype, test, and ship production specs.",
      tags: ["Figma", "Design Systems", "Prototyping", "UX Research"],
    },
  ];

  const projects = [
    {
      icon: "📚",
      name: "EduTrack LMS",
      domain: "Full-Stack",
      status: "LIVE",
      progress: 100,
      color: "#34d399",
      delay: "0.1s",
      desc: "A complete learning management system for 3 partner colleges with 2000+ active users.",
    },
    {
      icon: "🗺️",
      name: "CampusMap AI",
      domain: "AI / ML",
      status: "IN SPRINT 3",
      progress: 68,
      color: "#22d3ee",
      delay: "0.2s",
      desc: "Indoor navigation + AI scheduling assistant deployed across 2 campuses.",
    },
    {
      icon: "🔐",
      name: "SecureVault",
      domain: "Cybersecurity",
      status: "REVIEW",
      progress: 88,
      color: "#f472b6",
      delay: "0.3s",
      desc: "End-to-end encrypted document vault with role-based access for SME clients.",
    },
    {
      icon: "🌱",
      name: "AgriSense IoT",
      domain: "Cloud + ML",
      status: "PLANNING",
      progress: 22,
      color: "#fb923c",
      delay: "0.4s",
      desc: "Smart agriculture monitoring system using IoT sensors and predictive ML models.",
    },
  ];

  const community = [
    {
      icon: "🏆",
      title: "Hackathons",
      desc: "Monthly 48-hour XSTN Hacks with real prizes and industry judge panels.",
      color: "#fbbf24",
      delay: "0.1s",
    },
    {
      icon: "🎙️",
      title: "Tech Talks",
      desc: "Weekly sessions from XSTN leads, alumni, and invited industry pros.",
      color: "#22d3ee",
      delay: "0.15s",
    },
    {
      icon: "🤝",
      title: "Mentorship",
      desc: "Senior students mentor juniors. Structured paths from beginner to lead.",
      color: "#34d399",
      delay: "0.2s",
    },
    {
      icon: "📜",
      title: "Certifications",
      desc: "XSTN-certified badges that employers actually recognize. Earned, not given.",
      color: "#a78bfa",
      delay: "0.25s",
    },
    {
      icon: "🌍",
      title: "Open Source",
      desc: "All internal tools go open source. Build your GitHub profile with us.",
      color: "#f472b6",
      delay: "0.3s",
    },
    {
      icon: "💼",
      title: "Placement Prep",
      desc: "Mock interviews, resume reviews, and direct referrals to hiring partners.",
      color: "#fb923c",
      delay: "0.35s",
    },
  ];

  const ticker = [
    "React",
    "Python",
    "Flutter",
    "AWS",
    "Docker",
    "TensorFlow",
    "Node.js",
    "Figma",
    "Kubernetes",
    "Next.js",
    "PostgreSQL",
    "LangChain",
    "Rust",
    "GraphQL",
    "TypeScript",
    "Tailwind CSS",
  ];

  const identityPills = [
    {
      label: "🏢 IT Company",
      classes: "text-cyan-400   bg-cyan-400/10   border-cyan-400/30",
    },
    {
      label: "🎓 Student Community",
      classes: "text-violet-400 bg-violet-400/10 border-violet-400/30",
    },
    {
      label: "🚀 Execution Hub",
      classes: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    },
  ];

  const avatars = [
    { emoji: "👨‍💻", bg: "bg-sky-500" },
    { emoji: "👩‍🎨", bg: "bg-indigo-500" },
    { emoji: "👨‍🔬", bg: "bg-purple-500" },
    { emoji: "👩‍💼", bg: "bg-fuchsia-500" },
    { emoji: "🧑‍🚀", bg: "bg-pink-500" },
  ];

  return (
    <>
      <style>{MARQUEE_CSS}</style>

      <div className="w-full overflow-hidden">
        {/* ── HERO ── */}
        <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950  pb-0">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.09)_2px,rgba(0,0,0,0.09)_4px)] pointer-events-none" />

          <NetworkCanvas />
          <GlowOrb
            color="#0891b2"
            size={600}
            top="-10%"
            left="-5%"
            opacity={0.07}
          />
          <GlowOrb
            color="#7c3aed"
            size={500}
            bottom="-5%"
            right="0%"
            opacity={0.07}
          />
          <GlowOrb
            color="#22d3ee"
            size={300}
            top="40%"
            right="20%"
            opacity={0.04}
            blur={120}
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_85%_80%_at_50%_50%,rgba(34,211,238,0.03)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-14 py-20 flex-1 flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* LEFT */}
              <div>
                {/* Live badge */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.05}
                  className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-10 bg-cyan-400/5 border border-cyan-400/20 backdrop-blur-sm font-mono text-[0.66rem] tracking-widest text-cyan-400"
                >
                  <PulseDot />
                  12 ACTIVE PROJECTS &nbsp;·&nbsp; APPLICATIONS OPEN
                </motion.div>

                {/* H1 */}
                <h1 className="leading-tight tracking-[-0.03em] ">
                  <motion.span
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={0.1}
                    className="block text-slate-100 font-black text-5xl md:text-6xl lg:text-7xl mb-1"
                  >
                    Where Students
                  </motion.span>
                  <motion.span
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={0.2}
                    className="block font-black text-5xl md:text-6xl lg:text-7xl mb-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    Don't Just Learn —
                  </motion.span>
                  <motion.span
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={0.3}
                    className="block font-black text-5xl md:text-6xl lg:text-7xl"
                  >
                    <span className="text-slate-100">They </span>
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                        Execute.
                      </span>
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                    </span>
                  </motion.span>
                </h1>

                {/* Subheading */}

                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.4}
                  className="mt-12 mb-10 text-slate-400 leading-relaxed max-w-lg text-lg"
                >
                  <strong className="text-slate-200">
                    XSTN – Xplorevo Student Tech Network
                  </strong>{" "}
                  is India's student-driven IT execution platform. Real clients.
                  Real tech stacks. Real impact — delivered by 500+ student
                  engineers, designers & innovators.
                </motion.p>

                {/* Identity pills */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.5}
                  className="flex flex-wrap gap-3 mb-12"
                >
                  {identityPills.map(({ label, classes }, i) => (
                    <span
                      key={i}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold border ${classes}`}
                    >
                      {label}
                    </span>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.6}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go("join")}
                    className="rounded-xl px-10 py-4 font-bold text-base cursor-pointer bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_32px_rgba(34,211,238,0.45)] transition-shadow"
                  >
                    Join the Network →
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go("projects")}
                    className="rounded-xl px-8 py-4 font-semibold text-base cursor-pointer bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    View Projects ↗
                  </motion.button>
                </motion.div>
              </div>

              {/* RIGHT */}
              <motion.div
                variants={tiltIn}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-8 mt-12 lg:mt-0"
              >
                <TypingTerminal />
                <div className="grid grid-cols-2 gap-5">
                  <StatBadge
                    value="500+"
                    label="Student Engineers"
                    icon="👨‍💻"
                    delay="0.4s"
                  />
                  <StatBadge
                    value="12"
                    label="Live Projects"
                    icon="🚀"
                    delay="0.5s"
                    accent="#a78bfa"
                  />
                  <StatBadge
                    value="8"
                    label="Tech Domains"
                    icon="⚡"
                    delay="0.6s"
                    accent="#34d399"
                  />
                  <StatBadge
                    value="30+"
                    label="Colleges"
                    icon="🏫"
                    delay="0.7s"
                    accent="#f472b6"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Ticker strip */}
          <div className="w-full overflow-hidden border-y border-cyan-400/[0.07] py-5 relative z-20 bg-slate-950/80 backdrop-blur-sm">
            <div
              className="flex w-max"
              style={{ animation: "marquee 28s linear infinite" }}
            >
              {[...Array(2)].map((_, ri) => (
                <div key={ri} className="flex">
                  {ticker.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-3 text-slate-500 border-r border-cyan-400/[0.07] px-8 font-mono text-[0.8rem] tracking-wide"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES PREVIEW ── */}
        <section className="relative w-full py-24 lg:py-32 px-4 sm:px-8 lg:px-14 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
              <div className="mb-6">
                <SectionLabel>What We Build</SectionLabel>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Six domains. One network.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Infinite execution.
                </span>
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
                Each domain is staffed by trained students and led by
                experienced peer mentors.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {services.map((s, i) => (
                <motion.div key={i} variants={cardVariant}>
                  <ServiceCard {...s} />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-20">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => go("services")}
                className="rounded-xl px-10 py-4 text-base font-semibold cursor-pointer bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 transition-colors"
              >
                Explore All Services →
              </motion.button>
            </div>
          </div>
        </section>

        {/* ── PROJECTS PREVIEW ── */}
        <section className="relative w-full py-24 lg:py-32 px-4 sm:px-8 lg:px-14 bg-slate-900/40">
          <GlowOrb
            color="#7c3aed"
            size={400}
            top="20%"
            right="-5%"
            opacity={0.05}
          />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-20">
              <div className="flex flex-col items-start">
                <div className="mb-6">
                  <SectionLabel>Live Projects</SectionLabel>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                  Real work. Real impact.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Shipped by students.
                  </span>
                </h2>
              </div>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => go("projects")}
                className="rounded-xl px-8 py-3.5 text-base font-semibold cursor-pointer whitespace-nowrap self-start md:self-auto bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
              >
                All Projects →
              </motion.button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {projects.map((p, i) => (
                <motion.div key={i} variants={cardVariant}>
                  <ProjectCard {...p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── COMMUNITY PREVIEW ── */}
        <section className="relative w-full py-24 lg:py-32 px-4 sm:px-8 lg:px-14 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
              <div className="mb-6">
                <SectionLabel>Community</SectionLabel>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                More than a network —<br />
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  a movement.
                </span>
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {community.map((c, i) => (
                <motion.div key={i} variants={cardVariant}>
                  <CommunityCard {...c} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative w-full py-24 lg:py-32 px-4 sm:px-8 lg:px-14 pb-40 bg-slate-950">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="relative rounded-[2.5rem] overflow-hidden text-center px-8 sm:px-16 py-20 lg:py-28 bg-gradient-to-br from-cyan-900/20 to-violet-900/20 border border-cyan-400/15">
              <GlowOrb
                color="#0891b2"
                size={400}
                top="-30%"
                left="-10%"
                opacity={0.1}
              />
              <GlowOrb
                color="#7c3aed"
                size={350}
                bottom="-20%"
                right="0%"
                opacity={0.1}
              />

              {/* Ripple rings */}
              <RippleRing size={100} delay="0s" />
              <RippleRing size={180} delay="1s" />
              <RippleRing size={260} delay="2s" />

              <div className="relative z-20 flex flex-col items-center">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-5 py-2 rounded-full text-xs font-mono tracking-widest text-emerald-400 mb-8 bg-emerald-400/10 border border-emerald-400/20"
                >
                  APPLICATIONS OPEN — BATCH 2025
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8"
                >
                  Ready to stop learning
                  <br />
                  and start{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    building?
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-slate-400 max-w-lg mx-auto mb-12 text-base lg:text-lg leading-relaxed"
                >
                  Apply to XSTN and join a network of students who ship real
                  products, earn real experience, and launch real careers.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap gap-5 justify-center w-full"
                >
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go("join")}
                    className="rounded-xl px-12 py-5 font-bold text-base cursor-pointer bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-shadow"
                  >
                    Apply Now — It's Free
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go("partner")}
                    className="rounded-xl px-10 py-5 font-semibold text-base cursor-pointer bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    Partner With Us →
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 w-full"
                >
                  <div className="flex -space-x-3">
                    {avatars.map(({ emoji, bg }, i) => (
                      <div
                        key={i}
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-base border-2 border-slate-950 shadow-md ${bg}`}
                        style={{ zIndex: avatars.length - i }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="text-base text-slate-400">
                    Joined by{" "}
                    <strong className="text-cyan-400 font-semibold">
                      500+ students
                    </strong>{" "}
                    from 30+ colleges
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
