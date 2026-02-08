import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Hook for tracking and managing payments
 * Handles local state management and API communication
 */
export function usePaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new payment record
   */
  const createPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment record');
      }

      const newPayment = await response.json();
      setPayments((prev) => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update payment status
   */
  const updatePaymentStatus = useCallback(async (paymentId, status, notes = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const updatedPayment = await response.json();
      
      // Update local state
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? updatedPayment : p))
      );

      return updatedPayment;
    } catch (err) {
      console.error('Error updating payment:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get payment by ID
   */
  const getPayment = useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/payments/${paymentId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payment');
      }

      const payment = await response.json();
      return payment;
    } catch (err) {
      console.error('Error fetching payment:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all payments for a property
   */
  const getPaymentsByProperty = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/payments?propertyId=${propertyId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const paymentsData = await response.json();
      setPayments(paymentsData);
      return paymentsData;
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get payment statistics for a property
   */
  const getPaymentStats = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/payments/stats/${propertyId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment statistics');
      }

      const stats = await response.json();
      return stats;
    } catch (err) {
      console.error('Error fetching payment stats:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Webhook handler for payment status updates from Stripe or crypto gateways
   */
  const handleWebhook = useCallback(async (webhookData) => {
    try {
      const { paymentIntentId, status, metaData } = webhookData;
      
      // Find the payment record by paymentIntentId
      const payment = payments.find(
        (p) => p.paymentIntentId === paymentIntentId
      );

      if (payment) {
        await updatePaymentStatus(payment.id, status, metaData?.notes);
      }

      return true;
    } catch (err) {
      console.error('Error handling webhook:', err);
      return false;
    }
  }, [payments, updatePaymentStatus]);

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePaymentStatus,
    getPayment,
    getPaymentsByProperty,
    getPaymentStats,
    handleWebhook,
  };
}
