const KEY = 'clinic-session-v1';

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient'
};

const LEGACY_ROLE_MAP = {
  staff: ROLES.RECEPTIONIST,
  clinician: ROLES.DOCTOR,
  reception: ROLES.RECEPTIONIST,
  receptionist_user: ROLES.RECEPTIONIST,
  doctor_user: ROLES.DOCTOR
};

export function normalizeRole(role) {
  const key = String(role || '').trim().toLowerCase();
  const normalizedKey = key.startsWith('role_') ? key.replace('role_', '') : key;
  return LEGACY_ROLE_MAP[normalizedKey] || normalizedKey || ROLES.ADMIN;
}

const defaultSession = {
  token: null,
  refreshToken: null,
  role: ROLES.ADMIN,
  user: null,
  mfaVerified: false
};

export function getSession() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSession;
    const parsed = JSON.parse(raw);
    return { ...parsed, role: normalizeRole(parsed.role) };
  } catch {
    return defaultSession;
  }
}

export function setSession(partial) {
  const next = { ...getSession(), ...partial, role: normalizeRole(partial.role || getSession().role) };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
}
