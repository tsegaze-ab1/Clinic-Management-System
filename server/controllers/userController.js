const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} = require("../services/userService");

const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    success: true,
    data: users
  });
});

const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "name, email, password, and role are required");
  }

  const user = await createUser({ name, email, password, role, phone });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getMyProfile
};
