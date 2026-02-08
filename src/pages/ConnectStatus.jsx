import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/ConnectStatus.css';

export default function ConnectStatus() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState(null);

  const status = params.get('status');
  const propertyId = params.get('propertyId');
  const reason = params.get('reason');

  useEffect(() => {
    if (status === 'success') {
      const storedAccount = localStorage.getItem('connectedStripeAccount');
      if (storedAccount) {
        setAccountInfo(JSON.parse(storedAccount));
      }
    }
  }, [status]);

  return (
    <div className="connect-status">
      <div className="status-container">
        <div className={`status-card status-${status}`}>
          <div className="status-icon">
            {status === 'success' && <div className="check-mark">✓</div>}
            {status === 'error' && <div className="error-mark">✕</div>}
          </div>

          <h1 className="status-title">
            {status === 'success'
              ? 'Stripe Account Connected!'
              : 'Connection Failed'}
          </h1>

          {status === 'success' && accountInfo && (
            <div className="account-details">
              <p>
                <strong>Account ID:</strong> {accountInfo.accountId}
              </p>
              <p>
                <strong>Email:</strong> {accountInfo.email}
              </p>
              {propertyId && (
                <p>
                  <strong>Property:</strong> {propertyId}
                </p>
              )}
              <p>
                <strong>Connected:</strong>{' '}
                {new Date(accountInfo.connectedAt).toLocaleString()}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="error-details">
              <p>Unable to connect your Stripe account.</p>
              {reason && (
                <p className="error-reason">
                  <strong>Reason:</strong> {reason}
                </p>
              )}
            </div>
          )}

          <div className="status-actions">
            <button
              onClick={() => navigate('/owners/dashboard')}
              className={`status-button ${status}`}
            >
              Return to Dashboard
            </button>

            {status === 'error' && (
              <button
                onClick={() => navigate('/owners/dashboard')}
                className="status-button secondary"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
