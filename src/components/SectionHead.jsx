// src/components/SectionHead.jsx
import MaskText from "./MaskText";
import Reveal from "./Reveal";

export default function SectionHead({ index, eyebrow, title }) {
  return (
    <div className="head">
      <span className="head-index" aria-hidden="true">{index}</span>
      <div className="head-text">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <MaskText as="h2" text={title} />
      </div>
    </div>
  );
}