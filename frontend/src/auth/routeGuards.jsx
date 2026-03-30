import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { can } from './permissions';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />;
  }
  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

export function PermissionRoute({ permission, children }) {
  const { role } = useAuth();
  if (!can(role, permission)) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  return children;
}

PermissionRoute.propTypes = {
  permission: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
