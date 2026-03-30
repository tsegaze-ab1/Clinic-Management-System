import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { ProtectedRoute, PermissionRoute } from '../auth/routeGuards';
import SignIn from '../pages/auth/SignIn';
import Signup from '../pages/auth/Signup';
import Mfa from '../pages/auth/Mfa';
import ResetPassword from '../pages/auth/ResetPassword';
import Onboarding from '../pages/auth/Onboarding';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import ReceptionistDashboard from '../pages/staff/StaffDashboard';
import DoctorDashboard from '../pages/clinician/ClinicianDashboard';
import PatientPortal from '../pages/patient/PatientPortal';
import Scheduling from '../pages/shared/Scheduling';
import Encounters from '../pages/shared/Encounters';
import BillingPayments from '../pages/shared/BillingPayments';
import Inventory from '../pages/shared/Inventory';
import Messaging from '../pages/shared/Messaging';
import Settings from '../pages/shared/Settings';
import NotAuthorized from '../pages/shared/NotAuthorized';
import NotFound from '../pages/shared/NotFound';
import HomeRedirect from '../pages/shared/HomeRedirect';
import LandingHome from '../pages/marketing/LandingHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingHome />
  },
  {
    path: '/login',
    element: <Navigate to="/auth/sign-in" replace />
  },
  {
    path: '/signup',
    element: <Navigate to="/auth/signup" replace />
  },
  {
    path: '/auth/sign-in',
    element: <SignIn />
  },
  {
    path: '/auth/signup',
    element: <Signup />
  },
  {
    path: '/auth/mfa',
    element: <Mfa />
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/auth/onboarding',
    element: <Onboarding />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <HomeRedirect /> },
      {
        path: 'admin',
        element: (
          <PermissionRoute permission="dashboard:admin">
            <AdminDashboard />
          </PermissionRoute>
        )
      },
      {
        path: 'receptionist',
        element: (
          <PermissionRoute permission="dashboard:receptionist">
            <ReceptionistDashboard />
          </PermissionRoute>
        )
      },
      {
        path: 'reception',
        element: (
          <PermissionRoute permission="dashboard:receptionist">
            <ReceptionistDashboard />
          </PermissionRoute>
        )
      },
      {
        path: 'doctor',
        element: (
          <PermissionRoute permission="dashboard:doctor">
            <DoctorDashboard />
          </PermissionRoute>
        )
      },
      { path: 'staff', element: <Navigate to="/receptionist" replace /> },
      { path: 'clinician', element: <Navigate to="/doctor" replace /> },
      {
        path: 'patient',
        element: (
          <PermissionRoute permission="dashboard:patient">
            <PatientPortal />
          </PermissionRoute>
        )
      },
      {
        path: 'users',
        element: (
          <PermissionRoute permission="users:read">
            <UserManagement />
          </PermissionRoute>
        )
      },
      {
        path: 'scheduling',
        element: (
          <PermissionRoute permission="appointments:read">
            <Scheduling />
          </PermissionRoute>
        )
      },
      {
        path: 'encounters',
        element: (
          <PermissionRoute permission="encounters:read">
            <Encounters />
          </PermissionRoute>
        )
      },
      {
        path: 'billing',
        element: (
          <PermissionRoute permission="billing:read">
            <BillingPayments />
          </PermissionRoute>
        )
      },
      {
        path: 'inventory',
        element: (
          <PermissionRoute permission="inventory:read">
            <Inventory />
          </PermissionRoute>
        )
      },
      {
        path: 'messaging',
        element: (
          <PermissionRoute permission="messages:read">
            <Messaging />
          </PermissionRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <PermissionRoute permission="settings:read">
            <Settings />
          </PermissionRoute>
        )
      },
      { path: 'not-authorized', element: <NotAuthorized /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

export default router;
