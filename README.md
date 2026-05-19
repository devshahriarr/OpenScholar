# OpenScholar – Open-Access Research Platform

> **Last Updated:** May 19, 2026  
> **Status:** Production-Ready & Unified  
> **Version:** 1.0.0-MVP  

---

## 📖 Quick Start

👉 **Setting up OpenScholar?** Follow the step-by-step setup guide: **[📖 INSTALLATION.md](INSTALLATION.md)**

**TL;DR Setup:**
```bash
git clone <repo-url>
cd OpenScholar
npm install
# Configure your DATABASE_URL in .env.local
npx prisma db push
npm run dev  # Open http://localhost:3000
```

---

## 📊 Executive Summary

OpenScholar is a next-generation **open-access academic research publishing platform** designed to democratize research access for students, educators, and independent researchers. Built with robust role-based security, modular DDD architecture, and modern UX standards, OpenScholar supports peer-to-peer scholarly publishing, version control, and real-time dashboard analytics.

The project is now **100% Core Feature Complete** and fully unified. Legacy duplicate routes and offline fallbacks have been removed, making the platform production-ready.

---

## 🎯 Implemented Features & Core Modules

### 1. Unified Authentication & Access Control (RBAC)
* **JWT Session Guarding:** High-performance, low-latency stateless token signing and verification using standard Jose libraries.
* **Role-Based Guards:** Seamless routing isolation through `middleware.ts`. Student, Author, and Admin views are protected under specialized role tokens.
* **Security Standards:** httpOnly cookies prevent XSS vectors. Passwords are securely salted and hashed using `bcryptjs`.

### 2. Thesis Versioning & Document Storage
* **Draft Workflow:** Upload research to a personal draft library where authors edit metadata (title, abstract, department, tags) prior to submission.
* **Storage Layer:** Standardized local file uploads under isolated UUID-indexed directory paths. Built-in size validation (50MB cap) and file-type checkers (PDF only).
* **Versioning Engine:** Supports multi-versioned document listings. Only approved versions are published to the public feed.

### 3. Automated Moderation Workflow
* **Pending Moderation Queue:** Clean dashboard for admins displaying incoming research cards, featuring categories, authors, keywords, and dates.
* **Dynamic Modals:** Interactive PDF view overlay that allows admins to verify research papers and approve/reject instantly with reasons.
* **Instant Logs:** Every action creates an audit trail (`ModerationLog`) and auto-triggers a notification to the author.

### 4. Interactive Engagement & Analytics Tracking
* **Metrics Aggregator:** High-integrity Prisma transactional increments for view and download events.
* **Social Following:** Network activity feed (`FollowingFeed`) displaying updates from researchers the user follows.
* **Bookmarks & Saves:** Dynamic saving/bookmarking tool allowing users to build a personalized read library.

### 5. Live Notifications System
* **Real-Time Polling:** Low-overhead unread count polling (60s cycle) to alert users about new feedback or moderation reviews.
* **Unified UI Component:** Interactive `<NotificationBell />` shared across both dashboard and admin layout interfaces.
* **Clean History:** Specialized `/notifications` control panel allows users to view, read, and delete their notification records.

---

## 📁 System Architecture

```
src/
├── app/                      # Next.js routes (App Router)
│   ├── (auth)/               # Unauthenticated auth views
│   ├── (dashboard)/          # Authenticated user pages
│   ├── admin/                # Admin dashboards
│   └── api/                  # High-performance API endpoints
├── modules/                  # Modular Business Logic (Domain Driven)
│   ├── auth/                 # Sign-in, sign-up, verification
│   ├── paper/                # Thesis storage & draft engine
│   ├── user/                 # Profiles & settings modules
│   ├── search/               # Full-text indexing queries
│   ├── engagement/           # Comments, saves, reactions, follows
│   ├── moderation/           # Admin queues, auditing logs
│   ├── analytics/            # Views and downloads tracking
│   └── notification/         # Notification feeds
├── lib/                      # Base configurations & helpers
│   ├── db.ts                 # Prisma Client instance
│   ├── auth.ts               # Core crypt/JWT signatures
│   ├── storage.ts            # File persistence manager
│   └── mailer.ts             # Nodemailer integration
├── components/               # UI Layer
│   ├── ui/                   # Core atomic components
│   ├── admin/                # Specialized moderation templates
│   └── dashboard/            # Profile drops, navigations, bell, banners
└── types/                    # Core typescript declarations
```

---

## 🔧 Prerequisites & Setup

### Environment Variables
Create a `.env` or `.env.local` file inside the root directory:
```env
# Database Settings
DATABASE_URL="postgresql://user:password@localhost:5432/openscholar?schema=public"

# Auth Signature Key
JWT_SECRET="generate-a-secure-random-key"

# Email Delivery Configuration
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="smtp-username"
SMTP_PASS="smtp-password"
FROM_EMAIL="noreply@openscholar.edu"
```

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Start development build
npm run dev
```

---

## 📋 Success & Performance Metrics
* **Page Load Speed:** `< 1.2s` for server-side rendered pages.
* **Search Performance:** `< 400ms` for full-text search index matching.
* **Uptime Readiness:** State-less architecture enables seamless horizontal scaling.
