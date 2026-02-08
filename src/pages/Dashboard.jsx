import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Vivia Rentals</h1>
          <p className="tagline">Multi-Channel Property Listing Syndication</p>
        </div>
      </header>

      <section className="dashboard-hero">
        <div className="hero-content">
          <h2>Syndicate Your Properties Across Multiple Channels</h2>
          <p>
            Reach more renters by listing your properties on Zillow, Zumper, TurboTenant, and
            Realtor in a single platform.
          </p>
          <Link to="/owners/dashboard/embedpropertylist" className="cta-button primary">
            View Property Listings
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Multi-Channel Syndication</h3>
            <p>
              List your properties on Zillow, Zumper, TurboTenant, and Realtor simultaneously
              from one dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Advanced Filtering</h3>
            <p>
              Filter and manage properties by channel, type, location, and availability dates
              with ease.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Property Analytics</h3>
            <p>
              Track which channels your properties are listed on and monitor syndication
              statistics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Responsive</h3>
            <p>
              Lightning-fast filtering and responsive design works seamlessly on any device.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>UTM Tracking</h3>
            <p>Track your listing campaigns with built-in UTM parameter support and analytics.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Targeted Listing</h3>
            <p>
              Fine-tune your listings by property type, rent range, and listing preferences per
              channel.
            </p>
          </div>
        </div>
      </section>

      <section className="channels-section">
        <h2>Supported Channels</h2>
        <div className="channels-grid">
          <div className="channel-item">
            <div className="channel-icon">🏠</div>
            <h3>Zillow</h3>
            <p>America's largest real estate marketplace</p>
          </div>

          <div className="channel-item">
            <div className="channel-icon">🔑</div>
            <h3>Zumper</h3>
            <p>Modern rental marketplace for discovery</p>
          </div>

          <div className="channel-item">
            <div className="channel-icon">⚡</div>
            <h3>TurboTenant</h3>
            <p>Property management & leasing platform</p>
          </div>

          <div className="channel-item">
            <div className="channel-icon">🏢</div>
            <h3>Realtor.com</h3>
            <p>Established real estate listings platform</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Multiply Your Reach?</h2>
        <p>Start syndicating your properties across multiple channels today.</p>
        <Link to="/owners/dashboard/embedpropertylist" className="cta-button secondary">
          Get Started
        </Link>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2026 Vivia Rentals. All rights reserved.</p>
      </footer>
    </div>
  );
}
