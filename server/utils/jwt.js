const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
};

const verifyToken = async (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new Promise((resolve) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        resolve(null);
        return;
      }

      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken
};
