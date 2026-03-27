const ApiError = require("../utils/apiError");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission for this resource"));
    }

    return next();
  };
};

module.exports = roleMiddleware;
