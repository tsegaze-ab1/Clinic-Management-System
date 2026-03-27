// Collection: appointments

const defaultAppointmentShape = {
  patientId: "",
  doctorId: "",
  createdBy: "",
  date: "",
  time: "",
  status: "scheduled",
  notes: "",
  diagnosis: "",
  prescription: "",
  createdAt: null,
  updatedAt: null
};

module.exports = {
  defaultAppointmentShape
};
