import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { can } from '../../auth/permissions';

const navConfig = [
  { to: '/admin', label: 'Admin Dashboard', permission: 'dashboard:admin' },
  { to: '/reception', label: 'Receptionist Dashboard', permission: 'dashboard:receptionist' },
  { to: '/doctor', label: 'Doctor Dashboard', permission: 'dashboard:doctor' },
  { to: '/patient', label: 'Patient Portal', permission: 'dashboard:patient' },
  { to: '/users', label: 'User Management', permission: 'users:read' },
  { to: '/scheduling', label: 'Scheduling', permission: 'appointments:read' },
  { to: '/encounters', label: 'Encounters', permission: 'encounters:read' },
  { to: '/billing', label: 'Billing & Payments', permission: 'billing:read' },
  { to: '/inventory', label: 'Inventory', permission: 'inventory:read' },
  { to: '/messaging', label: 'Messaging', permission: 'messages:read' },
  { to: '/settings', label: 'Settings', permission: 'settings:read' }
];

export default function RoleSidebar({ role }) {
  return (
    <aside className="sidebar">
      <div className="brand">Northline Care OS</div>
      <nav aria-label="role aware navigation">
        {navConfig
          .filter((item) => can(role, item.permission))
          .map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}

RoleSidebar.propTypes = {
  role: PropTypes.string.isRequired
};
