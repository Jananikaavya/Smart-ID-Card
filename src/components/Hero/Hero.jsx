import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={"hero" + (visible ? " is-visible" : "")} aria-labelledby="hero-heading">

      {/* BACKGROUND PARTICLES */}
      <div className="particles"></div>

      <div className="hero-center">
        
        {/* TITLE WITH TYPING EFFECT */}
        <h1 id="hero-heading" className="hero-title typewriter">
          Secure • Verified • Smart Digital ID Cards
        </h1>

        {/* SUBTITLE */}
        <p className="hero-sub">
          A futuristic platform that generates digital identity cards with encrypted QR verification, 
          ensuring high-security authentication for schools, companies, and organizations.
        </p>

        {/* ICON ROW */}
        <div className="hero-icons">
          <div className="icon-item">
            <div className="icon symbol-lock"></div>
            <span>End-to-End Encryption</span>
          </div>
          <div className="icon-item">
            <div className="icon symbol-qr"></div>
            <span>Instant QR Verification</span>
          </div>
          <div className="icon-item">
            <div className="icon symbol-id"></div>
            <span>Smart Digital ID Management</span>
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="hero-cta">
          <Link to="/login" className="cta" aria-label="Get started and go to login">
            Get Started
          </Link>
        </div>
      </div>

    </section>
  );
}
