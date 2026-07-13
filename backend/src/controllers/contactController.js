const fs = require("fs");
const path = require("path");
const { z } = require("zod");

const DB_PATH = path.join(__dirname, "../../data/contacts.json");

const initDB = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
};

const getContacts = () => {
  initDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};

const saveContacts = (data) => {
  initDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const submitContact = (req, res) => {
  try {
    const validated = contactSchema.parse(req.body);

    const contacts = getContacts();
    const newContact = {
      id: Date.now().toString(),
      ...validated,
      createdAt: new Date().toISOString(),
      status: "unread",
    };
    contacts.push(newContact);
    saveContacts(contacts);

    res.status(201).json({
      success: true,
      message: "Message submitted successfully!",
      data: { id: newContact.id, name: newContact.name, createdAt: newContact.createdAt },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors.map((e) => ({ field: e.path[0], message: e.message })),
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAll = (req, res) => {
  try {
    const contacts = getContacts();
    res.json({ success: true, data: contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const markRead = (req, res) => {
  try {
    const contacts = getContacts();
    const idx = contacts.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Contact not found" });
    contacts[idx].status = "read";
    saveContacts(contacts);
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteContact = (req, res) => {
  try {
    const contacts = getContacts();
    const idx = contacts.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Not found" });
    contacts.splice(idx, 1);
    saveContacts(contacts);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { submitContact, getAll, markRead, deleteContact };
