const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/jwt");
const { createUser, verifyCredentials } = require("../services/userService");
const { ROLES } = require("../models/roles");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email, and password are required");
  }

  const createdUser = await createUser({
    name,
    email,
    password,
    role: role || ROLES.PATIENT,
    phone
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user
    }
  });
});

module.exports = {
  register,
  login
};
