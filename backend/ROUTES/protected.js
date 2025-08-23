const express = require("express");
const { requireAuth } = require("../MIDDLEWARE/authMiddleware");

const protectedRouter = express.Router();

protectedRouter.route("/dashboard").get(requireAuth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: `Welcome to your dashboard, ${req.user.name}`,
    user: req.user,
  });
});

module.exports = protectedRouter;
