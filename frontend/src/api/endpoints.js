// Assumption: backend routes are RESTful and versioned under /api/v1.
// Backend contract files were not present in this workspace, so these routes are inferred.
export const endpoints = {
  auth: {
    signIn: '/auth/sign-in',
    verifyMfa: '/auth/verify-mfa',
    resetPassword: '/auth/reset-password',
    me: '/auth/me'
  },
  clinics: '/clinics',
  providers: '/providers',
  patients: '/patients',
  appointments: '/appointments',
  encounters: '/encounters',
  orders: '/orders',
  invoices: '/invoices',
  payments: '/payments',
  inventory: '/inventory',
  users: '/users',
  roles: '/roles',
  permissions: '/permissions',
  auditLogs: '/audit-logs',
  featureFlags: '/feature-flags',
  notifications: '/notifications',
  messages: '/messages',
  integrations: '/integrations'
};
