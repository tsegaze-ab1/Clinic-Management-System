const { db, timestamp } = require("./firestore");
const ApiError = require("../utils/apiError");

const appointmentsCollection = db.collection("appointments");

const mapAppointmentDoc = (doc) => ({
  id: doc.id,
  ...doc.data()
});

const createAppointment = async (payload) => {
  const docRef = appointmentsCollection.doc();

  await docRef.set({
    patientId: payload.patientId,
    doctorId: payload.doctorId,
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
    query = query.where("patientId", "==", userId);
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
