# Coding Standards – OpenScholar

Version: 2.0  
Scope: Frontend + Backend  

---

# 1. Purpose

This document defines coding standards to ensure:

- Consistency
- Maintainability
- Scalability
- Readability
- Security

All contributors and AI tools must follow this document strictly.

---

# 2. General Principles

- Follow DRY (Don’t Repeat Yourself)
- Follow SOLID principles
- Prefer simplicity over complexity
- Write clean and readable code
- Avoid premature optimization
- Do not use hardcoded values

---

# 3. Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- Database: PostgreSQL
- ORM: Prisma

---

# 4. Naming Conventions

## Variables
- Use camelCase
- Must be meaningful

Example:
userEmail
paperTitle
isAuthenticated

---

## Functions
- Use camelCase
- Must describe action (verb-based)

Example:
createUser()
getPaperList()
validateInput()

---

## Components
- Use PascalCase

Example:
UserCard
PaperList
Navbar

---

## Files & Folders
- Use kebab-case

Example:
user-service.ts
paper-controller.ts
auth-middleware.ts

---

## Constants
- Use UPPER_SNAKE_CASE

Example:
MAX_FILE_SIZE
API_TIMEOUT

---

# 5. Project Structure

src/
 ├── app/                 # Next.js routes (UI + API)
 │   ├── api/
 │   │   ├── auth/
 │   │   ├── papers/
 │   │   ├── search/
 │   │   ├── comments/
 │   │   ├── reactions/
 │   │   └── admin/
 │
 ├── modules/             # 🔥 BUSINESS LOGIC (future NestJS ready)
 │   ├── auth/
 │   │   ├── service.ts
 │   │   ├── repository.ts
 │   │
 │   ├── paper/
 │   ├── user/
 │   ├── search/
 │   ├── engagement/
 │   ├── moderation/
 │   ├── analytics/
 │   └── notification/
 │
 ├── lib/
 │   ├── db.ts           # DB connection
 │   ├── storage.ts      # MinIO/S3 logic
 │   ├── auth.ts         # JWT/session
 │
 ├── types/
 └── utils/

---

# 6. TypeScript Rules

- Strict mode must be enabled
- Avoid using `any`
- Use proper types/interfaces

Example:

type User = {
  id: string
  email: string
}

---

# 7. Code Formatting

- Use Prettier
- Use ESLint
- Max line length: 100 characters
- Use 2 spaces indentation

---

# 8. Functions and Logic

- Functions must be small and single-purpose
- Avoid deep nesting
- Max function length: ~30 lines

Bad:
if (a) {
  if (b) {
    if (c) {
    }
  }
}

Good:
if (!isValid()) return
processData()

---

# 9. API Standards

## REST Rules

- GET → fetch data
- POST → create
- PUT/PATCH → update
- DELETE → remove

---

## Endpoint Naming

/api/users  
/api/papers  
/api/auth/login  

---

## Response Format

{
  "success": true,
  "data": {},
  "message": "Success"
}

---

# 10. Database Standards

- Use Prisma ORM
- Use UUID as primary key
- Normalize data
- Add indexes where necessary

---

# 11. Frontend Standards

- Use reusable components
- Follow design system strictly
- Avoid inline styles
- Keep UI minimal and consistent

---

# 12. State Management

- Use React hooks
- Avoid unnecessary global state
- Keep state minimal

---

# 13. Error Handling

- Always handle errors
- Do not expose sensitive data
- Use centralized error handler

---

# 14. Logging

- Use structured logging
- Do not log sensitive data

---

# 15. Performance

- Use pagination
- Lazy load components
- Optimize images
- Avoid unnecessary re-renders

---

# 16. Testing

- Write unit tests for core logic
- Use Playwright for E2E testing
- Cover critical flows

---

# 17. Git Standards

## Branch Naming

feature/auth-login  
fix/search-bug  
refactor/user-module  

---

## Commit Messages

feat: add login  
fix: resolve upload bug  
refactor: improve API  

---

# 18. Code Review

- No direct push to main
- All PR must be reviewed
- Tests must pass before merge

---

# 19. Documentation

- Document APIs
- Comment complex logic
- Keep README updated

---

# 20. Prohibited Practices

- No hardcoded secrets
- No duplicate code
- No unused variables
- No console logs in production
- No insecure logic

---

# Final Note

All contributors and AI tools must follow these standards strictly.
Non-compliance may result in rejection of code.