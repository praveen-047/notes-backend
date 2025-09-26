const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = await User.findOne({ email }).populate("tenant");
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const payload = {
    userId: user._id,
    tenantId: user.tenant._id,
    role: user.role,
    tenantSlug: user.tenant.slug,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
  return res.json({
    token,
    user: payload
  });
});

module.exports = router;
