const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const Tenant = require("./models/Tenant");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    await connectDB();

    // remove existing data (careful locally!)
    await User.deleteMany({});
    await Tenant.deleteMany({});

    const acme = await Tenant.create({
      name: "Acme",
      slug: "acme",
      plan: "free",
    });
    const globex = await Tenant.create({
      name: "Globex",
      slug: "globex",
      plan: "free",
    });

    const passwordHash = await bcrypt.hash("password", 10);

    await User.create({
      email: "admin@acme.test",
      password: passwordHash,
      role: "admin",
      tenant: acme._id,
    });
    await User.create({
      email: "user@acme.test",
      password: passwordHash,
      role: "member",
      tenant: acme._id,
    });
    await User.create({
      email: "admin@globex.test",
      password: passwordHash,
      role: "admin",
      tenant: globex._id,
    });
    await User.create({
      email: "user@globex.test",
      password: passwordHash,
      role: "member",
      tenant: globex._id,
    });

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
