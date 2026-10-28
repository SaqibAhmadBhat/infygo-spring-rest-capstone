import React from 'react'
import { SectionWrapper } from './SectionWrapper'

interface TechItem {
  name: string
  version: string
  category: string
  role: string
  iconSvg: React.ReactNode
}

export const TechStack: React.FC = () => {
  const technologies: TechItem[] = [
    {
      name: 'Java 17',
      version: '17 LTS',
      category: 'LANGUAGE',
      role: 'Core programming language offering modern records, pattern matching, and long-term support required for Spring Boot 3.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
      )
    },
    {
      name: 'Spring Boot 3.5.6',
      version: '3.5.6',
      category: 'FRAMEWORK',
      role: 'Enterprise application framework providing auto-configuration, standalone embedded Tomcat, and Jakarta EE 10 compatibility.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
      )
    },
    {
      name: 'Spring Data JPA + Hibernate 6.6',
      version: '6.6 / Boot Managed',
      category: 'ORM / PERSISTENCE',
      role: 'Type-safe object-relational mapping, transaction boundary management, and automated query derivation.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
      )
    },
    {
      name: 'Flyway',
      version: 'Boot Managed',
      category: 'MIGRATION',
      role: 'Versioned database migration engine running V1__create_schema.sql to enforce deterministic table lifecycles.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /><path d="M4 12v7a2 2 0 0 0 2 2h12" /></svg>
      )
    },
    {
      name: 'MySQL 8.4',
      version: '8.4 Community',
      category: 'PRODUCTION DB',
      role: 'ACID-compliant relational database engine enforcing foreign-key integrity across flights, tickets, and accounts.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
      )
    },
    {
      name: 'H2 Database',
      version: '2.x In-Memory',
      category: 'TEST DATABASE',
      role: 'Ultra-fast in-memory database running in MySQL compatibility mode for CI/CD pipelines and zero-install local runs.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
      )
    },
    {
      name: 'BCrypt',
      version: 'Spring Security Crypto',
      category: 'SECURITY',
      role: 'Adaptive salted hashing algorithm securing customer passwords with timing-attack resistant credential verification.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      )
    },
    {
      name: 'Springdoc OpenAPI',
      version: '2.8.9',
      category: 'DOCUMENTATION',
      role: 'Automated OpenAPI 3.0 specification generator providing interactive Swagger UI directly at /InfyGo/swagger-ui/index.html.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      )
    },
    {
      name: 'JUnit 5',
      version: 'Jupiter 5.x',
      category: 'TESTING',
      role: 'Modern testing framework powering 106 automated unit, controller mock, and end-to-end integration tests.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
      )
    },
    {
      name: 'Maven',
      version: '3.9.9 (mvnw)',
      category: 'BUILD TOOL',
      role: 'Reproducible build orchestrator with embedded Maven Wrapper ensuring zero environmental pre-requisites.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
      )
    },
    {
      name: 'Docker Compose',
      version: 'v2 Compose Spec',
      category: 'INFRASTRUCTURE',
      role: 'Single-command containerized infrastructure provisioning healthy MySQL 8 instances with health checks and volume persistence.',
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
      )
    }
  ]

  return (
    <SectionWrapper id="tech-stack" className="tech-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">09 // CORE TECHNOLOGIES</span>
          <h2 className="section-title">Technology Ecosystem</h2>
          <p className="section-subtitle">
            Curated modern stack balancing LTS enterprise stability with cloud-native Jakarta EE 10 standards.
          </p>
        </div>

        <div className="tech-grid">
          {technologies.map((tech, idx) => (
            <div key={idx} className="glass-panel tech-card">
              <div className="tech-card-top">
                <div className="tech-icon-wrap" aria-hidden="true">
                  {tech.iconSvg}
                </div>
                <span className="badge badge-cyan">{tech.category}</span>
              </div>

              <h3 className="tech-name">{tech.name}</h3>

              <div className="tech-version-row font-mono">
                <span className="version-label">SPEC:</span>
                <span className="version-val">{tech.version}</span>
              </div>

              <p className="tech-role">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tech-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .tech-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .tech-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .tech-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .tech-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .tech-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .tech-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: rgba(0, 245, 255, 0.08);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tech-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }
        .tech-version-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .version-label {
          color: var(--text-dim);
        }
        .version-val {
          color: var(--ice-blue);
          font-weight: 600;
        }
        .tech-role {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-top: auto;
        }
      `}</style>
    </SectionWrapper>
  )
}
