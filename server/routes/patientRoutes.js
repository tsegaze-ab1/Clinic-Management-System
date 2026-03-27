const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { ROLES } = require("../models/roles");
const {
  createPatientRecord,
  getPatients,
  getPatient,
  updatePatientRecord,
  deletePatientRecord,
  searchPatientRecords
} = require("../controllers/patientController");

const router = express.Router();

router.use(authMiddleware);

// Receptionist and admin can register patients.
router.post("/", roleMiddleware(ROLES.RECEPTIONIST, ROLES.ADMIN), createPatientRecord);

// Doctor, receptionist, and admin can read patient records.
router.get("/", roleMiddleware(ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.ADMIN), getPatients);
router.get("/search", roleMiddleware(ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.ADMIN), searchPatientRecords);
router.get("/:id", roleMiddleware(ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.ADMIN), getPatient);

// Admin and receptionist can update patient profile.
router.patch("/:id", roleMiddleware(ROLES.RECEPTIONIST, ROLES.ADMIN), updatePatientRecord);

// Admin only can delete patient record.
router.delete("/:id", roleMiddleware(ROLES.ADMIN), deletePatientRecord);

module.exports = router;
