import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section" aria-label="Hero section">
      {/* Background Grid & Radar Sweep */}
      <div className="hero-grid-bg" aria-hidden="true" />

      {/* Radar Rings Container */}
      <div className="radar-container" aria-hidden="true">
        <div className="radar-ring radar-ring-1" />
        <div className="radar-ring radar-ring-2" />
        <div className="radar-ring radar-ring-3" />
        <div className="radar-crosshair-h" />
        <div className="radar-crosshair-v" />
        <div className="radar-beam" />
      </div>

      {/* Hero Content */}
      <div className="container hero-content">
        <div className="hero-badge-wrap">
          <span className="badge badge-cyan">
            <span className="pulse-dot" />
            INFOSYS SPRINGBOARD CAPSTONE · 2026
          </span>
          <span className="badge badge-violet">REST ARCHITECTURE</span>
        </div>

        {/* Verbatim Title Required */}
        <h1 className="hero-title">
          Spring REST Transport &amp; Logistic Domain Capstone - InfyGo
        </h1>

        <p className="hero-subtitle">
          Infosys Springboard · Naan Mudhalvan Capstone
        </p>

        <p className="hero-description">
          A robust, production-grade flight ticket reservation backend engineered with
          Spring Boot 3.5.6, Java 17, Spring Data JPA, Flyway migrations, and dual MySQL/H2 support.
          Featuring matrix parameter flight search, BCrypt authentication, mock card payment,
          and automated PNR lifecycle management.
        </p>

        <div className="hero-actions">
          <a href="#overview" className="btn btn-primary" aria-label="Explore the Project">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            Explore the Project
          </a>
          <a href="#api" className="btn btn-secondary" aria-label="View API endpoints">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            API Endpoints
          </a>
          <a
            href="https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label="GitHub Repository (opens in new tab)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* Animated Flight Path Visualization */}
        <div className="hero-flight-graphic" aria-hidden="true">
          <svg className="flight-path-svg" viewBox="0 0 900 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Flight curve trajectory */}
            <path
              id="flightRoute"
              d="M 60 180 C 260 30, 640 30, 840 180"
              stroke="url(#pathGradient)"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              className="flight-path-line"
              filter="url(#glowFilter)"
            />

            {/* Origin Node (Chennai) */}
            <g transform="translate(60, 180)">
              <circle r="14" fill="#00f5ff" fillOpacity="0.15" />
              <circle r="6" fill="#00f5ff" />
              <text x="0" y="28" fill="#7dd3fc" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="monospace">MAA (Chennai)</text>
              <text x="0" y="42" fill="#64748b" fontSize="10" textAnchor="middle">SRC ORIGIN</text>
            </g>

            {/* Destination Node (Delhi) */}
            <g transform="translate(840, 180)">
              <circle r="14" fill="#a855f7" fillOpacity="0.15" />
              <circle r="6" fill="#a855f7" />
              <text x="0" y="28" fill="#c084fc" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="monospace">DEL (Delhi)</text>
              <text x="0" y="42" fill="#64748b" fontSize="10" textAnchor="middle">DEST FINAL</text>
            </g>

            {/* Intermediate Waypoint */}
            <g transform="translate(450, 68)">
              <circle r="4" fill="#7dd3fc" />
              <text x="0" y="-12" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">KA101 · Kaveri Air</text>
            </g>

            {/* Airplane along curve */}
            <g className="flight-airplane">
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="#00f5ff"
                transform="scale(1.2) translate(-12, -12)"
                filter="url(#glowFilter)"
              />
            </g>
          </svg>
        </div>

        {/* Quick Highlights Bar */}
        <div className="hero-metrics-grid">
          <div className="metric-card">
            <span className="metric-val">106</span>
            <span className="metric-label">Unit &amp; E2E Tests</span>
          </div>
          <div className="metric-card">
            <span className="metric-val">100%</span>
            <span className="metric-label">Pass Rate (0 Failures)</span>
          </div>
          <div className="metric-card">
            <span className="metric-val">3.5.6</span>
            <span className="metric-label">Spring Boot Version</span>
          </div>
          <div className="metric-card">
            <span className="metric-val">5 Tables</span>
            <span className="metric-label">Relational Schema</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 0 4rem;
          overflow: hidden;
        }
        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%);
          pointer-events: none;
        }
        .radar-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 720px;
          height: 720px;
          pointer-events: none;
          opacity: 0.28;
        }
        .radar-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px dashed rgba(0, 245, 255, 0.3);
        }
        .radar-ring-1 { width: 260px; height: 260px; border-color: rgba(0, 245, 255, 0.4); }
        .radar-ring-2 { width: 480px; height: 480px; animation: pulseGlow 6s ease-in-out infinite; }
        .radar-ring-3 { width: 700px; height: 700px; border-color: rgba(168, 85, 247, 0.25); }
        .radar-crosshair-h {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent);
        }
        .radar-crosshair-v {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(0, 245, 255, 0.3), transparent);
        }
        .radar-beam {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 350px;
          height: 350px;
          transform-origin: top left;
          background: conic-gradient(from 0deg, rgba(0, 245, 255, 0.35) 0deg, rgba(0, 245, 255, 0) 60deg);
          border-radius: 100% 0 0 0;
          animation: radarSweep 10s linear infinite;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
          display: inline-block;
          animation: pulseGlow 2s infinite;
        }
        .hero-title {
          font-size: clamp(2rem, 4.5vw, 3.75rem);
          font-weight: 850;
          letter-spacing: -0.03em;
          line-height: 1.15;
          max-width: 1050px;
          background: linear-gradient(135deg, #ffffff 30%, #7dd3fc 75%, #00f5ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          font-weight: 600;
          color: var(--ice-blue);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          font-family: var(--font-mono);
        }
        .hero-description {
          max-width: 800px;
          color: var(--text-secondary);
          font-size: clamp(1rem, 1.2vw, 1.125rem);
          line-height: 1.7;
          margin-bottom: 2.25rem;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3.5rem;
        }
        .hero-flight-graphic {
          width: 100%;
          max-width: 860px;
          margin-bottom: 3rem;
          filter: drop-shadow(0 10px 25px rgba(0, 245, 255, 0.2));
        }
        .flight-path-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .flight-path-line {
          animation: dashFlow 25s linear infinite;
        }
        .flight-airplane {
          offset-path: path("M 60 180 C 260 30, 640 30, 840 180");
          animation: flyAlongPath 8s linear infinite;
        }
        @keyframes flyAlongPath {
          0% {
            offset-distance: 0%;
            transform: rotate(-15deg);
          }
          50% {
            offset-distance: 50%;
            transform: rotate(0deg);
          }
          100% {
            offset-distance: 100%;
            transform: rotate(15deg);
          }
        }
        .hero-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
          max-width: 880px;
        }
        @media (min-width: 768px) {
          .hero-metrics-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .metric-card {
          background: rgba(13, 19, 38, 0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 245, 255, 0.15);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          text-align: center;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-3px);
          border-color: var(--cyan);
        }
        .metric-val {
          display: block;
          font-size: 1.875rem;
          font-weight: 800;
          color: var(--cyan);
          font-family: var(--font-mono);
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }
        .metric-label {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        @media (prefers-reduced-motion: reduce) {
          .flight-airplane {
            animation: none;
            offset-distance: 50%;
          }
          .flight-path-line {
            animation: none;
          }
          .radar-beam {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
