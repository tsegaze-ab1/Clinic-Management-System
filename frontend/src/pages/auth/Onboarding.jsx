import { useState } from 'react';
import FormSection from '../../components/primitives/FormSection';
import { cmsApi } from '../../api/clinicApi';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [clinic, setClinic] = useState({ name: '', timezone: '', phone: '' });
  const [provider, setProvider] = useState({ fullName: '', specialty: '', npi: '' });

  const complete = async () => {
    await cmsApi.createEntity(cmsApi.endpoints.clinics, clinic);
    await cmsApi.createEntity(cmsApi.endpoints.providers, provider);
    setStep(3);
  };

  return (
    <div style={{ maxWidth: 840, margin: '4vh auto' }} className="grid">
      <h3>Organization Onboarding</h3>
      {step === 1 ? (
        <FormSection title="Step 1: Clinic Setup" hint="SSO metadata can be attached in Settings > Integrations.">
          <input className="form-control" placeholder="Clinic name" value={clinic.name} onChange={(e) => setClinic({ ...clinic, name: e.target.value })} />
          <input className="form-control" placeholder="Timezone" value={clinic.timezone} onChange={(e) => setClinic({ ...clinic, timezone: e.target.value })} />
          <input className="form-control" placeholder="Phone (+1 000-000-0000)" value={clinic.phone} onChange={(e) => setClinic({ ...clinic, phone: e.target.value })} />
          <button className="btn btn-primary" onClick={() => setStep(2)}>Continue</button>
        </FormSection>
      ) : null}
      {step === 2 ? (
        <FormSection title="Step 2: Primary Provider" hint="NPI format validation should be tightened once backend regex is available.">
          <input className="form-control" placeholder="Full name" value={provider.fullName} onChange={(e) => setProvider({ ...provider, fullName: e.target.value })} />
          <input className="form-control" placeholder="Specialty" value={provider.specialty} onChange={(e) => setProvider({ ...provider, specialty: e.target.value })} />
          <input className="form-control" placeholder="NPI" value={provider.npi} onChange={(e) => setProvider({ ...provider, npi: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
          <button className="btn btn-primary" onClick={complete}>Finish setup</button>
        </FormSection>
      ) : null}
      {step === 3 ? <div className="page-card"><h5>Setup complete</h5><p>Your clinic workspace is ready.</p></div> : null}
    </div>
  );
}
