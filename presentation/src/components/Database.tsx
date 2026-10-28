import React from 'react'
import { SectionWrapper } from './SectionWrapper'

interface TableColumn {
  name: string
  type: string
  key?: 'PK' | 'FK'
  note?: string
}

interface TableModel {
  tableName: string
  description: string
  primaryKey: string
  columns: TableColumn[]
}

export const Database: React.FC = () => {
  const tables: TableModel[] = [
    {
      tableName: 'User_Details',
      description: 'Traveler profiles, contact coordinates, and salted BCrypt credentials.',
      primaryKey: 'userId',
      columns: [
        { name: 'userId', type: 'VARCHAR(50)', key: 'PK', note: 'Unique traveler identifier' },
        { name: 'name', type: 'VARCHAR(100)', note: 'Full passenger name' },
        { name: 'mobile', type: 'VARCHAR(15)', note: 'E.164 or 10-digit mobile number' },
        { name: 'email', type: 'VARCHAR(100)', note: 'Unique contact email' },
        { name: 'password', type: 'VARCHAR(255)', note: '60-char BCrypt salted hash' }
      ]
    },
    {
      tableName: 'Flight_Details',
      description: 'Scheduled flight routes, aircraft identity, timing, fare rates, and real-time seat inventory.',
      primaryKey: 'flightId',
      columns: [
        { name: 'flightId', type: 'VARCHAR(20)', key: 'PK', note: 'e.g. KA101-261105' },
        { name: 'flightName', type: 'VARCHAR(100)', note: 'Airline brand / Carrier name' },
        { name: 'source', type: 'VARCHAR(50)', note: 'Departure airport city' },
        { name: 'destination', type: 'VARCHAR(50)', note: 'Arrival airport city' },
        { name: 'departureTime', type: 'TIME', note: 'Scheduled take-off' },
        { name: 'arrivalTime', type: 'TIME', note: 'Scheduled touchdown' },
        { name: 'fare', type: 'DECIMAL(10,2)', note: 'Base price per individual seat' },
        { name: 'totalSeats', type: 'INT', note: 'Aircraft seat capacity' },
        { name: 'availableSeats', type: 'INT', note: 'Remaining unbooked seats' }
      ]
    },
    {
      tableName: 'Ticket_Details',
      description: 'Issued booking contracts linking travelers to flight departures with status tracking.',
      primaryKey: 'pnr',
      columns: [
        { name: 'pnr', type: 'VARCHAR(7)', key: 'PK', note: '7-character alphanumeric reference' },
        { name: 'flightId', type: 'VARCHAR(20)', key: 'FK', note: 'Refers to Flight_Details.flightId' },
        { name: 'userId', type: 'VARCHAR(50)', key: 'FK', note: 'Refers to User_Details.userId' },
        { name: 'journeyDate', type: 'DATE', note: 'Travel departure date' },
        { name: 'noOfPassengers', type: 'INT', note: 'Number of booked seats' },
        { name: 'totalAmount', type: 'DECIMAL(10,2)', note: 'Computed total reservation fare' },
        { name: 'status', type: 'VARCHAR(20)', note: 'PENDING_PAYMENT / CONFIRMED' }
      ]
    },
    {
      tableName: 'Passenger_Details',
      description: 'Individual traveler records belonging to a booked ticket manifest.',
      primaryKey: 'passengerId',
      columns: [
        { name: 'passengerId', type: 'BIGINT AUTO_INCREMENT', key: 'PK', note: 'Unique traveler identity' },
        { name: 'pnr', type: 'VARCHAR(7)', key: 'FK', note: 'Refers to Ticket_Details.pnr' },
        { name: 'name', type: 'VARCHAR(100)', note: 'Individual traveler full name' },
        { name: 'age', type: 'INT', note: 'Passenger age in years' },
        { name: 'gender', type: 'VARCHAR(10)', note: 'Male / Female / Other' }
      ]
    },
    {
      tableName: 'Creditcard_Details',
      description: 'Simulated payment transaction audit log with masked card references.',
      primaryKey: 'paymentId',
      columns: [
        { name: 'paymentId', type: 'BIGINT AUTO_INCREMENT', key: 'PK', note: 'Payment ledger transaction ID' },
        { name: 'pnr', type: 'VARCHAR(7)', key: 'FK', note: 'Refers to Ticket_Details.pnr' },
        { name: 'cardNumber', type: 'VARCHAR(20)', note: 'Masked format (XXXX…last4)' },
        { name: 'cardType', type: 'VARCHAR(20)', note: 'Visa / MasterCard / Amex' },
        { name: 'expiryDate', type: 'VARCHAR(10)', note: 'Card expiry date (MM/YYYY)' }
      ]
    }
  ]

  return (
    <SectionWrapper id="database" className="database-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">05 // DATA ARCHITECTURE</span>
          <h2 className="section-title">Relational Schema &amp; Entity Design</h2>
          <p className="section-subtitle">
            Normalized 5-table relational design with strict foreign-key integrity, version-controlled
            via Flyway migrations for seamless MySQL and H2 portability.
          </p>
        </div>

        {/* Essential Architecture Notes Required by Prompt */}
        <div className="db-notes-grid">
          <div className="note-card note-security">
            <div className="note-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <strong>Security Protocol Notice</strong>
            </div>
            <p className="note-body">
              <strong>CVV and PIN are never persisted — mock payment only.</strong> Sensitive payment verification tokens
              are validated ephemerally in application memory and deliberately discarded before database commit,
              leaving the audit table with masked values only.
            </p>
          </div>

          <div className="note-card note-ambiguity">
            <div className="note-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <strong>Schema Scope &amp; Design Clarification</strong>
            </div>
            <p className="note-body">
              <strong>Source documentation does not specify a sixth table.</strong> The 5 canonical tables completely satisfy all
              functional requirements without redundant schema complexity.
            </p>
          </div>
        </div>

        {/* 5 Database Table Cards */}
        <div className="tables-grid">
          {tables.map((tbl) => (
            <div key={tbl.tableName} className="glass-panel table-card">
              <div className="table-header">
                <div className="table-title-row">
                  <span className="table-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
                  </span>
                  <h3 className="table-name font-mono">{tbl.tableName}</h3>
                </div>
                <span className="badge badge-cyan">{tbl.columns.length} COLUMNS</span>
              </div>

              <p className="table-desc">{tbl.description}</p>

              <div className="table-cols-list font-mono">
                {tbl.columns.map((col, idx) => (
                  <div key={idx} className="table-col-row">
                    <div className="col-identity">
                      {col.key === 'PK' && <span className="col-key-tag pk">PK</span>}
                      {col.key === 'FK' && <span className="col-key-tag fk">FK</span>}
                      <span className={`col-name ${col.key === 'PK' ? 'highlight-pk' : ''}`}>{col.name}</span>
                    </div>
                    <span className="col-type">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .db-notes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .db-notes-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .note-card {
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .note-security {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #a7f3d0;
        }
        .note-security .note-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #34d399;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .note-ambiguity {
          background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: #e9d5ff;
        }
        .note-ambiguity .note-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c084fc;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .note-body strong {
          color: #ffffff;
        }
        .tables-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .tables-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .tables-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .table-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }
        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }
        .table-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .table-icon {
          color: var(--cyan);
          display: flex;
        }
        .table-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .table-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }
        .table-cols-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: #050811;
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.785rem;
        }
        .table-col-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.25rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .table-col-row:last-child {
          border-bottom: none;
        }
        .col-identity {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .col-key-tag {
          font-size: 0.625rem;
          font-weight: 800;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          line-height: 1;
        }
        .col-key-tag.pk {
          background: rgba(245, 158, 11, 0.25);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.5);
        }
        .col-key-tag.fk {
          background: rgba(0, 245, 255, 0.2);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.4);
        }
        .col-name {
          color: #cbd5e1;
        }
        .col-name.highlight-pk {
          color: #fbbf24;
          font-weight: 700;
        }
        .col-type {
          color: var(--text-dim);
          font-size: 0.725rem;
        }
      `}</style>
    </SectionWrapper>
  )
}
