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

export default StatBadge;
