
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access denied — No token provided" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], "AGSS_BV_SECRET_KEY");
    req.parentId = verified.parentId;  // 👈 store parentId
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};