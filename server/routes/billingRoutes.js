const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { ROLES } = require("../models/roles");
const { getBillingReport } = require("../controllers/billingController");

const router = express.Router();

router.use(authMiddleware);
router.get("/summary", roleMiddleware(ROLES.ADMIN, ROLES.RECEPTIONIST), getBillingReport);

module.exports = router;
