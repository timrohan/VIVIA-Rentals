import { useEffect, useState } from 'react';
import { usePaymentTracking } from '../hooks/usePaymentTracking';
import '../styles/PaymentHistory.css';

export default function PaymentHistory({ propertyId }) {
  const { payments, loading, error, getPaymentsByProperty, getPaymentStats } =
    usePaymentTracking();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (propertyId) {
      getPaymentsByProperty(propertyId);
      getPaymentStats(propertyId).then(setStats);
    }
  }, [propertyId, getPaymentsByProperty, getPaymentStats]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'link':
        return '🔗';
      case 'crypto':
        return '₿';
      case 'applepay':
        return '🍎';
      default:
        return '💰';
    }
  };

  if (loading) {
    return (
      <div className="payment-history-container">
        <div className="loading">Loading payment history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-history-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="payment-history-container">
      <h2>Payment History</h2>

      {stats && (
        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-label">Total Received</div>
            <div className="stat-value">
              ${(stats.totalAmount / 100).toFixed(2)}
            </div>
            <div className="stat-meta">{stats.totalPayments} payments</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {stats.approvedCount || 0}
            </div>
            <div className="stat-meta">
              ${(stats.approvedAmount / 100).toFixed(2)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              {stats.pendingCount || 0}
            </div>
            <div className="stat-meta">
              ${(stats.pendingAmount / 100).toFixed(2)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>
              {stats.failedCount || 0}
            </div>
            <div className="stat-meta">
              ${(stats.failedAmount / 100).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="empty-state">
          <p>No payments recorded yet.</p>
        </div>
      ) : (
        <div className="payment-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Email</th>
                <th>Status</th>
                <th>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="payment-row">
                  <td className="col-date">
                    {new Date(payment.created_at).toLocaleString()}
                  </td>
                  <td className="col-amount">
                    ${(payment.amount / 100).toFixed(2)}
                  </td>
                  <td className="col-method">
                    <span className="method-badge">
                      {getMethodIcon(payment.method)} {payment.method}
                    </span>
                  </td>
                  <td className="col-email">{payment.email}</td>
                  <td className="col-status">
                    <span
                      className="status-badge"
                      style={{ borderColor: getStatusColor(payment.status) }}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="col-id">
                    <code>{payment.paymentIntentId?.substring(0, 12)}...</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
