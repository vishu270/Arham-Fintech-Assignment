import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

function MyClientsPage() {
  const [myClients, setMyClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const employeeCode = 'EMP001'; // Temporary: hardcoded employee

  useEffect(() => {
    const fetchMyClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all mappings
        const mappingsResponse = await api.get('/internal/mappings');
        const allMappings = mappingsResponse.data.data || [];
        
        // Filter mappings for the current employee
        const employeeMappings = allMappings.filter(
          (mapping) => mapping.employee?.employeeCode === employeeCode
        );
        
        // Extract unique clients from mappings
        const clients = employeeMappings.map((mapping) => mapping.client);
        setMyClients(clients);
      } catch (err) {
        setError('Failed to load your clients. Please try again.');
        console.error('Failed to fetch mappings', err);
      } finally {
        setLoading(false);
      }
    };

    connectSocket();
    const unsubscribeClients = subscribeToEvent('clients:updated', fetchMyClients);
    const unsubscribeMappings = subscribeToEvent('mappings:updated', fetchMyClients);

    fetchMyClients();

    return () => {
      unsubscribeClients();
      unsubscribeMappings();
    };
  }, []);

  return (
    <div className="w-100">
      <div className="page-header">
        <h1 className="page-title">My Clients</h1>
        <div className="record-badge">{myClients.length} Assigned</div>
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
            <span className="spinner-text">Loading your clients...</span>
          </div>
        ) : myClients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No clients assigned to you yet</p>
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
                {myClients.map((client) => (
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

export default MyClientsPage;
