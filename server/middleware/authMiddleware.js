//authMiddleware.js

const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;  // same one used in authController

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
