# Talent Showcase

A web platform for discovering, voting, and sharing audio, video, and text talents.

```
talent-showcase/
├── frontend/   # React + TypeScript + Vite + Tailwind (login, registration, homepage)
└── backend/    # Express + MySQL API (auth + homepage feed)
```

**1st update scope:** login, registration, and dashboard (homepage feed) synced with the backend.

## Prerequisites

- Node.js 18+
- MySQL 8+ running locally

## 1. Database — name: `talent_showcase`

Create the database + tables:

```bash
mysql -u root -p < backend/schema.sql
```

## 2. Backend (Express + MySQL)

```bash
cd backend
cp .env.example .env        # then set DB_USER / DB_PASSWORD
npm install
npm run seed                # demo users (password: password123) + talents
npm run dev                 # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 3. Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env        # optional; dev proxy forwards /api to localhost:5000
npm install
npm run dev                 # http://localhost:3000
```

Login or register in the UI — the session (JWT in `localStorage`) persists
across reloads, and the homepage feed + leaderboard load from MySQL.
If the backend is offline, the UI falls back to built-in mock data.

## API (1st update)

| Method | Endpoint             | Auth   | Description                          |
| ------ | -------------------- | ------ | ------------------------------------ |
| POST   | `/api/auth/register` | —      | Register (firstName, lastName, email, password, avatar, role, category) |
| POST   | `/api/auth/login`    | —      | Login (email, password) → `{ token, user }` |
| GET    | `/api/auth/me`       | Bearer | Current session user                 |
| GET    | `/api/talents`       | —      | Homepage feed (`?type=&category=&search=&limit=`) |
| POST   | `/api/talents`       | Bearer | Publish a post → saved to MySQL (+50 score) |
| GET    | `/api/leaderboard`   | —      | Dashboard sidebar (`?limit=8`)       |
