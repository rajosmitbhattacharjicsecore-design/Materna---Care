# Materna AI 2.0 - Optional Node.js Backend Server

This backend module provides REST endpoints, database sync, and server-side chat webhook capabilities for **Materna AI 2.0**.

---

## 🚀 Quick Start (Local Run)

1. Make sure **Node.js (>= 18.0.0)** is installed.
2. In the `server` folder, install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. The server serves the Materna AI 2.0 frontend while hosting the REST API!

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and service status |
| `GET` | `/api/profile` | Retrieve the active maternal health profile |
| `POST` | `/api/profile` | Save/update maternal health profile |
| `GET` | `/api/vitals` | Retrieve vitals log history (BP, Weight, Labs) |
| `POST` | `/api/vitals` | Log new biometric vital reading |
| `GET` | `/api/meds` | Retrieve scheduled medications and adherence |
| `POST` | `/api/meds` | Sync medication adherence state |
| `POST` | `/api/chat` | AI Companion message endpoint with safety filter |
| `GET` | `/api/export` | Download full clinical JSON export |

---

## ☁️ Deployment

- **Render / Railway / Heroku**: Set build command `npm install` and start command `npm start`.
- **Supabase / Firebase**: The data schemas in `server/data.json` and `js/storage.js` map 1:1 with PostgreSQL / Firestore document models.
