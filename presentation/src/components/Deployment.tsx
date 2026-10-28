import React from 'react'
import { SectionWrapper } from './SectionWrapper'

export const Deployment: React.FC = () => {
  return (
    <SectionWrapper id="deployment" className="deployment-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">10 // RUNTIME &amp; CI/CD</span>
          <h2 className="section-title">Deployment &amp; Operations</h2>
          <p className="section-subtitle">
            Flexible execution modes supporting instant zero-install local evaluation, containerized Docker Compose stacks,
            and automated GitHub Actions CI validation.
          </p>
        </div>

        {/* Runtime Endpoints Reference Card */}
        <div className="glass-panel endpoints-bar">
          <div className="endpoint-col">
            <span className="ep-tag">BACKEND BASE URL</span>
            <a
              href="http://localhost:8080/InfyGo"
              target="_blank"
              rel="noopener noreferrer"
              className="ep-link font-mono"
            >
              http://localhost:8080/InfyGo
            </a>
          </div>

          <div className="ep-divider" />

          <div className="endpoint-col">
            <span className="ep-tag">INTERACTIVE SWAGGER UI</span>
            <a
              href="http://localhost:8080/InfyGo/swagger-ui/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="ep-link font-mono"
            >
              http://localhost:8080/InfyGo/swagger-ui/index.html
            </a>
          </div>

          <div className="ep-divider" />

          <div className="endpoint-col">
            <span className="ep-tag">CONTINUOUS INTEGRATION</span>
            <a
              href="https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="ep-link font-mono"
            >
              GitHub Actions CI Pipeline ↗
            </a>
          </div>
        </div>

        {/* Execution Strategies Grid */}
        <div className="deploy-modes-grid">
          {/* Mode 1: Zero Install H2 Profile */}
          <div className="glass-panel deploy-card">
            <div className="deploy-card-header">
              <span className="badge badge-cyan">ZERO-INSTALL DEMO</span>
              <h3 className="deploy-card-title">H2 In-Memory Profile</h3>
            </div>
            <p className="deploy-card-desc">
              Execute with zero external database dependencies. Flights are dynamically seeded for testing immediately upon boot:
            </p>
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-title">SHELL</span>
              </div>
              <div className="terminal-body font-mono">
                <span className="terminal-comment"># Spin up Spring Boot with in-memory H2:</span>
                <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=h2</code>
              </div>
            </div>
          </div>

          {/* Mode 2: Docker Compose & MySQL */}
          <div className="glass-panel deploy-card">
            <div className="deploy-card-header">
              <span className="badge badge-ice">PRODUCTION ENGINE</span>
              <h3 className="deploy-card-title">Docker Compose &amp; MySQL 8</h3>
            </div>
            <p className="deploy-card-desc">
              Run the application against a production-identical MySQL database managed via Docker Compose:
            </p>
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-title">SHELL</span>
              </div>
              <div className="terminal-body font-mono">
                <span className="terminal-comment"># 1. Start MySQL 8 container in background:</span>
                <code>docker compose up -d</code>
                <br /><br />
                <span className="terminal-comment"># 2. Launch Spring Boot API (auto Flyway migrations):</span>
                <code>./mvnw spring-boot:run</code>
              </div>
            </div>
          </div>
        </div>

        {/* Docker Build Section */}
        <div className="glass-panel docker-build-card">
          <div className="docker-card-left">
            <div className="docker-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <div>
              <h3 className="docker-title">OCI Container Packaging</h3>
              <p className="docker-subtitle">Compile and package a self-contained container image for cloud deployment</p>
            </div>
          </div>

          <div className="terminal-window docker-terminal">
            <div className="terminal-body font-mono">
              <span className="terminal-comment"># Package executable application container:</span>
              <code>docker build -t saqib/infygo-backend:1.0.0 .</code>
            </div>
          </div>
        </div>

        {/* Deployment Notice Required by Prompt */}
        <div className="deployment-note-box">
          <div className="note-alert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div>
            <div className="note-alert-title">Cloud Deployment Requirement</div>
            <p className="note-alert-body">
              <strong>Live backend deployment requires manual server/cloud setup with environment variables</strong>{' '}
              (<code className="code-tag font-mono">DB_URL</code>, <code className="code-tag font-mono">DB_USERNAME</code>,{' '}
              <code className="code-tag font-mono">DB_PASSWORD</code>, <code className="code-tag font-mono">SERVER_PORT</code>).
              Ensure production database credentials are never checked into source control.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .endpoints-bar {
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 992px) {
          .endpoints-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .endpoint-col {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .ep-tag {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          letter-spacing: 0.08em;
          color: var(--text-dim);
        }
        .ep-link {
          color: var(--cyan);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .ep-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }
        .ep-divider {
          display: none;
          width: 1px;
          height: 38px;
          background: rgba(255, 255, 255, 0.08);
        }
        @media (min-width: 992px) {
          .ep-divider {
            display: block;
          }
        }
        .deploy-modes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .deploy-modes-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .deploy-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }
        .deploy-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .deploy-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .deploy-card-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .docker-build-card {
          padding: 1.75rem 2rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 992px) {
          .docker-build-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .docker-card-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .docker-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: rgba(0, 245, 255, 0.1);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .docker-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .docker-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .docker-terminal {
          flex: 1;
          max-width: 500px;
        }
        .deployment-note-box {
          background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.35);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .note-alert-icon {
          color: var(--violet);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .note-alert-title {
          font-weight: 700;
          font-size: 0.9375rem;
          color: #e9d5ff;
          margin-bottom: 0.35rem;
        }
        .note-alert-body {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </SectionWrapper>
  )
}
