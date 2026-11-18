export default function Marquee({ items, speed = 40, className = "", outline = true, sep = "✺" }) {
  const group = (k) => (
    <div className="marquee-group" aria-hidden={k > 0 ? "true" : undefined}>
      {items.map((item, i) => (
        <span key={i} className="marquee-pair">
          <span className={`marquee-item ${outline && i % 2 === 0 ? "" : "solid"}`}>{item}</span>
          <span className="marquee-sep">{sep}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`} style={{ "--dur": `${speed}s` }}>
      <div className="marquee-track">
        {group(0)}
        {group(1)}
      </div>
    </div>
  );
}