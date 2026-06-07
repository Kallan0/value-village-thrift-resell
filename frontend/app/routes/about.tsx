import { Link } from "react-router";

export default function About() {
  return (
    <div className="page-content">
      {/* HERO SECTION */}
      <div className="about-hero-vv">
        <div className="about-hero-bg"></div>
        <div className="about-hero-big">VILLAGE</div>
        <div className="about-hero-tag">Our Mission</div>
        <h1 className="about-hero-h1">ABOUT <span>US</span></h1>
        <div className="about-hero-sub">Sustainable shopping made accessible and fun.</div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="about-body">
        <div className="about-grid">
          <div>
            <div className="about-tag">Our Story</div>
            <h2 className="about-h2">Founded by thrifters,<br/><em>for thrifters.</em></h2>
          </div>
          <div>
            <p className="about-p">
              Value Village connects buyers and sellers for a circular fashion economy. We handpick items and ensure quality so shoppers can find hidden gems with confidence. We curate pre-loved fashion, vintage finds, and everyday essentials from trusted resellers across Canada.
            </p>
          </div>
        </div>
      </div>

      {/* STATS BANNER */}
      <div className="stats-banner">
        <div className="stat-card">
          <div className="stat-big">12K+</div>
          <div className="stat-caption">Items Listed</div>
        </div>
        <div className="stat-card">
          <div className="stat-big">₹500</div>
          <div className="stat-caption">Avg. Price</div>
        </div>
        <div className="stat-card">
          <div className="stat-big">4.9★</div>
          <div className="stat-caption">Seller Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-big">85%</div>
          <div className="stat-caption">Seller Payout</div>
        </div>
      </div>

      {/* SELL WITH US SECTION */}
      <div className="about-values">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Join the community</div>
            <h2 className="section-title" style={{ fontSize: '36px' }}>SELL WITH US</h2>
          </div>
          <Link to="/sell"><button className="btn-primary">Create Account</button></Link>
        </div>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">♻️</div>
            <div className="value-title">Circular Economy</div>
            <div className="value-desc">Keep clothes out of landfills and give them a second life.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">💰</div>
            <div className="value-title">Keep 85%</div>
            <div className="value-desc">We offer one of the highest seller payouts in the industry.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">📦</div>
            <div className="value-title">We Handle the Rest</div>
            <div className="value-desc">Just list your items, and we provide the shipping labels and support.</div>
          </div>
        </div>
      </div>
    </div>
  );
}