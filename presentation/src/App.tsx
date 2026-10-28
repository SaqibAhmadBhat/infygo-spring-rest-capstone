import React, { useState, useEffect } from 'react'
import { Hero } from './components/Hero'
import { Overview } from './components/Overview'
import { Architecture } from './components/Architecture'
import { Features } from './components/Features'
import { BookingLifecycle } from './components/BookingLifecycle'
import { Database } from './components/Database'
import { ApiExplorer } from './components/ApiExplorer'
import { Testing } from './components/Testing'
import { Team } from './components/Team'
import { TechStack } from './components/TechStack'
import { Deployment } from './components/Deployment'
import { Closing } from './components/Closing'

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'features', label: 'Features' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'database', label: 'Database' },
    { id: 'api', label: 'API Explorer' },
    { id: 'testing', label: 'Testing' },
    { id: 'team', label: 'Team' },
    { id: 'tech-stack', label: 'Tech Stack' },
    { id: 'deployment', label: 'Deployment' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      const sectionElements = navItems.map(item => document.getElementById(item.id))
      const scrollPos = window.scrollY + 200

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i]
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-container">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sticky Top Navigation Bar */}
      <header className={`sticky-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-content">
          <a href="#hero" className="nav-logo" aria-label="InfyGo home">
            <span className="logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </span>
            <div className="logo-text">
              <span className="logo-title font-mono">InfyGo</span>
              <span className="logo-badge">REST Capstone</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Header Action Button */}
          <div className="nav-right">
            <a
              href="https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary nav-github-btn"
              aria-label="GitHub Repository"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="mobile-nav-drawer" aria-label="Mobile navigation">
            <div className="container mobile-links-list">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content: Render Sections A through L in strict order */}
      <main id="main-content">
        {/* A */}
        <Hero />
        {/* B */}
        <Overview />
        {/* C */}
        <Architecture />
        {/* D */}
        <Features />
        {/* E */}
        <BookingLifecycle />
        {/* F */}
        <Database />
        {/* G */}
        <ApiExplorer />
        {/* H */}
        <Testing />
        {/* I */}
        <Team />
        {/* J */}
        <TechStack />
        {/* K */}
        <Deployment />
      </main>

      {/* L: Closing Footer */}
      <Closing />

      <style>{`
        .app-container {
          min-height: 100vh;
          position: relative;
        }
        .sticky-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          z-index: 100;
          background: rgba(10, 14, 26, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 245, 255, 0.08);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-scrolled {
          background: rgba(6, 9, 19, 0.92);
          border-bottom-color: rgba(0, 245, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }
        .nav-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
        }
        .logo-icon {
          color: var(--cyan);
          display: flex;
          filter: drop-shadow(0 0 8px var(--cyan));
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        .logo-badge {
          font-size: 0.65rem;
          color: var(--ice-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .desktop-nav {
          display: none;
          align-items: center;
          gap: 0.35rem;
        }
        @media (min-width: 1080px) {
          .desktop-nav {
            display: flex;
          }
        }
        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 550;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: color 0.15s ease, background 0.15s ease;
        }
        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }
        .nav-link.active {
          color: var(--cyan);
          background: rgba(0, 245, 255, 0.1);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-github-btn {
          padding: 0.45rem 0.85rem;
          font-size: 0.8125rem;
        }
        @media (max-width: 640px) {
          .nav-github-btn span {
            display: none;
          }
        }
        .mobile-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid rgba(0, 245, 255, 0.2);
          color: var(--text-main);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        @media (min-width: 1080px) {
          .mobile-toggle-btn {
            display: none;
          }
        }
        .mobile-nav-drawer {
          background: rgba(6, 9, 19, 0.98);
          border-bottom: 1px solid rgba(0, 245, 255, 0.2);
          padding: 1.25rem 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        }
        .mobile-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mobile-nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9375rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: var(--cyan);
          background: rgba(0, 245, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

export default App
