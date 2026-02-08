import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStripeConnect } from '../hooks/useStripeConnect';
import '../styles/StripeConnectCallback.css';

export default function StripeConnectCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeCodeForAccount, loading, error } = useStripeConnect();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Connecting your Stripe account...');

  useEffect(() => {
    const processCallback = async () => {
      const code = params.get('code');
      const state = params.get('state');
      const callbackError = params.get('error');
      const errorDescription = params.get('error_description');

      if (callbackError) {
        setStatus('error');
        setMessage(
          `Stripe Connect error: ${callbackError}. ${errorDescription || ''}`
        );
        console.error('Stripe Connect error:', callbackError, errorDescription);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/owners/dashboard/connect-status?status=error');
        }, 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Stripe.');
        setTimeout(() => {
          navigate('/owners/dashboard/connect-status?status=error');
        }, 3000);
        return;
      }

      try {
        // Exchange code for connected account
        const connectedAccount = await exchangeCodeForAccount(code, state);

        setStatus('success');
        setMessage(
          `✓ Successfully connected Stripe account: ${connectedAccount.stripe_user_id}`
        );

        // Store the account info in localStorage or state management
        localStorage.setItem(
          'connectedStripeAccount',
          JSON.stringify({
            accountId: connectedAccount.stripe_user_id,
            email: connectedAccount.stripe_user_email,
            propertyId: state,
            connectedAt: new Date().toISOString(),
          })
        );

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate(
            `/owners/dashboard/connect-status?status=success&propertyId=${state}`
          );
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage(`Failed to complete connection: ${error || err.message}`);
        console.error('Connection error:', err);

        // Redirect to error page after 3 seconds
        setTimeout(() => {
          navigate(`/owners/dashboard/connect-status?status=error&reason=${error}`);
        }, 3000);
      }
    };

    processCallback();
  }, [params, navigate, exchangeCodeForAccount, error]);

  return (
    <div className="stripe-connect-callback">
      <div className="callback-container">
        <div className={`callback-card status-${status}`}>
          <div className="callback-icon">
            {status === 'processing' && (
              <div className="spinner">
                <div className="spinner-inner"></div>
              </div>
            )}
            {status === 'success' && (
              <div className="success-icon">✓</div>
            )}
            {status === 'error' && (
              <div className="error-icon">✕</div>
            )}
          </div>

          <h1 className="callback-title">
            {status === 'processing' && 'Connecting...'}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Failed'}
          </h1>

          <p className="callback-message">{message}</p>

          {status === 'error' && (
            <div className="callback-actions">
              <button
                onClick={() =>
                  navigate('/owners/dashboard')
                }
                className="callback-button primary"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() =>
                  window.location.href = 'https://connect.stripe.com/oauth/authorize?client_id=' + import.meta.env.VITE_STRIPE_CLIENT_ID
                }
                className="callback-button secondary"
              >
                Try Again
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="callback-actions">
              <button
                onClick={() =>
                  navigate('/owners/dashboard')
                }
                className="callback-button primary"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <h4>Debug Info:</h4>
            <pre>
              {JSON.stringify(
                {
                  status,
                  loading,
                  error,
                  params: {
                    code: params.get('code') ? '[present]' : '[missing]',
                    state: params.get('state'),
                    error: params.get('error'),
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
