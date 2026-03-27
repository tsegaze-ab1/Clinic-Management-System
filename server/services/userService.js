const bcrypt = require("bcryptjs");

const { db, timestamp } = require("./firestore");
const { ROLE_LIST, ROLES } = require("../models/roles");
const ApiError = require("../utils/apiError");

const usersCollection = db.collection("users");

const sanitizeUserDoc = (doc) => {
  const data = doc.data();
  delete data.passwordHash;

  return {
    id: doc.id,
    ...data
  };
};

const findUserByEmail = async (email) => {
  const snapshot = await usersCollection.where("email", "==", email.toLowerCase()).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const createUser = async (payload) => {
  const { name, email, password, role = ROLES.PATIENT, phone = "" } = payload;

  if (!ROLE_LIST.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const docRef = usersCollection.doc();
  await docRef.set({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    phone,
    isActive: true,
    createdAt: timestamp(),
    updatedAt: timestamp()
  });

  const created = await docRef.get();
  return sanitizeUserDoc(created);
};

const verifyCredentials = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user?.isActive) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const getAllUsers = async () => {
  const snapshot = await usersCollection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(sanitizeUserDoc);
};

const updateUser = async (id, payload) => {
  const updateData = { ...payload, updatedAt: timestamp() };

  if (updateData.email) {
    updateData.email = updateData.email.toLowerCase();
  }

  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }

  await usersCollection.doc(id).set(updateData, { merge: true });
  const doc = await usersCollection.doc(id).get();

  if (!doc.exists) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUserDoc(doc);
};

const deleteUser = async (id) => {
  const docRef = usersCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, "User not found");
  }

  await docRef.delete();
  return true;
};

const getUserById = async (id) => {
  const doc = await usersCollection.doc(id).get();

  if (!doc.exists) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUserDoc(doc);
};

module.exports = {
  createUser,
  verifyCredentials,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  findUserByEmail
};
