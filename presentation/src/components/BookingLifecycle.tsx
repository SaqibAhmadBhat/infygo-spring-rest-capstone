import React, { useState } from 'react'
import { SectionWrapper } from './SectionWrapper'

interface StepInfo {
  step: number
  name: string
  verb: 'POST' | 'GET'
  endpoint: string
  payload?: string
  dbAction: string
  summary: string
  responseSnippet: string
}

export const BookingLifecycle: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1)

  const steps: StepInfo[] = [
    {
      step: 1,
      name: 'Register',
      verb: 'POST',
      endpoint: '/infygo/register',
      payload: JSON.stringify({
        userId: 'asha01',
        name: 'Asha Kumar',
        city: 'Chennai',
        email: 'asha@example.com',
        phone: '+919876543210',
        password: 'Demo@Pass#2026'
      }, null, 2),
      dbAction: 'INSERT INTO user_details (hashed password via BCrypt)',
      summary: 'Traveler creates an account. BCrypt password hash is generated and verified against strength rules.',
      responseSnippet: '201 Created · "User asha01 registered successfully"'
    },
    {
      step: 2,
      name: 'Login',
      verb: 'POST',
      endpoint: '/infygo/login',
      payload: JSON.stringify({
        userId: 'asha01',
        password: 'Demo@Pass#2026'
      }, null, 2),
      dbAction: 'SELECT * FROM user_details WHERE user_id = ?',
      summary: 'Verifies credentials in constant time. Protects against enumeration attacks by returning identical error responses.',
      responseSnippet: '200 OK · { "message": "Login successful", "userId": "asha01" }'
    },
    {
      step: 3,
      name: 'Search Flights',
      verb: 'GET',
      endpoint: '/infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-11-05',
      dbAction: 'SELECT * FROM flight_details WHERE source=? AND destination=? AND date=? AND available_seats > 0',
      summary: 'Client queries available flights using canonical RFC matrix parameters. Results filtered by available seats.',
      responseSnippet: '200 OK · [ { "flightId": "KA101-261105", "flightName": "Kaveri Air", "fare": 4500.0, "availableSeats": 42 } ]'
    },
    {
      step: 4,
      name: 'Select Flight',
      verb: 'GET',
      endpoint: '/infygo/flights/KA101-261105',
      dbAction: 'SELECT * FROM flight_details WHERE flight_id = "KA101-261105"',
      summary: 'Client inspects selected flight metadata: departure time, arrival time, airline brand, and ticket pricing.',
      responseSnippet: '200 OK · { "flightId": "KA101-261105", "source": "Chennai", "destination": "Delhi", "fare": 4500.0 }'
    },
    {
      step: 5,
      name: 'Book Seats',
      verb: 'POST',
      endpoint: '/infygo/book/tickets;flightId=KA101-261105;userId=asha01',
      payload: JSON.stringify({
        passengers: [
          { passengerName: 'Asha Kumar', passengerAge: 34, passengerGender: 'Female' },
          { passengerName: 'Rohan Kumar', passengerAge: 8, passengerGender: 'Male' }
        ]
      }, null, 2),
      dbAction: 'UPDATE flight_details SET available_seats = available_seats - 2',
      summary: 'Holds inventory atomically. Generates unique 7-character alphanumeric PNR with initial status PENDING_PAYMENT.',
      responseSnippet: '201 Created · { "pnr": "KA79821", "totalFare": 9000.0, "status": "PENDING_PAYMENT" }'
    },
    {
      step: 6,
      name: 'Add Passengers',
      verb: 'POST',
      endpoint: 'Cascaded via /book/tickets',
      dbAction: 'INSERT INTO passenger_details (name, age, gender, pnr)',
      summary: 'Passenger manifest is persisted into passenger_details linked by foreign key to the generated PNR.',
      responseSnippet: '201 Created · 2 Passengers linked to PNR KA79821'
    },
    {
      step: 7,
      name: 'Make Payment',
      verb: 'POST',
      endpoint: '/infygo/payment',
      payload: JSON.stringify({
        pnr: 'KA79821',
        cardNumber: 'TESTCARD00003456',
        cardHolderName: 'Asha Kumar',
        cvv: '123',
        apin: '4321',
        expiryMonth: 'Dec',
        expiryYear: '2030',
        totalBill: 9000.0
      }, null, 2),
      dbAction: 'INSERT INTO creditcard_details (masked card: XXXXXXXXXXXX3456; CVV/PIN discarded)',
      summary: 'Simulated payment processing. Ticket status updated to CONFIRMED. Card number masked; sensitive CVV/PIN dropped.',
      responseSnippet: '200 OK · { "paymentId": 8092, "pnr": "KA79821", "status": "CONFIRMED" }'
    },
    {
      step: 8,
      name: 'Retrieve Ticket (PNR)',
      verb: 'GET',
      endpoint: '/infygo/tickets/KA79821',
      dbAction: 'SELECT t.*, p.*, f.* FROM ticket_details t JOIN ... WHERE t.pnr = "KA79821"',
      summary: 'Traveler or agent retrieves confirmed itinerary, flight schedule, passenger boarding roster, and payment receipt.',
      responseSnippet: '200 OK · { "pnr": "KA79821", "status": "CONFIRMED", "totalAmount": 9000.0, "passengers": 2 }'
    }
  ]

  const current = steps.find(s => s.step === activeStep) || steps[0]

  return (
    <SectionWrapper id="lifecycle" className="lifecycle-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">04 // END-TO-END FLOW</span>
          <h2 className="section-title">Flight Booking Lifecycle</h2>
          <p className="section-subtitle">
            An 8-stage interactive stepper illustrating the transactional progression from traveler registration
            through inventory decrement and mock payment settlement.
          </p>
        </div>

        {/* Stepper Progression Track */}
        <div className="stepper-track-wrap" role="tablist" aria-label="Booking lifecycle stepper">
          <div className="stepper-progress-bar" style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }} />
          <div className="stepper-nodes">
            {steps.map((st) => (
              <button
                key={st.step}
                className={`stepper-node-btn ${activeStep === st.step ? 'active' : ''} ${activeStep > st.step ? 'completed' : ''}`}
                onClick={() => setActiveStep(st.step)}
                role="tab"
                aria-selected={activeStep === st.step}
                aria-label={`Step ${st.step}: ${st.name}`}
              >
                <span className="node-number">{st.step}</span>
                <span className="node-label">{st.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        <div className="glass-panel step-detail-card">
          <div className="step-card-header">
            <div className="step-title-wrap">
              <span className="step-index-badge">STEP {current.step} OF 8</span>
              <h3 className="step-name">{current.name}</h3>
            </div>
            <div className="step-verb-pill">
              <span className={`method-badge ${current.verb === 'POST' ? 'post' : 'get'}`}>
                {current.verb}
              </span>
              <span className="endpoint-text font-mono">{current.endpoint}</span>
            </div>
          </div>

          <p className="step-summary-text">{current.summary}</p>

          <div className="step-grid-panels">
            {/* Database & Transaction Action */}
            <div className="step-panel db-panel">
              <span className="panel-sub-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
                DATABASE TRANSACTION EFFECT
              </span>
              <div className="panel-sql-box font-mono">
                {current.dbAction}
              </div>
              <div className="panel-status-row">
                <span className="badge badge-success">ACID Boundary</span>
                <span className="badge badge-ice">Zero-Leak Privacy</span>
              </div>
            </div>

            {/* Request/Response Payload Preview */}
            <div className="step-panel terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                </div>
                <span className="terminal-title">PAYLOAD &amp; RESPONSE</span>
              </div>
              <div className="terminal-body font-mono">
                {current.payload && (
                  <div className="payload-sub-block">
                    <span className="terminal-comment">// Request Body:</span>
                    <pre className="code-pre">{current.payload}</pre>
                  </div>
                )}
                <div className="response-sub-block">
                  <span className="terminal-comment">// Expected Outcome:</span>
                  <div className="terminal-out">{current.responseSnippet}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="stepper-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              aria-label="Previous step"
            >
              ← Previous Step
            </button>
            <div className="stepper-indicator font-mono">
              Step {activeStep} / {steps.length}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
              disabled={activeStep === steps.length}
              aria-label="Next step"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .stepper-track-wrap {
          position: relative;
          margin-bottom: 3rem;
          padding: 1rem 0;
          overflow-x: auto;
        }
        .stepper-progress-bar {
          position: absolute;
          top: 28px;
          left: 30px;
          height: 3px;
          background: linear-gradient(90deg, var(--cyan), var(--violet));
          box-shadow: 0 0 10px var(--cyan);
          transition: width 0.35s ease;
          z-index: 1;
        }
        .stepper-nodes {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
          min-width: 680px;
        }
        .stepper-node-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-dim);
          transition: all 0.2s ease;
        }
        .node-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #050811;
          border: 2px solid #1e293b;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }
        .node-label {
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .stepper-node-btn:hover .node-number {
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .stepper-node-btn.active .node-number {
          background: var(--cyan);
          color: #050811;
          border-color: var(--cyan);
          box-shadow: 0 0 16px var(--cyan);
          transform: scale(1.15);
        }
        .stepper-node-btn.active .node-label {
          color: var(--cyan);
        }
        .stepper-node-btn.completed .node-number {
          background: rgba(0, 245, 255, 0.15);
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .step-detail-card {
          padding: 2.25rem 2rem;
          background: rgba(13, 19, 38, 0.85);
        }
        .step-card-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.25rem;
        }
        @media (min-width: 768px) {
          .step-card-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .step-index-badge {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--violet);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.25rem;
        }
        .step-name {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .step-verb-pill {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(0, 0, 0, 0.4);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(0, 245, 255, 0.15);
        }
        .method-badge {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .method-badge.post {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .method-badge.get {
          background: rgba(0, 245, 255, 0.2);
          color: var(--cyan);
          border: 1px solid rgba(0, 245, 255, 0.4);
        }
        .endpoint-text {
          font-size: 0.8125rem;
          color: #e2e8f0;
          word-break: break-all;
        }
        .step-summary-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }
        .step-grid-panels {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 900px) {
          .step-grid-panels {
            grid-template-columns: 1fr 1fr;
          }
        }
        .step-panel {
          padding: 1.25rem;
          border-radius: var(--radius-md);
        }
        .db-panel {
          background: rgba(5, 8, 17, 0.85);
          border: 1px solid rgba(168, 85, 247, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .panel-sub-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: var(--violet);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
        }
        .panel-sql-box {
          background: rgba(0, 0, 0, 0.5);
          border-left: 3px solid var(--violet);
          padding: 0.85rem;
          border-radius: 4px;
          color: #c084fc;
          font-size: 0.8125rem;
          line-height: 1.5;
        }
        .panel-status-row {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        .code-pre {
          background: transparent;
          color: var(--ice-blue);
          font-size: 0.785rem;
          margin: 0.5rem 0;
          white-space: pre-wrap;
        }
        .terminal-comment {
          color: var(--text-dim);
          font-size: 0.75rem;
          display: block;
        }
        .terminal-out {
          color: #34d399;
          font-size: 0.8125rem;
          margin-top: 0.35rem;
        }
        .stepper-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
        }
        .stepper-indicator {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .stepper-controls button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </SectionWrapper>
  )
}
