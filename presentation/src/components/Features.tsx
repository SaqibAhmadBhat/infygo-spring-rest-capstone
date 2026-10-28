import React, { useState } from 'react'
import { SectionWrapper } from './SectionWrapper'

interface FeatureItem {
  id: number
  title: string
  route?: string
  icon: React.ReactNode
  category: 'AUTH' | 'FLIGHTS' | 'BOOKING' | 'PAYMENT' | 'DOCS'
  description: string
  highlight: string
}

export const Features: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL')

  const featuresList: FeatureItem[] = [
    {
      id: 1,
      title: 'User Registration with BCrypt',
      route: 'POST /infygo/register',
      category: 'AUTH',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
      ),
      description: 'Registers new traveler profiles with encrypted passwords via BCryptPasswordEncoder. Ensures unique userId checks and sanitizes responses.',
      highlight: 'BCrypt Salted Hash · JSR-380 Validations'
    },
    {
      id: 2,
      title: 'User Login & Authentication',
      route: 'POST /infygo/login',
      category: 'AUTH',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      ),
      description: 'Authenticates user credentials securely. Timing-safe verification prevents username enumeration attacks on invalid password attempts.',
      highlight: 'Constant-time verification · No hash leak'
    },
    {
      id: 3,
      title: 'List Source Cities',
      route: 'GET /infygo/flights/sources',
      category: 'FLIGHTS',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
      ),
      description: 'Dynamically fetches all distinct departure airport cities currently served across active scheduled flight itineraries.',
      highlight: 'Distinct query projection'
    },
    {
      id: 4,
      title: 'List Destination Cities',
      route: 'GET /infygo/flights/destinations',
      category: 'FLIGHTS',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
      ),
      description: 'Retrieves all available destination hubs, preventing invalid route selections by ensuring origin-to-destination alignment.',
      highlight: 'Optimized index lookup'
    },
    {
      id: 5,
      title: 'Flight Search by Route & Date',
      route: 'GET /infygo/flights/search',
      category: 'FLIGHTS',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      ),
      description: 'Filters available inventory matching source, destination, and departure date. Checks seat availability > 0 before presenting schedules.',
      highlight: 'Date-based inventory verification'
    },
    {
      id: 6,
      title: 'Matrix Parameter Routing',
      route: 'GET /flights/search;source=X;destination=Y;journeyDate=Z',
      category: 'FLIGHTS',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
      ),
      description: 'Full RFC-compliant matrix parameter parsing via Spring @MatrixVariable. Supports optional filters like airline, departure window, and price range.',
      highlight: 'Spring PathPatternParser · MatrixVariable'
    },
    {
      id: 7,
      title: 'Seat Booking via Matrix Parameters',
      route: 'POST /infygo/book/tickets;flightId=X;userId=Y',
      category: 'BOOKING',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
      ),
      description: 'Processes ticket holds bound to matrix parameters. Atomically decrements remaining flight seats and issues a unique PNR record.',
      highlight: 'Atomic inventory deduction'
    },
    {
      id: 8,
      title: 'Passenger Details Capture',
      route: 'POST /infygo/book/tickets payload',
      category: 'BOOKING',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
      description: 'Captures multi-passenger manifests: full name, age, and gender. Automatically computes total fare based on passenger count and per-seat rate.',
      highlight: 'Cascade persist passenger list'
    },
    {
      id: 9,
      title: 'Credit Card Payment (Mock)',
      route: 'POST /infygo/payment',
      category: 'PAYMENT',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
      ),
      description: 'Validates card format, Luhn checksum, and expiry dates. Confirms ticket status from PENDING to CONFIRMED. CVV & PIN are never stored.',
      highlight: 'Masked XXXX-XXXX-last4 · Zero CVV retention'
    },
    {
      id: 10,
      title: 'PNR-based Ticket Retrieval',
      route: 'GET /infygo/tickets/{pnr}',
      category: 'BOOKING',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
      ),
      description: 'Instantly looks up complete booking itineraries by Passenger Name Record (PNR), including flight details, passenger roster, and payment state.',
      highlight: 'Composite view with passenger details'
    },
    {
      id: 11,
      title: 'Input Validation (JSR-380)',
      route: 'Cross-cutting @Valid controllers',
      category: 'AUTH',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
      ),
      description: 'Jakarta Bean Validation ensures strict data sanitization: regex email constraints, 10-digit mobile patterns, non-null passenger age and gender.',
      highlight: '@Pattern · @Email · @Min · @NotBlank'
    },
    {
      id: 12,
      title: 'Swagger / OpenAPI Documentation',
      route: 'GET /InfyGo/swagger-ui/index.html',
      category: 'DOCS',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
      ),
      description: 'Auto-generated OpenAPI v3 documentation via springdoc-openapi 2.8.9. Interactive UI allows live endpoint execution directly in browser.',
      highlight: 'OpenAPI 3.0 · Springdoc 2.8.9 UI'
    }
  ]

  const filteredFeatures = filter === 'ALL' 
    ? featuresList 
    : featuresList.filter(f => f.category === filter)

  return (
    <SectionWrapper id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">03 // FUNCTIONAL CAPABILITIES</span>
          <h2 className="section-title">12 Core System Features</h2>
          <p className="section-subtitle">
            Every required enterprise service delivered with complete type safety,
            declarative validation, and comprehensive error handling.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-nav" role="tablist" aria-label="Feature categories">
          {['ALL', 'AUTH', 'FLIGHTS', 'BOOKING', 'PAYMENT', 'DOCS'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
              role="tab"
              aria-selected={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Cards Grid (12 items) */}
        <div className="features-grid">
          {filteredFeatures.map((feat) => (
            <div key={feat.id} className="glass-panel feature-card">
              <div className="feat-top">
                <div className="feat-icon-box" aria-hidden="true">
                  {feat.icon}
                </div>
                <div className="feat-meta">
                  <span className="badge badge-cyan feat-badge">{feat.category}</span>
                  <span className="feat-id">#{String(feat.id).padStart(2, '0')}</span>
                </div>
              </div>

              <h3 className="feat-title">{feat.title}</h3>

              {feat.route && (
                <div className="feat-route-tag font-mono">
                  {feat.route}
                </div>
              )}

              <p className="feat-desc">{feat.description}</p>

              <div className="feat-highlight">
                <span className="highlight-dot" />
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .filter-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2.5rem;
        }
        .filter-btn {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(0, 245, 255, 0.15);
          color: var(--text-muted);
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          color: var(--text-main);
          border-color: rgba(0, 245, 255, 0.4);
        }
        .filter-btn.active {
          background: rgba(0, 245, 255, 0.15);
          color: var(--cyan);
          border-color: var(--cyan);
          box-shadow: 0 0 12px rgba(0, 245, 255, 0.25);
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .feature-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .feat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .feat-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: rgba(0, 245, 255, 0.08);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feat-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .feat-id {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: var(--text-dim);
        }
        .feat-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          line-height: 1.35;
        }
        .feat-route-tag {
          font-size: 0.75rem;
          color: var(--ice-blue);
          background: rgba(125, 211, 252, 0.08);
          border: 1px solid rgba(125, 211, 252, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
          word-break: break-all;
        }
        .feat-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }
        .feat-highlight {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.785rem;
          color: #94a3b8;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .highlight-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--violet);
          box-shadow: 0 0 6px var(--violet);
        }
      `}</style>
    </SectionWrapper>
  )
}
