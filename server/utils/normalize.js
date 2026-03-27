const normalizeString = (value = "") => value.toString().trim().toLowerCase();

const normalizePhone = (value = "") => value.toString().replace(/\D/g, "");

module.exports = {
  normalizeString,
  normalizePhone
};
