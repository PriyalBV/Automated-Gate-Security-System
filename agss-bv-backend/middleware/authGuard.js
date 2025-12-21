const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // Token should come from headers
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    // Token format: "Bearer xxxxxx"
    const extractedToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

    // Save guard ID & role from token
    req.guard = decoded; // { id, role: "guard" }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token." });
  }
};
