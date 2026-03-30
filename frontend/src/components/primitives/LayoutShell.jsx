import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { getSession } from '../../auth/sessionStore';
import RoleSidebar from '../navigation/RoleSidebar';
import Topbar from '../navigation/Topbar';
import Breadcrumbs from './Breadcrumbs';
import PageTransition from './PageTransition';
import ErrorBoundary from './ErrorBoundary';

export default function LayoutShell({ children }) {
  const session = getSession();

  return (
    <div className="layout-shell">
      <RoleSidebar role={session.role} />
      <main className="main-area">
        <Topbar user={session.user} />
        <Breadcrumbs />
        <ErrorBoundary>
          <PageTransition>{children || <Outlet />}</PageTransition>
        </ErrorBoundary>
      </main>
    </div>
  );
}

LayoutShell.propTypes = {
  children: PropTypes.node
};
