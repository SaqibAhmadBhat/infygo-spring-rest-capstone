import React, { useState } from 'react'
import { SectionWrapper } from './SectionWrapper'

interface LayerDetail {
  id: string
  title: string
  tag: string
  components: string[]
  description: string
  keyTech: string
}

export const Architecture: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('rest')

  const layers: LayerDetail[] = [
    {
      id: 'client',
      title: 'Consumer Clients',
      tag: 'FRONTEND / TOOLS',
      components: ['React Web UI', 'Swagger UI', 'cURL / Postman CLI', 'Automated Integration Tests'],
      description: 'Issues HTTP/1.1 requests formatted as JSON with matrix parameters (;key=val) to the /InfyGo context root.',
      keyTech: 'JSON Payloads · Matrix URLs'
    },
    {
      id: 'rest',
      title: 'REST Controller Layer',
      tag: 'WEB LAYER',
      components: ['UserController', 'FlightController', 'BookingController', 'PaymentController'],
      description: 'Binds incoming DTOs, validates inputs via JSR-380 Jakarta Validation, extracts @MatrixVariable queries, and returns ResponseEntity<?> structures.',
      keyTech: 'PathPatternParser · @MatrixVariable · @Valid'
    },
    {
      id: 'service',
      title: 'Business Service Layer',
      tag: 'TRANSACTION BOUNDARY',
      components: ['UserService', 'FlightService', 'BookingService', 'PaymentService'],
      description: 'Enforces domain invariants: BCrypt password hashing, seat availability checks, 7-char alphanumeric PNR issuance, and card validation.',
      keyTech: '@Transactional · BCryptPasswordEncoder'
    },
    {
      id: 'orm',
      title: 'JPA & Hibernate ORM',
      tag: 'PERSISTENCE LAYER',
      components: ['UserRepository', 'FlightRepository', 'TicketRepository', 'PassengerRepository'],
      description: 'Spring Data JPA repositories executing optimized JPQL and type-safe query methods with automatic transaction rollback on domain faults.',
      keyTech: 'Spring Data JPA · Hibernate 6.6'
    },
    {
      id: 'database',
      title: 'Data Store (Dual Profile)',
      tag: 'STORAGE TIER',
      components: ['MySQL 8.4 (Production / Docker)', 'H2 Database (In-Memory Test Mode)', 'Flyway Versioned Migrations'],
      description: 'ACID-compliant storage for flights, tickets, users, and masked credit cards. Flyway automatically executes migrations V1__create_schema.sql.',
      keyTech: 'Flyway 10+ · InnoDB FK Integrity'
    }
  ]

  const activeLayer = layers.find(l => l.id === selectedLayer) || layers[1]

  return (
    <SectionWrapper id="architecture" className="architecture-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">02 // SYSTEM ARCHITECTURE</span>
          <h2 className="section-title">Multi-Tier Architecture &amp; Data Pipeline</h2>
          <p className="section-subtitle">
            Layered separation of concerns with clear transaction boundaries, stateless controllers,
            and Flyway-versioned schema evolution.
          </p>
        </div>

        {/* Animated Architecture Canvas */}
        <div className="glass-panel arch-canvas">
          <div className="arch-flow-diagram">
            {/* Box 1: Client */}
            <div 
              className={`arch-box ${selectedLayer === 'client' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('client')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer('client') }}
            >
              <span className="arch-box-badge">TIER 1</span>
              <div className="arch-box-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h4 className="arch-box-title">Client Tier</h4>
              <p className="arch-box-sub">Postman / Browser / UI</p>
            </div>

            {/* Flow Line 1 */}
            <div className="arch-connector" aria-hidden="true">
              <div className="pulse-packet" />
              <span className="connector-label">HTTP / JSON</span>
            </div>

            {/* Box 2: REST Controller */}
            <div 
              className={`arch-box ${selectedLayer === 'rest' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('rest')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer('rest') }}
            >
              <span className="arch-box-badge">TIER 2</span>
              <div className="arch-box-icon cyan-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              </div>
              <h4 className="arch-box-title">Spring Boot REST API</h4>
              <p className="arch-box-sub">Context: <code className="code-tag">/InfyGo</code></p>
            </div>

            {/* Flow Line 2 */}
            <div className="arch-connector" aria-hidden="true">
              <div className="pulse-packet" />
              <span className="connector-label">DTO Validation</span>
            </div>

            {/* Box 3: Service Layer */}
            <div 
              className={`arch-box ${selectedLayer === 'service' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('service')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer('service') }}
            >
              <span className="arch-box-badge">TIER 3</span>
              <div className="arch-box-icon ice-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h4 className="arch-box-title">Service Layer</h4>
              <p className="arch-box-sub">@Transactional Domain Rules</p>
            </div>

            {/* Flow Line 3 */}
            <div className="arch-connector" aria-hidden="true">
              <div className="pulse-packet" />
              <span className="connector-label">Entities / JPQL</span>
            </div>

            {/* Box 4: JPA / Hibernate */}
            <div 
              className={`arch-box ${selectedLayer === 'orm' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('orm')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer('orm') }}
            >
              <span className="arch-box-badge">TIER 4</span>
              <div className="arch-box-icon violet-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <h4 className="arch-box-title">Spring Data JPA</h4>
              <p className="arch-box-sub">Hibernate 6.6 ORM</p>
            </div>

            {/* Flow Line 4 */}
            <div className="arch-connector" aria-hidden="true">
              <div className="pulse-packet" />
              <span className="connector-label">JDBC Pool</span>
            </div>

            {/* Box 5: Database Tier */}
            <div 
              className={`arch-box ${selectedLayer === 'database' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('database')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer('database') }}
            >
              <span className="arch-box-badge">TIER 5</span>
              <div className="arch-box-icon yellow-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
              </div>
              <h4 className="arch-box-title">Persistence Target</h4>
              <p className="arch-box-sub">MySQL 8.4 / H2 Demo</p>
            </div>
          </div>

          {/* Flyway Satellite Box */}
          <div className="flyway-sat-box">
            <div className="flyway-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              FLYWAY MIGRATIONS
            </div>
            <div className="flyway-info">
              <span className="flyway-title">Repeatable Schema Engine</span>
              <span className="flyway-desc">Automatic schema creation via <code className="code-tag">V1__create_schema.sql</code> (No risky ddl-auto=update)</span>
            </div>
            <div className="flyway-line" aria-hidden="true" />
          </div>

          {/* Interactive Layer Inspector */}
          <div className="layer-inspector">
            <div className="inspector-head">
              <div>
                <span className="badge badge-cyan">{activeLayer.tag}</span>
                <h3 className="inspector-title">{activeLayer.title}</h3>
              </div>
              <span className="inspector-tech">{activeLayer.keyTech}</span>
            </div>
            <p className="inspector-desc">{activeLayer.description}</p>
            <div className="inspector-components">
              <span className="components-label">Key Modules &amp; Classes:</span>
              <div className="comp-chips">
                {activeLayer.components.map((comp, idx) => (
                  <span key={idx} className="comp-chip font-mono">{comp}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .arch-canvas {
          padding: 2.5rem 1.5rem;
          background: rgba(10, 14, 26, 0.85);
          position: relative;
        }
        @media (min-width: 768px) {
          .arch-canvas {
            padding: 3rem 2.5rem;
          }
        }
        .arch-flow-diagram {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 1024px) {
          .arch-flow-diagram {
            flex-direction: row;
            align-items: stretch;
            justify-content: space-between;
            gap: 0.5rem;
          }
        }
        .arch-box {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(0, 245, 255, 0.2);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .arch-box:hover, .arch-box.active {
          border-color: var(--cyan);
          background: rgba(23, 37, 68, 0.95);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px -6px rgba(0, 245, 255, 0.3);
        }
        .arch-box-badge {
          position: absolute;
          top: -10px;
          font-size: 0.65rem;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 0.05em;
          background: #050811;
          color: var(--cyan);
          border: 1px solid var(--border-subtle);
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }
        .arch-box-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
        }
        .cyan-text { color: var(--cyan); }
        .ice-text { color: var(--ice-blue); }
        .violet-text { color: var(--violet); }
        .yellow-text { color: #facc15; }
        .arch-box-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .arch-box-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .code-tag {
          font-family: var(--font-mono);
          color: var(--cyan);
          background: rgba(0, 245, 255, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
        }
        .arch-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0.5rem 0;
        }
        @media (min-width: 1024px) {
          .arch-connector {
            flex-direction: column;
            width: 48px;
            padding: 0;
          }
        }
        .pulse-packet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 10px var(--cyan);
          animation: pulseGlow 2s infinite;
        }
        .connector-label {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
          white-space: nowrap;
        }
        .flyway-sat-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(245, 158, 11, 0.06);
          border: 1px dashed rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
          position: relative;
        }
        @media (min-width: 768px) {
          .flyway-sat-box {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .flyway-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
        .flyway-title {
          font-weight: 600;
          font-size: 0.875rem;
          color: #f1f5f9;
          margin-right: 0.5rem;
        }
        .flyway-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .layer-inspector {
          background: #050811;
          border: 1px solid rgba(0, 245, 255, 0.25);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
        .inspector-head {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        @media (min-width: 640px) {
          .inspector-head {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .inspector-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-top: 0.35rem;
        }
        .inspector-tech {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: var(--ice-blue);
          background: rgba(125, 211, 252, 0.1);
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(125, 211, 252, 0.25);
          align-self: flex-start;
        }
        .inspector-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .inspector-components {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .components-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .comp-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .comp-chip {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(0, 245, 255, 0.15);
          color: var(--text-secondary);
          font-size: 0.785rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
      `}</style>
    </SectionWrapper>
  )
}
