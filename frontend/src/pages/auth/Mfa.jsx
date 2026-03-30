import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../api/endpoints';
import { request } from '../../api/httpClient';
import { setSession } from '../../auth/sessionStore';

export default function Mfa() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await request({ method: 'POST', url: endpoints.auth.verifyMfa, body: { code } });
      setSession({ mfaVerified: true });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid code');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '8vh auto' }} className="page-card">
      <h3>Multi-Factor Authentication</h3>
      <form onSubmit={verify} className="grid">
        <label>
          <span>6-digit code</span>
          <input className="form-control" required pattern="[0-9]{6}" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
        </label>
        {error ? <small style={{ color: 'var(--color-error)' }}>{error}</small> : null}
        <button className="btn btn-primary">Verify</button>
      </form>
    </div>
  );
}
