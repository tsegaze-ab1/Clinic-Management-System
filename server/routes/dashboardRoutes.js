const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { ROLES } = require("../models/roles");
const {
  adminDashboard,
  doctorDashboard,
  receptionistDashboard,
  patientDashboard
} = require("../controllers/dashboardController");

const router = express.Router();

router.use(authMiddleware);

router.get("/admin", roleMiddleware(ROLES.ADMIN), adminDashboard);
router.get("/doctor", roleMiddleware(ROLES.DOCTOR), doctorDashboard);
router.get("/receptionist", roleMiddleware(ROLES.RECEPTIONIST), receptionistDashboard);
router.get("/patient", roleMiddleware(ROLES.PATIENT), patientDashboard);

module.exports = router;
