import React from 'react'

export const Closing: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navLinks = [
    { label: 'Hero', href: '#hero' },
    { label: 'Overview', href: '#overview' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Features', href: '#features' },
    { label: 'Lifecycle', href: '#lifecycle' },
    { label: 'Database', href: '#database' },
    { label: 'API Explorer', href: '#api' },
    { label: 'Testing', href: '#testing' },
    { label: 'Team', href: '#team' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Deployment', href: '#deployment' }
  ]

  return (
    <footer className="footer-wrap" aria-label="Site Footer">
      <div className="container">
        {/* Call to action & repo banner */}
        <div className="footer-cta-card glass-panel">
          <div className="footer-cta-left">
            <span className="badge badge-cyan">INFOSYS SPRINGBOARD CAPSTONE</span>
            <h3 className="footer-cta-title">
              Spring REST Transport &amp; Logistic Domain Capstone - InfyGo
            </h3>
            <p className="footer-cta-desc">
              Explore the complete Java 17 / Spring Boot 3 source repository, automated test suites,
              Postman collections, and Flyway migration scripts on GitHub.
            </p>
          </div>

          <div className="footer-cta-actions">
            <a
              href="https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              aria-label="GitHub Repository (opens in new tab)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View GitHub Repository
            </a>
            <button
              onClick={scrollToTop}
              className="btn btn-secondary"
              aria-label="Back to top"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              Back to Top
            </button>
          </div>
        </div>

        {/* Section Navigation Quick Links */}
        <div className="footer-nav-links">
          <span className="footer-nav-label">SECTION INDEX:</span>
          <div className="links-flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="footer-nav-item">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="footer-program">Infosys Springboard · Naan Mudhalvan · Academic Project</span>
            <p className="footer-copy">© 2026 InfyGo Team. Academic use only.</p>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-badge font-mono">SPRING BOOT 3.5.6 · JAVA 17 LTS</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrap {
          background: #050811;
          border-top: 1px solid rgba(0, 245, 255, 0.15);
          padding: 4rem 0 3rem;
          position: relative;
        }
        .footer-cta-card {
          padding: 2.5rem;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .footer-cta-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .footer-cta-left {
          max-width: 650px;
        }
        .footer-cta-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0.75rem 0 0.5rem;
        }
        .footer-cta-desc {
          color: var(--text-secondary);
          font-size: 0.9375rem;
          line-height: 1.6;
        }
        .footer-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          flex-shrink: 0;
        }
        .footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-nav-label {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          color: var(--text-dim);
        }
        .links-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
        }
        .footer-nav-item {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }
        .footer-nav-item:hover {
          color: var(--cyan);
        }
        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            align-items: center;
          }
        }
        .footer-program {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.25rem;
        }
        .footer-copy {
          font-size: 0.8125rem;
          color: var(--text-dim);
        }
        .footer-badge {
          font-size: 0.75rem;
          color: var(--ice-blue);
          background: rgba(125, 211, 252, 0.08);
          border: 1px solid rgba(125, 211, 252, 0.2);
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
        }
      `}</style>
    </footer>
  )
}
