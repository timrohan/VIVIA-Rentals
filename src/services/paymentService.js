import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Payment API Service
 * Handles all payment-related API calls to the backend
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Create a payment intent
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await api.post('/api/create-payment-intent', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Create a payment record
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/api/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Get a payment by ID
 */
export const getPayment = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

/**
 * Get all payments for a property
 */
export const getPaymentsByProperty = async (propertyId) => {
  try {
    const response = await api.get('/api/payments', {
      params: { propertyId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (paymentId, status, notes = null) => {
  try {
    const response = await api.patch(`/api/payments/${paymentId}`, {
      status,
      notes,
      updated_at: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Get payment statistics for a property
 */
export const getPaymentStats = async (propertyId) => {
  try {
    const response = await api.get(`/api/payments/stats/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
};

/**
 * Process crypto payment
 */
export const processCryptoPayment = async (cryptoData) => {
  try {
    const response = await api.post('/api/process-crypto', cryptoData);
    return response.data;
  } catch (error) {
    console.error('Error processing crypto payment:', error);
    throw error;
  }
};

/**
 * Stripe Connect - Exchange OAuth code for account
 */
export const exchangeStripeCode = async (code, state) => {
  try {
    const response = await api.post('/api/stripe/connect', { code, state });
    return response.data;
  } catch (error) {
    console.error('Error exchanging Stripe code:', error);
    throw error;
  }
};

/**
 * Stripe Connect - Get account details
 */
export const getStripeAccountDetails = async (accountId) => {
  try {
    const response = await api.get(`/api/stripe/account/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Stripe account details:', error);
    throw error;
  }
};

/**
 * Stripe Connect - Disconnect account
 */
export const disconnectStripeAccount = async (accountId) => {
  try {
    const response = await api.delete(`/api/stripe/account/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting Stripe account:', error);
    throw error;
  }
};

/**
 * Stripe Connect - Create transfer
 */
export const createStripeTransfer = async (accountId, amount, paymentIntentId) => {
  try {
    const response = await api.post('/api/stripe/transfer', {
      accountId,
      amount,
      paymentIntentId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transfer:', error);
    throw error;
  }
};

/**
 * Webhook validation - Verify Stripe webhook signature
 */
export const verifyWebhookSignature = async (signature, payload) => {
  try {
    const response = await api.post('/api/webhooks/verify', {
      signature,
      payload,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw error;
  }
};

/**
 * Get all transactions for dashboard
 */
export const getDashboardTransactions = async (filters = {}) => {
  try {
    const response = await api.get('/api/transactions', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard transactions:', error);
    throw error;
  }
};

/**
 * Export payment records
 */
export const exportPaymentRecords = async (propertyId, format = 'csv') => {
  try {
    const response = await api.get('/api/payments/export', {
      params: { propertyId, format },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting payment records:', error);
    throw error;
  }
};

export default api;
