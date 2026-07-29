import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/clients');
        setClients(response.data.data || []);
      } catch (err) {
        setError('Failed to load clients. Please try again.');
        console.error('Failed to fetch clients', err);
      } finally {
        setLoading(false);
      }
    };

    connectSocket();
    const unsubscribe = subscribeToEvent('clients:updated', fetchClients);

    fetchClients();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-100">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <div className="record-badge">{clients.length} Total</div>
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
            <span className="spinner-text">Loading clients...</span>
          </div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No clients found</p>
          </div>
        ) : (
          <div className="table-container table-responsive">
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>PAN</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>
                      <span className="badge bg-info text-dark">{client.clientCode}</span>
                    </td>
                    <td>{client.name}</td>
                    <td>{client.pan}</td>
                    <td>{client.email}</td>
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

export default ClientsPage;
