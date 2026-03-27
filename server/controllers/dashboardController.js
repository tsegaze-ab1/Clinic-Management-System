const asyncHandler = require("../utils/asyncHandler");
const { getAllUsers } = require("../services/userService");
const { getAllPatients } = require("../services/patientService");
const { getAppointments } = require("../services/appointmentService");

const adminDashboard = asyncHandler(async (req, res) => {
  const [users, patients, appointments] = await Promise.all([
    getAllUsers(),
    getAllPatients(),
    getAppointments({ role: "admin", userId: req.user.userId })
  ]);

  res.status(200).json({
    success: true,
    role: "admin",
    data: {
      totalUsers: users.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      report: "System report placeholder"
    }
  });
});

const doctorDashboard = asyncHandler(async (req, res) => {
  const appointments = await getAppointments({
    role: "doctor",
    userId: req.user.userId
  });

  res.status(200).json({
    success: true,
    role: "doctor",
    data: {
      totalAssignedAppointments: appointments.length,
      appointments
    }
  });
});

const receptionistDashboard = asyncHandler(async (req, res) => {
  const patients = await getAllPatients();

  res.status(200).json({
    success: true,
    role: "receptionist",
    data: {
      totalPatients: patients.length,
      note: "Use patient search and booking endpoints for operations"
    }
  });
});

const patientDashboard = asyncHandler(async (req, res) => {
  const appointments = await getAppointments({
    role: "patient",
    userId: req.user.userId
  });

  res.status(200).json({
    success: true,
    role: "patient",
    data: {
      totalAppointments: appointments.length,
      appointments
    }
  });
});

module.exports = {
  adminDashboard,
  doctorDashboard,
  receptionistDashboard,
  patientDashboard
};
