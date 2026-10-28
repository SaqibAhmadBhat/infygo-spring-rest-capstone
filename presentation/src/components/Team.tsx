import React from 'react'
import { SectionWrapper } from './SectionWrapper'

interface TeamMember {
  name: string
  studentId: string
  role: string
  isLead?: boolean
  initials: string
  responsibilities: string
}

export const Team: React.FC = () => {
  const members: TeamMember[] = [
    {
      name: 'Saqib Ahmad Bhat',
      studentId: '950823104052',
      role: 'Team Lead',
      isLead: true,
      initials: 'SB',
      responsibilities: 'Architecture design, Spring Boot REST controllers, matrix parameter integration, and CI/CD pipelines.'
    },
    {
      name: 'Vijaya Kumar',
      studentId: '950823104064',
      role: 'Developer',
      initials: 'VK',
      responsibilities: 'Flight search engine, matrix variable binding algorithms, and airport destination queries.'
    },
    {
      name: 'Vinayagam S',
      studentId: '950823104065',
      role: 'Developer',
      initials: 'VS',
      responsibilities: 'Booking lifecycle management, atomic seat reservations, and PNR generator implementation.'
    },
    {
      name: 'Kannan P',
      studentId: '950823104021',
      role: 'Developer',
      initials: 'KP',
      responsibilities: 'Flyway database schema versioning, JPA entity mappings, and MySQL constraints.'
    },
    {
      name: 'Alagesh Pandi P',
      studentId: '950823104005',
      role: 'Developer',
      initials: 'AP',
      responsibilities: 'Mock credit card payment processing, Luhn algorithm verification, and security masking.'
    },
    {
      name: 'Aqib Majeed',
      studentId: '950823104007',
      role: 'Developer',
      initials: 'AM',
      responsibilities: 'JSR-380 input validation constraints, user authentication, and BCrypt integration.'
    }
  ]

  return (
    <SectionWrapper id="team" className="team-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">08 // CONTRIBUTORS</span>
          <h2 className="section-title">Project Team</h2>
          <p className="section-subtitle">
            Engineered collaboratively under the Infosys Springboard · Naan Mudhalvan initiative.
          </p>
        </div>

        <div className="team-grid">
          {members.map((member) => (
            <div
              key={member.studentId}
              className={`glass-panel member-card ${member.isLead ? 'lead-card' : ''}`}
            >
              {member.isLead && (
                <div className="lead-ribbon">
                  <span className="lead-star">★</span> TEAM LEAD
                </div>
              )}

              <div className="member-avatar-wrap">
                <div className={`member-avatar ${member.isLead ? 'lead-avatar' : ''}`}>
                  <span className="avatar-initials font-mono">{member.initials}</span>
                </div>
              </div>

              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>

                <div className="member-id-pill font-mono">
                  <span className="id-label">STUDENT ID:</span>
                  <span className="id-val">{member.studentId}</span>
                </div>

                <div className="member-role-tag">
                  <span className={`badge ${member.isLead ? 'badge-cyan' : 'badge-ice'}`}>
                    {member.role}
                  </span>
                </div>

                <p className="member-desc">{member.responsibilities}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .member-card {
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .member-card:hover {
          transform: translateY(-5px);
        }
        .lead-card {
          border-color: var(--cyan);
          background: linear-gradient(180deg, rgba(13, 27, 42, 0.85) 0%, rgba(15, 23, 42, 0.75) 100%);
          box-shadow: 0 10px 30px -10px rgba(0, 245, 255, 0.25);
        }
        .lead-card:hover {
          box-shadow: 0 16px 45px -10px rgba(0, 245, 255, 0.45);
        }
        .lead-ribbon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 245, 255, 0.15);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.4);
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .lead-star {
          color: #fbbf24;
        }
        .member-avatar-wrap {
          margin-bottom: 1.25rem;
        }
        .member-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #050811;
          border: 2px solid rgba(125, 211, 252, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .member-card:hover .member-avatar {
          border-color: var(--ice-blue);
          transform: scale(1.05);
        }
        .lead-avatar {
          border-color: var(--cyan);
          box-shadow: 0 0 18px var(--cyan-glow);
        }
        .avatar-initials {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
        }
        .member-name {
          font-size: 1.25rem;
          font-weight: 750;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .member-id-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(0, 0, 0, 0.4);
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .id-label {
          color: var(--text-dim);
          font-size: 0.6875rem;
        }
        .id-val {
          color: var(--ice-blue);
          font-weight: 600;
        }
        .member-role-tag {
          margin-bottom: 1rem;
        }
        .member-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
        }
      `}</style>
    </SectionWrapper>
  )
}
