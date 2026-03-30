import { apiRequest } from './api';

function splitFullName(fullName = '') {
	const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return { firstName: '', lastName: '' };
	if (parts.length === 1) return { firstName: parts[0], lastName: '-' };
	return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function mapUser(user) {
	if (!user) return null;
	return {
		id: user.id,
		fullName: user.name || user.fullName || '',
		name: user.name || user.fullName || '',
		email: user.email || '',
		role: user.role,
		status: user.isActive === false ? 'inactive' : 'active',
		phone: user.phone || ''
	};
}

function mapPatient(patient) {
	if (!patient) return null;
	return {
		id: patient.id,
		firstName: patient.firstName || '',
		lastName: patient.lastName || '',
		fullName: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
		phone: patient.phone || '',
		dob: patient.dateOfBirth || '',
		dateOfBirth: patient.dateOfBirth || '',
		email: patient.email || '',
		address: patient.address || '',
		history: Array.isArray(patient.history) ? patient.history.join(', ') : patient.history || 'No history recorded',
		rawHistory: Array.isArray(patient.history) ? patient.history : []
	};
}

function mapAppointment(appointment) {
	if (!appointment) return null;
	return {
		...appointment,
		patientName: appointment.patientName || appointment.patientFullName || appointment.patientId,
		doctorName: appointment.doctorName || appointment.providerName || appointment.doctorId,
		medication: appointment.prescription || ''
	};
}

export async function getUsersApi() {
	const res = await apiRequest('/api/users');
	return (res?.data || []).map(mapUser);
}

export async function createUserApi(payload) {
	const res = await apiRequest('/api/users', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
	return mapUser(res?.data);
}

export async function updateUserApi(id, payload) {
	const res = await apiRequest(`/api/users/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload)
	});
	return mapUser(res?.data);
}

export async function deleteUserApi(id) {
	return apiRequest(`/api/users/${id}`, { method: 'DELETE' });
}

export async function getDashboardApi(role) {
	const safeRole = ['admin', 'doctor', 'receptionist', 'patient'].includes(role) ? role : 'admin';
	const res = await apiRequest(`/api/dashboard/${safeRole}`);
	return res?.data || {};
}

export async function getPatientsApi(search = '') {
	const endpoint = search.trim() ? `/api/patients/search?q=${encodeURIComponent(search.trim())}` : '/api/patients';
	const res = await apiRequest(endpoint);
	return (res?.data || []).map(mapPatient);
}

export async function getPatientApi(id) {
	const res = await apiRequest(`/api/patients/${id}`);
	return mapPatient(res?.data);
}

export async function createPatientApi(payload) {
	const { firstName, lastName } = splitFullName(payload.fullName);
	const history = payload.history
		? [String(payload.history).trim()].filter(Boolean)
		: [];

	const res = await apiRequest('/api/patients', {
		method: 'POST',
		body: JSON.stringify({
			firstName,
			lastName,
			phone: payload.phone,
			dateOfBirth: payload.dob || '',
			email: payload.email || '',
			address: payload.address || '',
			history
		})
	});

	return mapPatient(res?.data);
}

export async function getAppointmentsApi() {
	const res = await apiRequest('/api/appointments');
	return (res?.data || []).map(mapAppointment);
}

export async function createAppointmentApi(payload) {
	const res = await apiRequest('/api/appointments', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
	return mapAppointment(res?.data);
}

export async function updateAppointmentDiagnosisApi(appointmentId, payload) {
	const res = await apiRequest(`/api/appointments/${appointmentId}/diagnosis`, {
		method: 'PATCH',
		body: JSON.stringify(payload)
	});
	return mapAppointment(res?.data);
}

export async function getBillingSummaryApi() {
	const res = await apiRequest('/api/billing/summary');
	return res?.data || {};
}
