import React from 'react'
import { SectionWrapper } from './SectionWrapper'

export const Overview: React.FC = () => {
  return (
    <SectionWrapper id="overview" className="overview-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">01 // PROJECT OVERVIEW</span>
          <h2 className="section-title">What is InfyGo?</h2>
          <p className="section-subtitle">
            A comprehensive flight reservation backend modernizing legacy enterprise workflows
            into an idiomatic, secure, and production-ready Spring Boot REST API.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="overview-grid">
          {/* Card 1: System Purpose */}
          <div className="glass-panel overview-card">
            <div className="card-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="card-title">Transport &amp; Logistics Domain</h3>
            <p className="card-text">
              InfyGo addresses end-to-end commercial airline reservation operations. Originally
              specified as a legacy Spring MVC application, this re-implementation re-architects
              the domain into a stateless <strong>Spring Boot RESTful micro-service</strong> exposing
              standardized JSON payloads.
            </p>
            <ul className="card-bullet-list">
              <li>Air travel itinerary search &amp; filtering</li>
              <li>Live available seat inventory deductions</li>
              <li>Atomically generated 7-character alphanumeric PNRs</li>
            </ul>
          </div>

          {/* Card 2: Modern Tech Foundation */}
          <div className="glass-panel overview-card">
            <div className="card-icon-box cyan-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 className="card-title">Engineered with Spring Boot 3.5.6</h3>
            <p className="card-text">
              Built on <strong>Java 17 (LTS)</strong> with modern <strong>Jakarta EE 10</strong> specifications
              (<code className="code-inline">jakarta.persistence</code>, <code className="code-inline">jakarta.validation</code>).
              Zero legacy <code className="code-inline">javax</code> dependencies.
            </p>
            <div className="card-tags-row">
              <span className="badge badge-cyan">Java 17 LTS</span>
              <span className="badge badge-ice">Spring Boot 3.5.6</span>
              <span className="badge badge-violet">Jakarta EE 10</span>
            </div>
          </div>

          {/* Card 3: Dual Database Strategy */}
          <div className="glass-panel overview-card">
            <div className="card-icon-box violet-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <h3 className="card-title">Dual Database Strategy</h3>
            <p className="card-text">
              A hybrid persistence setup accommodating both robust production deployment and seamless zero-configuration local evaluation:
            </p>
            <div className="db-comparison-block">
              <div className="db-sub-item">
                <span className="db-sub-name">MySQL 8.4 Production</span>
                <span className="db-sub-desc">Target persistence engine with Flyway version-controlled migrations and foreign key integrity.</span>
              </div>
              <div className="db-sub-item">
                <span className="db-sub-name">H2 In-Memory Demo</span>
                <span className="db-sub-desc">MySQL compatibility mode with automatic flight seeding for zero-dependency instant testing.</span>
              </div>
            </div>
          </div>

          {/* Card 4: Academic Disclaimer */}
          <div className="glass-panel overview-card disclaimer-card">
            <div className="card-icon-box warning-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="card-title">Academic Capstone Disclaimer</h3>
            <p className="card-text">
              This application was engineered specifically as an academic capstone submission for the
              <strong> Infosys Springboard · Naan Mudhalvan</strong> initiative.
            </p>
            <div className="disclaimer-callout">
              <p>
                <strong>Security Notice:</strong> All mock payments, user profiles, credentials, and credit card records
                utilize synthetic demo data. Credit card CVV and PIN numbers are validated in-flight and
                <strong> never persisted or logged</strong>. A production system must delegate to PCI-DSS certified gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Runtime Spec Banner */}
        <div className="runtime-banner glass-panel">
          <div className="banner-col">
            <span className="banner-label">Mandatory Context Path</span>
            <span className="banner-val font-mono">/InfyGo</span>
          </div>
          <div className="banner-divider" />
          <div className="banner-col">
            <span className="banner-label">Default Local Endpoint</span>
            <span className="banner-val font-mono">http://localhost:8080/InfyGo/infygo</span>
          </div>
          <div className="banner-divider" />
          <div className="banner-col">
            <span className="banner-label">Interactive Swagger UI</span>
            <span className="banner-val font-mono">/InfyGo/swagger-ui/index.html</span>
          </div>
          <div className="banner-divider" />
          <div className="banner-col">
            <span className="banner-label">Build System</span>
            <span className="banner-val font-mono">Apache Maven 3.9 (mvnw)</span>
          </div>
        </div>
      </div>

      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .overview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .overview-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .card-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(0, 245, 255, 0.1);
          color: var(--cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(0, 245, 255, 0.25);
        }
        .card-icon-box.cyan-icon {
          background: rgba(0, 245, 255, 0.12);
          color: var(--cyan);
        }
        .card-icon-box.violet-icon {
          background: rgba(168, 85, 247, 0.12);
          color: #c084fc;
          border-color: rgba(168, 85, 247, 0.3);
        }
        .card-icon-box.warning-icon {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border-color: rgba(245, 158, 11, 0.3);
        }
        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.75rem;
        }
        .card-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.65;
          margin-bottom: 1.25rem;
        }
        .code-inline {
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.08);
          color: var(--ice-blue);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85em;
        }
        .card-bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: auto;
        }
        .card-bullet-list li {
          position: relative;
          padding-left: 1.25rem;
        }
        .card-bullet-list li::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--cyan);
        }
        .card-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }
        .db-comparison-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: auto;
        }
        .db-sub-item {
          background: rgba(0, 0, 0, 0.25);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--violet);
        }
        .db-sub-name {
          display: block;
          font-weight: 600;
          font-size: 0.85rem;
          color: #e2e8f0;
          margin-bottom: 0.2rem;
        }
        .db-sub-desc {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .disclaimer-card {
          border-color: rgba(245, 158, 11, 0.25);
        }
        .disclaimer-card:hover {
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 14px 40px -10px rgba(245, 158, 11, 0.2);
        }
        .disclaimer-callout {
          background: rgba(245, 158, 11, 0.08);
          border-left: 3px solid var(--warning);
          padding: 0.75rem 1rem;
          border-radius: 4px;
          font-size: 0.8125rem;
          color: #fde68a;
          line-height: 1.6;
          margin-top: auto;
        }
        .runtime-banner {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem 2rem;
          background: rgba(13, 19, 38, 0.75);
          border: 1px solid rgba(0, 245, 255, 0.2);
        }
        @media (min-width: 900px) {
          .runtime-banner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .banner-col {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .banner-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
        .banner-val {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--cyan);
        }
        .banner-divider {
          display: none;
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 900px) {
          .banner-divider {
            display: block;
          }
        }
      `}</style>
    </SectionWrapper>
  )
}
