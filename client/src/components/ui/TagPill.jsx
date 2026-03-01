const TagPill = ({ label, color = "#22d3ee" }) => (
  <span
    className="tag-pill"
    style={{ background: color + "18", border: `1px solid ${color}35`, color }}
  >
    {label}
  </span>
);

export default TagPill;
