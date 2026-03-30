import { useState } from 'react';
import { cmsApi } from '../../api/clinicApi';
import FormSection from '../../components/primitives/FormSection';
import DataTable from '../../components/primitives/DataTable';
import Tag from '../../components/primitives/Tag';

const viewModes = ['day', 'week', 'month'];

export default function Scheduling() {
  const [view, setView] = useState('week');
  const [query, setQuery] = useState({ view: 'week' });
  const [slotTemplate, setSlotTemplate] = useState({ name: '', durationMinutes: 20, providerId: '' });
  const appointments = cmsApi.useCollection(cmsApi.endpoints.appointments, query);

  return (
    <div className="grid">
      <h2>Scheduling</h2>
      <div className="page-card" style={{ display: 'flex', gap: 8 }}>
        {viewModes.map((mode) => (
          <button
            key={mode}
            className={`btn btn-sm ${view === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => {
              setView(mode);
              setQuery({ ...query, view: mode });
            }}
          >
            {mode.toUpperCase()}
          </button>
        ))}
        <Tag tone="warn">Conflict warnings enabled</Tag>
      </div>

      <DataTable
        columns={[
          { key: 'startAt', label: 'Start' },
          { key: 'patientName', label: 'Patient' },
          { key: 'providerName', label: 'Provider' },
          { key: 'status', label: 'Status' }
        ]}
        rows={appointments.data?.items || []}
        total={appointments.data?.total || 0}
        loading={appointments.isLoading}
        onQueryChange={setQuery}
      />

      <FormSection title="Slot Templates" hint="Drag-and-drop calendar lane updates should call backend lock endpoint to prevent race conditions.">
        <input className="form-control" placeholder="Template name" value={slotTemplate.name} onChange={(e) => setSlotTemplate({ ...slotTemplate, name: e.target.value })} />
        <input className="form-control" type="number" min={5} value={slotTemplate.durationMinutes} onChange={(e) => setSlotTemplate({ ...slotTemplate, durationMinutes: Number(e.target.value) })} />
        <input className="form-control" placeholder="Provider ID" value={slotTemplate.providerId} onChange={(e) => setSlotTemplate({ ...slotTemplate, providerId: e.target.value })} />
        <button className="btn btn-primary" onClick={() => cmsApi.createEntity(`${cmsApi.endpoints.appointments}/slot-templates`, slotTemplate)}>Save template</button>
      </FormSection>
    </div>
  );
}
