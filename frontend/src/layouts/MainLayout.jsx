import Navbar from '../components/Navbar';
import './MainLayout.css';

function MainLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content py-4">
        <div className="container-fluid px-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
