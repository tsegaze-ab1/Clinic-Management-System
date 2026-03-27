// This file documents the expected user shape stored in Firestore.
// Collection: users

const defaultUserShape = {
  name: "",
  email: "",
  passwordHash: "",
  role: "patient",
  phone: "",
  isActive: true,
  createdAt: null,
  updatedAt: null
};

module.exports = {
  defaultUserShape
};
