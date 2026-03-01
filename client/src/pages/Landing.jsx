// ============================================================
// XSTN – Xplorevo Student Tech Network
// Full Website | React + Tailwind CSS
// Component-ready structure — each section marked for splitting
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS (centralized — easy to theme later)
// ─────────────────────────────────────────────────────────────
const TOKENS = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  pink: "#f472b6",
  green: "#34d399",
  orange: "#fb923c",
  yellow: "#fbbf24",
  bg: "#03060f",
  bgCard: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.07)",
  borderCyan: "rgba(34,211,238,0.2)",
};

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES (injected once)
// ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

    :root {
      --cyan: #22d3ee;
      --violet: #a78bfa;
      --pink: #f472b6;
      --green: #34d399;
      --bg: #03060f;
      --font-display: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: #e2e8f0;
      font-family: var(--font-body);
      overflow-x: hidden;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #03060f; }
    ::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.4); border-radius: 2px; }

    /* ── KEYFRAMES ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-18px); }
    }
    @keyframes floatYB {
      0%,100% { transform: translateY(0) rotate(-1deg); }
      50%     { transform: translateY(-12px) rotate(1deg); }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes pulseGlow {
      0%,100% { opacity: 0.6; transform: scale(1); }
      50%     { opacity: 1;   transform: scale(1.06); }
    }
    @keyframes blink {
      0%,100% { opacity: 1; } 50% { opacity: 0; }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes gradShift {
      0%,100% { background-position: 0% 50%; }
      50%     { background-position: 100% 50%; }
    }
    @keyframes ripple {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes countUp {
      from { transform: translateY(14px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes borderRun {
      0%   { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes scanDown {
      from { transform: translateY(-100%); }
      to   { transform: translateY(100vh); }
    }
    @keyframes tiltIn {
      from { opacity: 0; transform: perspective(800px) rotateX(20deg) translateY(30px); }
      to   { opacity: 1; transform: perspective(800px) rotateX(0deg) translateY(0); }
    }

    /* ── UTILITY ANIMATIONS ── */
    .anim-fadeup   { animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
    .anim-fadein   { animation: fadeIn 0.6s ease forwards; opacity: 0; }
    .anim-slidein  { animation: slideRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
    .anim-tiltin   { animation: tiltIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
    .anim-float    { animation: floatY 6s ease-in-out infinite; }
    .anim-floatb   { animation: floatYB 8s ease-in-out infinite; }
    .anim-spin     { animation: spinSlow 20s linear infinite; }
    .anim-pulse    { animation: pulseGlow 3s ease-in-out infinite; }

    /* delay helpers */
    .d-0  { animation-delay: 0s; }
    .d-1  { animation-delay: 0.1s; }
    .d-2  { animation-delay: 0.2s; }
    .d-3  { animation-delay: 0.3s; }
    .d-4  { animation-delay: 0.4s; }
    .d-5  { animation-delay: 0.5s; }
    .d-6  { animation-delay: 0.6s; }
    .d-7  { animation-delay: 0.7s; }
    .d-8  { animation-delay: 0.8s; }
    .d-9  { animation-delay: 0.9s; }
    .d-10 { animation-delay: 1.0s; }

    /* gradient text utility */
    .grad-cyan-violet {
      background: linear-gradient(135deg, #22d3ee, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .grad-shift {
      background: linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradShift 5s ease infinite;
    }
    .grad-green-cyan {
      background: linear-gradient(135deg, #34d399, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* glass card */
    .glass {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(20px);
    }
    .glass-cyan {
      background: rgba(34,211,238,0.05);
      border: 1px solid rgba(34,211,238,0.18);
      backdrop-filter: blur(20px);
    }

    /* glow button */
    .btn-primary {
      background: linear-gradient(135deg, #0891b2, #7c3aed);
      color: #fff;
      border: none;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(34,211,238,0.3); }

    .btn-ghost {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #e2e8f0;
      transition: all 0.25s ease;
    }
    .btn-ghost:hover { border-color: rgba(34,211,238,0.35); background: rgba(34,211,238,0.06); }

    /* nav link */
    .nav-link {
      color: rgba(148,163,184,0.75);
      font-size: 0.84rem;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 99px;
      transition: all 0.2s ease;
      cursor: pointer;
      font-family: var(--font-body);
    }
    .nav-link:hover, .nav-link.active {
      color: #22d3ee;
      background: rgba(34,211,238,0.08);
    }

    /* section label */
    .label-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #22d3ee;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }
    .label-tag::before {
      content: '';
      display: block;
      width: 22px;
      height: 1px;
      background: #22d3ee;
    }

    /* section heading */
    .section-h2 {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4.5vw, 3.2rem);
      font-weight: 800;
      color: #f1f5f9;
      letter-spacing: -0.025em;
      line-height: 1.12;
    }

    /* card hover lift */
    .card-lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card-lift:hover {
      transform: translateY(-6px);
    }

    /* noise texture */
    .noise::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      opacity: 0.35;
      border-radius: inherit;
    }

    /* terminal blink */
    .cursor { animation: blink 1s step-end infinite; }

    /* marquee */
    .marquee-inner { animation: marquee 28s linear infinite; }

    /* page transition */
    .page-enter { animation: fadeUp 0.5s ease forwards; opacity: 0; }

    /* input focus */
    .xstn-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #e2e8f0;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 0.88rem;
      transition: all 0.25s;
      font-family: var(--font-body);
      width: 100%;
      outline: none;
    }
    .xstn-input:focus {
      border-color: rgba(34,211,238,0.4);
      background: rgba(34,211,238,0.04);
      box-shadow: 0 0 0 3px rgba(34,211,238,0.08);
    }
    .xstn-input::placeholder { color: rgba(148,163,184,0.4); }

    /* select */
    .xstn-select {
      appearance: none;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #e2e8f0;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 0.88rem;
      transition: all 0.25s;
      font-family: var(--font-body);
      width: 100%;
      outline: none;
      cursor: pointer;
    }
    .xstn-select:focus { border-color: rgba(34,211,238,0.4); }
    option { background: #0f1a2e; }

    /* progress bar */
    @keyframes progressFill {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    .progress-bar { animation: progressFill 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s forwards; width: 0%; }

    /* ripple orb */
    .ripple-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(34,211,238,0.3);
      animation: ripple 3s ease-out infinite;
    }

    /* tag pill */
    .tag-pill {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      padding: 3px 10px;
      border-radius: 99px;
      letter-spacing: 0.04em;
    }

    /* grid bg */
    .grid-bg {
      background-image:
        linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    /* scanlines */
    .scanlines {
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px);
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// ⬛ SHARED MICRO-COMPONENTS
// (split into: components/ui/*)
// ─────────────────────────────────────────────────────────────

// -- NetworkCanvas (split → components/effects/NetworkCanvas.jsx)
const NetworkCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.018;
        if (n.x < 0) n.x = canvas.width;
        if (n.x > canvas.width) n.x = 0;
        if (n.y < 0) n.y = canvas.height;
        if (n.y > canvas.height) n.y = 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${0.3 + 0.25 * Math.sin(n.pulse)})`;
        ctx.fill();
      });
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x,
            dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${0.1 * (1 - d / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
};

// -- TypingTerminal (split → components/effects/TypingTerminal.jsx)
const TypingTerminal = () => {
  const lines = [
    {
      prefix: "$ xstn",
      rest: " --init student-tech-network",
      color: "#22d3ee",
    },
    {
      prefix: "✓",
      rest: " Connecting 500+ student engineers...",
      color: "#34d399",
    },
    {
      prefix: "✓",
      rest: " 12 active projects deployed to production",
      color: "#34d399",
    },
    {
      prefix: "✓",
      rest: " 8 tech domains · 30+ colleges · 1 mission",
      color: "#34d399",
    },
    {
      prefix: "→",
      rest: " XSTN LIVE: Build. Launch. Execute.",
      color: "#a78bfa",
    },
  ];
  const [done, setDone] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const full = lines[lineIdx].prefix + lines[lineIdx].rest;
    if (chars < full.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 26);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone((d) => [...d, lines[lineIdx]]);
      setLineIdx((i) => i + 1);
      setChars(0);
    }, 180);
    return () => clearTimeout(t);
  }, [lineIdx, chars]);

  const cur = lineIdx < lines.length ? lines[lineIdx] : null;
  const full = cur ? cur.prefix + cur.rest : "";
  const shown = full.slice(0, chars);

  return (
    <div
      className="rounded-2xl p-5 glass"
      style={{
        minHeight: 188,
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.68rem,1.3vw,0.82rem)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <span className="ml-2 text-slate-500" style={{ fontSize: "0.7rem" }}>
          xstn — bash
        </span>
      </div>
      {done.map((l, i) => (
        <div key={i} className="flex mb-1.5">
          <span style={{ color: l.color, minWidth: 18, marginRight: 5 }}>
            {l.prefix}
          </span>
          <span className="text-slate-300">{l.rest}</span>
        </div>
      ))}
      {cur && (
        <div className="flex">
          <span style={{ color: cur.color, minWidth: 18, marginRight: 5 }}>
            {shown.slice(0, cur.prefix.length)}
          </span>
          <span className="text-slate-300">
            {shown.slice(cur.prefix.length)}
          </span>
          <span
            className="cursor inline-block w-2 h-4 ml-0.5 align-middle"
            style={{ background: "#22d3ee", verticalAlign: "middle" }}
          />
        </div>
      )}
    </div>
  );
};

// -- SectionLabel (split → components/ui/SectionLabel.jsx)
const SectionLabel = ({ children }) => (
  <span className="label-tag">{children}</span>
);

// -- GlowOrb background decoration (split → components/effects/GlowOrbs.jsx)
const GlowOrb = ({
  color,
  size,
  top,
  left,
  right,
  bottom,
  opacity = 0.08,
  blur = 80,
}) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      top,
      left,
      right,
      bottom,
      background: color,
      filter: `blur(${blur}px)`,
      opacity,
    }}
  />
);

// -- StatBadge (split → components/ui/StatBadge.jsx)
const StatBadge = ({
  value,
  label,
  icon,
  delay = "0s",
  accent = "#22d3ee",
}) => (
  <div
    className="glass rounded-2xl p-4 text-center card-lift anim-fadeup"
    style={{ animationDelay: delay, "--accent": accent }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = accent + "50";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
    }}
  >
    <div className="text-2xl mb-1">{icon}</div>
    <div
      className="font-black text-2xl mb-0.5"
      style={{
        fontFamily: "var(--font-display)",
        background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </div>
    <div className="text-xs uppercase tracking-widest text-slate-500">
      {label}
    </div>
  </div>
);

// -- TagPill (split → components/ui/TagPill.jsx)
const TagPill = ({ label, color = "#22d3ee" }) => (
  <span
    className="tag-pill"
    style={{ background: color + "18", border: `1px solid ${color}35`, color }}
  >
    {label}
  </span>
);

// -- ServiceCard (split → components/cards/ServiceCard.jsx)
const ServiceCard = ({ icon, title, desc, tags, accent, delay }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="glass rounded-2xl p-7 card-lift relative overflow-hidden anim-fadeup cursor-default"
      style={{
        animationDelay: delay,
        boxShadow: hov ? `0 24px 60px ${accent}18` : "none",
        borderColor: hov ? accent + "40" : "rgba(255,255,255,0.07)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
          opacity: hov ? 1 : 0,
        }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>
      <h3
        className="font-bold text-slate-100 text-base mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-slate-400 leading-relaxed mb-5"
        style={{ lineHeight: 1.7 }}
      >
        {desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <TagPill key={i} label={t} color={accent} />
        ))}
      </div>
    </div>
  );
};

// -- ProjectCard (split → components/cards/ProjectCard.jsx)
const ProjectCard = ({
  name,
  domain,
  status,
  progress,
  color,
  icon,
  desc,
  delay,
}) => {
  const statusColors = {
    LIVE: "#34d399",
    "IN SPRINT": "#22d3ee",
    REVIEW: "#f472b6",
    PLANNING: "#fb923c",
  };
  const sc =
    Object.keys(statusColors).find((k) => status.startsWith(k)) || "LIVE";
  return (
    <div
      className="glass rounded-2xl p-6 card-lift anim-fadeup"
      style={{ animationDelay: delay }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color + "40";
        e.currentTarget.style.background = color + "06";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div
              className="font-bold text-slate-100 text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </div>
            <div
              className="text-xs text-slate-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {domain}
            </div>
          </div>
        </div>
        <span
          className="tag-pill"
          style={{
            background: statusColors[sc] + "18",
            border: `1px solid ${statusColors[sc]}35`,
            color: statusColors[sc],
          }}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4" style={{ lineHeight: 1.65 }}>
        {desc}
      </p>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full progress-bar"
          style={{
            "--target-width": `${progress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-600">Progress</span>
        <span
          className="text-xs"
          style={{ color, fontFamily: "var(--font-mono)" }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

// -- CommunityCard (split → components/cards/CommunityCard.jsx)
const CommunityCard = ({ icon, title, desc, color, delay }) => (
  <div
    className="glass rounded-2xl p-6 card-lift anim-fadeup cursor-default"
    style={{ animationDelay: delay }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color + "30";
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = `0 20px 50px ${color}10`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3
      className="font-bold text-slate-100 text-sm mb-2"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title}
    </h3>
    <p className="text-xs text-slate-500" style={{ lineHeight: 1.7 }}>
      {desc}
    </p>
  </div>
);

// -- Navbar (split → components/layout/Navbar.jsx)
const Navbar = ({ currentPage, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "Projects", page: "projects" },
    { label: "Community", page: "home" },
    { label: "Contact", page: "contact" },
  ];

  const go = (page) => {
    setPage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        padding: "0 clamp(1rem,5vw,3.5rem)",
        background: scrolled ? "rgba(3,6,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,211,238,0.07)" : "none",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between"
        style={{ height: 68 }}
      >
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #0891b2, #7c3aed)",
              boxShadow: "0 0 24px rgba(34,211,238,0.35)",
            }}
          >
            X
          </div>
          <div className="text-left">
            <div
              className="font-black text-slate-100 leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}
            >
              XSTN
            </div>
            <div
              className="text-cyan-400 leading-none"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
              }}
            >
              XPLOREVO
            </div>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.page)}
              className={`nav-link ${currentPage === l.page && l.page !== "home" ? "active" : ""}`}
              style={{ background: "none", border: "none" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => go("join")}
            className="btn-ghost rounded-full px-5 py-2 text-sm font-semibold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log In
          </button>
          <button
            onClick={() => go("join")}
            className="btn-primary rounded-full px-5 py-2 text-sm font-bold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Join XSTN →
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 text-slate-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div
            className="w-5 h-0.5 bg-current mb-1.5 transition-all"
            style={{
              transform: mobileOpen ? "rotate(45deg) translateY(8px)" : "",
            }}
          />
          <div
            className="w-5 h-0.5 bg-current mb-1.5 transition-all"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <div
            className="w-5 h-0.5 bg-current transition-all"
            style={{
              transform: mobileOpen ? "rotate(-45deg) translateY(-8px)" : "",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden py-4 px-4 border-t"
          style={{
            background: "rgba(3,6,15,0.97)",
            borderColor: "rgba(34,211,238,0.08)",
          }}
        >
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.page)}
              className="block w-full text-left py-3 text-sm border-b text-slate-300 hover:text-cyan-400 transition-colors"
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: 12,
                marginBottom: 4,
                cursor: "pointer",
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("join")}
            className="btn-primary w-full mt-4 py-3 rounded-xl text-sm font-bold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Join XSTN →
          </button>
        </div>
      )}
    </nav>
  );
};

// -- Footer (split → components/layout/Footer.jsx)
const Footer = ({ setPage }) => {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer
      className="relative"
      style={{
        background: "#010610",
        borderTop: "1px solid rgba(34,211,238,0.06)",
        padding: "64px clamp(1rem,5vw,3.5rem) 32px",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, #0891b2, #7c3aed)",
                }}
              >
                X
              </div>
              <div>
                <div
                  className="font-black text-slate-100"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                  }}
                >
                  XSTN
                </div>
                <div
                  className="text-cyan-400"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.48rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  XPLOREVO STUDENT TECH NETWORK
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-56">
              India's student-driven IT execution platform. Where learning ends
              and building begins.
            </p>
            <div className="flex gap-3 mt-5">
              {["𝕏", "in", "gh", "ig"].map((s, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full glass flex items-center justify-center text-xs text-slate-400 cursor-pointer hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          {[
            {
              title: "Platform",
              links: [
                ["Home", "home"],
                ["About", "about"],
                ["Services", "services"],
                ["Projects", "projects"],
              ],
            },
            {
              title: "Join",
              links: [
                ["Apply Now", "join"],
                ["Partner With Us", "partner"],
                ["Contact", "contact"],
                ["Community", "home"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Privacy", "home"],
                ["Terms", "home"],
                ["Code of Conduct", "home"],
                ["Open Source", "home"],
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <div
                className="font-bold text-slate-300 text-sm mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {col.title}
              </div>
              {col.links.map(([l, p]) => (
                <button
                  key={l}
                  onClick={() => go(p)}
                  className="block text-sm text-slate-600 hover:text-cyan-400 transition-colors mb-2.5 cursor-pointer"
                  style={{ background: "none", border: "none" }}
                >
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-6 border-t gap-3"
          style={{ borderColor: "rgba(34,211,238,0.06)" }}
        >
          <p className="text-xs text-slate-700">
            © 2025 XSTN – Xplorevo Student Tech Network. All rights reserved.
          </p>
          <p
            className="text-xs text-slate-700"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v1.0.0 · Built by students, for students 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

// ─────────────────────────────────────────────────────────────
// 🏠 PAGE: HOME (split → pages/Home.jsx)
// ─────────────────────────────────────────────────────────────
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

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg"
        style={{ paddingTop: 80 }}
      >
        <NetworkCanvas />
        <div className="scanlines absolute inset-0 pointer-events-none" />
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

        {/* radial vignette on grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 80% at 50% 50%, black 0%, transparent 100%)",
            background:
              "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(34,211,238,0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-14 py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div>
              {/* Live badge */}
              <div
                className="anim-fadeup d-1 inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8 glass-cyan"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.66rem",
                  letterSpacing: "0.08em",
                  color: "#22d3ee",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-400 anim-pulse"
                  style={{ boxShadow: "0 0 8px #34d399" }}
                />
                12 ACTIVE PROJECTS &nbsp;·&nbsp; APPLICATIONS OPEN
              </div>

              {/* H1 */}
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                <span
                  className="anim-fadeup d-2 block text-slate-100 font-black"
                  style={{ fontSize: "clamp(2.8rem,6.5vw,5.2rem)" }}
                >
                  Where Students
                </span>
                <span
                  className="anim-fadeup d-3 block font-black grad-shift"
                  style={{ fontSize: "clamp(2.8rem,6.5vw,5.2rem)" }}
                >
                  Don't Just Learn —
                </span>
                <span
                  className="anim-fadeup d-4 block font-black"
                  style={{ fontSize: "clamp(2.8rem,6.5vw,5.2rem)" }}
                >
                  <span className="text-slate-100">They </span>
                  <span className="relative inline-block">
                    <span className="grad-cyan-violet">Execute.</span>
                    <span
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #22d3ee, #a78bfa)",
                      }}
                    />
                  </span>
                </span>
              </h1>

              {/* Sub */}
              <p
                className="anim-fadeup d-5 mt-6 mb-8 text-slate-400 leading-relaxed max-w-lg"
                style={{
                  fontSize: "clamp(0.88rem,1.8vw,1.05rem)",
                  lineHeight: 1.75,
                }}
              >
                <strong className="text-slate-200">
                  XSTN – Xplorevo Student Tech Network
                </strong>{" "}
                is India's student-driven IT execution platform. Real clients.
                Real tech stacks. Real impact — delivered by 500+ student
                engineers, designers & innovators.
              </p>

              {/* Identity pills */}
              <div className="anim-fadeup d-6 flex flex-wrap gap-2.5 mb-8">
                {[
                  ["🏢 IT Company", "#22d3ee"],
                  ["🎓 Student Community", "#a78bfa"],
                  ["🚀 Execution Hub", "#34d399"],
                ].map(([l, c], i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: c + "14",
                      border: `1px solid ${c}30`,
                      color: c,
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="anim-fadeup d-7 flex flex-wrap gap-3">
                <button
                  onClick={() => go("join")}
                  className="btn-primary rounded-xl px-8 py-3.5 font-bold text-sm cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Join the Network →
                </button>
                <button
                  onClick={() => go("projects")}
                  className="btn-ghost rounded-xl px-7 py-3.5 font-semibold text-sm cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  View Projects ↗
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5 anim-tiltin d-3">
              <TypingTerminal />
              <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>

          {/* Ticker */}
          <div
            className="mt-16 overflow-hidden border-y"
            style={{ borderColor: "rgba(34,211,238,0.07)", padding: "14px 0" }}
          >
            <div
              className="marquee-inner flex"
              style={{ width: "max-content" }}
            >
              {[...Array(2)].map((_, ri) => (
                <div key={ri} className="flex">
                  {ticker.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 text-slate-500 border-r"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        padding: "0 26px",
                        borderColor: "rgba(34,211,238,0.07)",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section
        className="py-28"
        style={{ padding: "112px clamp(1rem,5vw,3.5rem)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>What We Build</SectionLabel>
            <h2 className="section-h2 mb-4">
              Six domains. One network.
              <br />
              <span className="grad-cyan-violet">Infinite execution.</span>
            </h2>
            <p
              className="text-slate-500 max-w-md mx-auto text-sm"
              style={{ lineHeight: 1.75 }}
            >
              Each domain is staffed by trained students and led by experienced
              peer mentors.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <ServiceCard key={i} {...s} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => go("services")}
              className="btn-ghost rounded-xl px-8 py-3.5 text-sm font-semibold cursor-pointer"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Explore All Services →
            </button>
          </div>
        </div>
      </section>

      {/* ── PROJECTS PREVIEW ── */}
      <section
        className="py-28 relative"
        style={{ padding: "112px clamp(1rem,5vw,3.5rem)" }}
      >
        <GlowOrb
          color="#7c3aed"
          size={400}
          top="20%"
          right="-5%"
          opacity={0.05}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel>Live Projects</SectionLabel>
              <h2 className="section-h2">
                Real work. Real impact.
                <br />
                <span className="grad-green-cyan">Shipped by students.</span>
              </h2>
            </div>
            <button
              onClick={() => go("projects")}
              className="btn-ghost rounded-xl px-7 py-3 text-sm font-semibold cursor-pointer whitespace-nowrap self-start md:self-auto"
              style={{ fontFamily: "var(--font-display)" }}
            >
              All Projects →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((p, i) => (
              <ProjectCard key={i} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY PREVIEW ── */}
      <section
        className="py-28 relative"
        style={{
          padding: "112px clamp(1rem,5vw,3.5rem)",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Community</SectionLabel>
            <h2 className="section-h2 mb-4">
              More than a network —<br />
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                a movement.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {community.map((c, i) => (
              <CommunityCard key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden text-center"
            style={{
              padding: "clamp(3rem,8vw,5rem) clamp(2rem,6vw,4rem)",
              background:
                "linear-gradient(135deg, rgba(8,145,178,0.15), rgba(124,58,237,0.15))",
              border: "1px solid rgba(34,211,238,0.15)",
            }}
          >
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
            {[100, 180, 260].map((s, i) => (
              <div
                key={i}
                className="ripple-ring"
                style={{
                  width: s,
                  height: s,
                  top: "50%",
                  left: "50%",
                  marginLeft: -s / 2,
                  marginTop: -s / 2,
                  animationDelay: `${i * 1}s`,
                }}
              />
            ))}
            <div className="relative z-10">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-mono text-green-400 mb-6"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                }}
              >
                APPLICATIONS OPEN — BATCH 2025
              </span>
              <h2 className="section-h2 mb-5">
                Ready to stop learning
                <br />
                and start <span className="grad-shift">building?</span>
              </h2>
              <p
                className="text-slate-400 max-w-md mx-auto mb-10 text-sm"
                style={{ lineHeight: 1.75 }}
              >
                Apply to XSTN and join a network of students who ship real
                products, earn real experience, and launch real careers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => go("join")}
                  className="btn-primary rounded-xl px-10 py-4 font-bold cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                  }}
                >
                  Apply Now — It's Free
                </button>
                <button
                  onClick={() => go("partner")}
                  className="btn-ghost rounded-xl px-8 py-4 font-semibold cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                  }}
                >
                  Partner With Us →
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                <div className="flex">
                  {["👨‍💻", "👩‍🎨", "👨‍🔬", "👩‍💼", "🧑‍🚀"].map((e, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                      style={{
                        marginLeft: i > 0 ? -10 : 0,
                        background: `hsl(${200 + i * 30},65%,50%)`,
                        borderColor: "#03060f",
                      }}
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  Joined by{" "}
                  <strong className="text-cyan-400">500+ students</strong> from
                  30+ colleges
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 👥 PAGE: ABOUT (split → pages/About.jsx)
// ─────────────────────────────────────────────────────────────
const AboutPage = ({ setPage }) => {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const values = [
    {
      icon: "🚀",
      title: "Execution First",
      desc: "We don't just ideate. We ship. Every project has a deadline, a deliverable, and a team accountable for it.",
    },
    {
      icon: "🧠",
      title: "Learn by Doing",
      desc: "The best education is real work. Our students grow 10x faster because they face real constraints, real bugs, and real clients.",
    },
    {
      icon: "🤝",
      title: "Community Over Competition",
      desc: "We rise together. Senior students mentor juniors. Every win is a network win.",
    },
    {
      icon: "🔓",
      title: "Open by Default",
      desc: "Everything we build goes back to the community — open source, open knowledge, open doors.",
    },
  ];

  const timeline = [
    {
      year: "2022",
      event:
        "XSTN founded under Xplorevo with 15 founding members from 3 colleges.",
    },
    {
      year: "2023",
      event:
        "First external client project shipped. Team expanded to 80+ students across 5 colleges.",
    },
    {
      year: "2024",
      event:
        "8 service domains launched. First XSTN Hackathon — 400 participants, 72 hours, 60 projects.",
    },
    {
      year: "2025",
      event:
        "500+ members, 30+ colleges, 12 live projects. Applications open for Batch 2025.",
    },
  ];

  return (
    <div className="page-enter pt-24">
      {/* VISION / MISSION HERO */}
      <section
        className="relative overflow-hidden grid-bg"
        style={{ padding: "80px clamp(1rem,5vw,3.5rem) 100px" }}
      >
        <GlowOrb
          color="#0891b2"
          size={500}
          top="-10%"
          left="-5%"
          opacity={0.06}
        />
        <GlowOrb
          color="#7c3aed"
          size={400}
          bottom="-10%"
          right="0%"
          opacity={0.06}
        />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <SectionLabel>Who We Are</SectionLabel>
            <h1
              className="section-h2 mb-6"
              style={{ fontSize: "clamp(2.4rem,5.5vw,4rem)" }}
            >
              A student tech network
              <br />
              that{" "}
              <span className="grad-cyan-violet">thinks like a company.</span>
            </h1>
            <p
              className="text-slate-400 leading-relaxed"
              style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
            >
              XSTN isn't a club. It's an IT company run entirely by students
              under the Xplorevo ecosystem. We bridge the gap between academic
              learning and industry execution — taking on real client projects,
              building internal products, and mentoring the next generation of
              tech leaders.
            </p>
          </div>

          {/* Vision + Mission Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                label: "Our Vision",
                icon: "🔭",
                text: "A world where every student graduates with a portfolio of shipped products, not just grades — where industry-readiness is built in college, not after.",
                color: "#22d3ee",
              },
              {
                label: "Our Mission",
                icon: "🎯",
                text: "To empower every student to build, launch, and lead real tech projects — connecting talent across colleges, domains, and disciplines under one unified execution network.",
                color: "#a78bfa",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-8 anim-fadeup card-lift"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  borderColor: card.color + "25",
                }}
              >
                <div className="text-4xl mb-5">{card.icon}</div>
                <div
                  className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {card.label}
                </div>
                <p
                  className="text-slate-300 leading-relaxed"
                  style={{ fontSize: "0.95rem", lineHeight: 1.8 }}
                >
                  {card.text}
                </p>
                <div
                  className="w-12 h-1 rounded-full mt-6"
                  style={{
                    background: `linear-gradient(90deg, ${card.color}, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER MESSAGE */}
      <section style={{ padding: "100px clamp(1rem,5vw,3.5rem)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Founder's Note</SectionLabel>
              <h2 className="section-h2 mb-6">
                Built from
                <br />
                <span className="grad-shift">frustration & fire.</span>
              </h2>
              <div
                className="space-y-4 text-slate-400"
                style={{ lineHeight: 1.8, fontSize: "0.93rem" }}
              >
                <p>
                  "I spent 3 years in college watching brilliant people build
                  nothing. Hackathon projects that died on Sunday night. Skills
                  learned with no place to apply them."
                </p>
                <p>
                  "XSTN was born from that frustration. A place where you don't
                  just learn React — you ship a React app to 2,000 users. Where
                  you don't just read about DevOps — you own the pipeline."
                </p>
                <p>
                  "We're not perfect. We're a student network figuring it out in
                  public. But we execute — and that changes everything."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: "linear-gradient(135deg, #0891b2, #7c3aed)",
                  }}
                >
                  🧑‍💻
                </div>
                <div>
                  <div
                    className="font-bold text-slate-200"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Founder, XSTN
                  </div>
                  <div
                    className="text-sm text-cyan-400"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Xplorevo Student Tech Network
                  </div>
                </div>
              </div>
            </div>
            {/* Values */}
            <div className="grid grid-cols-1 gap-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 flex gap-4 items-start card-lift anim-fadeup"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-2xl mt-0.5">{v.icon}</span>
                  <div>
                    <div
                      className="font-bold text-slate-200 mb-1.5 text-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {v.title}
                    </div>
                    <p
                      className="text-xs text-slate-500"
                      style={{ lineHeight: 1.7 }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        className="relative"
        style={{ padding: "0 clamp(1rem,5vw,3.5rem) 100px" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Journey</SectionLabel>
            <h2 className="section-h2">How we got here.</h2>
          </div>
          <div className="relative">
            <div
              className="absolute left-5 top-0 bottom-0 w-px"
              style={{
                background:
                  "linear-gradient(180deg, #22d3ee, #a78bfa, transparent)",
              }}
            />
            {timeline.map((t, i) => (
              <div
                key={i}
                className="flex gap-6 mb-10 anim-fadeup"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 relative"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "linear-gradient(135deg, #0891b2, #7c3aed)",
                      color: "#fff",
                    }}
                  >
                    {t.year.slice(2)}
                  </div>
                </div>
                <div className="glass rounded-xl p-5 flex-1 card-lift">
                  <div className="text-cyan-400 text-xs font-mono mb-1.5">
                    {t.year}
                  </div>
                  <p
                    className="text-slate-300 text-sm"
                    style={{ lineHeight: 1.7 }}
                  >
                    {t.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section
        className="py-16 border-y"
        style={{
          borderColor: "rgba(34,211,238,0.07)",
          padding: "64px clamp(1rem,5vw,3.5rem)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["500+", "Student Members", "👨‍💻"],
            ["30+", "Colleges Represented", "🏫"],
            ["12", "Live Projects", "🚀"],
            ["3", "Years Running", "📅"],
          ].map(([v, l, ic], i) => (
            <div
              key={i}
              className="text-center anim-fadeup"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{ic}</div>
              <div
                className="font-black text-3xl grad-cyan-violet mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {v}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ padding: "80px clamp(1rem,5vw,3.5rem)" }}
        className="text-center"
      >
        <SectionLabel>Be Part Of It</SectionLabel>
        <h2 className="section-h2 mb-6">Your story starts here.</h2>
        <p
          className="text-slate-400 mb-8 max-w-md mx-auto text-sm"
          style={{ lineHeight: 1.75 }}
        >
          Whether you're a student ready to build, or a company looking for
          fresh talent — XSTN is your platform.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => go("join")}
            className="btn-primary rounded-xl px-8 py-3.5 font-bold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Apply to XSTN →
          </button>
          <button
            onClick={() => go("partner")}
            className="btn-ghost rounded-xl px-8 py-3.5 font-semibold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Partner With Us
          </button>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 🛠️ PAGE: SERVICES (split → pages/Services.jsx)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 📂 PAGE: PROJECTS (split → pages/Projects.jsx)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 📝 PAGE: JOIN XSTN (split → pages/Join.jsx)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 🤝 PAGE: PARTNER (split → pages/Partner.jsx)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 📞 PAGE: CONTACT (split → pages/Contact.jsx)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 🏗️ APP SHELL (split → App.jsx)
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const pages = {
    home: HomePage,
    about: AboutPage,
    services: ServicesPage,
    projects: ProjectsPage,
    join: JoinPage,
    partner: PartnerPage,
    contact: ContactPage,
  };

  const PageComponent = pages[page] || HomePage;

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <Navbar currentPage={page} setPage={setPage} />
        <PageComponent setPage={setPage} />
        <Footer setPage={setPage} />
      </div>
    </>
  );
}
