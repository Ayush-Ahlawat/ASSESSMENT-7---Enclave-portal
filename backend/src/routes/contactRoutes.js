const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { submitContact, getAll, markRead, deleteContact } = require("../controllers/contactController");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many requests, please try again later." },
});

router.post("/", limiter, submitContact);
router.get("/", getAll);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteContact);

module.exports = router;
