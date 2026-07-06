// src/components/Footer.jsx
import { FiInstagram, FiYoutube, FiMusic } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-name">PULKIT J</span>
        <div className="socials">
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram size={17} /></a>
          <a href="https://youtube.com/@yourhandle" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube size={17} /></a>
          <a href="https://open.spotify.com" target="_blank" rel="noreferrer" aria-label="Spotify"><FiMusic size={17} /></a>
        </div>
        <small>© {new Date().getFullYear()}</small>
      </div>
    </footer>
  );
}