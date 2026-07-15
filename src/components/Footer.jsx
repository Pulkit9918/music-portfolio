// src/components/Footer.jsx
export default function Footer() {
  return (
    <header className="site-header">
      <span className="header-name">PULKIT J</span>
      <span className="header-year">{new Date().getFullYear()}</span>
    </header>
  );
}