import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/internal/employees');
        setEmployees(response.data.data || []);
      } catch (err) {
        setError('Failed to load employees. Please try again.');
        console.error('Failed to fetch employees', err);
      } finally {
        setLoading(false);
      }
    };

    connectSocket();
    const unsubscribe = subscribeToEvent('employees:updated', fetchEmployees);

    fetchEmployees();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-100">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <div className="record-badge">{employees.length} Total</div>
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
            <span className="spinner-text">Loading employees...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p>No employees found</p>
          </div>
        ) : (
          <div className="table-container table-responsive">
            <table className="table data-table mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <span className="badge bg-warning text-dark">{employee.employeeCode}</span>
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
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

export default EmployeesPage;
