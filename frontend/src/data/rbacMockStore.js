const KEY = 'clinic-rbac-demo-v1';

const ROLE_ALIASES = {
  staff: 'receptionist',
  clinician: 'doctor'
};

function normalizeRole(role) {
  const normalized = String(role || '').trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
}

function makePatientIndex(fullName, phone) {
  const name = String(fullName || '').toLowerCase();
  const digits = String(phone || '').replace(/\D/g, '');
  return `${name} ${digits}`.trim();
}

function initialState() {
  const users = [
    { id: 'u-admin', fullName: 'System Admin', email: 'admin@clinic.local', role: 'admin', status: 'active' },
    { id: 'u-doc-1', fullName: 'Dr. Amina Yusuf', email: 'doctor.amina@clinic.local', role: 'doctor', status: 'active' },
    { id: 'u-doc-2', fullName: 'Dr. Liam Stone', email: 'doctor.liam@clinic.local', role: 'doctor', status: 'active' },
    { id: 'u-rec-1', fullName: 'Maya Reception', email: 'receptionist.maya@clinic.local', role: 'receptionist', status: 'active' },
    { id: 'u-pat-1', fullName: 'Noah Carter', email: 'patient.noah@clinic.local', role: 'patient', status: 'active' },
    { id: 'u-pat-2', fullName: 'Ava Turner', email: 'patient.ava@clinic.local', role: 'patient', status: 'active' }
  ];

  const patients = [
    {
      id: 'p-1001',
      fullName: 'Noah Carter',
      phone: '5551112233',
      dob: '1990-04-14',
      email: 'patient.noah@clinic.local',
      address: '12 Maple St',
      history: 'Type 2 diabetes, seasonal allergies'
    },
    {
      id: 'p-1002',
      fullName: 'Ava Turner',
      phone: '5552223344',
      dob: '1988-09-02',
      email: 'patient.ava@clinic.local',
      address: '7 Oak Ave',
      history: 'Hypertension'
    }
  ].map((patient) => ({ ...patient, searchIndex: makePatientIndex(patient.fullName, patient.phone) }));

  const appointments = [
    {
      id: 'a-9001',
      patientId: 'p-1001',
      patientName: 'Noah Carter',
      doctorId: 'u-doc-1',
      doctorName: 'Dr. Amina Yusuf',
      date: '2026-03-30',
      time: '09:00',
      status: 'booked'
    },
    {
      id: 'a-9002',
      patientId: 'p-1002',
      patientName: 'Ava Turner',
      doctorId: 'u-doc-2',
      doctorName: 'Dr. Liam Stone',
      date: '2026-03-30',
      time: '10:00',
      status: 'booked'
    }
  ];

  const prescriptions = [
    {
      id: 'rx-1',
      patientId: 'p-1001',
      patientName: 'Noah Carter',
      doctorId: 'u-doc-1',
      doctorName: 'Dr. Amina Yusuf',
      diagnosis: 'Routine diabetes follow-up',
      medication: 'Metformin 500mg twice daily',
      createdAt: '2026-03-26T09:30:00Z'
    }
  ];

  return {
    users,
    patients,
    appointments,
    prescriptions
  };
}

function readState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = initialState();
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.users || !parsed?.patients || !parsed?.appointments || !parsed?.prescriptions) {
      const seeded = initialState();
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = initialState();
    window.localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeState(next) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}`;
}

export function getUsers() {
  return readState().users;
}

export function createUser(payload) {
  const state = readState();
  const role = normalizeRole(payload.role);
  const user = {
    id: nextId('u'),
    fullName: payload.fullName,
    email: payload.email,
    role,
    status: 'active'
  };
  state.users = [user, ...state.users];
  writeState(state);
  return user;
}

export function updateUserRole(userId, role) {
  const state = readState();
  state.users = state.users.map((user) => (user.id === userId ? { ...user, role: normalizeRole(role) } : user));
  writeState(state);
}

export function deleteUser(userId) {
  const state = readState();
  state.users = state.users.filter((user) => user.id !== userId);
  writeState(state);
}

export function getDoctors() {
  return readState().users.filter((user) => normalizeRole(user.role) === 'doctor');
}

export function listPatients(search = '') {
  const state = readState();
  const term = String(search || '').toLowerCase().trim().replace(/\D/g, '');
  const nameTerm = String(search || '').toLowerCase().trim();
  if (!term && !nameTerm) return state.patients;

  return state.patients.filter((patient) => {
    const nameMatches = nameTerm && patient.searchIndex.includes(nameTerm);
    const phoneMatches = term && patient.phone.includes(term);
    return Boolean(nameMatches || phoneMatches);
  });
}

export function getPatientById(patientId) {
  return readState().patients.find((patient) => patient.id === patientId) || null;
}

export function getPatientByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  return readState().patients.find((patient) => String(patient.email || '').toLowerCase() === normalized) || null;
}

export function createPatient(payload) {
  const state = readState();
  const patient = {
    id: nextId('p'),
    fullName: payload.fullName,
    phone: String(payload.phone || '').replace(/\D/g, ''),
    dob: payload.dob || '',
    email: payload.email || '',
    address: payload.address || '',
    history: payload.history || 'No prior history recorded',
    searchIndex: makePatientIndex(payload.fullName, payload.phone)
  };
  state.patients = [patient, ...state.patients];
  writeState(state);
  return patient;
}

export function updatePatient(patientId, patch) {
  const state = readState();
  state.patients = state.patients.map((patient) => {
    if (patient.id !== patientId) return patient;
    const next = { ...patient, ...patch };
    next.phone = String(next.phone || '').replace(/\D/g, '');
    next.searchIndex = makePatientIndex(next.fullName, next.phone);
    return next;
  });
  writeState(state);
}

export function deletePatient(patientId) {
  const state = readState();
  state.patients = state.patients.filter((patient) => patient.id !== patientId);
  state.appointments = state.appointments.filter((appointment) => appointment.patientId !== patientId);
  state.prescriptions = state.prescriptions.filter((rx) => rx.patientId !== patientId);
  writeState(state);
}

export function listAppointments() {
  return readState().appointments;
}

export function createAppointment(payload) {
  const state = readState();
  const patient = state.patients.find((item) => item.id === payload.patientId);
  const doctor = state.users.find((item) => item.id === payload.doctorId);

  if (!patient || !doctor) {
    throw new Error('Patient or doctor not found for appointment booking');
  }

  const appointment = {
    id: nextId('a'),
    patientId: patient.id,
    patientName: patient.fullName,
    doctorId: doctor.id,
    doctorName: doctor.fullName,
    date: payload.date,
    time: payload.time,
    status: payload.status || 'booked'
  };

  state.appointments = [appointment, ...state.appointments];
  writeState(state);
  return appointment;
}

export function listAppointmentsForDoctor(doctorId) {
  return readState().appointments.filter((item) => item.doctorId === doctorId);
}

export function listAppointmentsForPatient(patientId) {
  return readState().appointments.filter((item) => item.patientId === patientId);
}

export function addPrescription(payload) {
  const state = readState();
  const patient = state.patients.find((item) => item.id === payload.patientId);
  if (!patient) throw new Error('Patient not found');

  const prescription = {
    id: nextId('rx'),
    patientId: patient.id,
    patientName: patient.fullName,
    doctorId: payload.doctorId,
    doctorName: payload.doctorName,
    diagnosis: payload.diagnosis,
    medication: payload.medication,
    createdAt: new Date().toISOString()
  };

  state.prescriptions = [prescription, ...state.prescriptions];
  writeState(state);
  return prescription;
}

export function listPrescriptionsForPatient(patientId) {
  return readState().prescriptions.filter((item) => item.patientId === patientId);
}

export function listPrescriptionsForDoctor(doctorId) {
  return readState().prescriptions.filter((item) => item.doctorId === doctorId);
}

export function getPatientHistoryRows(patientId) {
  const appointments = listAppointmentsForPatient(patientId);
  const prescriptions = listPrescriptionsForPatient(patientId);

  const appointmentRows = appointments.map((item) => ({
    id: `hist-appt-${item.id}`,
    type: 'appointment',
    date: `${item.date} ${item.time}`,
    detail: `${item.doctorName} (${item.status})`
  }));

  const prescriptionRows = prescriptions.map((item) => ({
    id: `hist-rx-${item.id}`,
    type: 'prescription',
    date: new Date(item.createdAt).toLocaleString(),
    detail: `${item.diagnosis} / ${item.medication}`
  }));

  return [...appointmentRows, ...prescriptionRows];
}

export function getSystemReport() {
  const state = readState();
  return {
    totalUsers: state.users.length,
    totalPatients: state.patients.length,
    totalAppointments: state.appointments.length,
    totalPrescriptions: state.prescriptions.length
  };
}

export function firestoreQueryHint() {
  return 'Use where("searchIndex", ">=", term).where("searchIndex", "<=", `${term}\\uf8ff`) and where("phone", "==", digits) for indexed lookups.';
}
