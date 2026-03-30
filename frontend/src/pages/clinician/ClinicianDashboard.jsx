import { useMemo, useState } from 'react';
import StatCard from '../../components/primitives/StatCard';
import FormSection from '../../components/primitives/FormSection';
import DataTable from '../../components/primitives/DataTable';
import { useAuth } from '../../context/AuthContext';
import {
  addPrescription,
  getPatientById,
  getPatientHistoryRows,
  listAppointmentsForDoctor,
  listPrescriptionsForDoctor
} from '../../data/rbacMockStore';
import { useToast } from '../../context/ToastContext';

export default function ClinicianDashboard() {
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [note, setNote] = useState({ diagnosis: '', medication: '' });

  const appointments = useMemo(() => listAppointmentsForDoctor(user?.id), [user?.id, tick]);
  const selectedPatient = useMemo(() => getPatientById(selectedPatientId), [selectedPatientId, tick]);
  const patientHistory = useMemo(() => getPatientHistoryRows(selectedPatientId), [selectedPatientId, tick]);
  const doctorPrescriptions = useMemo(() => listPrescriptionsForDoctor(user?.id), [user?.id, tick]);

  const submitPrescription = () => {
    if (!selectedPatientId || !note.diagnosis || !note.medication) return;
    addPrescription({
      patientId: selectedPatientId,
      doctorId: user?.id,
      doctorName: user?.fullName || user?.name || 'Doctor',
      diagnosis: note.diagnosis,
      medication: note.medication
    });
    setTick((prev) => prev + 1);
    setNote({ diagnosis: '', medication: '' });
    pushToast({ title: 'Prescription saved', message: 'Diagnosis and prescription added to patient record.', tone: 'success' });
  };

  return (
    <div className="grid">
      <h2>Doctor Dashboard</h2>
      <div className="grid kpis">
        <StatCard title="Assigned Appointments" value={appointments.length} trend={2} />
        <StatCard title="Selected Patient Events" value={patientHistory.length} trend={1} />
        <StatCard title="Prescriptions Added" value={doctorPrescriptions.length} trend={3} />
        <StatCard title="Today Queue" value={appointments.filter((item) => item.status === 'booked').length} trend={1} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Appointment ID' },
          { key: 'patientName', label: 'Patient' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' },
          { key: 'status', label: 'Status' }
        ]}
        rows={appointments}
        total={appointments.length}
        loading={false}
        onQueryChange={(q) => {
          if (q.search !== undefined) {
            const normalized = q.search.toLowerCase();
            const first = appointments.find((item) => item.patientName.toLowerCase().includes(normalized));
            setSelectedPatientId(first?.patientId || '');
          }
        }}
      />

      <div className="page-card">
        <h5>Patient Details</h5>
        {selectedPatient ? (
          <>
            <p>Name: {selectedPatient.fullName}</p>
            <p>Phone: {selectedPatient.phone}</p>
            <p>DOB: {selectedPatient.dob || 'N/A'}</p>
            <p>History: {selectedPatient.history}</p>
          </>
        ) : (
          <p>Search appointments to pick a patient and view details/history.</p>
        )}
      </div>

      <DataTable
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date' },
          { key: 'detail', label: 'Detail' }
        ]}
        rows={patientHistory}
        total={patientHistory.length}
        loading={false}
        onQueryChange={() => {}}
      />

      <FormSection title="Add Diagnosis and Prescription" hint="Doctor can append diagnosis and prescription to selected patient.">
        <textarea className="form-control" rows={3} placeholder="Diagnosis" value={note.diagnosis} onChange={(e) => setNote({ ...note, diagnosis: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Prescription" value={note.medication} onChange={(e) => setNote({ ...note, medication: e.target.value })} />
        <button className="btn btn-primary" onClick={submitPrescription}>Save Diagnosis & Prescription</button>
      </FormSection>
    </div>
  );
}
