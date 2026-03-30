import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/primitives/StatCard';
import DataTable from '../../components/primitives/DataTable';
import FormSection from '../../components/primitives/FormSection';
import IngredientSortableTable from '../../ingredients/IngredientSortableTable';
import {
  createAppointmentApi,
  createPatientApi,
  getAppointmentsApi,
  getPatientsApi,
  getUsersApi
} from '../../services/clinicApiService';
import { useToast } from '../../context/ToastContext';

export default function StaffDashboard() {
  const { pushToast } = useToast();
  const [patientDraft, setPatientDraft] = useState({ fullName: '', phone: '', dob: '', email: '', history: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [bookingDraft, setBookingDraft] = useState({ patientId: '', doctorId: '', date: '', time: '', status: 'booked' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async (search = '') => {
    setLoading(true);
    try {
      const [patientsList, appointmentsList, users] = await Promise.all([
        getPatientsApi(search),
        getAppointmentsApi(),
        getUsersApi()
      ]);

      const doctorsOnly = users.filter((user) => user.role === 'doctor');
      const doctorMap = new Map(doctorsOnly.map((doctor) => [doctor.id, doctor.fullName]));
      const patientMap = new Map(patientsList.map((patient) => [patient.id, patient.fullName]));

      setPatients(patientsList);
      setDoctors(doctorsOnly);
      setAppointments(
        appointmentsList.map((appointment) => ({
          ...appointment,
          patientName: appointment.patientName || patientMap.get(appointment.patientId) || appointment.patientId,
          doctorName: appointment.doctorName || doctorMap.get(appointment.doctorId) || appointment.doctorId
        }))
      );
    } catch (error) {
      pushToast({ title: 'Dashboard load failed', message: error.message || 'Unable to load receptionist dashboard', tone: 'warn' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData('');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadDashboardData(searchTerm);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const selectedHistory = useMemo(() => {
    if (!selectedPatientId) return [];

    return appointments
      .filter((appointment) => appointment.patientId === selectedPatientId)
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
  }, [appointments, selectedPatientId]);

  const registerPatient = async () => {
    if (!patientDraft.fullName || !patientDraft.phone) return;
    try {
      const created = await createPatientApi(patientDraft);
      setSelectedPatientId(created.id);
      setBookingDraft((prev) => ({ ...prev, patientId: created.id }));
      setPatientDraft({ fullName: '', phone: '', dob: '', email: '', history: '' });
      await loadDashboardData(searchTerm);
      pushToast({ title: 'Patient registered', message: `${created.fullName} added successfully.`, tone: 'success' });
    } catch (error) {
      pushToast({ title: 'Registration failed', message: error.message || 'Unable to register patient', tone: 'warn' });
    }
  };

  const bookAppointment = async () => {
    if (!bookingDraft.patientId || !bookingDraft.doctorId || !bookingDraft.date || !bookingDraft.time) return;
    try {
      await createAppointmentApi(bookingDraft);
      await loadDashboardData(searchTerm);
      pushToast({ title: 'Appointment booked', message: 'Patient and doctor linked with date/time and status.', tone: 'success' });
    } catch (error) {
      pushToast({ title: 'Booking failed', message: error.message || 'Unable to create appointment', tone: 'warn' });
    }
  };

  return (
    <div className="grid">
      <h2>Receptionist Dashboard</h2>
      <div className="page-card">
        <h5>Patient Search</h5>
        <input
          className="form-control"
          placeholder="Search patient by name, phone, or history"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            const first = patients[0];
            setSelectedPatientId(first?.id || '');
            setBookingDraft((prev) => ({ ...prev, patientId: first?.id || '' }));
          }}
        />
      </div>
      <div className="grid kpis">
        <StatCard title="Registered Patients" value={patients.length} trend={3} />
        <StatCard title="Booked Appointments" value={appointments.length} trend={2} />
        <StatCard title="Doctors Available" value={doctors.length} trend={1} />
        <StatCard title="Search Matches" value={patients.length} trend={0} />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'Patient ID' },
          { key: 'fullName', label: 'Patient Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'dob', label: 'DOB' },
          { key: 'history', label: 'History' }
        ]}
        rows={patients}
        total={patients.length}
        loading={loading}
        onQueryChange={(q) => {
          if (q.search !== undefined) {
            setSearchTerm(q.search);
            const first = patients[0];
            setSelectedPatientId(first?.id || '');
            setBookingDraft((prev) => ({ ...prev, patientId: first?.id || '' }));
          }
        }}
      />

      <DataTable
        columns={[
          { key: 'id', label: 'Appointment ID' },
          { key: 'patientName', label: 'Patient' },
          { key: 'doctorName', label: 'Doctor' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' },
          { key: 'status', label: 'Status' }
        ]}
        rows={appointments}
        total={appointments.length}
        loading={loading}
        onQueryChange={() => {}}
      />

      <FormSection title="Register New Patient" hint="Receptionist can create patient records using CRUD-ready fields.">
        <input className="form-control" placeholder="Full name" value={patientDraft.fullName} onChange={(e) => setPatientDraft({ ...patientDraft, fullName: e.target.value })} />
        <input className="form-control" placeholder="Phone number" value={patientDraft.phone} onChange={(e) => setPatientDraft({ ...patientDraft, phone: e.target.value })} />
        <input className="form-control" type="date" value={patientDraft.dob} onChange={(e) => setPatientDraft({ ...patientDraft, dob: e.target.value })} />
        <input className="form-control" placeholder="Email" value={patientDraft.email} onChange={(e) => setPatientDraft({ ...patientDraft, email: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Initial history" value={patientDraft.history} onChange={(e) => setPatientDraft({ ...patientDraft, history: e.target.value })} />
        <button className="btn btn-primary" onClick={registerPatient}>Register Patient</button>
      </FormSection>

      <FormSection title="Book Appointment" hint="Creates appointment linked to patient and doctor with date, time, and status.">
        <select className="form-select" value={bookingDraft.patientId} onChange={(e) => setBookingDraft({ ...bookingDraft, patientId: e.target.value })}>
          <option value="">Select patient</option>
          {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName}</option>)}
        </select>
        <select className="form-select" value={bookingDraft.doctorId} onChange={(e) => setBookingDraft({ ...bookingDraft, doctorId: e.target.value })}>
          <option value="">Select doctor</option>
          {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.fullName}</option>)}
        </select>
        <input className="form-control" type="date" value={bookingDraft.date} onChange={(e) => setBookingDraft({ ...bookingDraft, date: e.target.value })} />
        <input className="form-control" type="time" value={bookingDraft.time} onChange={(e) => setBookingDraft({ ...bookingDraft, time: e.target.value })} />
        <select className="form-select" value={bookingDraft.status} onChange={(e) => setBookingDraft({ ...bookingDraft, status: e.target.value })}>
          <option value="booked">booked</option>
          <option value="checked_in">checked_in</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <button className="btn btn-primary" onClick={bookAppointment}>Create Appointment</button>
      </FormSection>

      <DataTable
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date' },
          { key: 'detail', label: 'Detail' }
        ]}
        rows={selectedHistory}
        total={selectedHistory.length}
        loading={false}
        onQueryChange={() => {}}
      />

      <IngredientSortableTable
        title="Patient History (Ingredient Table)"
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date' },
          { key: 'detail', label: 'Detail' }
        ]}
        rows={selectedHistory}
        emptyMessage="Select a patient to view history"
      />

      <div className="page-card">
        <h5>Firestore Query Plan</h5>
        <p>Fast prefix search uses /patients/search endpoint with indexed full-name and phone normalization.</p>
      </div>
    </div>
  );
}
