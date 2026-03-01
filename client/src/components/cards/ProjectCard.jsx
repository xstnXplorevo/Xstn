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

export default ProjectCard;
