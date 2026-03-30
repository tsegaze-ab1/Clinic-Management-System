import { useState } from 'react';
import { endpoints } from '../../api/endpoints';
import { request } from '../../api/httpClient';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('');
    await request({ method: 'POST', url: endpoints.auth.resetPassword, body: { email } });
    setStatus('Password reset instructions sent.');
  };

  return (
    <div style={{ maxWidth: 420, margin: '8vh auto' }} className="page-card">
      <h3>Reset Password</h3>
      <form onSubmit={submit} className="grid">
        <label>
          <span>Work Email</span>
          <input className="form-control" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn btn-primary">Send reset link</button>
      </form>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
