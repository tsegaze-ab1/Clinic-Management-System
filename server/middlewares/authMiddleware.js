const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization token is missing"));
  }

  const token = authHeader.split(" ")[1];

  const decoded = await verifyToken(token);
  if (!decoded) {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  req.user = decoded;
  return next();
};

module.exports = authMiddleware;
