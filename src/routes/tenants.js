// routes/tenants.js
const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

// PUT /tenants/:slug/upgrade (Admin only)
router.put("/:slug/upgrade", auth, roles(["admin"]), async (req, res) => {
  try {
    const { slug } = req.params;

    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { plan: "pro" },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json({ message: "Tenant upgraded successfully", tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
