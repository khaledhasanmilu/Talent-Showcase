# Talent Showcase — Backend (Express + MySQL)

Implements the 1st update scope only:

- **Auth** — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (JWT)
- **Homepage / dashboard feed** — `GET /api/talents`, `POST /api/talents`, `GET /api/leaderboard`

## Project structure

```
backend/
├── src/
│   ├── server.js              # entry point (loads config + listens)
│   ├── app.js                 # express app, middleware + route mounting
│   ├── config/
│   │   ├── env.js             # env vars (dotenv)
│   │   └── db.js              # MySQL pool (fail-fast)
│   ├── routes/                # route definitions only
│   │   ├── authRoutes.js
│   │   ├── talentRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── controllers/           # request handlers + validation
│   │   ├── authController.js
│   │   ├── talentController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authRequired
│   │   └── errorHandler.js    # 404 + fallback errors
│   └── utils/
│       ├── mappers.js         # DB row → API shape
│       └── jwt.js             # token signing
├── schema.sql                 # CREATE DATABASE talent_showcase + tables
├── seed.js / seedData.js      # demo data (npm run seed)
└── .env.example
```

## 1. Database name

```
talent_showcase
```

Create it (this also creates the `users` and `talents` tables):

```bash
mysql -u root -p < schema.sql
```

## 2. Configure

```bash
cp .env.example .env
```

Then edit `.env` with your local MySQL credentials (`DB_USER`, `DB_PASSWORD`).

## 3. Install + seed demo data

```bash
npm install
npm run seed
```

Seeded users all share the password `password123`, e.g. `rahat.ahmed@example.com`.

## 4. Run

```bash
npm run dev    # watch mode (Node 18+)
# or
npm start
```

Health check: `GET http://localhost:5000/api/health`

## API reference

| Method | Endpoint            | Auth   | Body / Query                                              |
| ------ | ------------------- | ------ | --------------------------------------------------------- |
| POST   | `/api/auth/register`| —      | `firstName, lastName, email, password, avatar?, role?, category?` |
| POST   | `/api/auth/login`   | —      | `email, password`                                         |
| GET    | `/api/auth/me`      | Bearer | —                                                         |
| GET    | `/api/talents`      | —      | `?type=video&category=Singing&search=...&limit=50`        |
| POST   | `/api/talents`      | Bearer | Publish a post → saved to MySQL (+50 score)               |
| GET    | `/api/leaderboard`  | —      | `?limit=8`                                                |

Auth responses return `{ token, user }`. The frontend stores the token in
`localStorage` (`ts_token`) and sends it as `Authorization: Bearer <token>`.
