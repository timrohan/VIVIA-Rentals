import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { usePaymentTracking } from '../hooks/usePaymentTracking';
import '../styles/PaymentForm.css';

export default function PaymentForm({ amount, propertyId, userEmail, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createPayment, updatePaymentStatus } = usePaymentTracking();

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

  const handlePayment = async (e, method = 'card') => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    setStatus('processing');

    try {
      // 1. Create PaymentIntent in backend
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-payment-intent`, {
        amount,
        propertyId,
        method,
        email: userEmail,
      });

      // 2. Create local payment record
      const paymentRecord = await createPayment({
        paymentIntentId: data.id,
        propertyId,
        email: userEmail,
        amount,
        method,
        status: 'pending',
      });

      let result;

      if (method === 'card') {
        if (!stripe || !elements) {
          throw new Error('Stripe not loaded');
        }
        const cardElement = elements.getElement(CardElement);
        result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: { email: userEmail },
          },
        });

        if (result.error) {
          setStatus('failed');
          setError(result.error.message);
          await updatePaymentStatus(paymentRecord.id, 'failed', result.error.message);
        } else {
          const newStatus = result.paymentIntent?.status || 'approved';
          setStatus(newStatus);
          await updatePaymentStatus(paymentRecord.id, newStatus);
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentRecord);
          }
        }
      } else if (method === 'link') {
        // Stripe Link payment
        result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
            billing_details: { email: userEmail },
          },
        });

        if (result.error) {
          setStatus('failed');
          setError(result.error.message);
          await updatePaymentStatus(paymentRecord.id, 'failed', result.error.message);
        } else {
          const newStatus = result.paymentIntent?.status || 'approved';
          setStatus(newStatus);
          await updatePaymentStatus(paymentRecord.id, newStatus);
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentRecord);
          }
        }
      } else if (method === 'crypto') {
        // Handle crypto payment
        result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/process-crypto`, {
          amount,
          propertyId,
          email: userEmail,
          paymentIntentId: data.id,
        });

        setStatus('pending');
        await updatePaymentStatus(paymentRecord.id, 'pending', 'Awaiting crypto confirmation');
      } else if (method === 'applepay') {
        // Handle Apple Pay
        const paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Payment',
            amount: amount,
          },
          requestPayerEmail: true,
        });

        result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
            billing_details: { email: userEmail },
          },
        });

        if (result.error) {
          setStatus('failed');
          setError(result.error.message);
          await updatePaymentStatus(paymentRecord.id, 'failed', result.error.message);
        } else {
          const newStatus = result.paymentIntent?.status || 'approved';
          setStatus(newStatus);
          await updatePaymentStatus(paymentRecord.id, newStatus);
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentRecord);
          }
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setStatus('failed');
      setError(err.message || 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return '#3b82f6';
      case 'approved':
      case 'confirmed':
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Payment Information</h2>
      
      <div className="payment-details">
        <p><strong>Amount:</strong> ${(amount / 100).toFixed(2)}</p>
        <p><strong>Property ID:</strong> {propertyId}</p>
        <p><strong>Email:</strong> {userEmail}</p>
      </div>

      <form className="payment-form">
        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          
          <div className="card-element-wrapper">
            <label>Card Details</label>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={(e) => handlePayment(e, 'card')}
            disabled={isProcessing || !stripe}
            className="payment-button card-button"
          >
            {isProcessing ? 'Processing...' : 'Pay with Card'}
          </button>
          
          <button
            type="button"
            onClick={(e) => handlePayment(e, 'link')}
            disabled={isProcessing || !stripe}
            className="payment-button link-button"
          >
            Pay with Stripe Link
          </button>
          
          <button
            type="button"
            onClick={(e) => handlePayment(e, 'applepay')}
            disabled={isProcessing || !stripe}
            className="payment-button applepay-button"
          >
            Pay with Apple Pay
          </button>
          
          <button
            type="button"
            onClick={(e) => handlePayment(e, 'crypto')}
            disabled={isProcessing}
            className="payment-button crypto-button"
          >
            Pay with Crypto
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="status-indicator" style={{ borderColor: getStatusColor() }}>
        <strong>Status:</strong>
        <span style={{ color: getStatusColor() }}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
