import { useState } from 'react';
import { getSession, setSession } from '../../auth/sessionStore';
import FormSection from '../../components/primitives/FormSection';
import Tag from '../../components/primitives/Tag';

export default function Settings() {
  const session = getSession();
  const [profile, setProfile] = useState({
    fullName: session.user?.fullName || '',
    phone: session.user?.phone || ''
  });

  const [theme, setTheme] = useState('light');

  return (
    <div className="grid">
      <h2>Settings</h2>
      <FormSection title="Profile" hint="Phone mask and validation should align with backend locale rules.">
        <input className="form-control" placeholder="Full name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
        <input className="form-control" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
        <button className="btn btn-primary" onClick={() => setSession({ user: { ...(session.user || {}), ...profile } })}>Save profile</button>
      </FormSection>

      <FormSection title="Clinic Settings" hint="Timezone, claim IDs, and encounter defaults.">
        <input className="form-control" placeholder="Clinic display name" />
        <input className="form-control" placeholder="Default timezone" />
        <button className="btn btn-outline-secondary">Save clinic settings</button>
      </FormSection>

      <FormSection title="Integrations" hint="EHR/LIS/PACS + SSO metadata endpoints.">
        <input className="form-control" placeholder="EHR endpoint" />
        <input className="form-control" placeholder="LIS endpoint" />
        <input className="form-control" placeholder="PACS endpoint" />
        <button className="btn btn-outline-secondary">Validate connections</button>
      </FormSection>

      <FormSection title="Theming" hint="Light/dark preference can be persisted per-user backend setting.">
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTheme('light')}>Light</button>
          <button className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTheme('dark')}>Dark</button>
          <Tag tone="info">Current: {theme}</Tag>
        </div>
      </FormSection>
    </div>
  );
}
