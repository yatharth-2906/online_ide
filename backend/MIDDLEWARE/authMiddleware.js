const { verifyToken } = require("../SERVICES/auth");

function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Unauthorized: No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ status: "fail", message: "Unauthorized: Invalid token" });
  }

  req.user = decoded; // Attach user info to request
  next();
}

module.exports = { requireAuth };
