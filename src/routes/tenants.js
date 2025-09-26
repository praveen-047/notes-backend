const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

// POST /tenants/:slug/upgrade -> Admin only
router.post("/:slug/upgrade", auth, roles(["admin"]), async (req, res) => {
  const { slug } = req.params;

  const tenant = await Tenant.findOne({ slug });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  // Ensure the requesting admin belongs to this tenant
  if (String(req.user.tenantId) !== String(tenant._id)) {
    return res.status(403).json({ error: "Cannot upgrade another tenant" });
  }

  tenant.plan = "pro";
  await tenant.save();

  return res.json({
    message: "Tenant upgraded to pro",
    tenant: { slug: tenant.slug, plan: tenant.plan },
  });
});

module.exports = router;
