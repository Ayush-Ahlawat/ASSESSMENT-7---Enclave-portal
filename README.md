# 📬 Secure Contact Portal

Production-ready Contact Portal with React frontend + Express backend.

## 🚀 Run Locally

### Backend
```bash
cd backend
npm install
npm start
```
Runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

## 📦 Features
- Contact form with Zod validation
- Rate limiting (10 requests / 15 min)
- Helmet security middleware
- Admin dashboard (view, mark read, delete)
- JSON file storage (no database)

## 🛠 Tech Stack
React, Vite, Node.js, Express, Zod, Helmet, express-rate-limit
