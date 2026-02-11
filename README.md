# Intelligent Faculty Performance Analytics (MERN)

Full-stack MERN application for faculty performance tracking with charts and analytics.

## Structure

- **Backend:** `faculty-analytics-backend/` — Node.js, Express, MongoDB
- **Frontend:** `faculty-analytics-frontend/` — React (Vite), Chart.js

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Backend Setup

```bash
cd faculty-analytics-backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/faculty-analytics
JWT_SECRET=your-secret-key
JWT_EXPIRES=7d
```

Start the server:

```bash
npm run dev
```

API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`

## Frontend Setup

```bash
cd faculty-analytics-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` and proxies `/api` to the backend.

## First-Time Use

1. **Register a user** (e.g. via Postman):
   - `POST http://localhost:5000/api/auth/register`
   - Body: `{ "username": "admin", "password": "admin123", "role": "ADMIN" }`

2. **Sign in** at `http://localhost:3000/login` with that user.

3. As **ADMIN** or **HOD** you can add faculty, add performance records, and view reports. **FACULTY** can view dashboard and reports.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/login | Login |
| POST   | /api/auth/register | Register |
| GET    | /api/faculty | List faculty |
| GET    | /api/faculty/:id | Get one faculty |
| POST   | /api/faculty | Add faculty (ADMIN/HOD) |
| PUT    | /api/faculty/:id | Update faculty (ADMIN/HOD) |
| DELETE | /api/faculty/:id | Delete faculty (ADMIN/HOD) |
| GET    | /api/performance/:facultyId | Get performance for faculty |
| POST   | /api/performance | Add performance (ADMIN/HOD) |
| PUT    | /api/performance/:id | Update performance (ADMIN/HOD) |
| DELETE | /api/performance/:id | Delete performance (ADMIN/HOD) |
| GET    | /api/reports | All reports |
| GET    | /api/reports/faculty/:id | Report for one faculty |

## Performance Score

- **Formula:** `totalScore = teaching×0.3 + feedback×0.25 + attendance×0.2 + research×0.15 + admin×0.1`
- **Levels:** ≥85 Excellent, ≥70 Very Good, ≥55 Good, &lt;55 Needs Improvement

## Pages

- **Login** — Sign in
- **Dashboard** — Summary and charts
- **Faculty List** — CRUD faculty (ADMIN/HOD)
- **Add/Edit Faculty** — Forms
- **Performance** — List faculty → View/Add performance per faculty
- **Reports** — Charts and tables
- **Profile** — Current user info
