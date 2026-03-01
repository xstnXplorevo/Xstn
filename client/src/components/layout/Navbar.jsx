import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ currentPage, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
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
    { label: "Join", page: "join" },
    { label: "Partner", page: "partner" },
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
              onClick={() => navigate(`/${l.page}`)}
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
            onClick={() => navigate("/login")}
            className="btn-ghost rounded-full px-5 py-2 text-sm font-semibold cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="btn-primary rounded-full px-6 py-3 text-sm font-bold cursor-pointer"
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
            onClick={() => navigate("/signup")}
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

export default Navbar;
