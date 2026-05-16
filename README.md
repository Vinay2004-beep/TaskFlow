# Team Task Manager

Production-ready Trello/Asana-style team task manager built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, ShadCN-style UI, React Hook Form, Zod, Axios, Recharts, Express, Prisma, PostgreSQL, JWT refresh tokens, Socket.IO, Docker, and Railway-ready config.

## 1. Project Architecture

The project is a monorepo with two independently deployable apps:

- `frontend`: Next.js 15 App Router SaaS UI with landing page, auth, projects, Kanban, dashboard charts, profile, notifications, dark mode, and responsive design.
- `backend`: Express TypeScript REST API with Prisma/PostgreSQL, JWT access and refresh tokens, bcrypt passwords, role middleware, validation, activity logs, notifications, email invitations, and Socket.IO.
- `docker-compose.yml`: local PostgreSQL plus optional full-stack containers.

## 2. Folder Structure

```txt
team-task-manager/
  backend/
    prisma/schema.prisma
    prisma/seed.ts
    src/config
    src/controllers
    src/middleware
    src/routes
    src/services
    src/socket
    src/types
    src/utils
  frontend/
    app
    components
    hooks
    lib
    services
    store
    types
```

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## 4. Backend Code

Important files:

- `backend/src/server.ts`: HTTP and Socket.IO server.
- `backend/src/app.ts`: API routing and middleware.
- `backend/src/middleware/auth.middleware.ts`: protected routes and role checks.
- `backend/src/services/auth.service.ts`: signup, login, refresh, logout.
- `backend/src/services/task.service.ts`: admin task CRUD and member status updates.
- `backend/src/services/project.service.ts`: projects, members, invitations.

## 5. Prisma Schema

`backend/prisma/schema.prisma` includes `User`, `Project`, `ProjectMember`, `Task`, `RefreshToken`, `ActivityLog`, and `Notification`, with cascade deletion, indexes, timestamps, and enums for roles, status, and priority.

## 6. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 7. Frontend Code

Important files:

- `frontend/app/page.tsx`: modern landing page.
- `frontend/components/forms/auth-form.tsx`: login/signup with React Hook Form and Zod.
- `frontend/app/(workspace)/dashboard/page.tsx`: project list and creation.
- `frontend/app/(workspace)/projects/[projectId]/page.tsx`: project workspace.
- `frontend/components/kanban/kanban-board.tsx`: drag-and-drop Kanban.
- `frontend/components/dashboard/charts.tsx`: Recharts analytics.
- `frontend/services/api.ts`: Axios API client with refresh-token retry.

## 8. API Integration

Default local endpoints:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`

Auth stores secure HTTP-only cookies and mirrors tokens in `localStorage` so Axios and Socket.IO can authenticate in local development.

## 9. Deployment Steps

1. Push this repo to GitHub.
2. Create a Railway PostgreSQL database.
3. Create a Railway backend service from `/backend`.
4. Create a Railway frontend service from `/frontend`.
5. Set backend environment variables.
6. Set frontend environment variables to point at the deployed backend.
7. Run migrations on backend deploy with `npx prisma migrate deploy`.

## 10. Environment Variables

Backend:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=long-random-secret
JWT_REFRESH_SECRET=another-long-random-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN_DAYS=7
CLIENT_URL=https://your-frontend.up.railway.app
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Team Task Manager <no-reply@example.com>"
```

Frontend:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.up.railway.app
```

## 11. Railway Deployment

Backend Railway settings:

- Root directory: `backend`
- Builder: Dockerfile
- Start command: `npx prisma migrate deploy && node dist/src/server.js`
- Add PostgreSQL plugin and copy `DATABASE_URL`.

Frontend Railway settings:

- Root directory: `frontend`
- Builder: Dockerfile
- Start command: `npm start`
- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`.

After first backend deploy, seed demo data if required:

```bash
railway run npm run seed
```

## 12. Testing Instructions

Local full setup:

```bash
docker compose up -d postgres
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Demo login:

```txt
admin@example.com
Password123!
```

API smoke tests:

```bash
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"Password123!\"}"
```

## 13. Final Checklist

- Signup, login, logout, refresh tokens.
- Protected routes and role-based permissions.
- Project creation, member add/remove, admin badge.
- Task CRUD, assignment, filters, search, sort, overdue highlight.
- Member-only assigned task status updates.
- Drag-and-drop Kanban board.
- Analytics dashboard with Recharts.
- Activity logs, notifications, profile, avatar URL, Socket.IO updates.
- Docker and Railway deployment files.
- Seed script and demo users.

## Beginner-Friendly Explanation

The backend is the brain: it checks users, stores projects and tasks in PostgreSQL, and protects admin-only actions. Prisma is the database toolkit. The frontend is the product UI: it calls the backend with Axios, shows projects and tasks, and updates the board in real time.

## Common Errors and Fixes

- `DATABASE_URL is missing`: copy `backend/.env.example` to `backend/.env`.
- `P1001 cannot reach database`: start PostgreSQL with `docker compose up -d postgres`.
- `JWT secret too short`: use at least 24 characters.
- CORS error in browser: set backend `CLIENT_URL` to the exact frontend URL.
- Railway frontend cannot reach API: set `NEXT_PUBLIC_API_URL` to the deployed backend URL ending in `/api`.

## How to Submit Assignment

Submit the GitHub repository link, Railway frontend URL, Railway backend health URL, demo credentials, and mention that the seed script creates demo data.
