const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const Tenant = require("../models/Tenant");
const auth = require("../middleware/auth");

// all /notes routes require auth
router.use(auth);

// POST /notes -> create note (respect tenant plan limit)
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  // check tenant plan and note count
  const tenant = await Tenant.findById(req.user.tenantId);
  if (!tenant) return res.status(400).json({ error: "Tenant not found" });

  if (tenant.plan === "free") {
    const count = await Note.countDocuments({ tenant: tenant._id });
    if (count >= 3)
      return res
        .status(403)
        .json({ error: "Free plan limit reached. Upgrade to Pro." });
  }

  const note = new Note({
    title,
    content,
    tenant: tenant._id,
    createdBy: req.user.userId,
  });
  await note.save();
  return res.status(201).json(note);
});

// GET /notes -> list notes for tenant
router.get("/", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const notes = await Note.find({ tenant: tenant._id }).sort({ createdAt: -1 });
    return res.json({ notes, tenant }); // <--- return an object with notes and tenant
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


// GET /notes/:id -> single note (tenant-isolated)
router.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  if (String(note.tenant) !== String(req.user.tenantId))
    return res.status(403).json({ error: "Forbidden" });
  return res.json(note);
});


// DELETE /notes/:id
router.delete("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  if (String(note.tenant) !== String(req.user.tenantId))
    return res.status(403).json({ error: "Forbidden" });

  await note.deleteOne();
  return res.json({ message: "Note deleted" });
});

// Update a note
// PUT /notes/:id -> update note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (String(note.tenant) !== String(req.user.tenantId))
      return res.status(403).json({ error: "Forbidden" });

    const { title, content } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    return res.json({ note }); // <--- return updated note
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
