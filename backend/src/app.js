const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));

app.get("/", (_, res) => res.json({ message: "Contact Portal API running 🚀" }));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

module.exports = app;
