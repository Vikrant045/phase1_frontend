# Phase 1 — Frontend Dashboard & Scenario Runner

A modern, responsive **Next.js (App Router)** dashboard built to showcase and test all backend endpoints and scenarios implemented in **Phase 1 (Task Management REST API)**.

Built with **Next.js 14 + React 18 + TypeScript + Lucide Icons + Vanilla CSS Design System (Dark Glassmorphism)**.

---

## 🚀 Quick Start

### 1. Start the Backend API (Port 5000)
Make sure your Phase 1 Express backend is running:
```bash
cd ../phase_1
pnpm dev
# API runs on http://localhost:5000
```

### 2. Start the Frontend App (Port 3000)
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features & Working Scenarios

### 1. Interactive Working Scenarios Runner
Dedicated 1-click test suite at the top of the dashboard for viva, interviews, and presentations:
- **Scenario 1: Full CRUD Lifecycle Flow** (`POST` → `GET /:id` → `PATCH` → `DELETE`)
  Executes an end-to-end task lifecycle, logging each step and verifying database persistence in Neon PostgreSQL.
- **Scenario 2: Server-Side Pagination, Filtering & Sorting**
  Demonstrates server `skip/take` queries with `meta: { page, limit, totalItems, totalPages, hasNext, hasPrev }`.
- **Scenario 3: Strict Zod Validation Rejection (HTTP 400)**
  Sends malformed payloads (`title < 3` chars, invalid status enum) to prove Zod catches bad input before touching the database and returns structured field errors.
- **Scenario 4: Auth Guard Middleware (401 / 403 / 200)**
  Calls `/api/v1/protected-data`:
  - Without `x-api-key` header → `401 Unauthorized`
  - With wrong header → `403 Forbidden`
  - With `x-api-key: phase1-secret-key` → `200 OK`
- **Scenario 5: Centralized 404 Route Handler**
  Proves unmatched routes gracefully return structured JSON instead of hanging or crashing.
- **Scenario 6: Health Check (`GET /health`)**
  Pings server process uptime and timestamps without DB dependency.

---

### 2. Full Task Management Dashboard
- **Create & Edit Task Modals**: Strict input bounds matching backend Zod schema (title 3–200 characters with live counter, description, priority, status, due date picker).
- **Task Detail Inspector (`GET /tasks/:id`)**: Inspects single tasks by UUID and displays both formatted fields and the raw server JSON response with a copy button.
- **Quick Status Changer**: 1-click status dropdown on every card that immediately triggers `PATCH /api/v1/tasks/:id`.
- **Search, Filter & Sort Bar**:
  - Live search across title and description
  - Status filter chips: `ALL`, `PENDING`, `IN_PROGRESS`, `COMPLETED`
  - Priority dropdown: `ALL`, `LOW`, `MEDIUM`, `HIGH`
  - Sort by: `createdAt`, `updatedAt`, `dueDate`, `priority`, `title`
  - Order toggle: `ASC` / `DESC`
  - Grid View & Table View switchers
  - Server-side pagination buttons with page indicators

---

### 3. Real-Time Network Request Inspector (API Console)
- Expandable bottom drawer that intercepts and logs every HTTP request made by the UI or scenario runner.
- Color-coded badges for HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`).
- Displays latency in milliseconds, status codes, request headers, request payload, and full server response JSON.

---

### 4. Architecture & Viva Interview Guide Modal
Integrated technical cheat-sheet covering:
- 3-tier architecture: Middleware chain → Router → Controller → Service → Prisma → Neon DB
- Express 5 automatic promise rejection handling
- Why validate in middleware vs controllers
- Dual connection strings (`DATABASE_URL` pooler vs `DIRECT_URL` migrations)

---

## 📁 Simple & Clean Project Structure

```
phase_1_frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system & dark glassmorphism
│   │   ├── layout.tsx           # Root HTML layout & fonts
│   │   └── page.tsx             # Main dashboard assembling all components
│   ├── components/
│   │   ├── Header.tsx           # Top navigation & backend health status
│   │   ├── StatsBar.tsx         # Metric overview cards
│   │   ├── TaskCard.tsx         # Modern interactive task cards
│   │   ├── TaskModal.tsx        # Create & edit modal with validation
│   │   ├── TaskDetailModal.tsx  # Inspect single task & raw API JSON
│   │   ├── ScenarioShowcase.tsx # Viva / Demo 1-click scenario test runner
│   │   ├── ApiConsole.tsx       # Live HTTP request/response inspector drawer
│   │   └── VivaDocsModal.tsx    # Architecture & Viva interview questions
│   ├── lib/
│   │   ├── api.ts               # Universal typed API client & log subscriber
│   │   └── mockData.ts          # Preview fallback when backend is offline
│   └── types/
│       └── task.ts              # TypeScript models matching backend DTOs
├── .env.local                   # NEXT_PUBLIC_API_URL=http://localhost:5000
├── package.json
└── tsconfig.json
```
