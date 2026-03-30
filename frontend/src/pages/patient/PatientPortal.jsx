import { useMemo } from 'react';
import DataTable from '../../components/primitives/DataTable';
import {
  getPatientByEmail,
  getPatientById,
  listAppointmentsForPatient,
  listPrescriptionsForPatient
} from '../../data/rbacMockStore';
import { useAuth } from '../../context/AuthContext';

export default function PatientPortal() {
  const { user } = useAuth();

  const linkedPatient = useMemo(() => {
    return getPatientByEmail(user?.email);
  }, [user?.email]);

  const fallbackPatient = useMemo(() => {
    if (linkedPatient) return linkedPatient;
    return getPatientById('p-1001');
  }, [linkedPatient]);

  const appointments = useMemo(() => listAppointmentsForPatient(fallbackPatient?.id), [fallbackPatient?.id]);
  const prescriptions = useMemo(() => listPrescriptionsForPatient(fallbackPatient?.id), [fallbackPatient?.id]);

  return (
    <div className="grid">
      <h2>Patient Portal</h2>

      <div className="page-card">
        <h5>My Profile</h5>
        <p>Name: {fallbackPatient?.fullName || user?.fullName || user?.name || 'Patient'}</p>
        <p>Phone: {fallbackPatient?.phone || 'N/A'}</p>
        <p>DOB: {fallbackPatient?.dob || 'N/A'}</p>
        <p>History: {fallbackPatient?.history || 'No history available'}</p>
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
        loading={false}
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
        loading={false}
        onQueryChange={() => {}}
      />
    </div>
  );
}
