const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const patientRoutes = require("./patientRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const billingRoutes = require("./billingRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/billing", billingRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
