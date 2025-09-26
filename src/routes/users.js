const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

// GET /users/tenant-members
// Admin only: returns all members of the admin's tenant
router.get("/tenant-members", auth, roles(["admin"]), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const members = await User.find({ tenant: tenantId, role: "member" }).select("email role _id");
    res.json({ members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
