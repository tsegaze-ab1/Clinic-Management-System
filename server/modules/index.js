const authModule = require("./auth");
const usersModule = require("./users");
const patientsModule = require("./patients");
const appointmentsModule = require("./appointments");
const billingModule = require("./billing");

module.exports = [
  authModule,
  usersModule,
  patientsModule,
  appointmentsModule,
  billingModule
];
