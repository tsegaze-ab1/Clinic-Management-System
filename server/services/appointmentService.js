const { db, timestamp } = require("./firestore");
const ApiError = require("../utils/apiError");
const { getPatientById } = require("./patientService");
const { getUserById } = require("./userService");

const appointmentsCollection = db.collection("appointments");

const mapAppointmentDoc = (doc) => ({
  id: doc.id,
  ...doc.data()
});

const createAppointment = async (payload) => {
  const [patient, doctor] = await Promise.all([
    getPatientById(payload.patientId),
    getUserById(payload.doctorId)
  ]);

  const docRef = appointmentsCollection.doc();

  await docRef.set({
    patientId: payload.patientId,
    patientUserId: patient.userId || null,
    patientName: patient.fullName || payload.patientId,
    doctorId: payload.doctorId,
    doctorName: doctor.name || payload.doctorId,
    createdBy: payload.createdBy,
    date: payload.date,
    time: payload.time,
    status: payload.status || "scheduled",
    notes: payload.notes || "",
    diagnosis: "",
    prescription: "",
    createdAt: timestamp(),
    updatedAt: timestamp()
  });

  const created = await docRef.get();
  return mapAppointmentDoc(created);
};

const getAppointments = async ({ role, userId }) => {
  let query = appointmentsCollection;

  if (role === "doctor") {
    query = query.where("doctorId", "==", userId);
  }

  if (role === "patient") {
    const byPatientUserId = await query.where("patientUserId", "==", userId).orderBy("date", "asc").get();

    if (!byPatientUserId.empty) {
      return byPatientUserId.docs.map(mapAppointmentDoc);
    }

    const fallbackByPatientId = await query.where("patientId", "==", userId).orderBy("date", "asc").get();
    return fallbackByPatientId.docs.map(mapAppointmentDoc);
  }

  const snapshot = await query.orderBy("date", "asc").get();
  return snapshot.docs.map(mapAppointmentDoc);
};

const addDiagnosisAndPrescription = async (appointmentId, payload) => {
  const docRef = appointmentsCollection.doc(appointmentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, "Appointment not found");
  }

  await docRef.set(
    {
      diagnosis: payload.diagnosis || "",
      prescription: payload.prescription || "",
      status: payload.status || "completed",
      updatedAt: timestamp()
    },
    { merge: true }
  );

  const updated = await docRef.get();
  return mapAppointmentDoc(updated);
};

module.exports = {
  createAppointment,
  getAppointments,
  addDiagnosisAndPrescription
};
