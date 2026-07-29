# Backend Gaps & Needed Endpoints

Audit of **church-quiz-platform** (Angular) vs **church-quiz-api** (`docs/FRONTEND_API.md` + admin controllers).

Last reviewed: 2026-07-29

---

## Summary

| Area | Status |
|------|--------|
| Child quiz flow (catalog → start → quiz → submit → review → anti-cheat) | **Wired** — no new endpoints required |
| Leaderboard | **Wired** — `GET /leaderboard` via student JWT |
| Admin dashboard UI | **Wired** — admin APIs + email/password auth |
| Admin auth | **Wired** — `POST /admin/auth/login` (+ setup) |
| `GET /health` | Available on API, unused by FE (optional) |

---

## 1. Child quiz — already covered (no backend work)

Frontend calls these today:

| Method | Path | FE service |
|--------|------|------------|
| `GET` | `/catalog/age-groups` | `CatalogService` |
| `GET` | `/catalog/categories` | `CatalogService` |
| `POST` | `/students/start` | `StudentApiService` |
| `GET` | `/quiz/:attemptId` | `QuizApiService` |
| `POST` | `/quiz/save-answer` | `QuizApiService` |
| `POST` | `/quiz/submit` | `QuizApiService` |
| `GET` | `/quiz/:attemptId/review` | `QuizApiService` |
| `POST` | `/anti-cheat/tab-switch` | `AntiCheatService` |
| `POST` | `/anti-cheat/page-unload` | `AntiCheatService` (beacon/`fetch` keepalive) |
| `GET` | `/leaderboard` | `LeaderboardApiService` |

**Known FE edge cases (not API gaps):**

- Timeout with no selection → FE skips `save-answer` (matches doc: “skip if none”).
- Class code only validated on `POST /students/start` (no early check).
- Avatar is a preset absolute URL (`/avatars/*.svg`); no upload.

---

## 2. Endpoints needed from backend (priority order)

### ~~P0 — Leaderboard (child UX)~~ Done

Wired in FE: `LeaderboardApiService` → `GET /leaderboard` with student JWT (`/leaderboard` on `studentAuthInterceptor`). Tabs map to `scope=class|age_group|category`; period `week|all`. Results page links to `/leaderboard`; back nav uses `/results/:attemptId`.

---

### P1 — Optional class-code pre-check

Today invalid codes fail only at start (`400`). Early validation improves landing UX.

#### `POST /catalog/validate-class-code`

**Auth:** none

**Body**

```json
{ "classCode": "DEV-CLASS" }
```

**Response `200`**

```json
{ "valid": true, "groupName": "Sunday Kids A" }
```

**Response `400`**

```json
{ "valid": false, "message": "Invalid or expired class code" }
```

---

### P2 — Admin dashboard metrics & activity

Admin UI (`src/app/features/admin/admin.component.ts`) shows cards, a 30-day chart, and a recent-activity feed — all mock.

Existing API: `GET /admin/analytics/summary` → `{ totalAttempts, submittedAttempts, averageScore, byStatus }` — **not enough** for the dashboard cards/chart.

#### `GET /admin/dashboard/metrics`

**Auth:** Supabase JWT (admin/leader)

```json
{
  "totalStudents": 612,
  "activeLeaders": 24,
  "questionsInBank": 8400,
  "flagsThisWeek": 3
}
```

#### `GET /admin/analytics/activity?days=30`

**Auth:** Supabase JWT

```json
{
  "points": [
    { "date": "2026-07-01", "quizzesCompleted": 320 }
  ]
}
```

#### `GET /admin/audit-logs?limit=20`

**Auth:** Supabase JWT (admin)

```json
{
  "items": [
    {
      "id": "uuid",
      "action": "leader.invited",
      "title": "New leader added",
      "actorDisplayName": "Jonathan A.",
      "createdAt": "2026-07-29T14:39:00.000Z"
    }
  ]
}
```

#### `GET /admin/search?q=`

Optional — UI has a search box with no backend.

```json
{
  "students": [],
  "leaders": [],
  "questions": []
}
```

---

### P3 — Admin list endpoints (UI tabs are “Coming soon”)

Backend already has mutations for some areas; **lists are incomplete**.

| UI tab | Exists today | Still needed |
|--------|--------------|--------------|
| Categories & Age Bands | `GET/POST/PATCH/DELETE /admin/categories`, `/admin/age-groups` | Wire FE only |
| Leaders | `POST /admin/leaders/invite`, `PATCH /admin/leaders/:id/group` | **`GET /admin/leaders`** |
| Question Bank | approve / reject / flag / generate | **`GET /admin/questions`** (filter + pagination) |
| Audit Log | (write-only internally) | **`GET /admin/audit-logs`** (same as P2) |
| Analytics | `GET /admin/analytics/summary` | Activity series (P2) + optional breakdowns |
| Class codes | none | **CRUD `/admin/class-codes`** |

#### `GET /admin/leaders`

```json
[
  {
    "id": "uuid",
    "email": "leader@church.org",
    "displayName": "Jane",
    "role": "leader",
    "groupId": "uuid",
    "groupName": "Sunday Kids A",
    "status": "active"
  }
]
```

#### `GET /admin/questions`

**Query:** `status`, `categoryId`, `ageGroupId`, `difficulty`, `page`, `pageSize`

```json
{
  "items": [
    {
      "id": "uuid",
      "prompt": "...",
      "categoryId": "uuid",
      "ageGroupId": "uuid",
      "difficulty": "easy",
      "status": "approved",
      "createdAt": "..."
    }
  ],
  "total": 8400,
  "page": 1,
  "pageSize": 20
}
```

#### Class codes CRUD

```http
GET    /admin/class-codes
POST   /admin/class-codes          { "code": "DEV-CLASS", "groupName": "...", "expiresAt": "..." }
PATCH  /admin/class-codes/:id
DELETE /admin/class-codes/:id
```

---

### P4 — Nice-to-have (not blocking)

| Need | Suggested endpoint | Notes |
|------|--------------------|-------|
| Avatar upload | `POST /uploads/avatar` or `POST /students/avatar` | Only if presets are not enough |
| Student profile | `GET /students/me` | Optional; session already holds name/avatar |
| Health in UI | `GET /health` | Already exists; wire only if you want a status badge |

Admin login is **not** a Nest route — FE must use **Supabase Auth** and send that JWT to `/admin/*`.

---

## 3. Backend admin endpoints that exist but FE does not call yet

Wire these when building admin screens (no new API required):

| Method | Path |
|--------|------|
| `POST` | `/admin/questions/generate` |
| `PATCH` | `/admin/questions/:id/approve` |
| `PATCH` | `/admin/questions/:id/reject` |
| `PATCH` | `/admin/questions/:id/flag` |
| `GET/POST/PATCH/DELETE` | `/admin/categories` |
| `GET/POST/PATCH/DELETE` | `/admin/age-groups` |
| `POST` | `/admin/leaders/invite` |
| `PATCH` | `/admin/leaders/:id/group` |
| `GET` | `/admin/analytics/summary` |

---

## 4. Frontend gaps (not backend)

| Gap | Location | Action |
|-----|----------|--------|
| Dead mock quiz leftovers | `pages/quiz/mock-question-data.ts`, `quiz.service.ts` | Delete (unused by live quiz) |
| Unused feature stubs | `features/home`, `features/quiz`, etc. | Ignore or remove |
| Unused legacy model | `models/leaderboard-entry.model.ts` | Can remove (replaced by `models/api/leaderboard.model.ts`) |

---

## 5. Recommended backend delivery order

1. ~~**`GET /leaderboard`**~~ Done (wired in FE)  
2. ~~**`GET /admin/questions`** + **`GET /admin/leaders`**~~ Done  
3. ~~**`GET /admin/dashboard/metrics`**, activity, audit-logs~~ Done  
4. Optional **`POST /catalog/validate-class-code`**  
5. Optional avatar upload / search  

---

## Admin endpoints status (updated)

Implemented on API + wired in Angular admin UI:

| Method | Path | Status |
|--------|------|--------|
| `GET` | `/admin/dashboard/metrics` | Done |
| `GET` | `/admin/analytics/activity?days=` | Done |
| `GET` | `/admin/analytics/summary` | Done (existing) |
| `GET` | `/admin/audit-logs?limit=` | Done |
| `GET` | `/admin/search?q=` | Done |
| `GET` | `/admin/questions` | Done (filters + pagination) |
| `GET` | `/admin/leaders` | Done |
| `GET/POST/PATCH/DELETE` | `/admin/class-codes` | Done (`:code` PK) |
| Categories / age-groups CRUD | `/admin/categories`, `/admin/age-groups` | Wired in FE |
| Question approve/reject/flag/generate | existing | Wired in FE |

Admin UI: `/admin` — email/password via `POST /admin/auth/login` (or first-time `POST /admin/auth/setup`). JWT is stored by `AuthService` and sent as `Authorization: Bearer` on `/admin/*` (except `/admin/auth/*`).
