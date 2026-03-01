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

export default GlowOrb;
