const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
