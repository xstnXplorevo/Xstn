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

export default Footer;
