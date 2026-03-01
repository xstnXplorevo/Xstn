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

export default CommunityCard;
