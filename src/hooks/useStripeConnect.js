import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const STRIPE_CLIENT_ID = import.meta.env.VITE_STRIPE_CLIENT_ID;

/**
 * Hook for managing Stripe Connect OAuth flow
 */
export function useStripeConnect() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate Stripe Connect authorization URL
   */
  const getAuthorizationUrl = useCallback((state) => {
    const params = new URLSearchParams({
      client_id: STRIPE_CLIENT_ID,
      state: state || 'default',
      stripe_landing: 'login',
      scope: 'read_write',
    });

    return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
  }, []);

  /**
   * Exchange authorization code for connected account
   */
  const exchangeCodeForAccount = useCallback(async (code, state) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/stripe/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect Stripe account');
      }

      const data = await response.json();
      setConnectedAccount(data);
      return data;
    } catch (err) {
      console.error('Error exchanging code:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get connected account details
   */
  const getAccountDetails = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/stripe/account/${accountId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }

      const account = await response.json();
      return account;
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Disconnect Stripe account
   */
  const disconnectAccount = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/stripe/account/${accountId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      setConnectedAccount(null);
      return true;
    } catch (err) {
      console.error('Error disconnecting account:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a transfer to connected account
   */
  const createTransfer = useCallback(
    async (accountId, amount, paymentIntentId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/api/stripe/transfer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accountId,
              amount,
              paymentIntentId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create transfer');
        }

        const transfer = await response.json();
        return transfer;
      } catch (err) {
        console.error('Error creating transfer:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    connectedAccount,
    loading,
    error,
    getAuthorizationUrl,
    exchangeCodeForAccount,
    getAccountDetails,
    disconnectAccount,
    createTransfer,
  };
}
