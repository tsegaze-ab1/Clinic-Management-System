/**
 * @typedef {Object} Clinic
 * @property {string} id
 * @property {string} name
 * @property {string} timezone
 * @property {'active'|'inactive'} status
 */

/**
 * @typedef {Object} Provider
 * @property {string} id
 * @property {string} fullName
 * @property {string} specialty
 * @property {string} clinicId
 */

/**
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} mrn
 * @property {string} fullName
 * @property {string} dob
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} patientId
 * @property {string} providerId
 * @property {string} startAt
 * @property {'booked'|'checked_in'|'completed'|'cancelled'} status
 */

/**
 * @typedef {Object} Encounter
 * @property {string} id
 * @property {string} patientId
 * @property {string} appointmentId
 * @property {string} soap
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} role
 */

/**
 * @typedef {Object} Role
 * @property {string} id
 * @property {string} key
 * @property {string[]} permissionKeys
 */

export {};
