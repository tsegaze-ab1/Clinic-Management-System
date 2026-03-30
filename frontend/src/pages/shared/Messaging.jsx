import { useState } from 'react';
import { cmsApi } from '../../api/clinicApi';
import DataTable from '../../components/primitives/DataTable';
import FormSection from '../../components/primitives/FormSection';

export default function Messaging() {
  const [query, setQuery] = useState({ page: 1, pageSize: 20 });
  const [composer, setComposer] = useState({ to: '', template: 'follow_up', body: '' });
  const inbox = cmsApi.useCollection(cmsApi.endpoints.messages, query);
  const notifications = cmsApi.useCollection(cmsApi.endpoints.notifications, { page: 1, pageSize: 8 });

  return (
    <div className="grid">
      <h2>Messaging & Notifications</h2>

      <DataTable
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'fromName', label: 'From' },
          { key: 'createdAt', label: 'Received' }
        ]}
        rows={inbox.data?.items || []}
        total={inbox.data?.total || 0}
        loading={inbox.isLoading}
        onQueryChange={setQuery}
      />

      <FormSection title="Composer" hint="Templates prefill body and variables from backend.">
        <input className="form-control" placeholder="To user/patient ID" value={composer.to} onChange={(e) => setComposer({ ...composer, to: e.target.value })} />
        <select className="form-select" value={composer.template} onChange={(e) => setComposer({ ...composer, template: e.target.value })}>
          <option value="follow_up">Follow-up Reminder</option>
          <option value="lab_ready">Lab Results Ready</option>
          <option value="payment_due">Payment Due</option>
        </select>
        <textarea className="form-control" rows={4} value={composer.body} onChange={(e) => setComposer({ ...composer, body: e.target.value })} placeholder="Message body" />
        <button className="btn btn-primary" onClick={() => cmsApi.createEntity(cmsApi.endpoints.messages, composer)}>Send</button>
      </FormSection>

      <div className="page-card">
        <h5>Notification Center</h5>
        <ul>
          {(notifications.data?.items || []).map((n) => (
            <li key={n.id}>{n.createdAt}: {n.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
