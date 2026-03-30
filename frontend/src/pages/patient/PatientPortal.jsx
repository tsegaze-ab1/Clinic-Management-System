import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/primitives/DataTable';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentsApi } from '../../services/clinicApiService';
import { useToast } from '../../context/ToastContext';

export default function PatientPortal() {
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const rows = await getAppointmentsApi();
        if (mounted) setAppointments(rows);
      } catch (error) {
        pushToast({ title: 'Load failed', message: error.message || 'Unable to load patient appointments', tone: 'warn' });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [pushToast]);

  const prescriptions = useMemo(() => {
    return appointments
      .filter((appointment) => appointment.diagnosis || appointment.prescription)
      .map((appointment) => ({
        id: `${appointment.id}-rx`,
        doctorName: appointment.doctorName,
        diagnosis: appointment.diagnosis || '-',
        medication: appointment.prescription || '-',
        createdAt: appointment.date || '-'
      }));
  }, [appointments]);

  return (
    <div className="grid">
      <h2>Patient Portal</h2>
      {loading ? <p>Loading portal...</p> : null}

      <div className="page-card">
        <h5>My Profile</h5>
        <p>Name: {user?.fullName || user?.name || 'Patient'}</p>
        <p>Phone: {user?.phone || 'N/A'}</p>
        <p>Email: {user?.email || 'N/A'}</p>
        <p>History: {prescriptions.length ? 'Diagnosis and prescriptions are listed below.' : 'No history available'}</p>
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Appointment ID' },
          { key: 'doctorName', label: 'Doctor' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' },
          { key: 'status', label: 'Status' },
        ]}
        rows={appointments}
        total={appointments.length}
        loading={loading}
        onQueryChange={() => {}}
      />

      <DataTable
        columns={[
          { key: 'doctorName', label: 'Doctor' },
          { key: 'diagnosis', label: 'Diagnosis' },
          { key: 'medication', label: 'Prescription' },
          { key: 'createdAt', label: 'Issued At' }
        ]}
        rows={prescriptions}
        total={prescriptions.length}
        loading={loading}
        onQueryChange={() => {}}
      />
    </div>
  );
}
