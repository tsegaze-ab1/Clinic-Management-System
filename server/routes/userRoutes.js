const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { ROLES } = require("../models/roles");
const {
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getMyProfile
} = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMyProfile);

// Example role-based middleware usage: only admin can manage users.
router.get("/", roleMiddleware(ROLES.ADMIN), getUsers);
router.post("/", roleMiddleware(ROLES.ADMIN), createUserByAdmin);
router.patch("/:id", roleMiddleware(ROLES.ADMIN), updateUserByAdmin);
router.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteUserByAdmin);

module.exports = router;
