import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ user }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    pushToast({ title: 'Signed out', message: 'Your session has ended.', tone: 'info' });
    navigate('/auth/sign-in');
  };

  return (
    <header className="topbar">
      <input
        className="form-control"
        style={{ maxWidth: 320 }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search patients, appointments, invoices"
        aria-label="global search"
      />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <span>{user?.fullName || user?.email || 'User'}</span>
        <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  user: PropTypes.shape({ fullName: PropTypes.string, email: PropTypes.string })
};
