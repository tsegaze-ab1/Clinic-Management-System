import { ROLES } from './sessionStore';

export const permissions = {
  'dashboard:admin': [ROLES.ADMIN],
  'dashboard:receptionist': [ROLES.RECEPTIONIST, ROLES.ADMIN],
  'dashboard:doctor': [ROLES.DOCTOR, ROLES.ADMIN],
  'dashboard:patient': [ROLES.PATIENT, ROLES.ADMIN],
  'users:read': [ROLES.ADMIN],
  'users:write': [ROLES.ADMIN],
  'roles:read': [ROLES.ADMIN],
  'roles:write': [ROLES.ADMIN],
  'appointments:read': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT],
  'appointments:write': [ROLES.ADMIN, ROLES.RECEPTIONIST],
  'encounters:read': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
  'encounters:write': [ROLES.ADMIN, ROLES.DOCTOR],
  'orders:write': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
  'billing:read': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT],
  'billing:write': [ROLES.ADMIN, ROLES.RECEPTIONIST],
  'inventory:read': [ROLES.ADMIN, ROLES.RECEPTIONIST],
  'inventory:write': [ROLES.ADMIN, ROLES.RECEPTIONIST],
  'messages:read': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT],
  'messages:write': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT],
  'settings:read': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT],
  'audit:read': [ROLES.ADMIN],
  'featureflags:write': [ROLES.ADMIN]
};

export function can(role, permission) {
  return (permissions[permission] || []).includes(role);
}
