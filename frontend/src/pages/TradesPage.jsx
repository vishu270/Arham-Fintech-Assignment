import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/trades');
        setTrades(response.data.data || []);
      } catch (err) {
        setError('Failed to load trades. Please try again.');
        console.error('Failed to fetch trades', err);
      } finally {
        setLoading(false);
      }
    };

    connectSocket();
    const unsubscribe = subscribeToEvent('trades:updated', fetchTrades);

    fetchTrades();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-100">
      <div className="page-header">
        <h1 className="page-title">Trades</h1>
        <div className="record-badge">{trades.length} Total</div>
      </div>

      {error && (
        <div className="error-alert">
          <span className="error-alert-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="page-card">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="spinner-text">Loading trades...</span>
          </div>
        ) : trades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📉</div>
            <p>No trades found</p>
          </div>
        ) : (
          <div className="table-container table-responsive">
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade._id}>
                    <td>
                      <span className="badge bg-success">{trade.symbol}</span>
                    </td>
                    <td>{trade.quantity}</td>
                    <td className="fw-bold text-primary">₹{trade.price.toFixed(2)}</td>
                    <td>{new Date(trade.tradeDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TradesPage;
