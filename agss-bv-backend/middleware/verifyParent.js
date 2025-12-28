const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied — No token provided" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied — Invalid token format" });
  }

  try {
    const verified = jwt.verify(token, "AGSS_BV_SECRET_KEY");

    // ✅ ATTACH BOTH
    req.parentId = verified.parentId;
    req.parentEmail = verified.parentEmail;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};