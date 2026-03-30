import { useState } from 'react';
import { cmsApi } from '../../api/clinicApi';
import FormSection from '../../components/primitives/FormSection';
import Timeline from '../../components/primitives/Timeline';

export default function Encounters() {
  const [draft, setDraft] = useState({ patientId: '', subjective: '', objective: '', assessment: '', plan: '' });
  const encounters = cmsApi.useCollection(cmsApi.endpoints.encounters, { page: 1, pageSize: 20 });

  return (
    <div className="grid">
      <h2>Encounters & Charting</h2>
      <div className="page-card">
        <h5>Patient Summary Header</h5>
        <p>Patient identity, allergies, active meds, and problem list should be fetched from patient/encounter composite endpoint.</p>
      </div>

      <FormSection title="SOAP Notes + Orders + Attachments + e-sign" hint="File upload uses multipart and progress callbacks.">
        <input className="form-control" placeholder="Patient ID" value={draft.patientId} onChange={(e) => setDraft({ ...draft, patientId: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Subjective" value={draft.subjective} onChange={(e) => setDraft({ ...draft, subjective: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Objective" value={draft.objective} onChange={(e) => setDraft({ ...draft, objective: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Assessment" value={draft.assessment} onChange={(e) => setDraft({ ...draft, assessment: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Plan" value={draft.plan} onChange={(e) => setDraft({ ...draft, plan: e.target.value })} />
        <input className="form-control" type="file" aria-label="attachments" />
        <button className="btn btn-primary" onClick={() => cmsApi.createEntity(cmsApi.endpoints.encounters, draft)}>Save encounter</button>
      </FormSection>

      <Timeline
        items={(encounters.data?.items || []).slice(0, 10).map((item) => ({
          title: item.patientName || 'Encounter',
          detail: item.status || 'Draft',
          at: item.updatedAt || '--'
        }))}
      />
    </div>
  );
}
