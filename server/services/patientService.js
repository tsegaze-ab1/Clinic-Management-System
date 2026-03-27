const { db, timestamp } = require("./firestore");
const ApiError = require("../utils/apiError");
const { normalizePhone, normalizeString } = require("../utils/normalize");

const patientsCollection = db.collection("patients");

const mapPatientDoc = (doc) => ({
  id: doc.id,
  ...doc.data()
});

const createPatient = async (payload) => {
  const firstName = payload.firstName?.trim() || "";
  const lastName = payload.lastName?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const docRef = patientsCollection.doc();
  await docRef.set({
    userId: payload.userId || null,
    firstName,
    lastName,
    fullName,
    fullNameSearch: normalizeString(fullName),
    phone: payload.phone || "",
    phoneNormalized: normalizePhone(payload.phone || ""),
    dateOfBirth: payload.dateOfBirth || "",
    gender: payload.gender || "",
    address: payload.address || "",
    history: payload.history || [],
    createdAt: timestamp(),
    updatedAt: timestamp()
  });

  const created = await docRef.get();
  return mapPatientDoc(created);
};

const getAllPatients = async () => {
  const snapshot = await patientsCollection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(mapPatientDoc);
};

const getPatientById = async (id) => {
  const doc = await patientsCollection.doc(id).get();

  if (!doc.exists) {
    throw new ApiError(404, "Patient not found");
  }

  return mapPatientDoc(doc);
};

const updatePatient = async (id, payload) => {
  const existing = await getPatientById(id);

  const firstName = payload.firstName ?? existing.firstName;
  const lastName = payload.lastName ?? existing.lastName;
  const fullName = `${firstName} ${lastName}`.trim();

  const updateData = {
    ...payload,
    firstName,
    lastName,
    fullName,
    fullNameSearch: normalizeString(fullName),
    phoneNormalized: normalizePhone(payload.phone ?? existing.phone),
    updatedAt: timestamp()
  };

  await patientsCollection.doc(id).set(updateData, { merge: true });
  return getPatientById(id);
};

const deletePatient = async (id) => {
  const docRef = patientsCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, "Patient not found");
  }

  await docRef.delete();
  return true;
};

const searchPatients = async (query) => {
  const q = (query || "").trim();
  if (!q) {
    return [];
  }

  const normalized = normalizeString(q);
  const phoneNormalized = normalizePhone(q);

  const resultsMap = new Map();

  // Prefix search on precomputed lowercase fullNameSearch for fast lookup.
  const byNameSnapshot = await patientsCollection
    .where("fullNameSearch", ">=", normalized)
    .where("fullNameSearch", "<=", `${normalized}\uf8ff`)
    .limit(20)
    .get();

  byNameSnapshot.docs.forEach((doc) => {
    resultsMap.set(doc.id, mapPatientDoc(doc));
  });

  if (phoneNormalized) {
    const byPhoneSnapshot = await patientsCollection
      .where("phoneNormalized", ">=", phoneNormalized)
      .where("phoneNormalized", "<=", `${phoneNormalized}\uf8ff`)
      .limit(20)
      .get();

    byPhoneSnapshot.docs.forEach((doc) => {
      resultsMap.set(doc.id, mapPatientDoc(doc));
    });
  }

  return Array.from(resultsMap.values());
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients
};
