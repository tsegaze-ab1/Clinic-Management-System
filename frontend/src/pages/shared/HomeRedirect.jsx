import { Navigate } from 'react-router-dom';
import { ROLES } from '../../auth/sessionStore';
import { useAuth } from '../../context/AuthContext';

export default function HomeRedirect() {
  const { role } = useAuth();
  if (role === ROLES.RECEPTIONIST) return <Navigate to="/reception" replace />;
  if (role === ROLES.DOCTOR) return <Navigate to="/doctor" replace />;
  if (role === ROLES.PATIENT) return <Navigate to="/patient" replace />;
  return <Navigate to="/admin" replace />;
}
