const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
