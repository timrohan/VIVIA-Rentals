/**
 * Listing Syndication Service
 * Handles multi-channel listing syndication logic for:
 * - Zillow
 * - Zumper
 * - TurboTenant
 * - Realtor
 */

const SYNDICATION_CHANNELS = {
  ZILLOW: 'zillow',
  ZUMPER: 'zumper',
  TURBOTENANT: 'turbotenant',
  REALTOR: 'realtor',
};

const CHANNEL_CONFIGS = {
  [SYNDICATION_CHANNELS.ZILLOW]: {
    name: 'Zillow',
    icon: '🏠',
    color: '#0074e4',
    description: 'Largest real estate marketplace',
  },
  [SYNDICATION_CHANNELS.ZUMPER]: {
    name: 'Zumper',
    icon: '🔑',
    color: '#ff6b35',
    description: 'Rental marketplace platform',
  },
  [SYNDICATION_CHANNELS.TURBOTENANT]: {
    name: 'TurboTenant',
    icon: '⚡',
    color: '#f7931e',
    description: 'Property management & leasing',
  },
  [SYNDICATION_CHANNELS.REALTOR]: {
    name: 'Realtor.com',
    icon: '🏢',
    color: '#003580',
    description: 'Real estate listings platform',
  },
};

/**
 * Mock property data for demonstration
 * In production, this would come from an API
 */
const mockProperties = [
  {
    id: 'prop-001',
    address: '123 Main St, San Francisco, CA 94102',
    propertyType: 'Residential Rental',
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 1200,
    monthlyRent: 3500,
    availableDate: '2026-03-01',
    channels: ['zillow', 'zumper', 'turbotenant', 'realtor'],
    imageUrl: 'https://via.placeholder.com/400x300?text=Property+1',
  },
  {
    id: 'prop-002',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    propertyType: 'Residential Rental',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1600,
    monthlyRent: 4200,
    availableDate: '2026-02-15',
    channels: ['zillow', 'realtor'],
    imageUrl: 'https://via.placeholder.com/400x300?text=Property+2',
  },
  {
    id: 'prop-003',
    address: '789 Pine Rd, Seattle, WA 98101',
    propertyType: 'Commercial',
    bedrooms: 0,
    bathrooms: 2,
    squareFeet: 2500,
    monthlyRent: 5500,
    availableDate: '2026-04-01',
    channels: ['zumper', 'turbotenant'],
    imageUrl: 'https://via.placeholder.com/400x300?text=Property+3',
  },
];

/**
 * Get all available syndication channels
 */
export const getAvailableChannels = () => {
  return Object.entries(CHANNEL_CONFIGS).map(([key, config]) => ({
    id: key,
    ...config,
  }));
};

/**
 * Get channels for a specific property
 */
export const getPropertyChannels = (propertyId) => {
  const property = mockProperties.find((p) => p.id === propertyId);
  if (!property) return [];

  return property.channels.map((channelId) => ({
    id: channelId,
    ...CHANNEL_CONFIGS[channelId],
  }));
};

/**
 * Parse UTM parameters from URL
 */
export const parseUtmParameters = (searchParams) => {
  return {
    source: searchParams.get('utm_source') || null,
    medium: searchParams.get('utm_medium') || null,
    campaign: searchParams.get('utm_campaign') || null,
    content: searchParams.get('utm_content') || null,
    term: searchParams.get('utm_term') || null,
  };
};

/**
 * Filter properties by channel(s)
 */
export const filterPropertiesByChannels = (channels = []) => {
  if (channels.length === 0) return mockProperties;
  return mockProperties.filter((property) =>
    channels.some((channel) => property.channels.includes(channel))
  );
};

/**
 * Filter properties by type
 */
export const filterPropertiesByType = (propertyType) => {
  if (!propertyType) return mockProperties;
  return mockProperties.filter((p) => p.propertyType === propertyType);
};

/**
 * Get syndication statistics
 */
export const getSyndicationStats = () => {
  const stats = {
    totalProperties: mockProperties.length,
    channelDistribution: {},
    propertyTypeDistribution: {},
  };

  mockProperties.forEach((property) => {
    // Count channel distribution
    property.channels.forEach((channel) => {
      stats.channelDistribution[channel] =
        (stats.channelDistribution[channel] || 0) + 1;
    });

    // Count property type distribution
    const type = property.propertyType;
    stats.propertyTypeDistribution[type] =
      (stats.propertyTypeDistribution[type] || 0) + 1;
  });

  return stats;
};

/**
 * Get all mock properties
 */
export const getAllProperties = () => {
  return mockProperties;
};

/**
 * Get property by ID
 */
export const getPropertyById = (propertyId) => {
  return mockProperties.find((p) => p.id === propertyId);
};
