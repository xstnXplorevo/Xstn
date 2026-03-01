import { useState, useEffect } from "react";

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
export default TypingTerminal;
