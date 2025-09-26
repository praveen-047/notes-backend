const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth"));
app.use("/tenants", require("./routes/tenants"));
app.use("/notes", require("./routes/notes"));

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
