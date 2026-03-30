import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/primitives/StatCard';
import FormSection from '../../components/primitives/FormSection';
import DataTable from '../../components/primitives/DataTable';
import {
  getAppointmentsApi,
  getPatientApi,
  updateAppointmentDiagnosisApi
} from '../../services/clinicApiService';
import { useToast } from '../../context/ToastContext';

export default function ClinicianDashboard() {
  const { pushToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({ diagnosis: '', medication: '' });

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const rows = await getAppointmentsApi();
      setAppointments(rows);
    } catch (error) {
      pushToast({ title: 'Load failed', message: error.message || 'Unable to load appointments', tone: 'warn' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const patientHistory = useMemo(() => {
    if (!selectedPatient?.id) return [];

    return appointments
      .filter((appointment) => appointment.patientId === selectedPatient.id)
      .flatMap((appointment) => {
        const rows = [
          {
            id: `${appointment.id}-status`,
            type: 'Appointment',
            date: `${appointment.date} ${appointment.time}`,
            detail: `Status: ${appointment.status}`
          }
        ];

        if (appointment.diagnosis) {
          rows.push({
            id: `${appointment.id}-diagnosis`,
            type: 'Diagnosis',
            date: appointment.date,
            detail: appointment.diagnosis
          });
        }

        if (appointment.prescription) {
          rows.push({
            id: `${appointment.id}-prescription`,
            type: 'Prescription',
            date: appointment.date,
            detail: appointment.prescription
          });
        }

        return rows;
      });
  }, [appointments, selectedPatient?.id]);

  const doctorPrescriptions = useMemo(() => {
    return appointments.filter((item) => item.diagnosis || item.prescription);
  }, [appointments]);

  const submitPrescription = async () => {
    if (!selectedAppointmentId || !note.diagnosis || !note.medication) return;

    try {
      await updateAppointmentDiagnosisApi(selectedAppointmentId, {
        diagnosis: note.diagnosis,
        prescription: note.medication,
        status: 'completed'
      });
      await loadAppointments();
      setNote({ diagnosis: '', medication: '' });
      pushToast({ title: 'Prescription saved', message: 'Diagnosis and prescription added to patient record.', tone: 'success' });
    } catch (error) {
      pushToast({ title: 'Save failed', message: error.message || 'Unable to update diagnosis', tone: 'warn' });
    }
  };

  const queueToday = appointments.filter((item) => item.status === 'booked' || item.status === 'scheduled').length;

  return (
    <div className="grid">
      <h2>Doctor Dashboard</h2>
      {loading ? <p>Loading appointments...</p> : null}
      <div className="grid kpis">
        <StatCard title="Assigned Appointments" value={appointments.length} trend={2} />
        <StatCard title="Selected Patient Events" value={patientHistory.length} trend={1} />
        <StatCard title="Prescriptions Added" value={doctorPrescriptions.length} trend={3} />
        <StatCard title="Today Queue" value={queueToday} trend={1} />
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
        loading={loading}
        onQueryChange={async (q) => {
          if (q.search !== undefined) {
            const normalized = q.search.toLowerCase().trim();
            const first = appointments.find((item) => String(item.patientName || '').toLowerCase().includes(normalized));
            setSelectedAppointmentId(first?.id || '');

            if (first?.patientId) {
              try {
                const patient = await getPatientApi(first.patientId);
                setSelectedPatient(patient);
              } catch {
                setSelectedPatient(null);
              }
            }
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
        loading={loading}
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
