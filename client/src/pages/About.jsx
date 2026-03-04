import GlowOrb from "../components/effects/GlowOrb";
import SectionLabel from "../components/ui/SectionLabel";
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
      year: "2025",
      event: "Xplorevo was founded by Harshad Harishchandra Pakhale.",
    },
    {
      year: "2026",
      event:
        "XSTB chapter was started to connect student with skills to potential clients",
    },
    {
      year: "2026",
      event: "XSTN recruited its first team",
    },
    {
      year: "2025",
      event: "First Official website for XSTN was launched",
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

export default AboutPage;
