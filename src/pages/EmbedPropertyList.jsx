import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import {
  getAvailableChannels,
  getAllProperties,
  filterPropertiesByChannels,
  filterPropertiesByType,
  parseUtmParameters,
  getSyndicationStats,
} from '../services/listingSyndicationService';
import './EmbedPropertyList.css';

export default function EmbedPropertyList() {
  const [searchParams] = useSearchParams();
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [sortBy, setSortBy] = useState('available');

  const utmParams = useMemo(() => parseUtmParameters(searchParams), [searchParams]);
  const availableChannels = useMemo(() => getAvailableChannels(), []);
  const stats = useMemo(() => getSyndicationStats(), []);

  // Get filtered properties
  const filteredProperties = useMemo(() => {
    let properties = getAllProperties();

    // Filter by channels
    if (selectedChannels.length > 0) {
      properties = filterPropertiesByChannels(selectedChannels);
    }

    // Filter by property type
    if (selectedPropertyType) {
      properties = filterPropertiesByType(selectedPropertyType);
    }

    // Sort
    if (sortBy === 'rent-low') {
      properties = [...properties].sort((a, b) => a.monthlyRent - b.monthlyRent);
    } else if (sortBy === 'rent-high') {
      properties = [...properties].sort((a, b) => b.monthlyRent - a.monthlyRent);
    } else if (sortBy === 'available') {
      properties = [...properties].sort(
        (a, b) => new Date(a.availableDate) - new Date(b.availableDate)
      );
    }

    return properties;
  }, [selectedChannels, selectedPropertyType, sortBy]);

  const uniquePropertyTypes = Array.from(
    new Set(getAllProperties().map((p) => p.propertyType))
  );

  const toggleChannelFilter = (channelId) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((c) => c !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="embed-property-list">
      {/* Header with UTM info */}
      <header className="embed-header">
        <div className="header-content">
          <h1>Multi-Channel Property Listings</h1>
          <p className="subtitle">
            Browse properties listed across Zillow, Zumper, TurboTenant, and Realtor
          </p>
          {utmParams.campaign && (
            <div className="utm-info">
              <small>
                Campaign: <code>{utmParams.campaign}</code>
              </small>
            </div>
          )}
        </div>
      </header>

      {/* Statistics */}
      <section className="statistics-section">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProperties}</div>
          <div className="stat-label">Total Properties</div>
        </div>
        {availableChannels.map((channel) => (
          <div key={channel.id} className="stat-card">
            <div className="stat-number">{stats.channelDistribution[channel.id] || 0}</div>
            <div className="stat-label">{channel.name}</div>
          </div>
        ))}
      </section>

      <div className="embed-container">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          <h2>Filters</h2>

          {/* Channel Filter */}
          <div className="filter-group">
            <h3>Listing Channels</h3>
            <div className="filter-options">
              {availableChannels.map((channel) => (
                <label key={channel.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedChannels.includes(channel.id)}
                    onChange={() => toggleChannelFilter(channel.id)}
                  />
                  <span className="channel-indicator" style={{ color: channel.color }}>
                    {channel.icon}
                  </span>
                  <span className="filter-label">{channel.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="filter-group">
            <h3>Property Type</h3>
            <select
              className="filter-select"
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
            >
              <option value="">All Types</option>
              {uniquePropertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="available">Available Date (Earliest)</option>
              <option value="rent-low">Rent (Low to High)</option>
              <option value="rent-high">Rent (High to Low)</option>
            </select>
          </div>

          {/* Active Filters */}
          {(selectedChannels.length > 0 || selectedPropertyType) && (
            <div className="active-filters">
              <div className="filters-header">Active Filters:</div>
              {selectedChannels.map((channelId) => (
                <button
                  key={channelId}
                  className="filter-tag"
                  onClick={() => toggleChannelFilter(channelId)}
                >
                  ✕ {availableChannels.find((c) => c.id === channelId)?.name}
                </button>
              ))}
              {selectedPropertyType && (
                <button
                  className="filter-tag"
                  onClick={() => setSelectedPropertyType('')}
                >
                  ✕ {selectedPropertyType}
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Properties Grid */}
        <main className="properties-main">
          <div className="results-header">
            <h2>
              Results <span className="result-count">({filteredProperties.length})</span>
            </h2>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No properties match your filters. Try adjusting your selections.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
