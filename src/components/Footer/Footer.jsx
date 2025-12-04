import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="smart-footer">

      {/* LEFT SECTION */}
      <div className="footer-left">
        <svg
          className="footer-logo"
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
            stroke="#00d4ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" fill="#00d4ff" />
        </svg>

        <span className="footer-title">Smart ID System</span>
      </div>

      {/* CENTER SECTION */}
      <div className="footer-center">
        Made with <span className="heart">❤️</span> by Smart ID System
      </div>

      {/* RIGHT SECTION */}
      <div className="footer-right">
        <a href="/support">Support</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>

    </footer>
  );
}
