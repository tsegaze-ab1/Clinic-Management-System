const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients
} = require("../services/patientService");

const createPatientRecord = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  if (!firstName || !lastName || !phone) {
    throw new ApiError(400, "firstName, lastName, and phone are required");
  }

  const patient = await createPatient(req.body);

  res.status(201).json({
    success: true,
    message: "Patient registered successfully",
    data: patient
  });
});

const getPatients = asyncHandler(async (req, res) => {
  const patients = await getAllPatients();

  res.status(200).json({
    success: true,
    data: patients
  });
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  res.status(200).json({
    success: true,
    data: patient
  });
});

const updatePatientRecord = asyncHandler(async (req, res) => {
  const patient = await updatePatient(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Patient updated successfully",
    data: patient
  });
});

const deletePatientRecord = asyncHandler(async (req, res) => {
  await deletePatient(req.params.id);

  res.status(200).json({
    success: true,
    message: "Patient deleted successfully"
  });
});

const searchPatientRecords = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query parameter q is required");
  }

  const patients = await searchPatients(q);

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients
  });
});

module.exports = {
  createPatientRecord,
  getPatients,
  getPatient,
  updatePatientRecord,
  deletePatientRecord,
  searchPatientRecords
};
