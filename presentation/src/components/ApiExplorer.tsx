import React, { useState } from 'react'
import { SectionWrapper } from './SectionWrapper'

interface RouteItem {
  method: 'GET' | 'POST'
  path: string
  description: string
  category: 'AUTH' | 'FLIGHTS' | 'BOOKING' | 'MONITORING'
  sampleRequest?: string
  sampleResponse: string
}

export const ApiExplorer: React.FC = () => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(4) // Default to flight search
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'curl'>('response')

  const routes: RouteItem[] = [
    {
      method: 'POST',
      path: '/infygo/register',
      category: 'AUTH',
      description: 'Registers a new user profile with BCrypt encrypted password hashing and validation.',
      sampleRequest: JSON.stringify({
        userId: 'asha01',
        name: 'Asha Kumar',
        city: 'Chennai',
        email: 'asha@example.com',
        phone: '+919876543210',
        password: 'Demo@Pass#2026'
      }, null, 2),
      sampleResponse: JSON.stringify({
        status: 201,
        message: 'User asha01 registered successfully',
        userId: 'asha01'
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/infygo/login',
      category: 'AUTH',
      description: 'Authenticates traveler credentials using timing-attack-safe BCrypt password verification.',
      sampleRequest: JSON.stringify({
        userId: 'asha01',
        password: 'Demo@Pass#2026'
      }, null, 2),
      sampleResponse: JSON.stringify({
        status: 200,
        message: 'Login successful',
        userId: 'asha01',
        authenticated: true
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/infygo/flights/sources',
      category: 'FLIGHTS',
      description: 'Lists all unique departure airport cities with active flights in the inventory.',
      sampleResponse: JSON.stringify([
        'Chennai',
        'Mumbai',
        'Delhi',
        'Bengaluru',
        'Hyderabad',
        'Kolkata'
      ], null, 2)
    },
    {
      method: 'GET',
      path: '/infygo/flights/destinations',
      category: 'FLIGHTS',
      description: 'Lists all unique arrival airport destination hubs in the inventory.',
      sampleResponse: JSON.stringify([
        'Delhi',
        'Mumbai',
        'Kolkata',
        'Goa',
        'Chennai',
        'Ahmedabad'
      ], null, 2)
    },
    {
      method: 'GET',
      path: '/infygo/flights/search;source={src};destination={dst};journeyDate={date}',
      category: 'FLIGHTS',
      description: 'Queries available flights matching route and departure date using Spring @MatrixVariable bindings.',
      sampleResponse: JSON.stringify([
        {
          flightId: 'KA101-261120',
          flightName: 'Kaveri Air',
          source: 'Chennai',
          destination: 'Delhi',
          journeyDate: '2026-11-20',
          departureTime: '06:15:00',
          arrivalTime: '08:50:00',
          fare: 4850.00,
          totalSeats: 180,
          availableSeats: 42
        },
        {
          flightId: 'IN504-261120',
          flightName: 'IndiSky Express',
          source: 'Chennai',
          destination: 'Delhi',
          journeyDate: '2026-11-20',
          departureTime: '14:30:00',
          arrivalTime: '17:10:00',
          fare: 5200.00,
          totalSeats: 150,
          availableSeats: 19
        }
      ], null, 2)
    },
    {
      method: 'POST',
      path: '/infygo/book/tickets;flightId={id};userId={id}',
      category: 'BOOKING',
      description: 'Reserves seats bound via matrix parameters, captures passengers, and issues a PNR with PENDING status.',
      sampleRequest: JSON.stringify({
        passengers: [
          {
            passengerName: 'Asha Kumar',
            passengerAge: 34,
            passengerGender: 'Female'
          },
          {
            passengerName: 'Rohan Kumar',
            passengerAge: 8,
            passengerGender: 'Male'
          }
        ]
      }, null, 2),
      sampleResponse: JSON.stringify({
        pnr: 'KA89412',
        flightId: 'KA101-261120',
        userId: 'asha01',
        journeyDate: '2026-11-20',
        noOfPassengers: 2,
        totalAmount: 9700.00,
        status: 'PENDING_PAYMENT',
        bookingTimestamp: '2026-10-28T14:20:00Z'
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/infygo/payment',
      category: 'BOOKING',
      description: 'Simulates credit card verification and settlement; confirms ticket status to CONFIRMED. Drops CVV/PIN.',
      sampleRequest: JSON.stringify({
        pnr: 'KA89412',
        cardNumber: 'TESTCARD00003456',
        cardHolderName: 'Asha Kumar',
        cvv: '123',
        apin: '4321',
        expiryMonth: 'Dec',
        expiryYear: '2030',
        totalBill: 9700.00
      }, null, 2),
      sampleResponse: JSON.stringify({
        paymentId: 90214,
        pnr: 'KA89412',
        status: 'CONFIRMED',
        maskedCard: 'XXXXXXXXXXXX3456',
        cardType: 'VISA',
        amountPaid: 9700.00,
        message: 'Payment verified and ticket confirmed successfully'
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/infygo/tickets/{pnr}',
      category: 'BOOKING',
      description: 'Retrieves complete ticket itinerary, flight schedule, passenger list, and payment status by PNR.',
      sampleResponse: JSON.stringify({
        pnr: 'KA89412',
        status: 'CONFIRMED',
        flight: {
          flightId: 'KA101-261120',
          flightName: 'Kaveri Air',
          source: 'Chennai',
          destination: 'Delhi',
          departureTime: '06:15:00',
          arrivalTime: '08:50:00'
        },
        user: {
          userId: 'asha01',
          name: 'Asha Kumar'
        },
        passengers: [
          { passengerId: 101, name: 'Asha Kumar', age: 34, gender: 'Female' },
          { passengerId: 102, name: 'Rohan Kumar', age: 8, gender: 'Male' }
        ],
        totalAmount: 9700.00,
        paymentReference: 90214
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/InfyGo/actuator/health',
      category: 'MONITORING',
      description: 'Spring Boot Actuator health probe confirming operational status and database connection vitality.',
      sampleResponse: JSON.stringify({
        status: 'UP',
        components: {
          db: {
            status: 'UP',
            details: {
              database: 'MySQL',
              validationQuery: 'isValid()'
            }
          },
          diskSpace: {
            status: 'UP',
            details: {
              free: 42949672960,
              threshold: 10485760
            }
          },
          ping: {
            status: 'UP'
          }
        }
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/InfyGo/swagger-ui/index.html',
      category: 'MONITORING',
      description: 'Interactive OpenAPI v3 documentation endpoint for developer exploration and schema definition inspection.',
      sampleResponse: JSON.stringify({
        openapi: '3.0.1',
        info: {
          title: 'InfyGo Flight Reservation REST API',
          version: '1.0.0',
          description: 'Infosys Springboard Capstone Documentation'
        },
        status: 'Available via Browser UI'
      }, null, 2)
    }
  ]

  const activeRoute = routes[selectedRouteIdx]

  const generateCurl = (r: RouteItem) => {
    const base = 'http://localhost:8080/InfyGo'
    if (r.method === 'GET') {
      return `curl -s -X GET "${base}${r.path}"`
    }
    return `curl -s -X POST "${base}${r.path}" \\
  -H "Content-Type: application/json" \\
  -d '${r.sampleRequest ? r.sampleRequest.replace(/\n\s*/g, ' ') : '{}'}'`
  }

  return (
    <SectionWrapper id="api" className="api-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">06 // REST INTERFACE</span>
          <h2 className="section-title">API Endpoint Showcase</h2>
          <p className="section-subtitle">
            A comprehensive catalog of all 10 endpoints serving registration, flight lookup, matrix-parameter routing,
            booking, and system health telemetry.
          </p>
        </div>

        <div className="api-layout-grid">
          {/* Endpoint Selector List */}
          <div className="api-list-pane glass-panel">
            <div className="pane-header">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan">AVAILABLE ENDPOINTS</span>
              <span className="badge badge-cyan">{routes.length} ROUTES</span>
            </div>

            <div className="routes-scroll-box" role="tablist" aria-label="API routes">
              {routes.map((rt, idx) => (
                <button
                  key={idx}
                  className={`route-row-btn ${selectedRouteIdx === idx ? 'active' : ''}`}
                  onClick={() => setSelectedRouteIdx(idx)}
                  role="tab"
                  aria-selected={selectedRouteIdx === idx}
                >
                  <span className={`method-badge ${rt.method.toLowerCase()}`}>
                    {rt.method}
                  </span>
                  <span className="route-path-text font-mono">
                    {rt.path}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Request / Response Inspector */}
          <div className="api-detail-pane terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>

              {/* Sub tabs */}
              <div className="terminal-tab-group" role="tablist">
                <button
                  className={`term-tab ${activeTab === 'response' ? 'active' : ''}`}
                  onClick={() => setActiveTab('response')}
                >
                  Response
                </button>
                {activeRoute.sampleRequest && (
                  <button
                    className={`term-tab ${activeTab === 'request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('request')}
                  >
                    Request Body
                  </button>
                )}
                <button
                  className={`term-tab ${activeTab === 'curl' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curl')}
                >
                  cURL Command
                </button>
              </div>
            </div>

            {/* Route Summary Subheader */}
            <div className="api-inspect-meta">
              <div className="meta-left">
                <span className={`method-badge ${activeRoute.method.toLowerCase()}`}>
                  {activeRoute.method}
                </span>
                <span className="meta-path font-mono">{activeRoute.path}</span>
              </div>
              <span className="badge badge-ice">{activeRoute.category}</span>
            </div>

            <p className="api-inspect-desc">{activeRoute.description}</p>

            {/* Code Output Display */}
            <div className="terminal-body font-mono">
              {activeTab === 'response' && (
                <div>
                  <span className="terminal-comment">// HTTP/1.1 200 OK · Content-Type: application/json</span>
                  <pre className="code-pre">{activeRoute.sampleResponse}</pre>
                </div>
              )}

              {activeTab === 'request' && activeRoute.sampleRequest && (
                <div>
                  <span className="terminal-comment">// Outgoing JSON Request Payload</span>
                  <pre className="code-pre">{activeRoute.sampleRequest}</pre>
                </div>
              )}

              {activeTab === 'curl' && (
                <div>
                  <span className="terminal-comment">// Shell Execution Command</span>
                  <pre className="code-pre curl-pre">{generateCurl(activeRoute)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .api-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 992px) {
          .api-layout-grid {
            grid-template-columns: 440px 1fr;
          }
        }
        .api-list-pane {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          max-height: 620px;
        }
        .pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 0.75rem;
        }
        .text-cyan {
          color: var(--cyan);
          font-size: 0.75rem;
        }
        .routes-scroll-box {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          overflow-y: auto;
          padding-right: 0.35rem;
        }
        .route-row-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 0.85rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(0, 245, 255, 0.1);
          border-radius: var(--radius-sm);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        .route-row-btn:hover {
          background: rgba(23, 37, 68, 0.8);
          border-color: rgba(0, 245, 255, 0.3);
        }
        .route-row-btn.active {
          background: rgba(0, 245, 255, 0.15);
          border-color: var(--cyan);
          box-shadow: 0 0 12px rgba(0, 245, 255, 0.2);
        }
        .route-path-text {
          font-size: 0.775rem;
          color: #cbd5e1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .route-row-btn.active .route-path-text {
          color: #ffffff;
          font-weight: 600;
        }
        .api-detail-pane {
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }
        .terminal-tab-group {
          display: flex;
          gap: 0.5rem;
        }
        .term-tab {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .term-tab:hover {
          color: #ffffff;
        }
        .term-tab.active {
          background: rgba(0, 245, 255, 0.15);
          color: var(--cyan);
          font-weight: 700;
        }
        .api-inspect-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1.25rem 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        @media (min-width: 640px) {
          .api-inspect-meta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .meta-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          overflow: hidden;
        }
        .meta-path {
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 600;
          word-break: break-all;
        }
        .api-inspect-desc {
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .curl-pre {
          color: #facc15 !important;
        }
      `}</style>
    </SectionWrapper>
  )
}
