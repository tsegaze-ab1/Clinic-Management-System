import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleSidebar from '../components/navigation/RoleSidebar';
import Topbar from '../components/navigation/Topbar';
import Breadcrumbs from '../components/primitives/Breadcrumbs';
import PageTransition from '../components/primitives/PageTransition';
import ErrorBoundary from '../components/primitives/ErrorBoundary';
import dashboardImage from '../../ingrident/backg.png';

export default function DashboardLayout({ children }) {
  const { role, user } = useAuth();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-bg-layer" aria-hidden="true">
        <img src={dashboardImage} alt="" className="dashboard-bg-image" />
        <video className="dashboard-bg-video" autoPlay muted loop playsInline poster={dashboardImage}>
          <source src="/ingrident/dashboard.mp4" type="video/mp4" />
          <source src="/ingrident/background.mp4" type="video/mp4" />
        </video>
        <div className="dashboard-bg-overlay" />
      </div>

      <div className="layout-shell">
        <RoleSidebar role={role} />
        <main className="main-area">
          <Topbar user={user} />
          <Breadcrumbs />
          <ErrorBoundary>
            <PageTransition>{children || <Outlet />}</PageTransition>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node
};
