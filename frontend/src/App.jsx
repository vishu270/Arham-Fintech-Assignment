import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ClientsPage from './pages/ClientsPage';
import TradesPage from './pages/TradesPage';
import MyClientsPage from './pages/MyClientsPage';
import EmployeesPage from './pages/EmployeesPage';
import IncentivesPage from './pages/IncentivesPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<ClientsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/trades" element={<TradesPage />} />
        <Route path="/my-clients" element={<MyClientsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/incentives" element={<IncentivesPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
