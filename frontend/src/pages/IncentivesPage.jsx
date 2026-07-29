import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

function IncentivesPage() {
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data sources in parallel for efficiency
        const [employeesRes, mappingsRes, clientsRes, tradesRes] = await Promise.all([
          api.get('/internal/employees'),
          api.get('/internal/mappings'),
          api.get('/clients'),
          api.get('/trades'),
        ]);

        const employees = employeesRes.data.data || [];
        const mappings = mappingsRes.data.data || [];
        const clients = clientsRes.data.data || [];
        const trades = tradesRes.data.data || [];

        // Calculate incentives for each employee
        const incentivesData = employees.map((employee) => {
          // Get mappings for this employee
          const employeeMappings = mappings.filter(
            (m) => m.employee?._id === employee._id
          );

          // Get client IDs assigned to this employee
          const clientIds = employeeMappings.map((m) => m.client?._id);

          // Get all trades executed by these clients
          const employeeTrades = trades.filter(
            (t) => clientIds.includes(t.client?._id)
          );

          // Calculate total brokerage (sum of all trade prices)
          const totalBrokerage = employeeTrades.reduce(
            (sum, trade) => sum + (trade.price || 0),
            0
          );

          // Calculate incentive: 10% of total brokerage
          const incentive = totalBrokerage * 0.1;

          return {
            _id: employee._id,
            employeeCode: employee.employeeCode,
            name: employee.name,
            assignedClients: clientIds.length,
            trades: employeeTrades.length,
            totalBrokerage,
            incentive,
          };
        });

        setIncentives(incentivesData);
      } catch (err) {
        setError('Failed to load incentives. Please try again.');
        console.error('Failed to fetch incentives', err);
      } finally {
        setLoading(false);
      }
    };

    connectSocket();
    const unsubscribeEmployees = subscribeToEvent('employees:updated', fetchIncentives);
    const unsubscribeMappings = subscribeToEvent('mappings:updated', fetchIncentives);
    const unsubscribeClients = subscribeToEvent('clients:updated', fetchIncentives);
    const unsubscribeTrades = subscribeToEvent('trades:updated', fetchIncentives);

    fetchIncentives();

    return () => {
      unsubscribeEmployees();
      unsubscribeMappings();
      unsubscribeClients();
      unsubscribeTrades();
    };
  }, []);

  return (
    <div className="w-100">
      <div className="page-header">
        <h1 className="page-title">Incentives</h1>
        <div className="record-badge">{incentives.length} Employees</div>
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
            <span className="spinner-text">Calculating incentives...</span>
          </div>
        ) : incentives.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <p>No incentive data available</p>
          </div>
        ) : (
          <div className="table-container table-responsive">
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Clients</th>
                  <th>Trades</th>
                  <th>Brokerage</th>
                  <th>Incentive (10%)</th>
                </tr>
              </thead>
              <tbody>
                {incentives.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <span className="badge bg-warning text-dark">{emp.employeeCode}</span>
                    </td>
                    <td>{emp.name}</td>
                    <td className="fw-bold text-info">{emp.assignedClients}</td>
                    <td className="fw-bold text-success">{emp.trades}</td>
                    <td className="fw-bold text-primary">₹{emp.totalBrokerage.toFixed(2)}</td>
                    <td className="fw-bold text-success">₹{emp.incentive.toFixed(2)}</td>
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

export default IncentivesPage;
