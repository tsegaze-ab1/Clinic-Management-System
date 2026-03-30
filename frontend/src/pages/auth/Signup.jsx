import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IngredientAuthCard from '../../ingredients/IngredientAuthCard';
import { registerRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login, redirectPathForRole } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const fields = useMemo(() => ([
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      value: form.name,
      required: true,
      onChange: (value) => setForm((prev) => ({ ...prev, name: value }))
    },
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
      placeholder: 'Create a password',
      value: form.password,
      required: true,
      onChange: (value) => setForm((prev) => ({ ...prev, password: value }))
    },
    {
      name: 'role',
      label: 'Role (optional)',
      type: 'select',
      value: form.role,
      required: false,
      options: [
        { label: 'Patient', value: 'patient' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Admin', value: 'admin' }
      ],
      onChange: (value) => setForm((prev) => ({ ...prev, role: value }))
    }
  ]), [form]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const data = await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      const createdUser = data?.data || data?.user;
      const role = createdUser?.role || form.role || 'patient';
      login({
        token: data?.token || null,
        refreshToken: data?.refreshToken || null,
        role,
        user: createdUser
          ? {
              id: createdUser.id,
              fullName: createdUser.name || form.name,
              name: createdUser.name || form.name,
              email: createdUser.email || form.email,
              role: createdUser.role || role,
              phone: createdUser.phone || ''
            }
          : { fullName: form.name, name: form.name, email: form.email, role }
      });
      navigate(redirectPathForRole(role), { replace: true });
    } catch (err) {
      setInfo('Live registration endpoint is not reachable. You can still use Sign In for local demo roles.');
      setError(err.message || 'Unable to complete sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IngredientAuthCard
      title="Create Clinic Account"
      subtitle="Register and continue to your role dashboard."
      fields={fields}
      submitLabel="Sign Up"
      loading={loading}
      info={info}
      error={error}
      onSubmit={onSubmit}
      footer={<Link to="/auth/sign-in">Already have an account? Sign in</Link>}
    />
  );
}
