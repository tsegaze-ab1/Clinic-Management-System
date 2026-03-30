import { createContext, useContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { clearSession, getSession, normalizeRole, setSession } from '../auth/sessionStore';

const AuthContext = createContext(null);

function redirectPathForRole(role) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'doctor') return '/doctor';
  if (normalizedRole === 'receptionist') return '/reception';
  if (normalizedRole === 'patient') return '/patient';
  return '/admin';
}

export function AuthProvider({ children }) {
  const [session, setSessionState] = useReducer((_, next) => next, getSession());

  const login = (payload) => {
    const next = setSession({
      token: payload.token,
      refreshToken: payload.refreshToken || null,
      role: payload.role,
      user: payload.user || null,
      mfaVerified: true
    });
    setSessionState(next);
    return next;
  };

  const logout = () => {
    clearSession();
    setSessionState(getSession());
  };

  const value = useMemo(() => {
    return {
      session,
      isAuthenticated: Boolean(session.token),
      role: session.role,
      user: session.user,
      login,
      logout,
      redirectPathForRole
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { redirectPathForRole };
