import React, { useState, useEffect } from "react";

const API = "https://assessment-7-enclave-portal.onrender.com/api/contacts";

export default function App() {
  const [page, setPage] = useState("contact"); // "contact" | "admin"
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.subject || form.subject.length < 3) errs.subject = "Subject must be at least 3 characters";
    if (!form.message || form.message.length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        if (data.errors) {
          const errs = {};
          data.errors.forEach((e) => { errs[e.field] = e.message; });
          setErrors(errs);
        }
      }
    } catch {
      setErrors({ general: "Cannot connect to server. Is backend running?" });
    }
    setLoading(false);
  };

  const loadContacts = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.success) setContacts(data.data.reverse());
    } catch {}
    setAdminLoading(false);
  };

  const markRead = async (id) => {
    await fetch(`${API}/${id}/read`, { method: "PATCH" });
    loadContacts();
  };

  const deleteContact = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadContacts();
  };

  useEffect(() => { if (page === "admin") loadContacts(); }, [page]);

  const inp = {
    width: "100%", padding: "14px 16px",
    border: "2px solid #111", borderRadius: 0,
    fontSize: 15, background: "#fff", outline: "none",
    color: "#111",
  };

  const errStyle = { color: "#e53e3e", fontSize: 12, marginTop: 4, fontWeight: 600 };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ec" }}>

      {/* ── CONTACT PAGE ──────────────────────────────────── */}
      {page === "contact" && (
        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* LEFT */}
          <div style={{ flex: 1, padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "inline-block", background: "#f5c842", border: "2px solid #111", padding: "6px 16px", fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 32, textTransform: "uppercase" }}>
              Production Ready Contact Portal
            </div>
            <h1 style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 28 }}>
              Secure<br />Contact<br />Portal
            </h1>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, maxWidth: 360 }}>
              Demonstrating{" "}
              <span style={{ color: "#2563eb", fontWeight: 600 }}>React</span>,{" "}
              <span style={{ color: "#16a34a", fontWeight: 600 }}>Express</span>,{" "}
              <span style={{ color: "#9333ea", fontWeight: 600 }}>Zod Validation</span>,{" "}
              <span style={{ color: "#dc2626", fontWeight: 600 }}>Rate Limiting</span>,{" "}
              <span style={{ color: "#d97706", fontWeight: 600 }}>Helmet</span> security middleware.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
              <button onClick={() => setPage("contact")} style={{ padding: "12px 24px", background: "#f5c842", border: "2px solid #111", fontWeight: 700, fontSize: 14 }}>
                Contact Form
              </button>
              <button onClick={() => setPage("admin")} style={{ padding: "12px 24px", background: "transparent", border: "2px solid #111", fontWeight: 700, fontSize: 14 }}>
                Admin Dashboard
              </button>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
            <div style={{ width: "100%", maxWidth: 520, border: "2px solid #111", background: "#fff", padding: "40px" }}>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Message Submitted!</h2>
                  <p style={{ color: "#555", marginBottom: 28, lineHeight: 1.6 }}>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  <button onClick={() => setSubmitted(false)} style={{ padding: "12px 28px", background: "#f5c842", border: "2px solid #111", fontWeight: 700, fontSize: 14 }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Send us a Message</h2>
                  <p style={{ color: "#2563eb", fontSize: 14, marginBottom: 28 }}>Fill out the form below and we'll get back to you as soon as possible.</p>

                  {errors.general && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626", borderRadius: 4 }}>{errors.general}</div>}

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Full Name</label>
                      <input style={{ ...inp, borderColor: errors.name ? "#e53e3e" : "#111" }} placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <p style={errStyle}>{errors.name}</p>}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Email Address</label>
                      <input style={{ ...inp, borderColor: errors.email ? "#e53e3e" : "#111" }} placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      {errors.email && <p style={errStyle}>{errors.email}</p>}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Subject</label>
                      <input style={{ ...inp, borderColor: errors.subject ? "#e53e3e" : "#111" }} placeholder="Need assistance" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                      {errors.subject && <p style={errStyle}>{errors.subject}</p>}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Message</label>
                      <textarea style={{ ...inp, borderColor: errors.message ? "#e53e3e" : "#111", height: 130, resize: "vertical" }} placeholder="Write your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                      {errors.message && <p style={errStyle}>{errors.message}</p>}
                    </div>

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", background: loading ? "#93c5fd" : "#3b82f6", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 0.5 }}>
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN DASHBOARD ───────────────────────────────── */}
      {page === "admin" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <div style={{ display: "inline-block", background: "#f5c842", border: "2px solid #111", padding: "4px 14px", fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Admin Panel</div>
              <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>Contact Messages</h1>
              <p style={{ color: "#555", marginTop: 4 }}>{contacts.length} total submissions</p>
            </div>
            <button onClick={() => setPage("contact")} style={{ padding: "12px 24px", background: "transparent", border: "2px solid #111", fontWeight: 700, fontSize: 14 }}>← Back to Form</button>
          </div>

          {adminLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading...</div>
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, border: "2px dashed #ccc" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>No messages yet</p>
              <p style={{ color: "#555", marginTop: 4 }}>Submit the contact form to see messages here</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {contacts.map((c) => (
                <div key={c.id} style={{ border: `2px solid ${c.status === "unread" ? "#111" : "#ddd"}`, background: c.status === "unread" ? "#fff" : "#fafafa", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>{c.name}</span>
                        {c.status === "unread" && <span style={{ background: "#f5c842", border: "1px solid #111", padding: "2px 8px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>New</span>}
                      </div>
                      <p style={{ fontSize: 13, color: "#555" }}>{c.email}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {c.status === "unread" && (
                        <button onClick={() => markRead(c.id)} style={{ padding: "7px 14px", background: "#111", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Mark Read</button>
                      )}
                      <button onClick={() => deleteContact(c.id)} style={{ padding: "7px 14px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Delete</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>📌 {c.subject}</p>
                  <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>{c.message}</p>
                  <p style={{ fontSize: 11, color: "#999", marginTop: 12 }}>{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
