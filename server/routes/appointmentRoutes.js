const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { ROLES } = require("../models/roles");
const {
  createAppointmentRecord,
  listAppointments,
  updateDiagnosis
} = require("../controllers/appointmentController");

const router = express.Router();

router.use(authMiddleware);

// Receptionist and admin can create appointments.
router.post("/", roleMiddleware(ROLES.RECEPTIONIST, ROLES.ADMIN), createAppointmentRecord);

// All authenticated roles can read appointments, filtered by service layer.
router.get("/", roleMiddleware(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT), listAppointments);

// Doctor can add diagnosis and prescription.
router.patch("/:id/diagnosis", roleMiddleware(ROLES.DOCTOR), updateDiagnosis);

module.exports = router;
