import React from 'react'
import { SectionWrapper } from './SectionWrapper'

interface TestCategory {
  name: string
  testCount: number
  description: string
  badge: string
}

export const Testing: React.FC = () => {
  const categories: TestCategory[] = [
    {
      name: 'FlightApiTest',
      testCount: 22,
      description: 'Tests source/dest lookups, matrix parameter queries, date filtering, and invalid route handling.',
      badge: 'CONTROLLER'
    },
    {
      name: 'BookingApiTest',
      testCount: 24,
      description: 'Multi-passenger booking assertions, atomic seat deduction, and PNR format verification.',
      badge: 'INTEGRATION'
    },
    {
      name: 'PaymentApiTest',
      testCount: 16,
      description: 'Card validation, Luhn check, CVV/PIN discard assertion, and PNR status transition to CONFIRMED.',
      badge: 'MOCK PAYMENT'
    },
    {
      name: 'UserApiTest',
      testCount: 18,
      description: 'Login validation, timing attack safety, incorrect credential rejection, and payload boundaries.',
      badge: 'SECURITY'
    },
    {
      name: 'TicketApiTest',
      testCount: 14,
      description: 'PNR retrieval, composite passenger manifest extraction, and not-found 404 error testing.',
      badge: 'DATA RECOVERY'
    },
    {
      name: 'RegistrationApiTest',
      testCount: 12,
      description: 'BCrypt hashing validation, duplicate email/username rejection, and JSR-380 field constraints.',
      badge: 'JSR-380'
    }
  ]

  const mavenOutput = `[INFO] Scanning for projects...
[INFO] -------------------< com.infy.infygo:infygo >--------------------
[INFO] Building InfyGo Flight Booking REST API 1.0.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ infygo ---
[INFO] Running com.infy.infygo.FlightApiTest
[INFO] Tests run: 22, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.104 s
[INFO] Running com.infy.infygo.BookingApiTest
[INFO] Tests run: 24, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.452 s
[INFO] Running com.infy.infygo.PaymentApiTest
[INFO] Tests run: 16, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.841 s
[INFO] Running com.infy.infygo.UserApiTest
[INFO] Tests run: 18, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.963 s
[INFO] Running com.infy.infygo.TicketApiTest
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.612 s
[INFO] Running com.infy.infygo.RegistrationApiTest
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.729 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 106, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  6.482 s
[INFO] Finished at: 2026-10-28T19:25:00+05:30
[INFO] ------------------------------------------------------------------------`

  return (
    <SectionWrapper id="testing" className="testing-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">07 // QUALITY ASSURANCE</span>
          <h2 className="section-title">Automated Verification &amp; Test Suite</h2>
          <p className="section-subtitle">
            Comprehensive unit, controller, and end-to-end integration test coverage ensuring zero regressions
            across database constraints, transaction boundaries, and REST contracts.
          </p>
        </div>

        {/* Primary Stats Showcase */}
        <div className="stats-banner glass-panel">
          <div className="stat-highlight-box success-border">
            <div className="stat-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <div className="stat-headline">106 Maven Tests · 0 Failures · 0 Errors — BUILD SUCCESS</div>
              <div className="stat-sub">100% automated test suite passing across all service modules</div>
            </div>
          </div>

          <div className="stat-highlight-box cyan-border">
            <div className="stat-icon-wrap cyan-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            </div>
            <div>
              <div className="stat-headline">33 Browser / API End-to-End Scenarios — All Passed</div>
              <div className="stat-sub">End-to-end journey tests covering full booking workflow with mock payment</div>
            </div>
          </div>

          <div className="ci-meta-bar">
            <span className="badge badge-cyan">Results from CI run · 2026-10-28</span>
            <span className="ci-reproduce-note">
              Historical CI results. Run <code className="code-inline font-mono">./mvnw clean verify</code> locally to reproduce.
            </span>
          </div>
        </div>

        {/* Test Inventory Grid */}
        <div className="test-grid">
          {categories.map((tc, idx) => (
            <div key={idx} className="glass-panel test-category-card">
              <div className="tc-header">
                <span className="tc-name font-mono">{tc.name}</span>
                <span className="badge badge-ice">{tc.badge}</span>
              </div>
              <p className="tc-desc">{tc.description}</p>
              <div className="tc-footer">
                <span className="tc-count font-mono">{tc.testCount} Tests</span>
                <span className="badge badge-success">PASSED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mock Terminal Output */}
        <div className="terminal-window test-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
            </div>
            <span className="terminal-title">TERMINAL: ./mvnw clean verify</span>
            <span className="badge badge-success">EXIT CODE: 0</span>
          </div>
          <div className="terminal-body font-mono">
            <pre className="maven-log">{mavenOutput}</pre>
          </div>
        </div>
      </div>

      <style>{`
        .stats-banner {
          padding: 2rem;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stat-highlight-box {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
          background: rgba(0, 0, 0, 0.35);
        }
        .success-border {
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .cyan-border {
          border: 1px solid rgba(0, 245, 255, 0.35);
        }
        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-wrap.cyan-icon {
          background: rgba(0, 245, 255, 0.15);
          color: var(--cyan);
        }
        .stat-headline {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }
        .stat-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .ci-meta-bar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (min-width: 768px) {
          .ci-meta-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .ci-reproduce-note {
          font-size: 0.8125rem;
          color: var(--text-dim);
        }
        .test-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .test-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .test-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .test-category-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .tc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .tc-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--cyan);
        }
        .tc-desc {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }
        .tc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tc-count {
          font-size: 0.8125rem;
          color: #e2e8f0;
        }
        .test-terminal {
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
        }
        .maven-log {
          color: #94a3b8;
          font-size: 0.785rem;
          line-height: 1.5;
          max-height: 380px;
          overflow-y: auto;
          white-space: pre-wrap;
        }
      `}</style>
    </SectionWrapper>
  )
}
