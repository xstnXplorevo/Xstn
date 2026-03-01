import { useState } from "react";
import TagPill from "../ui/TagPill";

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

export default ServiceCard;
