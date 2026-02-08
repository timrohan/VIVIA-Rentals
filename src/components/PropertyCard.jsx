import { getPropertyChannels } from '../services/listingSyndicationService';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const channels = getPropertyChannels(property.id);

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={property.imageUrl} alt={property.address} />
        <div className="property-badge">{property.propertyType}</div>
      </div>

      <div className="property-content">
        <h3 className="property-address">{property.address}</h3>

        <div className="property-specs">
          {property.bedrooms > 0 && (
            <span className="spec">
              <strong>{property.bedrooms}</strong> Bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          <span className="spec">
            <strong>{property.bathrooms}</strong> Bath{property.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="spec">
            <strong>{property.squareFeet.toLocaleString()}</strong> sqft
          </span>
        </div>

        <div className="property-rent">
          <span className="rent-value">${property.monthlyRent.toLocaleString()}</span>
          <span className="rent-period">/ month</span>
        </div>

        <div className="property-availability">
          <strong>Available:</strong> {new Date(property.availableDate).toLocaleDateString()}
        </div>

        <div className="property-channels">
          <div className="channels-label">Listed on:</div>
          <div className="channels-list">
            {channels.map((channel) => (
              <span
                key={channel.id}
                className="channel-badge"
                style={{ backgroundColor: channel.color }}
                title={channel.name}
              >
                {channel.icon} {channel.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
