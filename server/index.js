

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const formRoutes = require("./routes/forms");
const responseRoutes = require("./routes/responses");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const MONGO =
  process.env.MONGO_URI ||
  "mongodb+srv://ck846747_db_user:asdfghjkl12@cluster0.p5vsx4q.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ Mongo connection error", e));

// Register routes
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "Backend running" })
);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
