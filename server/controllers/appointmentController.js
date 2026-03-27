const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const {
  createAppointment,
  getAppointments,
  addDiagnosisAndPrescription
} = require("../services/appointmentService");

const createAppointmentRecord = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date, time, status, notes } = req.body;

  if (!patientId || !doctorId || !date || !time) {
    throw new ApiError(400, "patientId, doctorId, date, and time are required");
  }

  const appointment = await createAppointment({
    patientId,
    doctorId,
    date,
    time,
    status,
    notes,
    createdBy: req.user.userId
  });

  res.status(201).json({
    success: true,
    message: "Appointment created successfully",
    data: appointment
  });
});

const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await getAppointments({
    role: req.user.role,
    userId: req.user.userId
  });

  res.status(200).json({
    success: true,
    data: appointments
  });
});

const updateDiagnosis = asyncHandler(async (req, res) => {
  const { diagnosis, prescription, status } = req.body;

  const appointment = await addDiagnosisAndPrescription(req.params.id, {
    diagnosis,
    prescription,
    status
  });

  res.status(200).json({
    success: true,
    message: "Diagnosis and prescription updated",
    data: appointment
  });
});

module.exports = {
  createAppointmentRecord,
  listAppointments,
  updateDiagnosis
};
