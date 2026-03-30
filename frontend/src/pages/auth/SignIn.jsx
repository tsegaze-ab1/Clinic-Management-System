import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IngredientAuthCard from '../../ingredients/IngredientAuthCard';
import { loginRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEMO_USERS = {
  'admin@clinic.local': {
    password: 'Admin@123',
    role: 'admin',
    user: { id: 'demo-admin', fullName: 'System Admin', email: 'admin@clinic.local', role: 'admin' }
  },
  'doctor@clinic.local': {
    password: 'Doctor@123',
    role: 'doctor',
    user: { id: 'demo-doctor', fullName: 'Dr. Demo User', email: 'doctor@clinic.local', role: 'doctor' }
  },
  'reception@clinic.local': {
    password: 'Reception@123',
    role: 'receptionist',
    user: { id: 'demo-reception', fullName: 'Reception Demo User', email: 'reception@clinic.local', role: 'receptionist' }
  },
  'patient@clinic.local': {
    password: 'Patient@123',
    role: 'patient',
    user: { id: 'demo-patient', fullName: 'Patient Demo User', email: 'patient@clinic.local', role: 'patient' }
  }
};

function parseAuthPayload(response) {
  const payload = response?.data && typeof response.data === 'object' ? response.data : response;
  const token = payload?.token || payload?.accessToken || payload?.jwt;
  const refreshToken = payload?.refreshToken || payload?.refresh || null;
  const user = payload?.user || payload?.profile || null;
  const role = user?.role || payload?.role || payload?.userRole || 'admin';

  return {
    token,
    refreshToken,
    user,
    role
  };
}

function getDemoAuth(email, password) {
  const account = DEMO_USERS[String(email || '').trim().toLowerCase()];
  if (!account) return null;
  if (account.password !== password) return null;

  return {
    token: `demo-token-${account.role}`,
    refreshToken: null,
    role: account.role,
    user: account.user
  };
}

export default function SignIn() {
  const { login, redirectPathForRole } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fields = useMemo(() => ([
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@clinic.com',
      value: form.email,
      required: true,
      onChange: (value) => setForm((prev) => ({ ...prev, email: value }))
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      value: form.password,
      required: true,
      onChange: (value) => setForm((prev) => ({ ...prev, password: value }))
    }
  ]), [form]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const data = await loginRequest(form);
      const auth = parseAuthPayload(data);
      if (!auth.token) {
        throw new Error('Login succeeded but token is missing in response');
      }

      login({
        token: auth.token,
        refreshToken: auth.refreshToken,
        role: auth.role,
        user: auth.user
      });
      navigate(redirectPathForRole(auth.role), { replace: true });
    } catch (err) {
      const looksLikeBackendUnavailable =
        err?.message?.includes('Failed to fetch')
        || err?.message?.includes('NetworkError')
        || err?.message?.includes('Load failed')
        || err?.message?.includes('CORS');

      if (looksLikeBackendUnavailable) {
        const demoAuth = getDemoAuth(form.email, form.password);
        if (demoAuth) {
          login(demoAuth);
          setInfo('Backend unavailable. Logged in with demo account.');
          navigate(redirectPathForRole(demoAuth.role), { replace: true });
          return;
        }

        setError('Invalid demo credentials for offline mode.');
        setInfo('Use one of: admin@clinic.local, doctor@clinic.local, reception@clinic.local, patient@clinic.local');
        return;
      }

      setError(err.message || 'Unable to sign in');
      setInfo('Use a valid backend JWT response with role in user payload to continue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IngredientAuthCard
      title="Clinic Login"
      subtitle="Secure access to your role dashboard"
      fields={fields}
      submitLabel="Login"
      loading={loading}
      error={error}
      info={info}
      onSubmit={onSubmit}
      footer={(
        <>
          <Link to="/auth/reset-password">Forgot password?</Link>
          <Link to="/auth/signup">Create account</Link>
        </>
      )}
    />
  );
}
