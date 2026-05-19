# OpenScholar — Full Project Status Report

> **Date:** May 7, 2026 | **Analyst:** Antigravity AI (Senior Full-Stack Review)

---

## 🔍 Executive Summary

Your **OpenScholar** project has a **very strong foundation**. The database schema is well-designed, the UI is premium-quality, and the folder structure correctly follows your LLD specifications. However, the project is currently a **"Beautiful Shell"** — the frontend and schema exist, but the core business logic (authentication, real data, file uploads, security) has not been wired up yet.

**My verdict: You are NOT ready to skip ahead.** You should NOT move to advanced features until Auth is working, because every other module (paper upload, admin, search) depends on knowing **who the user is**.

---

## 📊 Module-by-Module Status

### ✅ DONE — Database Schema (100%)
| Model | Status | Notes |
|-------|--------|-------|
| User, Role | ✅ Complete | All auth fields present (`passwordHash`, `isVerified`, tokens) |
| Paper, PaperVersion | ✅ Complete | Correct enums, relations, versioning structure |
| Author, PaperAuthor | ✅ Complete | Multi-author support with `displayOrder` |
| Comment, Reaction | ✅ Complete | Soft delete, parent/reply structure |
| SavedPaper | ✅ Complete | Correctly linked to User + Paper |
| ModerationLog | ✅ Complete | Admin audit trail ready |
| AnalyticsEvent | ✅ Complete | View/download tracking schema ready |
| Notification | ✅ Complete | Schema exists |
| Tag, PaperTag | ✅ Complete | Tagging system in place |

---

### ✅ DONE — Frontend / UI (90%)
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Landing Page | `/` | ✅ Complete | Hero, Stats, Featured, CTA all intact |
| Login | `/login` | ✅ UI Done | Form & validation exist, **no backend wired** |
| Register | `/register` | ✅ UI Done | Form & validation exist, **no backend wired** |
| Search | `/search` | ✅ UI Done | **Mock data only** |
| Following Feed | `/following` | ✅ UI Done | Mock data only |
| My Uploads | `/my-uploads` | ✅ UI Done | Mock data only |
| Saved Papers | `/saved` | ✅ UI Done | Mock data only |
| Profile | `/profile` | ✅ UI Done | Mock data only |
| Paper Upload | `/papers/upload` | ✅ UI Done | Multi-step flow, **no actual upload** |
| Admin Dashboard | `/admin` | ✅ UI Done | Charts visible, **buttons not wired** |
| Admin Pending | `/admin/pending` | ✅ UI Done | Modal works, **API not connected** |
| Admin Users | `/admin/users` | ✅ UI Done | Modal works, **API not connected** |

> **Missing pages:** Forgot Password, Reset Password, Email Verify, Paper Detail View, Settings page

---

### ❌ NOT DONE — Backend / API Layer (15%)
| Module | Required APIs | Implemented | Status |
|--------|--------------|-------------|--------|
| **Auth** | Register, Login, Verify Email, Forgot Password, Reset Password | ⚠️ Routes exist (UI service calls), **no `route.ts` handlers** | ❌ Critical |
| **Paper** | Create, Update, Get, Submit, Related | No `POST /api/papers` exists | ❌ Missing |
| **Search** | `GET /api/search` | ✅ Exists but returns **mock data** | ⚠️ Stub only |
| **Comments** | GET, POST, Reply | ✅ GET exists but **mock data**, POST missing | ⚠️ Partial |
| **Reactions** | POST, DELETE | ❌ Not implemented | ❌ Missing |
| **Admin – Pending** | GET pending papers | ✅ Route exists but wrong `status` enum (`PENDING` vs `pending`) | ⚠️ Bug |
| **Admin – Approve** | POST approve | ✅ Route exists, wrong `status` enum | ⚠️ Bug |
| **Admin – Reject** | POST reject | ✅ Route exists, wrong `status` enum | ⚠️ Bug |
| **Admin – Users** | GET all users | ✅ Route exists | ✅ OK |
| **Saved Papers** | POST/DELETE save | ❌ Not implemented | ❌ Missing |
| **Storage/Upload** | File upload to MinIO/S3 | ❌ Not implemented | ❌ Missing |
| **Notifications** | Trigger + fetch | ❌ Not implemented | ❌ Missing |
| **Analytics** | Track views/downloads | ❌ Not implemented | ❌ Missing |

---

### ❌ NOT DONE — Security & Middleware (0%)
| Task | Status | Notes |
|------|--------|-------|
| JWT generation & verification | ❌ Missing | `lib/auth.ts` does not exist |
| bcrypt password hashing | ❌ Missing | No register/login handler |
| Auth middleware (`middleware.ts`) | ❌ Empty | `src/middleware/` is empty |
| Route protection (RBAC) | ❌ Missing | All routes are publicly accessible |
| Admin-only route guard | ❌ Missing | `/admin` is wide open |
| CORS / rate limiting | ❌ Missing | No protection on API routes |

---

### ⚠️ BUGS & ISSUES FOUND

| # | File | Issue | Severity |
|---|------|-------|----------|
| 1 | `api/admin/papers/pending/route.ts` | Uses `"PENDING"` but enum in schema is `pending` (lowercase) | 🔴 High |
| 2 | `api/admin/papers/[id]/approve/route.ts` | Sets status to `"PUBLISHED"` — not a valid enum value (should be `approved`) | 🔴 High |
| 3 | `api/admin/papers/[id]/approve/route.ts` | References `@/lib/prisma` — your actual client is at `@/lib/db` | 🔴 High |
| 4 | `app/(auth)/login/page.tsx` | Stores JWT in `localStorage` — security risk, should use `httpOnly` cookie | 🟡 Medium |
| 5 | `app/(auth)/register/page.tsx` | Calls `/api/auth/register` — this route handler does not exist yet | 🔴 High |
| 6 | `src/middleware/` | Directory is empty — no route protection at all | 🔴 High |
| 7 | Admin APIs | No JWT/role check — any user can call admin endpoints | 🔴 Critical |
| 8 | `api/search/route.ts` | Hardcoded category ID mapping — not connected to DB categories | 🟡 Medium |
| 9 | Paper status enum | Schema uses lowercase (`pending`, `approved`) but code uses UPPERCASE | 🔴 High |

---

### ❌ Missing Files from LLD Spec

Per your `coding-standards.md` and LLD documents, these files **must exist** but are missing:

```
src/lib/auth.ts                          ← JWT helpers
src/lib/storage.ts                       ← MinIO/S3 upload

src/app/api/auth/register/route.ts       ← Auth backend
src/app/api/auth/login/route.ts
src/app/api/auth/verify/route.ts
src/app/api/auth/forgot-password/route.ts
src/app/api/auth/reset-password/route.ts

src/app/api/papers/route.ts              ← Paper CRUD
src/app/api/papers/[id]/route.ts
src/app/api/papers/[id]/submit/route.ts
src/app/api/papers/[id]/versions/route.ts

src/app/api/reactions/route.ts           ← Engagement
src/app/api/saved/route.ts               ← Save/unsave

src/modules/auth/repository.ts           ← Data layer
src/modules/paper/service.ts
src/modules/paper/repository.ts
src/modules/moderation/service.ts
src/modules/moderation/repository.ts
src/modules/engagement/service.ts
src/middleware.ts                         ← Route protection
```

---

## 🗺️ Recommended Next Steps (Priority Order)

### Phase 2A — Core Infrastructure (Do This First)

```
PRIORITY 1: Fix Critical Bugs
  ├── Fix enum casing across all admin API routes
  ├── Fix @/lib/prisma → @/lib/db import
  └── Create src/lib/auth.ts (JWT sign/verify helpers)

PRIORITY 2: Auth Module (Most Important)
  ├── POST /api/auth/register  → hash password, save user, send verify email
  ├── GET  /api/auth/verify    → verify token, set isVerified = true
  ├── POST /api/auth/login     → verify creds, return httpOnly cookie JWT
  ├── POST /api/auth/forgot-password
  └── POST /api/auth/reset-password

PRIORITY 3: Route Protection
  └── Create src/middleware.ts → protect /admin, /profile, /my-uploads, etc.
```

### Phase 2B — Core Feature APIs

```
PRIORITY 4: Paper Module
  ├── POST /api/papers         → create draft
  ├── PUT  /api/papers/[id]   → update draft
  ├── POST /api/papers/[id]/submit
  └── GET  /api/papers/[id]   → fetch with version + metrics

PRIORITY 5: Storage
  └── src/lib/storage.ts      → MinIO/S3 upload logic

PRIORITY 6: Connect UI to Real Data
  ├── Search → real DB query
  ├── My Uploads → real user papers
  ├── Saved Papers → real saved records
  └── Profile → real user data
```

### Phase 2C — Engagement & Notifications

```
PRIORITY 7: Engagement
  ├── POST/DELETE /api/reactions
  ├── POST /api/comments
  └── POST /api/comments/reply  (already GET exists)

PRIORITY 8: Notifications
  └── Trigger on: paper approved, new comment, new follower

PRIORITY 9: Analytics
  └── Track: paper views, downloads
```

### Phase 3 — Polish & Production

```
- Unit tests for Auth + Paper service
- Rate limiting on auth endpoints
- Email service (Resend/Nodemailer)
- Pagination for all list endpoints
- Error boundary components in UI
- Performance optimizations (Next.js Image, lazy loading)
```

---

## 💡 My Opinion

> You have built an impressive frontend. **But please don't move forward without finishing Auth.** Every other module (paper upload, saved papers, my uploads, admin access) is meaningless without knowing who the logged-in user is.
>
> **Start Phase 2A immediately.** Once Auth is wired up and JWT middleware protects your routes, the rest of the backend will fall into place quickly because your schema is already perfectly designed for it.

---

*Report generated by full codebase + documentation review of OpenScholar.*
