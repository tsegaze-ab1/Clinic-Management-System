const { db, admin } = require("../config/firebase");

const timestamp = () => admin.firestore.FieldValue.serverTimestamp();

module.exports = {
  db,
  timestamp
};
