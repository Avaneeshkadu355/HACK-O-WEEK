import { Link } from 'react-router'
import './App.css'

function App() {
  return (
    <main className="welcome-page">
      <header className="brand-header">
        <a href="/" className="brand" aria-label="AGRI-CONNECT home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path
                d="M39 7C23 7 10 14 10 27c0 7 5 12 12 12C35 39 40 23 39 7Z"
                fill="#A8CE84"
              />
              <path
                d="M9 41C16 30 24 23 34 15"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="brand-name">
            AGRI<span>-CONNECT</span>
          </span>
        </a>

        <p className="tagline">
          Kisan se bazaar tak, bharose ke saath.
        </p>
      </header>

      <section className="welcome-hero">
        <img
          className="marketplace-image"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2200&q=90"
          alt="Fresh vegetables displayed at a produce market"
        />

        <div className="hero-overlay" />

        <div className="hero-message">
          <span className="hero-label">A FAIRER WAY TO TRADE</span>

          <h1>
            Where farmers
            <br />
            meet opportunity.
          </h1>

          <p>
            Bringing the people who grow our food closer
            to the people who need it.
          </p>
        </div>

        <span className="image-caption">
          GROWN WITH CARE. CONNECTED WITH PURPOSE.
        </span>
      </section>

      <section className="entry-section">
        <p className="entry-heading">
          HOW WOULD YOU LIKE TO CONNECT?
        </p>

        <div className="entry-buttons">
          <Link to="/farmer" className="entry-button farmer-button">
            <span className="entry-copy">
              <strong>I'm a Farmer</strong>
              <small>Bring your harvest to market</small>
            </span>
            <span className="entry-icon" aria-hidden="true">↗</span>
          </Link>

          <Link to="/buyer" className="entry-button buyer-button">
            <span className="entry-copy">
              <strong>I'm a Buyer</strong>
              <small>Discover produce and suppliers</small>
            </span>
            <span className="entry-icon" aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className="welcome-footer">
        AGRI-CONNECT <span>✳</span> SIH26033 <span>✳</span>
        A FAIRER AGRICULTURAL SUPPLY CHAIN
      </footer>
    </main>
  )
}

export default App
